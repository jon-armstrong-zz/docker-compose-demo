# Docker Compose Demo

This project provides a simplified demonstration of some basic docker compose
functionality.

* Images
* Volumes
* Internal and external ports
* Automatic networking between containers
* Extending Docker Compose files for service reuse

The services consist of [app2](./app2/app.js), a NodeJS application which can be run separately
from its own compose file, and [app1](./app1/index.php), a PHP application which calls app2 and
runs under PHP-FPM. Both applications are proxied by nginx which runs in
separate containers using the same image.

## Getting started

Install [Docker Compose](https://docs.docker.com/compose/install/).

## Running app2

```
$ docker-compose -f docker-compose-app2.yml up -d
```

List the running containers; `8889` is the public port, denoted by
`0.0.0.0:8889`:

```
$ docker-compose -f docker-compose-app2.yml ps
          Name                    Command          State               Ports
----------------------------------------------------------------------------------------
dockercomposedemo_app2_1    node /app/app.js       Up      9001/tcp
dockercomposedemo_nginx_1   nginx -g daemon off;   Up      443/tcp, 0.0.0.0:8889->80/tcp
```

Follow the log output:

```
$ docker-compose -f docker-compose-app2.yml logs -f
```

Visit `http://localhost:8889/app2/` in your browser; you should see the output of app2.
In the terminal, you should see log output from nginx and NodeJs.

Make a change to the "hello world" output of [./app2/app.js](./app2/app.js) and restart the app2 container:

```
$ docker-compose -f docker-compose-app2.yml restart app2
```

When you refresh your browser, the your change should appear. This is because the source of app2
is linked into the container as a volume. The restart is necessary to pick up
the change because NodeJS only interprets your code on initial startup.

Stop and destroy app2:

```
$ docker-compose -f docker-compose-app2.yml down
```

## Running app1

The default file name is `docker-compose.yml`, so we don't need to supply the
`-f` parameter:

```
$ docker-compose up -d
```

List the running containers; `8888` is the public port for app1. Also note that
app2's nginx is running on 8890, as redefined in
[./docker-compose.yml](./docker-compose.yml), as opposed to its
original 8889. Either way, each public port within a set of running containers
must be unique or Docker will not allow them to start.

```
$ docker-compose -f ps
             Name                      Command          State               Ports
---------------------------------------------------------------------------------------------
dockercomposedemo_app1_1         php-fpm                Up      9000/tcp
dockercomposedemo_app2_1         node /app/app.js       Up      9001/tcp
dockercomposedemo_app2_nginx_1   nginx -g daemon off;   Up      443/tcp, 0.0.0.0:8890->80/tcp
dockercomposedemo_nginx_1        nginx -g daemon off;   Up      443/tcp, 0.0.0.0:8888->80/tcp
```

Note that there are two nginx containers running, both of which are instances of
the same image which you can verify with `docker ps`.

Follow the log output:

```
$ docker-compose logs -f
```

In your browser, visit `http://localhost:8888/app1/`. You should see the output
of app2 included below the output of app1. In your terminal, you should see log
output from all four containers tracing the request through each.

Now, make a change to app1's output by editing
[./app1/index.php](./app1/index.php). Refresh the browser and your changes will
appear automatically since the source code is shared with the app1 container as
a volume and PHP is interpreted per request.

### Useful commands

Note that commands that reference a specific container (`exec`, for example) use the
service names from the compose file. These are considerably easier to deal with
than the actual docker container name, which will be something like
"dockercomposedemo_nginx_1".

#### config

Config will show the "merged" version of your Docker Compose configuration,
which is useful when dealing with compose files which extend each other.

```
$ docker-compose config
```

#### exec

Execute commands interactively in a running container; the following logs you
into a shell on the nginx container.

```
$ docker-compose exec nginx sh
```

#### logs

Follow output for a specific container, if provided, or the whole group.

```
$ docker-compose logs -f nginx
```

### Starting and stopping containers

Docker Compose supports various options for starting, stopping, and destroying
containers which are wrappers around Docker's functionality. For simplicity
during development, it's easiest to use `docker-compose up` and `docker-compose
down`. The latter completely destroys the container, making it easy to return to
a known good state.
