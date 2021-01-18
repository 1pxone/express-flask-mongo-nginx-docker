##########
# Reverse proxy for facilitating serving the static UI files and the flask API
###########

FROM nginx:1.15-alpine

RUN rm -f /etc/nginx/conf.d/*

COPY nginx.conf /etc/nginx/conf.d/app.conf
