function showMenu() {
    let menuMobile = document.querySelector('.mobile-menu');
    if (menuMobile && menuMobile.classList.contains('open')) {
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
const modalCadastro = document.querySelector('.box-register');

function showLogin() {
    modalLogin.showModal();
}

function closeLogin() {
    modalLogin.close();
}

function showRegister() {
    modalCadastro.showModal();
    modalLogin.close();
}

function closeRegister() {
    modalCadastro.close();
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
if (btnProfile) {
    const profileOptions = document.querySelector(".profile-options-list");
    if (profileOptions) {
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
    } else {
        console.error('Elemento com a classe ".profile-options-list" não encontrado!');
    }
} else {
    console.error('Elemento com id "profile-btn" não encontrado!');
}

const btnFilter = document.querySelector(".btn-filter");
const filterContent = document.querySelector("#filter_content");

if (btnFilter && filterContent) {
    btnFilter.addEventListener("click", (event) => {
        event.stopPropagation();
        sortContent.classList.remove("active");
        filterContent.classList.toggle("active");
        console.log("Filter button clicked");
    });

    filterContent.addEventListener("click", (event) => {
        event.stopPropagation();
    });

    window.addEventListener("click", () => {
        filterContent.classList.remove("active");
    });
} else {
    console.error('Elemento com a classe ".btn-filter" ou "#filter_content" não encontrado!');
}

const btnSort = document.querySelector(".btn-sort");
const sortContent = document.querySelector("#sort_content");

if (btnSort && sortContent) {
    btnSort.addEventListener("click", (event) => {
        event.stopPropagation();
        filterContent.classList.remove("active");
        sortContent.classList.toggle("active");
    });

    sortContent.addEventListener("click", (event) => {
        event.stopPropagation();
    });

    window.addEventListener("click", () => {
        sortContent.classList.remove("active");
    });
} else {
    console.error('Elemento com a classe ".btn-sort" ou "#sort_content" não encontrado!');
}

const createCards = Array.from({ length: 100 }).map((_, i) =>
    `<div class="card">
        <div class="card-image">
            <img src="assets/images/foto_restaurante.png" alt="Foto restaurante">
        </div>
        <div class="card-info">
            <h3>Restaurante ${i + 1}</h3>
            <div>
                Categoria
            </div>
            <div>
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
                <span>5,0</span>
            </div>
            <div>
                <i class="fa-solid fa-location-dot"></i>
                Cidade
            </div>
        </div>
    </div>`);

let perPage = 12;
const statePage = {
    page: 1,
    perPage,
    totalPage: Math.ceil(createCards.length / perPage),
    maxVisibleButtons: 5,
}

const pageControls = {
    next() {
        statePage.page++;

        const lastPage = statePage.page > statePage.totalPage;
        if (lastPage) {
            statePage.page--;
        }
    },
    preview() {
        statePage.page--;

        if (statePage.page < 1) {
            statePage.page++;
        }
    },
    goTo(page) {
        if (page < 1) {
            page = 1;
        }

        statePage.page = +page;

        if (page > statePage.totalPage) {
            statePage.page = statePage.totalPage;
        }
    },
    createListeners() {
        document.querySelector("#first").addEventListener("click", () => {
            pageControls.goTo(1);
            update();
        });

        document.querySelector("#last").addEventListener("click", () => {
            pageControls.goTo(statePage.totalPage);
            update();
        });

        document.querySelector("#next").addEventListener("click", () => {
            pageControls.next();
            update();
        });

        document.querySelector("#preview").addEventListener("click", () => {
            pageControls.preview();
            update();
        });
    },
    disableButtons() {
        if (statePage.page === 1) {
            document.querySelector("#preview").disabled = true;
            document.querySelector("#first").disabled = true;

        } else {
            document.querySelector("#preview").disabled = false;
            document.querySelector("#first").disabled = false;
        }
        if (statePage.page === statePage.totalPage) {
            document.querySelector("#next").disabled = true;
            document.querySelector("#last").disabled = true;
        } else {
            document.querySelector("#next").disabled = false;
            document.querySelector("#last").disabled = false;
        }
    }
}

const pageCards = {
    create(cardHTML) {
        const container = document.createElement("a");
        container.innerHTML = cardHTML;
        document.querySelector("#cards_container").appendChild(container);
    },
    update() {
        document.querySelector("#cards_container").innerHTML = "";
        let page = statePage.page - 1;
        let start = page * statePage.perPage;
        let end = start + statePage.perPage;

        const paginatedCards = createCards.slice(start, end);

        paginatedCards.forEach(pageCards.create);
    }
}

const numButtons = {
    create(number) {
        const button = document.createElement("li");
        button.innerHTML = `<a href="#">${number}</a>`;

        if (statePage.page === number) {
            button.classList.add("active");
        }

        button.addEventListener("click", (event) => {
            const page = event.target.innerText;

            pageControls.goTo(page);
            update();
        });
        document.querySelector("#pagination_numbers").appendChild(button);
    },
    update() {
        document.querySelector("#pagination_numbers").innerHTML = "";
        const { maxLeft, maxRight } = numButtons.calculateMaxVisible();
        for (let page = maxLeft; page <= maxRight; page++) {
            numButtons.create(page);
        }
    },
    calculateMaxVisible() {
        const { maxVisibleButtons } = statePage;
        let maxLeft = (statePage.page - Math.floor(maxVisibleButtons / 2));
        let maxRight = (statePage.page + Math.floor(maxVisibleButtons / 2));

        if (maxLeft < 1) {
            maxLeft = 1;
            maxRight = maxVisibleButtons;
        }

        if (maxRight > statePage.totalPage) {
            maxLeft = statePage.totalPage - (maxVisibleButtons - 1);
            maxRight = statePage.totalPage;
            if (maxLeft < 1) {
                maxLeft = 1;
            }
        }

        return { maxLeft, maxRight };
    }
}

function update() {
    pageCards.update();
    numButtons.update();
    pageControls.disableButtons();
}

function init() {
    update();
    pageControls.createListeners();
}

init();

document.addEventListener('DOMContentLoaded', init);

function init() {
    fetch('https://projeto-cc.onrender.com/api/restaurantes')
        .then(response => response.json())
        .then(data => {
            console.log(data);
            displayRestaurants(data);
        })
        .catch(error => {
            console.error('Erro na busca dos restaurantes:', error);
        });
}

function displayRestaurants(restaurants) {
    const container = document.getElementById('cards_container');

    restaurants.forEach(restaurant => {
        const card = document.createElement('div');
        card.classList.add('restaurant-card');
        card.innerHTML = `
      <h3>${restaurant.name}</h3>  <!-- Nome do restaurante -->
      <p>Tipo de Culinária: ${restaurant.type}</p>  <!-- Tipo de comida -->
    `;
        container.appendChild(card);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form');
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }
});

async function handleFormSubmit(event) {
    event.preventDefault();

const formData = {
    nome: document.getElementById('name').value,
    cnpj: document.getElementById('cnpj').value,
    telefone: document.getElementById('telphone').value,
    celular: document.getElementById('celphone').value,
    email_comercial: document.getElementById('email_comercial').value,
    confirm_email: document.getElementById('confirm_email').value,
    senha: document.getElementById('password_register').value,
    confirm_senha: document.getElementById('confirm_password_register').value,
};



    if (formData.email_comercial !== formData.confirm_email) {
        alert('Os e-mails estão diferentes');
        return;
    }
    if (formData.senha !== formData.confirm_senha) {
        alert('As senhas estão diferentes');
        return;
    }
    try {
        const response = await fetch('https://projeto-cc.onrender.com/api/restaurantes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });
        if (response.ok) {
            alert('Restaurante cadastrado');
            form.reset();
        } else {
            alert('Erro ao cadastrar restaurante!');
        }
    } catch (error) {
        console.error('Erro ao enviar o formulário:', error);
        alert('Erro na conexão com o servidor.');
    }
}
