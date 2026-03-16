/* ============================================
   CUSTOMIZATION: Wedding date and calendar month
   can be adjusted in the calendar section below.
   ============================================ */

(function () {
    'use strict';

    // ============= DOM REFERENCES =============
    var preloader = document.getElementById('preloader');
    var envelopeWrapper = document.getElementById('envelope-wrapper');
    var envelope = document.getElementById('envelope');
    var mainContent = document.getElementById('main-content');
    var music = document.getElementById('music');
    var musicToggle = document.getElementById('music-toggle');
    var calendarEl = document.getElementById('calendar');
    var particlesContainer = document.getElementById('particles');

    var envelopeOpened = false;
    var musicPlaying = false;

    // ============= PRELOADER =============
    window.addEventListener('load', function () {
        setTimeout(function () {
            preloader.classList.add('hidden');
        }, 2200);
    });

    // ============= ENVELOPE OPEN =============
    envelope.addEventListener('click', function () {
        if (envelopeOpened) return;
        envelopeOpened = true;

        envelope.classList.add('opened');

        // Confetti burst
        createConfetti();

        setTimeout(function () {
            envelopeWrapper.classList.add('hidden');
            mainContent.classList.add('visible');
            document.body.style.background = 'var(--color-bg-primary)';
            initParticles();
            initScrollReveal();

            // Start music (user gesture satisfies autoplay policy)
            music.volume = 0.3;
            music.play().then(function () {
                musicPlaying = true;
                musicToggle.classList.add('music-toggle--visible');
                musicToggle.classList.remove('paused');
            }).catch(function () {
                musicToggle.classList.add('music-toggle--visible');
                musicToggle.classList.add('paused');
            });
        }, 1800);
    });

    // ============= CONFETTI =============
    function createConfetti() {
        var colors = ['#b8935a', '#d4b87a', '#e8d5a3', '#f0ebe4', '#fff'];
        for (var i = 0; i < 60; i++) {
            var piece = document.createElement('div');
            piece.className = 'confetti-piece';
            piece.style.left = Math.random() * 100 + '%';
            piece.style.background = colors[Math.floor(Math.random() * colors.length)];
            piece.style.width = (Math.random() * 8 + 5) + 'px';
            piece.style.height = (Math.random() * 8 + 5) + 'px';
            piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
            piece.style.animationDuration = (Math.random() * 2 + 2) + 's';
            piece.style.animationDelay = (Math.random() * 0.5) + 's';
            document.body.appendChild(piece);
            (function (el) {
                setTimeout(function () { el.remove(); }, 4000);
            })(piece);
        }
    }

    // ============= PARTICLES =============
    function initParticles() {
        for (var i = 0; i < 25; i++) {
            var p = document.createElement('div');
            p.className = 'particle';
            p.style.left = Math.random() * 100 + '%';
            p.style.animationDelay = Math.random() * 6 + 's';
            p.style.animationDuration = (Math.random() * 4 + 4) + 's';
            var size = (Math.random() * 3 + 2) + 'px';
            p.style.width = size;
            p.style.height = size;
            particlesContainer.appendChild(p);
        }
    }

    // ============= MUSIC TOGGLE =============
    musicToggle.addEventListener('click', function () {
        if (music.paused) {
            music.volume = 0.3;
            music.play().then(function () {
                musicPlaying = true;
                musicToggle.classList.remove('paused');
            }).catch(function () {});
        } else {
            music.pause();
            musicPlaying = false;
            musicToggle.classList.add('paused');
        }
    });

    // ============= SCROLL REVEAL =============
    function initScrollReveal() {
        var revealEls = document.querySelectorAll('.reveal');

        if ('IntersectionObserver' in window) {
            var observer = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        var delay = parseInt(entry.target.dataset.delay, 10) || 0;
                        setTimeout(function () {
                            entry.target.classList.add('visible');
                        }, delay);
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                rootMargin: '0px 0px -10% 0px',
                threshold: 0.1
            });

            revealEls.forEach(function (el) {
                observer.observe(el);
            });
        } else {
            revealEls.forEach(function (el) {
                el.classList.add('visible');
            });
        }
    }

    // ============= CALENDAR GENERATION =============
    // CUSTOMIZATION: Change year/month/highlightDay for a different date
    var year = 2026;
    var month = 2; // 0-indexed: 2 = March
    var highlightDay = 23;

    // Armenian day abbreviations (Mon-start)

    var dayNames = [
        'Երկ', // Mon
        'Երք', // Tue
        'Չոր', // Wed
        'Հին', // Thu
        'Ուր', // Fri
        'Շաբ', // Sat
        'Կիր'  // Sun
    ];


    // Build calendar grid
    var gridHTML = '<div class="calendar__grid">';

    // Header row
    dayNames.forEach(function (d) {
        gridHTML += '<div class="calendar__header">' + d + '</div>';
    });

    // First day of month (JS: 0=Sun, convert to Mon-start)
    var firstDay = new Date(year, month, 1).getDay();
    var startOffset = (firstDay + 6) % 7;

    // Days in month
    var daysInMonth = new Date(year, month + 1, 0).getDate();

    // Empty cells before day 1
    for (var i = 0; i < startOffset; i++) {
        gridHTML += '<div class="calendar__day calendar__day--empty"></div>';
    }

    // Day cells
    for (var d = 1; d <= daysInMonth; d++) {
        var classes = 'calendar__day';
        if (d === highlightDay) {
            classes += ' calendar__day--highlight';
        }
        gridHTML += '<div class="' + classes + '">' + d + '</div>';
    }

    gridHTML += '</div>';
    calendarEl.innerHTML = gridHTML;
})();
