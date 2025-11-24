# 1) Basis-Image: schlankes Node.js Image
FROM node:22-alpine

# 2) Arbeitsverzeichnis im Container
WORKDIR /app

# 3) Nur package-Dateien kopieren (für schnellere Builds)
COPY package*.json ./

# 4) Dependencies installieren (ohne devDependencies, da Prod-Image)
RUN npm install --omit=dev

# 5) Restlichen Code ins Image kopieren
COPY . .

# 6) Environment für Produktion
ENV NODE_ENV=production

# 7) Port, auf dem die App im Container lauscht
EXPOSE 3000

# 8) Startkommando
CMD ["node", "index.js"]
