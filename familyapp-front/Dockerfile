# Stage 1
FROM node:latest as build-step

WORKDIR /app
COPY package.json ./app

RUN npm install -g @angular/cli @angular-devkit/build-angular && npm install

EXPOSE 4201

CMD ["npm", "start"]

