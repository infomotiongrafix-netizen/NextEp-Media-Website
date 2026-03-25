const langBtn = document.getElementById("lang-toggle");
let currentLang = localStorage.getItem('appLang') || "en";

function updateLanguage() {
  document.documentElement.setAttribute('data-lang', currentLang);
  if (langBtn) langBtn.textContent = currentLang.toUpperCase();
  localStorage.setItem('appLang', currentLang);

  document.querySelectorAll('input[data-en], textarea[data-en]').forEach(el => {
    const langAttr = 'data-' + currentLang;
    if (el.hasAttribute(langAttr)) el.placeholder = el.getAttribute(langAttr);
  });

  document.querySelectorAll('select option[data-en]').forEach(el => {
    const langAttr = 'data-' + currentLang;
    if (el.hasAttribute(langAttr)) el.textContent = el.getAttribute(langAttr);
  });

  const feedbackBox = document.querySelector('.form-feedback');
  if (feedbackBox) {
    const status = new URLSearchParams(window.location.search).get('status');
    const msg = {
      success: { en: "Message sent successfully!", es: "¡Mensaje enviado correctamente!" },
      error: { en: "Error sending message. Please try again.", es: "Error al enviar el mensaje. Intenta nuevamente." },
      incomplete: { en: "Please complete all required fields.", es: "Por favor completa todos los campos obligatorios." }
    };
    if (status && msg[status]) feedbackBox.textContent = msg[status][currentLang];
  }
}

window.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const status = params.get('status');
  const feedbackContainer = document.getElementById('form-feedback');

  if (status && feedbackContainer) {
    const typeClass = (status === "success") ? "success" : "error";
    feedbackContainer.innerHTML = `<div class="form-feedback ${typeClass}"></div>`;
  }

  updateLanguage();

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("show");
    });
  }, { threshold: 0.1 });

  document.querySelectorAll(".section, .service-card, .portfolio-item, .benefit-item, .collab-card, .partner-card").forEach(el => observer.observe(el));

  if (langBtn) {
    langBtn.addEventListener("click", () => {
      currentLang = currentLang === "en" ? "es" : "en";
      updateLanguage();
      const formLangInput = document.getElementById('form-lang');
      if (formLangInput) formLangInput.value = currentLang;
    });
  }

  const menuBtn = document.getElementById("menu-toggle");
  const navMenu = document.querySelector(".navbar ul");
  if (menuBtn && navMenu) {
    menuBtn.addEventListener("click", () => navMenu.classList.toggle("active"));
  }

  const sliderContainer = document.querySelector('.hero-slider');
  const slides = document.querySelectorAll('.slide');
  if (sliderContainer && slides.length > 0) {
    let currentSlide = 0, slideInterval, startX = 0;
    
    const showSlide = (n) => {
      slides.forEach(s => s.classList.remove('active'));
      currentSlide = (n + slides.length) % slides.length;
      slides[currentSlide].classList.add('active');
    };

    const nextSlide = () => showSlide(currentSlide + 1);
    const prevSlide = () => showSlide(currentSlide - 1);

    const startAutoPlay = () => {
      clearInterval(slideInterval);
      slideInterval = setInterval(nextSlide, 4000);
    };

    startAutoPlay();

    document.querySelector('.slider-arrow.next')?.addEventListener('click', () => { nextSlide(); startAutoPlay(); });
    document.querySelector('.slider-arrow.prev')?.addEventListener('click', () => { prevSlide(); startAutoPlay(); });

    sliderContainer.addEventListener('touchstart', e => startX = e.touches[0].clientX, {passive: true});
    sliderContainer.addEventListener('touchend', e => {
      let endX = e.changedTouches[0].clientX;
      if (startX - endX > 50) nextSlide();
      else if (endX - startX > 50) prevSlide();
      startAutoPlay();
    }, {passive: true});
  }

  const videoModal = document.getElementById("video-modal");
  const modalIframe = document.getElementById("modal-iframe");
  const closeModal = () => {
    if (modalIframe) modalIframe.src = "";
    videoModal?.classList.remove("active");
    document.body.style.overflow = "";
  };

  document.querySelectorAll(".portfolio-item").forEach(item => {
    item.addEventListener("click", () => {
      const videoId = item.getAttribute("data-video");
      if (videoId && videoModal && modalIframe) {
        modalIframe.src = `https://player.vimeo.com/video/${videoId}?autoplay=1&muted=0&controls=1`;
        videoModal.classList.add("active");
        document.body.style.overflow = "hidden";
      }
    });
  });

  document.getElementById("close-modal")?.addEventListener("click", closeModal);
  if (videoModal) {
    videoModal.addEventListener("click", (e) => { if (e.target === videoModal) closeModal(); });
  }

  const faqBtns = document.querySelectorAll('.faq-btn');
  const faqAnswers = document.querySelectorAll('.faq-answer-text');
  faqBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      faqBtns.forEach(b => b.classList.remove('active'));
      faqAnswers.forEach(a => a.classList.remove('active'));
      btn.classList.add('active');
      const targetId = btn.getAttribute('data-target');
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        targetEl.classList.add('active');
        if (window.innerWidth <= 992) {
          const displayArea = document.querySelector('.faq-display');
          const offset = displayArea.getBoundingClientRect().top + window.pageYOffset - 100;
          window.scrollTo({ top: offset, behavior: "smooth" });
        }
      }
    });
  });

  const backToTop = document.getElementById('backToTop');
  window.addEventListener('scroll', () => { backToTop?.classList.toggle('show', window.scrollY > 500); });
  backToTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  const ctaBtn = document.querySelector('.btn-large');
  if (ctaBtn) {
    ctaBtn.addEventListener('mousemove', e => {
      const rect = ctaBtn.getBoundingClientRect();
      ctaBtn.style.transform = `translate(${(e.clientX - rect.left - rect.width/2)*0.2}px, ${(e.clientY - rect.top - rect.height/2)*0.3}px)`;
    });
    ctaBtn.addEventListener('mouseleave', () => ctaBtn.style.transform = `translate(0,0)`);
  }
});