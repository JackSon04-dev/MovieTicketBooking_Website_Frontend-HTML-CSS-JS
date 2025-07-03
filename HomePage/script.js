// ==================== BIẾN TOÀN CỤC ====================
// Danh sách phim để tìm kiếm
const moviesList = [
  "Quỷ Nhập Tràng",
  "Red Man",
  "Mickey 17",
  "THE MONKEY",
  "Nghề Siêu Khó",
  "Điều Ước Cuối Cùng",
  "Nghi Lễ Trục Quỷ",
  "Trừ Tà Ký",
]

// Biến lưu trữ ngày đã chọn
let selectedDate = null

// Biến lưu trữ vị trí slider hiện tại
let currentSlideIndex = 0
let comingSoonSlideIndex = 0

// Biến lưu trữ trạng thái đang chuyển slide
let isSliding = false

// ==================== HÀM TIỆN ÍCH ====================
// Hàm định dạng tiền tệ Việt Nam
function formatCurrency(amount) {
  return Number.parseInt(amount || 0).toLocaleString("vi-VN") + "₫"
}

// Hàm tạo thông báo tùy chỉnh
function showCustomAlert(message, type = "info") {
  // Xóa thông báo cũ nếu có
  const oldAlerts = document.querySelectorAll(".custom-alert")
  oldAlerts.forEach((alert) => {
    document.body.removeChild(alert)
  })

  // Tạo element thông báo
  const alertDiv = document.createElement("div")
  alertDiv.className = `custom-alert ${type}`
  alertDiv.textContent = message

  // Thêm vào body
  document.body.appendChild(alertDiv)

  // Hiển thị với hiệu ứng
  setTimeout(() => alertDiv.classList.add("show"), 10)

  // Tự động ẩn sau 3 giây
  setTimeout(() => {
    alertDiv.classList.remove("show")
    setTimeout(() => {
      if (document.body.contains(alertDiv)) {
        document.body.removeChild(alertDiv)
      }
    }, 300)
  }, 3000)
}

// ==================== CHỨC NĂNG DARK MODE ====================
function initThemeToggle() {
  const themeToggle = document.getElementById("theme-toggle")
  const body = document.body

  // Kiểm tra theme đã lưu trong localStorage
  const savedTheme = localStorage.getItem("theme")
  if (savedTheme === "dark") {
    body.classList.add("dark-mode")
    themeToggle.textContent = "☀️"
  }

  // Xử lý sự kiện click nút chuyển đổi theme
  themeToggle.addEventListener("click", () => {
    body.classList.toggle("dark-mode")

    // Cập nhật icon và lưu vào localStorage
    if (body.classList.contains("dark-mode")) {
      themeToggle.textContent = "☀️"
      localStorage.setItem("theme", "dark")
    } else {
      themeToggle.textContent = "🌙"
      localStorage.setItem("theme", "light")
    }
  })
}

// ==================== CHỨC NĂNG TÌM KIẾM ====================
function initSearchFunction() {
  const searchInput = document.getElementById("search-input")
  const searchSuggestions = document.getElementById("search-suggestions")

  // Xử lý sự kiện nhập liệu
  searchInput.addEventListener("input", (e) => {
    const query = e.target.value.toLowerCase().trim()

    if (query === "") {
      searchSuggestions.style.display = "none"
      return
    }

    // Lọc phim phù hợp
    const filteredMovies = moviesList.filter((movie) => movie.toLowerCase().includes(query))

    // Sắp xếp theo độ khớp (phim có tên bắt đầu bằng từ khóa sẽ lên đầu)
    filteredMovies.sort((a, b) => {
      const aStartsWith = a.toLowerCase().startsWith(query)
      const bStartsWith = b.toLowerCase().startsWith(query)

      if (aStartsWith && !bStartsWith) return -1
      if (!aStartsWith && bStartsWith) return 1
      return 0
    })

    // Hiển thị gợi ý
    displaySearchSuggestions(filteredMovies, query)
  })

  // Ẩn gợi ý khi click ra ngoài
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".search-container")) {
      searchSuggestions.style.display = "none"
    }
  })
}

// Hiển thị danh sách gợi ý tìm kiếm
function displaySearchSuggestions(movies, query) {
  const searchSuggestions = document.getElementById("search-suggestions")

  if (movies.length === 0) {
    searchSuggestions.innerHTML = '<div class="suggestion-item">Không tìm thấy phim nào</div>'
  } else {
    searchSuggestions.innerHTML = movies
      .map(
        (movie) =>
          `<div class="suggestion-item" onclick="selectMovie('${movie}')">${highlightMatch(movie, query)}</div>`,
      )
      .join("")
  }

  searchSuggestions.style.display = "block"
}

// Làm nổi bật từ khóa trong kết quả tìm kiếm
function highlightMatch(text, query) {
  const regex = new RegExp(`(${query})`, "gi")
  return text.replace(regex, "<strong>$1</strong>")
}

// Chọn phim từ gợi ý
function selectMovie(movieName) {
  const searchInput = document.getElementById("search-input")
  const searchSuggestions = document.getElementById("search-suggestions")

  searchInput.value = movieName
  searchSuggestions.style.display = "none"

  // Cuộn đến phim được chọn
  scrollToMovie(movieName)
}

// Cuộn đến vị trí phim
function scrollToMovie(movieName) {
  const movieCards = document.querySelectorAll(".movie-card")

  movieCards.forEach((card) => {
    if (card.dataset.movie === movieName) {
      card.scrollIntoView({ behavior: "smooth", block: "center" })

      // Thêm hiệu ứng highlight
      card.classList.add("highlight")
      setTimeout(() => card.classList.remove("highlight"), 2000)
    }
  })
}

// ==================== CHỨC NĂNG SLIDER ====================
function initSliders() {
  // Lấy các phần tử slider
  const nowShowingSlider = document.getElementById("movieSlider")
  const comingSoonSlider = document.getElementById("comingSoonSlider")

  // Lấy số lượng phim trong mỗi slider
  const nowShowingCount = nowShowingSlider.querySelectorAll(".movie-card").length
  const comingSoonCount = comingSoonSlider.querySelectorAll(".movie-card").length

  // Khởi tạo dots cho slider
  initSliderDots("slider-dots", nowShowingCount)
  initSliderDots("coming-soon-dots", comingSoonCount)

  // Cập nhật dots ban đầu
  updateSliderDots("slider-dots", 0)
  updateSliderDots("coming-soon-dots", 0)

  // Gắn sự kiện cho các nút điều hướng
  document.getElementById("now-showing-prev").addEventListener("click", () => {
    navigateSlider("movieSlider", "slider-dots", -1, nowShowingCount)
  })

  document.getElementById("now-showing-next").addEventListener("click", () => {
    navigateSlider("movieSlider", "slider-dots", 1, nowShowingCount)
  })

  document.getElementById("coming-soon-prev").addEventListener("click", () => {
    navigateSlider("comingSoonSlider", "coming-soon-dots", -1, comingSoonCount)
  })

  document.getElementById("coming-soon-next").addEventListener("click", () => {
    navigateSlider("comingSoonSlider", "coming-soon-dots", 1, comingSoonCount)
  })
}

// Khởi tạo dots cho slider
function initSliderDots(containerId, count) {
  const container = document.getElementById(containerId)
  container.innerHTML = ""

  for (let i = 0; i < count; i++) {
    const dot = document.createElement("span")
    dot.className = "dot"
    dot.dataset.index = i

    // Thêm sự kiện click cho dot
    dot.addEventListener("click", () => {
      const sliderId = containerId === "slider-dots" ? "movieSlider" : "comingSoonSlider"
      const currentIndex = containerId === "slider-dots" ? currentSlideIndex : comingSoonSlideIndex

      // Chỉ xử lý khi click vào dot khác với vị trí hiện tại
      if (i !== currentIndex) {
        goToSlide(sliderId, containerId, i)
      }
    })

    container.appendChild(dot)
  }
}

// Cập nhật trạng thái dots
function updateSliderDots(containerId, activeIndex) {
  const dots = document.querySelectorAll(`#${containerId} .dot`)

  dots.forEach((dot, index) => {
    dot.classList.toggle("active", index === activeIndex)
  })

  // Cập nhật biến toàn cục
  if (containerId === "slider-dots") {
    currentSlideIndex = activeIndex
  } else {
    comingSoonSlideIndex = activeIndex
  }
}

// Di chuyển slider theo hướng
function navigateSlider(sliderId, dotsId, direction, totalSlides) {
  // Nếu đang trong quá trình chuyển slide, không xử lý
  if (isSliding) return

  // Đánh dấu đang chuyển slide
  isSliding = true

  const slider = document.getElementById(sliderId)
  const currentIndex = sliderId === "movieSlider" ? currentSlideIndex : comingSoonSlideIndex

  // Tính toán index mới
  let newIndex = currentIndex + direction

  // Xử lý trường hợp vượt quá giới hạn
  if (newIndex < 0) newIndex = totalSlides - 1
  if (newIndex >= totalSlides) newIndex = 0

  // Chuyển đến slide mới
  goToSlide(sliderId, dotsId, newIndex)

  // Sau 500ms (thời gian transition) thì reset trạng thái
  setTimeout(() => {
    isSliding = false
  }, 500)
}

// Chuyển đến slide cụ thể
function goToSlide(sliderId, dotsId, index) {
  const slider = document.getElementById(sliderId)
  const cardWidth = slider.querySelector(".movie-card").offsetWidth
  const margin = Number.parseInt(window.getComputedStyle(slider.querySelector(".movie-card")).marginRight)

  // Tính toán vị trí cần scroll đến
  const scrollPosition = index * (cardWidth + margin)

  // Scroll đến vị trí mới với hiệu ứng
  slider.scrollTo({
    left: scrollPosition,
    behavior: "smooth",
  })

  // Cập nhật dots
  updateSliderDots(dotsId, index)
}

// ==================== CHỨC NĂNG CHỌN NGÀY ====================
function initDateSelection() {
  const dateGrid = document.getElementById("date-grid")
  const selectedDateText = document.getElementById("selected-date-text")

  // Xóa nội dung cũ nếu có
  dateGrid.innerHTML = ""

  // Tạo 7 ngày tiếp theo
  const today = new Date()
  for (let i = 0; i < 7; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() + i)

    const dateItem = document.createElement("div")
    dateItem.className = "date-item"
    dateItem.dataset.date = date.toISOString().split("T")[0]

    const dayName = date.toLocaleDateString("vi-VN", { weekday: "short" })
    const dayNumber = date.getDate()
    const monthName = date.toLocaleDateString("vi-VN", { month: "short" })

    dateItem.innerHTML = `
      <div class="day-name">${dayName}</div>
      <div class="day-number">${dayNumber}</div>
      <div class="month-name">${monthName}</div>
    `

    // Xử lý sự kiện click chọn ngày
    dateItem.addEventListener("click", () => {
      // Bỏ chọn ngày cũ
      document.querySelectorAll(".date-item").forEach((item) => item.classList.remove("selected"))

      // Chọn ngày mới
      dateItem.classList.add("selected")
      selectedDate = dateItem.dataset.date

      // Cập nhật hiển thị
      const formattedDate = new Date(selectedDate).toLocaleDateString("vi-VN")
      selectedDateText.textContent = formattedDate
    })

    dateGrid.appendChild(dateItem)
  }
}

// ==================== CHỨC NĂNG ĐẶT VÉ ====================
// Khi trang đã tải xong
document.addEventListener("DOMContentLoaded", () => {
  // Khởi tạo các chức năng
  initThemeToggle()
  initSearchFunction()
  initSliders()
  initDateSelection()

  // Khai báo các phần tử popup và nút
  const seatPopup = document.getElementById("seat-selection-popup")
  const closeSeatBtn = document.getElementById("close-popup-btn")
  const paymentPopup = document.getElementById("payment-popup")
  const closePaymentBtn = document.getElementById("close-payment-btn")
  const ticketButtons = document.querySelectorAll(".btn-ticket")
  const seats = document.querySelectorAll(".seat:not(.occupied)")
  const selectedSeatsCount = document.getElementById("selected-seats-count")
  const totalPriceElement = document.getElementById("total-price")
  const cinemaSelect = document.getElementById("cinema-select")
  const showtimeSelect = document.getElementById("showtime-select")
  const confirmBookingBtn = document.getElementById("confirm-booking-btn")
  const hamburger = document.querySelector(".hamburger")
  const menuItems = document.querySelector(".menu-items")
  const popcornCombo = document.getElementById("popcorn-combo")
  const popcornQuantity = document.getElementById("popcorn-quantity")
  const popupMovieTitleSeat = document.getElementById("popup-movie-title-seat")
  const popupMovieTitlePayment = document.getElementById("popup-movie-title-payment")
  const popupCinemaName = document.getElementById("popup-cinema-name")
  const popupHallName = document.getElementById("popup-hall-name")
  const popupShowDate = document.getElementById("popup-show-date")
  const popupShowTime = document.getElementById("popup-show-time")
  const popupSelectedSeats = document.getElementById("popup-selected-seats")
  const popupComboName = document.getElementById("popup-combo-name")
  const popupComboQuantity = document.getElementById("popup-combo-quantity")
  const popupSubtotal = document.getElementById("popup-subtotal")
  const popupTotalAmount = document.getElementById("popup-total-amount")
  const popupDiscountCode = document.getElementById("popup-discount-code")
  const popupApplyDiscountBtn = document.getElementById("popup-apply-discount-btn")
  const popupConfirmPaymentBtn = document.getElementById("popup-confirm-payment-btn")

  // Kiểm tra các phần tử quan trọng
  if (!paymentPopup || !confirmBookingBtn) {
    console.error("Error: paymentPopup or confirmBookingBtn not found in the document.")
    return
  }

  // Khởi tạo mảng ghế đã chọn và giá vé
  let selectedSeats = []
  const ticketPrice = 75000
  let bookingData = {}

  // Cập nhật giá khi thay đổi combo hoặc số lượng
  function updatePrice() {
    const count = selectedSeats.length
    selectedSeatsCount.textContent = count
    const combo = popcornCombo?.value || "none"
    const quantity = Number.parseInt(popcornQuantity?.value) || 0
    let popcornPrice = 0
    if (combo !== "none" && popcornCombo) {
      popcornPrice =
        Number.parseInt(popcornCombo.querySelector(`option[value="${combo}"]`)?.dataset.price) * quantity || 0
    }
    const totalPrice = count * ticketPrice + popcornPrice
    totalPriceElement.textContent = `${formatCurrency(totalPrice)}`
  }

  // Mở popup
  function openPopup(popup) {
    if (popup) {
      popup.classList.add("active")
      console.log("Opening popup:", popup.id)
    } else {
      console.error("Error: Popup element is null")
    }
  }

  // Đóng popup
  function closePopup(popup) {
    if (popup && popup.classList.contains("active")) {
      popup.classList.remove("active")
      console.log("Closing popup:", popup.id)
    }
  }

  // Mở popup chọn ghế
  function openSeatPopup(movieTitle) {
    if (seatPopup) {
      popupMovieTitleSeat.textContent = `Chọn ghế cho phim: ${movieTitle || "Unknown Movie"}`

      // Reset trạng thái
      selectedDate = null
      document.getElementById("selected-date-text").textContent = "Chưa chọn"
      document.querySelectorAll(".date-item").forEach((item) => item.classList.remove("selected"))

      openPopup(seatPopup)
    } else {
      console.error("Error: seatPopup not found")
    }
  }

  // Đóng tất cả popup và reset
  function closeAllPopups() {
    closePopup(seatPopup)
    closePopup(paymentPopup)
    selectedSeats = []
    selectedDate = null
    seats.forEach((seat) => seat.classList.remove("selected"))
    updatePrice()
  }

  // Xử lý nút "Buy Tickets"
  ticketButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      if (button.closest(".coming-soon")) {
        e.preventDefault()
        showCustomAlert("Phim này sắp chiếu, chưa thể mua vé. Vui lòng quay lại sau!", "warning")
        return
      }
      if (button.closest(".button-group-header")) {
        showCustomAlert("Có thể mua vé ở phần Phim Đang Chiếu!", "info")
        return
      }
      openSeatPopup(button.dataset.movie)
    })
  })

  // Xử lý đóng popup chọn ghế
  closeSeatBtn.addEventListener("click", closeAllPopups)

  // Xử lý chọn ghế
  seats.forEach((seat) => {
    seat.addEventListener("click", () => {
      if (!seat.classList.contains("occupied")) {
        seat.classList.toggle("selected")
        const seatId = seat.dataset.seat
        if (selectedSeats.includes(seatId)) {
          selectedSeats = selectedSeats.filter((id) => id !== seatId)
        } else {
          selectedSeats.push(seatId)
        }
        updatePrice()
      }
    })
  })

  // Xử lý "Xác nhận đặt vé"
  confirmBookingBtn.addEventListener("click", () => {
    // Kiểm tra đã chọn ngày chưa
    if (!selectedDate) {
      showCustomAlert("Vui lòng chọn ngày chiếu!", "error")
      return
    }

    // Kiểm tra đã chọn ghế chưa
    if (selectedSeats.length === 0) {
      showCustomAlert("Vui lòng chọn ít nhất một ghế!", "error")
      return
    }

    const currentDate = new Date()
    const timeRange = `${currentDate.getHours()}:40 - ${currentDate.getHours() + 1}:40`
    const combo = popcornCombo?.value || "none"
    const quantity = Number.parseInt(popcornQuantity?.value) || 0
    let popcornPrice = 0
    let comboName = "Không chọn"

    if (combo !== "none" && popcornCombo) {
      popcornPrice =
        Number.parseInt(popcornCombo.querySelector(`option[value="${combo}"]`)?.dataset.price) * quantity || 0
      comboName = popcornCombo.querySelector(`option[value="${combo}"]`)?.text || "Không chọn"
    }

    bookingData = {
      movie: popupMovieTitleSeat.textContent.replace("Chọn ghế cho phim: ", ""),
      cinema: cinemaSelect?.options[cinemaSelect.selectedIndex]?.text || "Unknown Cinema",
      showtime: showtimeSelect?.value || "Unknown Time",
      seats: selectedSeats,
      ticketPrice: selectedSeats.length * ticketPrice,
      time: timeRange,
      date: new Date(selectedDate).toLocaleDateString("vi-VN"),
      popcornCombo: comboName,
      popcornQuantity: quantity,
      popcornPrice: popcornPrice,
      totalPrice: selectedSeats.length * ticketPrice + popcornPrice,
    }

    localStorage.setItem("bookingData", JSON.stringify(bookingData))

    // Mở popup thanh toán và cập nhật thông tin
    closePopup(seatPopup)
    updatePaymentPopup()
    openPopup(paymentPopup)
  })

  // Cập nhật thông tin trong popup thanh toán
  function updatePaymentPopup() {
    const data = JSON.parse(localStorage.getItem("bookingData")) || {}
    popupMovieTitlePayment.textContent = data.movie || "Unknown Movie"
    popupCinemaName.textContent = data.cinema || "Unknown Cinema"
    popupHallName.textContent = "Cinema 3 - 2D" // Giả định cố định
    popupShowDate.textContent = data.date || "Unknown Date"
    popupShowTime.textContent = data.time || "Unknown Time"
    popupSelectedSeats.textContent = data.seats?.join(", ") || "No seats"
    popupComboName.textContent = data.popcornCombo || "Không chọn"
    popupComboQuantity.textContent = data.popcornQuantity ? `Số lượng: ${data.popcornQuantity}` : "Số lượng: 0"
    const rawTotal = Number.parseInt(data.totalPrice) || 0
    popupSubtotal.textContent = formatCurrency(rawTotal)
    popupTotalAmount.textContent = formatCurrency(rawTotal)
  }

  // Xử lý click ra ngoài để đóng popup thanh toán và quay lại popup chọn ghế
  paymentPopup?.addEventListener("click", (e) => {
    if (e.target === paymentPopup) {
      closePopup(paymentPopup)
      openPopup(seatPopup)
    }
  })

  // Xử lý đóng popup thanh toán
  closePaymentBtn?.addEventListener("click", () => {
    closePopup(paymentPopup)
    openPopup(seatPopup)
  })

  // Cập nhật giá khi thay đổi combo hoặc số lượng
  popcornCombo?.addEventListener("change", updatePrice)
  popcornQuantity?.addEventListener("change", updatePrice)

  // Xử lý menu hamburger
  hamburger?.addEventListener("click", () => {
    menuItems.classList.toggle("active")
    hamburger.textContent = menuItems.classList.contains("active") ? "✕" : "☰"
  })

  // Xử lý áp dụng mã giảm giá
  popupApplyDiscountBtn?.addEventListener("click", () => {
    const discountCode = popupDiscountCode.value.trim().toUpperCase()
    let finalTotal = Number.parseInt(bookingData.totalPrice) || 0

    if (discountCode === "DISCOUNT10") {
      finalTotal = Math.round(finalTotal * 0.9) // Giảm 10%
      showCustomAlert("Áp dụng mã giảm giá 10% thành công!", "success")
    } else if (discountCode === "TINDEPTRAI" || discountCode === "SONDEPTRAI") {
      finalTotal = 0
      showCustomAlert("Áp dụng mã giảm giá 100% thành công!", "success")
    } else {
      finalTotal = Number.parseInt(bookingData.totalPrice) || 0
      showCustomAlert("Mã giảm giá không hợp lệ!", "error")
    }

    popupTotalAmount.textContent = formatCurrency(finalTotal)
  })

  // Xử lý nút "Thanh Toán"
  popupConfirmPaymentBtn?.addEventListener("click", () => {
    const textValue = popupTotalAmount.textContent.trim()
    const cleanValue = textValue.replace("₫", "").replace(/\./g, "")
    const finalTotal = Number.parseInt(cleanValue) || 0
    showCustomAlert(`Thanh toán thành công với tổng: ${formatCurrency(finalTotal)}!`, "success")

    // Xóa dữ liệu đặt vé và reset
    localStorage.removeItem("bookingData")
    closeAllPopups()
  })
})
