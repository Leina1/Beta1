# 🗄️ Hướng dẫn Setup MongoDB cho Dự án

## ✅ Đã hoàn thành

1. ✅ Tạo file `.env.local` với MONGODB_URI
2. ✅ Cập nhật tất cả API để kết nối MongoDB thật
3. ✅ Loại bỏ fake data

---

## 📋 Các API đã được cập nhật

### 1. **POST /api/register** - Đăng ký user mới
- Lưu user vào MongoDB collection `User`
- Hash password bằng bcryptjs
- Kiểm tra email trùng lặp

### 2. **POST /api/login** - Đăng nhập
- Tìm user trong MongoDB
- So sánh password với bcrypt
- Tạo cookie session

### 3. **POST /api/auth/login** - Đăng nhập (auth route)
- Kết nối MongoDB
- Validate credentials
- Return JWT token

### 4. **GET /api/users** - Lấy danh sách users
- Pagination support
- Search theo fullname/email
- Loại bỏ passwordHash trong response

### 5. **POST /api/users** - Tạo user mới
- Validation đầy đủ
- Hash password
- Kiểm tra email tồn tại

### 6. **PUT /api/users** - Cập nhật user
- Update theo ObjectId
- Chỉ update các field được cung cấp

### 7. **DELETE /api/users** - Xóa user
- Delete theo ObjectId

---

## 🚀 Cách chạy dự án

### Bước 1: Cài đặt MongoDB

**Option 1: MongoDB Local** (khuyên dùng cho dev)
```bash
# Ubuntu/Debian
sudo apt-get install mongodb

# macOS
brew install mongodb-community

# Windows
# Download từ: https://www.mongodb.com/try/download/community
```

**Option 2: MongoDB Atlas** (Cloud - miễn phí)
1. Đăng ký tại: https://www.mongodb.com/cloud/atlas
2. Tạo cluster miễn phí
3. Lấy connection string
4. Cập nhật `.env.local`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/DoAn2
   ```

### Bước 2: Khởi động MongoDB (nếu dùng local)
```bash
# Ubuntu/Linux
sudo systemctl start mongodb
sudo systemctl status mongodb

# macOS
brew services start mongodb-community

# Windows
# Chạy MongoDB Compass hoặc mongod.exe
```

### Bước 3: Kiểm tra kết nối
```bash
# Kết nối với MongoDB shell
mongosh mongodb://localhost:27017/DoAn2

# Hoặc
mongo mongodb://localhost:27017/DoAn2
```

### Bước 4: Cài đặt dependencies
```bash
npm install
```

### Bước 5: Chạy Next.js dev server
```bash
npm run dev
```

Mở trình duyệt: http://localhost:3000

---

## 🧪 Test các API

### 1. Test đăng ký user
```bash
curl -X POST http://localhost:3000/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullname": "Nguyễn Văn A",
    "email": "test@example.com",
    "phone": "0123456789",
    "password": "123456",
    "confirmPassword": "123456"
  }'
```

### 2. Test đăng nhập
```bash
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "test@example.com",
    "password": "123456"
  }'
```

### 3. Test lấy danh sách users
```bash
curl http://localhost:3000/api/users
```

### 4. Test tạo user mới (qua API users)
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "fullname": "Test User",
    "email": "user@test.com",
    "password": "password123",
    "phone": "0987654321"
  }'
```

---

## 🗄️ Cấu trúc MongoDB

### Database: `DoAn2`

### Collection: `User`
```javascript
{
  _id: ObjectId,
  fullname: String,
  email: String,        // unique
  phone: String,
  passwordHash: String, // bcrypt hashed
  role: String,         // 'user' hoặc 'admin'
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔍 Kiểm tra dữ liệu trong MongoDB

```bash
# Mở MongoDB shell
mongosh

# Chuyển sang database DoAn2
use DoAn2

# Xem tất cả users
db.User.find().pretty()

# Đếm số lượng users
db.User.countDocuments()

# Tìm user theo email
db.User.findOne({ email: "test@example.com" })

# Xóa tất cả users (cẩn thận!)
db.User.deleteMany({})
```

---

## ⚠️ Lưu ý

1. **File .env.local không được commit** - Đã thêm vào .gitignore
2. **MongoDB phải chạy** trước khi start Next.js
3. **Password đã được hash** - Không thể đọc plaintext
4. **Cookie-based auth** - Sử dụng httpOnly cookies

---

## 🐛 Troubleshooting

### Lỗi: "MongoServerError: connect ECONNREFUSED"
**Nguyên nhân**: MongoDB chưa chạy

**Giải pháp**:
```bash
sudo systemctl start mongodb
# hoặc
brew services start mongodb-community
```

### Lỗi: "MONGODB_URI is not defined"
**Nguyên nhân**: Thiếu file .env.local

**Giải pháp**: Đảm bảo file `.env.local` tồn tại ở root project

### Lỗi: "MongoServerSelectionError: connection refused"
**Nguyên nhân**:
- MongoDB chưa cài đặt
- Port 27017 bị chiếm

**Giải pháp**:
```bash
# Kiểm tra port
lsof -i :27017

# Cài đặt MongoDB
sudo apt-get install mongodb
```

---

## 📚 Tài liệu tham khảo

- [MongoDB Manual](https://docs.mongodb.com/manual/)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)
- [bcryptjs](https://www.npmjs.com/package/bcryptjs)
