run: docker
	docker run -p 8080:8080 eu.gcr.io/hkraft-iot/temperature-map
deploy: build
	docker push eu.gcr.io/hkraft-iot/temperature-map
	gcloud beta run deploy temperature-map --allow-unauthenticated --project hkraft-iot -q --region us-central1 --image eu.gcr.io/hkraft-iot/temperature-map
build:
	docker build -t eu.gcr.io/hkraft-iot/temperature-map .
