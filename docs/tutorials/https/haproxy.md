---
sidebar_position: 201
title: "HTTPS using HAProxy"
---

:::warning

This tutorial is a community contribution and is not supported by the Open WebUI team. It serves only as a demonstration on how to customize Open WebUI for your specific use case. Want to contribute? Check out the contributing tutorial.

:::

# HAProxy Configuration for Open WebUI

HAProxy (High Availability Proxy) is specialized load-balancing and reverse proxy solution that is highly configurable and designed to handle large amounts of connections with a relatively low resource footprint. for more information, please see: https://www.haproxy.org/

## Install HAProxy and Let's Encrypt

First, install HAProxy and Let's Encrypt's certbot:

### Redhat derivatives

```sudo dnf install haproxy certbot openssl -y```

### Debian derivatives

```sudo apt install haproxy certbot openssl -y```

## HAProxy Configuration Basics

HAProxy's configuration is by default stored in ```/etc/haproxy/haproxy.cfg```. This file contains all the configuration directives that determine how HAProxy will operate.

The base configuration for HAProxy to work with Open WebUI is pretty simple.

```shell
 #---------------------------------------------------------------------

# Global settings

#---------------------------------------------------------------------
global
    # to have these messages end up in /var/log/haproxy.log you will
    # need to:
    #
    # 1) configure syslog to accept network log events. This is done
    #    by adding the '-r' option to the SYSLOGD_OPTIONS in
    #    /etc/sysconfig/syslog
    #
    # 2) configure local2 events to go to the /var/log/haproxy.log
    #   file. A line like the following can be added to
    #   /etc/sysconfig/syslog
    #
    #    local2.*                       /var/log/haproxy.log
    #
    log         127.0.0.1 local2

    chroot      /var/lib/haproxy
    pidfile     /var/run/haproxy.pid
    maxconn     4000
    user        haproxy
    group       haproxy
    daemon

 #adjust the dh-param if too low
    tune.ssl.default-dh-param 2048

#---------------------------------------------------------------------

# common defaults that all the 'listen' and 'backend' sections will

# use if not designated in their block

#---------------------------------------------------------------------
defaults
    mode                    http
    log                     global
    option                  httplog
    option                  dontlognull
    option http-server-close
    option forwardfor       #except 127.0.0.0/8
    option                  redispatch
    retries                 3
    timeout http-request    300s
    timeout queue           2m
    timeout connect         120s
    timeout client          10m
    timeout server          10m
    timeout http-keep-alive 120s
    timeout check           10s
    maxconn                 3000

#http
frontend web
 #Non-SSL
    bind 0.0.0.0:80
 #SSL/TLS
 bind 0.0.0.0:443 ssl crt /path/to/ssl/folder/

    #Let's Encrypt SSL
    acl letsencrypt-acl path_beg /.well-known/acme-challenge/
    use_backend letsencrypt-backend if letsencrypt-acl

 #Subdomain method
    acl chat-acl hdr(host) -i subdomain.domain.tld
    #Path Method
    acl chat-acl path_beg /owui/
    use_backend owui_chat if chat-acl

#Pass SSL Requests to Lets Encrypt
backend letsencrypt-backend
    server letsencrypt 127.0.0.1:8688

#OWUI Chat
backend owui_chat
    # add X-FORWARDED-FOR
    option forwardfor
    # add X-CLIENT-IP
    http-request add-header X-CLIENT-IP %[src]
 http-request set-header X-Forwarded-Proto https if { ssl_fc }
    server chat <ip>:3000
```

You will see that we have ACL records (routers) for both Open WebUI and Let's Encrypt. To use WebSocket with OWUI, you need to have an SSL configured, and the easiest way to do that is to use Let's Encrypt.

You can use either the subdomain method or the path method for routing traffic to Open WebUI. The subdomain method requires a dedicated subdomain (e.g., chat.yourdomain.com), while the path method allows you to access Open WebUI through a specific path on your domain (e.g., yourdomain.com/owui/). Choose the method that best suits your needs and update the configuration accordingly.

:::info

You will need to expose port 80 and 443 to your HAProxy server. These ports are required for Let's Encrypt to validate your domain and for HTTPS traffic. You will also need to ensure your DNS records are properly configured to point to your HAProxy server. If you are running HAProxy at home, you will need to use port forwarding in your router to forward ports 80 and 443 to your HAProxy server.

:::

## Issuing SSL Certificates with Let's Encrypt

Before starting HAProxy, you will want to generate a self signed certificate to use as a placeholder until Let's Encrypt issues a proper one. Here's how to generate a self-signed certificate:

```shell
openssl req -x509 -newkey rsa:2048 -keyout /tmp/haproxy.key -out /tmp/haproxy.crt -days 3650 -nodes -subj "/CN=localhost"
```

Then combine the key and certificate into a PEM file that HAProxy can use:

```cat /tmp/haproxy.crt /tmp/haproxy.key > /etc/haproxy/certs/haproxy.pem```

:::info

Make sure you update the HAProxy configuration based on your needs and configuration.

:::

Once you have your HAProxy configuration set up, you can use certbot to obtain and manage your SSL certificates. Certbot will handle the validation process with Let's Encrypt and automatically update your certificates when they are close to expiring (assuming you use the certbot auto-renewal service).

You can validate the HAProxy configuration by running `haproxy -c -f /etc/haproxy/haproxy.cfg`. If there are no errors, you can start HAProxy with `systemctl start haproxy` and verify it's running with `systemctl status haproxy`.

To ensure HAProxy starts with the system, `systemctl enable haproxy`.

When you have HAProxy configured, you can use Let's encrypt to issue your valid SSL certificate.
First, you will need to register with Let's Encrypt. You should only need to do this one time:

`certbot register --agree-tos --email your@email.com --non-interactive`

Then you can request your certificate:

```shell
certbot certonly -n --standalone --preferred-challenges http --http-01-port-8688 -d yourdomain.com
```

Once the certificate is issued, you will need to merge the certificate and private key files into a single PEM file that HAProxy can use.

```shell
cat /etc/letsencrypt/live/{domain}/fullchain.pem /etc/letsencrypt/live/{domain}/privkey.pem > /etc/haproxy/certs/{domain}.pem
chmod 600 /etc/haproxy/certs/{domain}.pem
chown haproxy:haproxy /etc/haproxy/certs/{domain}.pem
```

You can then restart HAProxy to apply the new certificate:
`systemctl restart haproxy`

## HAProxy Manager (Easy Deployment Option)

If you would like to have something manage your HAProxy configuration and Let's Encrypt SSLs automatically, I have written a simple python script and created a docker container you can use to create and manage your HAProxy config and manage the Let's Encrypt certificate lifecycle.

https://github.com/shadowdao/haproxy-manager

:::warning

Please do not expose port 8000 publicly if you use the script or container!

:::
