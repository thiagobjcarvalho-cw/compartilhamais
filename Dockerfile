# Dockerfile frontend para CodeWave CompartilhaMais
FROM node:18-alpine
WORKDIR /app

# Instala dependências apenas pela primeira build (cache aproveitada)
COPY package*.json ./
RUN npm ci

COPY . .
EXPOSE 3000

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
