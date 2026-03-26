 /* ─── Scroll: navbar + progress bar ─── */
    const navbar = document.getElementById('navbar');
    const progressBar = document.getElementById('progress-bar');

    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 40);
      const scrollTop = document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      progressBar.style.width = ((scrollTop / docHeight) * 100) + '%';
    });

    /* ─── Hamburger / mobile menu ─── */
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');
    const closeMenuBtn = document.getElementById('close-menu');

    hamburger.addEventListener('click', () => mobileMenu.classList.add('open'));
    closeMenuBtn.addEventListener('click', () => mobileMenu.classList.remove('open'));

    function closeMobileMenu() {
      mobileMenu.classList.remove('open');
    }

    /* ─── Fade-in on scroll (IntersectionObserver) ─── */
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const delay = entry.target.dataset.delay || 0;
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, delay);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    document.querySelectorAll('.why-grid .why-card, .services-grid .service-card, .projects-grid .project-card').forEach((el, i) => {
      el.dataset.delay = (i % 3) * 120;
    });

    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

    /* ─── Skill bars animate when visible ─── */
    const barObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const bars = entry.target.querySelectorAll('.skill-bar-fill');
          bars.forEach(bar => {
            setTimeout(() => {
              bar.style.width = bar.dataset.width + '%';
            }, 200);
          });
          barObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    document.querySelectorAll('.skill-group').forEach(g => barObserver.observe(g));

    /* ─── Typewriter effect for hero title ─── */
    const titles = [
      'IT Support Technician',
      'Helpdesk Specialist',
      'Computer Repair Expert',
      'Junior IT Technician',
    ];

    let titleIndex = 0;
    let charIndex = 0;
    let deleting = false;
    const typedEl = document.getElementById('typed-title');

    function typeLoop() {
      const current = titles[titleIndex];

      if (!deleting) {
        typedEl.textContent = current.slice(0, charIndex + 1);
        charIndex++;
        if (charIndex === current.length) {
          deleting = true;
          setTimeout(typeLoop, 2200);
          return;
        }
      } else {
        typedEl.textContent = current.slice(0, charIndex - 1);
        charIndex--;
        if (charIndex === 0) {
          deleting = false;
          titleIndex = (titleIndex + 1) % titles.length;
        }
      }

      setTimeout(typeLoop, deleting ? 55 : 85);
    }

    setTimeout(typeLoop, 1200);

    /* ─── Smooth scroll for anchor links ─── */
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', (e) => {
        const target = document.querySelector(link.getAttribute('href'));
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });

    /* ─── 3D Stacked Cards Carousel ─── */
    (function () {
      const cards = document.querySelectorAll('.carousel-card');
      const dots = document.querySelectorAll('.carousel-dot');
      const total = cards.length;

      // Order array: index in order = which card is at that position
      // order[0] = front card index, order[1] = second, etc.
      let order = [];
      for (let i = 0; i < total; i++) order.push(i);

      function updatePositions() {
        order.forEach((cardIndex, position) => {
          cards[cardIndex].setAttribute('data-pos', position);
        });

        // Update dots — the front card (order[0]) is active
        dots.forEach((dot, i) => {
          dot.classList.toggle('active', i === order[0]);
        });
      }

      function rotateForward() {
        // Move front card to the back
        const front = order.shift();
        order.push(front);
        updatePositions();
      }

      // Auto-rotate every 4 seconds
      let autoPlay = setInterval(rotateForward, 4000);

      // Click on a dot to jump to that card
      dots.forEach(dot => {
        dot.addEventListener('click', () => {
          clearInterval(autoPlay);
          const target = parseInt(dot.dataset.index);

          // Rotate until target is at front
          while (order[0] !== target) {
            const front = order.shift();
            order.push(front);
          }
          updatePositions();

          // Restart auto-play
          autoPlay = setInterval(rotateForward, 4000);
        });
      });

      // Click on front card to rotate manually
      cards.forEach(card => {
        card.addEventListener('click', () => {
          const pos = parseInt(card.getAttribute('data-pos'));
          if (pos === 0) {
            clearInterval(autoPlay);
            rotateForward();
            autoPlay = setInterval(rotateForward, 4000);
          }
        });
      });

      // Initial render
      updatePositions();
    })();