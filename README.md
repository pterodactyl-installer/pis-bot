# pis-bot
This is a support bot for the [Pterodactyl Installation Script Discord](https://discord.gg/zhUu4rv).

## Installation

`git clone` the repository. Create `auth.json` and format it like this:
```
{
	"token": "your-bot-token"
}
```
Run `npm install`.

## Configuration

The configuration is entirely done in `triggers.json`, where you can define commands and keywords.

## Running

You can do a one-time start with `node index.js`, or use `start-bot.sh` which wraps it in a while-true loop to protect against crashes.
