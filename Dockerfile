FROM node:16-bullseye-slim
LABEL author="Linux123123" maintainer="linas.alexx@gmail.com"

WORKDIR /usr/src/bot

# copy app
COPY . /usr/src/bot

# Install git
RUN apt-get update && apt-get install -y git python3 build-essential

# Install dependencies
RUN yarn install --production --frozen-lockfile

# Build
RUN yarn build

# Remove not needed src folder
RUN rm -rf src/

# Run the bot
CMD ["node", "dist/index.js"]
