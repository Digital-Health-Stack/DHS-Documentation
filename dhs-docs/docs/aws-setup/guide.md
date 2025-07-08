# AWS Testing Setup Details

---

## 1. AWS IAM User Setup

- Go to the **IAM Console**

- Click **Users** → **Add users**

- Enter a name (e.g., `FedServer` or `FedClient`)

- Select **Access key – Programmatic access**

- Click **Next: Permissions** → **Attach policies directly**

- Attach the following AWS‑managed policies:

  1.  `AmazonEC2FullAccess`
  2.  `AmazonS3FullAccess`
  3.  `IAMUserChangePassword`

- Review and **Create user**, then securely save the **Access key ID** and **Secret access key**.

---

## 2. Launching EC2 Instances

1. **Click** **Launch instance** in the EC2 console.

2. **Configure:**

   - **Name:** e.g., `FedServer` or `FedClient-1`
   - **Amazon Machine Image (AMI):** Ubuntu 22.04 LTS (or our custom AMI later)
   - **Instance type:** choose based on your test workload (e.g., `g4dn.2xlarge` for medium datasets). Refer to the table below for additional options.
   - **Key pair:** create new or choose existing (also download the `.pem` key file!)
   - **Storage (EBS):**
     - Volume type: `gp3`
     - Size: **50–100 GB** (ensure usage stays below 90%)

3. **Networking & Security Group:**

   - Allow **SSH (22)** from your IP (or from anywhere)
   - Allow port **5174** and **9090** for **FedClient**, or port **5173** and **8000** for **FedServer** from your IP (or from anywhere)
   - Allow port **80** and **443** for **HTTP** and **HTTPS** from your IP (or from anywhere)
   - Allow port **9864** and **9870** for uploading the dataset file
   - Allow any additional ports for Hadoop/Spark Web UIs if needed

4. **Launch** the instance.

> **Instance Sizing Note:**
>
> - **FedServer:** scale up if coordinating many clients
> - **FedClient:** scale up for larger local preprocessing or model training

---

### 2.1 Instance Specification & Pricing

| Instance Type   | GPUs | vCPUs | RAM (GiB) | GPU RAM (GiB) | Instance Storage  | Net Perf (Gbps) | EBS Bandwidth (Gbps) | On‑Demand Price (USD/hr) |
| --------------- | ---- | ----- | --------- | ------------- | ----------------- | --------------- | -------------------- | ------------------------ |
| `g4dn.2xlarge`  | 1    | 8     | 32        | 16            | 1×225 GB NVMe SSD | Up to 25        | Up to 3.5            | 0.75                     |
| `g4dn.4xlarge`  | 1    | 16    | 64        | 16            | 1×225 GB NVMe SSD | Up to 25        | 4.75                 | 1.20                     |
| `g4dn.8xlarge`  | 1    | 32    | 128       | 16            | 1×900 GB NVMe SSD | 50              | 4.75                 | 2.40                     |
| `g4dn.12xlarge` | 4    | 48    | 192       | 64            | 1×900 GB NVMe SSD | 50              | 9.5                  | 3.63                     |
| `g4dn.16xlarge` | 1    | 64    | 256       | 16            | 1×900 GB NVMe SSD | 50              | 9.5                  | 4.82                     |
| `g4dn.metal`    | 8    | 96    | 384       | 128           | 2×900 GB NVMe SSD | 100             | 19                   | 5.42                     |

---

## 3. S3 Folder for Intermediate Test Data

1. **Create a Bucket**

   - Go to **S3** → **Create bucket**
   - Name: `fed-learning-test-bucket`
   - Region: same as EC2 instances

2. **Create a "folder"**

   - Inside the bucket, click **Create folder**
   - Name it: `client-uploads/`

3. **Lock Down Permissions**

   - Attach the following **bucket policy** (replace `<ACCOUNT_ID>` and `<BUCKET_NAME>`):
     ```json
     {
       "Version": "2012-10-17",
       "Statement": [
         {
           "Sid": "ServerFullAccess",
           "Effect": "Allow",
           "Principal": { "AWS": "arn:aws:iam::<ACCOUNT_ID>:user/FedServer" },
           "Action": [
             "s3:GetObject",
             "s3:PutObject",
             "s3:DeleteObject",
             "s3:ListBucket"
           ],
           "Resource": [
             "arn:aws:s3:::<BUCKET_NAME>/*",
             "arn:aws:s3:::<BUCKET_NAME>"
           ]
         },
         {
           "Sid": "ClientsWriteOnly",
           "Effect": "Allow",
           "Principal": { "AWS": "arn:aws:iam::<ACCOUNT_ID>:user/FedClient*" },
           "Action": ["s3:PutObject"],
           "Resource": "arn:aws:s3:::<BUCKET_NAME>/client-uploads/*"
         }
       ]
     }
     ```
   - This ensures:
     - **FedServer** user can **list**, **read**, **write**, and **delete** anywhere in the bucket
     - **FedClient** users can **only write** into `client-uploads/`; no read or delete

> **Env File Reminder:**  
> Later, you will need to reference this bucket and folder name in the environment files of both your clients and server.

---

## 4. Example Cost Estimates

| Scenario             | Instance Type  | # Instances | Cost per Hour (USD) | Cost per Day (USD) |
| -------------------- | -------------- | ----------- | ------------------- | ------------------ |
| 1 Server + 3 Clients | `g4dn.2xlarge` | 4           | 4 × 0.75 = 3.00     | 3.00 × 24 = 72.00  |
| 1 Server + 5 Clients | `g4dn.2xlarge` | 6           | 6 × 0.75 = 4.50     | 4.50 × 24 = 108.00 |
| 1 Server + 3 Clients | `g4dn.4xlarge` | 4           | 4 × 1.20 = 4.80     | 4.80 × 24 = 115.20 |
| 1 Server + 5 Clients | `g4dn.4xlarge` | 6           | 6 × 1.20 = 7.20     | 7.20 × 24 = 172.80 |

> **Note:**  
> Instance costs may vary over time. Please refer to the official AWS pricing page for the most up-to-date pricing information.

---

> **Next Steps:** Detailed "### Inside the EC2 Instance" instructions (installing pseudo‑distributed Hadoop/Spark, environment variables, mounting S3 via `s3a://`, etc.) are in the **setup.md** file.
