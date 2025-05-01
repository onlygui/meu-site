const banners = [
  {
    img: 'https://media.discordapp.net/attachments/1367480194721382499/1367511192909905980/17454564922006300imagem.png?ex=6814d98b&is=6813880b&hm=282fcb734f2bed90082c42c54ad8604267649d18ec0424938252ab84c1231481&=&format=webp&quality=lossless&width=843&height=474',
    produto: 'https://unistorexx.com/'
  },
  {
    img: 'https://media.discordapp.net/attachments/1367480194721382499/1367530291761123358/Combo_streaming.png?ex=6814eb55&is=681399d5&hm=4fdd87abb12f860f22b215d9e03eb6868b3a7518aaa9ba3ab355d9d53b1c0620&=&format=webp&quality=lossless&width=843&height=474',
    produto: 'https://unistorexx.com/category/174571650400531394498182945521230'
  },
  {
    img: 'https://public-blob.squarecloud.dev/1057518718378324009/77235067904_ma1pb48h-f349.webp',
    produto: 'https://simplestore.shop/product/1742511478909973444389717931946'
  },
  {
    img: 'https://public-blob.squarecloud.dev/1057518718378324009/75725240088_ma1pczvr-08c9.webp',
    produto: 'https://simplestore.shop/product/1716685113719022387489902285632683418'
  }
];

let index = 0;
let interval;
const bannerImage = document.getElementById('banner-image');
const bannerLink = document.getElementById('banner-link');
const prevBtn = document.getElementById('prev-banner');
const nextBtn = document.getElementById('next-banner');
const indicatorsContainer = document.querySelector('.carousel-indicators');

// Criar indicadores
function createIndicators() {
  banners.forEach((_, i) => {
    const indicator = document.createElement('div');
    indicator.classList.add('indicator');
    if (i === index) indicator.classList.add('active');
    indicator.addEventListener('click', () => {
      clearInterval(interval);
      updateBanner(i);
      interval = setInterval(nextBanner, 5000);
    });
    indicatorsContainer.appendChild(indicator);
  });
}

// Atualizar indicadores
function updateIndicators() {
  const indicators = document.querySelectorAll('.indicator');
  indicators.forEach((indicator, i) => {
    if (i === index) {
      indicator.classList.add('active');
    } else {
      indicator.classList.remove('active');
    }
  });
}

function updateBanner(i) {
  index = (i + banners.length) % banners.length;
  bannerImage.src = banners[index].img;
  bannerImage.alt = `Produto em destaque ${index + 1}`;
  bannerLink.href = banners[index].produto;
  updateIndicators();
  
  // Adiciona animação
  bannerImage.style.animation = 'fadeIn 0.5s ease';
  setTimeout(() => {
    bannerImage.style.animation = '';
  }, 500);
}

function nextBanner() {
  updateBanner(index + 1);
}

function prevBanner() {
  updateBanner(index - 1);
}

function startCarousel() {
  interval = setInterval(nextBanner, 5000);
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
  createIndicators();
  updateBanner(0);
  startCarousel();
  
  // Controles manuais
  prevBtn.addEventListener('click', () => {
    clearInterval(interval);
    prevBanner();
    startCarousel();
  });

  nextBtn.addEventListener('click', () => {
    clearInterval(interval);
    nextBanner();
    startCarousel();
  });
  
  // Pausar carrossel quando o mouse estiver sobre ele
  document.querySelector('.carousel-banner').addEventListener('mouseenter', () => {
    clearInterval(interval);
  });
  
  document.querySelector('.carousel-banner').addEventListener('mouseleave', () => {
    startCarousel();
  });
});
