import json
import os
from typing import Dict, Any, List

import requests

API_KEY = os.environ.get('TRELLO_API_KEY')
API_TOKEN = os.environ.get('TRELLO_API_TOKEN')

class TrelloAPIClient:
    BASE_URL = "https://api.trello.com/1"

    def __init__(self, endpoint: str):
        self._base_url = f"{self.BASE_URL}/{endpoint}"

    def _make_request(self, method: str, endpoint: str, headers: Dict[str, str] = None, params: Dict[str, Any] = None, json_data: Dict[str, Any] = None) -> Any:
        default_headers = {"Accept": "application/json"}
        default_params = {'key': API_KEY, 'token': API_TOKEN}

        headers = {**default_headers, **(headers or {})}
        params = {**default_params, **(params or {})}

        url = f"{self._base_url}/{endpoint}".rstrip('/')

        response = requests.request(
            method,
            url,
            headers=headers,
            params=params,
            json=json_data
        )

        if response.status_code != 200:
            raise RuntimeError(f"Request to Trello API failed with status code {response.status_code}.")

        return json.loads(response.text) if response.text else None

class TrelloList(TrelloAPIClient):
    def __init__(self, list_id: str):
        super().__init__(f"lists/{list_id}")

    def get_cards(self, limit: int = 1000) -> List[Dict[str, Any]]:
        return self._make_request("GET", "cards", params={'limit': limit})

class TrelloCard(TrelloAPIClient):
    def __init__(self, card_id: str):
        super().__init__(f"cards/{card_id}")

    def update_card(self, **kwargs) -> Dict[str, Any]:
        return self._make_request("PUT", "", json_data=kwargs)

    def get_actions(self, filter: List[str], limit: int = 1000) -> List[Dict[str, Any]]:
        return self._make_request("GET", "actions", params={'limit': limit, 'filter': ','.join(filter)})

    def get_attachments(self) -> List[Dict[str, Any]]:
        return self._make_request("GET", "attachments")

    def download_attachment(self, attachment_id: str, attachment_file_name: str) -> bytes:
        headers = {
            'Authorization': f'OAuth oauth_consumer_key="{API_KEY}", oauth_token="{API_TOKEN}"'
        }
        response = requests.get(
            f"{self._base_url}/attachments/{attachment_id}/download/{attachment_file_name}",
            headers=headers,
        )
        if response.status_code != 200:
            raise RuntimeError(f"Request to Trello API failed with status code {response.status_code}.")
        return response.content