# THE-Hack-2019
A Dockerized implementation of THE Hack 2019 Website 🚀!

### Deployment in production
1. Copy `.env.example` to `.env`
2. Fill in the Cloudflare account and API key (for letsencrypt DNS challenges)
3. Create `./nginx/secrets.htpasswd` and `./nginx/secrets.htpasswd.sponsors`, these files are used for Nginx basic_auth
4. Obtain TLS certificates through running `docker-compose -f docker-compose-production.yaml up letsencrypt`
5. After obtaining all licenses, press `Ctrl + C` to stop the container
6. Run `docker-compose -f docker-compose-production.yaml up -d --build`
