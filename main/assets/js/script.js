// Toggle off-canvas menu and handle header shrink on scroll
(function () {
  const body = document.body;
  const hamburger = document.getElementById("hamburger");
  const offcanvas = document.getElementById("offcanvasMenu");
  const closeBtn = document.getElementById("offcanvasClose");
  const backdrop = document.getElementById("offcanvasBackdrop");
  const header = document.getElementById("siteHeader");

  function openMenu() {
    body.classList.add("menu-open");
    offcanvas.setAttribute("aria-hidden", "false");
    hamburger.setAttribute("aria-expanded", "true");
  }
  function closeMenu() {
    body.classList.remove("menu-open");
    offcanvas.setAttribute("aria-hidden", "true");
    hamburger.setAttribute("aria-expanded", "false");
  }

  hamburger &&
    hamburger.addEventListener("click", function () {
      if (body.classList.contains("menu-open")) closeMenu();
      else openMenu();
    });
  closeBtn && closeBtn.addEventListener("click", closeMenu);
  backdrop && backdrop.addEventListener("click", closeMenu);

  // close when a link inside offcanvas is clicked
  offcanvas &&
    offcanvas.addEventListener("click", function (e) {
      if (e.target.tagName.toLowerCase() === "a") closeMenu();
    });

  // Header shrink on scroll
  function onScroll() {
    if (window.scrollY > 10) {
      header.classList.add("header--scrolled");
    } else {
      header.classList.remove("header--scrolled");
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  // run once on load
  onScroll();
})();

function playVideo() {
  const video = document.getElementById("raceVideo");
  const poster = document.getElementById("videoPoster");
  video.play();
  poster.style.display = "none";
}
