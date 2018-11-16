import requests
from requests.auth import HTTPDigestAuth
import json
IPaddress = "131.159.198.85"

data = {'devicetype': 'my app'}

print(json.dumps(data))

url = 'http://' + IPaddress + '/api'

response = requests.post(url, data = json.dumps(data))

print (response.status_code)

if(response.ok):
    data = response.json()
    print(data)

# will return [{'success': {'username': 'FA9119AFBC'}}]
# As it turns out the data you pass is very important
