FROM php:8.2.30-fpm

RUN apt-get update && apt-get install -y \
    libpq-dev \
    git \
    curl \
    zip \
    vim \
    unzip

RUN docker-php-ext-configure pgsql -with-pgsql=/usr/local/pgsql \
    && docker-php-ext-install pdo pdo_pgsql pgsql
    
WORKDIR /var/www