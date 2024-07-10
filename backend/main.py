import os
import requests
import json

webhook_url = "https://webhook.site/fc519842-663c-4246-9195-4b4f1ee65a77"
data = { 'name': 'DevOps Journey', 
         'Channel URL': 'https://www.youtube.com/channel/UC4Snw5yrSDMXys31I18U3gg', 
         'Test String': os.environ.get('TEST_STRING')}
r = requests.post(webhook_url, data=json.dumps(data), headers={'Content-Type': 'application/json'})