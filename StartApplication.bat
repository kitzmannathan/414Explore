@echo off
SET mypath=%~dp0
cd %userprofile%\downloads 
curl "https://nodejs.org/dist/v20.10.0/node-v20.10.0-x64.msi" --output node.msi
start /wait node.msi
cd %mypath:~0,-1%
cd ./414explore
start cmd.exe /k npm start
start cmd.exe /k npm run start-server
@echo off
exit