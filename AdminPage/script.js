// ==================== BIẾN TOÀN CỤC ====================
let currentEditingMovieId = null;
let currentEditingUserId = null;

// ==================== KHỞI TẠO ==================== 
document.addEventListener("DOMContentLoaded", () => {
  // Kiểm tra quyền admin
  checkAdminAccess();
  
  // Hiển thị email admin
  const adminEmail = localStorage.getItem("userEmail");
  if (adminEmail) {
    document.getElementById("admin-email").textContent = adminEmail;
  }
  
  // Khởi tạo các sự kiện
  initEventListeners();
});

// ==================== KIỂM TRA QUYỀN ADMIN ====================
function checkAdminAccess() {
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  
  if (!isAdmin || !isLoggedIn) {
    alert("Bạn không có quyền truy cập trang này!");
    window.location.href = "../LoginPage/index.html";
    return;
  }
}

// ==================== KHỞI TẠO SỰ KIỆN ====================
function initEventListeners() {
  // Xử lý form thêm/sửa phim
  document.getElementById("movie-form").addEventListener("submit", handleMovieSubmit);
  
  // Xử lý form thêm/sửa người dùng
  document.getElementById("user-form").addEventListener("submit", handleUserSubmit);
  
  // Xử lý tìm kiếm
  document.getElementById("movie-search").addEventListener("input", searchMovies);
  document.getElementById("user-search").addEventListener("input", searchUsers);
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
  localStorage.removeItem("userEmail");
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("isAdmin");
  window.location.href = "../LoginPage/index.html";
}

function goBack() {
  window.location.href = "../HomePage/index.html";
}

// ==================== QUẢN LÝ MODAL ====================
function showAddMovieModal() {
  currentEditingMovieId = null;
  document.getElementById("movie-modal-title").textContent = "Thêm phim mới";
  document.getElementById("movie-form").reset();
  document.getElementById("movie-modal").classList.add("active");
}

function showAddUserModal() {
  currentEditingUserId = null;
  document.getElementById("user-modal-title").textContent = "Thêm người dùng";
  document.getElementById("user-form").reset();
  document.getElementById("user-modal").classList.add("active");
}

function closeModal(modalId) {
  document.getElementById(modalId).classList.remove("active");
}

// Đóng modal khi click bên ngoài
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("modal")) {
    e.target.classList.remove("active");
  }
});

// ==================== QUẢN LÝ PHIM ====================
function handleMovieSubmit(e) {
  e.preventDefault();
  
  const formData = {
    title: document.getElementById("movie-title").value,
    genre: document.getElementById("movie-genre").value,
    duration: document.getElementById("movie-duration").value,
    rating: document.getElementById("movie-rating").value,
    status: document.getElementById("movie-status").value,
    image: document.getElementById("movie-image").value,
    description: document.getElementById("movie-description").value
  };
  
  if (currentEditingMovieId) {
    // Cập nhật phim
    updateMovie(currentEditingMovieId, formData);
    showAlert("Cập nhật phim thành công!", "success");
  } else {
    // Thêm phim mới
    addMovie(formData);
    showAlert("Thêm phim mới thành công!", "success");
  }
  
  closeModal("movie-modal");
  refreshMoviesGrid();
}

function addMovie(movieData) {
  // Tạo thẻ phim mới
  const moviesGrid = document.getElementById("movies-grid");
  const movieCard = createMovieCard(movieData, Date.now());
  moviesGrid.appendChild(movieCard);
  
  // Cập nhật số liệu dashboard
  updateMovieStats();
}

function createMovieCard(movieData, id) {
  const card = document.createElement("div");
  card.className = "movie-admin-card";
  card.innerHTML = `
    <img src="${movieData.image || '../HomePage/Images/movie1.png'}" alt="Movie" class="movie-admin-img">
    <div class="movie-admin-info">
      <h4>${movieData.title}</h4>
      <p>Thể loại: ${getGenreText(movieData.genre)}</p>
      <p>Thời lượng: ${movieData.duration} phút</p>
      <p>Trạng thái: <span class="status ${movieData.status === 'showing' ? 'active' : 'inactive'}">${getStatusText(movieData.status)}</span></p>
      <div class="movie-actions">
        <button class="btn-edit" onclick="editMovie(${id})">Sửa</button>
        <button class="btn-delete" onclick="deleteMovie(${id})">Xóa</button>
      </div>
    </div>
  `;
  return card;
}

function editMovie(id) {
  currentEditingMovieId = id;
  document.getElementById("movie-modal-title").textContent = "Sửa thông tin phim";
  
  // Giả lập dữ liệu phim (trong thực tế sẽ lấy từ database)
  const movieData = {
    title: "Phim mẫu",
    genre: "action",
    duration: "120",
    rating: "T18",
    status: "showing",
    image: "",
    description: "Mô tả phim mẫu"
  };
  
  // Điền dữ liệu vào form
  document.getElementById("movie-title").value = movieData.title;
  document.getElementById("movie-genre").value = movieData.genre;
  document.getElementById("movie-duration").value = movieData.duration;
  document.getElementById("movie-rating").value = movieData.rating;
  document.getElementById("movie-status").value = movieData.status;
  document.getElementById("movie-image").value = movieData.image;
  document.getElementById("movie-description").value = movieData.description;
  
  document.getElementById("movie-modal").classList.add("active");
}

function deleteMovie(id) {
  if (confirm("Bạn có chắc chắn muốn xóa phim này?")) {
    // Xóa phim (trong thực tế sẽ gọi API)
    showAlert("Xóa phim thành công!", "success");
    refreshMoviesGrid();
    updateMovieStats();
  }
}

function updateMovie(id, movieData) {
  // Cập nhật phim (trong thực tế sẽ gọi API)
  console.log("Updating movie:", id, movieData);
}

function refreshMoviesGrid() {
  // Làm mới danh sách phim (trong thực tế sẽ gọi API để lấy dữ liệu mới)
  console.log("Refreshing movies grid");
}

function updateMovieStats() {
  // Cập nhật số liệu thống kê phim
  const totalMovies = document.querySelectorAll(".movie-admin-card").length;
  document.getElementById("total-movies").textContent = totalMovies;
}

function searchMovies(e) {
  const searchTerm = e.target.value.toLowerCase();
  const movieCards = document.querySelectorAll(".movie-admin-card");
  
  movieCards.forEach(card => {
    const title = card.querySelector("h4").textContent.toLowerCase();
    if (title.includes(searchTerm)) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  });
}

// ==================== QUẢN LÝ NGƯỜI DÙNG ====================
function handleUserSubmit(e) {
  e.preventDefault();
  
  const formData = {
    email: document.getElementById("user-email").value,
    name: document.getElementById("user-name").value,
    status: document.getElementById("user-status").value
  };
  
  if (currentEditingUserId) {
    // Cập nhật người dùng
    updateUser(currentEditingUserId, formData);
    showAlert("Cập nhật người dùng thành công!", "success");
  } else {
    // Thêm người dùng mới
    addUser(formData);
    showAlert("Thêm người dùng mới thành công!", "success");
  }
  
  closeModal("user-modal");
  refreshUsersTable();
}

function addUser(userData) {
  const tableBody = document.getElementById("users-table-body");
  const newRow = createUserRow(userData, Date.now());
  tableBody.appendChild(newRow);
  
  // Cập nhật số liệu dashboard
  updateUserStats();
}

function createUserRow(userData, id) {
  const row = document.createElement("tr");
  row.innerHTML = `
    <td>${id}</td>
    <td>${userData.email}</td>
    <td>${userData.name}</td>
    <td>${new Date().toLocaleDateString("vi-VN")}</td>
    <td><span class="status ${userData.status}">${userData.status === 'active' ? 'Hoạt động' : 'Tạm khóa'}</span></td>
    <td>
      <button class="btn-edit" onclick="editUser(${id})">Sửa</button>
      <button class="btn-delete" onclick="deleteUser(${id})">Xóa</button>
    </td>
  `;
  return row;
}

function editUser(id) {
  currentEditingUserId = id;
  document.getElementById("user-modal-title").textContent = "Sửa thông tin người dùng";
  
  // Giả lập dữ liệu người dùng (trong thực tế sẽ lấy từ database)
  const userData = {
    email: "user@gmail.com",
    name: "Người dùng mẫu",
    status: "active"
  };
  
  // Điền dữ liệu vào form
  document.getElementById("user-email").value = userData.email;
  document.getElementById("user-name").value = userData.name;
  document.getElementById("user-status").value = userData.status;
  
  document.getElementById("user-modal").classList.add("active");
}

function deleteUser(id) {
  if (confirm("Bạn có chắc chắn muốn xóa người dùng này?")) {
    // Xóa người dùng (trong thực tế sẽ gọi API)
    showAlert("Xóa người dùng thành công!", "success");
    refreshUsersTable();
    updateUserStats();
  }
}

function updateUser(id, userData) {
  // Cập nhật người dùng (trong thực tế sẽ gọi API)
  console.log("Updating user:", id, userData);
}

function refreshUsersTable() {
  // Làm mới bảng người dùng (trong thực tế sẽ gọi API để lấy dữ liệu mới)
  console.log("Refreshing users table");
}

function updateUserStats() {
  // Cập nhật số liệu thống kê người dùng
  const totalUsers = document.querySelectorAll("#users-table-body tr").length;
  document.getElementById("total-users").textContent = totalUsers;
}

function searchUsers(e) {
  const searchTerm = e.target.value.toLowerCase();
  const userRows = document.querySelectorAll("#users-table-body tr");
  
  userRows.forEach(row => {
    const email = row.cells[1].textContent.toLowerCase();
    const name = row.cells[2].textContent.toLowerCase();
    
    if (email.includes(searchTerm) || name.includes(searchTerm)) {
      row.style.display = "";
    } else {
      row.style.display = "none";
    }
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
  alert.className = `custom-alert ${type} show`;
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
  
  // Màu sắc theo loại thông báo
  if (type === "success") {
    alert.style.background = "linear-gradient(45deg, #22c55e, #16a34a)";
  } else if (type === "error") {
    alert.style.background = "linear-gradient(45deg, #ef4444, #dc2626)";
  } else if (type === "warning") {
    alert.style.background = "linear-gradient(45deg, #f59e0b, #f97316)";
  } else {
    alert.style.background = "linear-gradient(45deg, #3b82f6, #2563eb)";
  }
  
  document.body.appendChild(alert);
  
  // Hiển thị thông báo
  setTimeout(() => {
    alert.style.transform = "translateX(0)";
  }, 100);
  
  // Ẩn thông báo sau 3 giây
  setTimeout(() => {
    alert.style.transform = "translateX(400px)";
    setTimeout(() => {
      if (document.body.contains(alert)) {
        document.body.removeChild(alert);
      }
    }, 300);
  }, 3000);
}