FROM node:20-alpine AS builder

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npx nx build front-end

FROM nginx:alpine

COPY --from=builder /app/dist/apps/front-end /usr/share/nginx/html
COPY --from=builder /app/apps/front-end/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 5173

CMD ["nginx", "-g", "daemon off;"]
