/* =========================================================
   ARYAN MAHATO — PORTFOLIO SCRIPTS
   1) Theme toggle   2) Sticky navbar  3) Mobile menu
   4) Active nav     5) Scroll reveal  6) Back to top
   7) Particles      8) Typewriter effect
   ========================================================= */

/* ---------- 1) DARK / LIGHT MODE TOGGLE ---------- */
const themeToggle = document.getElementById("themeToggle");
const themeIcon = themeToggle.querySelector(".theme-toggle__icon");
const html = document.documentElement;

// Load saved theme (yellow is the default)
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") {
  html.classList.add("dark-theme");
  themeIcon.textContent = "☀️";
}

themeToggle.addEventListener("click", () => {
  html.classList.toggle("dark-theme");
  const isDark = html.classList.contains("dark-theme");
  themeIcon.textContent = isDark ? "☀️" : "🌙";
  localStorage.setItem("theme", isDark ? "dark" : "yellow");
});

/* ---------- 1b) PROFILE PHOTO FALLBACK ---------- */
/* Shows "AM" initials if assets/images/aryan.jpg is missing */
const aboutPhoto = document.getElementById("aboutPhoto");
const aboutInitials = document.getElementById("aboutInitials");

aboutPhoto.addEventListener("error", () => {
  aboutPhoto.style.display = "none";
  aboutInitials.style.display = "block";
});

/* ---------- 2) STICKY NAVBAR BACKGROUND ---------- */
const navbar = document.getElementById("navbar");

function handleNavbar() {
  navbar.classList.toggle("scrolled", window.scrollY > 40);
  toggleBackToTop(window.scrollY);
}
window.addEventListener("scroll", handleNavbar, { passive: true });

/* ---------- 3) MOBILE HAMBURGER MENU ---------- */
const navBurger = document.getElementById("navBurger");
const navMenu = document.getElementById("navMenu");

navBurger.addEventListener("click", () => {
  const isOpen = navMenu.classList.toggle("open");
  navBurger.classList.toggle("open", isOpen);
  navBurger.setAttribute("aria-expanded", isOpen);
});

// Close the menu when any link is clicked
document.querySelectorAll(".nav__link").forEach((link) => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("open");
    navBurger.classList.remove("open");
    navBurger.setAttribute("aria-expanded", "false");
  });
});

/* ---------- 4) ACTIVE NAVIGATION INDICATOR ---------- */
/* Highlights the link of the section currently in view */
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav__link");

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach((link) => {
          link.classList.toggle(
            "active",
            link.getAttribute("href") === `#${id}`
          );
        });
      }
    });
  },
  { rootMargin: "-45% 0px -50% 0px" }
);

sections.forEach((section) => sectionObserver.observe(section));

/* ---------- 5) SCROLL REVEAL ANIMATIONS ---------- */
const revealElements = document.querySelectorAll("[data-reveal]");

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target); // only animate once
      }
    });
  },
  { threshold: 0.15 }
);

revealElements.forEach((el) => revealObserver.observe(el));

/* ---------- 6) BACK TO TOP BUTTON ---------- */
const backToTop = document.getElementById("backToTop");

function toggleBackToTop(scrollY) {
  backToTop.classList.toggle("show", scrollY > 500);
}

backToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// Initial check (e.g. page reloaded mid-way)
handleNavbar();

/* ---------- 7) LIGHTWEIGHT BACKGROUND PARTICLES ---------- */
const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");
let particles = [];

function resizeCanvas() {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// Create small floating dots that drift and connect
function createParticles() {
  const count = Math.min(70, Math.floor(canvas.width / 18));
  particles = Array.from({ length: count }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    size: Math.random() * 2 + 1,
    speedX: (Math.random() - 0.5) * 0.4,
    speedY: (Math.random() - 0.5) * 0.4,
  }));
}
createParticles();

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const accentColor = getComputedStyle(document.documentElement)
    .getPropertyValue("--accent")
    .trim() || "#22d3ee";

  particles.forEach((p) => {
    p.x += p.speedX;
    p.y += p.speedY;

    // Bounce off edges
    if (p.x < 0 || p.x > canvas.width) p.speedX *= -1;
    if (p.y < 0 || p.y > canvas.height) p.speedY *= -1;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fillStyle = accentColor;
    ctx.globalAlpha = 0.45;
    ctx.fill();
    ctx.globalAlpha = 1;
  });

  // Draw connecting lines between nearby particles
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const distance = Math.hypot(dx, dy);

      if (distance < 110) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = accentColor;
        ctx.globalAlpha = 0.12 * (1 - distance / 110);
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
    }
  }

  requestAnimationFrame(animateParticles);
}
animateParticles();

/* ---------- 8) TYPEWRITER EFFECT IN HERO ---------- */
const typeLine = document.getElementById("typeLine");
const lines = ["runDream(); // let's build something cool", "console.log('Hello, World!');"];
let lineIndex = 0;
let charIndex = 0;
let deleting = false;

function typeWriter() {
  const current = lines[lineIndex];

  if (!deleting) {
    typeLine.textContent = current.slice(0, charIndex + 1);
    charIndex++;
    if (charIndex === current.length) {
      deleting = true;
      setTimeout(typeWriter, 1800); // pause before deleting
      return;
    }
  } else {
    typeLine.textContent = current.slice(0, charIndex - 1);
    charIndex--;
    if (charIndex === 0) {
      deleting = false;
      lineIndex = (lineIndex + 1) % lines.length;
    }
  }

  setTimeout(typeWriter, deleting ? 40 : 85);
}
typeWriter();
