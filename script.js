// ---------- Theme ----------
  var htmlEl = document.documentElement;
  var themeBtn = document.getElementById('themeToggle');

  function applyTheme(theme) {
    htmlEl.setAttribute('data-theme', theme);
    themeBtn.textContent = theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode';
    try { localStorage.setItem('sad-theme', theme); } catch (e) {}
  }

  (function initTheme() {
    var saved = 'light';
    try { saved = localStorage.getItem('sad-theme') || 'light'; } catch (e) {}
    applyTheme(saved);
  })();

  themeBtn.addEventListener('click', function () {
    var current = htmlEl.getAttribute('data-theme');
    applyTheme(current === 'dark' ? 'light' : 'dark');
  });

  // ---------- Student data ----------
  var students = [];
  var currentFilter = 'all';
  var nextId = 1;

  var form = document.getElementById('studentForm');
  var nameInput = document.getElementById('studentName');
  var idInput = document.getElementById('studentIdInput');
  var deptInput = document.getElementById('departmentInput');
  var statusInput = document.getElementById('statusInput');
  var searchInput = document.getElementById('searchInput');
  var listArea = document.getElementById('listArea');
  var filterTabs = document.getElementById('filterTabs');
  var totalCountEl = document.getElementById('totalCount');
  var activeCountEl = document.getElementById('activeCount');
  var inactiveCountEl = document.getElementById('inactiveCount');

  function updateStats() {
    var active = students.filter(function (s) { return s.status === 'active'; }).length;
    totalCountEl.textContent = students.length;
    activeCountEl.textContent = active;
    inactiveCountEl.textContent = students.length - active;
  }

  function render() {
    updateStats();

    var term = searchInput.value.trim().toLowerCase();
    var visible = students.filter(function (s) {
      var matchesFilter = currentFilter === 'all' || s.status === currentFilter;
      var matchesSearch = !term ||
        s.name.toLowerCase().indexOf(term) !== -1 ||
        s.studentId.toLowerCase().indexOf(term) !== -1;
      return matchesFilter && matchesSearch;
    });

    listArea.innerHTML = '';

    if (visible.length === 0) {
      var empty = document.createElement('div');
      empty.className = 'empty-state';
      if (students.length === 0) {
        empty.innerHTML = '<p class="empty-title">No students added yet.</p>' +
          '<p class="empty-sub">Add your first student using the form above.</p>';
      } else {
        empty.innerHTML = '<p class="empty-title">No matching students.</p>' +
          '<p class="empty-sub">Try a different search or filter.</p>';
      }
      listArea.appendChild(empty);
      return;
    }

    var grid = document.createElement('div');
    grid.className = 'students-grid';

    visible.forEach(function (s) {
      var card = document.createElement('div');
      card.className = 'student-card';

      var name = document.createElement('p');
      name.className = 'student-name';
      name.textContent = s.name;

      var idLine = document.createElement('p');
      idLine.className = 'student-meta';
      idLine.textContent = 'ID: ' + s.studentId;

      var deptLine = document.createElement('p');
      deptLine.className = 'student-meta';
      deptLine.textContent = 'Department: ' + (s.department || '—');

      var pill = document.createElement('span');
      pill.className = 'status-pill ' + s.status;
      var dot = document.createElement('span');
      dot.className = 'status-dot';
      pill.appendChild(dot);
      pill.appendChild(document.createTextNode(s.status === 'active' ? 'Active' : 'Inactive'));

      var pillWrap = document.createElement('div');
      pillWrap.appendChild(pill);

      var actions = document.createElement('div');
      actions.className = 'student-actions';

      var toggleBtn = document.createElement('button');
      toggleBtn.className = 'btn-secondary';
      toggleBtn.type = 'button';
      toggleBtn.textContent = 'Toggle Status';
      toggleBtn.addEventListener('click', function () {
        s.status = s.status === 'active' ? 'inactive' : 'active';
        render();
      });

      var deleteBtn = document.createElement('button');
      deleteBtn.className = 'btn-delete';
      deleteBtn.type = 'button';
      deleteBtn.textContent = 'Delete';
      deleteBtn.addEventListener('click', function () {
        students = students.filter(function (item) { return item.id !== s.id; });
        render();
      });

      actions.appendChild(toggleBtn);
      actions.appendChild(deleteBtn);

      card.appendChild(name);
      card.appendChild(idLine);
      card.appendChild(deptLine);
      card.appendChild(pillWrap);
      card.appendChild(actions);

      grid.appendChild(card);
    });

    listArea.appendChild(grid);
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var name = nameInput.value.trim();
    var studentId = idInput.value.trim();
    var department = deptInput.value.trim();
    var status = statusInput.value;

    if (!name || !studentId) {
      if (!name) nameInput.focus(); else idInput.focus();
      return;
    }

    students.push({
      id: nextId++,
      name: name,
      studentId: studentId,
      department: department,
      status: status
    });

    form.reset();
    statusInput.value = 'active';
    nameInput.focus();
    render();
  });

  searchInput.addEventListener('input', render);

  filterTabs.addEventListener('click', function (e) {
    var btn = e.target.closest('.filter-tab');
    if (!btn) return;
    filterTabs.querySelectorAll('.filter-tab').forEach(function (t) { t.classList.remove('active'); });
    btn.classList.add('active');
    currentFilter = btn.getAttribute('data-filter');
    render();
  });

  render();