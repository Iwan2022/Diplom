const authTitle = document.getElementById('auth-title');
const authForm = document.getElementById('auth-form');
const authButton = document.getElementById('auth-button');
const formSwitch = document.getElementById('form-switch');
const switchText = document.getElementById('switch-text');

let isLoginMode = true;

// --- Визначте email адміністратора тут ---
const adminEmail = 'admin@example.com'; // **ВАЖЛИВО: Змініть на реальну пошту вашого адміністратора**

formSwitch.addEventListener('click', () => {
    isLoginMode = !isLoginMode;
    updateForm();
});

authForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = authForm.email.value;
    const password = authForm.password.value;

    if (isLoginMode) {
        login(email, password);
    } else {
        register(email, password);
    }
});

function updateForm() {
    if (isLoginMode) {
        authTitle.textContent = 'Вхід';
        authButton.textContent = 'Увійти';
        switchText.textContent = 'Зареєструйтесь';
    } else {
        authTitle.textContent = 'Реєстрація';
        authButton.textContent = 'Зареєструватись';
        switchText.textContent = 'Увійти';
    }
}

function register(email, password) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userExists = users.find(user => user.email === email);

    if (userExists) {
        alert('Користувач з такою електронною поштою вже існує.');
        return;
    }

    users.push({ email, password });
    localStorage.setItem('users', JSON.stringify(users));
    alert('Реєстрація успішна! Будь ласка, увійдіть.');
    isLoginMode = true;
    updateForm();
    authForm.reset();
}

function login(email, password) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(user => user.email === email && user.password === password);

    if (user) {
        alert('Вхід успішний!');
        localStorage.setItem('loggedInUser', email); // Зберігаємо email користувача

        // Викликаємо updateLoginStatus, якщо вона визначена глобально (в script.js)
        // Це необхідно, щоб кнопка в хедері оновилась одразу після входу
        if (typeof updateLoginStatus === 'function') {
            updateLoginStatus();
        }

        // --- Логіка перенаправлення адміністратора ---
        if (email === adminEmail) {
            window.location.href = 'admin.html'; // Перенаправлення на адмін-сторінку
        } else {
            window.location.href = 'index.html'; // Перенаправлення на головну сторінку
        }
    } else {
        alert('Неправильна електронна пошта або пароль.');
    }
}

// Забезпечуємо початковий стан форми
updateForm();

// --- ВАЖЛИВО: Функції updateLoginStatus та logout ПОВИННІ бути у script.js ---
// Якщо ці функції були тут, їх ВИДАЛЕНО, щоб уникнути дублювання та конфліктів.
// Вони мають бути визначені один раз у вашому глобальному script.js.