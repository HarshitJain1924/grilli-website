# Stage 1: Use a lightweight Nginx image to serve static files
FROM nginx:stable-alpine as production-stage

# Remove default Nginx welcome page (optional but clean)
RUN rm -rf /usr/share/nginx/html/*

# Copy the static website content
COPY ./Grilli/ /usr/share/nginx/html/

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# The base Nginx image already has a CMD to start Nginx in the foreground.
# CMD ["nginx", "-g", "daemon off;"] is inherited.