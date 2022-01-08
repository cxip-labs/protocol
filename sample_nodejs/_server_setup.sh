#!/bin/sh

promptyn () {
	while true; do
		read -p "$1 : " yn
		case $yn in
			Y|y|[Yy][Ee][Ss] ) return 0;;
			N|n|[Nn][Oo] ) return 1;;
			* ) echo "Please answer yes or no.";;
		esac
	done
}

if [ "$(whoami)" != "root" ]; then
	echo "You are not root. Please run this command with sudo in front of it"
	exit
fi

echo "We are about to start installing this server.";
if promptyn "Do you wish to continue? (y/n)"; then
	echo "Starting the process"
else
	echo "Quitting the application"
	exit
fi

### UPDATING SERVER ###
echo "Starting to update the environment"
echo "Checking for updates"
apt-get update
wait
echo "Now trying to do the updates"
apt-get dist-upgrade -y
wait
## some systems don't have this and we need it for unzipping glassfish
## we drop iptables-persistent because we have our own script to handle this
## apt-get install dirmngr unzip iptables-persistent -y
apt-get install -y dirmngr unzip rsync xfsprogs brotli zopfli
wait
echo "Now cleaning up"
apt-get autoremove
wait
echo "Done updating the environment"

### IP TABLES
if promptyn "Would you like to configure IP Tables? (y/n)"; then
    echo "Securing servers ports";
    echo "Configuring IP Tables";
    sysctl -w net.ipv4.ip_forward=1
    sed -i 's/#net.ipv4.ip_forward=1/net.ipv4.ip_forward=1/g' /etc/sysctl.conf
    sysctl -p
    sysctl --system
    mkdir /etc/iptables
    ip6tables -F
    # Set default chain policies
    ip6tables -P INPUT ACCEPT
    ip6tables -P FORWARD ACCEPT
    ip6tables -P OUTPUT ACCEPT
    ip6tables -A INPUT -m state --state RELATED,ESTABLISHED -j ACCEPT
    ip6tables -A INPUT -p ipv6-icmp -j ACCEPT
    ip6tables -A INPUT -i lo -j ACCEPT
    ip6tables -A INPUT -d fe80::/64 -p udp -m udp --dport 546 -m state --state NEW -j ACCEPT


    iptables -F
    iptables -P INPUT ACCEPT
    iptables -P OUTPUT ACCEPT
    iptables -P FORWARD DROP
    iptables -A INPUT -m state --state RELATED,ESTABLISHED -j ACCEPT
    iptables -A INPUT -i lo -j ACCEPT
    echo "We opened port 22 for SSH/SFTP"
    iptables -A INPUT -p tcp --dport 22 -j ACCEPT # SSH
    ip6tables -A INPUT -p tcp -m state --state NEW -m tcp --dport 22 -j ACCEPT # SSH
    iptables -A INPUT -p tcp --dport 80 -j ACCEPT # HTTP
    iptables -A INPUT -p tcp --dport 443 -j ACCEPT # HTTPS
    ip6tables -A INPUT -p tcp -m state --state NEW -m tcp --dport 80 -j ACCEPT # HTTP
    ip6tables -A INPUT -p tcp -m state --state NEW -m tcp --dport 443 -j ACCEPT # HTTPS

    iptables -A INPUT -j DROP
    iptables-save > /etc/iptables/rules.v4

    ip6tables -A INPUT -j REJECT --reject-with icmp6-adm-prohibited
    ip6tables -A FORWARD -j REJECT --reject-with icmp6-adm-prohibited
    ip6tables-save > /etc/iptables/rules.v6

    echo '#!/bin/sh' > /etc/network/if-pre-up.d/iptables
    echo '/sbin/iptables-restore < /etc/iptables/rules.v4' >> /etc/network/if-pre-up.d/iptables
    echo '/sbin/ip6tables-restore < /etc/iptables/rules.v6' >> /etc/network/if-pre-up.d/iptables
    chmod +x /etc/network/if-pre-up.d/iptables
fi

### NodeJs Forever Server (latest) ###
### use https://www.digitalocean.com/community/tutorials/how-to-install-node-js-on-debian-10 for reference
if promptyn "Would you like to install NodeJS? (y/n)"; then
    apt-get install -y curl
    curl -sL https://deb.nodesource.com/setup_current.x -o nodesource_setup.sh
    bash nodesource_setup.sh
    rm nodesource_setup.sh
    apt install -y nodejs
    apt install -y build-essential
    npm -g install forever
    npm -g install http
    npm -g install https
    npm -g install fs
    npm -g install url
    npm -g install path
    npm -g install querystring
    npm -g install client-sessions
    npm -g install mysql
    npm -g install multiparty
    npm -g install util
    npm -g install mkdirp
    npm -g install request
    npm -g install crypto
    npm -g install read-chunk
    npm -g install file-type
    npm config set fund false --global
    mkdir -p /srv/www/nodejs/
    mkdir -p /srv/www/nodejs/logs
    mkdir -p /srv/www/nodejs/logs/requests
fi

if promptyn "Would you like to create a NodeJS service? (y/n)"; then
    read -p "Provide a name for the node service : " NODE
    ## create blanks for use
    touch /srv/www/nodejs/$NODE.js
    touch /srv/www/nodejs/$NODE.pid
    touch /srv/www/nodejs/logs/$NODE.log
    ## create the service
    echo '#!/bin/bash' > /etc/init.d/$NODE"Server"
    echo '#' >> /etc/init.d/$NODE"Server"
    echo '### BEGIN INIT INFO' >> /etc/init.d/$NODE"Server"
    echo '# Provides:             '$NODE'Server' >> /etc/init.d/$NODE"Server"
    echo '# Required-Start:       $syslog $remote_fs' >> /etc/init.d/$NODE"Server"
    echo '# Required-Stop:        $syslog $remote_fs' >> /etc/init.d/$NODE"Server"
    echo '# Should-Start:         $local_fs' >> /etc/init.d/$NODE"Server"
    echo '# Should-Stop:          $local_fs' >> /etc/init.d/$NODE"Server"
    echo '# Default-Start:        2 3 4 5' >> /etc/init.d/$NODE"Server"
    echo '# Default-Stop:         0 1 6' >> /etc/init.d/$NODE"Server"
    echo '# Short-Description:    '$NODE'Server' >> /etc/init.d/$NODE"Server"
    echo '# Description:          '$NODE'Server' >> /etc/init.d/$NODE"Server"
    echo '### END INIT INFO' >> /etc/init.d/$NODE"Server"
    echo '#' >> /etc/init.d/$NODE"Server"
    echo '### BEGIN CHKCONFIG INFO' >> /etc/init.d/$NODE"Server"
    echo '# chkconfig: 2345 55 25' >> /etc/init.d/$NODE"Server"
    echo '# description: '$NODE'Server' >> /etc/init.d/$NODE"Server"
    echo '### END CHKCONFIG INFO' >> /etc/init.d/$NODE"Server"
    echo '#' >> /etc/init.d/$NODE"Server"
    echo 'NAME="'$NODE'Server"' >> /etc/init.d/$NODE"Server"
    echo 'NODE_BIN_DIR="/usr/bin"' >> /etc/init.d/$NODE"Server"
    echo 'NODE_PATH="/usr/lib/node_modules"' >> /etc/init.d/$NODE"Server"
    echo 'ROOT_PATH="/srv/www/nodejs"' >> /etc/init.d/$NODE"Server"
    echo 'APPLICATION_PATH="/srv/www/nodejs/'$NODE'.js"' >> /etc/init.d/$NODE"Server"
    echo 'PIDFILE="/srv/www/nodejs/'$NODE'.pid"' >> /etc/init.d/$NODE"Server"
    echo 'LOGFILE="/srv/www/nodejs/logs/'$NODE'.log"' >> /etc/init.d/$NODE"Server"
    echo 'MIN_UPTIME="5000"' >> /etc/init.d/$NODE"Server"
    echo 'SPIN_SLEEP_TIME="2000" ' >> /etc/init.d/$NODE"Server"
    echo 'PATH=$NODE_BIN_DIR:$PATH' >> /etc/init.d/$NODE"Server"
    echo 'export NODE_PATH=$NODE_PATH' >> /etc/init.d/$NODE"Server"
    echo 'export NODE_EXTRA_CA_CERTS="/srv/www/nodejs/ssl/internal.crt"' >> /etc/init.d/$NODE"Server"
    echo 'start() {' >> /etc/init.d/$NODE"Server"
    echo '    echo "Starting $NAME"' >> /etc/init.d/$NODE"Server"
    echo '    forever \' >> /etc/init.d/$NODE"Server"
    echo '      --pidFile $PIDFILE \' >> /etc/init.d/$NODE"Server"
    echo '      --workingDir $ROOT_PATH \' >> /etc/init.d/$NODE"Server"
    echo '      -a \' >> /etc/init.d/$NODE"Server"
    echo '      -l $LOGFILE \' >> /etc/init.d/$NODE"Server"
    echo '      --minUptime $MIN_UPTIME \' >> /etc/init.d/$NODE"Server"
    echo '      --spinSleepTime $SPIN_SLEEP_TIME \' >> /etc/init.d/$NODE"Server"
    echo '      start $APPLICATION_PATH 2>&1 > /dev/null &' >> /etc/init.d/$NODE"Server"
    echo '    RETVAL=$?' >> /etc/init.d/$NODE"Server"
    echo '} ' >> /etc/init.d/$NODE"Server"
    echo 'stop() {' >> /etc/init.d/$NODE"Server"
    echo '    if [ -f $PIDFILE ]; then' >> /etc/init.d/$NODE"Server"
    echo '        echo "Shutting down $NAME"' >> /etc/init.d/$NODE"Server"
    echo '        forever stop $APPLICATION_PATH 2>&1 > /dev/null' >> /etc/init.d/$NODE"Server"
    echo '        rm -f $PIDFILE' >> /etc/init.d/$NODE"Server"
    echo '        RETVAL=$?' >> /etc/init.d/$NODE"Server"
    echo '    else' >> /etc/init.d/$NODE"Server"
    echo '        echo "$NAME is not running."' >> /etc/init.d/$NODE"Server"
    echo '        RETVAL=0' >> /etc/init.d/$NODE"Server"
    echo '    fi' >> /etc/init.d/$NODE"Server"
    echo '}' >> /etc/init.d/$NODE"Server"
    echo 'restart() {' >> /etc/init.d/$NODE"Server"
    echo '    stop' >> /etc/init.d/$NODE"Server"
    echo '    start' >> /etc/init.d/$NODE"Server"
    echo '}' >> /etc/init.d/$NODE"Server"
    echo 'status() {' >> /etc/init.d/$NODE"Server"
    echo '    echo `forever list` | grep -q "$APPLICATION_PATH"' >> /etc/init.d/$NODE"Server"
    echo '    if [ "$?" -eq "0" ]; then' >> /etc/init.d/$NODE"Server"
    echo '        echo "$NAME is running."' >> /etc/init.d/$NODE"Server"
    echo '        RETVAL=0' >> /etc/init.d/$NODE"Server"
    echo '    else' >> /etc/init.d/$NODE"Server"
    echo '        echo "$NAME is not running."' >> /etc/init.d/$NODE"Server"
    echo '        RETVAL=3' >> /etc/init.d/$NODE"Server"
    echo '    fi' >> /etc/init.d/$NODE"Server"
    echo '}' >> /etc/init.d/$NODE"Server"
    echo 'case "$1" in' >> /etc/init.d/$NODE"Server"
    echo '    start)' >> /etc/init.d/$NODE"Server"
    echo '        start' >> /etc/init.d/$NODE"Server"
    echo '        ;;' >> /etc/init.d/$NODE"Server"
    echo '    stop)' >> /etc/init.d/$NODE"Server"
    echo '        stop' >> /etc/init.d/$NODE"Server"
    echo '        ;;' >> /etc/init.d/$NODE"Server"
    echo '    status)' >> /etc/init.d/$NODE"Server"
    echo '        status' >> /etc/init.d/$NODE"Server"
    echo '        ;;' >> /etc/init.d/$NODE"Server"
    echo '    restart)' >> /etc/init.d/$NODE"Server"
    echo '        restart' >> /etc/init.d/$NODE"Server"
    echo '        ;;' >> /etc/init.d/$NODE"Server"
    echo '    *)' >> /etc/init.d/$NODE"Server"
    echo '        echo "Usage: {start|stop|status|restart}"' >> /etc/init.d/$NODE"Server"
    echo '        exit 1' >> /etc/init.d/$NODE"Server"
    echo '        ;;' >> /etc/init.d/$NODE"Server"
    echo 'esac' >> /etc/init.d/$NODE"Server"
    echo 'exit $RETVAL' >> /etc/init.d/$NODE"Server"
    chmod a+x /etc/init.d/$NODE"Server"
    update-rc.d $NODE"Server" defaults

    echo "you can now use the node service which is available at 'service "$NODE"Server'"
fi

echo "DONE WITH EVERYTHING.";

exit
