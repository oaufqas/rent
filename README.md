Full-stack онлайн-сервис на Node.js + React + MySQL

- **Бэкенд:** Node.js, Express, Sequelize, JWT
- **Фронтенд:** React, Vite, CSS, MobX, Axios
- **База данных:** MySQL
- **Хостинг:** Docker, docker-compose, Timeweb Cloud


### manual deployment: 

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


### first commands deploy with gitlab-ci:

sudo apt update && sudo apt install git curl
curl -fsSL https://get.docker.com | sudo bash

sudo echo "gitlab-runner   ALL=(ALL:ALL) NOPASSWD:ALL" >> /etc/sudoers
sudo usermod -aG docker gitlab-runner