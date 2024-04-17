export SERVER:=ubuntu@18.136.175.16
export DIRECTORY:=/home/ubuntu/rugbull-frontend
export PM2_NAME:=rugbull-frontend
export PORT:=3001

install:
	pnpm install

dev:
	pnpm vite dev --port 3000

deploy:
	pnpm vite build
	tar -zcf dist.tar.gz build package.json pnpm-lock.yaml
	ssh $$SERVER "mkdir -p $$DIRECTORY"
	scp dist.tar.gz $$SERVER:$$DIRECTORY/dist.tar.gz
	ssh $$SERVER "bash -i -c 'cd $$DIRECTORY && rm -rf build && tar -xvf dist.tar.gz && pnpm install --prod --frozen-lockfile && pm2 delete $$PM2_NAME || : && export PORT=$$PORT && pm2 start node --name $$PM2_NAME -- build && pm2 save'"
