# Railway / cloud deploy: official PHP CLI with PostgreSQL (Supabase) support.
# Nixpacks/default PHP images often lack pdo_pgsql, which caused "could not find driver".

FROM php:8.2-cli

RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq-dev \
    && docker-php-ext-install -j$(nproc) pdo pdo_pgsql \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app/backend

COPY backend/ ./

ENV PORT=8080
EXPOSE 8080

# Railway sets $PORT; listen on all interfaces for the health checker.
CMD ["sh", "-c", "exec php -S 0.0.0.0:${PORT} index.php"]
