// Highlight active nav link dynamically
document.addEventListener("DOMContentLoaded", () => {
  const currentLocation = window.location.pathname.split("/").pop();
  const menuItems = document.querySelectorAll("nav a");

  menuItems.forEach(link => {
    if (link.getAttribute("href") === currentLocation) {
      link.classList.add("active");
    }
  });
});

// Smooth scroll for anchor links (if needed later)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute("href")).scrollIntoView({
      behavior: "smooth"
    });
  });
});

// Small animation for hero section
const heroTitle = document.querySelector(".hero h1");
if (heroTitle) {
  heroTitle.style.opacity = 0;
  setTimeout(() => {
    heroTitle.style.transition = "opacity 2s ease-in-out";
    heroTitle.style.opacity = 1;
  }, 500);
}
