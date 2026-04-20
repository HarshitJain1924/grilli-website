# Grilli Website: Kubernetes Architecture & Implementation

This document provides a comprehensive overview of the Kubernetes (K8s) integration within the Grilli project. It explains the project's architecture, the specific configurations used, and the rationale behind choosing Kubernetes for orchestration.

## 🏗️ Project Architecture

The Grilli project is built as a microservices-based application, consisting of four main layers orchestrated by Kubernetes:

1.  **Frontend**: A responsive web application served via Nginx.
2.  **Backend**: A Node.js/Express-based API server handling business logic and MongoDB interactions.
3.  **Database**: A MongoDB instance (port 27017) with persistent storage via a `PersistentVolumeClaim` (PVC).
4.  **Infrastructure**: A **Metrics Server** (running in the `kube-system` namespace) that collects real-time CPU and memory usage to enable automated pod scaling.

---

## ☸️ Kubernetes Components

All manifests are organized within the `/k8s` directory for modular management:

### 1. High Availability & Dynamic Scaling (`hpa.yaml`)

- **Static Replicas**: The baseline for the project is 2 replicas per service for fault tolerance.
- **Horizontal Pod Autoscaling (HPA)**: The cluster is configured to handle traffic spikes dynamically:
  - **Backend**: Scales up to **10 replicas** if CPU utilization hits **70%**.
  - **Frontend**: Scales up to **5 replicas** if CPU utilization hits **80%**.
- **Self-Healing**: Kubernetes monitors pod health via Liveness and Readiness probes, automatically restarting crashed containers.

### 2. Service Discovery & Networking

- **External Access**: The `frontend-service` is exposed via a `LoadBalancer` (port 9090).
- **Internal Communication**: Services communicate securely via internal DNS names (e.g., `backend-service:5000`).

### 3. Data & Configuration Management (`secrets.yaml` & `configmap.yaml`)

- **Security**: Sensitive data (Database URIs, passwords) is encrypted in **K8s Secrets**.
- **Config**: Environment-specific settings are injected via **ConfigMaps**, allowing the same code to run in development or production.

### 4. Professional Monitoring (`monitoring.yaml`)

- Dedicated **`monitoring` Namespace**: Isolates observability tools from the main application.
- **Prometheus**: Scrapes performance metrics from all running pods.
- **Grafana**: Provides a dark-themed visual dashboard for real-time traffic and error tracking.

---

## 🚀 Why Kubernetes? (The "Kubernetes Advantage")

1.  **No Single Point of Failure**: With replicas and self-healing, the Grilli site remains online even if primary servers fail.
2.  **Zero-Downtime Updates**: Uses "Rolling Updates" to deploy new code without interrupting active customers.
3.  **Optimized Costs**: Resource limits ensure we only pay for the CPU/Memory we need, and scales down automatically when the restaurant is closed or traffic is low.
4.  **Infrastructure as Code**: The entire environment can be recreated in minutes on any cloud provider using these exact YAML files.

---

## 🏗️ CI/CD Pipeline (Automated Workflow)

The project implements a professional **Continuous Integration and Continuous Deployment (CI/CD)** pipeline using **GitHub Actions** and **Docker Hub**:

1.  **Automated Build (`main.yml`)**: Every push to the `main` branch triggers a GitHub Action that:
    *   Builds fresh Docker images for both Frontend and Backend.
    *   Pushes them to the `harshitjain1924` Docker Hub registry with `:latest` and `:SHA` tags.
2.  **Remote Image Pulling**: The Kubernetes manifests (`backend.yaml` / `frontend.yaml`) are configured with `imagePullPolicy: Always`, ensuring that the cluster always pulls the latest code from the remote registry.
3.  **Local CD Bridge**: The `deploy.bat` script is optimized to pull these pre-built remote images, reducing local build times and ensuring consistency across environments.

---

## 🛠️ Automated Management

The project uses automated scripts to streamline common tasks on Windows:

- **`deploy.bat`**: The master deployment script. It builds Docker images, sets up the Metrics Server, and applies all application manifests in the correct order.
- **`run.bat`**: A helper script to quickly port-forward the project to `localhost:9090` for local access.
- **`monitor.bat`**: Launches the Prometheus/Grafana dashboard for live cluster analytics.

---

_Document updated & maintained by Antigravity AI._
