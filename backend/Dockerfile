# Use this when Railway "Root Directory" is set to `backend/`.
# Same PHP + pdo_pgsql stack as the repo-root Dockerfile.

FROM php:8.2-cli

RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq-dev \
    && docker-php-ext-install -j$(nproc) pdo pdo_pgsql \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY . .

ENV PORT=8080
EXPOSE 8080

CMD ["sh", "-c", "exec php -S 0.0.0.0:${PORT} index.php"]
