# COSC2767 - Assignment 2 README - January 2025

This is the repository of Group 1's project assignment for the System Development and Operations course, semester 2024C, at RMIT University Vietnam.

## Introduction to the Pipeline

This repository is the work of the DevOps pipelining project to help the client in the CI/CD (Continuous Integration/Continuous Delivery) process for his website application. Starting from a code repository, one commit at a time, this pipe can easily help him automate the development and deployment process and ensure automation, efficiency, reliability, scalability, and repeatability.

## Important links
- Video Demo: https://www.youtube.com/watch?v=vaDWYDjeppE
- Project Repository: https://github.com/RMIT-Vietnam-Teaching/cosc2767-assignment-2-group-2024c-devops-team-1

## The Client's Problem Statement

The client is a web developer tasked with developing and maintaining the RMIT E-commerce store, which sells various RMIT merchandise. He is facing significant challenges and struggling with deployment and management. due to his lack of experience with DevOps and CI/CD pipelines.

## Technologies in this Pipeline

This pipeline uses the following technologies:

- Jenkins (Main character, Primary CI/CD Platform)
- ArgoCD (Assistant CI/CD Platform)
- Docker (containerization tools)
- Ansible (deployment and management)
- Kubernetes (Orchestration)
- AWS and related services (Hosts and Servers)

## The Pipeline Structure in a Picture

Here's the structure of the pipeline, simulated with tools and works
![Picture2](https://github.com/user-attachments/assets/f1c021c0-6cf2-49ee-9203-a3168afda0b7)

From the diagram above, our DevOps process begins with provisioning cloud infrastructure using AWS CloudFormation and configuring servers via Ansible playbooks. The application follows a Git-based workflow, where developers create Pull Requests (PRs) to the protected main branch. Upon approval, the CI pipeline orchestrated by Jenkins handles building, testing, and pushing Docker images for both frontend and backend services to Docker Hub. In the Continuous Deployment (CD) phase, the DevOps user manually updates image tags, and ArgoCD automatically deploys the updated application using a blue/green strategy. Real-time monitoring is handled by Prometheus, with dashboards provided by Grafana. Alerts ensure that any deployment issues are promptly addressed. For a detailed breakdown of the DevOps process, refer to APPENDIX E.

## Pipeline feature 
- Automated Build and Test Process with Jenkins and GitHub PR rules.
- Controlled deployment via manual image tag updates and ArgoCD-based GitOps.
- Blue/Green Deployment Strategy to minimize downtime and enable fast rollbacks.
- Comprehensive Testing at unit, integration, and end-to-end levels.
- Centralized Configuration Management using Ansible and Helm.
- Real-Time Monitoring and Alerting with Prometheus, Grafana, and email notifications.
- Scalability and High Availability through AWS services (EKS, EC2, Load Balancer).
- Autoscaling for Kubernetes resources with Horizontal Pod Autoscaler.
- Easy deployment and manual/automatic rollback mechanism to EKS cluster with argoCD.


### Run the whole app with Docker

- Run on dev environment

```shell
NODE_ENV=development docker-compose up
```

- Run on production environment
- Run on production environment

```shell
NODE_ENV=production docker-compose up
```

### Run unit tests for the Frontend (client folder)

- Navigate to the "client" folder then type the test command

```shell
cd client/tests__
npm test
```

### Run unit tests for Backend (server folder)

- Navigate to the "server" folder then type the test command

```shell
cd client/__tests__
npm test
```

### Run integration tests

**Pre-req:** To run the integration tests locally, you need to have the full project running on your local machine.

- From the root directory of the project, run the following command:

```bash
npm run dev
```

- Open a new terminal and run the following command:

```bash
cd server && npm run test:integration
```

### Ansible usage

Just so to let everyone know, an EKS proxy is required for the next steps (Please refer to the EKS Proxy below).
This project uses Ansible as the main control management tool. To run those please do the following:

- Connect to the Ansible

```bash
sudo su ansibleadmin
```

- Check connection using the command

```bash
ansible -m ping all
```

- Navigate to the "deployment/ansible" directory and run the playbook there:

```bash
cd /home/ansibleadmin/cosc2767-assignment-2-group-2024c-devops-team-1/deployment/ansible
ansible-playbook setup_eks_proxy.yml
```

### EKS Proxy for Deployment

Navigate to the AWS CloudFormation portal. Select "Create stack/With new resources (standard)" and follow the guide for each of the following stacks:

#### EKS Cluster

- S1. Select `Choose existing template` and `Upload a template file`. Upload the `deployment/cloud_formation/EKS_Proxy.yaml`. Then hit next
- S2. Do the following
  1. Fill the stack name (e.g. `EKSProxy`)
  2. Fill ONLY the following param (The rest are left default from the system)
     a. `RoleArn`: Get the arn URI for role `LabRole` from [here](https://us-east-1.console.aws.amazon.com/iam/home?region=us-east-1#/roles/details/LabRole), then fill into the place holder
     b. `KeyName`: Select the first one from the dropdown
  3. Click the Next button
- S3. In the Permission section, select the IAM role `LabRole`, then click Next
- S4. Review and create stack

#### EKS Proxy

- S1. Select `Choose existing template` and `Upload a template file`. Upload the `deployment/cloud_formation/EKS_Proxy.yaml`. Then hit next
- S2. Do the following
  1. Fill the stack name (e.g. `EKSProxy`)
  2. Fill in the following param
     a. `KeyName`: Select the first one from the dropdown
     b. `VpcId`: Select the one that is labeled cluster template name from the dropdown
     c. `SubnetId`: Select any VPC that is flagged as PublicSubnet from the dropdown
     d. `EksClusterName`: Leave as the default
  3. Click the Next button
- S3. In the Permission section, select the IAM role `LabRole`, then click next
- S4. Review and create the stack

## Other details of the pipeline

For instructions on how to use particular in the pipeline, refer to the corresponding README files in the respective directories.

## Key people

- Instructor/Mentor: Mr. Tom Huynh, MSc. [@tomhuynhsg](https://github.com/TomHuynhSG)
- Project Manager: Ms. Le Dinh Ngoc Quynh [@quynhethereal](https://github.com/quynhethereal)
- Containerization Engineer: Mr. Le Minh Duc [@dealoux](https://github.com/dealoux)
- Developer and Integration Tester: Mr. Vu Tien Quang [@vtq2301](https://github.com/vtq2301)
- Developer: Mr. Vuong Gia An [@s3757287](https://github.com/s3757287)
- Backend Tester and Secretary: Mr. Tran Minh Nhat [@nhattranb](https://github.com/nhattranb)
