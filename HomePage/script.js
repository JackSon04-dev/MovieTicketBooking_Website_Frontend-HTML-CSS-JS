// Hàm định dạng tiền tệ Việt Nam
function formatCurrency(amount) {
  return parseInt(amount || 0).toLocaleString("vi-VN") + "₫";
}

// Khi trang đã tải xong
document.addEventListener("DOMContentLoaded", () => {
  // Khai báo các phần tử popup và nút
  const seatPopup = document.getElementById("seat-selection-popup");
  const closeSeatBtn = document.getElementById("close-popup-btn");
  const paymentPopup = document.getElementById("payment-popup");
  const closePaymentBtn = document.getElementById("close-payment-btn");
  const ticketButtons = document.querySelectorAll(".btn-ticket");
  const seats = document.querySelectorAll(".seat:not(.occupied)");
  const selectedSeatsCount = document.getElementById("selected-seats-count");
  const totalPriceElement = document.getElementById("total-price");
  const cinemaSelect = document.getElementById("cinema-select");
  const showtimeSelect = document.getElementById("showtime-select");
  const confirmBookingBtn = document.getElementById("confirm-booking-btn");
  const hamburger = document.querySelector(".hamburger");
  const menuItems = document.querySelector(".menu-items");
  const popcornCombo = document.getElementById("popcorn-combo");
  const popcornQuantity = document.getElementById("popcorn-quantity");
  const popupMovieTitleSeat = document.getElementById("popup-movie-title-seat");
  const popupMovieTitlePayment = document.getElementById(
    "popup-movie-title-payment"
  );
  const popupCinemaName = document.getElementById("popup-cinema-name");
  const popupHallName = document.getElementById("popup-hall-name");
  const popupShowDate = document.getElementById("popup-show-date");
  const popupShowTime = document.getElementById("popup-show-time");
  const popupSelectedSeats = document.getElementById("popup-selected-seats");
  const popupComboName = document.getElementById("popup-combo-name");
  const popupComboQuantity = document.getElementById("popup-combo-quantity");
  const popupSubtotal = document.getElementById("popup-subtotal");
  const popupTotalAmount = document.getElementById("popup-total-amount");
  const popupDiscountCode = document.getElementById("popup-discount-code");
  const popupApplyDiscountBtn = document.getElementById(
    "popup-apply-discount-btn"
  );
  const popupConfirmPaymentBtn = document.getElementById(
    "popup-confirm-payment-btn"
  );

  // Kiểm tra các phần tử quan trọng
  if (!paymentPopup || !confirmBookingBtn) {
    console.error(
      "Error: paymentPopup or confirmBookingBtn not found in the document."
    );
    return;
  }

  // Khởi tạo mảng ghế đã chọn và giá vé
  let selectedSeats = [];
  const ticketPrice = 75000;
  let bookingData = {};

  // Cập nhật giá khi thay đổi combo hoặc số lượng
  function updatePrice() {
    const count = selectedSeats.length;
    selectedSeatsCount.textContent = count;
    const combo = popcornCombo?.value || "none";
    const quantity = parseInt(popcornQuantity?.value) || 0;
    let popcornPrice = 0;
    if (combo !== "none" && popcornCombo) {
      popcornPrice =
        parseInt(
          popcornCombo.querySelector(`option[value="${combo}"]`)?.dataset.price
        ) * quantity || 0;
    }
    const totalPrice = count * ticketPrice + popcornPrice;
    totalPriceElement.textContent = `${formatCurrency(totalPrice)}`;
  }

  // Mở popup
  function openPopup(popup) {
    if (popup) {
      popup.classList.add("active");
      console.log("Opening popup:", popup.id);
    } else {
      console.error("Error: Popup element is null");
    }
  }

  // Đóng popup
  function closePopup(popup) {
    if (popup && popup.classList.contains("active")) {
      popup.classList.remove("active");
      console.log("Closing popup:", popup.id);
    }
  }

  // Mở popup chọn ghế
  function openSeatPopup(movieTitle) {
    if (seatPopup) {
      popupMovieTitleSeat.textContent = `Chọn ghế cho phim: ${
        movieTitle || "Unknown Movie"
      }`;
      openPopup(seatPopup);
    } else {
      console.error("Error: seatPopup not found");
    }
  }

  // Đóng tất cả popup và reset
  function closeAllPopups() {
    closePopup(seatPopup);
    closePopup(paymentPopup);
    selectedSeats = [];
    seats.forEach((seat) => seat.classList.remove("selected"));
    updatePrice();
  }

  // Xử lý nút "Buy Tickets"
  ticketButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      if (button.closest(".coming-soon")) {
        e.preventDefault();
        alert("Phim này sắp chiếu, chưa thể mua vé. Vui lòng quay lại sau!");
        return;
      }
      if (button.closest(".button-group-header")) {
        alert("Có thể mua vé ở phần Phim Đang Chiếu !");
        return;
      }
      openSeatPopup(button.dataset.movie);
    });
  });

  // Xử lý đóng popup chọn ghế
  closeSeatBtn.addEventListener("click", closeAllPopups);

  // Xử lý chọn ghế
  seats.forEach((seat) => {
    seat.addEventListener("click", () => {
      if (!seat.classList.contains("occupied")) {
        seat.classList.toggle("selected");
        const seatId = seat.dataset.seat;
        if (selectedSeats.includes(seatId)) {
          selectedSeats = selectedSeats.filter((id) => id !== seatId);
        } else {
          selectedSeats.push(seatId);
        }
        updatePrice();
      }
    });
  });

  // Xử lý "Xác nhận đặt vé"
  confirmBookingBtn.addEventListener("click", () => {
    if (!seatPopup || !confirmBookingBtn) {
      console.error("seatPopup or confirmBookingBtn not found");
      return;
    }
    if (selectedSeats.length === 0) {
      alert("Vui lòng chọn ít nhất một ghế!");
      return;
    }
    const currentDate = new Date();
    const timeRange = `${currentDate.getHours()}:40 - ${
      currentDate.getHours() + 1
    }:40`;
    const showDate = currentDate.toLocaleDateString("en-GB");
    const combo = popcornCombo?.value || "none";
    const quantity = parseInt(popcornQuantity?.value) || 0;
    let popcornPrice = 0;
    let comboName = "Không chọn";
    if (combo !== "none" && popcornCombo) {
      popcornPrice =
        parseInt(
          popcornCombo.querySelector(`option[value="${combo}"]`)?.dataset.price
        ) * quantity || 0;
      comboName =
        popcornCombo.querySelector(`option[value="${combo}"]`)?.text ||
        "Không chọn";
    }
    bookingData = {
      movie: popupMovieTitleSeat.textContent.replace("Chọn ghế cho phim: ", ""),
      cinema:
        cinemaSelect?.options[cinemaSelect.selectedIndex]?.text ||
        "Unknown Cinema",
      showtime: showtimeSelect?.value || "Unknown Time",
      seats: selectedSeats,
      ticketPrice: selectedSeats.length * ticketPrice,
      time: timeRange,
      date: showDate,
      popcornCombo: comboName,
      popcornQuantity: quantity,
      popcornPrice: popcornPrice,
      totalPrice: selectedSeats.length * ticketPrice + popcornPrice,
    };
    localStorage.setItem("bookingData", JSON.stringify(bookingData));

    // Mở popup thanh toán và cập nhật thông tin
    closePopup(seatPopup);
    updatePaymentPopup();
    openPopup(paymentPopup);
  });

  // Cập nhật thông tin trong popup thanh toán
  function updatePaymentPopup() {
    const data = JSON.parse(localStorage.getItem("bookingData")) || {};
    popupMovieTitlePayment.textContent = data.movie || "Unknown Movie";
    popupCinemaName.textContent = data.cinema || "Unknown Cinema";
    popupHallName.textContent = "Cinema 3 - 2D"; // Giả định cố định
    popupShowDate.textContent = data.date || "Unknown Date";
    popupShowTime.textContent = data.time || "Unknown Time";
    popupSelectedSeats.textContent = data.seats?.join(", ") || "No seats";
    popupComboName.textContent = data.popcornCombo || "Không chọn";
    popupComboQuantity.textContent = data.popcornQuantity
      ? `Số lượng: ${data.popcornQuantity}`
      : "Số lượng: 0";
    const rawTotal = parseInt(data.totalPrice) || 0;
    popupSubtotal.textContent = formatCurrency(rawTotal);
    popupTotalAmount.textContent = formatCurrency(rawTotal);
  }

  // Xử lý click ra ngoài để đóng popup thanh toán và quay lại popup chọn ghế
  paymentPopup?.addEventListener("click", (e) => {
    if (e.target === paymentPopup) {
      closePopup(paymentPopup);
      openPopup(seatPopup);
    }
  });

  // Xử lý đóng popup thanh toán
  closePaymentBtn?.addEventListener("click", () => {
    closePopup(paymentPopup);
    openPopup(seatPopup);
  });

  // Cập nhật giá khi thay đổi combo hoặc số lượng
  popcornCombo?.addEventListener("change", updatePrice);
  popcornQuantity?.addEventListener("change", updatePrice);

  // Xử lý menu hamburger
  hamburger?.addEventListener("click", () => {
    menuItems.classList.toggle("active");
    hamburger.textContent = menuItems.classList.contains("active") ? "✕" : "☰";
  });

  // Xử lý áp dụng mã giảm giá
  popupApplyDiscountBtn?.addEventListener("click", () => {
    const discountCode = popupDiscountCode.value.trim().toUpperCase();
    let finalTotal = parseInt(bookingData.totalPrice) || 0;

    if (discountCode === "DISCOUNT10") {
      finalTotal = Math.round(finalTotal * 0.9); // Giảm 10%
      alert("Áp dụng mã giảm giá 10% thành công!");
    } else if (discountCode === "TINDEPTRAI" || discountCode === "SONDEPTRAI") {
      finalTotal = 0;
      alert("Áp dụng mã giảm giá 100% thành công!");
    } else {
      finalTotal = parseInt(bookingData.totalPrice) || 0;
      alert("Mã giảm giá không hợp lệ!");
    }

    popupTotalAmount.textContent = formatCurrency(finalTotal);
  });

  // Xử lý nút "Thanh Toán"
  popupConfirmPaymentBtn?.addEventListener("click", () => {
    const textValue = popupTotalAmount.textContent.trim();
    const cleanValue = textValue.replace("₫", "").replace(/\./g, "");
    const finalTotal = parseInt(cleanValue) || 0;
    alert(`Thanh toán thành công với tổng: ${formatCurrency(finalTotal)}!`);

    // Xóa dữ liệu đặt vé và reset
    localStorage.removeItem("bookingData");
    closeAllPopups();
  });
});
