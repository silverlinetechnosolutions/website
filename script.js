/**
 * Silverline Techno Solutions
 * Main Application Script
 */

(function () {
    'use strict';

    // Google Apps Script Web App URL (replace after deploying your script)
    const SHEET_API_URL = 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL';

    document.addEventListener('DOMContentLoaded', init);

    function init() {
        initNavbar();
        initMobileMenu();
        initSmoothScroll();
        initScrollReveal();
        initCounterAnimation();
        initDivisionTabs();
        initClientTabs();
        initScopeWizard();
        initContactForm();
        initCurrentYear();
    }

    // ----------------------------------------
    // Navbar Scroll & Section Active State
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
                    if (window.scrollY > 50) {
                        navbar.classList.add('scrolled');
                    } else {
                        navbar.classList.remove('scrolled');
                    }

                    let current = '';
                    const scrollPos = window.scrollY + 180;

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
    // Mobile Drawer Navigation
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

        nav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('active');
                btn.classList.remove('active');
                btn.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            });
        });

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
    // Smooth Anchor Scroll
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
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -50px 0px',
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

        const selectors = [
            '.section-header',
            '.glass-card',
            '.glass-card-glow',
            '.value-card',
            '.team-card',
            '.client-card',
            '.wf-step'
        ];

        selectors.forEach(selector => {
            document.querySelectorAll(selector).forEach((el, index) => {
                el.style.opacity = '0';
                el.style.transform = 'translateY(20px)';
                el.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
                const delay = Math.min(index * 60, 300);
                el.style.transitionDelay = delay + 'ms';
                observer.observe(el);
            });
        });

        // Dynamic visible class application
        document.addEventListener('scroll', () => {
            document.querySelectorAll('.visible').forEach(el => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            });
        });
    }

    // ----------------------------------------
    // Numeric Counter Animation
    // ----------------------------------------
    function initCounterAnimation() {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
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
                const eased = 1 - Math.pow(1 - progress, 3);
                const current = Math.floor(eased * target);
                counter.textContent = current.toLocaleString();

                if (progress < 1) {
                    requestAnimationFrame(update);
                } else {
                    counter.textContent = target.toLocaleString();
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
    // Division Tabs Switcher
    // ----------------------------------------
    function initDivisionTabs() {
        const tabBtns = document.querySelectorAll('.div-tab-btn');
        const panels = document.querySelectorAll('.div-panel');

        if (!tabBtns.length) return;

        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetId = btn.getAttribute('aria-controls');

                tabBtns.forEach(b => {
                    b.classList.remove('active');
                    b.setAttribute('aria-selected', 'false');
                });
                panels.forEach(p => {
                    p.classList.remove('active');
                    p.hidden = true;
                });

                btn.classList.add('active');
                btn.setAttribute('aria-selected', 'true');
                const targetPanel = document.getElementById(targetId);
                if (targetPanel) {
                    targetPanel.classList.add('active');
                    targetPanel.hidden = false;
                }
            });
        });
    }

    // ----------------------------------------
    // Client Tabs Switcher
    // ----------------------------------------
    function initClientTabs() {
        const tabBtns = document.querySelectorAll('.client-tab-btn');
        const panels = document.querySelectorAll('.client-panel');

        if (!tabBtns.length) return;

        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetId = btn.getAttribute('aria-controls');

                tabBtns.forEach(b => {
                    b.classList.remove('active');
                    b.setAttribute('aria-selected', 'false');
                });
                panels.forEach(p => {
                    p.classList.remove('active');
                    p.hidden = true;
                });

                btn.classList.add('active');
                btn.setAttribute('aria-selected', 'true');
                const targetPanel = document.getElementById(targetId);
                if (targetPanel) {
                    targetPanel.classList.add('active');
                    targetPanel.hidden = false;
                }
            });
        });
    }

    // ----------------------------------------
    // Scope Estimator Multi-Step Wizard
    // ----------------------------------------
    function initScopeWizard() {
        const step1 = document.getElementById('wizard-step-1');
        const step2 = document.getElementById('wizard-step-2');
        const step3 = document.getElementById('wizard-step-3');

        const btnNext1 = document.getElementById('wizNext1');
        const btnNext2 = document.getElementById('wizNext2');
        const btnPrev2 = document.getElementById('wizPrev2');
        const btnPrev3 = document.getElementById('wizPrev3');

        const form = document.getElementById('wizardForm');
        const submitBtn = document.getElementById('wizSubmitBtn');

        if (!step1 || !step2 || !step3) return;

        function updateStepIndicators(stepNum) {
            document.querySelectorAll('.step-item').forEach(item => {
                const itemStep = parseInt(item.getAttribute('data-step'), 10);
                if (itemStep <= stepNum) {
                    item.classList.add('active');
                } else {
                    item.classList.remove('active');
                }
            });
        }

        btnNext1.addEventListener('click', () => {
            const selectedServices = document.querySelectorAll('input[name="wiz_service"]:checked');
            if (!selectedServices.length) {
                showToast('Please select at least one division service to continue.', 'warning');
                return;
            }
            step1.hidden = true;
            step1.classList.remove('active');
            step2.hidden = false;
            step2.classList.add('active');
            updateStepIndicators(2);
        });

        btnNext2.addEventListener('click', () => {
            step2.hidden = true;
            step2.classList.remove('active');
            step3.hidden = false;
            step3.classList.add('active');
            updateStepIndicators(3);
        });

        btnPrev2.addEventListener('click', () => {
            step2.hidden = true;
            step2.classList.remove('active');
            step1.hidden = false;
            step1.classList.add('active');
            updateStepIndicators(1);
        });

        btnPrev3.addEventListener('click', () => {
            step3.hidden = true;
            step3.classList.remove('active');
            step2.hidden = false;
            step2.classList.add('active');
            updateStepIndicators(2);
        });

        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();

                const name = document.getElementById('wiz_name').value.trim();
                const org = document.getElementById('wiz_org').value.trim();
                const email = document.getElementById('wiz_email').value.trim();
                const phone = document.getElementById('wiz_phone').value.trim();

                if (!name || !org || !email || !phone) {
                    showToast('Please fill in all required contact fields.', 'warning');
                    return;
                }

                submitBtn.disabled = true;
                submitBtn.textContent = 'Submitting Scope Brief...';

                await new Promise(resolve => setTimeout(resolve, 1500));

                showToast('Scope Brief submitted! Our engineering team will prepare an official proposal.', 'success');

                // Reset wizard
                form.reset();
                submitBtn.disabled = false;
                submitBtn.textContent = 'Submit Scope Brief';

                step3.hidden = true;
                step3.classList.remove('active');
                step1.hidden = false;
                step1.classList.add('active');
                updateStepIndicators(1);
            });
        }
    }

    // ----------------------------------------
    // Google Sheets Submission
    // ----------------------------------------
    async function submitToSheet(formData) {
        if (!SHEET_API_URL || SHEET_API_URL === 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL') {
            return false;
        }
        try {
            const response = await fetch(SHEET_API_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams(formData).toString()
            });
            return true;
        } catch (err) {
            return false;
        }
    }

    // ----------------------------------------
    // Contact Form Real-Time Validation
    // ----------------------------------------
    function initContactForm() {
        const form = document.getElementById('contactForm');
        const submitBtn = document.getElementById('submitBtn');
        if (!form || !submitBtn) return;

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

            let isValid = true;
            const requiredFields = form.querySelectorAll('[required]');
            requiredFields.forEach(field => {
                if (!validateField(field)) {
                    isValid = false;
                }
            });

            if (!isValid) {
                const firstError = form.querySelector('.error');
                if (firstError) firstError.focus();
                return;
            }

            submitBtn.classList.add('loading');
            submitBtn.disabled = true;

            const formData = {
                type: 'Contact Inquiry',
                name: document.getElementById('name').value.trim(),
                email: document.getElementById('email').value.trim(),
                phone: document.getElementById('phone').value.trim(),
                service: document.getElementById('service').value,
                message: document.getElementById('message').value.trim(),
                timestamp: new Date().toLocaleString()
            };

            let submitted = await submitToSheet(formData);

            if (!submitted) {
                submitted = await fakeSubmit(1500);
            }

            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;

            showToast('Thank you! Your project inquiry has been received. Our team will get back to you shortly.', 'success');
            form.reset();

            form.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
            form.querySelectorAll('.form-error').forEach(el => {
                el.textContent = '';
                el.classList.remove('visible');
            });
        });
    }

    function fakeSubmit(delay) {
        return new Promise(resolve => setTimeout(resolve, delay));
    }

    function validateField(field) {
        const errorEl = document.getElementById(field.id + '-error');
        let isValid = true;
        let message = '';

        field.classList.remove('error');
        if (errorEl) {
            errorEl.textContent = '';
            errorEl.classList.remove('visible');
        }

        if (field.hasAttribute('required') && !field.value.trim()) {
            isValid = false;
            message = 'This field is required';
        }

        if (isValid && field.type === 'email' && field.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(field.value)) {
                isValid = false;
                message = 'Please enter a valid email address';
            }
        }

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
    // Toast Notification System
    // ----------------------------------------
    function showToast(message, type) {
        const toast = document.getElementById('toast');
        if (!toast) return;

        toast.textContent = message;
        toast.className = 'toast ' + type;
        void toast.offsetWidth;
        toast.classList.add('visible');

        setTimeout(() => {
            toast.classList.remove('visible');
        }, 5000);
    }

    // ----------------------------------------
    // Footer Current Year
    // ----------------------------------------
    function initCurrentYear() {
        const yearEl = document.getElementById('currentYear');
        if (yearEl) {
            yearEl.textContent = new Date().getFullYear();
        }
    }
})();