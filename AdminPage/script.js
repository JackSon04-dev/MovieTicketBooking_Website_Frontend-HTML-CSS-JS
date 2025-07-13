// ==================== BIẾN TOÀN CỤC ====================
let movieIdCounter = 5; // Bắt đầu từ 5 vì đã có 4 phim
let userIdCounter = 4;  // Bắt đầu từ 4 vì đã có 3 user

// ==================== KHỞI TẠO ==================== 
document.addEventListener("DOMContentLoaded", () => {
  checkAdminAccess();
  displayAdminEmail();
  initEventListeners();
});

// ==================== KIỂM TRA QUYỀN ADMIN ====================
function checkAdminAccess() {
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  
  if (!isAdmin || !isLoggedIn) {
    alert("Bạn không có quyền truy cập trang này!");
    window.location.href = "../LoginPage/index.html";
  }
}

function displayAdminEmail() {
  const adminEmail = localStorage.getItem("userEmail");
  if (adminEmail) {
    document.getElementById("admin-email").textContent = adminEmail;
  }
}

// ==================== KHỞI TẠO SỰ KIỆN ====================
function initEventListeners() {
  // Form submissions
  document.getElementById("movie-form").addEventListener("submit", handleAddMovie);
  document.getElementById("user-form").addEventListener("submit", handleAddUser);
  
  // Search functionality
  document.getElementById("movie-search").addEventListener("input", searchMovies);
  document.getElementById("user-search").addEventListener("input", searchUsers);
  
  // Close modals when clicking outside
  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("modal")) {
      closeModal(e.target.id);
    }
  });
}

// ==================== ĐIỀU HƯỚNG ====================
function showSection(sectionId) {
  // Ẩn tất cả sections
  document.querySelectorAll(".admin-section").forEach(section => {
    section.classList.remove("active");
  });
  
  // Hiển thị section được chọn
  document.getElementById(sectionId).classList.add("active");
  
  // Cập nhật nav active
  document.querySelectorAll(".nav-link").forEach(link => {
    link.classList.remove("active");
  });
  document.querySelector(`[onclick="showSection('${sectionId}')"]`).classList.add("active");
}

function logout() {
  localStorage.clear();
  showAlert("Đăng xuất thành công!", "success");
  setTimeout(() => {
    window.location.href = "../LoginPage/index.html";
  }, 1000);
}

function goBack() {
  window.location.href = "../HomePage/index.html";
}

// ==================== QUẢN LÝ MODAL ====================
function showAddMovieModal() {
  document.getElementById("movie-form").reset();
  document.getElementById("movie-modal").classList.add("active");
}

function showAddUserModal() {
  document.getElementById("user-form").reset();
  document.getElementById("user-modal").classList.add("active");
}

function closeModal(modalId) {
  document.getElementById(modalId).classList.remove("active");
}

// ==================== THÊM PHIM ====================
function handleAddMovie(e) {
  e.preventDefault();
  
  const movieData = {
    id: movieIdCounter++,
    title: document.getElementById("movie-title").value,
    genre: document.getElementById("movie-genre").value,
    duration: document.getElementById("movie-duration").value,
    rating: document.getElementById("movie-rating").value,
    status: document.getElementById("movie-status").value,
    image: document.getElementById("movie-image").value || "../HomePage/Images/movie1.png"
  };
  
  addMovieToGrid(movieData);
  closeModal("movie-modal");
  showAlert("Thêm phim mới thành công!", "success");
}

function addMovieToGrid(movieData) {
  const moviesGrid = document.getElementById("movies-grid");
  const movieCard = document.createElement("div");
  movieCard.className = "movie-admin-card";
  movieCard.innerHTML = `
    <img src="${movieData.image}" alt="Movie" class="movie-admin-img">
    <div class="movie-admin-info">
      <h4>${movieData.title}</h4>
      <p>Thể loại: ${getGenreText(movieData.genre)}</p>
      <p>Thời lượng: ${movieData.duration} phút</p>
      <p>Trạng thái: <span class="status ${movieData.status === 'showing' ? 'active' : 'inactive'}">${getStatusText(movieData.status)}</span></p>
      <div class="movie-actions">
        <button class="btn-delete" onclick="deleteMovie(this)">Xóa</button>
      </div>
    </div>
  `;
  moviesGrid.appendChild(movieCard);
}

function deleteMovie(button) {
  if (confirm("Bạn có chắc chắn muốn xóa phim này?")) {
    button.closest(".movie-admin-card").remove();
    showAlert("Xóa phim thành công!", "success");
  }
}

// ==================== THÊM NGƯỜI DÙNG ====================
function handleAddUser(e) {
  e.preventDefault();
  
  const userData = {
    id: userIdCounter++,
    email: document.getElementById("user-email").value,
    name: document.getElementById("user-name").value,
    status: document.getElementById("user-status").value,
    date: new Date().toLocaleDateString("vi-VN")
  };
  
  addUserToTable(userData);
  closeModal("user-modal");
  showAlert("Thêm người dùng mới thành công!", "success");
}

function addUserToTable(userData) {
  const tableBody = document.getElementById("users-table-body");
  const newRow = document.createElement("tr");
  newRow.innerHTML = `
    <td>${userData.id}</td>
    <td>${userData.email}</td>
    <td>${userData.name}</td>
    <td>${userData.date}</td>
    <td><span class="status ${userData.status}">${userData.status === 'active' ? 'Hoạt động' : 'Tạm khóa'}</span></td>
    <td>
      <button class="btn-delete" onclick="deleteUser(this)">Xóa</button>
    </td>
  `;
  tableBody.appendChild(newRow);
}

function deleteUser(button) {
  if (confirm("Bạn có chắc chắn muốn xóa người dùng này?")) {
    button.closest("tr").remove();
    showAlert("Xóa người dùng thành công!", "success");
  }
}

// ==================== TÌM KIẾM ====================
function searchMovies(e) {
  const searchTerm = e.target.value.toLowerCase();
  const movieCards = document.querySelectorAll(".movie-admin-card");
  
  movieCards.forEach(card => {
    const title = card.querySelector("h4").textContent.toLowerCase();
    card.style.display = title.includes(searchTerm) ? "block" : "none";
  });
}

function searchUsers(e) {
  const searchTerm = e.target.value.toLowerCase();
  const userRows = document.querySelectorAll("#users-table-body tr");
  
  userRows.forEach(row => {
    const email = row.cells[1].textContent.toLowerCase();
    const name = row.cells[2].textContent.toLowerCase();
    row.style.display = (email.includes(searchTerm) || name.includes(searchTerm)) ? "" : "none";
  });
}

// ==================== HÀM TIỆN ÍCH ====================
function getGenreText(genre) {
  const genres = {
    'action': 'Hành động',
    'horror': 'Kinh dị', 
    'comedy': 'Hài',
    'drama': 'Chính kịch',
    'sci-fi': 'Khoa học viễn tưởng'
  };
  return genres[genre] || genre;
}

function getStatusText(status) {
  const statuses = {
    'showing': 'Đang chiếu',
    'coming': 'Sắp chiếu', 
    'ended': 'Đã kết thúc'
  };
  return statuses[status] || status;
}

function showAlert(message, type = "info") {
  const alert = document.createElement("div");
  alert.className = `custom-alert ${type}`;
  alert.textContent = message;
  alert.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 12px 18px;
    border-radius: 8px;
    color: white;
    font-weight: 600;
    z-index: 10001;
    transform: translateX(400px);
    transition: transform 0.3s ease;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    font-size: 14px;
  `;
  
  // Màu sắc theo loại
  const colors = {
    success: "linear-gradient(45deg, #22c55e, #16a34a)",
    error: "linear-gradient(45deg, #ef4444, #dc2626)", 
    warning: "linear-gradient(45deg, #f59e0b, #f97316)",
    info: "linear-gradient(45deg, #3b82f6, #2563eb)"
  };
  alert.style.background = colors[type] || colors.info;
  
  document.body.appendChild(alert);
  
  // Hiển thị và ẩn thông báo
  setTimeout(() => alert.style.transform = "translateX(0)", 100);
  setTimeout(() => {
    alert.style.transform = "translateX(400px)";
    setTimeout(() => document.body.removeChild(alert), 300);
  }, 3000);
}