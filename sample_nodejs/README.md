**THIS ONLY WORKS WITH DEBIAN SERVERS. NOT TESTED ON OTHER UNIX MACHINES!!!**

Use this script to configure and install nodejs as a service.

Run `sh _server_setup.sh` and go through the prompts. This updates server, configures it, and installs nodejs.

You also have the option to deploy nodejs as a service. For this to work out of the box, you have to place these files into `/srv/www/nodejs` so that the `public.js` file is there.

You then need to select `Y` for making a NodeJS service, and call it `public` in order for it to attach to the `public.js` file.

To manage the service, run `service publicServer status`, `service publicServer start`, `service publicServer stop`, and `service publicServer restart`.

All logs can be viewed in `/srv/www/nodejs/logs/public.log`.
