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

  var select = document.getElementById("number_of_races");
  // if (!select) return;

  if (select) {
    var races = Array.prototype.slice.call(document.querySelectorAll(".race"));

    // enable/disable inputs inside a race element
    function setRaceEnabled(el, enabled) {
      Array.prototype.forEach.call(
        el.querySelectorAll("input, select, textarea, button"),
        function (inp) {
          // do not disable the Add Horse anchor/button itself
          if (inp.classList && inp.classList.contains("add_horse_popup"))
            return;
          try {
            inp.disabled = !enabled;
          } catch (e) {}
        }
      );
      if (enabled) {
        el.classList.remove("inactive");
      } else {
        el.classList.add("inactive");
      }
    }

    // wrap updateRaces to also enable/disable fields
    function updateRacesWithEnable(races) {
      var n = parseInt(select.value, 10) || 0;
      races.forEach(function (el, i) {
        var active = i < n;
        if (active) {
          el.classList.add("active");
          el.setAttribute("aria-hidden", "false");
        } else {
          el.classList.remove("active");
          el.setAttribute("aria-hidden", "true");
        }
        setRaceEnabled(el, active);
      });
    }

    // enable/disable fields when number of races changes
    function updateAddHorseButtons() {
      races.forEach(function (race) {
        const textInput = race.querySelector('input[type="text"]');
        const btn = race.querySelector(".add_horse_popup");
        const enabled = !race.classList.contains("inactive");
        const hasText = textInput && textInput.value && textInput.value.trim();
        if (!btn) return;
        if (hasText && enabled) {
          btn.classList.remove("disabled");
          btn.removeAttribute("aria-disabled");
          btn.removeAttribute("disabled");
        } else {
          btn.classList.add("disabled");
          btn.setAttribute("aria-disabled", "true");
          btn.setAttribute("disabled", "true");
        }
      });
    }

    // enable submit when all active races have a name and at least one horse
    function updateSubmitButton() {
      const submitBtn = document.querySelector(
        '.button-wrapper button[type="submit"]'
      );
      if (!submitBtn) return;
      const n = parseInt(select.value, 10) || 0;
      let ok = true;
      for (let i = 0; i < n; i++) {
        const race = races[i];
        if (!race) {
          ok = false;
          break;
        }
        const textInput = race.querySelector('input[type="text"]');
        const hasText = textInput && textInput.value && textInput.value.trim();
        const hasHorse = !!(
          race.querySelector(".horse-list ul li") ||
          race.querySelector('input[type="hidden"]')
        );
        if (!hasText || !hasHorse) {
          ok = false;
          break;
        }
      }
      if (ok) {
        submitBtn.disabled = false;
        submitBtn.classList.remove("deactive");
      } else {
        submitBtn.disabled = true;
        submitBtn.classList.add("deactive");
      }
    }

    select.addEventListener("change", () => {
      updateRacesWithEnable(races);
      updateAddHorseButtons();
      updateSubmitButton();
    });
    updateRacesWithEnable(races);
    // attach listeners to race name inputs
    races.forEach(function (race) {
      const textInput = race.querySelector('input[type="text"]');
      if (textInput)
        textInput.addEventListener("input", function () {
          updateAddHorseButtons(); //updateSubmitButton();
        });
    });
    // initial button state
    updateAddHorseButtons();
    //updateSubmitButton();

    //********** Popup functionalities */

    //Open popup function definition
    let currentRace = null;

    function openHorsePopup(activeRace) {
      currentRace = activeRace;

      const popup = document.querySelector(".popup-wrapper");
      const horseCount = document.getElementById("horse-count");
      const horseInputs = document.getElementById("horse-inputs");
      const okBtn = document.getElementById("horse-ok");

      // reset popup
      horseCount.value = "";
      horseInputs.innerHTML = "";
      okBtn.disabled = true;

      popup.classList.remove("hidden");
      popup.setAttribute("aria-hidden", "false");
      document.querySelector("body").style.overflow = "hidden";

      horseCount.onchange = function () {
        const count = parseInt(this.value, 10);
        horseInputs.innerHTML = "";
        okBtn.disabled = true;

        if (!count) return;

        for (let i = 1; i <= count; i++) {
          const wrapper = document.createElement("div");
          wrapper.className = "input-wrapper";

          const label = document.createElement("span");
          label.className = "text";
          label.textContent = i + ". Horse name:";

          const input = document.createElement("input");
          input.type = "text";
          input.placeholder = "Horse name";
          input.required = true;
          input.dataset.index = i;

          input.addEventListener("input", validateHorseInputs);

          wrapper.appendChild(label);
          wrapper.appendChild(input);
          horseInputs.appendChild(wrapper);
        }
      };
    }

    // Calling popup function
    let activeRace = null;

    document.addEventListener("click", function (e) {
      const btn = e.target.closest(".add_horse_popup");
      if (!btn) return;
      if (btn.classList.contains("disabled")) return;

      e.preventDefault();
      activeRace = btn.closest(".race");
      openHorsePopup(activeRace);
    });

    //Validate inputs

    function validateHorseInputs() {
      const inputs = document.querySelectorAll("#horse-inputs input");
      const okBtn = document.getElementById("horse-ok");

      okBtn.disabled = Array.from(inputs).some((inp) => !inp.value.trim());
    }

    //Insert horse name to the race
    const horseOkBtn = document.getElementById("horse-ok");
    if (horseOkBtn) {
      horseOkBtn.addEventListener("click", function () {
        const popup = document.getElementById("horse-popup");
        const inputs = document.querySelectorAll("#horse-inputs input");
        //const races = document.querySelectorAll(".race");

        if (!popup) return;

        let wrap = currentRace.querySelector(".horse-list");
        let list = currentRace.querySelector(".horse-lists");
        if (!wrap) {
          wrap = document.createElement("div");

          wrap.className = "horse-list";
          wrap.textContent = "Horses' name:";
          list = document.createElement("ul");
          currentRace.appendChild(wrap);
          wrap.appendChild(list);
        }

        list.innerHTML = "";

        inputs.forEach((input, i) => {
          const li = document.createElement("li");
          const isLast = i === inputs.length - 1;
          li.textContent = `${i + 1}. ${input.value}${isLast ? "" : ","}`;

          // hidden input for form submission
          const hidden = document.createElement("input");
          hidden.type = "hidden";
          hidden.name = `${
            currentRace.querySelector('input[type="text"]').name
          }_horse_${i + 1}`;
          hidden.value = input.value;

          li.appendChild(hidden);
          list.appendChild(li);
        });
        closeHorsePopup();

        const next = currentRace.nextElementSibling;
        if (next && next.removeAttribute) next.removeAttribute("disabled");
        updateSubmitButton();
      });
    }

    // Close Popup
    function closeHorsePopup(e) {
      if (e && typeof e.preventDefault === "function") e.preventDefault();
      const popup = document.querySelector(".popup-wrapper");
      popup.classList.add("hidden");
      popup.setAttribute("aria-hidden", "true");
      document.querySelector("body").style.overflow = "visible";
    }

    const cancelBtn = document.getElementById("horse-cancel");
    const popupClose = document.querySelector(".horse-close");

    if (cancelBtn) {
      cancelBtn.addEventListener("click", closeHorsePopup);
    }
    if (popupClose) {
      popupClose.addEventListener("click", closeHorsePopup);
    }
  }

  // Toggle between group1 and group2 when clicking Next / Back
  (function () {
    var nextBtn = document.getElementById("next-btn");
    var backBtn = document.querySelector(".back-btn");
    var group1 = document.querySelector(".group1");
    var group2 = document.querySelector(".group2");
    //console.log(nextBtn);

    if (!group1 || !group2) return;

    // hide group2 initially
    group2.style.display = "none";

    if (nextBtn) {
      nextBtn.addEventListener("click", function (e) {
        e.preventDefault();
        //console.log("next button clicked");

        group1.style.display = "none";
        group2.style.display = "block";
        var focusable = group2.querySelector(
          "select, input, textarea, button, a"
        );
        if (focusable && typeof focusable.focus === "function")
          focusable.focus();
      });
    }

    if (backBtn) {
      backBtn.addEventListener("click", function (e) {
        e.preventDefault();
        group2.style.display = "none";
        group1.style.display = "block";
        var focusable = group1.querySelector(
          "select, input, textarea, button, a"
        );
        if (focusable && typeof focusable.focus === "function")
          focusable.focus();
      });
    }
  })();

  //edit horse count

  (function () {
    const horseCount = document.getElementById("horse-count2");
    const horseInputs = document.getElementById("horse-inputs2");

    if (!horseCount || !horseInputs) return;

    let prevHorseList = Array.from(
      document.querySelectorAll("#horse-inputs2 .input-wrapper")
    );

    // console.log(prevHorseList);

    horseCount.onchange = function () {
      const count = parseInt(this.value, 10);
      //horseInputs.innerHTML = "";

      //console.log(count);

      if (!count) return;
      horseInputs.innerHTML = "";

      for (let i = 0; i < count; i++) {
        if (i < prevHorseList.length) {
          horseInputs.appendChild(prevHorseList[i]);
        } else {
          const wrapper = document.createElement("div");
          wrapper.className = "input-wrapper";
          const text = document.createElement("span");
          text.className = "text";
          text.textContent = i + 1 + ". Horse name:";
          const input = document.createElement("input");
          input.type = "text";
          input.value = "";
          input.required = true;
          input.dataset.index = i + 1;
          wrapper.appendChild(text);
          wrapper.appendChild(input);
          horseInputs.appendChild(wrapper);
          prevHorseList.push(wrapper);
        }
      }
    };
  })();
});
