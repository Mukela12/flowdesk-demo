FROM node:20-alpine

WORKDIR /app

COPY package*.json .npmrc ./
RUN npm install --legacy-peer-deps

COPY . .

EXPOSE 3001

CMD ["sh", "-c", "npx tsx src/db/migrate.ts && npx tsx src/index.ts"]
