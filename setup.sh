#!/bin/bash
set -e

echo "🧪 Checking ./backend/.env..."

# Step 0: Check backend .env
if [ ! -f ./backend/.env ]; then
  echo "📄 backend/.env not found. Creating from backend/.env.example..."
  cp ./backend/.env.example ./backend/.env
else
  echo "backend/.env already exists."
fi
 

 # Step 0: Check backend .env
if [ ! -f ./frontend/.env ]; then
  echo "📄 backend/.env not found. Creating from backend/.env.example..."
  cp ./frontend/.env.example ./frontend/.env
else
  echo "frontend/.env already exists."
fi



# Step 1: Get IMDSv2 token
TOKEN=$(curl -s -X PUT "http://169.254.169.254/latest/api/token" \
  -H "X-aws-ec2-metadata-token-ttl-seconds: 21600")

# Step 2: Get Public IP using token
PUBLIC_IP=$(curl -s -H "X-aws-ec2-metadata-token: $TOKEN" \
  http://169.254.169.254/latest/meta-data/public-ipv4)

# Step 3: Generate frontend .env with dynamic public IP
echo "Generating frontend/.env with IP: $PUBLIC_IP"

cat <<EOF > ./frontend/.env
REACT_APP_API_URL=http://$PUBLIC_IP:5000
REACT_APP_NAME=ChichuApp
EOF

echo ".env files ready. You can now run Docker Compose."