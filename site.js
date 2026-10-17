// Language: ?lang=it|en in the URL wins, then the saved choice, then the browser language.
(function () {
  var root = document.documentElement;
  var param = new URLSearchParams(location.search).get("lang");
  var saved = null;
  try { saved = localStorage.getItem("lang"); } catch (e) {}
  var lang = param || saved || ((navigator.language || "").toLowerCase().indexOf("it") === 0 ? "it" : "en");
  if (lang !== "it" && lang !== "en") lang = "en";

  function apply(l) {
    root.setAttribute("data-lang", l);
    root.setAttribute("lang", l);
    var t = root.getAttribute("data-title-" + l);
    if (t) document.title = t;
    document.querySelectorAll("[data-lang-switch]").forEach(function (b) {
      b.textContent = l === "it" ? "EN" : "IT";
      b.setAttribute("aria-label", l === "it" ? "Switch to English" : "Passa all'italiano");
    });
    // keep the language when moving between pages
    document.querySelectorAll("a[data-keep-lang]").forEach(function (a) {
      var url = new URL(a.getAttribute("href"), location.href);
      url.searchParams.set("lang", l);
      a.href = url.pathname.split("/").pop() + url.search + url.hash;
    });
  }

  apply(lang);

  document.addEventListener("click", function (e) {
    var b = e.target.closest("[data-lang-switch]");
    if (!b) return;
    lang = lang === "it" ? "en" : "it";
    try { localStorage.setItem("lang", lang); } catch (e2) {}
    apply(lang);
  });
})();
