# Official Openresty Alpine Image
# LuaRocks is included in the alpine-fat image
FROM openresty/openresty:alpine-fat

RUN apk update && apk add  nano && apk add openrc --no-cache

## Change current working directory inside the container
WORKDIR /etc/nginx

## Copy the tar file containing nginx-jwt.lua file for JWT Authentication
COPY nginx-jwt.tar.gz nginx-jwt.tar.gz

## Unzip the compressed folder
RUN tar -xvzf nginx-jwt.tar.gz && rm -rfv nginx-jwt.tar.gz

CMD ["nginx", "-g", "daemon off;"]
