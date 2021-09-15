FROM node:16-alpine
LABEL author="Linux123123" maintainer="linas.alexx@gmail.com"

WORKDIR /usr/src/bot

# copy app
COPY . /usr/src/bot

# Install dependencies
RUN yarn i --production

# Replace version with commit hash
RUN apk update
RUN apk add git

# Build
RUN yarn build

# Remove not needed src folder
RUN rm -rf src/

# Run the bot
CMD ["node", "dist/index.js"]
