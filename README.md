# EC2

## Definitions
- EC2: Amazon Container Service;
- EC2 Container Registry: Private registry where container images are stored and managed;
    - Encrypted, redundant and highly-available;
    - Permission level can be configured with aws IAM;
    - Keeps track of every container and how much resources they have;
    - EC2 instances are linked in a virtual prived cloud (VPC)
- EC2 Agent: Containers orchestration


## Commands
Command | Description
--------|------------
`aws ecr list-images --repository-name testing-purposes-repo` | List images from a repository

## Steps
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
- Create, upload and run a task definition: Specifications about each container to be launched.
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