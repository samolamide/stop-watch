class Stopwatch {
    constructor(displayElement, lapListElement) {
        this.hours = 0;
        this.minutes = 0;
        this.seconds = 0;
        this.milliseconds = 0;
        this.intervalId = null;
        this.display = displayElement;
        this.lapList = lapListElement;
        this.lapTimes = [];
        this.updateDisplay();
    }

    // Format single digit numbers with leading zero
    formatTime(num) {
        return num.toString().padStart(2, '0');
    }

    // Format milliseconds with leading zeros
    formatMilliseconds(num) {
        return num.toString().padStart(3, '0');
    }

    // Update the display with current time including milliseconds
    updateDisplay() {
        this.display.textContent = `${this.formatTime(this.hours)}:${this.formatTime(this.minutes)}:${this.formatTime(this.seconds)}.${this.formatMilliseconds(this.milliseconds)}`;
    }

    // Increment time by 10 milliseconds and handle overflow
    incrementTime() {
        this.milliseconds += 10;
        if (this.milliseconds >= 1000) {
            this.milliseconds = 0;
            this.seconds++
            if (this.seconds === 60) {
                this.seconds = 0;
                this.minutes++;
                if (this.minutes === 60) {
                    this.minutes = 0;
                    this.hours++;
                }
            }
        }
        this.updateDisplay();
    }

    // Start the timer using setInterval, prevent multiple timers
    start() {
        if (this.intervalId !== null) return; // Prevent multiple intervals
        this.intervalId = setInterval(() => this.incrementTime(), 10);
    }

    // Stop the timer using clearInterval
    stop() {
        if (this.intervalId === null) return;
        clearInterval(this.intervalId);
        this.intervalId = null;
    }

    // Reset timer to 00:00:00 and stop counting
    reset() {
        this.stop();
        this.hours = 0;
        this.minutes = 0;
        this.seconds = 0;
        this.milliseconds = 0;
        this.lapTimes = [];
        this.updateDisplay();
        this.updateLapList();
    }

    // Record lap time
    lap() {
        if (this.intervalId === null) return; // Only record laps when running
        const lapTime = `${this.formatTime(this.hours)}:${this.formatTime(this.minutes)}:${this.formatTime(this.seconds)}.${this.formatMilliseconds(this.milliseconds)}`;
        this.lapTimes.push(lapTime);
        this.updateLapList();
    }

    // Update lap times display
    updateLapList() {
        if (!this.lapList) return;
        this.lapList.innerHTML = '';
        this.lapTimes.forEach((time, index) => {
            const lapItem = document.createElement('div');
            lapItem.className = 'lap-item';
            lapItem.textContent = `Lap ${index + 1}: ${time}`;
            this.lapList.appendChild(lapItem);
        });
    }

    // Toggle between start and stop
    toggle() {
        if (this.intervalId === null) {
            this.start();
        } else {
            this.stop();
        }
    }

    // Check if stopwatch is running
    isRunning() {
        return this.intervalId !== null;
    }
}

// Theme toggle functionality
class ThemeManager {
    constructor() {
        this.isDark = localStorage.getItem('theme') === 'dark';
        this.applyTheme();
    }

    toggle() {
        this.isDark = !this.isDark;
        localStorage.setItem('theme', this.isDark ? 'dark' : 'light');
        this.applyTheme();
    }

    applyTheme() {
        document.body.classList.toggle('dark-theme', this.isDark);
    }
}

const display = document.getElementById('display');
const resetBtn = document.getElementById('resetBtn');
const toggleBtn = document.getElementById('toggleBtn');
const lapBtn = document.getElementById('lapBtn');
const lapList = document.getElementById('lapList');
const themeBtn = document.getElementById('themeBtn');
const clearBtn = document.getElementById('clearBtn');

const stopwatch = new Stopwatch(display, lapList);
const themeManager = new ThemeManager();

resetBtn.addEventListener('click', () => stopwatch.reset());
toggleBtn.addEventListener('click', () => stopwatch.toggle());
lapBtn.addEventListener('click', () => stopwatch.lap());
themeBtn.addEventListener('click', () => themeManager.toggle());
clearBtn.addEventListener('click', () => stopwatch.reset());


