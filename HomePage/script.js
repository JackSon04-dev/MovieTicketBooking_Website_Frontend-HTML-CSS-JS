// ==================== BIẾN TOÀN CỤC ====================
const moviesList = [
  "Quỷ Nhập Tràng", "Red Man", "Mickey 17", "THE MONKEY",
  "Nghề Siêu Khó", "Điều Ước Cuối Cùng", "Nghi Lễ Trục Quỷ", "Trừ Tà Ký"
]

let selectedDate = null
let selectedSeats = []
let bookingData = {}
const ticketPrice = 75000

// ==================== HÀM TIỆN ÍCH ====================
function formatCurrency(amount) {
  return parseInt(amount || 0).toLocaleString("vi-VN") + "₫"
}

function showAlert(message, type = "info") {
  const alert = document.createElement("div")
  alert.className = `custom-alert ${type} show`
  alert.textContent = message
  document.body.appendChild(alert)
  
  setTimeout(() => {
    alert.classList.remove("show")
    setTimeout(() => document.body.removeChild(alert), 300)
  }, 3000)
}

// ==================== CHUYỂN ĐỔI THEME ====================
function initTheme() {
  const toggle = document.getElementById("theme-toggle")
  const body = document.body

  if (localStorage.getItem("theme") === "dark") {
    body.classList.add("dark-mode")
    toggle.textContent = "☀️"
  }

  toggle.addEventListener("click", () => {
    body.classList.toggle("dark-mode")
    const isDark = body.classList.contains("dark-mode")
    toggle.textContent = isDark ? "☀️" : "🌙"
    localStorage.setItem("theme", isDark ? "dark" : "light")
  })
}

// ==================== CHỨC NĂNG TÌM KIẾM ====================
function initSearch() {
  const input = document.getElementById("search-input")
  const suggestions = document.getElementById("search-suggestions")

  input.addEventListener("input", (e) => {
    const query = e.target.value.toLowerCase().trim()
    
    if (!query) {
      suggestions.style.display = "none"
      return
    }

    // Lọc phim theo từ khóa tìm kiếm
    const filtered = moviesList.filter(movie => 
      movie.toLowerCase().includes(query)
    ).sort((a, b) => {
      const aStarts = a.toLowerCase().startsWith(query)
      const bStarts = b.toLowerCase().startsWith(query)
      return aStarts && !bStarts ? -1 : !aStarts && bStarts ? 1 : 0
    })

    // Hiển thị kết quả tìm kiếm
    suggestions.innerHTML = filtered.length ? 
      filtered.map(movie => 
        `<div class="suggestion-item" onclick="selectMovie('${movie}')">
          ${movie.replace(new RegExp(`(${query})`, 'gi'), '<strong>$1</strong>')}
        </div>`
      ).join('') : 
      '<div class="suggestion-item">Không tìm thấy phim nào</div>'
    
    suggestions.style.display = "block"
  })

  // Ẩn gợi ý khi click ra ngoài
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".search-container")) {
      suggestions.style.display = "none"
    }
  })
}

function selectMovie(movieName) {
  document.getElementById("search-input").value = movieName
  document.getElementById("search-suggestions").style.display = "none"
  
  // Cuộn đến phim được chọn và làm nổi bật
  const card = document.querySelector(`[data-movie="${movieName}"]`)
  if (card) {
    card.scrollIntoView({ behavior: "smooth", block: "center" })
    card.classList.add("highlight")
    setTimeout(() => card.classList.remove("highlight"), 2000)
  }
}

// ==================== CHỨC NĂNG SLIDER ====================
let currentSlide = 0
let comingSoonSlide = 0

function initSliders() {
  const nowShowing = document.getElementById("movieSlider")
  const comingSoon = document.getElementById("comingSoonSlider")
  
  // Tạo dots cho slider
  createDots("slider-dots", nowShowing.children.length)
  createDots("coming-soon-dots", comingSoon.children.length)
  
  // Gắn sự kiện cho các nút điều hướng
  document.getElementById("now-showing-prev").onclick = () => 
    navigate("movieSlider", "slider-dots", -1, nowShowing.children.length)
  document.getElementById("now-showing-next").onclick = () => 
    navigate("movieSlider", "slider-dots", 1, nowShowing.children.length)
  document.getElementById("coming-soon-prev").onclick = () => 
    navigate("comingSoonSlider", "coming-soon-dots", -1, comingSoon.children.length)
  document.getElementById("coming-soon-next").onclick = () => 
    navigate("comingSoonSlider", "coming-soon-dots", 1, comingSoon.children.length)
}

function createDots(containerId, count) {
  const container = document.getElementById(containerId)
  container.innerHTML = ""
  
  // Tạo dots cho từng slide
  for (let i = 0; i < count; i++) {
    const dot = document.createElement("span")
    dot.className = "dot"
    dot.onclick = () => goToSlide(
      containerId === "slider-dots" ? "movieSlider" : "comingSoonSlider", 
      containerId, i
    )
    container.appendChild(dot)
  }
}

function navigate(sliderId, dotsId, direction, total) {
  const current = sliderId === "movieSlider" ? currentSlide : comingSoonSlide
  let newIndex = current + direction
  
  // Xử lý vòng lặp slider
  if (newIndex < 0) newIndex = total - 1
  if (newIndex >= total) newIndex = 0
  
  goToSlide(sliderId, dotsId, newIndex)
}

function goToSlide(sliderId, dotsId, index) {
  const slider = document.getElementById(sliderId)
  const cardWidth = slider.querySelector(".movie-card").offsetWidth
  const margin = parseInt(getComputedStyle(slider.querySelector(".movie-card")).marginRight)
  
  // Cuộn đến vị trí slide mới
  slider.scrollTo({
    left: index * (cardWidth + margin),
    behavior: "smooth"
  })
  
  // Cập nhật trạng thái dots
  document.querySelectorAll(`#${dotsId} .dot`).forEach((dot, i) => {
    dot.classList.toggle("active", i === index)
  })
  
  // Cập nhật chỉ số slide hiện tại
  if (sliderId === "movieSlider") currentSlide = index
  else comingSoonSlide = index
}

// ==================== CHỌN NGÀY CHIẾU ====================
function initDates() {
  const grid = document.getElementById("date-grid")
  const text = document.getElementById("selected-date-text")
  
  grid.innerHTML = ""
  
  // Tạo 7 ngày tiếp theo
  for (let i = 0; i < 7; i++) {
    const date = new Date()
    date.setDate(date.getDate() + i)
    
    const item = document.createElement("div")
    item.className = "date-item"
    item.dataset.date = date.toISOString().split("T")[0]
    item.innerHTML = `
      <div class="day-name">${date.toLocaleDateString("vi-VN", { weekday: "short" })}</div>
      <div class="day-number">${date.getDate()}</div>
      <div class="month-name">${date.toLocaleDateString("vi-VN", { month: "short" })}</div>
    `
    
    // Xử lý sự kiện chọn ngày
    item.onclick = () => {
      document.querySelectorAll(".date-item").forEach(d => d.classList.remove("selected"))
      item.classList.add("selected")
      selectedDate = item.dataset.date
      text.textContent = new Date(selectedDate).toLocaleDateString("vi-VN")
    }
    
    grid.appendChild(item)
  }
}

// ==================== CHỨC NĂNG ĐẶT VÉ ====================
function updatePrice() {
  const count = selectedSeats.length
  document.getElementById("selected-seats-count").textContent = count
  
  // Tính giá combo bắp nước
  const combo = document.getElementById("popcorn-combo")?.value || "none"
  const quantity = parseInt(document.getElementById("popcorn-quantity")?.value) || 0
  let popcornPrice = 0
  
  if (combo !== "none") {
    const option = document.querySelector(`#popcorn-combo option[value="${combo}"]`)
    popcornPrice = parseInt(option?.dataset.price || 0) * quantity
  }
  
  // Cập nhật tổng giá
  const total = count * ticketPrice + popcornPrice
  document.getElementById("total-price").textContent = formatCurrency(total)
}

function openPopup(popup) {
  popup?.classList.add("active")
}

function closePopup(popup) {
  popup?.classList.remove("active")
}

function closeAllPopups() {
  closePopup(document.getElementById("seat-selection-popup"))
  closePopup(document.getElementById("payment-popup"))
  selectedSeats = []
  selectedDate = null
  // Reset trạng thái ghế và ngày
  document.querySelectorAll(".seat").forEach(seat => seat.classList.remove("selected"))
  document.querySelectorAll(".date-item").forEach(item => item.classList.remove("selected"))
  document.getElementById("selected-date-text").textContent = "Chưa chọn"
  updatePrice()
}

// ==================== KHỞI TẠO CHÍNH ====================
document.addEventListener("DOMContentLoaded", () => {
  // Khởi tạo các chức năng
  initTheme()
  initSearch()
  initSliders()
  initDates()

  // Xử lý nút mua vé
  document.querySelectorAll(".btn-ticket").forEach(btn => {
    btn.addEventListener("click", (e) => {
      if (btn.closest(".coming-soon")) {
        e.preventDefault()
        showAlert("Phim này sắp chiếu, chưa thể mua vé!", "warning")
        return
      }
      if (btn.closest(".button-group-header")) {
        showAlert("Có thể mua vé ở phần Phim Đang Chiếu!", "info")
        return
      }
      
      // Mở popup chọn ghế
      document.getElementById("popup-movie-title-seat").textContent = 
        `Chọn ghế cho phim: ${btn.dataset.movie || "Unknown Movie"}`
      openPopup(document.getElementById("seat-selection-popup"))
    })
  })

  // Xử lý chọn ghế
  document.querySelectorAll(".seat:not(.occupied)").forEach(seat => {
    seat.addEventListener("click", () => {
      seat.classList.toggle("selected")
      const seatId = seat.dataset.seat
      
      // Cập nhật danh sách ghế đã chọn
      if (selectedSeats.includes(seatId)) {
        selectedSeats = selectedSeats.filter(id => id !== seatId)
      } else {
        selectedSeats.push(seatId)
      }
      updatePrice()
    })
  })

  // Xử lý nút đóng popup
  document.getElementById("close-popup-btn").onclick = closeAllPopups
  document.getElementById("close-payment-btn").onclick = () => {
    closePopup(document.getElementById("payment-popup"))
    openPopup(document.getElementById("seat-selection-popup"))
  }

  // Xác nhận đặt vé
  document.getElementById("confirm-booking-btn").onclick = () => {
    // Kiểm tra điều kiện đặt vé
    if (!selectedDate) {
      showAlert("Vui lòng chọn ngày chiếu!", "error")
      return
    }
    if (selectedSeats.length === 0) {
      showAlert("Vui lòng chọn ít nhất một ghế!", "error")
      return
    }

    // Tính toán thông tin combo
    const combo = document.getElementById("popcorn-combo")?.value || "none"
    const quantity = parseInt(document.getElementById("popcorn-quantity")?.value) || 0
    let popcornPrice = 0
    let comboName = "Không chọn"

    if (combo !== "none") {
      const option = document.querySelector(`#popcorn-combo option[value="${combo}"]`)
      popcornPrice = parseInt(option?.dataset.price || 0) * quantity
      comboName = option?.text || "Không chọn"
    }

    // Lưu thông tin đặt vé
    bookingData = {
      movie: document.getElementById("popup-movie-title-seat").textContent.replace("Chọn ghế cho phim: ", ""),
      cinema: document.getElementById("cinema-select")?.options[document.getElementById("cinema-select").selectedIndex]?.text || "Unknown Cinema",
      showtime: document.getElementById("showtime-select")?.value || "Unknown Time",
      seats: selectedSeats,
      date: new Date(selectedDate).toLocaleDateString("vi-VN"),
      popcornCombo: comboName,
      popcornQuantity: quantity,
      totalPrice: selectedSeats.length * ticketPrice + popcornPrice
    }

    // Cập nhật thông tin popup thanh toán
    document.getElementById("popup-movie-title-payment").textContent = bookingData.movie
    document.getElementById("popup-cinema-name").textContent = bookingData.cinema
    document.getElementById("popup-hall-name").textContent = "Cinema 3 - 2D"
    document.getElementById("popup-show-date").textContent = bookingData.date
    document.getElementById("popup-show-time").textContent = `${new Date().getHours()}:40 - ${new Date().getHours() + 1}:40`
    document.getElementById("popup-selected-seats").textContent = bookingData.seats.join(", ")
    document.getElementById("popup-combo-name").textContent = bookingData.popcornCombo
    document.getElementById("popup-combo-quantity").textContent = `Số lượng: ${bookingData.popcornQuantity}`
    document.getElementById("popup-subtotal").textContent = formatCurrency(bookingData.totalPrice)
    document.getElementById("popup-total-amount").textContent = formatCurrency(bookingData.totalPrice)

    // Chuyển sang popup thanh toán
    closePopup(document.getElementById("seat-selection-popup"))
    openPopup(document.getElementById("payment-popup"))
  }

  // Xử lý mã giảm giá
  document.getElementById("popup-apply-discount-btn").onclick = () => {
    const code = document.getElementById("popup-discount-code").value.trim().toUpperCase()
    let total = bookingData.totalPrice

    // Kiểm tra mã giảm giá
    if (code === "DISCOUNT10") {
      total = Math.round(total * 0.9)
      showAlert("Áp dụng mã giảm giá 10% thành công!", "success")
    } else if (code === "TINDEPTRAI" || code === "SONDEPTRAI") {
      total = 0
      showAlert("Áp dụng mã giảm giá 100% thành công!", "success")
    } else {
      showAlert("Mã giảm giá không hợp lệ!", "error")
    }

    document.getElementById("popup-total-amount").textContent = formatCurrency(total)
  }

  // Xác nhận thanh toán
  document.getElementById("popup-confirm-payment-btn").onclick = () => {
    const total = document.getElementById("popup-total-amount").textContent
    showAlert(`Thanh toán thành công với tổng: ${total}!`, "success")
    closeAllPopups()
  }

  // Menu hamburger
  document.querySelector(".hamburger")?.addEventListener("click", () => {
    const menu = document.querySelector(".menu-items")
    const hamburger = document.querySelector(".hamburger")
    menu.classList.toggle("active")
    hamburger.textContent = menu.classList.contains("active") ? "✕" : "☰"
  })

  // Cập nhật giá khi thay đổi combo/số lượng
  document.getElementById("popcorn-combo")?.addEventListener("change", updatePrice)
  document.getElementById("popcorn-quantity")?.addEventListener("change", updatePrice)

  // Đóng popup thanh toán khi click bên ngoài
  document.getElementById("payment-popup")?.addEventListener("click", (e) => {
    if (e.target.id === "payment-popup") {
      closePopup(document.getElementById("payment-popup"))
      openPopup(document.getElementById("seat-selection-popup"))
    }
  })
})