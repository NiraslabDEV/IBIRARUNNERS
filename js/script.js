// Adicionar efeito de glitch aos elementos com a classe glitch-text
document.addEventListener("DOMContentLoaded", function () {
  // Configurar efeito de glitch
  const glitchTexts = document.querySelectorAll(".glitch-text");
  glitchTexts.forEach(function (element) {
    element.setAttribute("data-text", element.textContent);
  });

  // Menu mobile - Implementação completamente nova e simplificada
  const menuToggle = document.getElementById("menu-toggle");
  const mobileMenu = document.getElementById("mobile-menu");
  const menuOverlay = document.getElementById("menu-overlay");
  const menuClose = document.getElementById("menu-close");
  const menuLinks = mobileMenu ? mobileMenu.querySelectorAll("a") : [];

  // Função para abrir o menu
  function openMenu() {
    if (menuOverlay) menuOverlay.style.display = "block";
    if (mobileMenu) mobileMenu.style.right = "0"; // Mover para dentro da tela
    document.body.style.overflow = "hidden"; // Impedir rolagem
  }

  // Função para fechar o menu
  function closeMenu() {
    if (menuOverlay) menuOverlay.style.display = "none";
    if (mobileMenu) mobileMenu.style.right = "-300px"; // Mover para fora da tela
    document.body.style.overflow = ""; // Restaurar rolagem
  }

  // Adicionar evento de clique ao botão de abrir menu
  if (menuToggle) {
    menuToggle.addEventListener("click", function (e) {
      e.preventDefault();
      openMenu();
    });
  }

  // Adicionar evento de clique ao botão de fechar
  if (menuClose) {
    menuClose.addEventListener("click", function (e) {
      e.preventDefault();
      closeMenu();
    });
  }

  // Fechar ao clicar no overlay
  if (menuOverlay) {
    menuOverlay.addEventListener("click", closeMenu);
  }

  // Fechar ao clicar em links do menu
  menuLinks.forEach(function (link) {
    link.addEventListener("click", closeMenu);
  });

  // Inicializar o efeito de partículas 3D
  initParticlesEffect();

  // Inicializar efeito de movimento paralaxe na HOME
  initParallaxEffect();

  // Inicializar o carrossel simples
  initSimpleCarousel();

  // Inicializar o formulário stepper
  initStepperForm();

  // Inicializar o carrossel de depoimentos
  initDepoimentosCarrossel();
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

  // Limpar conteúdo existente
  if (carouselTrack) carouselTrack.innerHTML = "";
  if (indicators) indicators.innerHTML = "";

  // Imagens para o carrossel - Usando imagens reais do Corujão
  const slides = [
    {
      src: "./assets/corujao/corujão dia das mulheres.png",
      alt: "Corujão Especial Dia das Mulheres",
      caption: "Corujão Especial - Dia das Mulheres",
    },
    {
      src: "./assets/corujao/corujão n010.png",
      alt: "Corujão N010",
      caption: "Corujão N010",
    },
    {
      src: "./assets/corujao/corujão n010 - liberdade 10km.png",
      alt: "Corujão N010 - Liberdade 10km",
      caption: "Corujão N010 - Corrida da Liberdade 10km",
    },
    {
      src: "./assets/corujao/CORUJÃO N009.png",
      alt: "Corujão N009",
      caption: "Corujão N009",
    },
    {
      src: "./assets/corujao/PELOTE IBIRA RUNNERS.png",
      alt: "Pelote Ibira Runners",
      caption: "Pelote Especial Ibira Runners",
    },
  ];

  // Criar slides
  slides.forEach((slide, index) => {
    // Criar slide
    const slideElement = document.createElement("div");
    slideElement.classList.add("carousel-slide");

    // Wrapper para melhor controle da imagem
    const imgWrapper = document.createElement("div");
    imgWrapper.classList.add("img-wrapper");
    imgWrapper.style.display = "flex";
    imgWrapper.style.justifyContent = "center";
    imgWrapper.style.alignItems = "center";

    // Adicionar imagem
    const img = document.createElement("img");
    img.src = slide.src;
    img.alt = slide.alt;
    img.style.maxHeight = "100%";
    img.style.maxWidth = "100%";
    img.loading = "lazy"; // Lazy loading para melhor performance

    // Pré-carregar imagem para melhor qualidade
    img.onload = function () {
      this.classList.add("loaded");
    };

    imgWrapper.appendChild(img);
    slideElement.appendChild(imgWrapper);

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

  // Adicionar eventos de teclado para acessibilidade
  carousel.setAttribute("tabindex", "0");
  carousel.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") {
      goToSlide(currentSlide - 1);
    } else if (e.key === "ArrowRight") {
      goToSlide(currentSlide + 1);
    }
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

    // Coletar todos os dados do formulário
    const formData = {
      nome: document.querySelector("#nome")?.value || "",
      telefone: document.querySelector("#telefone")?.value || "",
      email: document.querySelector("#email")?.value || "",
      idade: document.querySelector("#idade")?.value || "",
      motivo: document.querySelector("textarea[name='motivo']")?.value || "",
      distancia:
        document.querySelector("input[name='distancia']:checked")?.value || "",
      emergencia: document.querySelector("#emergencia")?.value || "",
      dataInscricao: new Date().toLocaleString("pt-BR"),
    };

    // Salvar no localStorage como backup
    localStorage.setItem("ultimaInscricao", JSON.stringify(formData));

    // Criar um popup de agradecimento mais atraente
    const popupHTML = `
      <div class="thank-you-popup">
        <div class="thank-you-content">
          <div class="success-animation">
            <svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
              <circle class="checkmark-circle" cx="26" cy="26" r="25" fill="none"/>
              <path class="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
            </svg>
          </div>
          
          <h2 class="glitch-text thank-you-title" data-text="CADASTRO CONCLUÍDO!">CADASTRO CONCLUÍDO!</h2>
          
          <div class="thank-you-message">
            <p class="metallic-text message-highlight">Bem-vindo(a) à comunidade Ibira Runners!</p>
            <p>Seus dados foram enviados com sucesso. Entraremos em contato pelo WhatsApp em breve para confirmar sua inscrição.</p>
            
            <div class="member-benefits">
              <h3>Próximos passos:</h3>
              <ul>
                <li><i class="fas fa-check"></i> Aguarde nosso contato em até 48h</li>
                <li><i class="fas fa-check"></i> Siga-nos no Instagram para ficar por dentro dos eventos</li>
                <li><i class="fas fa-check"></i> Entre no grupo do WhatsApp da comunidade</li>
              </ul>
            </div>
            
            <div class="share-container">
              <p>Compartilhe nas redes:</p>
              <div class="social-share-buttons">
                <a href="https://www.instagram.com/ibira.runners/" target="_blank" class="social-btn instagram-btn">
                  <i class="fab fa-instagram"></i>
                </a>
                <a href="https://wa.me/?text=Acabei%20de%20me%20inscrever%20no%20Ibira%20Runners!%20https://ibirarunners.com.br" target="_blank" class="social-btn whatsapp-btn">
                  <i class="fab fa-whatsapp"></i>
                </a>
                <a href="https://t.me/share/url?url=https://ibirarunners.com.br&text=Acabei%20de%20me%20inscrever%20no%20Ibira%20Runners!" target="_blank" class="social-btn telegram-btn">
                  <i class="fab fa-telegram"></i>
                </a>
              </div>
            </div>
            
            <div class="button-container">
              <a href="#home" class="gooey-btn">Voltar para o Início</a>
              <a href="#marketplace" class="gooey-btn btn-secondary">Confira Nossos Produtos</a>
            </div>
          </div>
        </div>
      </div>
      
      <style>
        .thank-you-popup {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          background-color: rgba(0, 0, 0, 0.85);
          animation: fadeIn 0.5s ease;
          backdrop-filter: blur(8px);
        }
        
        .thank-you-content {
          background: linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%);
          border-radius: 15px;
          padding: 2.5rem;
          max-width: 600px;
          width: 90%;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5), 
                      0 0 30px rgba(138, 43, 226, 0.3);
          border: 1px solid rgba(138, 43, 226, 0.3);
          transform: translateY(30px);
          animation: slideUp 0.6s ease forwards 0.3s;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        
        .thank-you-content::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(
            to bottom right, 
            transparent, 
            transparent, 
            transparent, 
            rgba(138, 43, 226, 0.1), 
            transparent, 
            transparent, 
            transparent
          );
          transform: rotate(30deg);
          animation: shine 3s infinite;
        }
        
        .thank-you-title {
          margin-bottom: 1.5rem;
          color: #fff;
          font-family: 'Orbitron', sans-serif;
          font-size: 2rem;
          font-weight: 700;
          text-transform: uppercase;
          animation: pulse 2s infinite;
        }
        
        .thank-you-message {
          color: #e0e0e0;
          margin-bottom: 1.5rem;
          font-size: 1rem;
          line-height: 1.6;
        }
        
        .message-highlight {
          font-size: 1.2rem;
          margin-bottom: 1rem;
          color: #fff;
          font-weight: 600;
        }
        
        .member-benefits {
          background-color: rgba(138, 43, 226, 0.1);
          border-radius: 10px;
          padding: 1.25rem;
          margin: 1.5rem 0;
          text-align: left;
        }
        
        .member-benefits h3 {
          margin-bottom: 0.75rem;
          color: #b388ff;
          font-weight: 600;
        }
        
        .member-benefits ul {
          list-style: none;
          padding: 0;
        }
        
        .member-benefits li {
          margin-bottom: 0.5rem;
          display: flex;
          align-items: center;
        }
        
        .member-benefits li i {
          color: #b388ff;
          margin-right: 0.5rem;
        }
        
        .share-container {
          margin: 1.5rem 0;
        }
        
        .social-share-buttons {
          display: flex;
          justify-content: center;
          gap: 1rem;
          margin-top: 0.75rem;
        }
        
        .social-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          font-size: 1.25rem;
          transition: all 0.3s ease;
          background: #222;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .social-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        }
        
        .instagram-btn { color: #C13584; }
        .instagram-btn:hover { background: linear-gradient(45deg, #405DE6, #5851DB, #833AB4, #C13584, #E1306C, #FD1D1D); color: white; }
        
        .whatsapp-btn { color: #25D366; }
        .whatsapp-btn:hover { background-color: #25D366; color: white; }
        
        .telegram-btn { color: #0088cc; }
        .telegram-btn:hover { background-color: #0088cc; color: white; }
        
        .button-container {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 1rem;
          margin-top: 2rem;
        }
        
        .btn-secondary {
          background: #222;
          border: 1px solid rgba(138, 43, 226, 0.5);
        }
        
        .btn-secondary:hover {
          background: rgba(138, 43, 226, 0.2);
        }
        
        /* Animações */
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from { transform: translateY(30px); opacity: 0.8; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        @keyframes shine {
          0% { transform: rotate(30deg) translateY(100%); }
          100% { transform: rotate(30deg) translateY(-100%); }
        }
        
        @keyframes pulse {
          0% { text-shadow: 0 0 10px rgba(138, 43, 226, 0.5), 0 0 20px rgba(138, 43, 226, 0.3); }
          50% { text-shadow: 0 0 15px rgba(138, 43, 226, 0.8), 0 0 30px rgba(138, 43, 226, 0.5); }
          100% { text-shadow: 0 0 10px rgba(138, 43, 226, 0.5), 0 0 20px rgba(138, 43, 226, 0.3); }
        }
        
        /* Animação do checkmark */
        .success-animation {
          margin: 0 auto 2rem;
          width: 80px;
          height: 80px;
        }
        
        .checkmark {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          display: block;
          stroke-width: 2;
          stroke: #b388ff;
          stroke-miterlimit: 10;
          box-shadow: inset 0 0 0 #b388ff;
          animation: fillCheckmark 0.4s ease-in-out 0.4s forwards, scale 0.3s ease-in-out 0.9s both;
        }
        
        .checkmark-circle {
          stroke-dasharray: 166;
          stroke-dashoffset: 166;
          stroke-width: 2;
          stroke-miterlimit: 10;
          stroke: #b388ff;
          fill: none;
          animation: strokeCheckmark 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
        }
        
        .checkmark-check {
          transform-origin: 50% 50%;
          stroke-dasharray: 48;
          stroke-dashoffset: 48;
          animation: strokeCheckmark 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards;
        }
        
        @keyframes strokeCheckmark {
          100% { stroke-dashoffset: 0; }
        }
        
        @keyframes fillCheckmark {
          100% { box-shadow: inset 0 0 0 30px transparent; }
        }
        
        @keyframes scale {
          0%, 100% { transform: none; }
          50% { transform: scale3d(1.1, 1.1, 1); }
        }
        
        /* Responsivo */
        @media (max-width: 600px) {
          .thank-you-content {
            padding: 1.5rem;
          }
          
          .thank-you-title {
            font-size: 1.5rem;
          }
          
          .button-container {
            flex-direction: column;
          }
          
          .gooey-btn {
            width: 100%;
          }
        }
        
        @keyframes fadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }
      </style>
    `;

    // Substituir o conteúdo do formulário por uma mensagem de confirmação simples
    stepperForm.innerHTML = `
      <div class="text-center py-8">
        <i class="fas fa-check-circle text-6xl mb-4" style="color: var(--silver);"></i>
        <h3 class="text-2xl font-bold mb-4 metallic-text">Cadastro Realizado!</h3>
        <p class="mb-4">Obrigado por se cadastrar como membro do Ibira Runners.</p>
        <p class="mb-6">Entraremos em contato pelo WhatsApp em breve.</p>
        <a href="#home" class="gooey-btn">Voltar para o Início</a>
      </div>
    `;

    // Adicionar o popup animado
    document.body.insertAdjacentHTML("beforeend", popupHTML);

    // Adicionar efeito de glitch ao título do popup
    setTimeout(() => {
      const glitchText = document.querySelector(
        ".thank-you-popup .glitch-text"
      );
      if (glitchText) {
        glitchText.setAttribute("data-text", glitchText.textContent);
      }
    }, 100);

    // Fechar o popup ao clicar em qualquer botão dentro dele
    const popupButtons = document.querySelectorAll(".thank-you-popup a");
    popupButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const popup = document.querySelector(".thank-you-popup");
        if (popup) {
          popup.style.animation = "fadeOut 0.5s ease forwards";
          setTimeout(() => {
            popup.remove();
          }, 500);
        }
      });
    });

    // MÉTODO 1: Enviar para o FormSubmit (e-mail)
    // ==========================================

    // Criar um formulário oculto para enviar os dados
    const hiddenForm = document.createElement("form");
    hiddenForm.method = "POST";
    hiddenForm.action = "https://formsubmit.co/niraslab.dev@gmail.com"; // E-mail configurado
    hiddenForm.style.display = "none";

    // Adicionar os campos ao formulário
    Object.keys(formData).forEach((key) => {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = key;
      input.value = formData[key];
      hiddenForm.appendChild(input);
    });

    // Configurações adicionais do FormSubmit
    const configFields = [
      { name: "_subject", value: "Nova Inscrição Ibira Runners" },
      { name: "_captcha", value: "false" },
      { name: "_template", value: "table" },
      { name: "_next", value: window.location.href + "#mensagem-sucesso" },
    ];

    configFields.forEach((field) => {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = field.name;
      input.value = field.value;
      hiddenForm.appendChild(input);
    });

    // MÉTODO 2: Enviar para o Google Sheets (se disponível)
    // ====================================================

    // Verificar se o FormSubmitter está disponível (arquivo form-submit-sheets.js carregado)
    if (
      window.FormSubmitter &&
      typeof window.FormSubmitter.sendToGoogleSheets === "function"
    ) {
      try {
        // Enviar para Google Sheets em segundo plano
        window.FormSubmitter.sendToGoogleSheets(formData)
          .then((success) => {
            console.log(
              "Envio para Google Sheets:",
              success ? "sucesso" : "falha"
            );
          })
          .catch((error) => {
            console.error("Erro ao enviar para Google Sheets:", error);
          });
      } catch (error) {
        console.error("Erro ao tentar usar o FormSubmitter:", error);
      }
    }

    // Adicionar o formulário ao documento e enviar
    document.body.appendChild(hiddenForm);

    // Enviar o formulário para o FormSubmit
    hiddenForm.submit();
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

// Inicializar o carrossel de depoimentos
function initDepoimentosCarrossel() {
  // Elementos do carrossel
  const track = document.querySelector(".depoimentos-track");
  const slides = document.querySelectorAll(".depoimento-card");
  const prevBtn = document.querySelector(".depoimento-btn.prev");
  const nextBtn = document.querySelector(".depoimento-btn.next");
  const indicators = document.querySelectorAll(".indicador");

  if (!track || !slides.length || !prevBtn || !nextBtn) return;

  let currentIndex = 0;

  // Função para mover o slide
  function moveToSlide(index) {
    if (index < 0) index = slides.length - 1;
    if (index >= slides.length) index = 0;

    track.style.transform = `translateX(-${index * 100}%)`;
    currentIndex = index;

    // Atualizar indicadores
    indicators.forEach((indicator, i) => {
      indicator.classList.toggle("active", i === currentIndex);
    });
  }

  // Eventos de clique
  prevBtn.addEventListener("click", () => moveToSlide(currentIndex - 1));
  nextBtn.addEventListener("click", () => moveToSlide(currentIndex + 1));

  // Clique nos indicadores
  indicators.forEach((indicator, index) => {
    indicator.addEventListener("click", () => moveToSlide(index));
  });

  // Autoplay
  let autoplayInterval = setInterval(() => moveToSlide(currentIndex + 1), 8000);

  // Pausar autoplay ao passar o mouse
  track.addEventListener("mouseenter", () => clearInterval(autoplayInterval));
  track.addEventListener("mouseleave", () => {
    autoplayInterval = setInterval(() => moveToSlide(currentIndex + 1), 8000);
  });

  // Inicializar
  moveToSlide(0);
}
