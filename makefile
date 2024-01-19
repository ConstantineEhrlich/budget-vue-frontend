local-deploy:
	@eval $$(minikube docker-env) && \
	docker build -t budgetfront .
	kubectl apply -f deployment.yaml
	kubectl apply -f service.yaml

reload:
	@eval $$(minikube docker-env) && \
	docker build -t budgetfront .
	kubectl rollout restart deployment budgetfront
	

chrome:
	/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --remote-allow-origins=http://localhost:9229 --remote-debugging-port=9229