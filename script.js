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

startBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    startMenu.classList.toggle('hidden');
});

document.addEventListener('click', () => {
    startMenu.classList.add('hidden');
    document.querySelectorAll('.dropdown-menu').forEach(menu => menu.classList.add('hidden'));
});

const computerWindow = document.getElementById('window');
const notepadWindow = document.getElementById('notepad-window');
const calcWindow = document.getElementById('calc-window');
const paintWindow = document.getElementById('paint-window');
const saveModal = document.getElementById('save-modal');
const canvas = document.getElementById('paint-canvas');
const ctx = canvas.getContext('2d');

let highestZ = 10;  //so the clicked window comes on top
document.querySelectorAll('.window').forEach(win => {
    win.addEventListener('mousedown', () => {
        highestZ++;
        win.style.zIndex = highestZ;
    });
    win.querySelector('.close-btn').addEventListener('click', () => win.classList.add('hidden'));
    setupWindowDrag(win, win.querySelector('.title-bar'));
});

[['computer', computerWindow], ['notepad', notepadWindow], ['calc', calcWindow], ['paint', paintWindow]].forEach(([name, win]) => {
    const open = () => {
        win.classList.remove('hidden');
        if (name === 'computer') renderExplorer();
    };
    document.getElementById(name + '-icon').addEventListener('click', open);
    document.getElementById('menu-' + name).addEventListener('click', open);
});

//Claude helped on the file thing, still figuring out how it works😭

let fileSystem = {
    'C:': {
        type: 'folder',
        children: {
            'Documents': {
                type: 'folder',
                children: {}
            },
            'Pictures': {
                type: 'folder',
                children: {}
            },
            'Wallpapers': {
                type: 'folder',
                children: {}
            },
            'Downloads': {
                type: 'folder',
                children: {}
            }
        }
    }
};

let currentPath = ['C:'];

function saveToFS(folderPath, filename, fileType, content) {
    const folderParts = folderPath.split('\\');
    let targetDir = fileSystem;

    for (let part of folderParts) {
        if (!targetDir[part]) {
            targetDir[part] = { type: 'folder', children: {} };
        }
        if (targetDir[part].children) {
            targetDir = targetDir[part].children;
        } else {
            targetDir = targetDir[part];
        }
    }

    targetDir[filename] = { type: fileType, content: content };
    renderExplorer();
}

function getCurrentFolder() {
    let curr = fileSystem;
    for (let p of currentPath) {
        if (curr[p] && curr[p].children) {
            curr = curr[p].children;
        } else if (curr[p]) {
            curr = curr[p];
        }
    }
    return curr;
}

function renderExplorer() {
    const filesGrid = document.getElementById('explorer-files-grid');
    const addressBar = document.getElementById('explorer-address');
    filesGrid.innerHTML = '';

    addressBar.value = currentPath.join('\\');
    const folder = getCurrentFolder();

    for (let name in folder) {
        const item = folder[name];
        const fileDiv = document.createElement('div');
        fileDiv.className = 'file-item';

        let iconText = 'FILE';
        if (item.type === 'folder') iconText = 'DIR';
        if (item.type === 'txt') iconText = 'TXT';
        if (item.type === 'img') iconText = 'IMG';

        fileDiv.innerHTML = `
            <div class="file-icon">${iconText}</div>
            <div class="file-name">${name}</div>
        `;

        fileDiv.addEventListener('dblclick', () => {
            if (item.type === 'folder') {
                currentPath.push(name);
                renderExplorer();
            } else if (item.type === 'txt') {
                document.querySelector('.notepad-textarea').value = item.content;
                notepadWindow.classList.remove('hidden');
                highestZ++;
                notepadWindow.style.zIndex = highestZ;
            } else if (item.type === 'img') {
                const img = new Image();
                img.onload = () => {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    ctx.drawImage(img, 0, 0);
                };
                img.src = item.content;
                paintWindow.classList.remove('hidden');
                highestZ++;
                paintWindow.style.zIndex = highestZ;
            }
        });

        filesGrid.appendChild(fileDiv);
    }
}

function goUp() {
    if (currentPath.length > 1) {
        currentPath.pop();
        renderExplorer();
    }
}

document.getElementById('explorer-back').addEventListener('click', goUp);
document.getElementById('explorer-up').addEventListener('click', goUp);

document.querySelectorAll('.sidebar-item').forEach(item => {
    item.addEventListener('click', () => {
        currentPath = item.getAttribute('data-path').split('\\');
        renderExplorer();
    });
});

function setupWindowDrag(win, titleBar) {
    let isDragging = false;
    let offsetX = 0, offsetY = 0;

    titleBar.addEventListener('mousedown', (e) => {
        if (e.target.classList.contains('close-btn')) return;
        isDragging = true;
        offsetX = e.clientX - win.offsetLeft;
        offsetY = e.clientY - win.offsetTop;
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        win.style.left = (e.clientX - offsetX) + 'px';
        win.style.top = (e.clientY - offsetY) + 'px';
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });
}

let activeSaveRequest = null;
const saveFolderSelect = document.getElementById('save-folder-select');
const saveFilenameInput = document.getElementById('save-filename-input');

function openSaveFileDialog(config) {
    activeSaveRequest = config;

    saveFilenameInput.value = config.defaultName || 'untitled.txt';
    if (config.defaultFolder) {
        saveFolderSelect.value = config.defaultFolder;
    }

    saveModal.classList.remove('hidden');
    highestZ++;
    saveModal.style.zIndex = highestZ;
}

function closeSave() {
    saveModal.classList.add('hidden');
    activeSaveRequest = null;
}

document.getElementById('save-modal-close').addEventListener('click', closeSave);
document.getElementById('save-modal-cancel').addEventListener('click', closeSave);

document.getElementById('save-modal-confirm').addEventListener('click', () => {
    if (!activeSaveRequest) return;

    const selectedFolderPath = saveFolderSelect.value;
    const filename = saveFilenameInput.value.trim();

    if (!filename) {
        alert('Please enter a valid file name.');
        return;
    }

    const content = activeSaveRequest.getContent();

    saveToFS(selectedFolderPath, filename, activeSaveRequest.fileType || 'txt', content);
    closeSave();
});

const notepadFileBtn = document.getElementById('notepad-file-btn');
const notepadFileMenu = document.getElementById('notepad-file-menu');

notepadFileBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    notepadFileMenu.classList.toggle('hidden');
});

document.getElementById('notepad-menu-save').addEventListener('click', () => {
    notepadFileMenu.classList.add('hidden');
    openSaveFileDialog({
        defaultName: 'note.txt',
        defaultFolder: 'C:\\Documents',
        fileType: 'txt',
        getContent: () => document.querySelector('.notepad-textarea').value
    });
});

const paintFileBtn = document.getElementById('paint-file-btn');
const paintFileMenu = document.getElementById('paint-file-menu');

paintFileBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    paintFileMenu.classList.toggle('hidden');
});

document.getElementById('paint-menu-save').addEventListener('click', () => {
    paintFileMenu.classList.add('hidden');
    openSaveFileDialog({
        defaultName: 'drawing.png',
        defaultFolder: 'C:\\Pictures',
        fileType: 'img',
        getContent: () => canvas.toDataURL()
    });
});

const colorPicker = document.getElementById('paint-color');
const clearBtn = document.getElementById('paint-clear');

let isDrawing = false;
let currentColor = '#000000';

colorPicker.addEventListener('input', (e) => currentColor = e.target.value);

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

canvas.addEventListener('mouseup', () => isDrawing = false);

canvas.addEventListener('mousemove', (e) => {
    if (!isDrawing) return;
    const rect = canvas.getBoundingClientRect();
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.strokeStyle = currentColor;
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
});

clearBtn.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

const calcScreen = document.getElementById('calc-screen');
document.querySelectorAll('.calc-btn').forEach(button => {
    button.addEventListener('click', () => {
        const value = button.getAttribute('data-value');

        if (button.id === 'calc-clear') {
            calcScreen.value = '0';
            return;
        }

        if (value === '=') {
            if (calcScreen.value === '67') {    //67
                document.body.animate([
                    { transform: 'skewY(0deg)' },
                    { transform: 'skewY(-3.5deg)' },
                    { transform: 'skewY(3.5deg)' },
                    { transform: 'skewY(-3.5deg)' },
                    { transform: 'skewY(3.5deg)' },
                    { transform: 'skewY(0deg)' }
                ], { duration: 1200, iterations: 1.5 });
            }
            try {
                calcScreen.value = eval(calcScreen.value);  //I used eval on my first ever project so...
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
