FROM node:18-alpine

# Çalışma dizinini oluştur
WORKDIR /usr/src/app

# Bağımlılıkları kopyala
COPY package*.json ./

# Bağımlılıkları yükle
RUN npm install

# Kaynak kodunu kopyala
COPY . .

# Portu dışa aç
EXPOSE 3000

# Uygulamayı başlat
CMD [ "node", "index.js" ]
