import os
import requests
import json

webhook_url = "https://webhook.site/786b3bdb-ef2b-45c8-b654-90f87c8e5165"
data = { 'name': 'DevOps Journey', 
         'Channel URL': 'https://www.youtube.com/channel/UC4Snw5yrSDMXys31I18U3gg', 
         'Test String': os.environ.get('TEST_STRING')}
r = requests.post(webhook_url, data=json.dumps(data), headers={'Content-Type': 'application/json'})

def run():
    pass

if __name__ == '__main__':
    run()