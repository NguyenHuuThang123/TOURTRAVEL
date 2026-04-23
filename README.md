# TourTravel

Ứng dụng đặt tour full-stack với:
- Frontend: `React + Vite`
- Backend: `FastAPI`
- Database: `MongoDB`

## Tổng quan tính năng

- Trang chủ, danh sách tour, chi tiết tour
- Đăng nhập/đăng ký thường và Google Sign-In
- Đặt tour theo flow `Checkout -> Payment`
- Chọn phương thức thanh toán:
  - `Thẻ`
  - `Chuyển khoản ngân hàng`
  - `VNPAY`
- Đánh giá tour bằng sao và bình luận
- Trang tài khoản người dùng
- Dashboard quản trị và hướng dẫn viên
- Chat khách hàng / admin / guide

## Cấu trúc thư mục

```text
TOURTRAVEL/
├── FE_TOURTRAVEL/                 # Frontend React (Vite)
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── styles/
│   │   └── utils/
│   ├── package.json
│   └── .env
│
├── BE_TOURTRAVEL/                 # Backend FastAPI
│   ├── app/
│   │   ├── config/
│   │   ├── routes/
│   │   ├── schemas/
│   │   └── models/
│   ├── main.py
│   ├── requirements.txt
│   ├── .env
│   └── .env.example
│
├── docker-compose.yml
├── SETUP_GUIDE.md
└── FE_DESIGN_GUIDE.md
```

## Chạy nhanh

### Backend

```bash
cd BE_TOURTRAVEL
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python main.py
```

Backend chạy tại:
- `http://localhost:8000`
- Swagger: `http://localhost:8000/docs`

### Frontend

```bash
cd FE_TOURTRAVEL
npm install
npm run dev
```

Frontend mặc định chạy tại:
- `http://localhost:5173`

## Biến môi trường

### Backend: `BE_TOURTRAVEL/.env`

Ví dụ:

```env
MONGODB_URL=mongodb://127.0.0.1:27017
MONGODB_DB_NAME=tourtravel
GOOGLE_CLIENT_ID=your_google_web_client_id
BACKEND_BASE_URL=http://localhost:8000
FRONTEND_BASE_URL=http://localhost:5173
VNPAY_TMN_CODE=your_vnpay_tmn_code
VNPAY_HASH_SECRET=your_vnpay_hash_secret
VNPAY_PAYMENT_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
VNPAY_RETURN_PATH=/api/payments/vnpay/return
DEBUG=true
```

### Frontend: `FE_TOURTRAVEL/.env`

```env
VITE_GOOGLE_CLIENT_ID=your_google_web_client_id
```

Lưu ý:
- `GOOGLE_CLIENT_ID` và `VITE_GOOGLE_CLIENT_ID` phải cùng một giá trị
- Sau khi đổi `.env`, cần restart backend/frontend

## Google Sign-In

Nếu gặp lỗi `origin_mismatch`, hãy kiểm tra `OAuth Client` trên Google Cloud Console.

Trong `Authorized JavaScript origins`, thêm đúng origin frontend đang chạy, ví dụ:
- `http://localhost:5173`
- `http://127.0.0.1:5173`

Không thêm path như `/login` hoặc `/register`.

## VNPAY

Flow hiện tại:
1. Người dùng nhập thông tin ở `Checkout`
2. Chuyển sang `Payment`
3. Chọn `VNPAY`
4. Backend tạo `payment session` và trả về `payment_url`
5. Frontend redirect sang cổng VNPAY
6. VNPAY trả về backend qua `return URL`
7. Backend verify checksum rồi mới tạo booking
8. Backend redirect về frontend trang kết quả

Các file chính:
- [BE_TOURTRAVEL/app/routes/payments.py](BE_TOURTRAVEL/app/routes/payments.py)
- [FE_TOURTRAVEL/src/pages/Payment.jsx](FE_TOURTRAVEL/src/pages/Payment.jsx)
- [FE_TOURTRAVEL/src/pages/VnpayReturn.jsx](FE_TOURTRAVEL/src/pages/VnpayReturn.jsx)

Lưu ý:
- Cần điền `VNPAY_TMN_CODE` và `VNPAY_HASH_SECRET`
- Nếu backend đã chạy trước khi cập nhật `.env`, phải restart server
- Môi trường local hiện dùng flow `return URL` để xác nhận giao dịch

## Reviews & Ratings

Khách hàng có thể đánh giá tour bằng sao và bình luận.

Điều kiện:
- Phải đăng nhập
- Phải là tài khoản `user`
- Phải có booking `confirmed` cho tour đó

Mỗi người dùng có thể:
- tạo 1 review / tour
- cập nhật lại review cũ

## API chính

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/google`
- `GET /api/auth/me`

### Tours
- `GET /api/tours/`
- `GET /api/tours/{tour_id}`
- `GET /api/tours/{tour_id}/reviews`
- `GET /api/tours/{tour_id}/reviews/my`
- `PUT /api/tours/{tour_id}/reviews/my`

### Bookings
- `POST /api/bookings/`
- `GET /api/bookings/my`
- `PUT /api/bookings/my/{booking_id}/cancel`

### Payments
- `POST /api/payments/vnpay/create`
- `GET /api/payments/vnpay/return`

## Ghi chú triển khai

- Backend dùng `python-dotenv` và hiện tự nạp `BE_TOURTRAVEL/.env` trong `settings.py`
- Mongo indexes được tạo ở `app/database.py`
- Booking total hiện được backend tính lại để khớp với summary thanh toán:
  - giá tour
  - phí xử lý
  - giảm giá đặt sớm
  - phí bảo hiểm nếu có

## Tài liệu thêm

- [SETUP_GUIDE.md](SETUP_GUIDE.md)
- [FE_DESIGN_GUIDE.md](FE_DESIGN_GUIDE.md)

## Tình trạng hiện tại

Các phần đã có:
- Google Sign-In
- Review/rating
- Payment page riêng
- VNPAY sandbox integration
- Admin / Guide dashboard

Các phần còn có thể mở rộng:
- IPN riêng cho VNPAY production
- Quản lý review trong admin
- Hiển thị phương thức thanh toán rõ hơn ở Account/Admin
