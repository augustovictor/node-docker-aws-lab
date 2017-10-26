FROM node:8-alpine

EXPOSE 3000

RUN mkdir -p usr/app/aws-lab

WORKDIR usr/app/aws-lab

COPY package.json .

RUN npm install --silent --progress=false 

COPY . .

CMD ["npm", "start"]