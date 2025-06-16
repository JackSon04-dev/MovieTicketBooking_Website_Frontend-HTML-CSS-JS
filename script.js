document.addEventListener("DOMContentLoaded", () => {
  // Hamburger Menu
  const hamburger = document.querySelector(".hamburger");
  const menuItems = document.querySelector(".menu-items");
  if (hamburger && menuItems) {
    hamburger.addEventListener("click", () => {
      menuItems.classList.toggle("active");
      hamburger.textContent = menuItems.classList.contains("active") ? "✕" : "☰";
    });
  }

  // Popup Elements
  const seatSelectionPopup = document.getElementById("seat-selection-popup");
  const closePopupBtn = document.getElementById("close-popup-btn");
  const movieTitleSpan = document.getElementById("popup-movie-title");
  const selectedSeatsCount = document.getElementById("selected-seats-count");
  const totalPriceSpan = document.getElementById("total-price");
  const confirmBookingBtn = document.getElementById("confirm-booking-btn");
  const cinemaSelect = document.getElementById("cinema-select");
  const showtimeSelect = document.getElementById("showtime-select");
  const seats = document.querySelectorAll(".seat:not(.occupied)");

  // Debug log
  console.log("Popup element:", seatSelectionPopup);
  console.log("Ticket buttons:", document.querySelectorAll(".btn-ticket").length);

  // Ticket Price
  const seatPrice = 120000; // VND
  let selectedSeats = [];

  // Update UI
  function updateUI() {
    selectedSeatsCount.textContent = selectedSeats.length;
    const totalPrice = selectedSeats.length * seatPrice;
    totalPriceSpan.textContent = totalPrice.toLocaleString("vi-VN") + " VND";
  }

  // Open Popup
  function openPopup(movieTitle) {
    console.log("Opening popup for:", movieTitle);
    movieTitleSpan.textContent = "Chọn ghế cho phim: " + movieTitle;
    seatSelectionPopup.classList.add("active");
    updateUI();
  }

  // Close Popup
  function closePopup() {
    seatSelectionPopup.classList.remove("active");
    selectedSeats.forEach((seatId) => {
      const seat = document.querySelector(`.seat[data-seat="${seatId}"]`);
      seat.classList.remove("selected");
    });
    selectedSeats = [];
    updateUI();
  }

  // Handle Seat Selection
  seats.forEach((seat) => {
    seat.addEventListener("click", () => {
      const seatId = seat.dataset.seat;
      if (seat.classList.contains("selected")) {
        seat.classList.remove("selected");
        selectedSeats = selectedSeats.filter((id) => id !== seatId);
      } else if (!seat.classList.contains("occupied")) {
        seat.classList.add("selected");
        selectedSeats.push(seatId);
      }
      updateUI();
    });
  });

  // Handle Close Button
  closePopupBtn.addEventListener("click", closePopup);

  // Handle Confirm Booking
  confirmBookingBtn.addEventListener("click", () => {
    if (selectedSeats.length === 0) {
      alert("Vui lòng chọn ít nhất một ghế.");
      return;
    }
    const cinema = cinemaSelect.options[cinemaSelect.selectedIndex].text;
    const showtime = showtimeSelect.value;
    const totalPrice = selectedSeats.length * seatPrice;
    const confirmation = confirm(
      `Xác nhận đặt vé:\nPhim: ${movieTitleSpan.textContent.replace("Chọn ghế cho phim: ", "")}\nRạp: ${cinema}\nXuất chiếu: ${showtime}\nGhế: ${selectedSeats.join(", ")}\nTổng: ${totalPrice.toLocaleString("vi-VN")} VND`
    );
    if (confirmation) {
      selectedSeats.forEach((seatId) => {
        const seat = document.querySelector(`.seat[data-seat="${seatId}"]`);
        seat.classList.add("occupied");
        seat.classList.remove("selected");
      });
      alert("Đặt vé thành công!");
      closePopup();
    }
  });

  // Handle "Buy Tickets" Button Clicks
  const ticketButtons = document.querySelectorAll(".btn-ticket");
  ticketButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const movieTitle = button.dataset.movie || "Unknown Movie";
      openPopup(movieTitle);
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

  // Handle "All incentives" Button Click
  const incentivesButton = document.querySelector(".btn-all-incentives");
  incentivesButton.addEventListener("click", () => {
    alert("Redirecting to all promotions page...");
  });
});