FROM ubuntu:14.04
RUN sudo apt-get update
RUN sudo apt-get install -y nodejs npm
COPY . /src
RUN cd /src
CMD ["nodejs","/src/app.js"]
