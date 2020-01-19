function closeOverlay(overlay) {
    overlay.classList.remove('open');
}

function closeOverlay_login() {
    overlay = document.getElementById('overlay-login');
    closeOverlay(overlay);
}

function closeOverlay_register() {
    overlay = document.getElementById('overlay-register');
    closeOverlay(overlay);
}