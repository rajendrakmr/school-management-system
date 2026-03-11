# 📘 School ERP SaaS Platform

> A production-grade, multi-tenant School Management System built from scratch and deployed on AWS EKS using a full DevSecOps pipeline.

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![MySQL](https://img.shields.io/badge/MySQL-005C84?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![Kubernetes](https://img.shields.io/badge/Kubernetes-326CE5?style=for-the-badge&logo=kubernetes&logoColor=white)](https://kubernetes.io/)
[![AWS EKS](https://img.shields.io/badge/AWS_EKS-FF9900?style=for-the-badge&logo=amazonaws&logoColor=white)](https://aws.amazon.com/eks/)
[![Jenkins](https://img.shields.io/badge/Jenkins-D24939?style=for-the-badge&logo=jenkins&logoColor=white)](https://www.jenkins.io/)
[![ArgoCD](https://img.shields.io/badge/ArgoCD-EF7B4D?style=for-the-badge&logo=argo&logoColor=white)](https://argo-cd.readthedocs.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

---

## 📌 Table of Contents

- [Overview](#-overview)
- [Live Demo](#-live-demo)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [CI/CD Pipeline](#-cicd-pipeline)
- [Features](#-features)
- [Screenshots](#-screenshots)
- [Getting Started](#-getting-started)
  - [Run Locally](#1-run-locally)
  - [Run with Docker](#2-run-with-docker-compose)
  - [Deploy to Kubernetes](#3-deploy-to-kubernetes)
- [DevSecOps Setup](#-devsecops-setup)
- [Project Structure](#-project-structure)
- [Author](#-author)

---

## 🧭 Overview

**School ERP SaaS** is a full-stack, multi-tenant school management platform that I built from scratch — both the application and the complete DevOps infrastructure.

The goal was to simulate a real-world production deployment: starting from a React + Node.js app, containerizing it with Docker, securing it with DevSecOps tools (SonarQube + Trivy), and deploying it on AWS EKS via a Jenkins + ArgoCD GitOps pipeline.

**This project demonstrates:**
- Full-stack development with React (TypeScript) + Node.js + MySQL
- Containerization with Docker and Docker Compose
- Kubernetes deployment with Helm charts on AWS EKS
- End-to-end CI/CD pipeline: Jenkins → SonarQube → Trivy → DockerHub → ArgoCD → EKS
- GitOps workflow with ArgoCD for continuous delivery
- Role-based access control (Admin, Teacher, Student, Parent)
- Multi-school SaaS architecture with subscription-based plans

---

## 🚀 Live Demo

> _Screenshots of the running application below. A live demo video is coming soon._

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, Vite, TailwindCSS, ShadCN UI |
| Backend | Node.js, Express.js, Sequelize ORM |
| Database | MySQL 8.0 |
| Containerization | Docker, Docker Compose |
| Orchestration | Kubernetes (AWS EKS), Helm |
| CI/CD | Jenkins, GitHub Webhooks |
| GitOps | ArgoCD |
| Security Scanning | SonarQube (SAST), Trivy (container vulnerability) |
| Monitoring | Prometheus, Grafana |
| Cloud | AWS EC2, AWS EKS, IAM |

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────┐
│                   Developer Machine                  │
│         React + TypeScript + Node.js + MySQL         │
└────────────────────┬────────────────────────────────┘
                     │ Git Push
                     ▼
┌─────────────────────────────────────────────────────┐
│                    GitHub Repo                       │
│              Webhook triggers Jenkins                │
└────────────────────┬────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────┐
│                Jenkins CI Pipeline                   │
│  Build → SonarQube Scan → Trivy Scan → Docker Build  │
│           → Push to DockerHub → Update GitOps Repo   │
└────────────────────┬────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────┐
│                ArgoCD (GitOps CD)                    │
│     Watches GitOps repo → Syncs to AWS EKS cluster  │
└────────────────────┬────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────┐
│               AWS EKS Cluster (eu-west-1)            │
│   Frontend Pod | Backend Pod | MySQL Pod | Ingress   │
│        Prometheus + Grafana for monitoring           │
└─────────────────────────────────────────────────────┘
```

---

## 🔄 CI/CD Pipeline

```
Code Push
   │
   ├─► Jenkins triggered via GitHub Webhook
   │
   ├─► Maven/npm Build & Unit Tests
   │
   ├─► SonarQube — Static code analysis (SAST)
   │
   ├─► Trivy — Docker image vulnerability scan
   │
   ├─► Docker Build & Push to DockerHub
   │
   ├─► Update image tag in GitOps repo (Helm values)
   │
   └─► ArgoCD detects change → Deploys to AWS EKS ✅
```

> Jenkins pipeline defined in [`Jenkinsfile`](./Jenkinsfile)  
> Kubernetes manifests and Helm values in [`GitOps/`](./GitOps)  
> K8s deployment files in [`k8s/`](./k8s)

---

## ✅ Features

### Implemented
- 🔐 Role-based authentication — Admin, Teacher, Student, Parent
- 🏫 Multi-school SaaS support (multi-tenancy)
- 💳 Subscription-based SaaS plans (Basic, Pro, Enterprise)
- 📊 Admin dashboard with school-level analytics
- 🐳 Dockerized frontend + backend + database
- ☸️ Deployed on AWS EKS with Kubernetes manifests
- 🔄 Full GitOps CD pipeline with ArgoCD
- 🔍 Security scanning integrated in CI (SonarQube + Trivy)
- 📈 Monitoring with Prometheus + Grafana

### Roadmap
- 📚 Student & Teacher management modules
- 💰 Fees & Finance module
- 📝 Exam & Grading system
- 📱 Mobile app (React Native)

---

## 🖼 Screenshots

### Login Page
![Login](assets/login.png)

### Role Selection
![Roles](assets/roles.png)

### Dashboard Pagination
![Pagination](assets/pagination.png)

### Architecture Diagram
![Architecture](assets/saas_architecture.png)

---

## ⚡ Getting Started

### Prerequisites
- Node.js 18+
- Docker & Docker Compose
- MySQL 8.0 (for local run)
- kubectl + eksctl (for K8s deployment)
- AWS CLI configured (for EKS)

---

### 1. Run Locally

```bash
# Clone the repo
git clone https://github.com/rajendrakmr/school-management-system.git
cd school-management-system

# Start the backend
cd backend
npm install
npm run dev

# Start the frontend (new terminal)
cd frontend
npm install
npm run dev
```

Visit: `http://localhost:5173`

---

### 2. Run with Docker Compose

```bash
# From root of the project
docker compose up -d --build

# Visit the app
http://localhost:3000
```

This spins up: **Frontend + Backend + MySQL** in isolated containers.

---

### 3. Deploy to Kubernetes (AWS EKS)

#### Step 1 — Set up AWS infrastructure

```bash
# Configure AWS CLI
aws configure

# Create EKS Cluster
eksctl create cluster --name=sms-erp \
  --region=eu-west-1 \
  --version=1.33 \
  --without-nodegroup

# Associate IAM OIDC Provider
eksctl utils associate-iam-oidc-provider \
  --region eu-west-1 \
  --cluster sms-erp \
  --approve

# Create Node Group
eksctl create nodegroup --cluster=sms-erp \
  --region=eu-west-1 \
  --name=sms-erp-ng \
  --node-type=t2.medium \
  --nodes=2 \
  --nodes-min=1 \
  --nodes-max=3 \
  --node-volume-size=29 \
  --ssh-access \
  --ssh-public-key=eks-sms-erp-key
```

#### Step 2 — Install ArgoCD

```bash
kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

# Expose ArgoCD UI
kubectl patch svc argocd-server -n argocd -p '{"spec":{"type":"NodePort"}}'

# Get initial admin password
kubectl -n argocd get secret argocd-initial-admin-secret \
  -o jsonpath="{.data.password}" | base64 -d
```

#### Step 3 — Apply Kubernetes manifests

```bash
kubectl apply -f k8s/
```

---

## 🔐 DevSecOps Setup

### SonarQube (Code Quality)

```bash
docker run -itd --name=sonarqube -p 9000:9000 sonarqube:lts-community
```

Access at `http://localhost:9000` — configure your project token and add it to Jenkins credentials.

### Trivy (Container Security Scan)

```bash
sudo apt-get install wget apt-transport-https gnupg lsb-release -y
wget -qO - https://aquasecurity.github.io/trivy-repo/deb/public.key | sudo apt-key add -
echo deb https://aquasecurity.github.io/trivy-repo/deb $(lsb_release -sc) main \
  | sudo tee -a /etc/apt/sources.list.d/trivy.list
sudo apt-get update && sudo apt-get install trivy -y

# Scan a Docker image
trivy image rajendrakmr/school-management-system:latest
```

---

## 📁 Project Structure

```
school-management-system/
├── frontend/               # React + TypeScript + Vite
├── backend/                # Node.js + Express + Sequelize
├── k8s/                    # Kubernetes manifests (Deployments, Services, Ingress)
├── GitOps/                 # ArgoCD app config + Helm values
├── assets/                 # Screenshots and architecture diagrams
├── Jenkinsfile             # Jenkins CI pipeline definition
├── docker-compose.yml      # Local multi-container setup
├── setup.sh                # Environment setup script
└── README.md
```

---

## 👨‍💻 Author

**Rajendra Kumar Marandi**  
Frontend Developer → DevOps Engineer  
📍 Kolkata, India

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/rajendraakmr/)
[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/rajendrakmr)

---

> ⭐ If you found this project helpful or interesting, please consider giving it a star — it helps others find it too!