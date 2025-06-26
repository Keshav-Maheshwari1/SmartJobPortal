#!/bin/bash
set -e

REMOTE_USER=root
REMOTE_IP=139.59.39.47
REMOTE="$REMOTE_USER@$REMOTE_IP"
REMOTE_DIR=/opt/portal-app

echo "🔧 Cleaning previous build artifacts..."
docker compose build

echo "📦 Uploading project files to $REMOTE_IP..."
ssh $REMOTE "rm -rf $REMOTE_DIR"
rsync -av --exclude='target' --exclude='.git' --exclude='node_modules' --exclude='.env' ./ $REMOTE:$REMOTE_DIR

echo "📂 Restoring environment file on server..."
ssh $REMOTE "cp /opt/envs/portal.env $REMOTE_DIR/.env"

echo "🚀 Deploying..."
ssh $REMOTE << EOF
  cd $REMOTE_DIR
  docker compose down
  docker compose up --build -d
EOF

echo "✅ Deployment complete! Visit: http://$REMOTE_IP:9000"
