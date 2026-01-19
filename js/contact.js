/**
 * Contact Page JavaScript
 * Handles form validation and submission
 */

(function() {
    const contactForm = document.getElementById('contact-form');
    const formMessage = document.getElementById('form-message');

    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            // Form will submit normally to Web3Forms
            // This is just for additional client-side validation
            
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const subject = document.getElementById('subject').value.trim();
            const message = document.getElementById('message').value.trim();

            // Basic validation
            if (!name || !email || !subject || !message) {
                e.preventDefault();
                showMessage('Please fill in all required fields.', 'error');
                return;
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                e.preventDefault();
                showMessage('Please enter a valid email address.', 'error');
                return;
            }

            // Check hCaptcha (if present)
            const hcaptchaResponse = document.querySelector('[name="h-captcha-response"]');
            if (hcaptchaResponse && !hcaptchaResponse.value) {
                e.preventDefault();
                showMessage('Please complete the captcha verification.', 'error');
                return;
            }

            // Show loading state
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="animate-spin"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                    Sending...
                `;
            }
        });
    }

    function showMessage(text, type) {
        if (formMessage) {
            formMessage.textContent = text;
            formMessage.className = `form-message ${type}`;
            formMessage.classList.remove('hidden');
            
            // Auto-hide after 5 seconds
            setTimeout(() => {
                formMessage.classList.add('hidden');
            }, 5000);
        }
    }

    // Add CSS for spin animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
        .animate-spin {
            animation: spin 1s linear infinite;
        }
    `;
    document.head.appendChild(style);
})();
