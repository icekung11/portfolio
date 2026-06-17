# Stage 1: สร้างไฟล์เว็บ (Build)
FROM node:20-alpine AS builder
WORKDIR /app

# ก๊อปปี้ไฟล์การตั้งค่าและติดตั้งแพ็กเกจ
COPY package*.json ./
RUN npm ci

# ก๊อปปี้โค้ดทั้งหมด (รวมถึง .env ถ้ามี) แล้วสั่ง Build
COPY . .
RUN npm run build

# Stage 2: นำไฟล์ไปเปิดให้บริการด้วย Nginx
FROM nginx:alpine
# หมายเหตุ: ถ้าใช้ Vite โฟลเดอร์ที่ได้จะชื่อ dist แต่ถ้าใช้ Create React App จะชื่อ build
COPY --from=builder /app/dist /usr/share/nginx/html

# เปิดพอร์ต 80 ของ Nginx
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]