FROM node:18-alpine
WORKDIR /app
COPY package.json package.json
RUN npm install --silent
COPY server.js server.js
COPY db.json db.json
CMD ["node", "server.js"]
