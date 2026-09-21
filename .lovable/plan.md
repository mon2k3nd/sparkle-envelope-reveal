# Sửa hiệu ứng mở phong bì thiệp cưới

## Mục tiêu
- Tiếp tục từ mã nguồn `invite-sparkle-reveal` hiện tại.
- Màn đầu hiển thị đúng một phong bì hoàn chỉnh, cân đối trên cả điện thoại và máy tính.
- Khi chạm mở, nắp phong bì mở trước, thiệp trượt lên và toàn bộ nội dung chính hiện ra rõ ràng, không bị cắt hoặc biến mất quá sớm.

## Cách thực hiện
1. Đưa toàn bộ mã nguồn và ảnh/nhạc hiện có của thiệp cưới vào dự án này.
2. Làm lại thứ tự các lớp của phong bì: thân sau, thiệp, hai mép trước, túi trước, nắp và dấu sáp.
3. Điều chỉnh chuyển động thành ba nhịp dễ hiểu: mở dấu sáp và nắp, kéo thiệp lên đủ cao để đọc, sau đó chuyển mượt sang trang thiệp đầy đủ.
4. Giữ nguyên nội dung, màu sắc, ảnh cưới, nhạc và các phần còn lại của trang.
5. Kiểm tra trực tiếp ở kích thước điện thoại và máy tính, bao gồm thao tác chạm mở và khả năng đọc đầy đủ thông tin sau khi mở.

## Chi tiết kỹ thuật
- Dùng CSS 3D và thứ tự lớp ổn định, không thêm thư viện mới.
- Thời gian mở sẽ ngắn hơn hiện tại và có chế độ giảm chuyển động cho người dùng đã bật tùy chọn này.
- Nếu trình duyệt không hỗ trợ tốt hiệu ứng 3D, phong bì vẫn mở theo chuyển động phẳng và nội dung vẫn xuất hiện đầy đủ.
