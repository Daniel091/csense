import requests
from requests.auth import HTTPDigestAuth
import json

IP = "131.159.198.85"
API_KEY = "FA9119AFBC"


# will return [{'success': {'username': 'FA9119AFBC'}}]
# As it turns out the data you pass is very important
def get_api():
    data = {'devicetype': 'my app'}
    url = 'http://' + IP + '/api'

    response = requests.post(url, data=json.dumps(data))

    print(response.status_code)

    if response.ok:
        data = response.json()
        print(data)


# GET Request to /api/<apikey>/lights
def get_all_lights():
    url = 'http://' + IP + '/api/' + API_KEY + '/lights'
    response = requests.get(url)
    if response.ok:
        print("Response Okay")
        data = response.json()
        print(data)


# GET Request to /api/<apikey>/groups
def get_all_groups():
    url = 'http://' + IP + '/api/' + API_KEY + '/groups'
    response = requests.get(url)
    if response.ok:
        print("Response Okay")
        data = json.loads(response.content)
        print(data)

        for group in data:
            print(group['id'])


# get_all_lights()
get_all_groups()
