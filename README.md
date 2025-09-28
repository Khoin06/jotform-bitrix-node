# Jotform - Bitrix24 Integration

Ứng dụng tích hợp API giữa Jotform và Bitrix24, tự động tạo Contact trong Bitrix24 khi có dữ liệu mới từ biểu mẫu Jotform.

## 🚀 Tính năng

- Nhận webhook từ Jotform khi có submission mới
- Xử lý và validate dữ liệu từ biểu mẫu
- Tạo Contact tự động trong Bitrix24 CRM
- Logging chi tiết các hoạt động
- API manual sync để đồng bộ dữ liệu thủ công
- Health check để kiểm tra trạng thái hệ thống

## 📋 Yêu cầu hệ thống

- Node.js 16.x hoặc cao hơn
- npm hoặc yarn
- Tài khoản Jotform
- Tài khoản Bitrix24

## 🔧 Cài đặt

### 1. Clone repository

```bash
git clone <repository-url>
cd jotform-bitrix24-integration

### 2. Cài đặt dependencies

```bash
npm install

### 3.Cấu hình environment variables
- Tạo file .env từ template:

```bash
cp .env.example .env

-Chỉnh sửa file .env với thông tin của bạn:
```bash
# Server Configuration
PORT=3000
NODE_ENV=development

# Jotform Configuration
JOTFORM_API_KEY=your_jotform_api_key_here
JOTFORM_FORM_ID=your_form_id_here

# Bitrix24 Configuration
BITRIX24_WEBHOOK_URL=https://your-domain.bitrix24.com/rest/1/your-webhook-token

# Logging
LOG_LEVEL=info

##🔑 Lấy thông tin xác thực
### 1. Jotform API Key
- Đăng nhập vào Jotform
- Truy cập My Settings → API
- Tạo API Key mới hoặc sử dụng key có sẵn
- Copy vào JOTFORM_API_KEY trong file .env

### 2. Jotform Form ID
- Tạo biểu mẫu mới trên Jotform với các trường:
- Họ và tên (Full Name)
- Số điện thoại (Phone Number)
- Email

- Lấy Form ID từ URL: https://www.jotform.com/your-form-id/edit
- Copy vào JOTFORM_FORM_ID trong file .env

### 3. Bitrix24 Webhook URL
- Đăng nhập vào Bitrix24
- Truy cập Settings → Integration → REST API
- Tạo webhook mới với quyền (scope): crm
- Copy URL và paste vào BITRIX24_WEBHOOK_URL trong file .env

##🚀 Chạy ứng dụng
- Development mode
```bash
npm run dev

-Production mode
```bash
npm start


-Ứng dụng sẽ chạy trên:
👉 http://localhost:3000