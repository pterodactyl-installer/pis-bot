# pis-bot
This is a support bot for the [Pterodactyl Installation Script Discord](https://discord.gg/zhUu4rv), but feel free to adapt it for your own uses. It is a simple bot that responds to commands and keywords and gives a response.

## Installation

`git clone` the repository. Run `npm install`.

## Configuration

Commands and triggers are defined in `triggers.json`. Bot token is defined in `auth.json`.

## Running

You have some options when running the script. You can do a one-time start with `node index.js`, or use `start-bot.sh` which wraps it in a while-true loop to protect against crashes (both of these you will probably want to run in a `screen` session.) You can also use the service, simply run `install-service.sh` and `systemctl daemon-reload` and then you can start the bot with `systemctl start pis-bot`.
