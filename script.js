let currentYear = new Date().getFullYear();
let currentMonth = new Date().getMonth();
let selectedYear = currentYear;
let selectedMonth = currentMonth;

// Load previous state from localStorage
const savedState = JSON.parse(localStorage.getItem('calendar_state'));
if (savedState) {
  selectedYear = savedState.year;
  selectedMonth = savedState.month;
}

// Initialize year options (2024 to 2070)
const yearSelect = document.getElementById('yearSelect');
for (let year = 2024; year <= 2070; year++) {
  const option = document.createElement('option');
  option.value = year;
  option.textContent = year;
  yearSelect.appendChild(option);
}

// Initialize month options
const monthSelect = document.createElement('select');
monthSelect.id = 'monthSelect';
const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
monthNames.forEach((month, index) => {
  const option = document.createElement('option');
  option.value = index;
  option.textContent = month;
  monthSelect.appendChild(option);
});
document.querySelector('.navigation').appendChild(monthSelect);

// Save state to localStorage
function saveCalendarState() {
  localStorage.setItem('calendar_state', JSON.stringify({ year: selectedYear, month: selectedMonth }));
}

// Load slashed days
function loadSlashedDays() {
  const savedData = JSON.parse(localStorage.getItem(`calendar_${selectedYear}_${selectedMonth}`)) || {};
  return savedData;
}

// Save slashed days
function saveSlashedDays(slashedDays) {
  localStorage.setItem(`calendar_${selectedYear}_${selectedMonth}`, JSON.stringify(slashedDays));
}

// Save memos to localStorage
function saveMemo(day, memoContent) {
  const key = `memo_${selectedYear}_${selectedMonth}_${day}`;
  localStorage.setItem(key, memoContent);
}

// Load memo for a specific day
function loadMemo(day) {
  const key = `memo_${selectedYear}_${selectedMonth}_${day}`;
  return localStorage.getItem(key) || '';
}

// Generate calendar
function generateCalendar() {
  const slashedDays = loadSlashedDays();
  const firstDay = new Date(selectedYear, selectedMonth, 1);
  const lastDay = new Date(selectedYear, selectedMonth + 1, 0);
  const daysInMonth = lastDay.getDate();
  const firstDayOfMonth = firstDay.getDay();

  document.getElementById('monthHeader').innerText = `${monthNames[selectedMonth]} ${selectedYear}`;
  yearSelect.value = selectedYear;
  monthSelect.value = selectedMonth;

  const calendarContainer = document.getElementById('calendar');
  calendarContainer.innerHTML = '';

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  dayNames.forEach(dayName => {
    const dayHeader = document.createElement('div');
    dayHeader.classList.add('day-name');
    dayHeader.innerText = dayName;
    calendarContainer.appendChild(dayHeader);
  });

  for (let i = 0; i < firstDayOfMonth; i++) {
    const emptyCell = document.createElement('div');
    calendarContainer.appendChild(emptyCell);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dayDate = new Date(selectedYear, selectedMonth, day);
    const dayCell = document.createElement('div');
    dayCell.classList.add('day');
    dayCell.innerHTML = `<span>${day}</span>`;

    const memo = document.createElement('div');
    memo.contentEditable = 'true';
    memo.classList.add('memo');

    // Load saved memo content
    memo.textContent = loadMemo(day);

    // Add event listener to save memo content on input
    memo.addEventListener('input', () => {
      saveMemo(day, memo.textContent);
    });

    dayCell.appendChild(memo);

    // Handle slashed days
    if (slashedDays[dayDate.toDateString()]) {
      dayCell.classList.add('slash');
    }

    dayCell.addEventListener('click', () => {
      dayCell.classList.toggle('slash');
      slashedDays[dayDate.toDateString()] = dayCell.classList.contains('slash');
      saveSlashedDays(slashedDays);
    });

    dayCell.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      dayCell.classList.toggle('important');
    });

    calendarContainer.appendChild(dayCell);
  }

  saveCalendarState();
}

// Month navigation
function nextMonth() {
  selectedMonth = (selectedMonth + 1) % 12;
  if (selectedMonth === 0) selectedYear++;
  generateCalendar();
}

function prevMonth() {
  selectedMonth = (selectedMonth - 1 + 12) % 12;
  if (selectedMonth === 11) selectedYear--;
  generateCalendar();
}

// Reset calendar
function resetCalendar() {
  localStorage.removeItem(`calendar_${selectedYear}_${selectedMonth}`);
  generateCalendar();
}

// Event Listeners
document.getElementById('prevMonthBtn').addEventListener('click', prevMonth);
document.getElementById('nextMonthBtn').addEventListener('click', nextMonth);
document.getElementById('resetBtn').addEventListener('click', resetCalendar);
yearSelect.addEventListener('change', (event) => {
  selectedYear = parseInt(event.target.value);
  generateCalendar();
});
monthSelect.addEventListener('change', (event) => {
  selectedMonth = parseInt(event.target.value);
  generateCalendar();
});

// Initialize calendar
generateCalendar();

// Dark mode toggle
const toggleModeButton = document.getElementById('toggleMode');
const body = document.body;

function toggleDarkMode() {
  const isDarkMode = body.classList.toggle('dark-mode');
  body.classList.toggle('light-mode', !isDarkMode);
  toggleModeButton.textContent = isDarkMode ? 'Light Mode' : 'Dark Mode';
  localStorage.setItem('darkMode', isDarkMode ? 'enabled' : 'disabled');
}

// Load mode from localStorage
const savedMode = localStorage.getItem('darkMode');
if (savedMode === 'enabled') {
  body.classList.add('dark-mode');
  body.classList.remove('light-mode');
  toggleModeButton.textContent = 'Light Mode';
}

toggleModeButton.addEventListener('click', toggleDarkMode);
