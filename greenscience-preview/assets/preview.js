// Stand-in for LiveView in the static design preview: links between captured
// pages work, typing and ticking work, and anything that would save says so
// instead. Word counters keep counting so reviewers can see them in action.
(function () {
  "use strict";

  var timer;
  function toast(message) {
    var el = document.querySelector(".pv-toast");
    if (!el) {
      el = document.createElement("div");
      el.className = "pv-toast";
      el.setAttribute("role", "status");
      document.body.appendChild(el);
    }
    el.textContent = message;
    el.hidden = false;
    clearTimeout(timer);
    timer = setTimeout(function () { el.hidden = true; }, 3200);
  }

  var NOTHING_SAVED = "Design preview: nothing is saved.";

  document.addEventListener("submit", function (event) {
    event.preventDefault();
    toast(NOTHING_SAVED);
  }, true);

  document.addEventListener("click", function (event) {
    var target = event.target.closest("a, button");
    if (!target) return;

    if (target.matches('a[href="#preview-disabled"]')) {
      event.preventDefault();
      toast(target.textContent.trim().match(/sign/i)
        ? "Design preview: sign-in is not part of the preview."
        : "Design preview: this needs the real app.");
      return;
    }

    // Buttons that would talk to the server: withdraw, delete, filters,
    // change role, remove a PDF. Submit buttons are caught by "submit" above.
    if (target.tagName === "BUTTON" && target.type !== "submit") {
      event.preventDefault();
      toast(NOTHING_SAVED);
    }
  }, true);

  // The flash disappears on click in the real app.
  document.addEventListener("click", function (event) {
    var flash = event.target.closest(".flash");
    if (flash) flash.hidden = true;
  });

  // Live word counters, as LiveView would update them.
  function countWords(text) {
    var trimmed = text.trim();
    return trimmed === "" ? 0 : trimmed.split(/\s+/).length;
  }

  document.addEventListener("input", function (event) {
    var field = event.target.closest(".field");
    if (!field || event.target.tagName !== "TEXTAREA") return;
    var counter = field.querySelector(".counter");
    if (!counter) return;
    var limit = parseInt((counter.textContent.match(/\/\s*(\d+)/) || [])[1], 10);
    if (!limit) return;
    var count = countWords(event.target.value);
    counter.textContent = count + " / " + limit + " words";
    counter.classList.toggle("is-over", count > limit);
  });
})();
