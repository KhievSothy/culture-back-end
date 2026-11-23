FROM node:24-bookworm-slim
ENV TZ="Asia/Bangkok"
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev"]