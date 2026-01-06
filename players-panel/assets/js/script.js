document.addEventListener("DOMContentLoaded", function () {
  //aside menu function
  (function () {
    var btn = document.getElementById("menuBtn");
    var aside = document.querySelector(".admin-left");
    if (!btn || !aside) return;
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      aside.classList.toggle("open");
      this.classList.toggle("cross");
    });
    document.addEventListener("click", function (e) {
      if (!aside.classList.contains("open")) return;
      if (
        !aside.contains(e.target) &&
        e.target !== btn &&
        !btn.contains(e.target)
      ) {
        aside.classList.remove("open");
        btn.classList.remove("cross");
      }
    });
    window.addEventListener("resize", function () {
      if (window.innerWidth > 1024 && aside.classList.contains("open")) {
        aside.classList.remove("open");
        btn.classList.remove("cross");
      }
    });
  })();

  //open popup function
  function openPopup(activeRace) {
    const popup = document.querySelector(".popup-wrapper");
    popup.classList.remove("hidden");
    popup.setAttribute("aria-hidden", "false");
    document.querySelector("body").style.overflow = "hidden";
  }

  //close popup function
  function closePopup() {
    document.querySelector(".popup").classList.remove("open");
  }

  // Calling popup function
  let activeRace = null;

  document.addEventListener("click", function (e) {
    const btn = e.target.closest(".bet-btn");
    if (!btn) return;
    if (btn.classList.contains("disabled")) return;

    e.preventDefault();
    activeRace = btn.closest(".horse");
    openPopup(activeRace);
  });

  // Close Popup
  function closePopup(e) {
    if (e && typeof e.preventDefault === "function") e.preventDefault();
    const popup = document.querySelector(".popup-wrapper");
    popup.classList.add("hidden");
    popup.setAttribute("aria-hidden", "true");
    document.querySelector("body").style.overflow = "visible";
  }

  const cancelBtn = document.getElementById("horse-cancel");
  const popupClose = document.querySelector(".horse-close");

  if (cancelBtn) {
    cancelBtn.addEventListener("click", closePopup);
  }
  if (popupClose) {
    popupClose.addEventListener("click", closePopup);
  }

  // Get OTP Form
  const getOtpForm = document.querySelector(".get-otp-form");
  if (getOtpForm) {
    getOtpForm.addEventListener("submit", function (e) {
      e.preventDefault();
      console.log("submit");

      this.parentElement.style.display = "none";
      this.parentElement.nextElementSibling.style.display = "block";
      const displayOtp = document.querySelector("#otpCountdown");
      startCountdown(60, displayOtp);
    });
  }

  // Accordion
  const accordion = document.querySelectorAll(".accordion");
  if (accordion) {
    accordion.forEach((item) => {
      const header = item.querySelector(".accordion-header");
      header.addEventListener("click", function () {
        // item.classList.toggle("active");
        accordion.forEach((acc) => {
          if (acc !== item) {
            acc.classList.remove("active");
          }
        });
        if (item.classList.contains("active")) {
          item.classList.remove("active");
        } else {
          item.classList.add("active");
        }
      });
    });
  }

  //countdown timer

  function startCountdown(durationInSeconds, displayElement) {
    let timer = durationInSeconds,
      hours,
      minutes,
      seconds;

    const interval = setInterval(function () {
      hours = parseInt(timer / 3600, 10);
      minutes = parseInt((timer % 3600) / 60, 10);
      seconds = parseInt(timer % 60, 10);

      hours = hours < 10 ? "0" + hours : hours;
      minutes = minutes < 10 ? "0" + minutes : minutes;
      seconds = seconds < 10 ? "0" + seconds : seconds;

      if (displayElement) {
        displayElement.textContent = hours + ":" + minutes + ":" + seconds;
      }

      if (--timer < 0) {
        clearInterval(interval);
        if (displayElement) displayElement.textContent = "00:00:00";
      }
    }, 1000);

    return interval;
  }

  // Example Usage:
  const display = document.querySelector("#raceCountdown");

  startCountdown(1800, display);

  //Common open popup function
  function openCommonPopup(btn, popupId) {
    if (!btn || !popupId) return;
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      const popup = document.getElementById(popupId);
      popup.classList.remove("hidden");
      popup.setAttribute("aria-hidden", "false");

      document.querySelector("body").style.overflow = "hidden";
    });
  }

  //Common close popup function
  function closeCommonPopup(btn, popupId) {
    if (!btn || !popupId) return;
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      const popup = document.getElementById(popupId);
      popup.classList.add("hidden");
      popup.setAttribute("aria-hidden", "true");

      document.querySelector("body").style.overflow = "visible";
    });
  }

  const winEditBtn = document.getElementById("winEditBtn");
  const editWinShowPlace = document.getElementById("editWinShowPlace");
  const editExactaBtn = document.getElementById("winExactaBtn");
  const editExactaPopup = document.getElementById("editExactaPopup");
  const editTrifectaBtn = document.getElementById("trifectaEditBtn");
  const editTrifectaPopup = document.getElementById("editTrifectaPopup");
  const editSuperfectaBtn = document.getElementById("superfectaEditBtn");
  const editSuperfectaPopup = document.getElementById("editSuperfectaPopup");

  openCommonPopup(winEditBtn, "editWinShowPlace");
  closeCommonPopup(editWinShowPlace, "editWinShowPlace");

  openCommonPopup(editExactaBtn, "editExactaPopup");
  closeCommonPopup(editExactaPopup, "editExactaPopup");

  openCommonPopup(editTrifectaBtn, "editTrifectaPopup");
  closeCommonPopup(editTrifectaPopup, "editTrifectaPopup");

  openCommonPopup(editSuperfectaBtn, "editSuperfectaPopup");
  closeCommonPopup(editSuperfectaPopup, "editSuperfectaPopup");
});
