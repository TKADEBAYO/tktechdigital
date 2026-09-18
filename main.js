document.addEventListener("DOMContentLoaded", () => {

  /* ==========================================
     ACTIVE NAVIGATION
     ========================================== */

  const currentPage =
    window.location.pathname.split("/").pop() || "index.html";

  const menuItems = document.querySelectorAll("nav a");

  menuItems.forEach(link => {
    const linkPage = link.getAttribute("href");

    if (linkPage === currentPage) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });


  /* ==========================================
     SMOOTH SCROLL
     ========================================== */

  const anchorLinks = document.querySelectorAll('a[href^="#"]');

  anchorLinks.forEach(anchor => {

    anchor.addEventListener("click", function (event) {

      const targetId = this.getAttribute("href");

      if (!targetId || targetId === "#") {
        return;
      }

      const target = document.querySelector(targetId);

      if (target) {
        event.preventDefault();

        target.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }
    });

  });


  /* ==========================================
     FAQ ACCORDION
     ========================================== */

  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach(item => {

    const question = item.querySelector(".faq-question");

    if (!question) return;

    question.setAttribute("aria-expanded", "false");

    question.addEventListener("click", () => {

      const alreadyOpen = item.classList.contains("active");

      /*
        Close other FAQ items first.
        Remove this section if you want multiple
        questions open at the same time.
      */

      faqItems.forEach(otherItem => {

        otherItem.classList.remove("active");

        const otherQuestion =
          otherItem.querySelector(".faq-question");

        if (otherQuestion) {
          otherQuestion.setAttribute(
            "aria-expanded",
            "false"
          );
        }

      });


      /* Open selected question */

      if (!alreadyOpen) {

        item.classList.add("active");

        question.setAttribute(
          "aria-expanded",
          "true"
        );

      }

    });

  });


  /* ==========================================
     SCROLL REVEAL ANIMATION
     ========================================== */

  const revealElements =
    document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {

    const revealObserver =
      new IntersectionObserver(

        (entries, observer) => {

          entries.forEach(entry => {

            if (entry.isIntersecting) {

              entry.target.classList.add(
                "reveal-visible"
              );

              /*
                Stop watching after animation.
                This prevents animation replaying
                every time the visitor scrolls.
              */

              observer.unobserve(entry.target);

            }

          });

        },

        {
          threshold: 0.12,
          rootMargin: "0px 0px -50px 0px"
        }

      );


    revealElements.forEach(element => {
      revealObserver.observe(element);
    });

  } else {

    /*
      Fallback for older browsers.
    */

    revealElements.forEach(element => {
      element.classList.add("reveal-visible");
    });

  }


  /* ==========================================
     AUTOMATIC COPYRIGHT YEAR
     ========================================== */

  const currentYear =
    document.getElementById("currentYear");

  if (currentYear) {
    currentYear.textContent =
      new Date().getFullYear();
  }

});