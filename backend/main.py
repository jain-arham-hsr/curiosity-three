from firebase_client import FirebaseClient
from trello_client import TrelloList, TrelloCard
from dateutil import parser

from collections import defaultdict
import re
from typing import List, Dict, Tuple, Union

from datetime import datetime, timezone

firebase_client = FirebaseClient()

TRELLO_ANSWERED_LIST_ID = "660b9a8dea0561d699541b70"
LAST_EXEC_DATE = parser.isoparse(firebase_client.db_read('lastExec'))

SUPPORTED_CARD_BG_COLORS = {'pink', 'yellow', 'lime', 'blue', 'black', 'orange', 'red', 'purple', 'sky', 'green'}
SUPPORTED_CARD_TEXT_COLORS = {'dark', 'light'}

def format_date(date_obj):
    return date_obj.strftime(r"%B %d, %Y")

def is_card_updated(card):
    date_last_activity = parser.isoparse(card['dateLastActivity'])
    return date_last_activity >= LAST_EXEC_DATE

def update_last_exec_date():
    current_time = datetime.now(timezone.utc).isoformat()
    firebase_client.db_write('lastExec', current_time)

def highlight_card(card_id, highlight_color, text_color):
    if not all(color in supported for color, supported in [
        (highlight_color, SUPPORTED_CARD_BG_COLORS),
        (text_color, SUPPORTED_CARD_TEXT_COLORS)
    ]):
        raise ValueError("Invalid color choice")
    TrelloCard(card_id).update_card(cover={
        'color': highlight_color,
        'brightness': text_color,
        'size': 'full'
    })

def delete_removed_questions(answered_cards):
    card_ids = [card['id'] for card in answered_cards]
    keys = firebase_client.db_read('questions').keys()
    [firebase_client.db_delete(key) for key in set(keys) - set(card_ids)]

def parse_answer(answer: str) -> str:
    return answer.strip()

def parse_citation(paraphrase: str, source: str) -> Dict[str, Union[str, List[str]]]:
    source_text = source[7:].strip()
    numbered_sources = re.findall(r'^\d+\.\s(.+)$', source_text, re.MULTILINE)
    sources = numbered_sources if numbered_sources else [source_text]
    return {"paraphrase": paraphrase.strip(), "sources": sources}

def process_comments(card_id, card_comments: List[str]) -> Tuple[Union[str, None], List[Dict]]:
    categories = defaultdict(list)
    
    for comment in card_comments:
        comment_text = comment['data']['text']
        parts = re.split(r'(?:\=|\-|\*){3,}', comment_text)
        if len(parts) != 2:
            highlight_card(card_id, highlight_color="orange", text_color="dark")
            continue
        
        part0, part1 = parts[0].strip(), parts[1].strip()

        if part0.lower() == "### answer summary":
            categories["Answer"].append(parse_answer(part1))
        elif part1.lower().startswith("source:"):
            categories["Citation"].append(parse_citation(part0, part1))
        else:
            highlight_card(card_id, highlight_color="orange", text_color="dark")
            continue

    return categories["Answer"][-1] if categories["Answer"] else None, categories["Citation"]

def process_attachments(card_id, card_attachments):
    card = TrelloCard(card_id)
    return [
        firebase_client.upload_file(
            card.download_attachment(att['id'], att['name']),
            att['fileName'],
            att['mimeType']
        )
        for att in card_attachments
    ]

def update_question(card):
    card_id = card['id']
    card_comments = TrelloCard(card_id).get_actions(filter=['commentCard'])
    card_attachments = TrelloCard(card_id).get_attachments()
    answer, citations = process_comments(card_id, card_comments)
    attachment_links = process_attachments(card_id, card_attachments)
    question = {
        'date_asked': format_date(datetime.fromtimestamp(int(card_id[0:8],16))),
        'last_updated': format_date(parser.isoparse(card['dateLastActivity'])),
        'title': card['name'],
        'desc': card['desc'],
        'answer': answer,
        'citations': citations,
        'attachments': attachment_links
    }
    firebase_client.db_write(f'data/{card_id}', question)

def run():
    TRELLO_ANSWERED_CARDS = TrelloList(TRELLO_ANSWERED_LIST_ID).get_cards()
    delete_removed_questions(TRELLO_ANSWERED_CARDS)
    for card in TRELLO_ANSWERED_CARDS:
        if is_card_updated(card):
            update_question(card)

if __name__ == '__main__':
    run()