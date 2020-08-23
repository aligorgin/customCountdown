const inputContainer = document.getElementById('input-container');
const countdownForm = document.getElementById('countDownForm');
const datEl = document.getElementById('date-picker');

const countdownEl = document.getElementById('countdown');
const countdownElTitle = document.getElementById('countdown-title');
const countdownBtn = document.getElementById('countdown-button');
const timeElements = document.querySelectorAll('span');

const completeEl = document.getElementById('complete');
const completeElInfo = document.getElementById('complete-info');
const completeBtn = document.getElementById('complete-button');

// creating variables to make sure that they are of the same type for cleaner code and performance and readability
let countdownTitle = '';
let countdownDate = '';
let countdownValue = new Date(); // for not confucing and perfomrance implication we will add 'new' to 'date'
let countdownActive;
let savedCountdown;

const second = 1000;
const minute = second * 60;
const hour = minute * 60;
const day = hour * 24;

// set date input minimum with today's date
const today = new Date().toISOString().split('T')[0];
datEl.setAttribute('min', today);

// populate countdown / complete UI
function updateDOM() {
    // interval for change every second
    countdownActive = setInterval(() => {
        const now = new Date().getTime();
        const distance = countdownValue - now;

        const days = Math.floor(distance / day);
        const hours = Math.floor((distance % day) / hour);
        const minutes = Math.floor((distance % hour) / minute);
        const seconds = Math.floor((distance % minute) / second);

        // hide input
        inputContainer.hidden = true;

        // if the countdown has ended , show complete
        if (distance < 0) {
            countdownEl.hidden = true;
            clearInterval(countdownActive);
            completeElInfo.textContent = `${countdownTitle} finished on ${countdownDate}`;
            completeEl.hidden = false;
        } else {
            // else, show the countdown in progress
            countdownElTitle.textContent = countdownTitle;
            // ` convert a var to str ! `
            timeElements[0].textContent = `${days}`;
            timeElements[1].textContent = `${hours}`;
            timeElements[2].textContent = `${minutes}`;
            timeElements[3].textContent = `${seconds}`;
            completeEl.hidden = true;
            countdownEl.hidden = false;
        }
    }, second);
}

// take values from form input
function updateCountdown(e) {
    e.preventDefault();
    countdownTitle = e.srcElement[0].value;
    countdownDate = e.srcElement[1].value;
    savedCountdown = {
        title: countdownTitle,
        date: countdownDate,
    };
    // converts a JavaScript object or value to a JSON string
    localStorage.setItem('countdown', JSON.stringify(savedCountdown));
    // check for valid date
    if (countdownDate === '') {
        alert('please select a date for the countdown.')
    } else {
        // get number version of current Date , updateDOM
        countdownValue = new Date(countdownDate).getTime();
        updateDOM();
    }
}

// reset all values
function reset() {
    // hide countdowns , show inputs
    countdownEl.hidden = true;
    completeEl.hidden = true;
    inputContainer.hidden = false;
    // stop the countdown
    clearInterval(countdownActive);
    // reset the values
    countdownTitle = '';
    countdownDate = '';
    // removing localStorage , you reseted
    localStorage.removeItem('countdown');
}

function restorePreviousCountdown() {
    // get countdown from localStorage if available
    if (localStorage.getItem('countdown')) {
        inputContainer.hidden = true;
        // parses a JSON string, constructing the JavaScript value or object described by the string
        savedCountdown = JSON.parse(localStorage.getItem('countdown'));
        countdownTitle = savedCountdown.title;
        countdownDate = savedCountdown.date;
        countdownValue = new Date(countdownDate).getTime();
        updateDOM();
    }
}

// event listeners
countdownForm.addEventListener('submit', updateCountdown);
countdownBtn.addEventListener('click', reset);
completeBtn.addEventListener('click', reset);

// on load, check localStorage
restorePreviousCountdown();