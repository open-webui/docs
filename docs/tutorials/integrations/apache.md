---
sidebar_position: 7
title: "Hosting UI and Models separately"
---

:::warning
This tutorial is a community contribution and is not supported by the OpenWebUI team. It serves only as a demonstration on how to customize OpenWebUI for your specific use case. Want to contribute? Check out the contributing tutorial.
:::

:::note
If you plan to expose this to the wide area network, consider implementing security like a [network firewall](https://github.com/chr0mag/geoipsets), [web application firewall](https://github.com/owasp-modsecurity/ModSecurity), and [threat intelligence](https://github.com/crowdsecurity/crowdsec).
Additionally, it's strongly recommended to enable HSTS possibly like `Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains"` within your **HTTPS** configuration and a redirect of some kind to your **HTTPS URL** within your **HTTP** configuration. For free SSL certification, [Let's Encrypt](https://letsencrypt.org/) is a good option coupled with [Certbot](https://github.com/certbot/certbot) management.
:::

Sometimes, its beneficial to host Ollama, separate from the UI, but retain the RAG and RBAC support features shared across users:

## UI Configuration

For the UI configuration, you can set up the Apache VirtualHost as follows:

```
# Assuming you have a website hosting this UI at "server.com"
<VirtualHost 192.168.1.100:80>
    ServerName server.com
    DocumentRoot /home/server/public_html

    ProxyPass / http://server.com:3000/ nocanon
    ProxyPassReverse / http://server.com:3000/

    RewriteEngine on
    RewriteCond %{HTTP:Upgrade} websocket [NC]
    RewriteCond %{HTTP:Connection} upgrade [NC]
    RewriteRule ^/?(.*) "ws://server.com:3000/$1" [P,L]
</VirtualHost>
```

Enable the site first before you can request SSL:

:::warning
Use of the `nocanon` option may [affect the security of your backend](https://httpd.apache.org/docs/2.4/mod/mod_proxy.html#proxypass). It's recommended to enable this only if required by your configuration.
_Normally, mod_proxy will canonicalise ProxyPassed URLs. But this may be incompatible with some backends, particularly those that make use of PATH_INFO. The optional nocanon keyword suppresses this and passes the URL path "raw" to the backend. Note that this keyword may affect the security of your backend, as it removes the normal limited protection against URL-based attacks provided by the proxy._
:::

`a2ensite server.com.conf` # this will enable the site. a2ensite is short for "Apache 2 Enable Site"

```
# For SSL
<VirtualHost 192.168.1.100:443>
    ServerName server.com
    DocumentRoot /home/server/public_html

    ProxyPass / http://server.com:3000/ nocanon
    ProxyPassReverse / http://server.com:3000/

    RewriteEngine on
    RewriteCond %{HTTP:Upgrade} websocket [NC]
    RewriteCond %{HTTP:Connection} upgrade [NC]
    RewriteRule ^/?(.*) "ws://server.com:3000/$1" [P,L]

    SSLEngine on
    SSLCertificateFile /etc/ssl/virtualmin/170514456861234/ssl.cert
    SSLCertificateKeyFile /etc/ssl/virtualmin/170514456861234/ssl.key
    SSLProtocol all -SSLv2 -SSLv3 -TLSv1 -TLSv1.1

    SSLProxyEngine on
    SSLCACertificateFile /etc/ssl/virtualmin/170514456865864/ssl.ca
</VirtualHost>

```

I'm using virtualmin here for my SSL clusters, but you can also use certbot directly or your preferred SSL method. To use SSL:

### Prerequisites

Run the following commands:

`snap install certbot --classic`
`snap apt install python3-certbot-apache` (this will install the apache plugin).

Navigate to the apache sites-available directory:

`cd /etc/apache2/sites-available/`

Create server.com.conf if it is not yet already created, containing the above `<virtualhost>` configuration (it should match your case. Modify as necessary). Use the one without the SSL:

Once it's created, run `certbot --apache -d server.com`, this will request and add/create an SSL keys for you as well as create the server.com.le-ssl.conf

# Configuring Ollama Server

On your latest installation of Ollama, make sure that you have setup your api server from the official Ollama reference:

[Ollama FAQ](https://github.com/jmorganca/ollama/blob/main/docs/faq.md)

### TL;DR

The guide doesn't seem to match the current updated service file on linux. So, we will address it here:

Unless when you're compiling Ollama from source, installing with the standard install `curl https://ollama.com/install.sh | sh` creates a file called `ollama.service` in /etc/systemd/system. You can use nano to edit the file:

```
sudo nano /etc/systemd/system/ollama.service
```

Add the following lines:

```
Environment="OLLAMA_HOST=0.0.0.0:11434" # this line is mandatory. You can also specify
```

For instance:

```
[Unit]
Description=Ollama Service
After=network-online.target

[Service]
ExecStart=/usr/local/bin/ollama serve
Environment="OLLAMA_HOST=0.0.0.0:11434" # this line is mandatory. You can also specify 192.168.254.109:DIFFERENT_PORT, format
Environment="OLLAMA_ORIGINS=http://192.168.254.106:11434,https://models.server.city" # this line is optional
User=ollama
Group=ollama
Restart=always
RestartSec=3
Environment="PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games:/usr/local/games:/s>

[Install]
WantedBy=default.target
```

Save the file by pressing CTRL+S, then press CTRL+X

When your computer restarts, the Ollama server will now be listening on the IP:PORT you specified, in this case 0.0.0.0:11434, or 192.168.254.106:11434 (whatever your local IP address is). Make sure that your router is correctly configured to serve pages from that local IP by forwarding 11434 to your local IP server.

# Ollama Model Configuration

## For the Ollama model configuration, use the following Apache VirtualHost setup

Navigate to the apache sites-available directory:

`cd /etc/apache2/sites-available/`

`nano models.server.city.conf` # match this with your ollama server domain

Add the follwoing virtualhost containing this example (modify as needed):

```

# Assuming you have a website hosting this UI at "models.server.city"
<IfModule mod_ssl.c>
    <VirtualHost 192.168.254.109:443>
        DocumentRoot "/var/www/html/"
        ServerName models.server.city
        <Directory "/var/www/html/">
            Options None
            Require all granted
        </Directory>

        ProxyRequests Off
        ProxyPreserveHost On
        ProxyAddHeaders On
        SSLProxyEngine on

        ProxyPass / http://server.city:1000/ nocanon # or port 11434
        ProxyPassReverse / http://server.city:1000/ # or port 11434

        SSLCertificateFile /etc/letsencrypt/live/models.server.city/fullchain.pem
        SSLCertificateKeyFile /etc/letsencrypt/live/models.server.city/privkey.pem
        Include /etc/letsencrypt/options-ssl-apache.conf
    </VirtualHost>
</IfModule>
```

You may need to enable the site first (if you haven't done so yet) before you can request SSL:

`a2ensite models.server.city.conf`

#### For the SSL part of Ollama server

Run the following commands:

Navigate to the apache sites-available directory:

`cd /etc/apache2/sites-available/`
`certbot --apache -d server.com`

```
<VirtualHost 192.168.254.109:80>
    DocumentRoot "/var/www/html/"
    ServerName models.server.city
    <Directory "/var/www/html/">
        Options None
        Require all granted
    </Directory>

    ProxyRequests Off
    ProxyPreserveHost On
    ProxyAddHeaders On
    SSLProxyEngine on

    ProxyPass / http://server.city:1000/ nocanon # or port 11434
    ProxyPassReverse / http://server.city:1000/ # or port 11434

    RewriteEngine on
    RewriteCond %{SERVER_NAME} =models.server.city
    RewriteRule ^ https://%{SERVER_NAME}%{REQUEST_URI} [END,NE,R=permanent]
</VirtualHost>

```

Don't forget to restart/reload Apache with `systemctl reload apache2`

Open your site at https://server.com!

**Congratulations**, your _**Open-AI-like Chat-GPT style UI**_ is now serving AI with RAG, RBAC and multimodal features! Download Ollama models if you haven't yet done so!

If you encounter any misconfiguration or errors, please file an issue or engage with our discussion. There are a lot of friendly developers here to assist you.

Let's make this UI much more user friendly for everyone!

Thanks for making open-webui your UI Choice for AI!

This doc is made by **Bob Reyes**, your **Open-WebUI** fan from the Philippines.
