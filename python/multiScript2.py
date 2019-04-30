#Note demo scripts have limited or no error detection and use
#timers to wait for events. They assume everything works ok
#www.steves-internet-guide.com
#contact steve@steves-internet-guide.com
#uses websockets publish-subscribe and receive message
import paho.mqtt.client as paho
import time
import websocket
import jwt
import threading
import sys
import json

broker="localhost"
port= 9001
sub_topic="cms"
containerId=""
containerName=""
rollingSecret=""
url=""

def main(arg1):
   # JWT Token
   #key='mySecretKey327a89b42cf9b9fb2d6eeb8f0dac1540440b10da34c7789737b67bad0d729d46'
   #data={'sub': '1234567890','name': 'John Doe','exp': 1548857731}
   #token = jwt.encode(data, key, algorithm='HS256').decode('utf-8')

   def on_subscribe(client, userdata, mid, granted_qos):   #create function for callback
      print("subscribed with qos",granted_qos, "\n")
      pass
   def on_message(client, userdata, message):
    #receivedMessage = json.loads(str(message.payload.decode("utf-8")))
    #containerName = receivedMessage["containerName"]
    #containerId = receivedMessage["containerId"]
    #rollingSecret = receivedMessage["rollingSecret"]
    #url = receivedMessage["url"]
    #print(containerName + " " + containerId + " " + rollingSecret + " " + url)


      print("message received  "  ,str(message.payload.decode("utf-8")))
      print(" ")
      ws.send(str(message.payload.decode("utf-8")))
   def on_publish(client,userdata,mid):   #create function for callback
      print("data published mid=",mid, "\n")
      print(" ")
      pass
   def on_disconnect(client, userdata, rc):
      print("client disconnected ok") 
  
  
   receivedMessage = json.loads(arg1)
   secret = receivedMessage["secret"]
   containerName = receivedMessage["containerName"]
   containerId = receivedMessage["containerId"]
   print(secret)
   print(containerName)
   print(containerId)
   print(type(secret))

      # JWT Token
   key=secret+containerId
   print(key)
   data={'sub': '1234567890','name': 'John Doe','exp': 1557002934}
   token = jwt.encode(data, key, algorithm='HS256').decode('utf-8')


   # WebSocket
   ws=websocket.WebSocketApp(containerName, header={'Authorization: Bearer '+ token}, on_message=on_message);

   # WebSocket Thread to execute run_forever()
   wst = threading.Thread(target=ws.run_forever)
   wst.daemon = True
   wst.start()

   #Create client object
   client= paho.Client("client-socks",transport='websockets')       

   client.on_subscribe = on_subscribe    #assign function to callback
   client.on_publish = on_publish        #assign function to callback
   client.on_message = on_message        #assign function to callback
   client.on_disconnect = on_disconnect

   print("Connecting to Broker ",broker,"on port ",port)
   client.connect(broker,port)           #establish connection
   print("Subscribing to ",sub_topic)
   client.subscribe(sub_topic)

   while True:
      client.loop_start()                 #start loop
      time.sleep(2)
      client.loop_stop()  
      #client.disconnect()


if __name__ == "__main__":
    sys.exit(main(sys.argv))


