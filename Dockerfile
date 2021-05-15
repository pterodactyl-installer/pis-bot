FROM node:lts-alpine
LABEL author="Linux123123" maintainer="linas.alexx@gmail.com"

WORKDIR /usr/src/bot

# copy app
COPY . /usr/src/bot

# Install dependencies
RUN npm i --production

# Replace version with commit hash
RUN apk update
RUN apk add git
RUN sed -i "s/development/$(git rev-parse HEAD | head -c7)/g" /usr/src/bot/src/config/config.ts

# Build
RUN npm run build

# Remove not needed src folder
RUN rm -rf src/

# Run the bot
CMD ["node", "dist/index.js"]
