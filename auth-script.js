// Form switching functionality
function toggleForm() {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    
    if (loginForm.classList.contains('hidden')) {
        loginForm.classList.remove('hidden');
        signupForm.classList.add('hidden');
    } else {
        loginForm.classList.add('hidden');
        signupForm.classList.remove('hidden');
    }
}

// Form validation
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePassword(password) {
    return password.length >= 8;
}

function validatePhone(phone) {
    const re = /^[\+]?[1-9][\d]{0,15}$/;
    return re.test(phone.replace(/\s/g, ''));
}

// Add error/success states
function setInputState(inputElement, state, message = '') {
    const inputGroup = inputElement.parentElement;
    const existingError = inputGroup.querySelector('.error-message');
    
    // Remove existing states
    inputGroup.classList.remove('error', 'success');
    if (existingError) {
        existingError.remove();
    }
    
    if (state === 'error') {
        inputGroup.classList.add('error');
        if (message) {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.textContent = message;
            inputGroup.appendChild(errorDiv);
        }
    } else if (state === 'success') {
        inputGroup.classList.add('success');
    }
}

// Real-time validation
document.addEventListener('DOMContentLoaded', function() {
    // Login form validation
    const loginEmail = document.getElementById('loginEmail');
    const loginPassword = document.getElementById('loginPassword');
    
    loginEmail.addEventListener('blur', function() {
        if (this.value && !validateEmail(this.value)) {
            setInputState(this, 'error', 'Please enter a valid email address');
        } else if (this.value) {
            setInputState(this, 'success');
        }
    });
    
    loginPassword.addEventListener('blur', function() {
        if (this.value && !validatePassword(this.value)) {
            setInputState(this, 'error', 'Password must be at least 8 characters');
        } else if (this.value) {
            setInputState(this, 'success');
        }
    });
    
    // Signup form validation
    const signupEmail = document.getElementById('signupEmail');
    const signupPassword = document.getElementById('signupPassword');
    const confirmPassword = document.getElementById('confirmPassword');
    const phone = document.getElementById('phone');
    const firstName = document.getElementById('firstName');
    const lastName = document.getElementById('lastName');
    
    signupEmail.addEventListener('blur', function() {
        if (this.value && !validateEmail(this.value)) {
            setInputState(this, 'error', 'Please enter a valid email address');
        } else if (this.value) {
            setInputState(this, 'success');
        }
    });
    
    signupPassword.addEventListener('blur', function() {
        if (this.value && !validatePassword(this.value)) {
            setInputState(this, 'error', 'Password must be at least 8 characters');
        } else if (this.value) {
            setInputState(this, 'success');
        }
    });
    
    confirmPassword.addEventListener('blur', function() {
        if (this.value && this.value !== signupPassword.value) {
            setInputState(this, 'error', 'Passwords do not match');
        } else if (this.value) {
            setInputState(this, 'success');
        }
    });
    
    phone.addEventListener('blur', function() {
        if (this.value && !validatePhone(this.value)) {
            setInputState(this, 'error', 'Please enter a valid phone number');
        } else if (this.value) {
            setInputState(this, 'success');
        }
    });
    
    firstName.addEventListener('blur', function() {
        if (this.value && this.value.length < 2) {
            setInputState(this, 'error', 'First name must be at least 2 characters');
        } else if (this.value) {
            setInputState(this, 'success');
        }
    });
    
    lastName.addEventListener('blur', function() {
        if (this.value && this.value.length < 2) {
            setInputState(this, 'error', 'Last name must be at least 2 characters');
        } else if (this.value) {
            setInputState(this, 'success');
        }
    });
});

// Form submission
document.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitBtn = form.querySelector('.btn-primary');
    
    // Add loading state
    submitBtn.classList.add('loading');
    
    // Simulate API call
    setTimeout(() => {
        submitBtn.classList.remove('loading');
        
        if (form.closest('#loginForm')) {
            alert('Login successful!');
        } else {
            alert('Account created successfully!');
        }
    }, 2000);
});

// Clear validation on input
document.addEventListener('input', function(e) {
    if (e.target.matches('input')) {
        const inputGroup = e.target.parentElement;
        if (inputGroup.classList.contains('error')) {
            inputGroup.classList.remove('error');
            const errorMsg = inputGroup.querySelector('.error-message');
            if (errorMsg) {
                errorMsg.remove();
            }
        }
    }
});