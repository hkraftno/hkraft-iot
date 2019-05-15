Temperature Map:
================

Shows a map of the different sensors we have that has a "temperature" property
that is less than 9999 (you need to filter on something)

Build:
------
    make docker

Run the server:
---------------
    make run

or just

    make

Deploy:
-------
You need to run `gcloud auth configure-docker` to be able to push the docker
images to the hkraft google docker registry.

After that you can just run `make deploy` to deploy the application.

Dependencies:
-------------
- docker
- gcloud
- make
- go

Manage:
-------
Go to [google cloud run console](https://console.cloud.google.com/run?authuser=0&organizationId=273206105547&project=hkraft-iot) to manage the service
