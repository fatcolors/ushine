/* ============================================
   USHINE — Interactions & Animations
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // --- Navbar scroll effect ---
    const navbar = document.getElementById('navbar');
    let lastScroll = 0;

    function handleNavScroll() {
        const scrollY = window.scrollY;
        navbar.classList.toggle('scrolled', scrollY > 20);
        lastScroll = scrollY;
    }

    window.addEventListener('scroll', handleNavScroll, { passive: true });
    handleNavScroll();

    // --- Mobile menu ---
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('open');
        document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    });

    // Close mobile menu on link click
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('open');
            document.body.style.overflow = '';
        });
    });

    // --- Intersection Observer: fade-up animations ---
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!prefersReducedMotion) {
        const animElements = document.querySelectorAll('.anim-fade-up');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -40px 0px'
        });

        animElements.forEach(el => observer.observe(el));
    } else {
        // Show all elements immediately
        document.querySelectorAll('.anim-fade-up').forEach(el => {
            el.classList.add('visible');
        });
    }

    // --- Animated counters ---
    const counters = document.querySelectorAll('[data-count]');

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => counterObserver.observe(counter));

    function animateCounter(el) {
        const target = parseInt(el.dataset.count, 10);
        const duration = 2000;
        const startTime = performance.now();

        function easeOutQuart(t) {
            return 1 - Math.pow(1 - t, 4);
        }

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easeOutQuart(progress);
            const current = Math.round(easedProgress * target);

            el.textContent = current;

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }

        requestAnimationFrame(update);
    }

    // --- Smooth scroll for anchor links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const targetId = anchor.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const offset = navbar.offsetHeight + 20;
                const top = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

    // --- Video lazy loading: only play when in viewport ---
    const videos = document.querySelectorAll('video');

    const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const video = entry.target;
            if (entry.isIntersecting) {
                if (video.paused) video.play().catch(() => {});
            } else {
                if (!video.paused) video.pause();
            }
        });
    }, { threshold: 0.1 });

    videos.forEach(video => {
        video.pause(); // Pause all initially
        videoObserver.observe(video);
    });

    // --- Parallax effect on quote section ---
    const quoteSection = document.querySelector('.quote-section');
    if (quoteSection && !prefersReducedMotion) {
        const quoteBg = quoteSection.querySelector('.quote-bg video');

        window.addEventListener('scroll', () => {
            const rect = quoteSection.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                const progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
                const translateY = (progress - 0.5) * 60;
                quoteBg.style.transform = `translateY(${translateY}px) scale(1.1)`;
            }
        }, { passive: true });
    }

    // --- About images: scroll-driven overlap ---
    const aboutStack = document.getElementById('aboutImageStack');
    if (aboutStack && !prefersReducedMotion) {
        const img1 = aboutStack.querySelector('.about-img-1');
        const img2 = aboutStack.querySelector('.about-img-2');

        function updateAboutParallax() {
            const rect = aboutStack.getBoundingClientRect();
            const viewH = window.innerHeight;

            if (rect.top < viewH && rect.bottom > 0) {
                // 0 = just entered bottom, 1 = about to leave top
                const progress = (viewH - rect.top) / (viewH + rect.height);
                // img1 moves up slowly, img2 moves up faster => they converge/overlap
                const img1Y = (0.5 - progress) * 40;   // starts +20, goes to -20
                const img2Y = (0.5 - progress) * -60;   // starts -30, goes to +30
                const img2X = (0.5 - progress) * 30;    // slight horizontal shift

                img1.style.transform = `translateY(${img1Y}px)`;
                img2.style.transform = `translate(${img2X}px, ${img2Y}px)`;
            }
        }

        window.addEventListener('scroll', updateAboutParallax, { passive: true });
        updateAboutParallax(); // run once on load
    }

    // --- Magnetic hover on CTA buttons ---
    if (!prefersReducedMotion) {
        document.querySelectorAll('.btn-primary, .btn-secondary, .btn-nav-cta, .btn-hero-primary, .btn-hero-secondary').forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
            });

            btn.addEventListener('mouseleave', () => {
                btn.style.transform = '';
            });
        });
    }

});
