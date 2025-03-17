# 1️⃣ Node.js를 사용하여 React 빌드
FROM node:18 as build

WORKDIR /app

# 패키지 설치
COPY package.json package-lock.json ./
RUN npm install

# 소스코드 및 환경변수 복사
COPY . .

# API URL 인젝션 (환경변수 주입)
ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=${REACT_APP_API_URL}
RUN npm run build

# 2️⃣ Nginx를 사용하여 정적 파일 서빙 + 커스텀 설정
FROM nginx:alpine

# React 빌드 결과물 복사
COPY --from=build /app/build /usr/share/nginx/html

# nginx 설정 복사
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

# NGINX 실행
CMD ["nginx", "-g", "daemon off;"]
