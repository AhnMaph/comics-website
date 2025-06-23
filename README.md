---

# Nền tảng CNA

Một website đầy đủ tính năng dành cho Truyện tranh, Tiểu thuyết và Sách nói.

---
## Thành viên nhóm thực hiện:

| Họ và tên    | MSSV     |
| ------------ | -------- |
| Phạm Thanh An | 23520027 |
| Nguyễn Ngọc Diệu Duyên  | 23520401 |
| Trần Việt Khải    | 23520673 |


## Tính năng

* 📚 **Truyện tranh** (kiểu manga, có hình ảnh minh họa)
  ![image](https://github.com/user-attachments/assets/7e5d62a6-9442-41bb-80c8-cb3c90ffda8a)

* 📖 **Tiểu thuyết** (truyện văn bản thuần túy)
  ![image](https://github.com/user-attachments/assets/016c7da8-4ef8-4893-98ef-72e50a1bbcdc)

* 🎧 **Sách nói** (nghe truyện được đọc lại)
  ![image](https://github.com/user-attachments/assets/623bf27e-ff87-49f1-beda-37facfb82eac)


---

## Cấu trúc Dự án

```
├── backend/      # Backend Django
├── frontend/     # Frontend React/TypeScript
├── docker-compose.yml
├── Makefile      # Tự động hóa quy trình làm việc với Docker và local
└── README.md
```

---

## 1. Cài đặt Môi trường

### Yêu cầu trước

* [Docker](https://docs.docker.com/get-docker/) & [Docker Compose](https://docs.docker.com/compose/install/) (khuyến nghị)
* Hoặc: Python 3.8+, Node.js 18+, npm 9+ (nếu phát triển local)

### Clone repository

```bash
git clone https://github.com/AhnMaph/comics-website.git
cd comics-website
```

### Biến môi trường

#### a. Chạy demo local

Tạo file `.env` trong thư mục `backend` với nội dung tối thiểu:

```
SUPERUSER_USERNAME=your_username
SUPERUSER_EMAIL=your_email
SUPERUSER_PASSWORD=your_password
```

Tạo file `.env` trong thư mục `frontend` với nội dung tối thiểu:

```
VITE_ADMIN_URL=http://localhost:8000
VITE_FRONTEND_URL=http://localhost:5174
```

#### b. Chạy demo với Docker

Tạo thêm một file `.env` ở thư mục gốc của dự án với nội dung tối thiểu:

```
SUPERUSER_USERNAME=your_username
SUPERUSER_EMAIL=your_email
SUPERUSER_PASSWORD=your_password
VITE_ADMIN_URL=http://localhost:8000
VITE_FRONTEND_URL=http://localhost:5174
```

---

## 2. Sử dụng Makefile

Tất cả tác vụ phổ biến đã được tự động hóa thông qua `Makefile`. Chạy `make help` để xem tất cả lệnh có sẵn.

### Phát triển local (không dùng Docker)

* **Khởi động backend:**

  ```bash
  make run-backend
  ```

  Chạy Django tại [http://127.0.0.1:8000/](http://127.0.0.1:8000/)

* **Khởi động frontend:**

  ```bash
  make run-frontend
  ```

  Chạy React tại [http://127.0.0.1:5174/](http://127.0.0.1:5174/)

* **Chạy migrate database:**

  ```bash
  make migrate
  ```

* **Tạo migration mới:**

  ```bash
  make makemigrations
  ```

* **Thêm dữ liệu demo:**

  ```bash
  make add-demo-data
  ```

> **Lưu ý:** Với môi trường local, cần cài dependency trước:
>
> * Backend: `pip install -r backend/requirements.txt`
> * Frontend: `cd frontend && npm install`

---

### Phát triển với Docker

* **Khởi động toàn bộ dịch vụ (và build nếu cần):**

  ```bash
  make up
  ```

* **Dừng và xóa container/volume:**

  ```bash
  make down
  ```

* **Khởi động lại dịch vụ:**

  ```bash
  make restart
  ```

* **Xem log:**

  ```bash
  make logs
  ```

* **Mở shell trong container backend:**

  ```bash
  make shell-backend
  ```

* **Mở shell trong container frontend:**

  ```bash
  make shell-frontend
  ```

* **Dọn dẹp toàn bộ:**

  ```bash
  make clean
  ```

* **Build lại mọi thứ:**

  ```bash
  make rebuild
  ```

---

## 3. Truy cập Website

* **Backend:** [http://127.0.0.1:8000/](http://127.0.0.1:8000/)
* **Frontend:** [http://127.0.0.1:5174/](http://127.0.0.1:5174/)

---

## 4. Xử lý sự cố

* Dùng `make logs` để xem log.
* Dùng `make clean-port` nếu cổng 8000/5174 đang bị chiếm.
* Dùng `make prune` để xóa dữ liệu Docker không sử dụng.

---

## 5. Ghi chú thêm

* Dùng `make help` để xem thêm lệnh.
* Đảm bảo file `.env` của bạn đã được thiết lập để tạo admin.
---

Chúc bạn đọc truyện và nghe sách vui vẻ!

---

Nếu bạn muốn mình chuyển nội dung này sang file `.md` tiếng Việt hoặc đóng gói thành tài liệu hướng dẫn, mình có thể hỗ trợ luôn nhé.
