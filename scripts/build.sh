rm -rf dist

cd "$(realpath .)" && mkdir -p dist

cd server && tsc

mv dist/src ../dist/server

cp package.json ../dist/server
cp -r config/env ../dist/server/config
cp .env ../dist/server/.env

rm -rf dist

cd ../client && npm run build

mv build ../dist/client

cd ../dist/server && npm install
