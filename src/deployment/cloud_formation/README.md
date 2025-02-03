# Deployment

Navigate to AWS CloudFormation portal. Select `Create stack/With new resources (standard)` for each following stack

## EKS Cluster

- S1. Select `Choose existing template` and `Upload a template file`. Upload the `deployment/cloud_formation/EKS_Proxy.yaml`. Then hit next
- S2.
  1. Fill the stack name (e.g. `EKSProxy`)
  2. Fill the following param
    a. `RoleArn`: Get the arn URI for role `LabRole` from [here](https://us-east-1.console.aws.amazon.com/iam/home?region=us-east-1#/roles/details/LabRole), then fill into the place holder
    b. `KeyName`: Select the first one from the dropdown
    c. Leave the rest as default
  3. Hit next

- S3. In Permission section, select the IAM role `LabRole`, then click next
- S4. Review and create stack

## EKS Proxy

- S1. Select `Choose existing template` and `Upload a template file`. Upload the `deployment/cloud_formation/EKS_Proxy.yaml`. Then hit next
- S2.
  1. Fill the stack name (e.g. `EKSProxy`)
  2. Fill the following param
    a. `KeyName`: Select the first one from the dropdown
    b. `VpcId`: Select the one that is labeled cluster template name from the dropdown
    c. `SubnetId`: Select the any VPC that is flagged as PublicSubnet from the dropdown
    d. `EksClusterName`: Leave as default
  3. Hit next

- S3. In Permission section, select the IAM role `LabRole`, then click next
- S4. Review and create stack

