@echo off
title 🚀 Grilli Monitoring Bridge
echo --------------------------------------------------
echo 📊 Starting Grilli Monitoring Port Forwarding...
echo --------------------------------------------------
echo.
echo 🛡️ Access Grafana Dashboard at: http://localhost:3000
echo   (Login: admin / admin)
echo.
echo 🧬 Access Prometheus Engine at: http://localhost:9090
echo.
echo 🚨 Access Alertmanager at: http://localhost:9093
echo.
echo 💡 Keep this window open while you are monitoring.
echo --------------------------------------------------
echo.

:: Start port forwarding for Grafana
start "Grafana Bridge" /min kubectl port-forward svc/grafana 3000:3000 -n monitoring

:: Start port forwarding for Prometheus
start "Prometheus Bridge" /min kubectl port-forward svc/prometheus 9090:9090 -n monitoring

:: Start port forwarding for Alertmanager
start "Alertmanager Bridge" /min kubectl port-forward svc/alertmanager 9093:9093 -n monitoring

echo ✅ Bridges are OPEN! Press any key to stop them.
pause >nul
