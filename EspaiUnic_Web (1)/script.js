document.addEventListener('DOMContentLoaded', () => {

    // 🎬 Welcome Screen — solo en la página principal
    const welcomeScreen = document.getElementById('welcomeScreen');
    const titleElement = document.getElementById('welcomeTitle');
    const subtitleElement = document.getElementById('welcomeSubtitle');
    const canvas = document.getElementById('confettiCanvas');
    const bgCanvas = document.getElementById('backgroundConfetti');

    if (welcomeScreen && titleElement && subtitleElement && canvas && bgCanvas) {

        // ⏭️ Saltar el welcome si venimos de una página de servicio
        if (sessionStorage.getItem('skipWelcome')) {
            sessionStorage.removeItem('skipWelcome');
            welcomeScreen.remove();
            document.body.classList.remove('loading');
            // Iniciar solo el confetti de fondo, sin la pantalla de bienvenida
        } else {
            const titleText = 'Espai Únic';
            const subtitleText = '¡Bienvenidos!';

            titleElement.textContent = titleText;
            subtitleElement.textContent = subtitleText;

            // 🎊 Confetti Animation
            const ctx = canvas.getContext('2d');
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;

            const confettiParticles = [];
            const confettiCount = 50;

            const purpleColors = [
                'rgba(168, 85, 247, 0.4)',
                'rgba(192, 132, 252, 0.4)',
                'rgba(147, 51, 234, 0.4)',
                'rgba(216, 180, 254, 0.3)',
            ];

            class ConfettiParticle {
                constructor() {
                    this.x = Math.random() * canvas.width;
                    this.y = Math.random() * canvas.height - canvas.height;
                    this.size = Math.random() * 6 + 3;
                    this.speedY = Math.random() * 2 + 1;
                    this.speedX = Math.random() * 2 - 1;
                    this.color = purpleColors[Math.floor(Math.random() * purpleColors.length)];
                    this.rotation = Math.random() * 360;
                    this.rotationSpeed = Math.random() * 4 - 2;
                }
                update() {
                    this.y += this.speedY;
                    this.x += this.speedX;
                    this.rotation += this.rotationSpeed;
                    if (this.y > canvas.height) { this.y = -10; this.x = Math.random() * canvas.width; }
                }
                draw() {
                    ctx.save();
                    ctx.translate(this.x, this.y);
                    ctx.rotate(this.rotation * Math.PI / 180);
                    ctx.fillStyle = this.color;
                    ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
                    ctx.restore();
                }
            }

            for (let i = 0; i < confettiCount; i++) confettiParticles.push(new ConfettiParticle());

            function animateConfetti() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                confettiParticles.forEach(p => { p.update(); p.draw(); });
                if (!welcomeScreen.classList.contains('hidden')) requestAnimationFrame(animateConfetti);
            }
            animateConfetti();

            // Permitir saltar la bienvenida con un clic
            welcomeScreen.addEventListener('click', () => {
                welcomeScreen.classList.add('hidden');
                setTimeout(() => {
                    document.body.classList.remove('loading');
                    welcomeScreen.remove();
                }, 800);
            });

            setTimeout(() => {
                if (welcomeScreen.parentNode) {
                    welcomeScreen.classList.add('hidden');
                    setTimeout(() => {
                        document.body.classList.remove('loading');
                        welcomeScreen.remove();
                    }, 800);
                }
            }, 3500);

            // 🎊 PERMANENT Background Confetti (rendimiento reducido)
            const bgCtx = bgCanvas.getContext('2d');
            bgCanvas.width = window.innerWidth;
            bgCanvas.height = window.innerHeight;

            const bgConfettiParticles = [];
            const bgConfettiCount = 15; // Reducido aún más 20 → 15
            const bgPurpleColors = [
                'rgba(168, 85, 247, 0.2)',
                'rgba(192, 132, 252, 0.2)',
                'rgba(147, 51, 234, 0.2)',
                'rgba(216, 180, 254, 0.15)',
            ];

            class BgConfettiParticle {
                constructor() {
                    this.x = Math.random() * bgCanvas.width;
                    this.y = Math.random() * bgCanvas.height - bgCanvas.height;
                    this.size = Math.random() * 5 + 2;
                    this.speedY = Math.random() * 1.5 + 0.5;
                    this.speedX = Math.random() * 1.5 - 0.75;
                    this.color = bgPurpleColors[Math.floor(Math.random() * bgPurpleColors.length)];
                    this.rotation = Math.random() * 360;
                    this.rotationSpeed = Math.random() * 3 - 1.5;
                }
                update() {
                    this.y += this.speedY;
                    this.x += this.speedX;
                    this.rotation += this.rotationSpeed;
                    if (this.y > bgCanvas.height) { this.y = -10; this.x = Math.random() * bgCanvas.width; }
                }
                draw() {
                    bgCtx.save();
                    bgCtx.translate(this.x, this.y);
                    bgCtx.rotate(this.rotation * Math.PI / 180);
                    bgCtx.fillStyle = this.color;
                    bgCtx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
                    bgCtx.restore();
                }
            }

            for (let i = 0; i < bgConfettiCount; i++) bgConfettiParticles.push(new BgConfettiParticle());

            // --- 🚀 Optimización: Solo correr si es visible y la pestaña está activa ---
            let bgConfettiRunning = true;
            let isPageVisible = true;
            let isCanvasInViewport = true;

            const observer = new IntersectionObserver((entries) => {
                isCanvasInViewport = entries[0].isIntersecting;
                checkRunningState();
            }, { threshold: 0 });
            observer.observe(bgCanvas);

            document.addEventListener('visibilitychange', () => {
                isPageVisible = document.visibilityState === 'visible';
                checkRunningState();
            });

            function checkRunningState() {
                const shouldRun = isPageVisible && isCanvasInViewport;
                if (shouldRun && !bgConfettiRunning) {
                    bgConfettiRunning = true;
                    requestAnimationFrame(animateBgConfetti);
                } else if (!shouldRun) {
                    bgConfettiRunning = false;
                }
            }

            function animateBgConfetti() {
                if (!bgConfettiRunning) return;
                bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
                bgConfettiParticles.forEach(p => { p.update(); p.draw(); });
                // Limitamos fps a ~20 para reducir carga GPU pero usamos RAF para suavidad
                setTimeout(() => requestAnimationFrame(animateBgConfetti), 45);
            }
            animateBgConfetti();

            window.addEventListener('resize', () => {
                bgCanvas.width = window.innerWidth;
                bgCanvas.height = window.innerHeight;
            }, { passive: true });

        } // end else (full welcome animation)

    } // end if(welcomeScreen)

    // 🌟 Navbar Scroll Effect with Auto-Hide
    const navbar = document.querySelector('.navbar');
    let lastScrollY = window.scrollY;
    let navRafPending = false;

    window.addEventListener('scroll', () => {
        if (navRafPending) return;
        navRafPending = true;

        requestAnimationFrame(() => {
            const currentScrollY = window.scrollY;

            // Add scrolled class when scrolled down
            if (currentScrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }

            // Hide navbar when scrolling down, show when scrolling up
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                navbar.classList.add('navbar-hidden');
            } else {
                navbar.classList.remove('navbar-hidden');
            }

            lastScrollY = currentScrollY;
            navRafPending = false;
        });
    }, { passive: true });

    // 🎬 About section — Desvanecimiento profesional en entrada y salida
    const aboutSection = document.getElementById('sobre-nosotros');
    if (aboutSection) {

        // Easing cúbico — más cinematográfico
        function easeCubic(t) {
            return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
        }

        function updateAboutVisibility() {
            const rect = aboutSection.getBoundingClientRect();
            const vh = window.innerHeight;

            // Completamente fuera del viewport → opacidad 0
            if (rect.bottom < 0 || rect.top > vh) {
                aboutSection.style.opacity = '0';
                aboutSection.style.filter = 'blur(12px)';
                aboutSection.style.transform = '';
                return;
            }

            // Medir con el centro de la sección vs centro del viewport
            // Así una sección de 100vh siempre llega a progress=1 cuando está centrada
            const sectionCenter = rect.top + rect.height / 2;
            const viewportCenter = vh / 2;
            const dist = Math.abs(sectionCenter - viewportCenter);

            // La zona de fade: mitad de la sección + 30%vh extra
            const fadeRange = (rect.height / 2) + vh * 0.30;

            // progress: 1 = centrada y visible, 0 = justo fuera del rango
            const raw = Math.max(0, Math.min(1, 1 - (dist / fadeRange)));
            const p = easeCubic(raw);

            const opacity = p;
            const blur = (1 - p) * 10;   // 10px → 0px

            // Dirección: ¿venía desde abajo o sale por arriba?
            const fromBelow = sectionCenter > viewportCenter;
            const scaleVal = fromBelow
                ? 1 + (1 - p) * 0.04   // entra: 1.04 → 1.00
                : 1 - (1 - p) * 0.03;  // sale:  1.00 → 0.97
            const ty = fromBelow
                ? (1 - p) * 22
                : -(1 - p) * 16;

            aboutSection.style.opacity = opacity;
            aboutSection.style.filter = `blur(${blur > 0.05 ? blur.toFixed(2) : '0'}px)`;
            aboutSection.style.transform = (Math.abs(ty) > 0.2 || Math.abs(scaleVal - 1) > 0.001)
                ? `translateY(${ty.toFixed(2)}px) scale(${scaleVal.toFixed(4)})`
                : '';
        }

        updateAboutVisibility();

        let rafPending = false;
        window.addEventListener('scroll', () => {
            if (!rafPending) {
                rafPending = true;
                requestAnimationFrame(() => {
                    updateAboutVisibility();
                    rafPending = false;
                });
            }
        }, { passive: true });
    }

    // 🌟 Scroll Reveal Animation
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in-up').forEach(el => {
        // En escritorio, las tarjetas del carrusel se marcan visibles de inmediato
        // (el JS del carrusel las mueve, no el scroll)
        if (el.classList.contains('service-link') && window.innerWidth > 640) {
            el.classList.add('visible');
        } else {
            observer.observe(el);
        }
    });

    // 🔍 Service card zoom-in click transition
    document.querySelectorAll('.service-link').forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            const card = this.querySelector('.service-card-flip');

            // Zoom in the card
            if (card) {
                card.style.transition = 'transform 0.45s cubic-bezier(0.4,0,0.2,1), opacity 0.45s ease';
                card.style.transform = 'scale(1.35)';
                card.style.opacity = '0';
            }

            // Fade out the whole page
            document.body.style.transition = 'opacity 0.4s ease';
            document.body.style.opacity = '0';

            // Navigate after animation
            setTimeout(() => { window.location.href = href; }, 430);
        });
    });

    // 🍔 Navbar Menu Toggle (Click-based — works on desktop AND mobile touch)
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const navLinks = document.getElementById('navLinks');
    const links = document.querySelectorAll('.nav-link');

    if (hamburgerBtn && navLinks) {
        // Toggle menu on click/tap
        hamburgerBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = hamburgerBtn.classList.contains('active');
            hamburgerBtn.classList.toggle('active');
            navLinks.classList.toggle('active');
            hamburgerBtn.setAttribute('aria-label', isOpen ? 'Abrir menú' : 'Cerrar menú');
        });

        // Close menu when clicking on a link (but NOT the Servicios dropdown trigger)
        links.forEach(link => {
            link.addEventListener('click', () => {
                if (link.classList.contains('nav-dropdown-trigger')) return;
                hamburgerBtn.classList.remove('active');
                navLinks.classList.remove('active');
                hamburgerBtn.setAttribute('aria-label', 'Abrir menú');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!hamburgerBtn.contains(e.target) && !navLinks.contains(e.target)) {
                hamburgerBtn.classList.remove('active');
                navLinks.classList.remove('active');
                hamburgerBtn.setAttribute('aria-label', 'Abrir menú');
                // Also close dropdown
                if (serviciosBtn && serviciosMenu) {
                    serviciosBtn.setAttribute('aria-expanded', 'false');
                    serviciosMenu.classList.remove('open');
                }
            }
        });
    }

    // 🔽 Servicios Dropdown
    const serviciosBtn = document.getElementById('serviciosBtn');
    const serviciosMenu = document.getElementById('serviciosMenu');

    if (serviciosBtn && serviciosMenu) {
        serviciosBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = serviciosMenu.classList.contains('open');
            if (isOpen) {
                serviciosBtn.setAttribute('aria-expanded', 'false');
                serviciosMenu.classList.remove('open');
            } else {
                serviciosBtn.setAttribute('aria-expanded', 'true');
                serviciosMenu.classList.add('open');
            }
        });

        // Close dropdown when clicking a service item
        serviciosMenu.querySelectorAll('.nav-dropdown-item').forEach(item => {
            item.addEventListener('click', () => {
                serviciosBtn.setAttribute('aria-expanded', 'false');
                serviciosMenu.classList.remove('open');
                // Also close mobile nav
                if (hamburgerBtn && navLinks) {
                    hamburgerBtn.classList.remove('active');
                    navLinks.classList.remove('active');
                    hamburgerBtn.setAttribute('aria-label', 'Abrir menú');
                }
            });
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!serviciosBtn.contains(e.target) && !serviciosMenu.contains(e.target)) {
                serviciosBtn.setAttribute('aria-expanded', 'false');
                serviciosMenu.classList.remove('open');
            }
        });
    }

    // 🎠 3D COVERFLOW CAROUSEL
    (function initCoverflow() {
        const scene = document.getElementById('coverflow3DScene');
        const dotsBox = document.getElementById('cfDots');
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        if (!scene) return;

        const cards = Array.from(scene.querySelectorAll('.cf-card'));
        const total = cards.length;
        let current = 0;
        let autoTimer = null;
        let paused = false;

        // CLASES de posición 3D
        const CLASSES = ['cf-far-prev', 'cf-prev', 'cf-active', 'cf-next', 'cf-far-next'];

        // Build dots
        cards.forEach((_, i) => {
            const d = document.createElement('span');
            d.className = 'cf-dot' + (i === 0 ? ' cf-dot-active' : '');
            d.addEventListener('click', () => goTo(i));
            dotsBox.appendChild(d);
        });

        function applyPositions() {
            const dots = dotsBox.querySelectorAll('.cf-dot');
            cards.forEach((card, i) => {
                card.className = 'cf-card'; // reset
                const offset = i - current;

                if (offset === 0) card.classList.add('cf-active');
                else if (offset === -1) card.classList.add('cf-prev');
                else if (offset === 1) card.classList.add('cf-next');
                else if (offset === -2) card.classList.add('cf-far-prev');
                else if (offset === 2) card.classList.add('cf-far-next');
                // los demás quedan ocultos (opacity: 0 por defecto del .cf-card)
            });

            // Wrap-around: último / antepenúltimo
            const wrapOffset = (i) => ((i - current + total) % total);
            cards.forEach((card, i) => {
                if (!card.classList.contains('cf-active') &&
                    !card.classList.contains('cf-prev') &&
                    !card.classList.contains('cf-next') &&
                    !card.classList.contains('cf-far-prev') &&
                    !card.classList.contains('cf-far-next')) {
                    const w = wrapOffset(i);
                    if (w === total - 1) card.classList.add('cf-prev');
                    else if (w === total - 2) card.classList.add('cf-far-prev');
                    else if (w === 1) card.classList.add('cf-next');
                    else if (w === 2) card.classList.add('cf-far-next');
                }
            });

            // Dots
            dots.forEach((d, i) => {
                d.classList.toggle('cf-dot-active', i === current);
            });
        }

        function goTo(index) {
            current = ((index % total) + total) % total;
            applyPositions();
            resetAuto();
        }

        function next() { goTo(current + 1); }
        function prev() { goTo(current - 1); }

        // Botones
        if (prevBtn) prevBtn.addEventListener('click', prev);
        if (nextBtn) nextBtn.addEventListener('click', next);

        // Click en tarjeta
        cards.forEach((card, i) => {
            card.addEventListener('click', () => {
                if (card.classList.contains('cf-active')) {
                    // Navegar al servicio (con animación de fade)
                    const href = card.dataset.href;
                    if (href) {
                        document.body.style.transition = 'opacity 0.35s ease';
                        document.body.style.opacity = '0';
                        setTimeout(() => { window.location.href = href; }, 350);
                    }
                } else {
                    // Solo hacer foco en esa tarjeta
                    goTo(i);
                }
            });
        });

        // Teclado (flechas)
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') prev();
            if (e.key === 'ArrowRight') next();
        });

        // Swipe táctil
        let touchStartX = 0;
        scene.addEventListener('touchstart', e => {
            touchStartX = e.changedTouches[0].clientX;
            paused = true;
            clearTimeout(autoTimer);
        }, { passive: true });

        scene.addEventListener('touchend', e => {
            const dx = e.changedTouches[0].clientX - touchStartX;
            if (Math.abs(dx) > 45) {
                dx < 0 ? next() : prev();
            }
            paused = false;
            resetAuto();
        }, { passive: true });

        // Pausa en hover
        scene.addEventListener('mouseenter', () => { paused = true; clearTimeout(autoTimer); });
        scene.addEventListener('mouseleave', () => { paused = false; resetAuto(); });

        // Auto-play
        function startAuto() {
            autoTimer = setTimeout(function tick() {
                if (!paused) next();
                autoTimer = setTimeout(tick, 4200);
            }, 4200);
        }
        function resetAuto() {
            clearTimeout(autoTimer);
            if (!paused) startAuto();
        }

        // Inicializar
        applyPositions();
        startAuto();
    })();

    // 📱 WhatsApp Form Integration
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('formName').value;
            const email = document.getElementById('formEmail').value;
            const message = document.getElementById('formMessage').value;

            // Número definitivo: 695613985
            const phone = '34695613985';

            const text = `Hola Espai Unic soy ${name}\n\n\n${message}`;
            const encodedText = encodeURIComponent(text);

            const whatsappUrl = `https://wa.me/${phone}?text=${encodedText}`;

            // Abrir en nueva pestaña
            window.open(whatsappUrl, '_blank');
        });
    }

}); // end DOMContentLoaded


// =========================================
// 🎬 SOBRE NOSOTROS – Cinematic Slideshow
// =========================================
document.addEventListener('DOMContentLoaded', function () {
    const SLIDE_DURATION = 7500;   // ms each slide stays visible
    const ANIM_IN = 900;          // ms slide-in animation
    const ANIM_OUT = 700;          // ms slide-out animation

    const slides = document.querySelectorAll('.about-slide');
    const dots = document.querySelectorAll('.about-dot');

    if (!slides.length) return;

    let current = 0;
    let timer = null;

    // Show initial slide immediately
    slides[0].classList.add('entering');
    slides[0].classList.add('active');

    function goTo(next) {
        const prev = current;
        if (next === prev) return;

        // Exit current slide
        const currentSlide = slides[prev];
        currentSlide.classList.remove('entering');
        currentSlide.classList.add('exiting');
        setTimeout(() => {
            currentSlide.classList.remove('active', 'exiting');
        }, ANIM_OUT);

        // Enter next slide
        const nextSlide = slides[next];
        nextSlide.classList.add('active', 'entering');
        setTimeout(() => {
            nextSlide.classList.remove('entering');
        }, ANIM_IN);

        // Update dots
        dots[prev].classList.remove('active');
        dots[next].classList.add('active');

        current = next;
        startProgress();
    }

    function advance() {
        const next = (current + 1) % slides.length;
        goTo(next);
    }

    function retreat() {
        const next = (current - 1 + slides.length) % slides.length;
        goTo(next);
    }

    function startProgress() {
        clearTimeout(timer);
        timer = setTimeout(advance, SLIDE_DURATION);
    }

    // Dot click navigation
    dots.forEach((dot, i) => {
        dot.addEventListener('click', () => {
            clearTimeout(timer);
            goTo(i);
        });
    });

    // Pause on hover
    const slideshow = document.getElementById('aboutSlideshow');
    if (slideshow) {
        slideshow.addEventListener('mouseenter', () => { clearTimeout(timer); });
        slideshow.addEventListener('mouseleave', () => { startProgress(); });

        // 👆 Touch swipe support for mobile
        let touchStartX = 0;
        let touchStartY = 0;

        slideshow.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].clientX;
            touchStartY = e.changedTouches[0].clientY;
        }, { passive: true });

        slideshow.addEventListener('touchend', (e) => {
            const dx = e.changedTouches[0].clientX - touchStartX;
            const dy = e.changedTouches[0].clientY - touchStartY;

            // Only trigger if horizontal swipe is dominant and significant (> 50px)
            if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
                clearTimeout(timer);
                if (dx < 0) {
                    advance();   // swipe left → next slide
                } else {
                    retreat();   // swipe right → previous slide
                }
            }
        }, { passive: true });
    }

    // Kick off the first auto-advance
    startProgress();
});
