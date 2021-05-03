FROM node:current-alpine

WORKDIR /app
COPY . .
RUN yarn
ENV PRODUCTION=true
EXPOSE 5000

CMD ["node", "index.js"]