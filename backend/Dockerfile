###################
# Author: Rajendra 
# Date :19/08/2025
##########################3
FROM node:20 AS builder 

# working directory
WORKDIR /app

# copy dependency file
COPY package*.json ./

# install all required depency
RUN  npm  ci

# copy rest of source code
COPY . ./

############################
# Stage : 2 for multi stage
#########################
FROM node:20-alpine AS deployer

# Install curl for healthcheck
RUN apk add --no-cache curl

# make directory separted
WORKDIR /app

# Copy all file builder stage to small.
COPY --from=builder /app /app 

EXPOSE 5000

CMD [ "node","index.js" ]
