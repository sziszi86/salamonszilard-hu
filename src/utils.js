export function initCursor() {
  let mouseX = window.innerWidth / 2,
    mouseY = window.innerHeight / 2;

  let cursor = {
    el: document.querySelector(".cursor"),
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
    w: 30,
    h: 30,
    update: function () {
      let l = this.x - this.w / 2;
      let t = this.y - this.h / 2;
      this.el.style.transform = "translate3d(" + l + "px," + t + "px, 0)";
    },
  };

  window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  const link = document.querySelectorAll(
    "a, .swiper-pagination, .swiper-button-prev, .swiper-button-next, button, .button, .btn, .lnk"
  );
  link.forEach((link) => {
    link.addEventListener("mouseenter", () => {
      cursor.el.classList.add("cursor-zoom");
    });
    link.addEventListener("mouseleave", () => {
      cursor.el.classList.remove("cursor-zoom");
    });
  });

  setInterval(move, 1000 / 60);
  function move() {
    cursor.x = lerp(cursor.x, mouseX, 0.1);
    cursor.y = lerp(cursor.y, mouseY, 0.1);
    cursor.update();
  }
  function lerp(start, end, amt) {
    return (1 - amt) * start + amt * end;
  }
}
export const activeAnimation = () => {
  const progress_inner = document.querySelectorAll(".scroll-animate"),
    triggerBottom = (window.innerHeight / 5) * 5 - 20;
  progress_inner.forEach((box) => {
    const boxTop = box.getBoundingClientRect().top;
    if (boxTop < triggerBottom) {
      box.style.visibility = "visible";
      box.classList.add("animate__active");
    }
  });
};

export const stickyNav = () => {
  let offset = window.scrollY;
  const sticky = document.querySelectorAll(".header");
  sticky.forEach((sticky) => {
    if (sticky) {
      if (offset > 100) {
        sticky.classList.add("animate-in", "sticky");
      } else {
        sticky.classList.remove("animate-in", "sticky");
      }
    }
  });
};

export const toggleMenu = (e) => {
  e.preventDefault();
  const menu = document.querySelector(".menu-btn");
  if (menu.classList.contains("active")) {
    menu.classList.remove("active");
    menu.classList.add("no-touch");
    document.body.classList.remove("no-scroll");
    document.querySelector(".menu-full-overlay").classList.remove("is-open");
    document.querySelector(".menu-full-overlay").classList.remove("has-scroll");
    document
      .querySelector(".menu-full-overlay")
      .classList.remove("animate-active");
    setTimeout(function () {
      document.querySelector(".menu-full-overlay").classList.remove("visible");
      menu.classList.remove("no-touch");
    }, 1000);
  } else {
    menu.classList.add("active", "no-touch");
    document.body.classList.add("no-scroll");
    document
      .querySelector(".menu-full-overlay")
      .classList.add("is-open", "visible");
    setTimeout(function () {
      document
        .querySelector(".menu-full-overlay")
        .classList.add("has-scroll", "animate-active");
      menu.classList.remove("no-touch");
    }, 1000);
  }
  return false;
};

export const linkClick = (targetId = null) => {
  const menu = document.querySelector(".menu-btn");
  const menuWasActive = menu.classList.contains("active");
  
  // Close menu if it's open
  if (menuWasActive) {
    menu.classList.remove("active");
    menu.classList.add("no-touch");
    document.body.classList.remove("no-scroll");
    document.querySelector(".menu-full-overlay").classList.remove("is-open");
    document.querySelector(".menu-full-overlay").classList.remove("has-scroll");
    document
      .querySelector(".menu-full-overlay")
      .classList.remove("animate-active");
    setTimeout(function () {
      document.querySelector(".menu-full-overlay").classList.remove("visible");
      menu.classList.remove("no-touch");
    }, 1000);
  }
  
  // Handle smooth scrolling to section if targetId is provided
  if (targetId) {
    const scrollDelay = menuWasActive ? 500 : 0;
    setTimeout(() => {
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        // Try modern scrollIntoView first
        if ('scrollIntoView' in targetElement) {
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        } else {
          // Fallback for older browsers
          const headerOffset = 80; // Account for header height
          const elementPosition = targetElement.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }
    }, scrollDelay);
  }
  
  return false;
};

export const jarallaxAnimation = () => {
  let { jarallax, jarallaxVideo } = require("jarallax");
  jarallax(document.querySelectorAll(`.js-parallax`), {
    speed: 0.65,
    type: "scroll",
  });
};
