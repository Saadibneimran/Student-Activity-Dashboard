// ---------- Get elements (getElementById / querySelector) ----------
const form = document.getElementById("studentForm");
const nameInput = document.getElementById("name");
const idInput = document.getElementById("studentId");
const deptInput = document.getElementById("department");
const statusInput = document.getElementById("status");
const searchInput = document.getElementById("search");
const list = document.getElementById("studentList");
const emptyState = document.getElementById("emptyState");
const themeBtn = document.getElementById("themeBtn");
const filterBtns = document.querySelectorAll(".filter-btn");

// ---------- Data ----------
let students = [];
let currentFilter = "all";

// ---------- Add student (submit event) ----------
form.addEventListener("submit", function (event) {
  event.preventDefault();

  students.push({
    id: Date.now(),
    name: nameInput.value.trim(),
    studentId: idInput.value.trim(),
    department: deptInput.value.trim(),
    status: statusInput.value
  });

  form.reset();
  render();
});

// ---------- Live search (input event) ----------
searchInput.addEventListener("input", render);

// ---------- Filters (click event) ----------
filterBtns.forEach(function (btn) {
  btn.addEventListener("click", function () {
    filterBtns.forEach(function (b) { b.classList.remove("selected"); });
    btn.classList.add("selected");
    currentFilter = btn.getAttribute("data-filter");
    render();
  });
});

// ---------- Toggle status / Delete (click on list) ----------
list.addEventListener("click", function (event) {
  const btn = event.target;
  const card = btn.closest(".student");
  if (!card) return;
  const id = Number(card.getAttribute("data-id"));

  if (btn.classList.contains("btn-toggle")) {
    const s = students.find(function (s) { return s.id === id; });
    s.status = s.status === "active" ? "inactive" : "active";
  } else if (btn.classList.contains("btn-delete")) {
    students = students.filter(function (s) { return s.id !== id; });
  } else {
    return;
  }
  render();
});

// ---------- Dark mode toggle ----------
themeBtn.addEventListener("click", function () {
  document.body.classList.toggle("dark");
  const isDark = document.body.classList.contains("dark");
  themeBtn.textContent = isDark ? "☀️ Light Mode" : "🌙 Dark Mode";
});

// ---------- Create one student card (createElement / appendChild) ----------
function createCard(s) {
  const card = document.createElement("div");
  card.classList.add("student");
  card.setAttribute("data-id", s.id);

  const title = document.createElement("h3");
  title.textContent = s.name;

  const idText = document.createElement("p");
  idText.textContent = "ID: " + s.studentId;

  const deptText = document.createElement("p");
  deptText.textContent = "Department: " + s.department;

  const badge = document.createElement("span");
  badge.classList.add("badge", s.status);
  badge.textContent = "● " + (s.status === "active" ? "Active" : "Inactive");

  const actions = document.createElement("div");
  actions.classList.add("actions");

  const toggleBtn = document.createElement("button");
  toggleBtn.classList.add("btn-toggle");
  toggleBtn.textContent = "Toggle Status";

  const deleteBtn = document.createElement("button");
  deleteBtn.classList.add("btn-delete");
  deleteBtn.textContent = "Delete";

  actions.appendChild(toggleBtn);
  actions.appendChild(deleteBtn);

  card.appendChild(title);
  card.appendChild(idText);
  card.appendChild(deptText);
  card.appendChild(badge);
  card.appendChild(actions);
  return card;
}

// ---------- Render list + real-time stats ----------
function render() {
  const query = searchInput.value.toLowerCase().trim();

  const visible = students.filter(function (s) {
    const matchSearch = s.name.toLowerCase().includes(query) || s.studentId.toLowerCase().includes(query);
    const matchFilter = currentFilter === "all" || s.status === currentFilter;
    return matchSearch && matchFilter;
  });

  list.textContent = "";
  visible.forEach(function (s) { list.appendChild(createCard(s)); });

  // Empty state: show/hide with the hidden class
  emptyState.classList.toggle("hidden", visible.length > 0);
  if (students.length === 0) {
    document.getElementById("emptyTitle").textContent = "No students added yet.";
    document.getElementById("emptyText").textContent = "Add your first student using the form above.";
  } else {
    document.getElementById("emptyTitle").textContent = "No students found.";
    document.getElementById("emptyText").textContent = "Try a different search or filter.";
  }

  // Statistics
  const active = students.filter(function (s) { return s.status === "active"; }).length;
  document.getElementById("totalCount").textContent = students.length;
  document.getElementById("activeCount").textContent = active;
  document.getElementById("inactiveCount").textContent = students.length - active;
}

render();