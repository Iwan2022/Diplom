document.addEventListener('DOMContentLoaded', function() {
    const contactButtons = document.querySelectorAll('.product-card a:last-child');
    const contactModal = document.getElementById('contactModal');
    const closeButton = contactModal.querySelector('.close-button');
    const contactForm = document.getElementById('contactForm');
    const successMessage = document.getElementById('successMessage');

    contactButtons.forEach(button => {
        button.addEventListener('click', function(event) {
            event.preventDefault(); // Запобігти переходу за посиланням
            contactModal.style.display = 'block';
        });
    });

    closeButton.addEventListener('click', function() {
        contactModal.style.display = 'none';
        contactForm.reset(); // Очистити форму при закритті
        successMessage.classList.add('hidden'); // Приховати повідомлення про успіх
    });

    window.addEventListener('click', function(event) {
        if (event.target === contactModal) {
            contactModal.style.display = 'none';
            contactForm.reset(); // Очистити форму при кліку поза модальним вікном
            successMessage.classList.add('hidden'); // Приховати повідомлення про успіх
        }
    });

    contactForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Запобігти реальній відправці форми
        // Імітація відправки - затримка перед показом повідомлення про успіх
        setTimeout(() => {
            contactForm.classList.add('hidden'); // Приховати форму
            successMessage.classList.remove('hidden'); // Показати повідомлення про успіх
        }, 1500); // Затримка в 1.5 секунди
    });
});