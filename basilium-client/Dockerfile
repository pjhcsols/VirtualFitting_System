# React Application Builder
FROM node:22-alpine AS builder

RUN apk add --no-cache curl unzip bash

RUN curl -fsSL https://bun.sh/install.sh | bash
ENV PATH="/root/.bun/bin:$PATH"

RUN npm install -g typescript@5.4.5 http-server

WORKDIR /app

COPY package.json bun.lock ./

RUN bun install --frozen-lockfile

COPY . .

RUN bun run build

# React Application Deployment
FROM node:22-alpine AS production

WORKDIR /app

COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["npx", "http-server", "dist" ,"-p", "3000"]