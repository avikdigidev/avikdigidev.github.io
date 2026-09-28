(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia("(pointer: fine)").matches;
  var root = document.documentElement;

  /* Theme: stored choice wins, else OS preference, default light. */
  var toggle = document.getElementById("themeToggle");
  function currentTheme() {
    var stored = null;
    try { stored = localStorage.getItem("ps-theme"); } catch (e) { stored = null; }
    if (stored === "light" || stored === "dark") return stored;
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) return "dark";
    return "light";
  }
  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    var dark = theme === "dark";
    toggle.setAttribute("aria-pressed", String(dark));
    toggle.setAttribute("aria-label", dark ? "Switch to light theme" : "Switch to dark theme");
    toggle.querySelector(".theme-label").textContent = dark ? "Light" : "Dark";
    var chart = document.getElementById("activityChart");
    if (chart) {
      var chartSrc = theme === "dark" ? chart.getAttribute("data-src-dark") : chart.getAttribute("data-src-light");
      if (chartSrc && chart.getAttribute("src") !== chartSrc) chart.setAttribute("src", chartSrc);
    }
    try { localStorage.setItem("ps-theme", theme); } catch (e) { /* private mode, theme still applies */ }
  }
  applyTheme(currentTheme());
  toggle.addEventListener("click", function () {
    applyTheme(root.getAttribute("data-theme") === "dark" ? "light" : "dark");
  });

  /* Mobile nav: toggle, close on link click and Escape. */
  var menuToggle = document.getElementById("menuToggle");
  var nav = document.getElementById("siteNav");
  function setMenu(open) {
    nav.classList.toggle("open", open);
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }
  menuToggle.addEventListener("click", function () {
    setMenu(!nav.classList.contains("open"));
  });
  nav.addEventListener("click", function (e) {
    if (e.target.closest("a")) setMenu(false);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && nav.classList.contains("open")) {
      setMenu(false);
      menuToggle.focus();
    }
  });

  /* Header elevation on scroll: shadow signals page position. */
  var header = document.getElementById("siteHeader");
  var headTick = false;
  function updateHeader() {
    headTick = false;
    header.classList.toggle("scrolled", window.scrollY > 8);
  }
  window.addEventListener("scroll", function () {
    if (headTick) return;
    headTick = true;
    window.requestAnimationFrame(updateHeader);
  }, { passive: true });
  updateHeader();

  /* Activity chart fallback: the profile link stays when the image cannot load. */
  var chartImg = document.getElementById("activityChart");
  var chartFallback = document.getElementById("chartFallback");
  if (chartImg && chartFallback) {
    chartImg.addEventListener("error", function () {
      chartImg.hidden = true;
      chartFallback.hidden = false;
    });
  }

  /* Scroll reveal: once per element, skipped under reduced motion. */
  var revealEls = document.querySelectorAll(".reveal");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) { el.classList.add("visible"); });
  } else {
    var revealObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { revealObs.observe(el); });
  }

  /* Active nav highlight. */
  var navLinks = nav.querySelectorAll("a");
  var sections = document.querySelectorAll("main section[id]");
  if ("IntersectionObserver" in window) {
    var navObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (link) {
          var on = link.getAttribute("href") === "#" + entry.target.id;
          if (on) link.classList.add("active"); else link.classList.remove("active");
        });
      });
    }, { rootMargin: "-40% 0px -55% 0px" });
    sections.forEach(function (s) { navObs.observe(s); });
  }

  /* Hero parallax: max 12px, desktop fine pointer, no reduced motion. */
  var diagram = document.getElementById("heroDiagram");
  if (!reduceMotion && finePointer && diagram) {
    var ticking = false;
    window.addEventListener("scroll", function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () {
        var y = Math.max(-12, Math.min(12, window.scrollY * 0.03));
        diagram.style.transform = window.scrollY < 600 ? "translateY(" + y + "px)" : "";
        ticking = false;
      });
    }, { passive: true });
  }

  /* Card tilt: max 8deg, desktop fine pointer, no reduced motion. */
  if (!reduceMotion && finePointer) {
    document.querySelectorAll(".project-card, .skill-group, .timeline-card").forEach(function (card) {
      card.addEventListener("pointermove", function (e) {
        var r = card.getBoundingClientRect();
        var dx = (e.clientX - r.left) / r.width - 0.5;
        var dy = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = "perspective(800px) rotateX(" + (-dy * 8).toFixed(2) + "deg) rotateY(" + (dx * 8).toFixed(2) + "deg) translateY(-4px)";
      });
      card.addEventListener("pointerleave", function () { card.style.transform = ""; });
    });
  }

  /* Magnetic button effect: desktop fine pointer, no reduced motion. */
  if (!reduceMotion && finePointer) {
    document.querySelectorAll(".magnetic-btn").forEach(function (btn) {
      btn.addEventListener("mousemove", function (e) {
        var r = btn.getBoundingClientRect();
        var dx = (e.clientX - r.left - r.width / 2) * 0.3;
        var dy = (e.clientY - r.top - r.height / 2) * 0.3;
        btn.style.transform = "translate(" + dx + "px, " + dy + "px) scale(1.05)";
      });
      btn.addEventListener("mouseleave", function () { btn.style.transform = ""; });
    });
  }

  /* Cursor ring: desktop fine pointer, no reduced motion, hidden for keyboard. */
  var ring = document.getElementById("cursorRing");
  var spotlight = document.getElementById("cursorSpotlight");
  if (!reduceMotion && finePointer && ring && window.matchMedia("(hover: hover)").matches) {
    var ringX = 0, ringY = 0, targetX = 0, targetY = 0, ringOn = false;
    var spotX = 0, spotY = 0, spotTargetX = 0, spotTargetY = 0, spotOn = false;
    
    document.addEventListener("pointermove", function (e) {
      if (e.pointerType !== "mouse") return;
      targetX = e.clientX; targetY = e.clientY;
      spotTargetX = e.clientX; spotTargetY = e.clientY;
      if (!ringOn) { ringOn = true; ring.style.opacity = "1"; }
      if (!spotOn) { spotOn = true; spotlight.classList.add("active"); }
    }, { passive: true });
    
    document.addEventListener("keydown", function () {
      ringOn = false; ring.style.opacity = "0";
      spotOn = false; spotlight.classList.remove("active");
    });
    
    (function follow() {
      ringX += (targetX - ringX) * 0.2;
      ringY += (targetY - ringY) * 0.2;
      ring.style.transform = "translate(" + ringX + "px," + ringY + "px)";
      
      spotX += (spotTargetX - spotX) * 0.15;
      spotY += (spotTargetY - spotY) * 0.15;
      spotlight.style.left = spotX + "px";
      spotlight.style.top = spotY + "px";
      
      requestAnimationFrame(follow);
    })();
    
    document.querySelectorAll("a, button, .project-card, .skill-group, .timeline-card").forEach(function (el) {
      el.addEventListener("mouseenter", function () { ring.classList.add("ring-grow"); });
      el.addEventListener("mouseleave", function () { ring.classList.remove("ring-grow"); });
    });
  } else if (ring) {
    ring.style.display = "none";
  }
  if (spotlight && (reduceMotion || !finePointer || !window.matchMedia("(hover: hover)").matches)) {
    spotlight.style.display = "none";
  }

  /* Footer year. */
  document.getElementById("year").textContent = String(new Date().getFullYear());

  /* Contact form: empty, loading, error, success states with mailto fallback. */
  var form = document.getElementById("contactForm");
  var status = document.getElementById("formStatus");
  var submit = document.getElementById("formSubmit");
  var fields = {
    name: { input: document.getElementById("fieldName"), err: document.getElementById("errName") },
    email: { input: document.getElementById("fieldEmail"), err: document.getElementById("errEmail") },
    message: { input: document.getElementById("fieldMessage"), err: document.getElementById("errMessage") }
  };
  function validEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }
  function validate(showErrors) {
    var ok = true;
    var checks = {
      name: fields.name.input.value.trim().length >= 2,
      email: validEmail(fields.email.input.value.trim()),
      message: fields.message.input.value.trim().length >= 10
    };
    Object.keys(checks).forEach(function (key) {
      if (!checks[key]) ok = false;
      fields[key].err.hidden = showErrors ? checks[key] : true;
      fields[key].input.setAttribute("aria-invalid", String(!checks[key]));
    });
    return ok;
  }
  Object.keys(fields).forEach(function (key) {
    fields[key].input.addEventListener("input", function () { validate(false); status.textContent = ""; });
  });
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    status.className = "form-status";
    if (!validate(true)) {
      status.textContent = "Please fix the highlighted fields, then send again.";
      return;
    }
    var name = fields.name.input.value.trim();
    var email = fields.email.input.value.trim();
    var message = fields.message.input.value.trim();
    submit.disabled = true;
    submit.textContent = "Sending...";
    status.textContent = "Sending your message...";
    window.setTimeout(function () {
      submit.disabled = false;
      submit.textContent = "Send message";
      status.className = "form-status success";
      var mailto = "mailto:email@prakashok.co.in?subject=" +
        encodeURIComponent("Portfolio contact from " + name) +
        "&body=" + encodeURIComponent(message + "\n\nFrom: " + name + " (" + email + ")");
      status.innerHTML = "";
      status.appendChild(document.createTextNode("Thanks " + name + ", noted. "));
      var link = document.createElement("a");
      link.href = mailto;
      link.textContent = "Send email to deliver it";
      status.appendChild(link);
      status.appendChild(document.createTextNode("."));
      form.reset();
    }, 900);
  });
})();
