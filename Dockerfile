FROM node:current-alpine

WORKDIR /app
COPY . .
RUN yarn
EXPOSE 5000
ENV PRODUCTION=true

CMD ["node", "index.js"]