# -- 빌드 스테이지
FROM node:alpine AS build

COPY . /app

WORKDIR /app

RUN npm i

RUN npm run build

# -- 라이브러리 다운 스테이지
FROM node:alpine AS dependency

COPY --from=build /app/package.json /app/

WORKDIR /app

RUN npm i --omit=dev

# -- 순수 node 스테이지
FROM alpine AS runtime

RUN apk add --no-cache nodejs

COPY --from=build /app/dist /app/dist
COPY --from=dependency /app/node_modules /app/node_modules

WORKDIR /app

CMD ["node", "dist/main.js"]