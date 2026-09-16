document.getElementById('enter-os-btn').addEventListener('click', () => {
    document.getElementById('welcome-screen').classList.add('hidden');
    document.getElementById('desktop').classList.remove('hidden');
});

function updateClock() {
    const now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12 || 12;
    minutes = minutes < 10 ? '0' + minutes : minutes;

    document.getElementById('clock').textContent = hours + ':' + minutes + ' ' + ampm;
}

setInterval(updateClock, 1000);
updateClock();

const startBtn = document.getElementById('start-btn');
const startMenu = document.getElementById('start-menu');

startBtn.addEventListener('click', () => {
    startMenu.classList.toggle('hidden');
});

// computer window
const computerIcon = document.getElementById('computer-icon');
const computerWindow = document.getElementById('window');
const computerClose = computerWindow.querySelector('.close-btn');
const computerTitleBar = computerWindow.querySelector('.title-bar');

computerIcon.addEventListener('click', () => {
    computerWindow.classList.remove('hidden');
});
document.getElementById('menu-computer').addEventListener('click', () => {
    computerWindow.classList.remove('hidden');
    startMenu.classList.add('hidden');
});
computerClose.addEventListener('click', () => {
    computerWindow.classList.add('hidden');
});

let draggingComputer = false;
let compOffsetX = 0, compOffsetY = 0;

computerTitleBar.addEventListener('mousedown', (e) => {
    if (e.target.classList.contains('close-btn')) return;
    draggingComputer = true;
    compOffsetX = e.clientX - computerWindow.offsetLeft;
    compOffsetY = e.clientY - computerWindow.offsetTop;
});
document.addEventListener('mousemove', (e) => {
    if (!draggingComputer) return;
    computerWindow.style.left = (e.clientX - compOffsetX) + 'px';
    computerWindow.style.top = (e.clientY - compOffsetY) + 'px';
});
document.addEventListener('mouseup', () => {
    draggingComputer = false;
});

// notepad window
const notepadIcon = document.getElementById('notepad-icon');
const notepadWindow = document.getElementById('notepad-window');
const notepadClose = notepadWindow.querySelector('.close-btn');
const notepadTitleBar = notepadWindow.querySelector('.title-bar');

notepadIcon.addEventListener('click', () => {
    notepadWindow.classList.remove('hidden');
});
document.getElementById('menu-notepad').addEventListener('click', () => {
    notepadWindow.classList.remove('hidden');
    startMenu.classList.add('hidden');
});
notepadClose.addEventListener('click', () => {
    notepadWindow.classList.add('hidden');
});

let draggingNotepad = false;
let noteOffsetX = 0, noteOffsetY = 0;

notepadTitleBar.addEventListener('mousedown', (e) => {
    if (e.target.classList.contains('close-btn')) return;
    draggingNotepad = true;
    noteOffsetX = e.clientX - notepadWindow.offsetLeft;
    noteOffsetY = e.clientY - notepadWindow.offsetTop;
});
document.addEventListener('mousemove', (e) => {
    if (!draggingNotepad) return;
    notepadWindow.style.left = (e.clientX - noteOffsetX) + 'px';
    notepadWindow.style.top = (e.clientY - noteOffsetY) + 'px';
});
document.addEventListener('mouseup', () => {
    draggingNotepad = false;
});

//Paint window
const paintIcon = document.getElementById('paint-icon');
const paintWindow = document.getElementById('paint-window');
const paintClose = paintWindow.querySelector('.close-btn');
const paintTitleBar = paintWindow.querySelector('.title-bar');

paintIcon.addEventListener('click', () => {
    paintWindow.classList.remove('hidden');
});

document.getElementById('menu-paint').addEventListener('click', () => {
    paintWindow.classList.remove('hidden');
    startMenu.classList.add('hidden');
});

paintClose.addEventListener('click', () => {
    paintWindow.classList.add('hidden');
});

let draggingPaint = false;
let paintOffsetX = 0, paintOffsetY = 0;

paintTitleBar.addEventListener('mousedown', (e) => {
    if (e.target.classList.contains('close-btn')) return;
    draggingPaint = true;
    paintOffsetX = e.clientX - paintWindow.offsetLeft;
    paintOffsetY = e.clientY - paintWindow.offsetTop;
});

document.addEventListener('mousemove', (e) => {
    if (!draggingPaint) return;
    paintWindow.style.left = (e.clientX - paintOffsetX) + 'px';
    paintWindow.style.top = (e.clientY - paintOffsetY) + 'px';
});

document.addEventListener('mouseup', () => {
    draggingPaint = false;
});

// paint logic
const canvas = document.getElementById('paint-canvas');
const ctx = canvas.getContext('2d');
const colorPicker = document.getElementById('paint-color');
const clearBtn = document.getElementById('paint-clear');

let isDrawing = false;
let currentColor = '#000000';

colorPicker.addEventListener('input', (e) => {
    currentColor = e.target.value;
});

document.querySelectorAll('.swatch').forEach(swatch => {
    swatch.addEventListener('click', () => {
        currentColor = swatch.getAttribute('data-color');
        colorPicker.value = currentColor;
    });
});

canvas.addEventListener('mousedown', (e) => {
    isDrawing = true;
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
});

canvas.addEventListener('mouseup', () => {
    isDrawing = false;
});

canvas.addEventListener('mousemove', draw);

function draw(e) {
    if (!isDrawing) return;
    const rect = canvas.getBoundingClientRect();
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.strokeStyle = currentColor;

    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
}

clearBtn.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

// calculator window
const calcIcon = document.getElementById('calc-icon');
const calcWindow = document.getElementById('calc-window');
const calcClose = calcWindow.querySelector('.close-btn');
const calcTitleBar = calcWindow.querySelector('.title-bar');

calcIcon.addEventListener('click', () => {
    calcWindow.classList.remove('hidden');
});
document.getElementById('menu-calc').addEventListener('click', () => {
    calcWindow.classList.remove('hidden');
    startMenu.classList.add('hidden');
});
calcClose.addEventListener('click', () => {
    calcWindow.classList.add('hidden');
});

let draggingCalc = false;
let calcOffsetX = 0, calcOffsetY = 0;

calcTitleBar.addEventListener('mousedown', (e) => {
    if (e.target.classList.contains('close-btn')) return;
    draggingCalc = true;
    calcOffsetX = e.clientX - calcWindow.offsetLeft;
    calcOffsetY = e.clientY - calcWindow.offsetTop;
});
document.addEventListener('mousemove', (e) => {
    if (!draggingCalc) return;
    calcWindow.style.left = (e.clientX - calcOffsetX) + 'px';
    calcWindow.style.top = (e.clientY - calcOffsetY) + 'px';
});
document.addEventListener('mouseup', () => {
    draggingCalc = false;
});

// calculator logic
const calcScreen = document.getElementById('calc-screen');
const calcButtons = document.querySelectorAll('.calc-btn');

calcButtons.forEach(button => {
    button.addEventListener('click', () => {
        const value = button.getAttribute('data-value');

        if (button.id === 'calc-clear') {
            calcScreen.value = '0';
            return;
        }

        if (value === '=') {
            try {
                calcScreen.value = eval(calcScreen.value);
            } catch (err) {
                calcScreen.value = 'Error';
            }
            return;
        }

        if (calcScreen.value === '0' || calcScreen.value === 'Error') {
            calcScreen.value = value;
        } else {
            calcScreen.value += value;
        }
    });
});