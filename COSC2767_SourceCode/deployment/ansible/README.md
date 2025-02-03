Ansible scripts to configure EKS Proxy

## Prerequisites

- Have a Ansible server setup
- Can ssh to Ansible server
- Have setup this repo and ssh-key on Ansible server
- Have correct pem key to connect to proxy in .ssh folder in Ansible server
- EKS proxy instance has been succesfully spun up
- Jenkins master instance has been succesfully spun up
- EC2 Images
  - EKS proxy and Jenkin master: Amazon Linux
  - Jenkin slave: Ubutun 22.04

## Steps

1. Login to Ansible server

``` bash
sudo su ansibleadmin
```

2. Make sure the proxy IP in `/etc/ansible/hosts` is correct for `eks_proxy` and `jenkins_master` instance. Can check the connections is working by running `ansible -m ping all`
3. Go to the directory `cd /home/ansibleadmin/cosc2767-assignment-2-group-2024c-devops-team-1/deployment/ansible`
4. Run the playbook `ansible-playbook setup_eks_proxy.yml`
 If the playbook runs successfully, it will logs the argoCD configuration at the end of the playbook

5. Run the playbook `ansible-playbook setup_jenkins_master.yml`
 If the playbook runs successfully, it will logs jenkin admin password and port at the end of the playbook

6. Run the playbook `ansible-playbook setup_jenkins_slave.yml`
