# 1️⃣ Node.js를 사용하여 React 빌드
FROM node:18 as build

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=$REACT_APP_API_URL
RUN npm run build

# 2️⃣ Nginx를 사용하여 정적 파일 서빙
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html

# 3️⃣ Nginx 설정 복사
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
