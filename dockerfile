FROM --platform=$BUILDPLATFORM node:22-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npx ng build --configuration production --base-href /player/

FROM nginx:alpine

COPY --from=build /app/dist/gin-tonic-web-player/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

CMD ["/bin/sh", "-c", "envsubst < /usr/share/nginx/html/assets/env.template.js > /usr/share/nginx/html/assets/env.js && exec nginx -g 'daemon off;'"]