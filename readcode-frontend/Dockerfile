FROM node:lts

WORKDIR /usr/src/app

COPY package*.json .

RUN ["npm","install"]

COPY . .

RUN npm run build
RUN npm install -g serve

EXPOSE 3000

CMD ["serve","-s","build"]
#CMD ["npm","run","build"]
