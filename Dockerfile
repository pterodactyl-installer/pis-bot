FROM node:lts-alpine
LABEL author="Linux123123" maintainer="linas.alexx@gmail.com"

WORKDIR /usr/src/bot

# copy app
COPY . /usr/src/bot

# Install dependencies
RUN npm i --production

# Build
RUN npm run build

# Remove not needed src folder
RUN rm -rf src/

# Run the bot
CMD ["node", "dist/index.js"]
