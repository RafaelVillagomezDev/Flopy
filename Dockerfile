FROM nginx:alpine

RUN rm /etc/nginx/conf.d/default.conf

# Copiamos nuestra configuración
COPY nginx.conf /etc/nginx/conf.d/default.conf


COPY dist/ /usr/share/nginx/html/

# Exponemos el puerto 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]