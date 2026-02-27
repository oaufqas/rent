Full-stack онлайн-сервис на Node.js + React + MySQL

- **Бэкенд:** Node.js, Express, Sequelize, JWT
- **Фронтенд:** React, Vite, CSS, MobX, Axios
- **База данных:** MySQL
- **Хостинг:** Docker, docker-compose, Timeweb Cloud


manual deployment: 

sudo apt update && sudo apt install git curl
curl -fsSL https://get.docker.com -o get-docker.sh
chmod +x get-docker.sh
./get-docker.sh

cd ./ssl
fill in the .env file using the template
docker compose up

cd ..
fill in the .env in ./server and ./client files using the templates
docker compose -env--file ./server/.env up -d


first command deploy with gitlab-ci:

sudo mkdir -p /rent && sudo chown gitlab-runner:gitlab-runner /rent && sudo usermod -aG docker gitlab-runner && sudo systemctl restart gitlab-runner && cd /rent && sudo -u gitlab-runner git clone https://gitlab.com/oaufqas/rent.git .