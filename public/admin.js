document.addEventListener('DOMContentLoaded', () => {
            // Отримання посилань на елементи DOM
            const adminContent = document.getElementById('admin-content');
            const accessDenied = document.getElementById('access-denied');
            const aboutUsForm = document.getElementById('about-us-form');
            const aboutUsMessage = document.getElementById('about-us-message');
            const productForm = document.getElementById('product-form');
            const productMessage = document.getElementById('product-message');
            const productList = document.getElementById('product-list');

            // --- Перевірка доступу адміністратора ---
            const adminEmail = 'admin@example.com'; // Електронна пошта адміністратора (має співпадати з login.js)
            const loggedInUser = localStorage.getItem('loggedInUser');

            if (loggedInUser === adminEmail) {
                adminContent.classList.remove('hidden'); // Показати адмін-контент
                accessDenied.classList.add('hidden');    // Приховати повідомлення "Відмовлено в доступі"
                loadProductsForAdmin();       // Завантажити та відобразити продукти
            } else {
                adminContent.classList.add('hidden');    // Приховати адмін-контент
                accessDenied.classList.remove('hidden'); // Показати повідомлення "Відмовлено в доступі"
            }

            // --- Функціонал для Продуктів ---

            // Функція для завантаження та відображення продуктів
            function loadProductsForAdmin() {
                const products = JSON.parse(localStorage.getItem('products') || '[]');
                productList.innerHTML = ''; // Очищаємо список перед завантаженням

                if (products.length === 0) {
                    productList.innerHTML = '<p class="text-gray-600">Немає доданих продуктів.</p>';
                    return;
                }

                products.forEach((product, index) => {
                    const productItem = document.createElement('div');
                    productItem.classList.add('p-4', 'border', 'border-gray-200', 'rounded-md', 'mb-2', 'bg-white', 'flex', 'flex-col', 'md:flex-row', 'justify-between', 'items-start', 'md:items-center'); // Додано flex-col/md:flex-row
                    productItem.innerHTML = `
                        <div class="flex-grow mb-4 md:mb-0">
                            <h3 class="text-lg font-semibold text-blue-700 mb-1">${product.name}</h3>
                            <p class="text-gray-700 text-sm mb-2">${product.description.substring(0, 150)}${product.description.length > 150 ? '...' : ''}</p>
                            ${product.price ? `<p class="text-gray-700 text-sm mt-1">Ціна: ${product.price}</p>` : ''}
                        </div>
                        <div class="flex-shrink-0 flex items-center md:ml-4">
                            ${product.image ? `<img src="${product.image}" alt="${product.name}" class="w-24 h-24 object-cover mr-4 rounded-md border border-gray-200">` : ''}
                            <div>
                                <button class="edit-product-btn bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-3 rounded mr-2 transition duration-300" data-index="${index}">Редагувати</button>
                                <button class="delete-product-btn bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded transition duration-300" data-index="${index}">Видалити</button>
                            </div>
                        </div>
                    `;
                    productList.appendChild(productItem);
                });

                // Додаємо обробники подій для кнопок "Редагувати" та "Видалити"
                document.querySelectorAll('.edit-product-btn').forEach(button => {
                    button.addEventListener('click', editProduct);
                });
                document.querySelectorAll('.delete-product-btn').forEach(button => {
                    button.addEventListener('click', deleteProduct);
                });
            }

            // Обробник відправки форми продукту (додавання/редагування)
            productForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const name = document.getElementById('product-name').value.trim();
                const description = document.getElementById('product-description').value.trim();
                const image = document.getElementById('product-image').value.trim() || 'https://via.placeholder.com/300/CCCCCC/FFFFFF?text=No+Image'; // Дефолтне зображення
                const price = document.getElementById('product-price').value.trim();

                if (!name || !description) {
                    showMessage(productMessage, 'Будь ласка, заповніть назву та опис продукту.', 'error');
                    return;
                }

                const products = JSON.parse(localStorage.getItem('products') || '[]');
                let isEditing = productForm.dataset.editingIndex !== undefined;
                let editingIndex = parseInt(productForm.dataset.editingIndex);

                let productToSave;
                if (isEditing) {
                    productToSave = { name, description, image, price };
                    products[editingIndex] = productToSave;
                    showMessage(productMessage, 'Продукт успішно оновлено!', 'success');
                    productForm.removeAttribute('data-editing-index');
                    productForm.querySelector('button[type="submit"]').textContent = 'Додати Продукт';
                } else {
                    productToSave = { name, description, image, price };
                    products.push(productToSave);
                    showMessage(productMessage, 'Продукт успішно додано!', 'success');
                }

                localStorage.setItem('products', JSON.stringify(products));
                productForm.reset(); // Очищаємо форму
                loadProductsForAdmin(); // Перезавантажуємо список продуктів
            });

            // Функція для заповнення форми даними продукту для редагування
            function editProduct(event) {
                const index = parseInt(event.target.dataset.index);
                const products = JSON.parse(localStorage.getItem('products') || '[]');
                const productToEdit = products[index];

                document.getElementById('product-name').value = productToEdit.name;
                document.getElementById('product-description').value = productToEdit.description;
                document.getElementById('product-image').value = productToEdit.image;
                document.getElementById('product-price').value = productToEdit.price || '';

                productForm.dataset.editingIndex = index; // Зберігаємо індекс для режиму редагування
                productForm.querySelector('button[type="submit"]').textContent = 'Зберегти зміни продукту';
                window.scrollTo({ top: productForm.offsetTop, behavior: 'smooth' }); // Прокрутка до форми
            }

            // Функція для видалення продукту
            function deleteProduct(event) {
                const index = parseInt(event.target.dataset.index);
                let products = JSON.parse(localStorage.getItem('products') || '[]');

                if (confirm('Ви впевнені, що хочете видалити цей продукт?')) {
                    products.splice(index, 1); // Видаляємо елемент за індексом
                    localStorage.setItem('products', JSON.stringify(products));
                    loadProductsForAdmin(); // Перезавантажуємо список
                    showMessage(productMessage, 'Продукт успішно видалено!', 'success');
                }
            }

            function showMessage(element, text, type) {
                element.textContent = text;
                element.classList.remove('hidden', 'success-message', 'error-message');
                // Додаємо CSS-класи для стилізації повідомлення (їх потрібно визначити в styles.css)
                element.classList.add(`${type}-message`);
                setTimeout(() => {
                    element.classList.add('hidden');
                }, 3000); // Приховати через 3 секунди
            }
        });