# Stage 1: Use a lightweight Nginx image to serve static files
FROM nginx:stable-alpine as production-stage

# Remove default Nginx welcome page (optional but clean)
RUN rm -rf /usr/share/nginx/html/*

# Copy the static website content from the 'grilli' subdirectory
# into the Nginx default public HTML directory.
# Note: The build context is 'your-project-root', so we copy from './grilli/'
COPY ./Grilli/ /usr/share/nginx/html/

# Expose port 80 (Nginx default HTTP port)
EXPOSE 80

# The base Nginx image already has a CMD to start Nginx in the foreground.
# CMD ["nginx", "-g", "daemon off;"] is inherited.