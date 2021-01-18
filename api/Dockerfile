FROM mhart/alpine-node

WORKDIR /express-api

COPY package*.json ./

RUN npm install --force

COPY . .

EXPOSE 3000

CMD ["yarn", "start"]

