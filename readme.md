Ahab.io
=========

Introduction
-------------

Ahab is an open source API, built to automate data processing. Ahab lets you connect valid github repositories in a pipeline of data-processing awesomeness. We spin up and run each repository in Docker, and feed the output back to you. Build your pipelines at [ahabdata.com](http://ahabdata.com) and run them using the provided API endpoint.


<img width="198" height="406" src="https://s3-us-west-2.amazonaws.com/ahab/Process.jpg">

Features
----------

###Open###
----------
Feel free to use any open source github repositories. You can also use any private repositories that you own.

###Language Agnostic###
---------------------

Use Repositories written in any language. As long as they have a valid Dockerfile, our pipeline can run them.

###Quick###
--------------

Your data will be processed quickly using docker containers. We store your containers on our server, so they're instantly ready when you need them. 

###Flexible###
-------------

Edit your pipelines at any time by adding, deleting, or reordering github repositories. Your pipelines are completely customizable. 


Requirements
----------------

Github repositories can be used in a pipeline if they have a [Dockerfile](https://docs.docker.com/reference/builder/) which prescribes the execution of the application, along with the format and location of its data output.



Getting Started
-----------------
