# Static site served by nginx, running as a non-root user on port 8080.
FROM nginxinc/nginx-unprivileged:1.27-alpine

COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

COPY --chown=nginx:nginx *.html /usr/share/nginx/html/
COPY --chown=nginx:nginx assets /usr/share/nginx/html/assets
COPY --chown=nginx:nginx images /usr/share/nginx/html/images

EXPOSE 8080
