#!/bin/bash

echo "===> Stopping Containers"
docker stop $(docker ps -a -q)

echo " " 
echo "===> Deleting Container"
docker rm -f $(docker ps -a -q)

echo " "
echo "===> Deleting Images"
docker rmi -f $(docker images -q)




