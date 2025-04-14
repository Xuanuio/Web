const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const favicon = require('serve-favicon');
const PORT = 3000;

// Middleware để phục vụ tệp tĩnh từ thư mục 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Gắn favicon
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

// Middleware để xử lý JSON
app.use(express.json());

const dataFile = path.join(__dirname, 'data.json');

// Phục vụ tệp index.html cho route chính
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// POST: Nhận dữ liệu form
app.post('/api/submit', (req, res) => {
  try {
    const formData = req.body;
    formData.timestamp = new Date().toISOString();

    let data = [];
    if (fs.existsSync(dataFile)) {
      data = JSON.parse(fs.readFileSync(dataFile));
    }
    data.push(formData);

    fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
    res.json({ status: 'success', message: 'Đã cập nhật thông tin thành công!' });
  } catch (error) {
    console.error('Lỗi khi xử lý form:', error);
    res.status(500).json({ status: 'error', message: 'Lỗi server khi lưu dữ liệu.' });
  }
});

// GET: Hiển thị danh sách người dùng đã submit
app.get('/users', (req, res) => {
  try {
    if (fs.existsSync(dataFile)) {
      const data = JSON.parse(fs.readFileSync(dataFile));
      let html = `<h2>Danh sách người đã gửi form:</h2><ul>`;
      data.forEach((item, index) => {
        html += `<li><strong>${index + 1}. ${item.name}</strong> – ${item.email}</li>`;
      });
      html += `</ul>`;
      res.send(html);
    } else {
      res.send('Chưa có dữ liệu.');
    }
  } catch (error) {
    console.error('Lỗi khi đọc dữ liệu:', error);
    res.status(500).send('Lỗi server khi đọc dữ liệu.');
  }
});

// Xử lý lỗi 404 cho các route không tồn tại
app.use((req, res) => {
  res.status(404).send('Không tìm thấy tài nguyên.');
});

app.listen(PORT, () => {
  console.log(`Server đang chạy tại: http://localhost:${PORT}`);
});