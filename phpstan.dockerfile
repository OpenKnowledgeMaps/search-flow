FROM php:8.2-cli-alpine

RUN apk add --no-cache autoconf dpkg-dev dpkg file g++ gcc libc-dev make pkgconf re2c linux-headers \
    && pecl install xdebug \
    && docker-php-ext-enable xdebug

RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

WORKDIR /app
COPY composer.json composer.lock ./
RUN composer install --no-interaction --no-scripts --optimize-autoloader

COPY . .

CMD ["vendor/bin/phpstan", "analyse", "--level", "8", "--memory-limit", "4048M"]