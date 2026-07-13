#!/bin/sh
set -e

touch database/database.sqlite
php artisan migrate --force

php-fpm
