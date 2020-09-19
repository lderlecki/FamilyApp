# Stage 1
FROM node:latest as build-step
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build --prod
  # Stage 2
FROM nginx:alpine
#destination folder name in angular.json
COPY --from=build-step /app/dist/familyfront-app /usr/share/nginx/html
EXPOSE 4200


