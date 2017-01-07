---
title: Running multiple websites with Docker & Nginx.
updated: 2017-01-04 17:05
category: DOCKER
description: "Get your your web server (Nginx) running multiple websites in a Docker container"
keywords: "Docker Nginx container web server web site website osx mac"
comments: true
---

... and a Happy New Year!

Wow! 2017! I hardly believe the new year new year arrived. Anyway, new year or not, there's a new post.

Lately I've set up a private server to create some web service and I wanted to make some experiment with Docker. Given that the first thing was to set containerized web server, I choose Nginx then started to play with it and start from basic tasks.

Cool thing about Docker is that you can set up and run a container in minutes. Probably some of you do not know what Docker and a container is. In the Docker-world a container can be seen as a ***light*** virtual machine, that sits on top of a host OS. Nice thing about containers is that they are extremely light ( ~100MB) and can be set up, run, and managed with far less overhead that a usual virtual machine. Oh and the cool thing is that you can run multiple containers on the same host system with less requirements of a single VM. Great!

Typical usage of Docker containers relates to microservices architectures. In these scenarios you can containerize each micro-service and deploy all of them on the same server. Or each of them in a different AWS EC2 instance. Or duplicate each service. or split your services in the way you prefer. You can also manage all your automate the container creation&management using *Dockerfile*s and Docker Compose.

I will completely skip the part about how to set up Docker. You should essentially download and install Docker and run the Docker daemon. But please refer to [Docker official website][1] to have detailed and updated instructions.

[Here][3]'s a great introduction on how to set up and manage a nginx container with ease. And you can find additional information on the official nginx Docker image, [here][3].

Being a newbie I started from there and from the [official nginx documentation][4]. However, I had some issues in making everything work as expected, hence I decided to summarize my findings and help you set up all your websites on a containerized nginx instance.

Let's start. A Docker feature that comes handy in this situation is the possibility of mapping folders of the host machine to folders inside the container. It allows you to keep all the files you need in a container on the host machine file-system with no need to copy them into the container, or even having multiple containers reading the same files.

We will take advantage of it create a container that reads both the configuration and the website content from the host machine (your laptop, or the server).

Let's suppose I want to serve two websites *francescousai.info* and *example.com*. 
Let's create a folder to store all our web server files. 

```sh
cd ~/Documents     // navigate to your Documents directory
mkdir docker       // create a folder to store our experiments
cd docker                  
mkdir web_server   // create a folder to store all the web_server files
cd web_server
mkdir content      // here we will store websites
mkdir conf         // here we will store configuration files
pwd                // in my case is /Users/usai/Documents/docker/web_server
```

Then you should copy the entire folders containing your websites in `~/Documents/docker/web_server/content`. In my case I will have two folders for the two websites:

```sh 
/Users/usai/Documents/docker/web_server/content/francescousai
/Users/usai/Documents/docker/web_server/content/example
```

Now let's focus on *nginx*. Nginx configuration is based on directives, some of them are simple as `listen 80;`, some others are more complex and use curly braces to enclose blocks of other directives. If you need to serve multiple websites with a single nginx instance, you will need multiple `server blocks`, or better you will need multiple server block directives to configure each of them. 

The default nginx configuration of the official Docker image will include all the ***.conf*** files in the `/etc/nginx/conf.d` folder. We will use these files to add the needed server block directives.	

In my case I created one file for each website. For the sake of completeness, I must say that *francescousai.info* is running a [Jekyll][5]-generated blog hence it needs some special treatment to handle the blog urls, which do not include the *.html* extension (as you can see in the address bar).

For this website the configuration will look like this:

```yaml
server{
    listen  80;                                       #1
    server_name francescousai.info;                   #2
    root /usr/share/nginx/html/sites/francescousai;   #3

    location / {                                      #4
        try_files $uri $uri.html $uri/ /404.html;     #5
    }
}
```
This configuration says to nginx :

1. ehi mr. server, please listen on port 80...
2. ...and you should only handle the request if it is for the website *francescousai.info*
3. the files you should serve, are located at the provided path. This point got me crazy, It's not stated anywhere if the `root` path is absolute or relative to the default `/usr/share/nginx/html`. It is not, you should put the absolute path.
4. `location directive allows to define some location (path) specific configurations. In this case `/ will match all *url*s, hence the configuration will apply to all urls.
5. Since this blog is generated using Jekyll, I need this line to try to match the request with no extension. It literally says : try with the requested *uri*. If you do not find any file that matches, try appending `.html`, if not found, try with a trailing `/`. If all the previous fail, just point to `404.html`. Use these instructions with care, because if you do not have a last resort result (in this case 404.html) or it cannot be found, each failed call will end up in a loop of attempts, leading to an Internal Server Error.

The configuration for `example.com` is essentially the same, with updated `server_name`, `root` and without the location directive, since the other website do not need this special url handling.

```yaml
server{
    listen  80;
    server_name example.com;
    root /usr/share/nginx/html/sites/example;
}
```

Remember to update your *hosts* file to check the local configuration, you will need to add something like:

```
127.0.0.1 francescousai.info
127.0.0.1 example.com
```

In my case I used `francescousai.local.info` for the local configuration to be able to reach the real website.

Wow what a journey, we are now ready to launch our containerized nginx instance. Go to the command line and prompt:

```sh
docker run --name web_server \
-v /Users/usai/Documents/docker/web_server/content/:/usr/share/nginx/html:ro \
-v /Users/usai/Documents/docker/web_server/conf.d:/etc/nginx/conf.d:ro \
-p 80:80 -d nginx
```

It tells Docker to: 

1. run a container named ***web_server***
2. map the host's `content` folder to container's `/usr/share/nginx/html` folder.
3. map the host's `conf.d` folder to container's /etc/nginx/conf.d`.
4. with the trailing `:ro in the two mappings, we allow read only access for the container
5. map port 80 on the host to port 80 on the container
6. run detached (-d), that means, without console access (you can attach later if really needed). You can attach to a running container with `docker exec -ti <container name> bash`.
7. use the official nginx image, if not found locally, look into Docker Hub.

Now prompting `docker ps` you should see the list of all running containers, and you should see our *web_server* entry. If it does not happen, you can run `docker ps -l` to see the entire containers list. Usually if something goes wrong, you should see the container with status `Exit(1)` which means it exited with errors. It happened to me like ... thousands times. What you should do is inspect the logs using `docker logs web_server` to track down the error. Once it is fixed you can remove the container with `docker rm web_server` and launch the previously described `docker run` command.

Once everything is fine, you should be able to access your websites with your favourite browser. If it does not work, check the logs and nginx configuration. It took me multiple hours to find out where the problems were, so do not panic, be organized and do not give up!

I hope this introduction will allow you to get started. It was a quite long blog post. Since I am pretty new to Docker and web server configurations in general, I am sure I had dealt with silly problems that a more experienced guy would not had. However I hope this walkthrough will be useful to at least 1 person. 

Since I am not 100% sure that what I described is a best practice, I will update this post in case I discover some issues or better ways to set up a containerized nginx instance.

Cheers,
have fun.


[1]: https://www.docker.com/products/docker
[2]: https://blog.docker.com/2015/04/tips-for-deploying-nginx-official-image-with-docker/
[3]: https://hub.docker.com/_/nginx/
[4]: http://nginx.org/en/docs/
[5]: https://jekyllrb.com/