FROM node:8-alpine

EXPOSE 3000

RUN mkdir -p usr/app/books-app

WORKDIR usr/app/books-app

COPY package.json .

RUN npm install --silent --progress=false 

COPY . .

CMD ["npm", "start"]