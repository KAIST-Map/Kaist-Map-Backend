# Builder stage
FROM node:20-alpine as builder
ENV TZ=Asia/Seoul
RUN apk add --no-cache openssl

WORKDIR /usr/src/app

COPY package.json yarn.lock ./
RUN yarn install

COPY . .
RUN yarn global add dotenv-cli
RUN yarn prisma generate
RUN yarn build

# Runner stage
FROM node:20-alpine as runner
ENV TZ=Asia/Seoul
ENV PORT=3000
ENV NODE_ENV=dev

WORKDIR /usr/src/app

# OpenSSL 설치
RUN apk add --no-cache openssl 

# 빌드 결과물 복사
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package.json ./package.json
COPY --from=builder /usr/src/app/.dev.env ./.dev.env  


# 포트 노출
EXPOSE 3000

# 헬스체크를 위한 startup probe 설정
HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

CMD ["node", "dist/main.js"]