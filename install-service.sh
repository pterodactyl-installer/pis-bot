rm -f /etc/systemd/system/pis-bot.service
cat > /etc/systemd/system/pis-bot.service << EOF
[Unit]
Description=pis-bot
After=network.target
StartLimitIntervalSec=0
[Service]
Type=simple
Restart=always
RestartSec=1
User=root
ExecStart=/usr/bin/node ${PWD}/dist/index.js

[Install]
WantedBy=multi-user.target
EOF
