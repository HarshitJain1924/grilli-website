@echo off
echo 🚀 Starting Grilli Website Port Forwarding...
echo 📍 Access the site at: http://localhost:9090
echo 📍 Access the admin at: http://localhost:9090/admin.html
echo.
echo (Keep this window open while using the site)
echo.
kubectl port-forward service/frontend-service 9090:9090
pause
