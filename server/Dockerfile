# kar_refah_server/Dockerfile
FROM node:22-alpine

WORKDIR /app

# کپی فایل‌های dependency
COPY package*.json ./
RUN npm ci --only=production

# کپی کل سورس کد
COPY . .

# مطمئن شو پوشه uploads وجود داشته باشد
RUN mkdir -p uploads

EXPOSE 5000

CMD ["node", "server.js"]
# یا npm start