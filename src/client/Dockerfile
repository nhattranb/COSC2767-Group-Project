FROM node:16 AS client

WORKDIR /app

ARG VERSION
ENV VERSION=$VERSION
ARG BUILD_TIMESTAMP
ENV BUILD_TIMESTAMP=$BUILD_TIMESTAMP

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

COPY . .

ARG NODE_ENV
ENV NODE_ENV=$NODE_ENV

ARG API_URL
ENV API_URL=${API_URL}

# Build the production application
RUN npm run build

FROM nginx:alpine
# COPY nginx.conf /etc/nginx/conf.d
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=client /app/dist /usr/share/nginx/html
EXPOSE 80
# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
