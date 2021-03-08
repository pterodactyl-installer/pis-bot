FROM        node:current-alpine
LABEL       author="Linux123123" maintainer="linas.alexx@gmail.com"
# Install git, python3 and build deps.
RUN         apk add --no-cache --update python3 git build-base
# Create the directory!
RUN         mkdir -p /usr/src/bot
WORKDIR     /usr/src/bot
# Download
RUN         git clone --single-branch --branch initial-typescript https://github.com/Sam1370/pis-bot.git .
# Install dependencies
RUN         npm i --production --ignore-scripts
# Build
RUN         npm run build
# Remove not needed src folder
RUN         rm -rf src/
# Run the bot
CMD         ["node", "dist/index.js"]
