# syntax=docker.io/docker/dockerfile:1

FROM node:22-alpine AS base

# Stage 1: Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat openssl
RUN corepack enable pnpm
ENV PNPM_HOME=/pnpm
ENV PATH="$PNPM_HOME:$PATH"

WORKDIR /app

# Copy root package files for monorepo
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/ssurak/package.json ./apps/ssurak/package.json
COPY packages/db/package.json ./packages/db/package.json
COPY packages/auth/package.json ./packages/auth/package.json
COPY packages/api/package.json ./packages/api/package.json

# Install dependencies with pnpm (store cached & shared across app builds)
RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store \
    pnpm i --frozen-lockfile

# Copy prisma schema and .env, then generate client
COPY packages/db/prisma ./packages/db/prisma
COPY .env ./.env
RUN pnpm --filter=@spaceorder/db exec prisma generate

# Development stage
FROM deps AS development
WORKDIR /app

ENV NODE_ENV=development

EXPOSE 8080

CMD ["sh", "-c", "corepack enable pnpm && pnpm --filter=@spaceorder/db exec prisma migrate deploy && if [ \"$RUN_PRISMA_SEED\" = \"true\" ]; then pnpm --filter=@spaceorder/db exec prisma db seed; fi && pnpm --filter=@spaceorder/ssurak dev"]



# Stage 2: Production runtime (transpile-on-run)
#
# 워크스페이스 패키지(@spaceorder/*)가 TS 소스(main: index.ts)로 노출되어 있어,
# SWC 컴파일 산출물(dist)이 자기완결적이지 않다(런타임에 @spaceorder/* 가 .js 로
# 해석되지 않음). 따라서 dev와 동일하게 ts-node transpile 로더로 소스를 직접 실행한다.
# 차이는 워치(nodemon) 없이 1회 기동한다는 점뿐이다.
#
# 더 가벼운 이미지를 원하면 webpack 번들 또는 패키지 dist 컴파일로 전환할 수 있으나,
# Prisma/Socket.IO 번들링과 모노레포 exports 정비가 필요해 별도 작업으로 둔다.
FROM deps AS prod
WORKDIR /app

# 전체 모노레포 소스 복사.
# node_modules / .next / dist 등은 .dockerignore 로 제외되어, deps 단계에서 설치한
# node_modules 와 생성된 Prisma client 가 그대로 보존된다.
COPY . .

ENV NODE_ENV=production

WORKDIR /app/apps/ssurak
EXPOSE 8080

CMD ["node", "-r", "tsconfig-paths/register", "-r", "ts-node/register/transpile-only", "src/main.ts"]
