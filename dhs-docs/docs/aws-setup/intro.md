# AWS Setup Introduction

---

This section provides a step-by-step guide to setting up the entire infrastructure on the AWS Cloud for **testing purposes**.

> ⚠️ **Note**: This setup is intended for testing only. In the final deployment, each client will operate under a completely separate AWS account (not just separate IAM users within a single account). However, the overall infrastructure and configurations will remain largely the same.

## **What You'll Set Up**

In this testing environment, we will:

- Create **separate AWS accounts** (or IAM users within a shared test account) for the **FedServer** and each **FedClient**
- Create **EC2 instances** for both the FedServer and the FedClients
- Configure **S3 buckets/folders** with strict security permissions for **intermediate data sharing**
  - Each client will be able to **write** to the shared folder
  - Clients will **not be able to read** from or list the contents of the folder (write-only access)

## **Flexibility of Deployment**

While we are using AWS Cloud for this test deployment, the same infrastructure can be replicated on:

- **Other cloud platforms** (e.g., GCP, Azure)
- **On-premise environments** or **local client systems**(for FedClient only) for development and testing

However, to keep the setup unified and simple for testing, all components (FedServer and FedClients) will be provisioned and run on AWS in this guide.

This setup will allow you to simulate a federated learning environment with multiple participating clients and a central coordinating server, all operating securely within AWS.
