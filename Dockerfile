# ========== 构建阶段 ==========
FROM node:18 AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .

RUN npm run build:dev

# ========== 运行阶段 ==========
FROM nginx:alpine

# 创建 nginx 配置里用的目录
RUN mkdir -p /home/work/web/dist

# 拷贝构建产物到 nginx 配置里指定的目录
COPY --from=builder /app/dist /home/work/web/dist

# 拷贝你的 nginx 配置文件
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Cloud Run 默认使用 8080 端口
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
