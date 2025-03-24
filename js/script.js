// Adicionar efeito de glitch aos elementos com a classe glitch-text
document.addEventListener("DOMContentLoaded", function () {
  // Configurar efeito de glitch
  const glitchTexts = document.querySelectorAll(".glitch-text");
  glitchTexts.forEach(function (element) {
    element.setAttribute("data-text", element.textContent);
  });

  // Menu móvel
  const menuToggle = document.getElementById("menu-toggle");
  const mobileMenu = document.getElementById("mobile-menu");
  const menuOverlay = document.getElementById("menu-overlay");

  if (menuToggle && mobileMenu && menuOverlay) {
    menuToggle.addEventListener("click", function () {
      mobileMenu.classList.toggle("hidden");
      if (!mobileMenu.classList.contains("hidden")) {
        menuOverlay.classList.remove("hidden");
      } else {
        menuOverlay.classList.add("hidden");
      }
    });

    // Fechar menu ao clicar fora
    menuOverlay.addEventListener("click", function () {
      mobileMenu.classList.add("hidden");
      menuOverlay.classList.add("hidden");
    });

    // Fechar menu ao clicar em um link do menu
    const menuLinks = mobileMenu.querySelectorAll("a");
    menuLinks.forEach(function (link) {
      link.addEventListener("click", function () {
        mobileMenu.classList.add("hidden");
        menuOverlay.classList.add("hidden");
      });
    });
  }

  // Inicializar o efeito de partículas 3D
  initParticlesEffect();

  // Inicializar efeito de movimento paralaxe na HOME
  initParallaxEffect();

  // Inicializar o carrossel simples
  initSimpleCarousel();

  // Inicializar o formulário stepper
  initStepperForm();
});

// Efeito de partículas 3D para a HOME
function initParticlesEffect() {
  const particlesContainer = document.getElementById("particles-bg");
  if (!particlesContainer || !window.THREE) return;

  let scene, camera, renderer;
  let particles, particleSystem;
  let mouseX = 0,
    mouseY = 0;
  const windowHalfX = window.innerWidth / 2;
  const windowHalfY = window.innerHeight / 2;

  // Inicializar cena 3D
  function init() {
    // Criar cena
    scene = new THREE.Scene();

    // Configurar câmera
    camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      1,
      10000
    );
    camera.position.z = 1000;

    // Criar partículas
    const geometry = new THREE.BufferGeometry();
    const verticesArray = [];
    const colorsArray = [];

    // Definir cores para as partículas (tons neon roxo e azul)
    const colorPalette = [
      new THREE.Color(0x9900ff), // Roxo neon
      new THREE.Color(0x7928ca), // Roxo escuro
      new THREE.Color(0xb347ff), // Roxo claro
      new THREE.Color(0x330066), // Roxo muito escuro
      new THREE.Color(0x00b4d8), // Azul ciano
      new THREE.Color(0xffffff), // Branco (para alguns destaques)
    ];

    // Criar 2000 partículas aleatórias
    for (let i = 0; i < 2000; i++) {
      // Posição aleatória em formato de esfera
      const radius = Math.random() * 1000 + 200;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi) - 500; // Afastar levemente da câmera

      verticesArray.push(x, y, z);

      // Cor aleatória da paleta
      const color =
        colorPalette[Math.floor(Math.random() * colorPalette.length)];
      colorsArray.push(color.r, color.g, color.b);
    }

    // Adicionar os vértices à geometria
    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(verticesArray, 3)
    );
    geometry.setAttribute(
      "color",
      new THREE.Float32BufferAttribute(colorsArray, 3)
    );

    // Material para as partículas
    const material = new THREE.PointsMaterial({
      size: 3,
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
    });

    // Criar o sistema de partículas
    particleSystem = new THREE.Points(geometry, material);
    scene.add(particleSystem);

    // Configurar o renderer
    renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);

    // Adicionar o canvas ao container
    particlesContainer.appendChild(renderer.domElement);

    // Adicionar eventos para movimento do mouse
    document.addEventListener("mousemove", onDocumentMouseMove, false);
    window.addEventListener("resize", onWindowResize, false);
  }

  // Ajustar quando a janela for redimensionada
  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  // Capturar movimento do mouse
  function onDocumentMouseMove(event) {
    mouseX = (event.clientX - windowHalfX) * 0.05;
    mouseY = (event.clientY - windowHalfY) * 0.05;
  }

  // Função de animação
  function animate() {
    requestAnimationFrame(animate);

    // Rotacionar o sistema de partículas suavemente
    particleSystem.rotation.x += 0.0005;
    particleSystem.rotation.y += 0.0005;

    // Movimento baseado no mouse
    camera.position.x += (mouseX - camera.position.x) * 0.05;
    camera.position.y += (-mouseY - camera.position.y) * 0.05;
    camera.lookAt(scene.position);

    // Renderizar a cena
    renderer.render(scene, camera);
  }

  // Iniciar o efeito
  init();
  animate();
}

// Efeito de paralaxe para elementos na HOME
function initParallaxEffect() {
  const homeSection = document.getElementById("home");
  if (!homeSection) return;

  const title = homeSection.querySelector(".motion-text");
  const subtitle = homeSection.querySelector(".parallax-text");

  // Adicionar evento de movimento do mouse para o efeito de paralaxe
  homeSection.addEventListener("mousemove", (e) => {
    // Valores maiores aqui reduzem a intensidade do movimento (de 25 para 80)
    const x = (window.innerWidth / 2 - e.clientX) / 80;
    const y = (window.innerHeight / 2 - e.clientY) / 80;

    // Aplicar transformação 3D conforme o movimento do mouse (com movimento reduzido)
    if (title) {
      title.style.transform = `translate3d(${x}px, ${y}px, 10px) rotateX(${
        y / 30
      }deg) rotateY(${-x / 30}deg)`;
    }

    if (subtitle) {
      subtitle.style.transform = `translate3d(${x * 0.5}px, ${y * 0.5}px, 5px)`;
    }
  });

  // Resetar transformações quando o mouse sair da área
  homeSection.addEventListener("mouseleave", () => {
    if (title) {
      title.style.transform = "";
    }

    if (subtitle) {
      subtitle.style.transform = "";
    }
  });
}

// Carrossel Simples
function initSimpleCarousel() {
  const carousel = document.querySelector(".simple-carousel");
  if (!carousel) return;

  const carouselTrack = carousel.querySelector(".carousel-track");
  const prevButton = carousel.querySelector(".carousel-btn.prev");
  const nextButton = carousel.querySelector(".carousel-btn.next");
  const indicators = carousel.querySelector(".carousel-indicators");

  // Imagens para o carrossel (Últimas edições do Corujão)
  const slides = [
    {
      src: "https://placehold.co/1200x600/111111/CCCCCC?text=Corujão+Janeiro+2025",
      alt: "Corujão Janeiro 2025",
      caption: "Corujão Especial de Janeiro 2025 - 180 participantes",
    },
    {
      src: "https://placehold.co/1200x600/111111/CCCCCC?text=Corujão+Dezembro+2024",
      alt: "Corujão Dezembro 2024",
      caption: "Corujão de Natal 2024 - Edição especial com café da manhã",
    },
    {
      src: "https://placehold.co/1200x600/111111/CCCCCC?text=Corujão+Novembro+2024",
      alt: "Corujão Novembro 2024",
      caption: "Corujão de Novembro 2024 - Percurso estendido de 12km",
    },
    {
      src: "https://placehold.co/1200x600/111111/CCCCCC?text=Corujão+Outubro+2024",
      alt: "Corujão Outubro 2024",
      caption: "Corujão Especial Outubro Rosa 2024",
    },
  ];

  // Criar slides
  slides.forEach((slide, index) => {
    // Criar slide
    const slideElement = document.createElement("div");
    slideElement.classList.add("carousel-slide");

    // Adicionar imagem
    const img = document.createElement("img");
    img.src = slide.src;
    img.alt = slide.alt;
    slideElement.appendChild(img);

    // Adicionar legenda
    const caption = document.createElement("div");
    caption.classList.add("carousel-caption");
    caption.textContent = slide.caption;
    slideElement.appendChild(caption);

    // Adicionar slide ao carrossel
    carouselTrack.appendChild(slideElement);

    // Criar indicador
    const indicator = document.createElement("div");
    indicator.classList.add("carousel-indicator");
    if (index === 0) {
      indicator.classList.add("active");
    }

    // Adicionar evento de clique ao indicador
    indicator.addEventListener("click", () => {
      goToSlide(index);
    });

    indicators.appendChild(indicator);
  });

  let currentSlide = 0;
  const slideWidth = 100; // Em porcentagem
  const totalSlides = slides.length;

  // Função para ir para um slide específico
  function goToSlide(slideIndex) {
    if (slideIndex < 0) {
      slideIndex = totalSlides - 1;
    } else if (slideIndex >= totalSlides) {
      slideIndex = 0;
    }

    currentSlide = slideIndex;
    carouselTrack.style.transform = `translateX(-${slideIndex * slideWidth}%)`;

    // Atualizar indicadores
    const allIndicators = indicators.querySelectorAll(".carousel-indicator");
    allIndicators.forEach((indicator, index) => {
      if (index === currentSlide) {
        indicator.classList.add("active");
      } else {
        indicator.classList.remove("active");
      }
    });
  }

  // Adicionar eventos aos botões
  prevButton.addEventListener("click", () => {
    goToSlide(currentSlide - 1);
  });

  nextButton.addEventListener("click", () => {
    goToSlide(currentSlide + 1);
  });

  // Autoplay
  let autoplay = setInterval(() => {
    goToSlide(currentSlide + 1);
  }, 5000);

  // Pausar autoplay ao passar o mouse sobre o carrossel
  carousel.addEventListener("mouseenter", () => {
    clearInterval(autoplay);
  });

  // Retomar autoplay quando o mouse sair do carrossel
  carousel.addEventListener("mouseleave", () => {
    autoplay = setInterval(() => {
      goToSlide(currentSlide + 1);
    }, 5000);
  });

  // Inicializar o primeiro slide
  goToSlide(0);
}

// Formulário Stepper
function initStepperForm() {
  const stepperForm = document.getElementById("stepper-form");
  if (!stepperForm) return;

  // Limpar o conteúdo atual do formulário
  stepperForm.innerHTML = "";

  // Definir etapas do formulário
  const steps = [
    {
      title: "Informações do Programa",
      content: `
        <div class="form-group">
            <div class="program-info">
                <p><strong>Dias:</strong> Segunda, quarta e sexta</p>
                <p><strong>Horário:</strong> Das 6h às 8h no Ibira</p>
                <p><strong>Local:</strong> Ponto de hidratação próximo ao Madureira | portão 8 (av Republica do Líbano)</p>
                <p><strong>Mensalidade:</strong> R$ <span class="neon-value">250</span>,00</p>
            </div>
            <div class="form-group">
                <div class="checkbox-wrapper" id="termos-wrapper">
                    <label for="ciente1">
                        <input type="checkbox" id="ciente1" name="ciente1" class="mr-2" required>
                        <span>Estou ciente das informações acima</span>
                    </label>
                </div>
            </div>
        </div>
      `,
    },
    {
      title: "Dados Pessoais",
      content: `
        <div class="form-group">
            <label for="nome" class="form-label">Nome Completo</label>
            <input type="text" id="nome" name="nome" class="form-control" required>
        </div>
        <div class="form-group">
            <label for="telefone" class="form-label">Telefone Celular</label>
            <input type="tel" id="telefone" name="telefone" class="form-control" required>
        </div>
        <div class="form-group">
            <label for="email" class="form-label">E-mail</label>
            <input type="email" id="email" name="email" class="form-control" required>
        </div>
        <div class="form-group">
            <label for="idade" class="form-label">Idade</label>
            <input type="number" id="idade" name="idade" class="form-control" required min="16" max="100">
        </div>
      `,
    },
    {
      title: "Experiência",
      content: `
        <div class="form-group">
            <label class="form-label">Qual o seu motivo para correr?</label>
            <textarea name="motivo" class="form-control" rows="3" required></textarea>
        </div>
        <div class="form-group">
            <label class="form-label">Qual foi a maior distância que você já correu?</label>
            <div class="radio-group">
                <div class="radio-item">
                    <input type="radio" id="iniciante" name="distancia" value="Iniciante" required>
                    <label for="iniciante">Iniciante</label>
                </div>
                <div class="radio-item">
                    <input type="radio" id="10km" name="distancia" value="10km">
                    <label for="10km">10km</label>
                </div>
                <div class="radio-item">
                    <input type="radio" id="21km" name="distancia" value="21km">
                    <label for="21km">21km</label>
                </div>
                <div class="radio-item">
                    <input type="radio" id="42km" name="distancia" value="42km">
                    <label for="42km">42km</label>
                </div>
            </div>
        </div>
      `,
    },
    {
      title: "Emergência",
      content: `
        <div class="form-group">
            <label for="emergencia" class="form-label">Nome e Telefone de contato de alguma pessoa próxima, para que possamos entrar em contato em situação de emergência</label>
            <input type="text" id="emergencia" name="emergencia" class="form-control" required>
        </div>
        <div class="form-group">
            <div class="checkbox-wrapper" id="termos-wrapper-2">
                <label for="ciente2">
                    <input type="checkbox" id="ciente2" name="ciente2" class="mr-2" required>
                    <span>Iremos entrar em contato pelo WhatsApp. Estou ciente.</span>
                </label>
            </div>
        </div>
      `,
    },
  ];

  // Criar o cabeçalho do stepper
  const stepperHeader = document.createElement("div");
  stepperHeader.classList.add("stepper-header");

  // Barra de progresso
  const stepProgress = document.createElement("div");
  stepProgress.classList.add("step-progress");
  const progressBar = document.createElement("div");
  progressBar.classList.add("progress-bar");
  stepProgress.appendChild(progressBar);
  stepperHeader.appendChild(stepProgress);

  // Criar indicadores de etapa
  steps.forEach((step, index) => {
    const stepIndicator = document.createElement("div");
    stepIndicator.classList.add("step-indicator");

    const stepBullet = document.createElement("div");
    stepBullet.classList.add("step-bullet");
    stepBullet.textContent = index + 1;

    const stepLabel = document.createElement("div");
    stepLabel.classList.add("step-label");
    stepLabel.textContent = step.title;

    // Adicionar classes para a primeira etapa
    if (index === 0) {
      stepBullet.classList.add("active");
      stepLabel.classList.add("active");
    }

    stepIndicator.appendChild(stepBullet);
    stepIndicator.appendChild(stepLabel);
    stepperHeader.appendChild(stepIndicator);
  });

  stepperForm.appendChild(stepperHeader);

  // Criar o conteúdo das etapas
  steps.forEach((step, i) => {
    const stepContent = document.createElement("div");
    stepContent.classList.add("step-content");
    stepContent.innerHTML = step.content;

    if (i === 0) {
      stepContent.classList.add("active");
    }

    stepperForm.appendChild(stepContent);
  });

  // Adicionar os botões de navegação
  const stepButtons = document.createElement("div");
  stepButtons.classList.add("step-buttons");

  const prevButton = document.createElement("button");
  prevButton.type = "button";
  prevButton.classList.add("btn-step", "btn-prev");
  prevButton.textContent = "Anterior";
  prevButton.disabled = true;

  const nextButton = document.createElement("button");
  nextButton.type = "button";
  nextButton.classList.add("btn-step", "btn-next");
  nextButton.textContent = "Próximo";

  stepButtons.appendChild(prevButton);
  stepButtons.appendChild(nextButton);
  stepperForm.appendChild(stepButtons);

  // Controlar a navegação entre etapas
  let currentStep = 0;

  // Atualizar o progresso
  function updateProgress(step) {
    const progress = (step / (steps.length - 1)) * 100;
    progressBar.style.width = `${progress}%`;
  }

  // Função para ir para a próxima etapa
  function nextStep() {
    // Validar a etapa atual antes de prosseguir
    const currentContent =
      document.querySelectorAll(".step-content")[currentStep];
    const requiredFields = currentContent.querySelectorAll("[required]");
    let isValid = true;

    requiredFields.forEach((field) => {
      if (!field.checkValidity()) {
        isValid = false;
        field.classList.add("invalid");
      } else {
        field.classList.remove("invalid");
      }
    });

    if (!isValid) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    // Marcar etapa atual como concluída
    const bullets = document.querySelectorAll(".step-bullet");
    const labels = document.querySelectorAll(".step-label");

    bullets[currentStep].classList.remove("active");
    bullets[currentStep].classList.add("completed");
    labels[currentStep].classList.remove("active");
    labels[currentStep].classList.add("completed");

    // Avançar para a próxima etapa
    const contents = document.querySelectorAll(".step-content");
    contents[currentStep].classList.remove("active");

    currentStep++;

    // Atualizar botões
    prevButton.disabled = false;

    if (currentStep === steps.length - 1) {
      nextButton.textContent = "Enviar";
      nextButton.classList.add("btn-submit");
    }

    // Atualizar etapa atual
    bullets[currentStep].classList.add("active");
    labels[currentStep].classList.add("active");
    contents[currentStep].classList.add("active");

    // Atualizar barra de progresso
    updateProgress(currentStep);
  }

  // Função para voltar para a etapa anterior
  function prevStep() {
    // Atualizar etapa atual
    const bullets = document.querySelectorAll(".step-bullet");
    const labels = document.querySelectorAll(".step-label");
    const contents = document.querySelectorAll(".step-content");

    bullets[currentStep].classList.remove("active");
    labels[currentStep].classList.remove("active");
    contents[currentStep].classList.remove("active");

    currentStep--;

    // Atualizar botões
    if (currentStep === 0) {
      prevButton.disabled = true;
    }

    if (currentStep < steps.length - 1) {
      nextButton.textContent = "Próximo";
      nextButton.classList.remove("btn-submit");
    }

    // Atualizar etapa atual
    bullets[currentStep].classList.add("active");
    bullets[currentStep].classList.remove("completed");
    labels[currentStep].classList.add("active");
    labels[currentStep].classList.remove("completed");
    contents[currentStep].classList.add("active");

    // Atualizar barra de progresso
    updateProgress(currentStep);
  }

  // Função para enviar o formulário
  function submitForm() {
    // Validar a última etapa
    const currentContent =
      document.querySelectorAll(".step-content")[currentStep];
    const requiredFields = currentContent.querySelectorAll("[required]");
    let isValid = true;

    requiredFields.forEach((field) => {
      if (!field.checkValidity()) {
        isValid = false;
        field.classList.add("invalid");
      } else {
        field.classList.remove("invalid");
      }
    });

    if (!isValid) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    // Exibir mensagem de confirmação
    stepperForm.innerHTML = `
      <div class="text-center py-8">
        <i class="fas fa-check-circle text-6xl mb-4" style="color: var(--silver);"></i>
        <h3 class="text-2xl font-bold mb-4 metallic-text">Cadastro Realizado!</h3>
        <p class="mb-4">Obrigado por se cadastrar como membro do Ibira Runners.</p>
        <p class="mb-6">Entraremos em contato pelo WhatsApp em breve.</p>
        <a href="#home" class="gooey-btn">Voltar para o Início</a>
      </div>
    `;
  }

  // Eventos de clique para os botões
  nextButton.addEventListener("click", function () {
    if (currentStep === steps.length - 1) {
      submitForm();
    } else {
      nextStep();
    }
  });

  prevButton.addEventListener("click", prevStep);

  // Adicionar evento para clicar no texto e ativar a checkbox
  setTimeout(() => {
    const termosWrappers = document.querySelectorAll(".checkbox-wrapper");
    if (termosWrappers.length > 0) {
      termosWrappers.forEach((wrapper) => {
        wrapper.addEventListener("click", function (e) {
          // Não aciona quando clica diretamente na checkbox (ela já tem seu próprio comportamento)
          if (e.target.type !== "checkbox") {
            const checkbox = this.querySelector('input[type="checkbox"]');
            checkbox.checked = !checkbox.checked;
          }
        });
      });
    }
  }, 100);
}

// Efeito de parallax no scroll
window.addEventListener("scroll", function () {
  const scrollY = window.scrollY;

  // Adicionar efeito parallax aos elementos com a classe .parallax
  document.querySelectorAll(".parallax").forEach(function (element) {
    const speed = element.getAttribute("data-speed") || 0.5;
    element.style.transform = `translateY(${scrollY * speed}px)`;
  });

  // Adicionar animações de aparecer ao rolar
  const fadeElements = document.querySelectorAll(".fade-in-element");
  fadeElements.forEach(function (element) {
    const elementTop = element.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;

    if (elementTop < windowHeight * 0.8) {
      element.classList.add("visible");
    }
  });
});
