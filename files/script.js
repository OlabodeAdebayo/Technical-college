(function () {
  // Replace this array with data from /api/programs/ when the Django backend is ready.
  var programs = [
    { t: "Electrical Installation & Maintenance", c: "electrical", d: "2 Years", s: "Wiring, installation, fault finding and safe maintenance of electrical systems.", k: "#123B5D" },
    { t: "Mechanical Engineering Craft", c: "engineering", d: "2 Years", s: "Machining, fitting, workshop practice and maintenance of mechanical equipment.", k: "#1d5a8a" },
    { t: "Welding & Fabrication", c: "engineering", d: "1 Year", s: "Arc, MIG and gas welding with metal fabrication and blueprint reading.", k: "#b45309" },
    { t: "Automotive Technology", c: "automotive", d: "2 Years", s: "Engine, brake and electrical diagnosis and servicing for modern vehicles.", k: "#334155" },
    { t: "Plumbing & Pipe Fitting", c: "construction", d: "1 Year", s: "Water supply, drainage, pipe fitting and installation of sanitary systems.", k: "#0e7490" },
    { t: "Building & Construction", c: "construction", d: "2 Years", s: "Block laying, concrete work, site measurement and building practice.", k: "#7c4a1d" }
  ];
  var rooms = {
    Electrical: "Practice boards, distribution panels, test meters and solar installation rigs.",
    Mechanical: "Lathes, milling machines, bench vices and precision measuring tools.",
    Welding: "Individual welding bays with extraction, MIG and arc machines, and cutting tools.",
    Automotive: "Vehicle lifts, engine stands, diagnostic scanners and working vehicles.",
    Plumbing: "Pipe-bending stations, fixture test rigs and practical drainage layouts.",
    Construction: "Block-laying yards, formwork area, surveying equipment and a mixing station."
  };

  var $ = function (s) { return document.querySelector(s); };
  var grid = $("#programGrid"), empty = $("#empty"), search = $("#search");
  var filter = "all";

  function esc(x) { return x.replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  function renderPrograms() {
    var q = search.value.trim().toLowerCase();
    var list = programs.filter(function (p) {
      return (filter === "all" || p.c === filter) && (p.t + " " + p.s).toLowerCase().indexOf(q) > -1;
    });
    grid.innerHTML = list.map(function (p) {
      return '<article class="card prog"><div class="img" style="background:' + p.k + '" aria-hidden="true">' + esc(p.t.charAt(0)) + '</div>' +
        '<div class="body"><h3>' + esc(p.t) + '</h3><p>' + esc(p.s) + '</p><span class="dur">Duration: ' + esc(p.d) + '</span>' +
        '<a class="link" href="#">View program</a></div></article>';
    }).join("");
    empty.hidden = list.length > 0;
  }

  $("#chips").addEventListener("click", function (e) {
    var b = e.target.closest(".chip"); if (!b) return;
    document.querySelectorAll(".chip").forEach(function (c) { c.classList.remove("on"); });
    b.classList.add("on"); filter = b.dataset.f; renderPrograms();
  });
  search.addEventListener("input", renderPrograms);
  renderPrograms();

  // Campus tabs
  var tabs = $("#tabs"), panel = $("#panel");
  Object.keys(rooms).forEach(function (name, i) {
    var b = document.createElement("button");
    b.type = "button"; b.setAttribute("role", "tab"); b.textContent = name + " workshop";
    b.setAttribute("aria-selected", i === 0);
    b.addEventListener("click", function () { show(name, b); });
    tabs.appendChild(b);
  });
  function show(name, btn) {
    tabs.querySelectorAll("button").forEach(function (x) { x.setAttribute("aria-selected", x === btn); });
    panel.innerHTML = "<h3>" + name + " workshop</h3><p>" + rooms[name] + " Students train in small groups with an instructor present.</p>";
  }
  show("Electrical", tabs.firstChild);

  // Mobile menu
  var burger = $("#burger"), menu = $("#menu");
  function setMenu(open) {
    menu.classList.toggle("open", open);
    burger.setAttribute("aria-expanded", open);
    burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }
  burger.addEventListener("click", function () { setMenu(!menu.classList.contains("open")); });
  menu.addEventListener("click", function (e) { if (e.target.tagName === "A") setMenu(false); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") setMenu(false); });

  // Count-up statistics, runs once when visible
  var counted = false;
  var facts = $(".facts");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if ("IntersectionObserver" in window && !reduce) {
    new IntersectionObserver(function (en, ob) {
      if (!en[0].isIntersecting || counted) return;
      counted = true; ob.disconnect();
      document.querySelectorAll("[data-count]").forEach(function (el) {
        var end = +el.dataset.count, t0 = null;
        (function step(t) {
          t0 = t0 || t;
          var p = Math.min((t - t0) / 1200, 1);
          el.textContent = Math.round(end * p) + (p === 1 ? "+" : "");
          if (p < 1) requestAnimationFrame(step);
        })(performance.now());
      });
    }, { threshold: 0.6 }).observe(facts);
  }

  // Contact form validation (wire to /api/contact/ later)
  $("#contactForm").addEventListener("submit", function (e) {
    e.preventDefault();
    var f = e.target, msg = $("#formMsg"), ok = true;
    f.querySelectorAll("input,textarea").forEach(function (i) {
      var bad = !i.value.trim() || (i.type === "email" && !/^\S+@\S+\.\S+$/.test(i.value));
      i.classList.toggle("bad", bad); if (bad) ok = false;
    });
    msg.className = "msg " + (ok ? "ok" : "err");
    msg.textContent = ok ? "Message sent. We will reply within two working days." : "Fill in every field and enter a valid email address.";
    if (ok) f.reset();
  });
})();
