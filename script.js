// Mobile Menu Toggle
const menuBtn = document.getElementById('menu-btn');
const navbar = document.querySelector('.navbar');

menuBtn.addEventListener('click', () => {
    navbar.classList.toggle('active');

    // Change icon
    if (navbar.classList.contains('active')) {
        menuBtn.innerHTML = '<i class="ri-close-line"></i>';
    } else {
        menuBtn.innerHTML = '<i class="ri-menu-line"></i>';
    }
});

// Close menu when clicking link
document.querySelectorAll('.navbar a').forEach(link => {
    link.addEventListener('click', () => {
        navbar.classList.remove('active');
        menuBtn.innerHTML = '<i class="ri-menu-line"></i>';
    });
});

// Scroll Reveal
const observerOptions = {
    threshold: 0.2
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
            // Optional: stop observing once shown
            // observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe sections and elements with .show-on-scroll class
document.querySelectorAll('section, .show-on-scroll').forEach(el => {
    el.classList.add('hidden');
    observer.observe(el);
});

// Typing Effect for Hero Section (Simple implementation)
const roles = ["Computer Science Engineer", "Frontend Developer", "Web Developer"];
let roleIndex = 0;
let charIndex = 0;
const typingTextElement = document.querySelector('.typing-text');
let isDeleting = false;
let typeSpeed = 100;

function typeEffect() {
    const currentRole = roles[roleIndex];

    if (isDeleting) {
        typingTextElement.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
        typeSpeed = 50;
    } else {
        typingTextElement.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
        typeSpeed = 100;
    }

    if (!isDeleting && charIndex === currentRole.length) {
        isDeleting = true;
        typeSpeed = 2000; // Pause at end
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        typeSpeed = 500;
    }

    setTimeout(typeEffect, typeSpeed);
}

// Start typing effect
document.addEventListener('DOMContentLoaded', typeEffect);

// Active Link & Header Scroll Management
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.navbar a');

window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    let current = '';

    // Header Glow/Blur on scroll
    if (window.scrollY > 50) {
        header.classList.add('header-scrolled');
    } else {
        header.classList.remove('header-scrolled');
    }

    // Scroll-Spy: Update active link
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.pageYOffset >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').includes(current)) {
            link.classList.add('active');
        }
    });
});

// Certificate Filter
const certFilterBtns = document.querySelectorAll('.cert-filter button');
const certCards = document.querySelectorAll('.cert-card');

certFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Update active button
        certFilterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const category = btn.textContent.trim().toLowerCase();

        certCards.forEach(card => {
            const cardCategory = card.getAttribute('data-category');
            if (cardCategory === category) {
                card.style.display = 'block';
                card.style.animation = 'certBtnPop 0.4s ease both';
            } else {
                card.style.display = 'none';
            }
        });
    });
});

// Initialize State on Load
window.addEventListener('DOMContentLoaded', () => {
    const activeBtn = document.querySelector('.cert-filter button.active');
    if (activeBtn) {
        // Apply the filter for the currently active button (e.g., Hackathon)
        const category = activeBtn.textContent.trim().toLowerCase();
        certCards.forEach(card => {
            const cardCategory = card.getAttribute('data-category');
            card.style.display = (cardCategory === category) ? 'block' : 'none';
        });
    }

    // Initialize Tilt
    if (typeof VanillaTilt !== 'undefined') {
        VanillaTilt.init(document.querySelectorAll("[data-tilt]"), {
            max: 15,
            speed: 400,
            glare: true,
            "max-glare": 0.2,
        });
    }
});



// Contact Form Handler (Save to LocalStorage for Admin Panel)
const contactForm = document.querySelector('.glass-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get form values
        const name = contactForm.querySelector('input[type="text"]').value;
        const email = contactForm.querySelector('input[type="email"]').value;
        const message = contactForm.querySelector('textarea').value;

        // Create message object
        const newMessage = {
            name,
            email,
            message,
            timestamp: new Date().toISOString()
        };

        // Save to LocalStorage
        let messages = JSON.parse(localStorage.getItem('portfolio_messages') || '[]');
        messages.push(newMessage);
        localStorage.setItem('portfolio_messages', JSON.stringify(messages));

        // Feedback
        alert('Thank you for your message! It has been sent to the Admin Panel.');
        contactForm.reset();
    });
}

// Secret Admin Access (Ctrl + J)
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'j') {
        e.preventDefault();
        window.location.href = 'admin.html';
    }
});

// Dynamic Content Loader
function loadDynamicContent() {
    const bio = JSON.parse(localStorage.getItem('portfolio_bio') || '{}');

    // Update Hero
    if (bio.hero1) {
        const heroTitle = document.getElementById('display-hero-title');
        if (heroTitle) heroTitle.textContent = bio.hero1;
    }

    // Update Profile Image
    if (bio.img) {
        const profileImg = document.getElementById('display-profile-img');
        if (profileImg) profileImg.src = bio.img;
    }

    // Update About Text
    if (bio.description) {
        const aboutDiv = document.getElementById('display-about-text');
        if (aboutDiv) {
            // Split by newlines to create paragraphs
            const paragraphs = bio.description.split('\n').filter(p => p.trim() !== '');
            aboutDiv.innerHTML = paragraphs.map(p => `<p>${p}</p>`).join('');
        }
    }

    // Update Resume Link
    if (bio.resume) {
        const resumeBtn = document.getElementById('display-resume-btn');
        if (resumeBtn) {
            resumeBtn.href = bio.resume;
            resumeBtn.target = "_blank";
        }
    }

    renderDynamicCertificates();
}

function renderDynamicCertificates() {
    const certs = JSON.parse(localStorage.getItem('portfolio_certificates') || '[]');
    if (certs.length === 0) return; // Use hardcoded ones if empty

    const container = document.getElementById('cert-container');
    if (!container) return;

    // We clear hardcoded ones ONLY if user has added their own
    container.innerHTML = '';

    certs.forEach(cert => {
        const card = document.createElement('div');
        card.className = 'cert-card';
        card.setAttribute('data-category', cert.category);
        card.innerHTML = `
            <div class="cert-img">
                <img src="${cert.img}" alt="${cert.title}">
                <div class="cert-overlay">
                    <a href="${cert.img}" target="_blank" class="btn-small">View Certificate</a>
                </div>
            </div>
            <div class="cert-content">
                <h4>${cert.title}</h4>
                <p>${cert.details}</p>
            </div>
        `;
        container.appendChild(card);
    });

    // Re-apply filter after rendering
    const activeBtn = document.querySelector('.cert-filter button.active');
    if (activeBtn) {
        const category = activeBtn.textContent.trim().toLowerCase();
        document.querySelectorAll('.cert-card').forEach(card => {
            const cardCategory = card.getAttribute('data-category');
            card.style.display = (cardCategory === category) ? 'block' : 'none';
        });
    }
}

// Live View Counter
document.addEventListener('DOMContentLoaded', () => {
    let views = parseInt(localStorage.getItem('portfolio_views') || '0');
    views++;
    localStorage.setItem('portfolio_views', views.toString());

    // Load dynamic content from Admin Panel (LocalStorage)
    if (typeof loadDynamicContent === 'function') {
        loadDynamicContent();
    }
});