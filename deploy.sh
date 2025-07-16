#!/bin/bash
set -e

REMOTE_USER=root
REMOTE_IP=139.59.39.47
REMOTE="$REMOTE_USER@$REMOTE_IP"
REMOTE_DIR=/opt/portal-app

echo "🔧 Cleaning previous build artifacts (local)..."
docker compose build

echo "📦 Uploading project files to $REMOTE_IP..."
ssh $REMOTE "rm -rf $REMOTE_DIR"
rsync -av --exclude='target' --exclude='.git' --exclude='node_modules' ./ $REMOTE:$REMOTE_DIR

# 💡 Optional: Upload .env files explicitly to guarantee correctness
echo "📂 Forcing correct .env file upload..."
scp -T ./portal/.env $REMOTE:$REMOTE_DIR/portal/.env
scp -T ./backend/.env $REMOTE:$REMOTE_DIR/backend/.env

echo "🚀 Deploying containers remotely..."
ssh $REMOTE << EOF
  cd $REMOTE_DIR
  docker compose down --remove-orphans
  docker compose up --build -d
EOF

echo "✅ Deployment complete! Visit: https://keshav.webzinny.com"
