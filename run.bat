@echo off
echo 🚀 Starting Grilli Website Port Forwarding...
echo 📍 Access the site at: http://localhost:80
echo 📍 Access the admin at: http://localhost:80/admin.html
echo.
echo (Keep this window open while using the site)
echo.
kubectl port-forward service/frontend-service 80:80
pause
