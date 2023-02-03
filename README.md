# solar-planel-power-detection
source venv/Scripts/activate

pip install -r requirements.txt

--- If a port not free ---
netstat -ano | findstr : ' '
taskkill /PID ' ' /F

--- Its for my direction path ---- docker run -t --rm -p 8502:8502 -v D:/400c_data/project:/project tensorflow/serving --rest_api_port=8502 --model_config_file=/project/models.config

--- For vscode --- Set-ExecutionPolicy RemoteSigned A

--- if docker don't respond --- 
net stop winnat 
net start winnat

--- frontend --- 
Install Nodejs 
Install npm 
cd frontend 
npm install --from-lock-json 
npm audit fix

--- pull from git --- 
git clone https://github.com/shamsurlm10/solar-planel-power-detection.git 
cd Dust-Detection/ 
python -m virtualenv venv 
source venv/Scripts/activate 
pip install -r requirements.txt

--- Mobile App --- https://www.youtube.com/watch?v=-5WLKu_J_AE 
choco install -y nodejs-lts microsoft-openjdk11
