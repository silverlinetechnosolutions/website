/**
 * Silverline Techno Solutions
 * Main Application Script
 */

(function () {
    'use strict';

    // ----------------------------------------
    // DOM Ready
    // ----------------------------------------
    document.addEventListener('DOMContentLoaded', init);

    function init() {
        initNavbar();
        initMobileMenu();
        initSmoothScroll();
        initScrollReveal();
        initCounterAnimation();
        initContactForm();
        initCurrentYear();
        initParallaxShapes();
    }

    // ----------------------------------------
    // Navbar Scroll Effect
    // ----------------------------------------
    function initNavbar() {
        const navbar = document.getElementById('navbar');
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-links a');

        if (!navbar) return;

        let ticking = false;

        function onScroll() {
            if (!ticking) {
                requestAnimationFrame(() => {
                    // Add scrolled class
                    if (window.scrollY > 50) {
                        navbar.classList.add('scrolled');
                    } else {
                        navbar.classList.remove('scrolled');
                    }

                    // Active link based on scroll position
                    let current = '';
                    const scrollPos = window.scrollY + 150;

                    sections.forEach(section => {
                        const sectionTop = section.offsetTop;
                        const sectionHeight = section.offsetHeight;
                        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                            current = section.getAttribute('id');
                        }
                    });

                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        link.removeAttribute('aria-current');
                        if (link.getAttribute('href') === '#' + current) {
                            link.classList.add('active');
                            link.setAttribute('aria-current', 'page');
                        }
                    });

                    ticking = false;
                });
                ticking = true;
            }
        }

        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }

    // ----------------------------------------
    // Mobile Menu
    // ----------------------------------------
    function initMobileMenu() {
        const btn = document.getElementById('mobileMenuBtn');
        const nav = document.getElementById('navLinks');

        if (!btn || !nav) return;

        btn.addEventListener('click', () => {
            const isOpen = nav.classList.toggle('active');
            btn.classList.toggle('active');
            btn.setAttribute('aria-expanded', isOpen);
            document.body.style.overflow = isOpen ? 'hidden' : '';
        });

        // Close on link click
        nav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('active');
                btn.classList.remove('active');
                btn.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            });
        });

        // Close on Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && nav.classList.contains('active')) {
                nav.classList.remove('active');
                btn.classList.remove('active');
                btn.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
                btn.focus();
            }
        });
    }

    // ----------------------------------------
    // Smooth Scroll
    // ----------------------------------------
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const href = this.getAttribute('href');
                if (href === '#') return;

                const target = document.querySelector(href);
                if (!target) return;

                e.preventDefault();
                const headerOffset = 90;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            });
        });
    }

    // ----------------------------------------
    // Scroll Reveal Animations
    // ----------------------------------------
    function initScrollReveal() {
        // Check for reduced motion preference
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -60px 0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Elements to animate
        const selectors = [
            '.section-header',
            '.about-lead',
            '.about-text',
            '.about-features',
            '.about-visual',
            '.division-block',
            '.why-card',
            '.client-card',
            '.clients-category',
            '.cta-content',
            '.contact-info',
            '.contact-form-wrapper'
        ];

        selectors.forEach(selector => {
            document.querySelectorAll(selector).forEach((el, index) => {
                el.classList.add('reveal');
                // Stagger delay based on sibling index
                const delay = Math.min(index * 80, 400);
                el.style.transitionDelay = delay + 'ms';
                observer.observe(el);
            });
        });
    }

    // ----------------------------------------
    // Counter Animation
    // ----------------------------------------
    function initCounterAnimation() {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            // Just show final values
            document.querySelectorAll('.stat-number[data-target]').forEach(counter => {
                counter.textContent = counter.getAttribute('data-target');
            });
            return;
        }

        const counters = document.querySelectorAll('.stat-number[data-target]');
        if (!counters.length) return;

        const animateCounter = (counter) => {
            const target = parseInt(counter.getAttribute('data-target'), 10);
            const duration = 2000;
            const start = performance.now();

            function update(now) {
                const elapsed = now - start;
                const progress = Math.min(elapsed / duration, 1);
                // Ease out cubic
                const eased = 1 - Math.pow(1 - progress, 3);
                const current = Math.floor(eased * target);
                counter.textContent = current;

                if (progress < 1) {
                    requestAnimationFrame(update);
                } else {
                    counter.textContent = target;
                }
            }

            requestAnimationFrame(update);
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => observer.observe(counter));
    }

    // ----------------------------------------
    // Contact Form Validation
    // ----------------------------------------
    function initContactForm() {
        const form = document.getElementById('contactForm');
        const submitBtn = document.getElementById('submitBtn');
        if (!form || !submitBtn) return;

        // Real-time validation
        const fields = form.querySelectorAll('input, select, textarea');
        fields.forEach(field => {
            field.addEventListener('blur', () => validateField(field));
            field.addEventListener('input', () => {
                if (field.classList.contains('error')) {
                    validateField(field);
                }
            });
        });

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Validate all fields
            let isValid = true;
            const requiredFields = form.querySelectorAll('[required]');
            requiredFields.forEach(field => {
                if (!validateField(field)) {
                    isValid = false;
                }
            });

            if (!isValid) {
                // Focus first error field
                const firstError = form.querySelector('.error');
                if (firstError) firstError.focus();
                return;
            }

            // Collect form data
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);

            // Submit
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;

            // Simulate API call (replace with actual endpoint)
            await new Promise(resolve => setTimeout(resolve, 1500));

            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;

            // Show success toast
            showToast('Thank you! Your message has been sent. We\'ll get back to you shortly.', 'success');
            form.reset();

            // Clear any error states
            form.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
            form.querySelectorAll('.form-error').forEach(el => {
                el.textContent = '';
                el.classList.remove('visible');
            });
        });
    }

    function validateField(field) {
        const errorEl = document.getElementById(field.id + '-error');
        let isValid = true;
        let message = '';

        // Reset state
        field.classList.remove('error');
        if (errorEl) {
            errorEl.textContent = '';
            errorEl.classList.remove('visible');
        }

        // Required check
        if (field.hasAttribute('required') && !field.value.trim()) {
            isValid = false;
            message = 'This field is required';
        }

        // Email validation
        if (isValid && field.type === 'email' && field.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(field.value)) {
                isValid = false;
                message = 'Please enter a valid email address';
            }
        }

        // Phone validation (optional field, but validate format if provided)
        if (isValid && field.type === 'tel' && field.value) {
            const phoneRegex = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,4}[-\s\.]?[0-9]{1,9}$/;
            if (!phoneRegex.test(field.value.replace(/\s/g, ''))) {
                isValid = false;
                message = 'Please enter a valid phone number';
            }
        }

        if (!isValid) {
            field.classList.add('error');
            if (errorEl) {
                errorEl.textContent = message;
                errorEl.classList.add('visible');
            }
        }

        return isValid;
    }

    // ----------------------------------------
    // Toast Notifications
    // ----------------------------------------
    function showToast(message, type) {
        const toast = document.getElementById('toast');
        if (!toast) return;

        toast.textContent = message;
        toast.className = 'toast ' + type;

        // Trigger reflow
        void toast.offsetWidth;
        toast.classList.add('visible');

        setTimeout(() => {
            toast.classList.remove('visible');
        }, 5000);
    }

    // ----------------------------------------
    // Current Year
    // ----------------------------------------
    function initCurrentYear() {
        const yearEl = document.getElementById('currentYear');
        if (yearEl) {
            yearEl.textContent = new Date().getFullYear();
        }
    }

    // ----------------------------------------
    // Parallax Shapes (Mouse Move)
    // ----------------------------------------
    function initParallaxShapes() {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        if (window.matchMedia('(pointer: coarse)').matches) return; // Skip on touch

        const shapes = document.querySelectorAll('.shape');
        if (!shapes.length) return;

        let mouseX = 0;
        let mouseY = 0;
        let currentX = 0;
        let currentY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
            mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
        }, { passive: true });

        function animate() {
            // Lerp for smooth following
            currentX += (mouseX - currentX) * 0.03;
            currentY += (mouseY - currentY) * 0.03;

            shapes.forEach((shape, index) => {
                const speed = (index + 1) * 8;
                const x = currentX * speed;
                const y = currentY * speed;
                shape.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
            });

            requestAnimationFrame(animate);
        }

        animate();
    }
})();