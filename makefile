local-deploy:
	eval $(minikube docker-env) && docker build -t budgetfront .
	kubectl apply -f deployment.yaml
	kubectl apply -f service.yaml

reload:
	eval $(minikube docker-env) && docker build -t budgetfront .
	kubectl rollout restart deployment budgetfront
	