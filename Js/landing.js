// Navbar scroll
    window.addEventListener('scroll', () => {
      document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 30);
    });

    // Modal portal
    function abrirPortal() {
      document.getElementById('modalPortal').classList.add('open');
    }

    function cerrarPortal() {
      document.getElementById('modalPortal').classList.remove('open');
    }

    document.getElementById('modalPortal').addEventListener('click', e => {
      if (e.target === document.getElementById('modalPortal')) cerrarPortal();
    });

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') cerrarPortal();
    });

    // Reveal al hacer scroll
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
      });
    }, { threshold: 0.08 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));