let currentYear = new Date().getFullYear();
let currentMonth = new Date().getMonth(); // 0-based index (0 = January)
let selectedYear = currentYear;
let selectedMonth = currentMonth;

// Initialize the year options (2024 to 2028)
const yearSelect = document.getElementById('yearSelect');
for (let year = 2024; year <= 2028; year++) {
  const option = document.createElement('option');
  option.value = year;
  option.textContent = year;
  yearSelect.appendChild(option);
}

// Function to load slashed days from localStorage
function loadSlashedDays() {
  const savedData = JSON.parse(localStorage.getItem(`calendar_${selectedYear}_${selectedMonth}`)) || {};
  return savedData;
}

// Function to save slashed days to localStorage
function saveSlashedDays(slashedDays) {
  localStorage.setItem(`calendar_${selectedYear}_${selectedMonth}`, JSON.stringify(slashedDays));
}

// Generate the calendar for the selected year and month
function generateCalendar() {
  const slashedDays = loadSlashedDays(); // Load previously slashed days from localStorage
  const firstDay = new Date(selectedYear, selectedMonth, 1);
  const lastDay = new Date(selectedYear, selectedMonth + 1, 0); // Last day of the month
  const daysInMonth = lastDay.getDate();
  const firstDayOfMonth = firstDay.getDay(); // Get the day of the week (0-6)

  // Update the month header
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  document.getElementById('monthHeader').innerText = `${monthNames[selectedMonth]} ${selectedYear}`;

  // Clear the calendar container
  const calendarContainer = document.getElementById('calendar');
  calendarContainer.innerHTML = '';

  // Days of the week header
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  dayNames.forEach(dayName => {
    const dayHeader = document.createElement('div');
    dayHeader.classList.add('day-name');
    dayHeader.innerText = dayName;
    calendarContainer.appendChild(dayHeader);
  });

  // Generate the days for the month
  for (let i = 0; i < firstDayOfMonth; i++) {
    const emptyCell = document.createElement('div');
    calendarContainer.appendChild(emptyCell);
  }

  // Add days to the grid
  for (let day = 1; day <= daysInMonth; day++) {
    const dayDate = new Date(selectedYear, selectedMonth, day);
    const dayCell = document.createElement('div');
    dayCell.classList.add('day');
    dayCell.innerHTML = day;

    // If the day has been slashed, add the 'slash' class
    if (slashedDays[dayDate.toDateString()]) {
      dayCell.classList.add('slash');
    }

    // Add event listener to mark days
    dayCell.addEventListener('click', () => {
      if (!dayCell.classList.contains('disabled')) {
        dayCell.classList.toggle('slash');
        slashedDays[dayDate.toDateString()] = dayCell.classList.contains('slash');
        saveSlashedDays(slashedDays);
      }
    });

    calendarContainer.appendChild(dayCell);
  }
}

// Move to the next month
function nextMonth() {
  if (selectedMonth === 11) { // December
    selectedMonth = 0; // January
    selectedYear++;
  } else {
    selectedMonth++;
  }
  yearSelect.value = selectedYear;
  generateCalendar();
}

// Move to the previous month
function prevMonth() {
  if (selectedMonth === 0) { // January
    selectedMonth = 11; // December
    selectedYear--;
  } else {
    selectedMonth--;
  }
  yearSelect.value = selectedYear;
  generateCalendar();
}

// Reset the calendar to clear all slashes
function resetCalendar() {
  const slashedDays = {};
  saveSlashedDays(slashedDays);
  generateCalendar();
}

// Set up event listeners
document.getElementById('prevMonthBtn').addEventListener('click', prevMonth);
document.getElementById('nextMonthBtn').addEventListener('click', nextMonth);
document.getElementById('resetBtn').addEventListener('click', resetCalendar);

yearSelect.addEventListener('change', (event) => {
  selectedYear = parseInt(event.target.value);
  generateCalendar();
});

// Initialize the calendar for the current month and year
generateCalendar();