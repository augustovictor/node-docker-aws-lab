# ECS AND EC2

## Benefits of EC2
- Scaling is not a problem;
- ECS api is extensible and flexible
    - Leverage third party schedulers
    - Mix and match EC2 instances
    - Integrate with CI/CD systems
- Integrates with other AWS resources

## Definitions
- IAM: Identity & Access Management
- ECS: Container management service that supports Docker containers and allows us to run apps on EC2 instances;
- Cluster: Grouping of container instances that access as a single computing resource;
- Container instance: EC2 instance that has been registered as part of a cluster;
- Container agent: Opensource tool that takes care of the plumbing to ensure instances can register to the cluster;
    - Allows a EC2 instance to join a cluster
    - Runs on ECS or custo AMIs (amazon machine image)
- Task definitions: Description of how docker applications should be ran (like docker-compose);
- Scheduling: Determines where a service or a task will run in the cluster;
- Services: A long running task (like a webapp) 
- Tasks: The result of a task definition;
- ECR: Amazon registry (like dockerhub)
- ECS CLI: Command line interface (like aws cli) but focused on managing a cluster and its tasks
    - Compatible with docker-compose
- Container: A linux container (Docker for example) created as part of a task;
- EC2: Amazon Container Service;
- EC2 Container Registry: Private registry where container images are stored and managed;
    - Encrypted, redundant and highly-available;
    - Permission level can be configured with aws IAM;
    - Keeps track of every container and how much resources they have;
    - EC2 instances are linked in a virtual prived cloud (VPC)
- EC2 Agent: Containers orchestration
- Security group: Where we define policies to who can access our instances, in what port.
- Container Instances Lifecycle
    - `ACTIVE` and `connected`: When container agent registers the container instance onto the cluster and its connection status is `true`. Container agent is ready to run tasks;
    - `ACTIVE` and `disconnected`: When we stop the container instance;
    - `INNACTIVE`: When we terminate or deregister a container instance; The container is no longer part of the cluster;

## Commands
### EC2
Command | Description
--------|------------
`aws iam list-users` | List users
`aws ecr list-images --repository-name testing-purposes-repo` | List images from a repository
`aws acm help` | Check if aws cli version is updated enough to use `acm`
`aws ec2 create-key-pair --key-name aws-<username> --query 'KeyMaterial' --output text > ~/.ssh/aws-<username>.pem` | Create a key-pair for a user (OSX)
`aws ec2 create-key-pair --key-name aws-<username> --query 'KeyMaterial' --output text | out-file -encoding ascii -filepath ~/.ssh/aws-<username>.pem` | Create a key-pair for a user (Ubuntu)
`` | SSH into instances
`aws ec2 describe-key-pairs --key-name <key-name>` | Print a key-pair
`aws ec2 delete-key-pair --key-name <key-name>` | Delete key-name
`aws ec2 create-security-group --group-name <username>-SG-useast1 --description "Security group for <username> on <region>"` | Create a security group
`aws ec2 describe-security-groups --group-id <groupd-id>` | Describe a security group
`aws ec2 authorize-security-group-ingress --group-id <group-id> --protocol tcp --port 22 --cidr 0.0.0.0/0` | Add roles to a group
`aws ec2 delete-security-groups --group-id <group-id>` | Delete a security group
`aws ec2 run-instances --image-id <AMI-id> --count <AMOUNT-OF-INSTANCES> --instance-type <instance-type> --iam-instance-profile Name=<ROLE-FOR-INSTANCE> --key-name <KEY-NAME> --security-group-ids <security-group-id> --user-data file://<COPY-ECS-CONFIG-TO-S3-FILE>` | The AMI-id is the oficial ECS AMI for us-east-1. Info available on aws website
`aws ec2 describe-instance-status --instance-id <instance-id>` | Print instance status
`aws ec2 terminate-instances --instance-ids <instance-id>` | Terminate an instance
`aws ec2 describe-instances` | Get EC2 public DNS name (Its under `NetworkInterfaces` > `Association`)

### ECS
Command | Description
--------|------------
`aws ecs list-clusters` | List clusters
`aws ecs describe-clusters --clusters <cluster-name>` | Detail cluster
`aws ecs create-cluster --cluster-name <cluster-name>` | Create a cluster
`aws ecs delete-cluster --cluster <cluster-name>` | Delete a cluster
`aws ecs list-container-instances --cluster <cluster-name>` | List container instances
`aws ecs describe-container-insstances --cluster <cluster-name> --container-instance <container-id>` | Detail container
`aws ecs register-task-definition --cli-input-json file://<task-definition-file>` | Register a task definition to a cluster
`aws ecs list-task-definition-families` | List task definition families
`aws ecs list-task-definitions` | List task definitions. The number in the end is the amout of revisions (updates)
`aws ecs describe-task-definition --task-definition <family>:<revisions-number>` | Detail a task definition. If `<revisions-number>` is ommited the result will be the last one
`aws ecs deregister-task-definition -task-definition <family>:<revision>` | Deregister a task definition
`aws ecs register-task-definition --generate-cli-skeleton` | Generate a skeleton template for a task definition
`aws ecs create-service --cluster <cluster-name> --service-name <service-name> --task-definition <task-definition> --desired-count <instances-amount>` | Create a service
`aws ecs list-services --cluster <cluster>` | List services in a cluster
`aws ecs describe-services --cluster <cluster> --services <services>` | Detail a service
`aws ecs update-service --cluster <cluster> --service <service> --task-definition <task> --desired-count <instances-amount>` | Update a service
`aws ecs delete-service --cluster <cluster> --service <service>` | Delete a service
`aws ecs create-service --generate-cli-skeleton` | Generate a service skeleton
`aws ecs run-task --cluster <cluster> --task-definition <task> --count <amount>` | Run a task (RunTask)
`aws ecs list-tasks --cluster <cluster>` | List tasks of a cluster
`aws ecs stop-task --cluster <cluster> --task <task> [--reason <reason>]` | Stop a task
`aws ecs start-task --cluster <cluster> --task-definition <task> --container-instances <instance-arn>` | Start a task (StartTask)
`aws ecs delete-cluster --cluster <name>` | Delete cluster

### ECR
Command | Description
--------|------------
`aws ecr get-login` | Get login credentials
`aws ecr creatae-repository --repository-name <name>` | Create a repository
`aws ecr describe-repositories` | List repositories
`aws ecr list-images --repository-name <name>` | List repository images
`aws ecr delete-repository --repository-name <name> --force` | Delete repository. Used `force` to make sure all images from this repo get deleted first

### S3
Command | Description
--------|------------
`aws s3api create-bucket --bucket <bucket-name>` | Create a bucket
`aws s3 cp <filename> s3://<bucket-name>/<filename>` | Copy file to S3
`aws s3 ls` | List buckets
`aws s3 ls s3://<bucket-name>` | List files in bucket
`aws s3 rm s3://<bucket-name>` | Empty a bucket
`aws s3api delete-bucket --bucket <bucket-name>` | Delete a bucket 

## Steps
Important: Region must be set as N.Virginia

### IAM (Identity and Access Management)
Information about what we currently have set up

#### User and access
- Create a new user, put it in a group and download its credentials
- Create a PEM file to allow the created user to login to any instance
    - `aws ec2 create-key-pair --key-name aws-ecsadmin --query 'KeyMaterial' --output text > ~/.ssh/aws-ecsadmin.pem`
    - Give the file permission 400 (read only allowed to owner only)
        - `chmod 400 ~/.ssh/aws-ecsadmin.pem`
    - Create security group
        - `aws ec2 create-security-group --group-name ecsadmin-SG-useast1 --description "Security group for ecsadmin on us-east-1"`
    - Add group security access (Where it can receive access from)
        - `aws ec2 authorize-security-group-ingress --group-id sg-5f2ab02d --protocol tcp --port 22 --cidr 0.0.0.0/0`
        - Do the same for port `80`
        - Open 2 more ports (RDS (Postgres) and ElastiCache(Redis))
            - Postgres default port: 5432
                - `aws ec2 authorize-security-group-ingress --grup-id sg-5f2ab02d --protocol tcp --port 5432 --cidr 0.0.0.0/0 --source-group sg-5f2ab02d`
            - Redis default port: 6379
    - Add group roles (This allows instances to talk to other aws service)
        - Do this in UI accessign the console through the signin link
        - Go to IAM section
        - The first role will be `ecsInstanceRole` with permission to `AWS service` > `EC2 Role for EC2 Container Service`
        - Select the one checkbox
        - Add new policy. Search for `S3` and select `AmazoneS3ReadOnlyAccess`
        - Create a new role `ecsServiceRole` to handle cases where another aws service (like loadbalancer) may need to make api calls on our behalf.
            - The role is: `EC2 Container Service` > `EC2 Container Service`

### Cluster
- `aws ecs create-cluster --cluster-name first-aws-app`

### S3
- `aws s3api create-bucket --bucket docker-images-first-aws-app`

### Config file
Since we are not using the default cluster we need to configure the container agent to connect EC2 instances to our custom cluster.

We need to create two files:
- `ecs.config`: Where we specify the cluster name
    - `ECS_CLUSTER=first-aws-app`
    - Upload the config file to the created bucket
        - `aws s3 cp ecs.config s3://docker-images-first-aws-app/ecs.config`

- `copy-ecs-config-to-s3`:
```sh
#!/bin/bash

yum install -y aws-cli
aws s3 cp s3://docker-images-first-aws-app/ecs.config /etc/ecs/ecs.config # Location of where an ecs config file should be in an instance
```

### Run instance
- `aws ec2 run-instances --image-id ami-2b3b6041 --count 1 --instance-type t2.micro --iam-instance-profile Name=ecsInstanceRole --key-name aws-ecsadmin --security-group-ids sg-5f2ab02d --user-data file://copy-ecs-config-to-s3`
- Check if the instance joined the cluster
    - `aws ecs list-container-instances --cluster first-aws-app`
- See the container details

### Task Definition
Definition of how our image should be ran
One task definition can control 1 or multiple containers (with volumes or not)
Associations of volumes to containers are done here
An application can be composed of 1 or more task definitions
Containers that are grouped in the same task definition will be scheduled to be ran in the same container instance. For example, if we have nginx in front of a webapp we will link them through the task definition. Another example is to run a local cache for each webapp.

Services are also created through task definitions.

Components:
- Family: Name of the task definition. Can be any name;
- Container definitions: Configuration of which image will be pulled down, memory and cpu resources, etc.`Like a docker-compose.yml`;
- Volumes: Data

- Create the task definition
- Register it to the cluster
    - `aws ecs register-task-definition --cli-input-json file://web-task-definition.json`

### Scheduler
Services are meant to be long lived processes and stateless. E.g., a webapp
When defining a service, we can configure how many services instances we want.
We can also hook up our service to a elastic load balancer (ELB)

There are three ways to schedule a task on a cluster:
##### Way 1 - Services
There are three steps taken by amazon to decide in which cluster a service will be placed
- The scheduler will look at the task definition cpu, memory, ports, etc. Then will look at the state of our cluster and look at our container instances that are capable of running it;
- Check how many service instances are running in an availability zone;
- Check how many instances are running on container instances;

Lab:
Deploy a service
`aws ecs create-service --cluster first-aws-app --service-name web --task-definition web --desired-count 1`
To see our service in browser we need the public DNS name for our EC2 instance
`aws ec2 describe-instances`
The url will hit our deployed service =D yeey!

Update a service to run 2 instances
`aws ecs update-service --cluster first-aws-app --service web --task-definition web --desired-count 2`

`aws ecs describe-services --cluster first-aws-app --services web`

We would get an error since we only have one container and the one we have is already using the port the other instance would use as well. If we would still want to have multiple copies of our service running on the same container we would have to set random ports in our task defitnition for it to use and not conflict. We can do that by setting `0` as the port value or ommiting it.

Delete the service
To delete it we have to update its `desired-count` to 0. Otherwise we will not be able to delete it.
`aws ecs delete-service --cluster first-aws-app --service web`
List services to confirm the deletion
`aws ecs list-services --cluster first-aws-app`

##### Way 2 - Running Tasks (RunTask)
The container it will run is chosen 'randomly'
Sometimes we may want to run short lived or 1 off task tha exit when done
E.g., create thumbnails for videos, encode a video or run a database migration;

Lab
`aws ecs run-task --cluster first-aws-app --task-definition web --count 1`
`aws ecs list-tasks --cluster first-aws-app`
Stop the task
`aws ecs stop-task --cluster first-aws-app --task arn:aws:ecs:us-east-1:687745605585:task/9c44cd3a-6ebc-40a4-bc1a-404dd512bb9c`

##### Way 3 - Starting Tasks (StartTask)
Way 2 and 3 look very similar but the starting task lets us pick where we want to run a task
It is a good choice when we have a container with higher CPU dedicated to run cpu intensive tasks, such as video encoding;
It also allows us to manually start a task on a specific container instance or build our own scheduler. And leverage the `list` and `describe` actions;

Lab
For this one we need the container `Arn`
`aws ecs list-container-instances --cluster first-aws-app`
`aws ecs start-task --cluster first-aws-app --task-definition web --container-instance arn:aws:ecs:us-east-1:687745605585:container-instance/de718387-5077-40aa-bdc3-a567a73ba3e2`

Now go to the public instance dns again and we will hit the application again. But now running as a task instead of a service


Stop the task
`aws ecs stop-task --cluster first-aws-app --task arn:aws:ecs:us-east-1:687745605585:task/c7d37eee-9581-46ec-af5d-2670b7b75518`


##### Task Life Cycle
The container agent is responsible for keeping track of tasks states

- Pending
- Running
- Stopped

[Diagram](http://docs.aws.amazon.com/AmazonECS/latest/developerguide/task_life_cycle.html)

### Private Docker Registry
We can have multiple repositories
E.g., `https://aws_acc_id.dkr.ecr.us-east-1.amazonaws.com/namespace`
- `https://aws_acc_id.dkr.ecr.us-east-1.amazonaws.com/`: Registry
- `namespace`: Repository

Integrates with `IAM`

Lab
- Authenticate local docker client
    - `aws ecr get-login`, remove the `-e none` from the command and run it (These credentials will expire in 12 hours)
- Create a repository
    - `aws ecr create-repository --repository-name web/nginx`
    - Upload an image
        - First we need to tag the image
            - `docker tag nginx:1.9 <registry-uri-without-http>/<repository-name>`
                - `docker tag nginx:1.9 687745605585.dkr.ecr.us-east-1.amazonaws.com/web/nginx:1.9`
            - Push the image: `docker push 687745605585.dkr.ecr.us-east-1.amazonaws.com/web/nginx`
- Configure a task definition to use a private repository
    - Change the `iamge` attribute from the `task-definition.json` to the uploaded image
    - `687745605585.dkr.ecr.us-east-1.amazonaws.com/web/nginx:1.9`
    - Upload the task definition: `aws ecs register-task-definition --cli-input-json file://web-task-definition.json`
- Run the task: `aws ecs run-task --cluster first-aws-app --task-definition web --count 1`

### Tear down a cluster
- Grab the EC2 nstance id `aws describe-instances` (Find `InstanceId` attribute)
    -  `aws ec2 terminate-instances --instance-ids i-0a2bccd749c504b96`
- Delete S3 bucket
    - We have to delete all files in it first: `aws s3 rm s3://docker-images-first-aws-app`
    - `aws s3api delete-bucket --bucket docker-images-first-aws-app`
- Delete the repository `aws ecr delete-repository --repository-name web/nginx --force`
- Delete cluster `aws ecs delete-cluster --cluster first-aws-app`
    - It will throw an error if there are tasks running on the cluster














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

## AWS CLI
- Install epel-release: `sudo yum install epel-release`
- Update: `sudo yum update`
- Install `python pip`: `sudo yum install python-pip`
- Install aws cli: `sudo pip install awscli`
- Test instalation: `which aws` and `which ec2`
- Move the downloaded credential to the server:
    - `scp -i PEM-FILE.pem ecs-key-pair.csv ec2-user@<IP>:/home/ec2-user`

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

---

## Observations
- Clusters can be created using:
    - AWS console, cloudformation, amazon cli, amazon ecs apis;
- The image must be tagged
- Task definition
    - The `memory` attribute value unit is `MB`. And once the container reaches the defined limit it will be killed and another one will be spawned;
    - The `cpu` attribute max value is 1024. And when we set it to `102` we're saying that the application should not consume more than 10%;
    - Families cannot be deleted
    - To upload a task definition just upload again a new config with the same name

## Best practices
- Separate clients by clusters. And put them in their own VPC(virtual private cloud). Network isolation. Customized IAM policies can also be created for clusters;
- Consider having a cluster for each app environment. One for production and another for Q&A

