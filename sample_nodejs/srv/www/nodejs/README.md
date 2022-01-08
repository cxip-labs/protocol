
Install the packages with `npm install`. If you use `nvm` run `nvm install` first.

Use the `sample.env` file for reference. Rename it to `.env` and configure it accordingly.

Make that if you change domain to something other than localhost, that you provide the correct SSL files in the `./ssl` dir.

SSL files format is `$domain.fullchain.pem` and `$domain.privkey.pem`. This is to make it work easy with Lets Encrypt.

To run a non-service test/deployment, run it as `node public.js`, otherwise run `service publicServer start`.

Drop static files into the `html` dir. It is read-only, so no files from that dir will be able to do any harm to your machine.

Server is configured to allow for streaming of files, chunked downloads, proper mime types, etc.

Should be a simple plug and play solution.
