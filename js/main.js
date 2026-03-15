/* ========================================
   ASSET+ — Main JavaScript
   Smooth scroll reveals, parallax, counters
======================================== */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileMenu();
  initScrollReveal();
  initParallax();
  initCountUp();
  initVideoAutoplay();
  initFlickeringGrid();
  initFaqAccordion();
});

/* ========== Navbar — shrink on scroll ========== */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  let ticking = false;
  const handleScroll = () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        navbar.classList.toggle('scrolled', window.scrollY > 60);
        ticking = false;
      });
      ticking = true;
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* ========== Mobile Menu ========== */
function initMobileMenu() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('navLinks');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    toggle.classList.toggle('open');
    nav.classList.toggle('open');
    document.body.style.overflow = nav.classList.contains('open') ? 'hidden' : '';
  });

  nav.querySelectorAll('.nav-link, .btn').forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('open');
      nav.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

/* ========== Scroll Reveal — IntersectionObserver ========== */
function initScrollReveal() {
  const selectors = '.reveal, .reveal-left, .reveal-right, .reveal-scale, .clip-reveal, .count-up';
  const elements = document.querySelectorAll(selectors);
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -60px 0px'
  });

  elements.forEach(el => observer.observe(el));
}

/* ========== Parallax — subtle depth on scroll ========== */
function initParallax() {
  const items = document.querySelectorAll('[data-parallax]');
  if (!items.length) return;

  let ticking = false;

  function updateParallax() {
    const scrollY = window.scrollY;
    const viewH = window.innerHeight;

    items.forEach(el => {
      const rect = el.getBoundingClientRect();
      const speed = parseFloat(el.dataset.parallax) || 0.1;

      // Only apply when element is near viewport
      if (rect.top < viewH + 200 && rect.bottom > -200) {
        const offset = (rect.top - viewH / 2) * speed;
        el.style.transform = `translateY(${offset}px)`;
      }
    });
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        updateParallax();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

/* ========== Video Autoplay — ensure all videos play ========== */
function initVideoAutoplay() {
  const videos = document.querySelectorAll('video[autoplay]');
  if (!videos.length) return;

  videos.forEach(video => {
    // Ensure muted (required for autoplay)
    video.muted = true;
    video.playsInline = true;

    // Slow down hero video for smoother feel
    if (video.classList.contains('hero-video')) {
      video.playbackRate = 0.7;
    }

    // Try immediate play
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // If autoplay blocked, try on first user interaction
        const tryPlay = () => {
          video.play().catch(() => { });
          document.removeEventListener('click', tryPlay);
          document.removeEventListener('touchstart', tryPlay);
          document.removeEventListener('scroll', tryPlay);
        };
        document.addEventListener('click', tryPlay, { once: true });
        document.addEventListener('touchstart', tryPlay, { once: true });
        document.addEventListener('scroll', tryPlay, { once: true, passive: true });
      });
    }
  });

  // Also pause/play videos based on visibility for performance
  const videoObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const video = entry.target;
      if (entry.isIntersecting) {
        video.play().catch(() => { });
      } else {
        video.pause();
      }
    });
  }, { threshold: 0.1 });

  videos.forEach(v => videoObserver.observe(v));
}

/* ========== Count Up — animated stat numbers ========== */
function initCountUp() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = el.dataset.count;
        const suffix = el.dataset.suffix || '';
        const prefix = el.dataset.prefix || '';
        const isNumber = !isNaN(parseFloat(target));

        if (isNumber) {
          animateNumber(el, 0, parseFloat(target), 1800, prefix, suffix);
        } else {
          el.textContent = prefix + target + suffix;
        }
        el.classList.add('visible');
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.3 });

  counters.forEach(el => observer.observe(el));
}

function animateNumber(el, start, end, duration, prefix, suffix) {
  const startTime = performance.now();
  const isFloat = end % 1 !== 0;

  function easeOutQuart(t) {
    return 1 - Math.pow(1 - t, 4);
  }

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = easeOutQuart(progress);
    const current = start + (end - start) * eased;

    if (isFloat) {
      el.textContent = prefix + current.toFixed(0) + suffix;
    } else {
      el.textContent = prefix + Math.floor(current).toLocaleString() + suffix;
    }

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

/* ========== FAQ Accordion ========== */
function initFaqAccordion() {
  const questions = document.querySelectorAll('.faq-question');
  if (!questions.length) return;

  questions.forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.contains('open');

      // Close all other items in the same FAQ section
      const parent = item.parentElement;
      parent.querySelectorAll('.faq-item.open').forEach(openItem => {
        openItem.classList.remove('open');
      });

      // Toggle clicked item
      if (!isOpen) {
        item.classList.add('open');
      }
    });
  });
}

/* ========== Flickering Grid Footer ========== */
function initFlickeringGrid() {
  const container = document.getElementById('flickeringGridContainer');
  const canvas = document.getElementById('flickeringGridCanvas');
  if (!container || !canvas) return;

  const ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) return;

  // Settings
  const squareSize = 2; // px
  const gridGap = 3; // px
  const flickerChance = 0.8;
  const maxOpacity = 0.35;
  const colorRgb = '204, 0, 0'; // Brutalist Red
  const isMobile = window.innerWidth <= 768;
  const isTablet = window.innerWidth <= 1024;
  const containerHeight = document.getElementById('flickeringGridContainer')?.offsetHeight || 200;
  const textLines = isMobile ? ["BUILT TO", "PERFORM."] : ["BUILT TO PERFORM."];
  const fontSize = isMobile
    ? Math.floor(containerHeight * 0.26)
    : (isTablet ? Math.floor(containerHeight * 0.35) : Math.floor(containerHeight * 0.50));
  const fontWeight = 700;
  const fontFamily = "'Space Grotesk', sans-serif";

  let isInView = false;
  let animationFrameId;
  let canvasSize = { width: 0, height: 0 };
  let gridParams = { cols: 0, rows: 0, squares: new Float32Array(0), maskData: new Uint8Array(0), dpr: 1 };
  let lastTime = 0;

  // Setup Canvas
  function setupCanvas(width, height) {
    const dpr = window.devicePixelRatio || 1;
    // Limit width/height for canvas memory if extremely large
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const cellStep = (squareSize + gridGap) * dpr;
    const cols = Math.ceil((width * dpr) / cellStep);
    const rows = Math.ceil((height * dpr) / cellStep);

    const squares = new Float32Array(cols * rows);
    const maskData = new Uint8Array(cols * rows); // 0 = false, 1 = true

    for (let i = 0; i < squares.length; i++) {
      squares[i] = Math.random() * maxOpacity;
    }

    // CREATE MASK ONCE
    const maskCanvas = document.createElement("canvas");
    maskCanvas.width = canvas.width;
    maskCanvas.height = canvas.height;
    const maskCtx = maskCanvas.getContext("2d", { willReadFrequently: true });

    if (maskCtx) {
      maskCtx.scale(dpr, dpr);
      maskCtx.fillStyle = "white";
      maskCtx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
      maskCtx.textAlign = "center";
      maskCtx.textBaseline = "middle";

      // Draw single or multi-line text — offset upward to avoid bottom gradient
      const centerY = height * 0.42;
      if (textLines.length === 1) {
        maskCtx.fillText(textLines[0], width / 2, centerY);
      } else {
        const lineHeight = fontSize * 1.15;
        const totalH = lineHeight * textLines.length;
        const startY = centerY - totalH / 2 + lineHeight / 2;
        textLines.forEach((line, i) => {
          maskCtx.fillText(line, width / 2, startY + i * lineHeight);
        });
      }

      const imageData = maskCtx.getImageData(0, 0, maskCanvas.width, maskCanvas.height).data;
      const cellDrawSize = squareSize * dpr;

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const x = Math.floor(i * cellStep + cellDrawSize / 2);
          const y = Math.floor(j * cellStep + cellDrawSize / 2);

          if (x < maskCanvas.width && y < maskCanvas.height) {
            const index = (y * maskCanvas.width + x) * 4;
            if (imageData[index] > 50) { // Check Red channel to see if text exists
              maskData[i * rows + j] = 1;
            }
          }
        }
      }
    }

    return { cols, rows, squares, maskData, dpr };
  }

  function updateCanvasSize() {
    const newWidth = container.clientWidth;
    const newHeight = container.clientHeight;
    if (newWidth === 0 || newHeight === 0) return;
    if (newWidth === canvasSize.width && newHeight === canvasSize.height) return;

    canvasSize = { width: newWidth, height: newHeight };
    gridParams = setupCanvas(newWidth, newHeight);
  }

  // Draw Function
  function drawGrid(ctx, width, height, cols, rows, squares, maskData, dpr) {
    ctx.clearRect(0, 0, width, height);
    const cellDrawSize = squareSize * dpr;
    const cellStep = (squareSize + gridGap) * dpr;

    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        const x = i * cellStep;
        const y = j * cellStep;

        const isText = maskData[i * rows + j] === 1;
        const opacity = squares[i * rows + j];

        // Vastly boost opacity for text, keep background dim
        const finalOpacity = isText ? Math.min(1, opacity * 5 + 0.4) : opacity * 0.4;

        ctx.fillStyle = `rgba(${colorRgb}, ${finalOpacity})`;
        ctx.fillRect(x, y, cellDrawSize, cellDrawSize);
      }
    }
  }

  function updateSquares(squares, deltaTime) {
    for (let i = 0; i < squares.length; i++) {
      if (Math.random() < flickerChance * deltaTime * 30) {
        squares[i] = Math.random() * maxOpacity;
      }
    }
  }

  function animate(time) {
    if (!isInView) return;

    const deltaTime = (time - lastTime) / 1000;
    lastTime = time;

    updateSquares(gridParams.squares, deltaTime);
    drawGrid(
      ctx,
      canvas.width,
      canvas.height,
      gridParams.cols,
      gridParams.rows,
      gridParams.squares,
      gridParams.maskData,
      gridParams.dpr
    );

    animationFrameId = requestAnimationFrame(animate);
  }

  // Initialization
  // Wait to allow fonts to load slightly
  setTimeout(updateCanvasSize, 100);

  window.addEventListener('resize', () => {
    // Debounce resize
    clearTimeout(window.flickerResizeTimer);
    window.flickerResizeTimer = setTimeout(updateCanvasSize, 200);
  });

  const observer = new IntersectionObserver(([entry]) => {
    isInView = entry.isIntersecting;
    if (isInView) {
      lastTime = performance.now();
      animationFrameId = requestAnimationFrame(animate);
    } else {
      cancelAnimationFrame(animationFrameId);
    }
  }, { threshold: 0 });

  observer.observe(canvas);
}
