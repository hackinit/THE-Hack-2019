# THE-Hack-2019
A Dockerized implementation of THE Hack 2019 Website 🚀!

### Testing
For local testing,
1. Run `docker-compose up`
2. Copy the records in the `hosts` file to your system hosts.
3. Visit `www.thehack.org.cn` or any domains stated in hosts file

> The hosts location in Windows is ` 	%SystemRoot%\System32\drivers\etc\hosts`  
For unix, or unix-like systems (including Linux), it is `/etc/hosts`

> If you want to run only 2019's website, run `docker-compose up nginx 2019_thehack_marko` instead of `docker-compose up`, which starts all containers.  
