#!/bin/bash

echo " "
echo "## Get Updates"
sudo apt-get update

echo " "
echo '## Install Node.js'
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
sudo apt-get install -y nodejs

echo " "
echo "## Setup the Repository (Docker CE)"
echo "=> Update the apt package index"
sudo apt-get update
echo "=> Install packages to allow apt to use a repository over HTTPS:"
sudo apt-get install \
    apt-transport-https \
    ca-certificates \
    curl \
    software-properties-common
echo "=> Add Docker’s official GPG key:"
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
echo "=> Set up the stable repository"
sudo add-apt-repository \
   "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
   $(lsb_release -cs) \
   stable"

echo " "
echo "## Install Docker CE"
echo "=> Update the apt package index"
sudo apt-get update
echo "=> Install the latest version of Docker CE"
sudo apt-get install -y docker-ce
DOCKER=$(docker --version)
echo $DOCKER

echo " "
echo "## Install Docker Compose"
echo "=> Download the latest version of Docker Compose:"
sudo curl -L https://github.com/docker/compose/releases/download/1.22.0/docker-compose-$(uname -s)-$(uname -m) -o /usr/local/bin/docker-compose
echo "=> Apply executable permissions to the binary:"
sudo chmod +x /usr/local/bin/docker-compose
DOCKER_COMPOSE=$(docker-compose --version)
echo $DOCKER_COMPOSE

echo " "
echo "## Set EC2 IP in .env file for Docker Compose"
IP=$(curl http://169.254.169.254/latest/meta-data/public-ipv4) 
$(echo "IP="$IP > .env)

##sudo groupadd docker
##$ sudo usermod -aG docker $USER