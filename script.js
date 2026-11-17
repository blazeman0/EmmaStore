const slides = [...document.querySelectorAll(".hero-slide")];
const heroImages = [...document.querySelectorAll(".hero-image")];
const dots = [...document.querySelectorAll(".slider-dot")];
const progressBar = document.querySelector(".slider-progress span");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let activeSlide = 0;
let slideTimer;

function showSlide(index) {
  activeSlide = (index + slides.length) % slides.length;

  slides.forEach((slide, slideIndex) => {
    const isActive = slideIndex === activeSlide;
    slide.classList.toggle("is-active", isActive);
    slide.setAttribute("aria-hidden", String(!isActive));
  });

  heroImages.forEach((image, imageIndex) => {
    const isActive = imageIndex === activeSlide;
    image.classList.toggle("is-active", isActive);
    image.setAttribute("aria-hidden", String(!isActive));
  });

  dots.forEach((dot, dotIndex) => {
    const isActive = dotIndex === activeSlide;
    dot.classList.toggle("is-active", isActive);
    dot.setAttribute("aria-pressed", String(isActive));
  });

  startSlideTimer();
}

function startSlideTimer() {
  window.clearInterval(slideTimer);
  progressBar.classList.remove("animate");
  void progressBar.offsetWidth;
  if (!reducedMotion.matches) {
    progressBar.classList.add("animate");
    slideTimer = window.setInterval(() => showSlide(activeSlide + 1), 5500);
  }
}

document.querySelector(".previous").addEventListener("click", () => showSlide(activeSlide - 1));
document.querySelector(".next").addEventListener("click", () => showSlide(activeSlide + 1));
dots.forEach((dot, index) => dot.addEventListener("click", () => showSlide(index)));
reducedMotion.addEventListener("change", startSlideTimer);
startSlideTimer();

const menuToggle = document.querySelector(".menu-toggle");
const primaryNav = document.querySelector(".primary-nav");

menuToggle.addEventListener("click", () => {
  const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isExpanded));
  menuToggle.setAttribute("aria-label", isExpanded ? "Open navigation" : "Close navigation");
  primaryNav.classList.toggle("is-open", !isExpanded);
});

primaryNav.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
    primaryNav.classList.remove("is-open");
  }
});

const filterButtons = [...document.querySelectorAll(".filter-button")];
const productCards = [...document.querySelectorAll(".product-card")];
const visibleCount = document.querySelector("#visible-count");
const emptyState = document.querySelector(".empty-state");

function filterProducts(category) {
  let count = 0;

  filterButtons.forEach((button) => {
    const isActive = button.dataset.filter === category;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  productCards.forEach((card) => {
    const isVisible = category === "All" || card.dataset.category === category;
    card.hidden = !isVisible;
    if (isVisible) count += 1;
  });

  visibleCount.textContent = String(count);
  emptyState.hidden = count > 0;
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => filterProducts(button.dataset.filter));
});

document.querySelectorAll("[data-filter-link], [data-shop-filter]").forEach((link) => {
  link.addEventListener("click", (event) => {
    const category = link.dataset.filterLink || link.dataset.shopFilter;
    if (!category) return;
    event.preventDefault();
    filterProducts(category);
    document.querySelector("#shop").scrollIntoView({ behavior: reducedMotion.matches ? "auto" : "smooth" });
    menuToggle.setAttribute("aria-expanded", "false");
    primaryNav.classList.remove("is-open");
  });
});

let cartCount = 0;
const cartCountLabel = document.querySelector(".cart-count");
const bagLink = document.querySelector(".bag-link");

document.querySelectorAll(".add-to-bag").forEach((button) => {
  button.addEventListener("click", () => {
    cartCount += 1;
    cartCountLabel.textContent = String(cartCount);
    bagLink.setAttribute("aria-label", `Shopping bag, ${cartCount} ${cartCount === 1 ? "item" : "items"}`);
    const originalText = button.innerHTML;
    button.innerHTML = "Added to bag <span>✓</span>";
    button.classList.add("is-added");
    window.setTimeout(() => {
      button.innerHTML = originalText;
      button.classList.remove("is-added");
    }, 1400);
  });
});

document.querySelector(".newsletter-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const email = new FormData(form).get("email");
  document.querySelector(".form-message").textContent = `Thanks — you’re on the list, ${email}!`;
  form.reset();
});
