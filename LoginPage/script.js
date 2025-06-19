/* Hàm kiểm tra email và chuyển hướng */
function validateEmail() {
  /* Lấy giá trị email từ ô nhập */
  const email = document.getElementById("emailInput").value.trim();
  /* Kiểm tra nếu email rỗng hoặc chỉ chứa khoảng trắng */
  if (!email) {
    /* Hiển thị thông báo yêu cầu nhập email */
    alert("Vui lòng nhập địa chỉ email!");
    return;
  }
  /* Kiểm tra email có kết thúc bằng @gmail.com */
  if (email.endsWith("@gmail.com")) {
    try {
      /* Chuyển hướng đến index.html trong thư mục HomePage */
      window.location.href = "../HomePage/index.html";
    } catch (error) {
      /* Hiển thị lỗi nếu chuyển hướng thất bại */
      alert(
        "Lỗi chuyển hướng: " +
          error.message +
          ". Vui lòng kiểm tra thư mục HomePage và file index.html tồn tại."
      );
    }
  } else {
    /* Hiển thị thông báo lỗi nếu email không hợp lệ */
    alert("Vui lòng nhập địa chỉ Gmail hợp lệ (kết thúc bằng @gmail.com)");
  }
}
