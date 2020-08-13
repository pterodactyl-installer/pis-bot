# pis-bot
This is a support bot for the [Pterodactyl Installation Script Discord](https://discord.gg/zhUu4rv), but feel free to adapt it for your own uses. It is a simple bot that responds to commands and keywords and gives a response.

## Installation

`git clone` the repository. Run `npm install`.

## Configuration

Commands and triggers are defined in `triggers.json`. Bot token is defined in `auth.json`.

## Running

One-time start: `node index.js`

Encapsulated in while-true loop: `start-bot.sh`

As a system service: `install-service.sh && systemctl daemon-reload` then when you want to start: `systemctl start pis-bot`

## Staying updated

To stay updated with the latest versions, you can run a cronjob to automatically update you. Run `crontab -e` and add this at the end of the file:
```
su -s /bin/sh root -c 'cd <YOUR DIRECTORY> && /usr/bin/git update-index --assume-unchanged auth.json && /usr/bin/git pull origin master'
```
