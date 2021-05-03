FROM node:current-alpine

WORKDIR /app
COPY . .
RUN yarn
EXPOSE 5000

CMD ["node", "index.js"]