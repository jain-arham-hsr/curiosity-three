import json
import os

import requests

API_KEY = os.environ.get('TRELLO_API_KEY')
API_TOKEN = os.environ.get('TRELLO_API_TOKEN')

class TrelloList:

    def __init__(self, list_id):
        self._base_url = "https://api.trello.com/1/lists/" + list_id

    def get_cards(self):
        headers = {
            "Accept": "application/json"
        }
        params = {
            'key': API_KEY,
            'token': API_TOKEN
        }
        response = requests.request(
            "GET",
            self._base_url + "/cards",
            headers=headers,
            params=params
        )
        return json.loads(response.text)

class TrelloCard:

    def __init__(self, card_id):
        self._base_url = "https://api.trello.com/1/cards/" + card_id
    
    def update_card(self, **kwargs):
        headers = {
            "Accept": "application/json"
        }
        params = {
            'key': API_KEY,
            'token': API_TOKEN,
            **kwargs
        }
        response = requests.request(
            "PUT",
            self._base_url,
            headers=headers,
            json=params
        )
        return response.text

    def get_actions(self, filter:TrelloList):
        headers = {
            "Accept": "application/json"
        }
        params = {
            'key': API_KEY,
            'token': API_TOKEN,
            'filter': filter
        }
        response = requests.request(
            "GET",
            self._base_url + "/actions",
            headers=headers,
            params=params
        )
        return json.loads(response.text)
    
    def get_attachments(self):
        headers = {
            "Accept": "application/json"
        }
        params = {
            'key': API_KEY,
            'token': API_TOKEN
        }
        response = requests.request(
            "GET",
            self._base_url + "/attachments",
            headers=headers,
            params=params
        )
        return json.loads(response.text)
    
    def download_attachment(self, attachment_id, attachment_file_name):
        headers = {
            'Authorization': f'OAuth oauth_consumer_key="{API_KEY}", oauth_token="{API_TOKEN}"'
        }
        response = requests.request(
            "GET",
            self._base_url + f"/attachments/{attachment_id}/download/{attachment_file_name}",
            headers=headers,
        )
        return response.content