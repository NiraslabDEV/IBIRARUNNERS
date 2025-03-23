function initSimpleCarousel() {
  const carousels = document.querySelectorAll(".simple-carousel");

  carousels.forEach((carousel) => {
    const track = carousel.querySelector(".carousel-track");
    const slides = carousel.querySelectorAll(".carousel-slide");
    const indicators = carousel.querySelector(".carousel-indicators");
    const prevBtn = carousel.querySelector(".carousel-btn.prev");
    const nextBtn = carousel.querySelector(".carousel-btn.next");

    if (!track || slides.length === 0) return;

    let currentIndex = 0;
    const slideWidth = 100; // porcentagem
    let slidesPerView = window.innerWidth >= 768 ? 2 : 1;

    // Criar indicadores
    indicators.innerHTML = "";
    const maxIndex = Math.max(0, slides.length - slidesPerView);
    for (let i = 0; i <= maxIndex; i++) {
      const indicator = document.createElement("button");
      indicator.classList.add("w-3", "h-3", "rounded-full", "bg-gray-500");
      if (i === 0) indicator.classList.add("bg-white");

      indicator.addEventListener("click", () => {
        goToSlide(i);
      });

      indicators.appendChild(indicator);
    }

    // Atualizar indicadores
    function updateIndicators() {
      const allIndicators = indicators.querySelectorAll("button");
      allIndicators.forEach((ind, i) => {
        ind.classList.remove("bg-white");
        ind.classList.add("bg-gray-500");
        if (i === currentIndex) {
          ind.classList.remove("bg-gray-500");
          ind.classList.add("bg-white");
        }
      });
    }

    // Ir para slide específico
    function goToSlide(index) {
      currentIndex = Math.max(
        0,
        Math.min(index, slides.length - slidesPerView)
      );
      const offset = -currentIndex * (slideWidth / slidesPerView);
      track.style.transform = `translateX(${offset}%)`;
      updateIndicators();
    }

    // Event listeners
    nextBtn.addEventListener("click", () => {
      goToSlide(currentIndex + 1);
    });

    prevBtn.addEventListener("click", () => {
      goToSlide(currentIndex - 1);
    });

    // Ajustar ao redimensionar
    window.addEventListener("resize", () => {
      slidesPerView = window.innerWidth >= 768 ? 2 : 1;
      goToSlide(currentIndex);
    });

    // Inicializar
    goToSlide(0);
  });
}

// Inicializar o carrossel de últimas edições
document.addEventListener("DOMContentLoaded", function () {
  initSimpleCarousel();
});
