
# What is a Docker image?
# Think of a Docker image as a recipe or blueprint for creating a container (which is like a small, lightweight virtual computer).

# The image contains everything needed to run a program: the operating system files, software, libraries, and your app code (or configs).

# It’s like a snapshot of a ready-to-go environment.

# What does FROM nginx:alpine mean?
# This means your Dockerfile starts from a pre-made image called nginx:alpine.

# nginx:alpine is an official image that contains:

# The NGINX web server software installed.

# A very lightweight Linux operating system called Alpine inside it.

# You don’t have to build NGINX or the OS yourself — Docker pulls this image and uses it as the base for your container.

FROM nginx:alpine

COPY nginx.conf /etc/nginx/nginx.conf

# This copies your custom NGINX configuration file (nginx.conf) from your local api-gateway folder into the container’s file system at /etc/nginx/nginx.conf.

# /etc/nginx/nginx.conf is where NGINX expects its main config file.

# By doing this, when the container runs, NGINX uses your routing rules and settings instead of the default ones.
