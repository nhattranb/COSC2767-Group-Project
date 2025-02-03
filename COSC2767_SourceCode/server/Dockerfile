# Stage 1: Build Stage
FROM node:16-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./

ARG NODE_ENV
ENV NODE_ENV=$NODE_ENV

ARG MONGO_URI
ENV MONGO_URI=$MONGO_URI

ARG CLIENT_URL
ENV CLIENT_URL=$CLIENT_URL

RUN npm install

COPY . ./

# Stage 2: Production Image
FROM node:16-alpine AS production

WORKDIR /app

COPY --from=build /app /app

EXPOSE 4000

CMD ["sh", "-c", "if [ \"$NODE_ENV\" = \"development\" ]; then nodemon index.js; else node index.js; fi"]
