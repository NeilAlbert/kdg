/* ============================================================
   Kunuwaa — vanilla JavaScript (no libraries, no build tools)
   ------------------------------------------------------------
   1. Smooth-scroll for in-page anchor navigation
   2. Fade-in-on-scroll via IntersectionObserver
   3. Floating "back to top" arrow after the hero band
   4. Background music — start on first interaction + toggle button
   ============================================================ */

/* ---------- 1. Smooth scroll for in-page anchor links ---------- */
document.querySelectorAll('a[href^="#"]').forEach(function (link) {
  link.addEventListener("click", function (event) {
    var targetId = link.getAttribute("href");
    if (!targetId || targetId.length < 2) return;

    var target = document.querySelector(targetId);
    if (!target) return;

    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

/* ---------- 2. Fade-in on scroll (IntersectionObserver) ---------- */
var fadeEls = document.querySelectorAll(".fade-in");

var observer = new IntersectionObserver(
  function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target); // animate once
      }
    });
  },
  {
    threshold: 0.15,
    rootMargin: "0px 0px -40px 0px"
  }
);

fadeEls.forEach(function (el) {
  observer.observe(el);
});

/* ---------- 3. Back to top: show after scrolling past the hero ---------- */
var backToTop = document.getElementById("backToTop");
var hero = document.querySelector(".hero");

function toggleBackToTop() {
  var heroHeight = hero ? hero.offsetHeight : window.innerHeight;
  var pastHero = window.scrollY > heroHeight * 0.55;

  backToTop.classList.toggle("is-visible", pastHero);
}

window.addEventListener("scroll", toggleBackToTop, { passive: true });
toggleBackToTop(); // set correct state on load

backToTop.addEventListener("click", function () {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

/* ---------- 4. Background music: start on first interaction + toggle ---------- */
var music = document.getElementById("bgMusic");
var musicToggle = document.getElementById("musicToggle");

if (music && musicToggle) {
  // Start once on the very first user interaction, then remove the listener.
  var startMusic = function () {
    var playPromise = music.play();
    if (playPromise !== undefined) {
      playPromise.catch(function () {
        /* Autoplay may still be blocked; the toggle button remains available. */
      });
    }
    ["click", "touchstart", "keydown"].forEach(function (evtName) {
      document.removeEventListener(evtName, startMusic);
    });
  };

  ["click", "touchstart", "keydown"].forEach(function (evtName) {
    document.addEventListener(evtName, startMusic);
  });

  // Manual toggle after the first interaction.
  musicToggle.addEventListener("click", function () {
    if (music.paused) {
      music.play().catch(function () {
        /* play() rejected — state stays synced via play/pause events. */
      });
    } else {
      music.pause();
    }
  });

  // Keep the button's visual state synced to the audio's real state.
  music.addEventListener("play", function () {
    musicToggle.classList.add("is-playing");
    musicToggle.setAttribute("aria-pressed", "true");
    musicToggle.setAttribute("aria-label", "Pause background music");
  });

  music.addEventListener("pause", function () {
    musicToggle.classList.remove("is-playing");
    musicToggle.setAttribute("aria-pressed", "false");
    musicToggle.setAttribute("aria-label", "Play background music");
  });
}

