document.addEventListener("DOMContentLoaded", () => {
  // Seat Selection Popup Elements
  const seatSelectionPopup = document.getElementById("seat-selection-popup");
  const closePopupBtn = document.getElementById("close-popup-btn");
  const seats = document.querySelectorAll(".seat:not(.disabled):not(.occupied)");
  const selectedSeatsCount = document.getElementById("selected-seats-count");
  const totalPriceSpan = document.getElementById("total-price");
  const confirmBookingBtn = document.getElementById("confirm-booking-btn");
  const movieTitleSpan = document.getElementById("popup-movie-title");

  // Ticket Price
  const seatPrice = 120000; // VND
  let selectedSeats = [];

  // Update Seat Selection UI
  function updateSelectedSeatsUI() {
    selectedSeatsCount.textContent = selectedSeats.length;
    const totalPrice = selectedSeats.length * seatPrice;
    totalPriceSpan.textContent = `${totalPrice.toLocaleString("vi-VN")} VND`;
  }

  // Handle Seat Click
  seats.forEach((seat) => {
    seat.addEventListener("click", function () {
      const seatId = this.dataset.seat;
      if (this.classList.contains("selected")) {
        this.classList.remove("selected");
        selectedSeats = selectedSeats.filter((id) => id !== seatId);
      } else {
        this.classList.add("selected");
        selectedSeats.push(seatId);
      }
      updateSelectedSeatsUI();
    });
  });

  // Handle Close Popup
  closePopupBtn.addEventListener("click", function () {
    seatSelectionPopup.classList.remove("active");
    resetPopupState();
  });

  // Handle Confirm Booking
  confirmBookingBtn.addEventListener("click", function () {
    if (selectedSeats.length === 0) {
      alert("Vui lòng chọn ít nhất một ghế để đặt vé.");
      return;
    }
    const confirmation = confirm(
      `Bạn có muốn xác nhận đặt ${selectedSeats.length} ghế (${selectedSeats.join(", ")}) với tổng số tiền ${totalPriceSpan.textContent} không?`
    );
    if (confirmation) {
      alert(
        `Đặt vé thành công cho các ghế: ${selectedSeats.join(", ")}!\nTổng tiền: ${totalPriceSpan.textContent}`
      );
      selectedSeats.forEach((seatId) => {
        const seatElement = document.querySelector(`.seat[data-seat="${seatId}"]`);
        if (seatElement) {
          seatElement.classList.add("occupied");
          seatElement.classList.remove("selected");
        }
      });
      seatSelectionPopup.classList.remove("active");
      resetPopupState();
    }
  });

  // Reset Popup State
  function resetPopupState() {
    document.querySelectorAll(".seat.selected").forEach((seat) => {
      seat.classList.remove("selected");
    });
    selectedSeats = [];
    updateSelectedSeatsUI();
  }

  // Open Seat Selection Popup
  window.openSeatSelectionPopup = function (movieTitle = "Mật Danh X") {
    movieTitleSpan.textContent = `Chọn Ghế cho Phim: ${movieTitle}`;
    seatSelectionPopup.classList.add("active");
  };

  // Handle "Buy Tickets" Button Clicks
  const ticketButtons = document.querySelectorAll(".btn-ticket");
  ticketButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const movieTitle = button.dataset.movie || "Unknown Movie";
      openSeatSelectionPopup(movieTitle);
    });
  });

  // Handle "Buy Popcorn" Button Click
  const popcornButton = document.querySelector(".btn-popcorn");
  popcornButton.addEventListener("click", () => {
    alert("Đã mua bắp nước");
  });

  // Handle "See more" Button Click
  const seeMoreButton = document.querySelector(".btn-see-more");
  seeMoreButton.addEventListener("click", () => {
    alert("Loading more movies...");
  });

  // Initialize Seat Selection UI
  updateSelectedSeatsUI();
});