# INT3105-55-CS1
## Contributors
- Đào Thị Bình An - 22028326
- Vũ Việt Hùng - 22028124
- Bùi Thị Huyền Tâm - 22028214
## Guide
```sh
# Cài đặt các gói liên quan
$ cd back end
$ npm install
$ cd frontend
$ npm install
$ cd gateway
% npm install
# Build docker
$ docker-compose build
# Khởi chạy ứng dụng
$ npm start
```

## Description
| Endpoint | Phương thức | Mục tiêu
|--|:--:|--|
| /short/:id | GET | Trả về đường dẫn gốc
| /create?url= | POST | Trả về ID được thu gọn
| /register | POST | Đăng ký thông tin người dùng
| /login | POST | Đăng nhập
| /my-urls | GET | Xem danh sách các url đã short của người dùng
| /delete-urls/:id | DELETE | Xóa url mà người dùng muốn xóa 
