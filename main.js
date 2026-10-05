document.addEventListener("DOMContentLoaded", () => {

  /* ==========================================
     ACTIVE NAVIGATION
     ========================================== */

  const currentPath = window.location.pathname;

  const menuItems =
    document.querySelectorAll(".main-navigation a");

  const normalizePath = (path) => {

    path = path.replace(/index\.html$/, "");

    if (path !== "/" && !path.endsWith("/")) {
      path += "/";
    }

    return path;
  };


  menuItems.forEach(link => {

    const linkPath =
      new URL(
        link.href,
        window.location.origin
      ).pathname;

    if (
      normalizePath(linkPath) ===
      normalizePath(currentPath)
    ) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }

  });


  /* ==========================================
     MOBILE NAVIGATION
     ========================================== */

  const mobileMenuToggle =
    document.querySelector(
      ".mobile-menu-toggle"
    );

  const mainNavigation =
    document.querySelector(
      ".main-navigation"
    );


  /*
    Opens and closes the mobile navigation.
  */

  if (mobileMenuToggle && mainNavigation) {

    const closeMobileMenu = () => {

      mainNavigation.classList.remove(
        "mobile-open"
      );

      mobileMenuToggle.classList.remove(
        "active"
      );

      mobileMenuToggle.setAttribute(
        "aria-expanded",
        "false"
      );

      mobileMenuToggle.setAttribute(
        "aria-label",
        "Open navigation menu"
      );

    };


    const openMobileMenu = () => {

      mainNavigation.classList.add(
        "mobile-open"
      );

      mobileMenuToggle.classList.add(
        "active"
      );

      mobileMenuToggle.setAttribute(
        "aria-expanded",
        "true"
      );

      mobileMenuToggle.setAttribute(
        "aria-label",
        "Close navigation menu"
      );

    };


    /* Hamburger click */

    mobileMenuToggle.addEventListener(
      "click",
      event => {

        event.stopPropagation();

        const menuIsOpen =
          mainNavigation.classList.contains(
            "mobile-open"
          );

        if (menuIsOpen) {
          closeMobileMenu();
        } else {
          openMobileMenu();
        }

      }
    );


    /*
      Stop clicks inside the navigation
      from triggering the outside-click
      handler.
    */

    mainNavigation.addEventListener(
      "click",
      event => {
        event.stopPropagation();
      }
    );


    /*
      Close menu after clicking a
      navigation link.
    */

    mainNavigation
      .querySelectorAll("a")
      .forEach(link => {

        link.addEventListener(
          "click",
          () => {
            closeMobileMenu();
          }
        );

      });


    /*
      Close menu when clicking anywhere
      outside the navigation.
    */

    document.addEventListener(
      "click",
      () => {

        if (
          mainNavigation.classList.contains(
            "mobile-open"
          )
        ) {
          closeMobileMenu();
        }

      }
    );


    /*
      Close mobile menu when Escape
      is pressed.
    */

    document.addEventListener(
      "keydown",
      event => {

        if (
          event.key === "Escape" &&
          mainNavigation.classList.contains(
            "mobile-open"
          )
        ) {

          closeMobileMenu();

          mobileMenuToggle.focus();

        }

      }
    );


    /*
      If the user opens the mobile menu
      and then rotates the phone or makes
      the browser wider, reset the menu.
    */

    window.addEventListener(
      "resize",
      () => {

        if (window.innerWidth > 768) {
          closeMobileMenu();
        }

      }
    );

  }


  /* ==========================================
     SMOOTH SCROLL
     ========================================== */

  const anchorLinks =
    document.querySelectorAll(
      'a[href^="#"]'
    );


  anchorLinks.forEach(anchor => {

    anchor.addEventListener(
      "click",
      function (event) {

        const targetId =
          this.getAttribute("href");

        if (
          !targetId ||
          targetId === "#"
        ) {
          return;
        }


        const target =
          document.querySelector(
            targetId
          );


        if (target) {

          event.preventDefault();

          target.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });

        }

      }
    );

  });


  /* ==========================================
     FAQ ACCORDION
     ========================================== */

  const faqItems =
    document.querySelectorAll(
      ".faq-item"
    );


  faqItems.forEach(item => {

    const question =
      item.querySelector(
        ".faq-question"
      );


    if (!question) {
      return;
    }


    question.setAttribute(
      "aria-expanded",
      "false"
    );


    question.addEventListener(
      "click",
      () => {

        const alreadyOpen =
          item.classList.contains(
            "active"
          );


        /*
          Close every FAQ first.
        */

        faqItems.forEach(
          otherItem => {

            otherItem.classList.remove(
              "active"
            );


            const otherQuestion =
              otherItem.querySelector(
                ".faq-question"
              );


            if (otherQuestion) {

              otherQuestion.setAttribute(
                "aria-expanded",
                "false"
              );

            }

          }
        );


        /*
          Open selected FAQ if it
          wasn't already open.
        */

        if (!alreadyOpen) {

          item.classList.add(
            "active"
          );

          question.setAttribute(
            "aria-expanded",
            "true"
          );

        }

      }
    );

  });


  /* ==========================================
     SCROLL REVEAL ANIMATION
     ========================================== */

  const revealElements =
    document.querySelectorAll(
      ".reveal"
    );


  if (
    "IntersectionObserver" in window
  ) {

    const revealObserver =
      new IntersectionObserver(

        (entries, observer) => {

          entries.forEach(entry => {

            if (
              entry.isIntersecting
            ) {

              entry.target.classList.add(
                "reveal-visible"
              );

              /*
                Stop observing once
                revealed.
              */

              observer.unobserve(
                entry.target
              );

            }

          });

        },

        {
          threshold: 0.12,
          rootMargin:
            "0px 0px -50px 0px"
        }

      );


    revealElements.forEach(
      element => {

        revealObserver.observe(
          element
        );

      }
    );

  } else {

    /*
      Fallback for older browsers.
    */

    revealElements.forEach(
      element => {

        element.classList.add(
          "reveal-visible"
        );

      }
    );

  }


  /* ==========================================
     AUTOMATIC COPYRIGHT YEAR
     ========================================== */

  const currentYear =
    document.getElementById(
      "currentYear"
    );


  if (currentYear) {

    currentYear.textContent =
      new Date().getFullYear();

  }

});