Remove-Item -Recurse -Force D:\DOCKER_COMPOSE\n8n\webapps\frontend\admin\node_modules
Remove-Item -Recurse -Force D:\DOCKER_COMPOSE\n8n\webapps\backend\node_modules
docker-compose up -d --build --force-recreate webapps
Read-Host -Prompt "Press Enter to continue"