# ================================
# Stage 1: Build React Frontend
# ================================
FROM node:18 AS frontend-build
WORKDIR /app
COPY frontend/ .
RUN npm install
RUN npm run build

# ================================
# Stage 2: Setup PHP + Nginx
# ================================
FROM php:8.2-fpm

# Install Nginx and required PHP extensions for MySQL
RUN apt-get update && apt-get install -y \
    nginx \
    && docker-php-ext-install pdo pdo_mysql mysqli \
    && rm -rf /var/lib/apt/lists/*

# Copy React build output to web root
COPY --from=frontend-build /app/dist /var/www/html

# Copy PHP backend files
COPY backend/ /var/www/html/api/

# Copy Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Set correct permissions
RUN chown -R www-data:www-data /var/www/html

# Expose port 80
EXPOSE 80

# Start PHP-FPM and Nginx together
CMD service php8.2-fpm start && nginx -g "daemon off;"