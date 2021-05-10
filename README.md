# pis-bot

![Travis (.com)](https://img.shields.io/travis/com/Sam1370/pis-bot)
![GitHub](https://img.shields.io/github/license/Sam1370/pis-bot)

This is a support bot for the [Pterodactyl Installation Script Discord](https://pterodactyl-installer.se/discord), but feel free to adapt it for your own uses. It is a simple bot that responds to commands, keywords or parsed image text.

## Requirements

Nodejs v12.0.0 or newer is recommended. You can install that using:
(If you can't use Nodejs 12 or newer you can compile with a lower target version)

```bash
curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -
sudo apt-get install -y nodejs
```
# Docker image

We provide an easy to use `docker-compose.yml` file. Just install `docker` and `docker-compose`.
Then fill in the `env` variables in the `dokcer-compose.yml` file and run `docker-compose up -d`

## Manual Installation

```bash
git clone https://github.com/pterodactyl-installer/pis-bot.git
```

```bash
npm i --production
```

```bash
npm run configure
```

This will automatically build and setup up the bot.

To build manually:

```bash
npm run build
```

## Configuration

Triggers are defined in `dist/config/triggers.js`.
For all the other things you will be prompted automatically.

## Running

One-time start: `npm start`
Using docker and docker-compose: `docker-compose up -d`

## Staying updated

To stay updated with the latest versions, you can use the docker image provided.
