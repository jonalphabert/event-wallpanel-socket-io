FROM node:20
WORKDIR /srv
COPY package.json ./package.json
RUN npm install --production
COPY . .
ENV SERVER_PORT=5000
EXPOSE 5000
CMD ["npm","run","start"]
