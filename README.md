# EC2

## Definitions
- Cluster: Grouping of container instances;
- Container instance: EC2 instances running ECS agent and registered in a cluster;
- Task definitions: Description of an application with one or more container definitions;
- Scheduling: How we get our tasks on the container instances;
- Services: Allows us to run or maintain a number of instances of a task definition;
- Tasks: An instance of a task definition;
- Container: A linux container (Docker for example) created as part of a task;
- EC2: Amazon Container Service;
- EC2 Container Registry: Private registry where container images are stored and managed;
    - Encrypted, redundant and highly-available;
    - Permission level can be configured with aws IAM;
    - Keeps track of every container and how much resources they have;
    - EC2 instances are linked in a virtual prived cloud (VPC)
- EC2 Agent: Containers orchestration
- Security group: Where we define policies to who can access our instances, in what port.


## Commands
Command | Description
--------|------------
`aws ecr list-images --repository-name testing-purposes-repo` | List images from a repository

## Steps

### IAM (Identity and Access Management)
Information about what we currently have set up

- Create a new user, put it in a group and download its credentials
- Create a PEM file to allow the created user to login to any instance
    - EC2 > Network & Security > Key Pairs
    - Key pair name: <user>-key-pair-<region-name>
        - `ecsadmin-key-pair-usohio`
        - ps: Key-pairs can only be added when creating an instance;
- Add them `.pem` file to `ssh-agent`
    - `ssh-agent bash`
    - `ssh-add PEM-FILE.pem`
- Give permission to the PEM-FILE.pem of read by owner only
    - `chmod 400 PEM-FILE.pem`
- Identify the user to connect to the ec2 instance
    - `ssh -i <pem-file>.pem ec2-user@<instance-public-ip>`
    - `ssh -i ecsadmin-key-pair-usohio.pem ec2-user@13.58.44.123`

## VPC (Virtual Private Cloud)
A network for our cluster
`Services > VPC`

- CIDR block: The private IP range we want to use;
    - Common ranges: `172`, `192` or `10.`
    - `10.17.0.0/16`
    - Tenacy
        - Dedicated: The chosen IP is no longer available for another usage (PAID)
- Apply network to a security group

## Security Group
- Security group name: `ecs-sg-ohio`
- Description: `US Ohio Security Group for ECS Cluster`
- VPC: `... | ECS_VPC`
- Add rules for Inbound and Outbound:
    - `SSH TCP 22 Anywhere`
    - `HTTPS TCP 443 Anywhere`
    - `HTTP TCP 80 Anywhere`
- Give the security group a name
    - `ECS-Admin-SG`
- Consider adding ssh access to specific IP addresses. The ones with the `.pem` file

### Container
- Create an image
- Login to aws ecr
    - `aws ecr get-login --no-include-email`
- Create a repository
    - `aws ecr create-repository --repository-name <name>`
- Tag the image
    - `<USER_ARN>.dkr.ecr.<REGION>.amazonaws.com/<REPO_NAME>`
    - `687745605585.dkr.ecr.us-east-1.amazonaws.com/testing-purposes-repo`
    - ARN: Amazon Resource Name
- Push to EC2 Container Registry
    - `docker push <USER_ARN>.dkr.ecr.<REGION>.amazonaws.com/<REPO_NAME>`
    - `docker push 687745605585.dkr.ecr.us-east-1.amazonaws.com/testing-purposes-repo`
- Create a cluster: Group of EC2 instances that containers are placed onto
- Create a task definition: Specifications about each container to be launched.
    - Docker image;
    - CPU and Memory requirements;
    - Link between containers;
    - Networking and port settings;
    - Data storage volumes;
    - Security (IAM) roles;

- Delete image
    - `aws ecr batch-delete-image --repository-name <REPO_NAME> --image-ids imageTag=<IMAGE_TAG>`
    - `aws ecr batch-delete-image --repository-name testing-purposes-repo --image-ids imageTag=latest`
- Delete a repository
    - `aws ecr delete-repository --repository-name <REPO_NAME> --force`
    - `aws ecr delete-repository --repository-name testing-purposes-repo --force`

## Observations
- Clusters can be created using:
    - AWS console, cloudformation, amazon cli, amazon ecs apis;
- The image must be tagged


