/* Thêm sự kiện khi tài liệu được tải hoàn tất */
document.addEventListener("DOMContentLoaded", () => {
    /* Xử lý sự kiện click cho các nút mua vé */
    const ticketButtons = document.querySelectorAll(".btn-ticket");
    ticketButtons.forEach((button) => {
        button.addEventListener("click", () => {
            /* Hiển thị thông báo mua vé thành công */
            alert("Đã mua hehehehe");
            // Thay bằng logic chuyển hướng hoặc modal thực tế
        });
    });

    /* Xử lý sự kiện click cho nút mua bắp nước */
    const popcornButton = document.querySelector(".btn-popcorn");
    popcornButton.addEventListener("click", () => {
        /* Hiển thị thông báo mua bắp nước */
        alert("Đã mua bắp nước");
        // Thay bằng logic chuyển hướng hoặc modal thực tế
    });

    /* Xử lý sự kiện click cho nút xem thêm */
    const seeMoreButton = document.querySelector(".btn-see-more");
    seeMoreButton.addEventListener("click", () => {
        /* Hiển thị thông báo đang tải danh sách phim */
        alert("Đang tải danh sách phim...");
        // Thay bằng logic tải thêm phim
    });