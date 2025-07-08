# Hadoop Cluster Setup

This page contains guide for single node hadoop setup
for multi-node hadoop setup refer [multi-node hadoop setup](navigate-to-setups/multi-node-hadoop)

## Download Hadoop binary

Visit the Hadoop releases page (https://hadoop.apache.org/releases.html) to find a download URL for choosen hadoop version (make sure that this is compatible with spark,pyspark version you're going to choose and it has stable aws-sdk jar to furthure integrate with aws services)

In this guide, we're going with hadoop 3.4.1

## 📥 Install Hadoop 3.4.1

```bash
wget https://archive.apache.org/dist/hadoop/common/hadoop-3.4.1/hadoop-3.4.1.tar.gz

# make a directory for hadoop
mkdir ~/hadoop

# unzip binary package
tar -xvzf hadoop-3.4.1.tar.gz -C ~/hadoop
```

## 🌍 Set Environment Variables

Open your `~/.bashrc` file for editing:

```bash
nano ~/.bashrc
```

Setup Hadoop and Java environment variables at the end of the .bashrc file as below and then save the bash file and close it.

```bash
# Hadoop environment variables
# ~ is replaced with $HOME, change if needed in future
# match from your actual path
export JAVA_HOME=/usr/lib/jvm/java-8-openjdk-amd64
export HADOOP_HOME=$HOME/hadoop/hadoop-3.4.1
export HADOOP_CONF_DIR=$HADOOP_HOME/etc/hadoop
export HADOOP_MAPRED_HOME=$HADOOP_HOME
export HADOOP_COMMON_HOME=$HADOOP_HOME
export HADOOP_HDFS_HOME=$HADOOP_HOME
export YARN_HOME=$HADOOP_HOME
export YARN_CONF_DIR=$HADOOP_CONF_DIR

# Add Hadoop paths to PATH
export PATH=$PATH:$HADOOP_HOME/bin:$HADOOP_HOME/sbin

# Ensure system paths are included
export PATH=/usr/bin:/bin:$PATH
export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:$HADOOP_HOME/lib/native
```

Apply the changes immediately:

```bash
source ~/.bashrc
```

Verify the Hadoop installation by checking the version:

```bash
hadoop version
```

Expected output (sample):

```bash
Hadoop 3.4.1
Source code repository https://github.com/apache/hadoop.git -r 4d7825309348956336b8f06a08322b78422849b1
Compiled by mthakur on 2024-10-09T14:57Z
Compiled on platform linux-x86_64
Compiled with protoc 3.23.4
From source with checksum 7292fe9dba5e2e44e3a9f763fce3e680
This command was run using /home/cdis/hadoop/hadoop-3.4.1/share/hadoop/common/hadoop-common-3.4.1.jar
```

## 🗂️ Create Directories

These directories will be used for storing logs, temporary files, and metadata.

```bash
mkdir -p $HADOOP_HOME/logs
mkdir -p ~/hadoop/tmp
mkdir -p ~/hadoop/logs
mkdir -p ~/hadoop/data/namenode
mkdir -p ~/hadoop/data/datanode

```

## 🔑 Change the permission of hadoop directory

```bash
chmod -R 755 ~/hadoop
```

## 🔧 Configure Hadoop for Single Node Setup (pseudo-distributed mode)

official docs for single node setup: [docs](https://hadoop.apache.org/docs/r3.3.0/hadoop-project-dist/hadoop-common/SingleCluster.html#Pseudo-Distributed_OperationPseudo-Distributed_Operation)

All the Hadoop configuration files should be located in the `~/hadoop/hadoop-3.4.1/etc/hadoop` directory.

```bash
cd ~/hadoop/hadoop-3.4.1/etc/hadoop
```

📌 The configuration setup steps are as follows:

### Hadoop Configuration Files

📝 Hadoop’s Java configuration is driven by two types of important configuration files:

**Read-only default configuration** - core-default.xml, hdfs-default.xml, yarn-default.xml and mapred-default.xml.
**Site-specific configuration** - etc/hadoop/core-site.xml, etc/hadoop/hdfs-site.xml, etc/hadoop/yarn-site.xml and etc/hadoop/mapred-site.xml.

**Note:** For a single-node cluster, make sure to use your actual private IP address directly in the configuration file. Avoid using variables from `~/.bashrc` file, as daemon processes might run in a different environment and may not be able to interpret those variables.

### 1. Edit file hadoop-env.sh:

```bash
nano hadoop-env.sh
```

Set Java environment variable as,

```bash
export JAVA_HOME=/usr/lib/jvm/java-8-openjdk-amd64
export HADOOP_NICENESS=0
```

### 2. Edit file core-site.xml:

this file informs the Hadoop daemon where NameNode runs in the cluster. It contains configuration settings of Hadoop core such as I/O settings that are common to HDFS & MapReduce.

```bash
nano core-site.xml
```

Set this properties in this file (these are basic for more specific setup visit official docs), **use your private IP and username.**

```xml
<configuration>
  <!-- HDFS Address -->
  <property>
    <name>fs.defaultFS</name>
    <value>hdfs://172.31.47.110:9000</value>
  </property>

  <!-- Temp Directory: User-specific path -->
  <property>
    <name>hadoop.tmp.dir</name>
    <value>file:///home/ubuntu/hadoop/tmp</value>
  </property>
</configuration>
```

### 3. Edit file hdfs-site.xml:

```bash
nano hdfs-site.xml
```

this file contains configuration settings of HDFS daemons (i.e. NameNode, DataNode, Secondary NameNode). It also includes the replication factor and block size of HDFS, again **use your username.**

```xml
<configuration>
  <!-- NameNode Directory: User-specific -->
  <property>
    <name>dfs.namenode.name.dir</name>
    <value>file:///home/ubuntu/hadoop/data/namenode</value>
  </property>

  <!-- DataNode Directory: User-specific -->
  <property>
    <name>dfs.datanode.data.dir</name>
    <value>file:///home/ubuntu/hadoop/data/datanode</value>
  </property>

  <!-- Replication Factor -->
  <property>
    <name>dfs.replication</name>
    <value>1</value>
  </property>

  <!-- Enable WebHDFS if want to connect using hdfs -->
  <property>
    <name>dfs.webhdfs.enabled</name>
    <value>true</value>
  </property>
</configuration>
```

### 4. Edit file mapred-site.xml:

```bash
nano mapred-site.xml
```

this file contains configuration settings of MapReduce application like the number of JVM that can run in parallel, the size of the mapper and the reducer process, CPU cores available for a process, etc.

```xml
<configuration>
    <property>
        <name>mapreduce.framework.name</name>
        <value>yarn</value>
    </property>
    <property>
        <name>mapreduce.application.classpath</name>
        <value>$HADOOP_MAPRED_HOME/share/hadoop/mapreduce/*:$HADOOP_MAPRED_HOME/share/hadoop/mapreduce/lib/*</value>
    </property>
</configuration>
```

### 5. Edit file yarn-site.xml:

```bash
nano yarn-site.xml
```

this file contains configuration settings of ResourceManager and NodeManager like application memory management size, the operation needed on program & algorithm, etc.

```xml
<configuration>
    <property>
        <name>yarn.nodemanager.aux-services</name>
        <value>mapreduce_shuffle</value>
    </property>

    <property>
        <name>yarn.nodemanager.env-whitelist</name>
        <value>JAVA_HOME,HADOOP_COMMON_HOME,HADOOP_HDFS_HOME,HADOOP_CONF_DIR,CLASSPATH_PREPEND_DISTCACHE,HADOOP_YARN_HOME,HADOOP_MAPRED_HOME</value>
    </property>

    <property>
        <name>yarn.webapp.ui2.enable</name>
        <value>true</value>
    </property>

    <property>
      <name>yarn.resourcemanager.hostname</name>
      <value>localhost</value>
    </property>

    <!-- RPC port for the RM (default is 8032) -->
    <property>
      <name>yarn.resourcemanager.address</name>
      <value>localhost:8032</value>
    </property>

    <property>
      <name>yarn.nodemanager.pmem-check-enabled</name>
      <value>false</value>
    </property>

    <property>
      <name>yarn.nodemanager.vmem-check-enabled</name>
      <value>false</value>
    </property>

    <!-- The below setup is for m5.2xlarge, configure based on your system-->
    <!-- Total resources YARN can use, spark-default resources must fit into this -->
    <property>
        <name>yarn.nodemanager.resource.memory-mb</name>
        <value>24576</value> <!-- 24GB (leave other for OS/Hadoop-->
    </property>
    <property>
        <name>yarn.nodemanager.resource.cpu-vcores</name>
        <value>7</value> <!-- Leave 1 core for OS/HDFS -->
    </property>
    <property>
        <name>yarn.scheduler.maximum-allocation-mb</name>
        <value>24576</value>
    </property>
</configuration>
```

### 6. Format namenode

Go to the Hadoop home directory and format the Hadoop namenode, This formats the HDFS via the NameNode. Formatting the file system means initializing the directory specified by the dfs.name.dir variable.

**Caution**: By formatting, You will lose all your data stored in the HDFS, and the jar files that you'll copy during aws setup, after each formatting you need to copy it again.
**Note:** Hadoop services should be running before formatting the Namenode.

```bash
cd ~/hadoop/hadoop-3.4.1
bin/hdfs namenode -format
```

## 🚀 Starting hadoop daemons-

The NameNode is the centerpiece of an HDFS file system. It keeps the directory tree of all files stored in the HDFS and tracks all the files stored across the cluster.

On startup, a DataNode connects to the Namenode and it responds to the requests from the Namenode for different operations.

These are the commands to start all hadoop daemons at once, however you can always choose to start specific services by executing their respective executables.

**Note:** We have given scripts to start/stop all hadoop and spark services at once from home directory in the additional section.

```bash
 ~/hadoop/hadoop-3.4.1/sbin/start-all.sh
 ~/hadoop/hadoop-3.4.1/sbin/stop-all.sh
```

## 🔍 Check the running services

```bash
jps
```

## 📂 Create HDFS Folders to store real datasets

```bash
# you can check username by `whoami` command
hdfs dfs -mkdir /user
hdfs dfs -mkdir /user/ubuntu
hdfs dfs -mkdir /user/ubuntu/{tmpuploads, uploads, processed, tmpmerged}
```

**Note:**

- Upload datasets only to the tmpuploads folder.
- The uploads, processed, and tmpmerged directories should be used programmatically only to avoid inconsistencies and internal failures.

## 📝 Sample commands for further use-

```bash
# these commands are for hadoop on wsl,change accordingly
# these commands assume that dataset is on localhost and you're moving it to hdfs, for remote hadoop first copy the data into remote machine then move it to hdfs

# list the datasets
hdfs dfs -ls /user/ubuntu/processed

# upload the dataset
hdfs dfs -put "path/to/file" /user/ubuntu/tmpuploads/filename.csv

# remove a directory or file (-r for recursive)
hdfs dfs -rm -r /path/to/remove
```

## 🌐 Access hadoop web services-

⚠️ **Important:** Web UI Links May Vary by Port & Access

- For a deployed cluster, replace `localhost` with your public IP address and ensure the required ports are open in your security group.
- Alternatively, set up an SSH tunnel from your local machine to the server (see script in the `additional-setup` section) to make the following links work properly.

### 🔗 Common Hadoop & YARN Web UIs

- **YARN ResourceManager**: [http://localhost:8088/cluster](http://localhost:8088/cluster)
- **NodeManager**: [http://localhost:8042/node/](http://localhost:8042/node/)
- **Hadoop NameNode**: [http://localhost:9870/](http://localhost:9870/)
- **Hadoop DataNodes**: [http://localhost:9864/datanode.html](http://localhost:9864/datanode.html)

You can use these web UIs to monitor and debug most aspects of the system. However, for programmatic access or command-line inspection, the following commands can be useful:

```bash
# List all YARN nodes with detailed information
yarn node -list -showDetails

# Monitor YARN resource usage in real-time
yarn top

# View the latest 50 lines of the log
# used tail -n 50 for last 50 lines
tail -f $HADOOP_HOME/logs/hadoop*-namenode-*.log
tail -f $HADOOP_HOME/logs/hadoop*-datanode-*.log
tail -f $HADOOP_HOME/logs/hadoop*-nodemanager-*.log
tail -f $HADOOP_HOME/logs/hadoop*-resourcemanager-*.log
tail -f 50 $HADOOP_HOME/logs/hadoop*-secondarynamenode-*.log

# Check the status of all running YARN applications
yarn application -list
```

## **Important Note**

> **YARN marks a node as unhealthy if its disk usage exceeds 90%. Therefore, ensure that disk usage on each node remains below this threshold. If disk usage goes above 90%, Spark nodes will stop functioning until sufficient space is freed.**

---
