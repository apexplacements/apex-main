#!/bin/bash
set -e
cd /home/ubuntu/apex-main/backend
cp -n server.js server.js.bak || true
if ! grep -q "trainerRoutes" server.js; then
  cat >> server.js <<'EOF'

app.use("/api/lms/trainer", require("./routes/trainerRoutes"));
app.use("/api/lms/student", require("./routes/studentRoutes"));

EOF
fi
pkill -f "/home/ubuntu/apex-main/backend/server.js" || true
nohup node /home/ubuntu/apex-main/backend/server.js > /home/ubuntu/apex-main/backend/server.log 2>&1 &
sleep 2
curl -i https://api.apexplacements.in/api/lms/trainer || true
curl -i https://api.apexplacements.in/api/lms/trainer/profile/22 || true
echo "done"
