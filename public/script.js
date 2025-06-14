const carousel = document.querySelector('.carousel');
const prevButton = document.getElementById('prev-button');
const nextButton = document.getElementById('next-button');

// Перевіряємо, чи існують елементи каруселі, перш ніж додавати слухачі подій
if (carousel && prevButton && nextButton) {
    prevButton.addEventListener('click', () => {
        carousel.scrollLeft -= carousel.offsetWidth;
    });

    nextButton.addEventListener('click', () => {
        carousel.scrollLeft += carousel.offsetWidth;
    });
}

// Функція для оновлення кнопки "Sing In / Log in"
function updateLoginStatus() {
    const loginStatus = document.getElementById('login-status');
    if (loginStatus) { // Перевірка, чи існує елемент на сторінці
        if (localStorage.getItem('loggedInUser')) {
            loginStatus.textContent = 'Вихід';
            loginStatus.href = '#'; // Змінюємо посилання, щоб не переходити на іншу сторінку
            loginStatus.removeEventListener('click', logout); // Видаляємо, щоб уникнути подвійного додавання
            loginStatus.addEventListener('click', logout); // Додаємо обробник для виходу
        } else {
            loginStatus.textContent = 'Sing In / Log in';
            loginStatus.href = 'login.html'; // Повертаємо посилання на сторінку входу
            loginStatus.removeEventListener('click', logout); // Видаляємо обробник, якщо є
        }
    }
}

function logout() {
    localStorage.removeItem('loggedInUser'); // Видаляємо інформацію про користувача
    updateLoginStatus(); // Оновлюємо кнопку
    window.location.href = 'index.html'; // Перенаправляємо на головну
}

// Викликаємо при завантаженні сторінки
updateLoginStatus();