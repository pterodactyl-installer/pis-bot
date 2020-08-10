const Discord = require("discord.js");
const client = new Discord.Client();
const auth = require("./auth.json");
let keywords = require("./keywords.json");

client.login(auth.token);

client.once("ready", () => {
	console.log(
		"Logged in as: " + client.user.username + " - (" + client.user.id + ")"
	);
	client.user.setActivity("!help");
});

client.on("message", (message) => {
	if (message.author.id === client.user.id) return;
	var msgContent = message.content.toLowerCase();
	if (msgContent.substring(0, 1) == "!") {
		var args = msgContent.substring(1).split(" ");
		var cmd = args[0];
		args = args.splice(1);
		var channel = message.channel;
		switch (cmd) {
			case "help":
				const lines = [
					"`!pdir` gives the panel directory",
					"`!logs` shows how to retrieve logs for the panel and daemon",
					"`!install` gives the master installation script",
					"`!check` gives a useful command to check for panel errors",
					"`!firewall` gives a link to directions on firewall setup",
					"`!nstart`, `!nrestart`, `!nstop`, and `!nstatus` all give instructions on how to perform those respective actions to nginx using systemctl",
					"`!wstart`, `!wrestart`, `!wstop`, and `!wstatus` perform similar functions as above except for wings",
					"`!config` provides a link to the official instructions on how to manually configure the daemon",
					"`!storage` provides the location in which server files are stored",
					"`!muser` gives instructions on how to create a new user for the panel",
				];
				channel.send("Available commands:\n" + lines.join("\n"));
				break;
			case "pdir":
				channel.send("Default panel directory is `/var/www/pterodactyl/`.");
				break;
			case "logs":
				channel.send(
					"Panel logs: `tail -n 100 /var/www/pterodactyl/storage/logs/laravel-$(date +%F).log | nc bin.ptdl.co 99`\nDaemon logs: `cd /srv/daemon/ && npm run diagnostics`"
				);
				break;
			case "install":
				channel.send(
					"Install with:\n```bash <(curl -s https://raw.githubusercontent.com/vilhelmprytz/pterodactyl-installer/master/install.sh)```\nIf this fails, it is possible to do the same thing by running this:\n```wget https://raw.githubusercontent.com/vilhelmprytz/pterodactyl-installer/master/install.sh\nbash install.sh```"
				);
				break;
			case "check":
				channel.send(
					"This command can be useful to check for errors on the panel:\n`/usr/bin/php /var/www/pterodactyl/artisan queue:work --queue=high,standard,low --sleep=3 --tries=3`"
				);
				break;
			case "firewall":
				channel.send(
					"The installation scripts do not configure your firewall automatically. Here are the instructions for how to do so: <https://github.com/vilhelmprytz/pterodactyl-installer#firewall-setup>"
				);
				break;
			case "nstart":
				channel.send("Start nginx with `systemctl start nginx`");
				break;
			case "nrestart":
				channel.send("Restart nginx with `systemctl restart nginx`");
				break;
			case "nstatus":
				channel.send(
					"Check status and logs of nginx with `systemctl status nginx`"
				);
				break;
			case "nstop":
				channel.send("Stop nginx with `systemctl stop nginx`");
				break;
			case "wstart":
				channel.send(
					"Start the daemon after configuration with `systemctl start wings`"
				);
				break;
			case "wrestart":
				channel.send("Restart the daemon with `systemctl restart wings`");
				break;
			case "wstatus":
				channel.send(
					"Check status and logs of the daemon with `systemctl status wings`"
				);
				break;
			case "wstop":
				channel.send("Stop the daemon with `systemctl stop wings`");
				break;
			case "config":
				channel.send(
					"The guide to configuring your daemon can be found here: <https://pterodactyl.io/daemon/0.6/installing.html#configure-daemon>"
				);
				break;
			case "storage":
				channel.send(
					"The server files on the daemon are stored:\nnormally: in `/srv/daemon-data/`\non beta 1.0: in `/var/lib/pterodactyl/volumes/`"
				);
				break;
			case "muser":
				channel.send(
					"Create a new panel user by running: ```cd /var/www/pterodactyl/\nphp artisan p:user:make```"
				);
				break;
		}
	}
	var keys = Object.keys(keywords);
	for (var i = 0; i < keys.length; i++) {
		var key = keys[i];
		var keyScrubbed = key.toLowerCase();
		if (msgContent.includes(keyScrubbed)) {
			message.channel.send(keywords[key]);
		}
	}
});
