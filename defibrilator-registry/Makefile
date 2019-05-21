GPC_PROJECT_ID=hkraft-iot
SERVICE_NAME=defibrilator-registry
CONTAINER_NAME=eu.gcr.io/$(GPC_PROJECT_ID)/$(SERVICE_NAME)

run: build
	docker run -p 8080:8080\
		-e CLIENT_ID=$$(gopass hjertestarterregisteret.no/client-id)\
		-e CLIENT_SECRET=$$(gopass hjertestarterregisteret.no/client-secret)\
		$(CONTAINER_NAME)
build:
	docker build -t $(CONTAINER_NAME) .
push: build
	docker push $(CONTAINER_NAME)
deploy: build push
	gcloud beta run deploy $(SERVICE_NAME)\
		--project $(GPC_PROJECT_ID)\
		--allow-unauthenticated\
		-q\
		--region us-central1\
		--set-env-vars CLIENT_ID=$$(gopass hjertestarterregisteret.no/client-id),CLIENT_SECRET=$$(gopass hjertestarterregisteret.no/client-secret)\
		--memory 128Mi\
		--image $(CONTAINER_NAME)
test:
	go test ./...
