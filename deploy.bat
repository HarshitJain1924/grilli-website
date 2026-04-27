@echo off
setlocal

echo 🚀 Starting Grilli Website Deployment to Kubernetes...

:: Pull Latest Images from Docker Hub
echo 📦 Pulling Latest Backend Image...
docker pull harshitjain1924/grilli-backend:latest

echo 📦 Pulling Latest Frontend Image...
docker pull harshitjain1924/grilli-frontend:latest

:: Apply Kubernetes Manifests
echo ☸️ Applying Kubernetes Manifests...

:: 1. Infrastructure (Metrics Server)
echo Applying Metrics Server...
kubectl apply -f k8s/metrics-server.yaml

:: 2. Configuration and Secrets
echo Applying ConfigMaps and Secrets...
kubectl apply -f k8s/monitoring.yaml
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/secrets.yaml
kubectl apply -f k8s/mongodb.yaml

:: 2. Backend
echo Applying Backend...
kubectl apply -f k8s/backend.yaml

:: 4. Frontend
echo Applying Frontend...
kubectl apply -f k8s/frontend.yaml

:: 5. Auto-scaling (HPA)
echo Applying Auto-scaling rules...
kubectl apply -f k8s/hpa.yaml

:: Force Restart to pick up new images
echo 🔄 Forcing restart to apply new code...
kubectl rollout restart deployment/backend
kubectl rollout restart deployment/frontend

echo ✅ Deployment completed successfully!
echo 📍 Use 'kubectl get pods' to check status.
pause
