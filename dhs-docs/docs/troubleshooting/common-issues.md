````markdown
# Troubleshooting Guide

Common issues and solutions during DHS Project development.

---

## 🔌 Port Conflicts

```bash
lsof -i :8000
kill -9 <PID>
```
````

## 🐍 Python Environment Issues

```bash
pip install -r requirements.txt
```

## 🐳 Docker Issues

```bash
docker-compose up --build
docker-compose down
```

## 🔄 Service Management

```bash
./start-services.sh
./stop-services.sh
./restart-services.sh
```

## 📦 Dependency Issues

```bash
npm install
pip install -r requirements.txt
```

## 🔍 Debugging

```bash
npm run build
npm run start
```

## 📊 Monitoring

```bash
./logs-services.sh
```

## 📂 File Permissions

```bash
chmod -R 755 /path/to/directory
chown -R user:group /path/to/directory
```

## 📡 Network Issues

```bash
ping localhost
curl http://localhost:8000
```

## 📜 Configuration Issues

```bash
cat config.yaml
```

## 📦 Package Issues

```bash
pip install --upgrade package-name
npm update package-name
```

## 📦 Dependency Issues

```bash
npm install
pip install -r requirements.txt
```

## 📦 Version Compatibility

```bash
npm outdated
pip list --outdated
```

## 🔄 Restart Services

```bash
./restart-services.sh
```

## 📜 Configuration Issues

```bash
cat config.yaml
```

## 📦 Package Issues

```bash
pip install --upgrade package-name
npm update package-name
```

## 📦 Dependency Issues

```bash
npm install
pip install -r requirements.txt
```

## 📦 Version Compatibility

```bash
npm outdated
pip list --outdated
```

## 💾 WebHDFS Not Working?

Ensure hdfs-site.xml contains:

```xml
<property>
  <name>dfs.webhdfs.enabled</name>
  <value>true</value>
</property>
```

## 🔍 Quick Cluster Check

```bash
jps
```

## 🧠 Note on SparkSessions

Only one active SparkSession is allowed per JVM, so don't create any sparksesion on ec2 other than what framework internally does.

## Related to Hadoop

Error: Name node is in safe mode.
Solution: Wait till services starts completely, Datanodes are still reporting their status to namenode, not completely started.

## NameNode Issues

If the NameNode is not starting, format the NameNode. Ensure that the NameNode and DataNode directories exist; otherwise, a temporary directory will be created, and you will need to format after every restart.

Permissions: The Hadoop user must have the necessary permissions to access the directories and connect Spark and all other components. (If only the user has permission to read/write, this can be a verification for the framework that no one else is reading data except the user.)

WARNING: Don't do any operation on hdfs file or dir other than from what framework internally does, this may result is meta data mismatch and cause error in future.

## "Queue AM Resource Limit = 0" error

Update your `capacity-schedular.xml` with proper resource percentage for AM, and allocate 100% cluster resources to default queue.
