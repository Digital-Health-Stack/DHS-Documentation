# Additional Setup

---

##

## 🖥️ Check System Resources

```bash
free -m     # 📦 Total RAM in MB
nproc       # 🧠 Number of vCPUs
top         # 📊 Real-time system processes and usage
```

## 🕒 Sync System Time

⛔ Hadoop and Spark services may fail if the system time across the cluster is not properly synced.

```bash
# Install/configure NTP (Ubuntu)
sudo apt install chrony
sudo systemctl enable chrony
sudo systemctl restart chrony

# Force sync
sudo chronyc -a makestep
```

## 🚀 Bash Scripts to Start and Stop All Hadoop & Spark Services at Once

You can automate the process of starting and stopping Hadoop and Spark services using simple shell scripts.

## 📍 First, navigate to your home directory:

```bash
cd ~
```

### 🔼 1. `start-services.sh` — Start All Services

- create the script

```bash
nano start-services.sh
```

- Paste the following code into the editor (adjust paths according to your installation):

```bash
#!/bin/bash

echo "Starting hadoop and spark services"

hadoop/hadoop-3.4.1/sbin/start-all.sh

spark/spark-3.5.6-bin-hadoop3/sbin/start-all.sh

echo "Started hadoop and spark services"
```

- make the script executable:

```bash
chmod +x ./start-services.sh
```

- Run the script to start services:

```bash
./start-services.sh
```

### 🔽 2. stop-services.sh — Stop All Services

- create the script

```bash
nano stop-services.sh
```

- Paste the following code into the editor (adjust paths according to your installation):

```bash
#!/bin/bash

echo "Stopping hadoop and spark services"

hadoop/hadoop-3.4.1/sbin/stop-all.sh

spark/spark-3.5.6-bin-hadoop3/sbin/stop-all.sh

echo "Stopped hadoop and spark services"
```

- make the script executable:

```bash
chmod +x ./stop-services.sh
```

- Run the script to stop services:

```bash
./stop-services.sh
```

## 📝 Script to forward useful UI ports from instance to localhost

> **Note:**
>
> 1. Either you can forward UI ports to localhost using script below or you can open respective ports in AWS security group to directly access UI by public IP of ec2.
>
> 2. Include frontend/backend ports in the script if needed so

### 1. For Windows

- paste this code in a text file then save that as `.bat` file, then click this file to execute
- for clean up issues `taskkill /F /IM ssh.exe` manually on cmd

```bash
@echo off
REM ----------------------------------------------------------------
REM SSH Port Forwarding Script
REM ----------------------------------------------------------------
setlocal enabledelayedexpansion

:INIT
REM 1. Validate SSH key exists
if not exist "fed.pem" (
    echo [ERROR] Missing SSH key: fed.pem
    timeout /t 3 >nul
    exit /b 1
)

REM 2. Get target host with validation
:GET_HOST
set "REMOTE="
set /p "REMOTE=Enter EC2 hostname (user@host): "
if not defined REMOTE (
    echo [ERROR] No host specified
    timeout /t 2 >nul
    goto GET_HOST
)

REM 3. Establish SSH tunnels with connection verification
echo [STATUS] Initializing SSH tunnels to %REMOTE%...
start "" /B ssh -i fed.pem -N -o ExitOnForwardFailure=yes ^
-L 9870:localhost:9870 ^
-L 9864:localhost:9864 ^
-L 9868:localhost:9868 ^
-L 19888:localhost:19888 ^
-L 8088:localhost:8088 ^
-L 8042:localhost:8042 ^
-L 8188:localhost:8188 ^
-L 4040:localhost:4040 ^
-L 8080:localhost:8080 ^
-L 8081:localhost:8081 ^
-L 18080:localhost:18080 %REMOTE%

REM Verify tunnel establishment
echo [STATUS] Verifying connection (10s timeout)...
set "CONNECTED=false"
for /l %%i in (1,1,10) do (
    timeout /t 1 >nul
    tasklist | find /i "ssh.exe" >nul && (
        set "CONNECTED=true"
        goto CONNECTION_CHECK_DONE
    )
)
:CONNECTION_CHECK_DONE

if "!CONNECTED!" neq "true" (
    echo [ERROR] Failed to establish SSH connection
    call :CLEANUP
    timeout /t 3 >nul
    exit /b 1
)

echo [SUCCESS] Tunnels active: http://localhost:[PORT]
echo [CONTROL] Type 'stop' to terminate or 'status' to check tunnels

REM 4. Main control loop
:CONTROL_LOOP
set "CMD="
set /p "CMD=Command: "
if /i "!CMD!"=="stop" (
    call :CLEANUP
    exit /b 0
) else if /i "!CMD!"=="status" (
    tasklist | find /i "ssh.exe" >nul && (
        echo [STATUS] Tunnels active
    ) || (
        echo [STATUS] Tunnels inactive
    )
    goto CONTROL_LOOP
) else (
    echo [HELP] Valid commands: stop, status
    goto CONTROL_LOOP
)

REM 5. Cleanup procedure
:CLEANUP
echo [STATUS] Terminating SSH processes...
taskkill /IM ssh.exe /F >nul 2>&1
timeout /t 1 >nul

REM Verify termination
tasklist | find /i "ssh.exe" >nul && (
    echo [WARNING] Some tunnels still active - retrying...
    taskkill /IM ssh.exe /F >nul 2>&1
    timeout /t 1 >nul
)

tasklist | find /i "ssh.exe" >nul && (
    echo [ERROR] Failed to terminate all tunnels
    exit /b 1
) || (
    echo [SUCCESS] All tunnels closed
    exit /b 0
)

endlocal


REM----------------------------------
REM include below ports in above list if needed
REM -L 8000:localhost:8000 -L 9090:localhost:9090 -L 5173:localhost:5173 -L 5174:localhost:5174
REM-----------------------------------

REM ------------------------------------
REM these commands to kill these process from linux/wsl
REM get process listening on:
REM	ps aux | grep '[s]sh -i fed.pem'
REM Kill these at once-
REM	pkill -f "ssh -i fed.pem"
REM -----------------------------
```

### 2. For Linux

```bash
#!/bin/bash
# ----------------------------------------------------------------
# SSH Port Forwarding Script
# ----------------------------------------------------------------

#----------------------------------
# include below ports in above list if needed
# -L 8000:localhost:8000 -L 9090:localhost:9090 -L 5173:localhost:5173 -L 5174:localhost:5174
#-----------------------------------

# Initialize variables
REMOTE_HOST=""
SSH_PORTS=(
    -L 9870:localhost:9870
    -L 9864:localhost:9864
    -L 9868:localhost:9868
    -L 19888:localhost:19888
    -L 8088:localhost:8088
    -L 8042:localhost:8042
    -L 8188:localhost:8188
    -L 4040:localhost:4040
    -L 8080:localhost:8080
    -L 8081:localhost:8081
    -L 18080:localhost:18080
)

cleanup() {
    echo "[STATUS] Terminating SSH processes..."
    # -----------------------------------
    # these commands to kill these process from linux/wsl
    # get process listening on:
    # ps aux | grep '[s]sh -i fed.pem'
    # Kill these at once-
    # pkill -f "ssh -i fed.pem"
    # -----------------------------
    pkill -f "ssh -i fed.pem"
    sleep 1  # Allow cleanup

    if pgrep -f "ssh -i fed.pem" >/dev/null; then
        echo "[ERROR] Failed to terminate all tunnels"
        exit 1
    else
        echo "[SUCCESS] All tunnels closed"
    exit 0
    fi
}

# 1. Validate SSH key exists
if [ ! -f "fed.pem" ]; then
    echo "[ERROR] Missing SSH key: fed.pem"
    exit 1
fi

# 2. Get target host with validation
while true; do
    read -p "Enter EC2 hostname (user@host): " REMOTE_HOST
    if [ -n "$REMOTE_HOST" ]; then
        break
    else
        echo "[ERROR] No host specified"
    fi
done

# 3. Establish SSH tunnels with connection verification
echo "[STATUS] Initializing SSH tunnels to $REMOTE_HOST..."
ssh -i fed.pem -N "${SSH_PORTS[@]}" "$REMOTE_HOST" &
SSH_PID=$!

# Verify tunnel establishment
echo "[STATUS] Verifying connection (10s timeout)..."
CONNECTED=false
for _ in {1..10}; do
    if pgrep -P $SSH_PID >/dev/null; then
        CONNECTED=true
        break
    fi
    sleep 1
done

if ! $CONNECTED; then
    echo "[ERROR] Failed to establish SSH connection"
    cleanup
    exit 1
fi

echo "[SUCCESS] Tunnels active: http://localhost:[PORT]"
echo "[CONTROL] Type 'stop' to terminate or 'status' to check tunnels"

# 4. Main control loop
while true; do
    read -p "Command: " CMD
    case "${CMD,,}" in
        stop)
            cleanup
            ;;
        status)
            if pgrep -f "ssh -i fed.pem" >/dev/null; then
                echo "[STATUS] Tunnels active"
            else
                echo "[STATUS] Tunnels inactive"
            fi
            ;;
        *)
            echo "[HELP] Valid commands: stop, status"
            ;;
    esac
done

```

## Notes

- To do any modification, take a backup.. Then see the change by modifying things one by one and testing otherwise it’ll be complete mess
- configure spark and yarn resources based on your system resources

---
