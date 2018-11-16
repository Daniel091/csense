import requests
from requests.auth import HTTPDigestAuth
import json
#import Test
#collection of experimental commands. 
IPaddress = "131.159.198.85"
#IPaddress =  "169.254.10.94"
url = 'http://' + IPaddress + '/api'
response = requests.post(url)
print (response.status_code)
if(response.ok):
    data = response.json()
    print(data["success"]["username"])
    
#if(response.ok):

#response = requests.get(url,auth=HTTPDigestAuth(raw_input("username: "), raw_input("Password: ")), verify=True)
#jData = json.loads(response.content)

#print("The response contains {0} properties".format(len(jData)))
#print("\n")
#for key in jData:
#    print (key + " : " + jData[key])

#apikey aka username. The way to get it is still not implemented in py

#username = "CSense"

#url = 'http://' + IPaddress + '/api/' + username + '/lights/2'
#response = requests.get(url)
#print (response.json())
#print (response.status_code)
#print (response.content)
#data = response.json()#

#print(data["state"]["bri"])
#print(data["manufacturername"])
#mn = data["manufacturername"]
#print(mn)
#print(data["name"])
#print(data["type"])

# for todo_item in response.json():
#     print(todo_item['etag'], todo_item['state'])

#url = 'http://' + IPaddress + '/api/' + username + '/lights/2/state'
#data = '''{ "bri": 100 }'''
#response = requests.put(url, data=data)
#print (response.json())#

#data = '''{"xy": [0.1, 0.1]}'''
#response = requests.put(url, data = data)
#print(response.json())

#print(Test.x)
