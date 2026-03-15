# descargo imagen con node y alpine npm, Angular CLI, TypeScript
FROM node:20-alpine AS build

#cre la carpeta de trabajo dentro del contenedor
WORKDIR /app

# jalo todos archivos de configuración
COPY package*.json ./
COPY angular.json ./
COPY tsconfig*.json ./

# INSTALAR todas las dependencias (jalo las dependecias que ya se copiaron en los copy anteriores)
RUN npm ci

# Copiar código fuente
COPY src/ ./src/
COPY public/ ./public/

#CONTRUIR la aplicación
# (esto depende de los archivos que se hayan copiado LO QUE SE INSTALO antes osea depende que loque se haya copiado en src/ y public/)
RUN npm run build

# Nginx Dame un servidor web Nginx que ya esté instalado y funcionando en Alpine Linux"
FROM nginx:alpine

# Copiar la aplicación construida Y O LLEVAMOS DONDE NGINX LA ESPERA O BUSCA SUS ARCHIVOS
COPY --from=build /app/dist/hvpresentacion/browser /usr/share/nginx/html

# Copiar configuración personalizada de Nginx QUE SE CREÓ ANTES Y LO COPIAMOS DONDE NGINX LA ESPERA SU CONFIGURACIÓN
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponer puerto 80
EXPOSE 80

#CMD: Comando que se ejecuta cuando inicia el contenedor
#nginx: Arrancar el servidor web Nginx
#-g "daemon off;": Ejecutar en primer plano (no en background)
CMD ["nginx", "-g", "daemon off;"]
