import multiScript2
import paho.mqtt.client as paho
import time
import websocket
import json

broker="localhost"
#port= 80
port=1883
sub_topic="contDetails"


client= paho.Client("paho-client-cont")


def on_subscribe(client, userdata, mid, granted_qos):   #create function for callback
   print("subscribed with qos",granted_qos, "\n")
   pass
def on_message(client, userdata, message):
   print("message received  "  ,str(message.payload.decode("utf-8")))
   print(" ")
   multiScript2.main(str(message.payload.decode("utf-8")))
def on_publish(client,userdata,mid):   #create function for callback
   print("data published mid=",mid, "\n")
   print(" ")
   pass
def on_disconnect(client, userdata, rc):
   print("client disconnected ok") 


client.on_subscribe = on_subscribe    #assign function to callback
client.on_publish = on_publish        #assign function to callback
client.on_message = on_message        #assign function to callback
client.on_disconnect = on_disconnect

print("multiScript1 connecting to broker ",broker,"on port ",port)
client.connect(broker,port)           #establish connection
print("multiScript1 subscribing to ",sub_topic)
client.subscribe(sub_topic)
client.loop_start()
while True:
 time.sleep(2)
#client.disconnect()
