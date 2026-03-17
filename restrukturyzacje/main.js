document.addEventListener('DOMContentLoaded', () => {
    initRestrukturyzacjeForm();
});

function initRestrukturyzacjeForm() {
    const steps = document.querySelectorAll('.form-step');
    const fill = document.querySelector('.progress-fill');
    const text = document.querySelector('#progress-text');
    const successScreen = document.getElementById('success-screen');
    const progressContainer = document.querySelector('.progress-container');
    const nextStep1Btn = document.getElementById('next-step-1');
    const submitBtn = document.getElementById('submit-lead');

    let currentStep = 1;
    const totalSteps = 3;
    const formData = {
        page_type: 'restrukturyzacje',
        name: '',
        phone: '',
        email: '',
        nip: '',
        debt_scale: '',
        urgency: '',
        creditors: ''
    };

    function goToStep(n) {
        steps.forEach(s => s.classList.remove('active'));
        const next = document.querySelector(`.form-step[data-step="${n}"]`);

        if (next) {
            next.classList.add('active');
            currentStep = n;
            updateProgress();
        }
    }

    function updateProgress() {
        const p = (currentStep / totalSteps) * 100;
        fill.style.width = `${p}%`;
        text.innerText = `Krok ${currentStep} z ${totalSteps}`;
    }

    // Validation helpers
    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function validatePhone(phone) {
        const cleanPhone = phone.replace(/[\s-]/g, '');
        return /^(?:\+48)?\d{9}$/.test(cleanPhone);
    }

    function validateNIP(nip) {
        const cleanNIP = nip.replace(/[\s-]/g, '');
        return /^\d{10}$/.test(cleanNIP);
    }

    function showFieldError(input, message) {
        clearFieldError(input);
        input.classList.add('field-error');
        const msg = document.createElement('span');
        msg.className = 'field-error-msg';
        msg.textContent = message;
        input.insertAdjacentElement('afterend', msg);
        input.addEventListener('input', () => clearFieldError(input), { once: true });
    }

    function clearFieldError(input) {
        input.classList.remove('field-error');
        const next = input.nextElementSibling;
        if (next && next.classList.contains('field-error-msg')) {
            next.remove();
        }
    }

    // Step 1: Contact
    nextStep1Btn?.addEventListener('click', () => {
        const nameInput = document.getElementById('form-name');
        const phoneInput = document.getElementById('form-phone');
        const emailInput = document.getElementById('form-email');
        const nipInput = document.getElementById('form-nip');

        formData.name = nameInput.value.trim();
        formData.phone = phoneInput.value.trim();
        formData.email = emailInput.value.trim();
        formData.nip = nipInput.value.trim().replace(/[\s-]/g, '');

        let hasError = false;

        if (!validateNIP(formData.nip)) {
            showFieldError(nipInput, 'Wpisz poprawny 10-cyfrowy NIP firmy.');
            hasError = true;
        }
        if (!validateEmail(formData.email)) {
            showFieldError(emailInput, 'Wpisz poprawny adres e-mail.');
            hasError = true;
        }
        if (!validatePhone(formData.phone)) {
            showFieldError(phoneInput, 'Wpisz poprawny numer telefonu (9 cyfr, np. 500 100 200).');
            hasError = true;
        }
        if (!formData.name || formData.name.split(' ').length < 2) {
            showFieldError(nameInput, 'Wpisz pełne imię i nazwisko.');
            hasError = true;
        }

        if (hasError) return;

        goToStep(2);
    });

    // Step 2: Financials (Buttons)
    document.querySelectorAll('[data-step="2"] .option-pill').forEach(btn => {
        btn.addEventListener('click', () => {
            const val = btn.getAttribute('data-value');
            if (['Do 200 000 zł', '200 000 – 500 000 zł', '500 000 – 2 000 000 zł', 'Powyżej 2 000 000 zł'].includes(val)) {
                formData.debt_scale = val;
                // Highlight choice
                btn.parentElement.querySelectorAll('.option-pill').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
            } else {
                formData.urgency = val;
                btn.parentElement.querySelectorAll('.option-pill').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');

                // If both are filled in step 2, we can potentially auto-advance or just wait for another click
                if (formData.debt_scale && formData.urgency) {
                    setTimeout(() => goToStep(3), 300);
                }
            }
        });
    });

    // Step 3: Creditors (Buttons)
    document.querySelectorAll('[data-step="3"] .option-pill').forEach(btn => {
        btn.addEventListener('click', () => {
            formData.creditors = btn.getAttribute('data-value');
            btn.parentElement.querySelectorAll('.option-pill').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
        });
    });

    // Final Submission
    submitBtn?.addEventListener('click', async () => {
        const consentCheckbox = document.getElementById('form-consent');
        const consentError = document.getElementById('consent-error');

        let hasError = false;

        if (!formData.creditors) {
            alert('Prosimy o wybranie głównych wierzycieli.');
            hasError = true;
        }

        if (!consentCheckbox.checked) {
            consentError.style.display = 'block';
            consentCheckbox.addEventListener('change', () => { consentError.style.display = 'none'; }, { once: true });
            hasError = true;
        }

        if (hasError) return;

        const originalText = submitBtn.innerText;
        submitBtn.innerText = 'Wysyłanie...';
        submitBtn.disabled = true;

        try {
            const response = await fetch('https://hook.eu2.make.com/vmwhqqpdx2phibt3lj552yldsnxop7u5', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                // Tracking
                window.dataLayer = window.dataLayer || [];
                window.dataLayer.push({
                    'event': 'form_submit',
                    'service': 'restrukturyzacje'
                });

                // Redirect to thank you page
                window.location.href = '../thank-you/index.html';
            } else {
                throw new Error('Błąd serwera');
            }
        } catch (error) {
            alert('Wystąpił błąd podczas wysyłania formularza. Prosimy spróbować później.');
            submitBtn.innerText = originalText;
            submitBtn.disabled = false;
        }
    });
}
