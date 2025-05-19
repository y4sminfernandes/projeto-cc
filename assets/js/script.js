function showMenu() {
    let menuMobile = document.querySelector('.mobile-menu');
    if (menuMobile.classList.contains('open')) {
        menuMobile.classList.remove('open');
        document.getElementById('menu-icon').classList.remove("fa-xmark");
        document.getElementById('menu-icon').classList.add("fa-bars");
    }
    else {
        menuMobile.classList.add('open');
        document.getElementById('menu-icon').classList.remove("fa-bars");
        document.getElementById('menu-icon').classList.add("fa-xmark");
    }
}

const modalLogin = document.querySelector('.box-login');
const modalRegister = document.querySelector('.box-register');

function showLogin() {
    modalLogin.showModal();
}

function closeLogin() {
    modalLogin.close();
}

function showRegister() {
    modalRegister.showModal();
    modalLogin.close();
}

function closeRegister() {
    modalRegister.close();
}

const passwordIcons = document.querySelectorAll('.password-icon');

passwordIcons.forEach(icon => {
    icon.addEventListener('click', function () {
        const input = this.parentElement.querySelector('.form-control');
        input.type = input.type === 'password' ? 'text' : 'password';
        this.classList.toggle('fa-eye');
    })
});

const btnProfile = document.querySelector("#profile-btn");
const profileOptions = document.querySelector(".profile-options-list");

if (bntProfile && profileOptions){
btnProfile.addEventListener("click", (event) => {
    event.stopPropagation();
    profileOptions.classList.toggle("active");
});

profileOptions.addEventListener("click", (event) => {
    event.stopPropagation();
});

window.addEventListener("click", () => {
    profileOptions.classList.remove("active");
});
}
