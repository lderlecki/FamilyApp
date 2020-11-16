# Stage 1
FROM node:latest as build-step

WORKDIR /app
COPY package.json ./

RUN npm install -g @angular/cli @angular-devkit/build-angular --force && npm install --force

EXPOSE 4201

CMD ["npm", "start"]

