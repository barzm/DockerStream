Ahab.io
=========

Introduction
-------------

Ahab is an open source api, built to automate data processing. Ahab lets you connect valid github repositories in a pipeline of data-processing awesomeness. Build your pipelines at [ahabdata.com](http://ahabdata.com) and run them using the provided api endpoint.


<img width="198" height="406" src="https://s3-us-west-2.amazonaws.com/ahab/Process.jpg">

Features
----------

###Open###
----------
Feel free to use any open source github repositories. You can also use any private repositories that you own.

###Language Agnostic###
---------------------

Use Repositories written in any language. As long as they have a valid Dockerfile, they will run properly in the pipeline.

###Quick###
--------------

Your data will be processed quickly using docker containers. We'll be sure to store your containers on our server so they are ready when you need them. 

###Mutable###
-------------

Edit your pipelines at any time by adding, deleting, or reordering github repositories. Your pipelines are completely customizable. 


Requirements
----------------

Github repositories can be used in a pipeline if they have a [Dockerfile](https://docs.docker.com/reference/builder/) which prescribes the execution of the application along with the data output format and location.



Getting Started
-----------------
