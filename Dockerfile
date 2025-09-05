# ========== �����׶� ==========
FROM node:18 AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .

RUN npm run build:dev

# ========== ���н׶� ==========
FROM nginx:alpine

# ���� nginx �������õ�Ŀ¼
RUN mkdir -p /home/work/web/dist

# �����������ﵽ nginx ������ָ����Ŀ¼
COPY --from=builder /app/dist /home/work/web/dist

# ������� nginx �����ļ�
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Cloud Run Ĭ��ʹ�� 8080 �˿�
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
