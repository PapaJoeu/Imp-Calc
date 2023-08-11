let isResizing = false;
let activeWindows = new Map(); // Map to store active windows for each title bar

document.querySelectorAll('.window').forEach(windowEl => {
    windowEl.addEventListener('mousedown', (e) => {
        if (e.target === windowEl) {
            isResizing = true;
        }
    });

    windowEl.addEventListener('mouseup', () => {
        isResizing = false;
    });
});

document.querySelectorAll('.title-bar').forEach(titleBar => {
    titleBar.addEventListener('mousedown', (e) => {
        if (!isResizing) {
            const activeWindow = titleBar.parentElement; // Get the active window for this title bar
            const offsetX = e.clientX - activeWindow.getBoundingClientRect().left;
            const offsetY = e.clientY - activeWindow.getBoundingClientRect().top;
            activeWindows.set(titleBar, { window: activeWindow, offsetX, offsetY }); // Store the active window
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        }
    });
});

function onMouseMove(e) {
    activeWindows.forEach(({ window, offsetX, offsetY }) => {
        if (!isResizing && window) {
            window.style.left = e.clientX - offsetX + 'px';
            window.style.top = e.clientY - offsetY + 'px';
        }
    });
}

function onMouseUp() {
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
    activeWindows.clear(); // Clear all active windows
}