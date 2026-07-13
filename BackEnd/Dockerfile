FROM composer:latest AS composer
WORKDIR /app
COPY composer.json composer.lock ./
RUN composer install \
    --no-dev \
    --no-interaction \
    --no-progress \
    --optimize-autoloader

FROM node:22-alpine AS node
WORKDIR /app
# تم التعديل هنا لتجاوز غياب ملف lock
COPY package*.json vite.config.js ./
RUN npm install
COPY resources/ resources/
RUN npm run build

FROM php:8.3-fpm-alpine

RUN set -eux \
    && apk add --no-cache \
        libzip \
        libpng \
        libjpeg-turbo \
        freetype \
        icu \
        oniguruma \
        libpq-dev \
    && apk add --no-cache --virtual .build-deps \
        $PHPIZE_DEPS \
        zip-dev \
        libpng-dev \
        libjpeg-turbo-dev \
        freetype-dev \
        icu-dev \
        oniguruma-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) \
        pdo_pgsql \
        bcmath \
        gd \
        zip \
        intl \
        mbstring \
        exif \
    && docker-php-ext-enable opcache \
    && apk del .build-deps

WORKDIR /app

COPY --from=composer /app/vendor /app/vendor
COPY --from=node /app/public/build /app/public/build
COPY . .

RUN composer dump-autoload \
    && cp .env.example .env \
    && php artisan key:generate \
    && php artisan optimize

RUN chown -R www-data:www-data /app/storage /app/bootstrap/cache

COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE 9000
ENTRYPOINT ["docker-entrypoint.sh"]