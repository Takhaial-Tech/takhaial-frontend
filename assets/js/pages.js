/* Behaviour the inner pages need on top of main.js. */
(function () {
  "use strict";

  /* ---- project films -------------------------------------------------
     Posters stay still until asked. The first play loads the file, so a work
     page with fourteen films costs nothing until someone is interested. */
  document.addEventListener("click", function (event) {
    var button = event.target.closest(".js-play");
    if (!button) return;
    var figure = button.closest(".media");
    var video = figure && figure.querySelector("video");
    if (!video) return;

    if (video.paused) {
      document.querySelectorAll(".media.is-playing").forEach(function (other) {
        if (other !== figure) {
          other.classList.remove("is-playing");
          var v = other.querySelector("video");
          if (v) v.pause();
        }
      });
      video.play().then(
        function () { figure.classList.add("is-playing"); },
        function () { /* autoplay policy or decode failure: leave the poster up */ }
      );
    } else {
      video.pause();
      figure.classList.remove("is-playing");
    }
  });

  /* A film that scrolls out of view stops rather than playing to nobody. */
  if ("IntersectionObserver" in window) {
    var watcher = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) return;
          var video = entry.target.querySelector("video");
          if (video && !video.paused) {
            video.pause();
            entry.target.classList.remove("is-playing");
          }
        });
      },
      { threshold: 0.15 }
    );
    document.querySelectorAll(".media").forEach(function (m) { watcher.observe(m); });
  }

  /* ---- in-page jumps -------------------------------------------------
     scroll-behavior:smooth plus a sticky header means a raw anchor lands
     under the header, so offset it. */
  document.addEventListener("click", function (event) {
    var link = event.target.closest('a[href^="#"]');
    if (!link) return;
    var id = link.getAttribute("href").slice(1);
    if (!id) return;
    var target = document.getElementById(id);
    if (!target) return;
    event.preventDefault();
    var header = document.querySelector(".site-header");
    var offset = (header ? header.getBoundingClientRect().height : 0) + 12;
    window.scrollTo({
      top: window.scrollY + target.getBoundingClientRect().top - offset,
      behavior: "smooth",
    });
    history.replaceState(null, "", "#" + id);
  });

  /* ---- contact form --------------------------------------------------
     A static host has nothing to POST to, so rather than swallow the message
     the form composes it: the visitor's own mail client opens with every field
     already filled in, addressed to us. It works with no backend and no
     third-party form service holding anyone's data. */
  var form = document.querySelector(".contact__form");
  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var get = function (name) {
        var el = form.querySelector("[name=" + name + "]");
        return el && el.value ? el.value.trim() : "";
      };
      var name = get("name");
      var email = get("email");
      var message = get("message");
      var note = form.querySelector(".js-form-note");

      if (!name || !email || !message) {
        if (note) {
          note.textContent = "Add your name, an email and a line about the work, and this will open your mail app.";
          note.classList.add("is-warning");
        }
        (form.querySelector("[name=" + (!name ? "name" : !email ? "email" : "message") + "]") || form).focus();
        return;
      }

      var company = get("company");
      var sector = get("sector");
      var body = [
        "Name: " + name,
        company ? "Company: " + company : "",
        "Email: " + email,
        sector ? "Sector: " + sector : "",
        "",
        "What happens today:",
        message,
      ].filter(Boolean).join("\n");

      var subject = company ? "Enquiry from " + company : "Enquiry from " + name;
      window.location.href =
        "mailto:info@takhaialtech.com?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(body);

      if (note) {
        note.textContent = "Your mail app should be opening. If it did not, write to info@takhaialtech.com and paste the same details.";
        note.classList.remove("is-warning");
      }
    });
  }
})();
