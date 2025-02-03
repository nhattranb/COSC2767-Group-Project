# Stage 1: Build Stage
FROM node:18.0.0-slim

WORKDIR /app

ARG MONGO_URI
ENV MONGO_URI=$MONGO_URI

ARG CLIENT_URL
ENV CLIENT_URL=$CLIENT_URL

COPY package.json package-lock.json ./

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
# ENV DEBIAN_FRONTEND=noninteractive

RUN npm install -g jest
# Install Google Chrome Stable and fonts
# Note: this installs the necessary libs to make the browser work with Puppeteer.
RUN apt-get update && apt-get install curl gnupg -y \
  && curl --location --silent https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
  && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
  && apt-get update \
  && apt-get install google-chrome-stable -y --no-install-recommends \
  && rm -rf /var/lib/apt/lists/*

RUN npm install

COPY . ./

CMD ["yarn", "test:integration"]
