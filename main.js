document.addEventListener('DOMContentLoaded', () => {
    initForm();
});

function initForm() {
    const steps = document.querySelectorAll('.form-step');
    const fill = document.querySelector('.progress-fill');
    const text = document.querySelector('#progress-text');
    const rejectionScreen = document.getElementById('rejection-screen');
    const successScreen = document.getElementById('success-screen');
    const rejectionReason = document.getElementById('rejection-reason');
    const progressContainer = document.querySelector('.progress-container');

    let currentStep = 1;
    const totalSteps = 5;
    const formData = {
        loan_type: '',
        currency: '',
        year: '',
        bank: '',
        name: '',
        phone: '',
        email: ''
    };

    function goToStep(n) {
        steps.forEach(s => s.classList.remove('active'));
        const next = document.querySelector(`.form-step[data-step="${n}"]`) || document.querySelector('.form-step[data-step="final"]');

        if (next) {
            next.classList.add('active');
            const stepId = next.getAttribute('data-step');
            currentStep = stepId === 'final' ? 5 : parseInt(stepId);
            updateProgress();
        }
    }

    function updateProgress() {
        const p = (currentStep / totalSteps) * 100;
        fill.style.width = `${p}%`;
        if (currentStep === 5) {
            text.innerText = `Ostatni krok`;
        } else {
            text.innerText = `Krok ${currentStep} z ${totalSteps - 1}`;
        }
    }

    document.querySelectorAll('.option-pill').forEach(btn => {
        if (btn.tagName === 'INPUT') return;

        btn.addEventListener('click', () => {
            const isReject = btn.classList.contains('reject');
            const val = btn.getAttribute('data-value');

            // Save data based on current step
            if (currentStep === 1) formData.loan_type = val;
            if (currentStep === 2) formData.currency = val;
            if (currentStep === 3) formData.year = val;
            if (currentStep === 4) formData.bank = val;

            if (isReject) {
                showRejection(val);
            } else {
                if (btn.id === 'submit-lead') return; // Handled separately
                goToStep(currentStep + 1);
            }
        });
    });

    function showRejection(val) {
        steps.forEach(s => s.classList.remove('active'));
        progressContainer.style.display = 'none';
        rejectionScreen.style.display = 'block';

        let msg = "Obecnie nie obsługujemy tego typu spraw ze względu na brak wadliwych klauzul prawnych w tej kategorii.";
        if (val === 'ing_getin') msg = "Twoim bankiem jest ING lub Getin Bank (upadłość) – obecnie nie obsługujemy takich spraw ze względu na skomplikowaną sytuację prawną tych podmiotów.";
        if (val === 'pln' || val === 'pln_val' || val === 'cash') msg = "Nasza skuteczność wynika z precyzyjnej selekcji. Kredyt jest w PLN (WIBOR) lub gotówkowy – obecnie nie obsługujemy takich spraw.";
        if (val === 'post_2016') msg = "Umowa została zawarta po 2016 roku – większość tych umów nie zawiera wadliwych klauzul abuzywnych.";

        rejectionReason.innerText = msg;
    }

    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function validatePhone(phone) {
        // Basic Polish phone validation (9 digits, ignore spaces/hyphens)
        const cleanPhone = phone.replace(/[\s-]/g, '');
        return /^(?:\+48)?\d{9}$/.test(cleanPhone);
    }

    document.getElementById('submit-lead')?.addEventListener('click', async () => {
        const nameInput = document.getElementById('form-name');
        const phoneInput = document.getElementById('form-phone');
        const emailInput = document.getElementById('form-email');
        const submitBtn = document.getElementById('submit-lead');

        formData.name = nameInput.value.trim();
        formData.phone = phoneInput.value.trim();
        formData.email = emailInput.value.trim();

        // Validation Logic
        if (!formData.name || formData.name.split(' ').length < 2) {
            alert('Prosimy o podanie pełnego imienia i nazwiska.');
            nameInput.focus();
            return;
        }

        if (!validatePhone(formData.phone)) {
            alert('Prosimy o podanie poprawnego numeru telefonu (9 cyfr).');
            phoneInput.focus();
            return;
        }

        if (!validateEmail(formData.email)) {
            alert('Prosimy o podanie poprawnego adresu e-mail.');
            emailInput.focus();
            return;
        }

        const originalText = submitBtn.innerText;
        submitBtn.innerText = 'Wysyłanie...';
        submitBtn.disabled = true;

        try {
            const response = await fetch('https://hook.eu2.make.com/6brloyjkbk8u2n2mklg17ybxvbroiu3v', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                steps.forEach(s => s.classList.remove('active'));
                progressContainer.style.display = 'none';
                successScreen.style.display = 'block';
                console.log('Lead sent successfully:', formData);
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
