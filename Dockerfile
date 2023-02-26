#Docker image for Fragments Microservice

# Use node version 18.14-alpine
FROM node:18.14-alpine@sha256:fdbd2737cb94e25cae3db9fc5d7dc073c9675dad34239bfb3948c499a6908c19 AS dependencies

LABEL maintainer="Eddie Ng <eng42@myseneca.ca>"
LABEL description="Fragments node.js microservice"

# We default to use port 8080 in our service
ENV PORT=8080

# Reduce npm spam when installing within Docker
# https://docs.npmjs.com/cli/v8/using-npm/config#loglevel
ENV NPM_CONFIG_LOGLEVEL=warn

# Disable colour when run inside Docker
# https://docs.npmjs.com/cli/v8/using-npm/config#color
ENV NPM_CONFIG_COLOR=false

# Use /app as our working directory
WORKDIR /app

# Copy the package.json and package-lock.json files into /app
COPY --chown=node:node package*.json /app/

# Install node dependencies defined in package-lock.json
RUN npm install

##############################################################

FROM node:18.14-alpine@sha256:fdbd2737cb94e25cae3db9fc5d7dc073c9675dad34239bfb3948c499a6908c19 AS build

WORKDIR /app

COPY --chown=node:node --from=dependencies /app /app

# Copy src to /app/src/
COPY --chown=node:node ./src ./src

# Copy our HTPASSWD file
COPY --chown=node:node ./tests/.htpasswd ./tests/.htpasswd

USER node

# Start the container by running our server
CMD ["node", "src/index.js"]

# We run our service on port 8080
EXPOSE 8080
