# Use an official PHP image with Apache
FROM php:8.2-apache

# Copy the application files to the web root
COPY . /var/www/html/

# Enable Apache's mod_rewrite for the .htaccess file
RUN a2enmod rewrite
