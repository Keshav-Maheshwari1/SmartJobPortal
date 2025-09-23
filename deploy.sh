#!/bin/bash
set -e

REMOTE_USER=azureuser
REMOTE_IP=135.235.137.101
REMOTE="$REMOTE_USER@$REMOTE_IP"
REMOTE_DIR=/opt/portal-app
SSH_KEY=./portal_key.pem

echo "🔧 Cleaning previous build artifacts (local)..."
docker compose build

echo "📦 Uploading project files to $REMOTE_IP..."
rsync -avz -e "ssh -i $SSH_KEY" \
  --exclude='target' \
  --exclude='.git' \
  --exclude='node_modules' \
  ./ $REMOTE:$REMOTE_DIR

echo "📂 Forcing correct .env file upload..."
scp -i $SSH_KEY ./portal/.env $REMOTE:$REMOTE_DIR/portal/.env
scp -i $SSH_KEY ./backend/.env $REMOTE:$REMOTE_DIR/backend/.env

echo "🚀 Deploying containers remotely..."
ssh -i $SSH_KEY $REMOTE << 'EOF'
set -e
cd /opt/portal-app

echo "🛑 Stopping old containers..."
sudo docker compose down --remove-orphans

echo "🔐 Ensuring SSL files exist..."
sudo mkdir -p letsencrypt
sudo cp -r /etc/letsencrypt/live letsencrypt/ || true
sudo cp -r /etc/letsencrypt/archive letsencrypt/ || true

# Generate missing Nginx SSL helper files if they do not exist
if [ ! -f letsencrypt/options-ssl-nginx.conf ]; then
  sudo tee letsencrypt/options-ssl-nginx.conf > /dev/null <<EOL
ssl_protocols TLSv1.2 TLSv1.3;
ssl_prefer_server_ciphers on;
ssl_ciphers "ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256";
ssl_ecdh_curve X25519:P-256:P-384:P-521;
ssl_session_timeout 1d;
ssl_session_cache shared:SSL:50m;
ssl_stapling on;
ssl_stapling_verify on;
EOL
fi

if [ ! -f letsencrypt/ssl-dhparams.pem ]; then
  sudo openssl dhparam -out letsencrypt/ssl-dhparams.pem 2048
fi

echo "⬆️ Starting new containers..."
sudo docker compose up -d --build

echo "✅ Remote containers deployed successfully!"
EOF

echo "✅ Deployment complete! Visit: https://keshav.webzinny.com"
