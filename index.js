const Discord = require("discord.js");
const client = new Discord.Client();
const auth = require("./auth.json");
let triggers = require("./triggers.json");

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
	var channel = message.channel;
	var isCommand = false;
	if (msgContent.substring(0, 1) == "!") {
		var args = msgContent.substring(1).split(" ");
		var cmd = args[0];
		args = args.splice(1);
		isCommand = true;
	}
	if (isCommand) {
		switch (cmd) {
			case "help":
				const lines = [
					"Available commands:",
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
					"`!rmbwarn` gives instructions on how to remove the beta warning message from the 1.0 panel",
					"These commands are paired with a list of keywords which trigger messages.",
					"Find more on the GitHub: https://github.com/Sam1370/pis-bot"
				];
				channel.send(lines.join("\n"));
				break;
		}
		for (var i = 0; i < triggers.length; i++) {
			var matched = false;
			var trig = triggers[i];
			if (trig.hasOwnProperty("cmd")) {
				cmdtomatch = trig.cmd.toLowerCase();
				if (cmd === cmdtomatch) {
				matched = true;
				}
			}
			if (trig.hasOwnProperty("aliases") && matched == false) {
				var aliases = trig.aliases;
				for (var g = 0; g < aliases.length; g++) {
					aliastomatch = (aliases[g]).toLowerCase();
					if (cmd === aliastomatch) {
						matched = true;
						break;
					}
				}
			}
			if (matched == true) {
			channel.send(trig.lines.join("\n"));
		}
		}
	} else {
		for (var i = 0; i < triggers.length; i++) {
			var matched = false;
			var trig = triggers[i];
			if (trig.hasOwnProperty("keys")) {
				var keys = trig.keys;
				for (var h = 0; h < keys.length; h++) {
					keytomatch = (keys[h]).toLowerCase();
					if (msgContent.includes(keytomatch)) {
						matched = true;
						break;
					}
				}
			}
			if (matched == true) {
				channel.send(trig.lines.join("\n"));
			}
		}
	}
});
