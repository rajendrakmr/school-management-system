###################
# Author: Rajendra 
# Date :19/08/2025
# Desc: For react js
##########################3
FROM node:20 AS builder 

# working directory
WORKDIR /app

# copy dependency file
COPY package*.json ./

# install all required depency
RUN  npm  ci --legacy-peer-deps

# copy rest of source code
COPY . ./
 
# make a build file
RUN  npm  run build --production

############################
# Stage : 2 for multi stage
#########################
FROM nginx:stable-alpine AS deployer

# delete all file if exist
RUN rm -rf /usr/share/nginx/html/*
# make directory separted
WORKDIR /app

# Copy all file builder stage to small.
COPY --from=builder /app/build /usr/share/nginx/html
# COPY nginx.conf /etc/nginx/nginx.conf
 
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]