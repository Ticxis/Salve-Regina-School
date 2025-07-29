function toggleMenu() {
  const navLinks = document.querySelector(".nav-links");
  navLinks.classList.toggle("active");
}

// Scroll-based animations using IntersectionObserver
const animateElements = document.querySelectorAll(".animate-in");
const programCards = document.querySelectorAll(".program-card");
const facultyCards = document.querySelectorAll(".faculty-card");
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        if (
          entry.target.classList.contains("program-card") ||
          entry.target.classList.contains("faculty-card")
        ) {
          entry.target.style.animationDelay = `${entry.target.dataset.delay}s`;
          entry.target.classList.add("slide-in-up");
        } else {
          entry.target.style.animationDelay = `${
            entry.target.dataset.delay || 0
          }s`;
          entry.target.classList.add("animate-in-visible");
        }
        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.2,
  }
);

animateElements.forEach((el, i) => {
  el.dataset.delay = (i * 0.15).toString();
  observer.observe(el);
});

programCards.forEach((card) => {
  observer.observe(card);
});

facultyCards.forEach((card) => {
  observer.observe(card);
});

// Faculty and opportunity card interactions
document
  .querySelectorAll(".faculty-card, .opportunity-card")
  .forEach((card) => {
    card.addEventListener("click", () => {
      card.style.animation = "pulse 0.4s ease-in-out";
      setTimeout(() => {
        card.style.animation = "";
      }, 400);
    });
  });

// Program card hover animation
document.querySelectorAll(".program-card").forEach((card) => {
  card.addEventListener("mouseenter", () => {
    card.style.transform = "scale(1.05)";
  });
  card.addEventListener("mouseleave", () => {
    card.style.transform = "scale(1)";
  });
});

// Faculty card hover animation
document.querySelectorAll(".faculty-card").forEach((card) => {
  card.addEventListener("mouseenter", () => {
    card.style.transform = "translateY(-10px)";
  });
  card.addEventListener("mouseleave", () => {
    card.style.transform = "translateY(0)";
  });
});

// Function to set active navigation link based on current page
function setActiveNavLink() {
    // Get current page filename
    const currentPage = window.location.pathname.split("/").pop() || "academics.html";
  
    // Remove .html extension for comparison
    const pageName = currentPage.replace(".html", "") || "academics";
  
    // Map page names to data-page values
    const pageMap = {
      index: "index",
      "": "index",
      about: "about",
      academics: "academics",
      admissions: "admissions",
      campus: "campus",
      contact: "contact",
    };
  
    // Get the corresponding data-page value
    const dataPage = pageMap[pageName] || "academics";
  
    // Remove active class from all nav links
    const navLinks = document.querySelectorAll(".nav-links a");
    navLinks.forEach((link) => {
      link.classList.remove("active");
    });
  
    // Add active class to current page link
    const activeLink = document.querySelector(
      `.nav-links a[data-page="${dataPage}"]`
    );
    if (activeLink) {
      activeLink.classList.add("active");
    }
  }
