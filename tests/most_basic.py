import requests
from requests.auth import HTTPDigestAuth
import json

IP = "131.159.198.85"
API_KEY = "FA9119AFBC"


# will return [{'success': {'username': 'FA9119AFBC'}}]
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
            group_dict = data[group]


# gets id for group_name
def get_group_id(group_name):
    url = 'http://' + IP + '/api/' + API_KEY + '/groups'
    res = requests.get(url)

    if res.ok:
        data = json.loads(res.content)
        for group in data:
            group_dict = data[group]
            if group_dict['name'] == group_name:
                return group_dict['id']

    return None


# PUT /api/<apikey>/groups/<id>/action
def set_group_state(group_id, **kwargs):
    url = 'http://' + IP + '/api/' + API_KEY + '/groups/' + group_id + '/action'

    res = requests.put(url, data=json.dumps(kwargs))
    return res.ok


# get_all_lights()
# get_all_groups()
group_id = get_group_id('Stockwerk 31')
print(group_id)
set_group_state(group_id, toggle=True, bri=129)
