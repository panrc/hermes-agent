/* Hermes 看板 —— 手机竖屏增强（scroll-snap 分页 + 列指示器 + 安全区）
 *
 * 由 ~/.hermes/scripts/patch_mobile_pwa.py 生成，勿手改（改脚本后重跑）。
 * 只在看板页激活：桌面上只注入安全区规则，宽度 >= 768px 时行为与原来完全一致。
 */
(function () {
  "use strict";
  if (window.__HERMES_KANBAN_MOBILE__) return;
  window.__HERMES_KANBAN_MOBILE__ = true;

  var MOBILE_Q = "(max-width: 767px)";
  var STYLE_ID = "hermes-kanban-mobile-style";
  var NAV_ID = "hermes-kanban-mobile-nav";
  var DOTS_ID = "hermes-kanban-mobile-dots";
  var COLUMNS = ".hermes-kanban .hermes-kanban-columns";

  var CSS = [
    "/* ---- 安全区（刘海 / 底部横条），只在手机/平板壳层补内边距 ---- */",
    "@media (max-width: 1023px) {",
    "  #root > div {",
    "    padding-top: env(safe-area-inset-top, 0px);",
    "    padding-bottom: env(safe-area-inset-bottom, 0px);",
    "    padding-left: env(safe-area-inset-left, 0px);",
    "    padding-right: env(safe-area-inset-right, 0px);",
    "  }",
    "}",
    "",
    "/* ---- 手机：一列一屏，横向 scroll-snap ---- */",
    "@media (max-width: 767px) {",
    "  /* 手机多大就多大：禁掉双指缩放 / 双击放大（viewport 里另有 maximum-scale） */",
    "  html, body {",
    "    touch-action: pan-x pan-y;",
    "    -webkit-text-size-adjust: 100%;",
    "    text-size-adjust: 100%;",
    "  }",
    "  .hermes-kanban .hermes-kanban-columns {",
    "    scroll-snap-type: x mandatory;",
    "    -webkit-overflow-scrolling: touch;",
    "    overscroll-behavior-x: contain;",
    "    scrollbar-width: none;",
    "    gap: 0.6rem;",
    "  }",
    "  .hermes-kanban .hermes-kanban-columns::-webkit-scrollbar { display: none; }",
    "  .hermes-kanban .hermes-kanban-columns > .hermes-kanban-column {",
    "    flex: 0 0 100%;",
    "    width: 100%;",
    "    scroll-snap-align: center;",
    "    scroll-snap-stop: always;",
    "    max-height: calc(100dvh - 15.5rem);",
    "  }",
    "  .hermes-kanban .hermes-kanban-columns > .hermes-kanban-trash {",
    "    flex: 0 0 auto;",
    "    scroll-snap-align: none;",
    "    max-height: none;",
    "  }",
    "",
    "  /* ---- 触摸手势：横滑翻列，长按才拖卡片 ---- */",
    "  /* 卡片默认允许原生平移；拖动中原生滚动被脚本掐住，snap 也要关掉，否则落点乱跳。 */",
    "  .hermes-kanban .hermes-kanban-card {",
    "    touch-action: pan-x pan-y;",
    "    -webkit-touch-callout: none;",
    "  }",
    "  .hermes-kanban .hermes-kanban-columns.kb-dragging { scroll-snap-type: none; }",
    "  .hermes-kanban .hermes-kanban-card.kb-card-lift {",
    "    transform: scale(0.97);",
    "    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.38);",
    "    opacity: 0.9;",
    "  }",
    "",
    "  /* ---- 列指示器 ---- */",
    "  .hermes-kanban .kb-mobile-nav {",
    "    display: flex;",
    "    align-items: center;",
    "    gap: 0.5rem;",
    "    padding: 0.3rem 0.1rem 0.35rem;",
    "    position: sticky;",
    "    top: 0;",
    "    z-index: 20;",
    "    background: var(--background, var(--color-background, #041c1c));",
    "    backdrop-filter: blur(8px);",
    "  }",
    "  .kb-mobile-nav-btn {",
    "    appearance: none;",
    "    display: grid;",
    "    place-items: center;",
    "    width: 2.25rem;",
    "    height: 2.25rem;",
    "    flex: 0 0 auto;",
    "    border-radius: 999px;",
    "    border: 1px solid var(--color-border);",
    "    background: color-mix(in srgb, var(--color-card) 85%, transparent);",
    "    color: var(--color-foreground);",
    "    font-size: 1.15rem;",
    "    line-height: 1;",
    "    cursor: pointer;",
    "    -webkit-tap-highlight-color: transparent;",
    "  }",
    "  .kb-mobile-nav-btn:active { background: color-mix(in srgb, var(--color-foreground) 10%, transparent); }",
    "  .kb-mobile-nav-btn:disabled { opacity: 0.3; }",
    "  .kb-mobile-nav-title {",
    "    flex: 1 1 auto;",
    "    min-width: 0;",
    "    text-align: center;",
    "    font-size: 0.85rem;",
    "    font-weight: 600;",
    "    color: var(--color-foreground);",
    "    white-space: nowrap;",
    "    overflow: hidden;",
    "    text-overflow: ellipsis;",
    "    font-variant-numeric: tabular-nums;",
    "  }",
    "  .hermes-kanban .kb-mobile-dots {",
    "    display: flex;",
    "    align-items: center;",
    "    justify-content: center;",
    "    gap: 0.3rem;",
    "    padding: 0 0 0.3rem;",
    "  }",
    "  .kb-mobile-dot {",
    "    appearance: none;",
    "    border: 0;",
    "    padding: 0;",
    "    width: 0.38rem;",
    "    height: 0.38rem;",
    "    border-radius: 999px;",
    "    background: color-mix(in srgb, var(--color-muted-foreground) 45%, transparent);",
    "    transition: width 120ms ease, background-color 120ms ease;",
    "  }",
    "  .kb-mobile-dot[aria-current=\"true\"] {",
    "    width: 0.95rem;",
    "    background: var(--color-primary, var(--color-foreground));",
    "  }",
    "}",
    "",
    "/* 桌面：指示器不显示 */",
    "@media (min-width: 768px) {",
    "  .hermes-kanban .kb-mobile-nav, .hermes-kanban .kb-mobile-dots { display: none; }",
    "}",
  ].join("\n");

  function injectStyle() {
    if (document.getElementById(STYLE_ID)) return;
    var st = document.createElement("style");
    st.id = STYLE_ID;
    st.textContent = CSS;
    document.head.appendChild(st);
  }

  function isMobile() {
    return window.matchMedia(MOBILE_Q).matches;
  }

  function columnsEl() {
    return document.querySelector(COLUMNS);
  }

  function columnItems(c) {
    return Array.prototype.filter.call(c.children, function (n) {
      return n.classList && n.classList.contains("hermes-kanban-column");
    });
  }

  function currentIndex(c) {
    var items = columnItems(c);
    if (!items.length) return 0;
    var cr = c.getBoundingClientRect();
    var mid = cr.left + cr.width / 2;
    var best = 0;
    var bd = Infinity;
    for (var i = 0; i < items.length; i++) {
      var r = items[i].getBoundingClientRect();
      var d = Math.abs(r.left + r.width / 2 - mid);
      if (d < bd) { bd = d; best = i; }
    }
    return best;
  }

  function columnLabel(col) {
    var l = col.querySelector(".hermes-kanban-column-label");
    if (l && (l.textContent || "").trim()) return l.textContent.trim();
    var h = col.querySelector(".hermes-kanban-column-header");
    if (!h) return "";
    var clone = h.cloneNode(true);
    var cnt = clone.querySelector(".hermes-kanban-column-count");
    if (cnt) clone.removeChild(cnt);
    var add = clone.querySelector(".hermes-kanban-column-add");
    if (add) clone.removeChild(add);
    return (clone.textContent || "").trim();
  }

  function columnCount(col) {
    var n = col.querySelector(".hermes-kanban-column-count");
    return n ? (n.textContent || "").trim() : "";
  }

  function scrollToIndex(c, i, smooth) {
    var items = columnItems(c);
    var el = items[Math.max(0, Math.min(items.length - 1, i))];
    if (!el) return;
    var cr = c.getBoundingClientRect();
    var ir = el.getBoundingClientRect();
    var target = c.scrollLeft + (ir.left - cr.left) - (c.clientWidth - ir.width) / 2;
    if (c.scrollTo) c.scrollTo({ left: target, behavior: smooth ? "smooth" : "auto" });
    else c.scrollLeft = target;
  }

  // ---------------------------------------------------------------------------
  // 触摸手势闸门：横滑 = 翻列，长按 = 拖卡片
  //
  // 插件给每张卡片挂了 pointerdown（attachTouchDrag）：手指一动超过 8px 就被当成「把卡片
  // 拖到另一列」，并 preventDefault 掉滚动。列变成整屏宽之后，一次普通横滑必然落到相邻列，
  // 如果那一列是 done / archived / blocked，就会弹「Confirm status change」。
  //
  // 这里在捕获阶段先拦下卡片上的 pointerdown：
  //   · 手指移动超过阈值 → 判定为滑动，立刻放手让原生 scroll-snap 翻列；
  //   · 原地按住 LONG_PRESS_MS → 补发一个合成 pointerdown 交给插件自己的 touch-drag，
  //     拖动期间掐掉原生滚动（否则 iOS 会边拖边滚，落点乱跳），并在贴边时替它横向滚列。
  // ---------------------------------------------------------------------------
  var LONG_PRESS_MS = 380;
  var MOVE_TOL_PX = 12;
  var gesture = null;
  var relayGuard = false;
  var clickGuardUntil = 0;
  var edgeTimer = 0;

  function cardFrom(t) {
    return t && t.closest ? t.closest(".hermes-kanban-card") : null;
  }

  function swallowNextClick() {
    clickGuardUntil = Date.now() + 700;
  }

  function edgeScroll(g, ev) {
    var c = columnsEl();
    if (!c) return;
    var r = c.getBoundingClientRect();
    var edge = Math.max(48, Math.min(96, r.width * 0.18));
    var dir = 0;
    if (ev.clientX < r.left + edge) dir = -1;
    else if (ev.clientX > r.right - edge) dir = 1;
    g.edgeDir = dir;
    if (!dir || edgeTimer) return;
    // 用定时器而不是 rAF：拖动中手指停住不动时也要持续滚，rAF 在后台/离屏会被节流。
    var frames = 0;
    edgeTimer = window.setInterval(function () {
      if (g !== gesture || !g.armed || !g.edgeDir) { clearEdgeTimer(); return; }
      var box = columnsEl();
      if (box) box.scrollLeft += g.edgeDir * 18;
      frames += 1;
      if (frames % 4 === 0) notifyDropTarget(g);
    }, 40);
  }

  function clearEdgeTimer() {
    if (edgeTimer) { window.clearInterval(edgeTimer); edgeTimer = 0; }
  }

  // 落点高亮由插件在 pointermove 里算；手指停着不动时替它补一个事件，
  // 让高亮跟着自动滚过去的列走。
  function notifyDropTarget(g) {
    var hint = new PointerEvent("pointermove", {
      pointerType: "touch", isPrimary: true, bubbles: true, cancelable: true,
      clientX: g.x, clientY: g.y, buttons: 1,
    });
    hint.__hermesKbSynthetic = true;
    document.dispatchEvent(hint);
  }

  function endGesture(g) {
    if (!g) return;
    if (g === gesture) gesture = null;
    if (g.timer) { clearTimeout(g.timer); g.timer = 0; }
    g.edgeDir = 0;
    clearEdgeTimer();
    document.removeEventListener("pointermove", g.onMove, true);
    document.removeEventListener("pointerup", g.onEnd, true);
    document.removeEventListener("pointercancel", g.onEnd, true);
    if (g.blockTouchMove) {
      document.removeEventListener("touchmove", g.blockTouchMove);
      g.blockTouchMove = null;
    }
    var c = columnsEl();
    if (c) c.classList.remove("kb-dragging");
    if (g.card) g.card.classList.remove("kb-card-lift");
    if (g.armed && g.moved) swallowNextClick();
  }

  function armDrag(g) {
    g.timer = 0;
    if (g !== gesture || g.moved) return;
    g.armed = true;
    var c = columnsEl();
    if (c) c.classList.add("kb-dragging");
    if (g.card) g.card.classList.add("kb-card-lift");
    g.blockTouchMove = function (e) { if (e.cancelable) e.preventDefault(); };
    document.addEventListener("touchmove", g.blockTouchMove, { passive: false });
    // 把「开始拖拽」交接给插件自带的 touch-drag（它监听卡片上的 pointerdown）。
    try {
      relayGuard = true;
      g.card.dispatchEvent(new PointerEvent("pointerdown", {
        pointerType: "touch", isPrimary: true, bubbles: true, cancelable: true,
        clientX: g.x, clientY: g.y, button: 0, buttons: 1,
      }));
    } catch (err) {
      g.armed = false;
    } finally {
      relayGuard = false;
    }
  }

  function onGestureMove(g, ev) {
    if (ev.__hermesKbSynthetic) return;
    if (g !== gesture) return;
    g.x = ev.clientX;
    g.y = ev.clientY;
    if (!g.armed) {
      if (Math.abs(ev.clientX - g.sx) > MOVE_TOL_PX || Math.abs(ev.clientY - g.sy) > MOVE_TOL_PX) {
        endGesture(g); // 这是在滑动：交还给原生 scroll-snap
      }
      return;
    }
    g.moved = true;
    if (ev.cancelable) ev.preventDefault();
    edgeScroll(g, ev);
  }

  function onGestureDown(ev) {
    if (ev.pointerType !== "touch" || relayGuard) return;
    if (!isMobile()) return;
    var card = cardFrom(ev.target);
    if (!card) return;
    if (gesture) endGesture(gesture);
    ev.stopPropagation(); // 挡掉插件「一划就拖」
    var g = {
      card: card, sx: ev.clientX, sy: ev.clientY, x: ev.clientX, y: ev.clientY,
      timer: 0, armed: false, moved: false, blockTouchMove: null,
    };
    g.onMove = function (e2) { onGestureMove(g, e2); };
    g.onEnd = function () { endGesture(g); };
    gesture = g;
    g.timer = setTimeout(function () { armDrag(g); }, LONG_PRESS_MS);
    document.addEventListener("pointermove", g.onMove, true);
    document.addEventListener("pointerup", g.onEnd, true);
    document.addEventListener("pointercancel", g.onEnd, true);
  }

  // 手机上的卡片不能有原生 HTML5 拖拽（iOS 会在滑动中自己起一个，落点同样触发状态变更）。
  function syncCardDraggable() {
    var want = isMobile() ? "false" : "true";
    var cards = document.querySelectorAll(".hermes-kanban .hermes-kanban-card");
    for (var i = 0; i < cards.length; i++) {
      if (cards[i].getAttribute("draggable") !== want) cards[i].setAttribute("draggable", want);
    }
  }

  var gesturesBound = false;
  function bindGestures() {
    if (gesturesBound) return;
    gesturesBound = true;
    document.addEventListener("pointerdown", onGestureDown, true);
    document.addEventListener("click", function (ev) {
      if (Date.now() > clickGuardUntil) return;
      clickGuardUntil = 0;
      ev.preventDefault();
      ev.stopPropagation();
    }, true);
  }

  var navEl = null;
  var dotsEl = null;
  var titleEl = null;
  var prevBtn = null;
  var nextBtn = null;
  var rafPending = false;

  function buildDots(c, active) {
    if (!dotsEl) return;
    var items = columnItems(c);
    if (dotsEl.childElementCount !== items.length) {
      dotsEl.textContent = "";
      for (var i = 0; i < items.length; i++) {
        var d = document.createElement("button");
        d.type = "button";
        d.className = "kb-mobile-dot";
        d.setAttribute("data-index", String(i));
        d.setAttribute("aria-label", String(i + 1));
        dotsEl.appendChild(d);
      }
    }
    var dots = dotsEl.children;
    for (var j = 0; j < dots.length; j++) {
      dots[j].setAttribute("aria-current", j === active ? "true" : "false");
    }
    if (prevBtn) prevBtn.disabled = active <= 0;
    if (nextBtn) nextBtn.disabled = active >= items.length - 1;
  }

  function refresh() {
    rafPending = false;
    var c = columnsEl();
    if (!c || !navEl) return;
    var items = columnItems(c);
    var idx = currentIndex(c);
    if (titleEl) {
      var label = items[idx] ? columnLabel(items[idx]) : "";
      var cnt = items[idx] ? columnCount(items[idx]) : "";
      titleEl.textContent = cnt ? label + " · " + cnt : label;
    }
    buildDots(c, idx);
  }

  function scheduleRefresh() {
    if (rafPending) return;
    rafPending = true;
    window.requestAnimationFrame(refresh);
  }

  function ensureNav() {
    var c = columnsEl();
    if (!c) return;
    var kanban = c.parentElement;
    if (!kanban) return;

    if (!navEl || !navEl.isConnected) {
      navEl = document.createElement("div");
      navEl.id = NAV_ID;
      navEl.className = "kb-mobile-nav";

      prevBtn = document.createElement("button");
      prevBtn.type = "button";
      prevBtn.className = "kb-mobile-nav-btn";
      prevBtn.textContent = "\u2039";
      prevBtn.setAttribute("aria-label", "\u2039");

      titleEl = document.createElement("span");
      titleEl.className = "kb-mobile-nav-title";

      nextBtn = document.createElement("button");
      nextBtn.type = "button";
      nextBtn.className = "kb-mobile-nav-btn";
      nextBtn.textContent = "\u203A";
      nextBtn.setAttribute("aria-label", "\u203A");

      navEl.appendChild(prevBtn);
      navEl.appendChild(titleEl);
      navEl.appendChild(nextBtn);

      dotsEl = document.createElement("div");
      dotsEl.id = DOTS_ID;
      dotsEl.className = "kb-mobile-dots";

      prevBtn.addEventListener("click", function () { scrollToIndex(columnsEl(), currentIndex(columnsEl()) - 1, true); });
      nextBtn.addEventListener("click", function () { scrollToIndex(columnsEl(), currentIndex(columnsEl()) + 1, true); });
      dotsEl.addEventListener("click", function (ev) {
        var t = ev.target;
        if (!t || !t.getAttribute) return;
        var idx = t.getAttribute("data-index");
        if (idx === null) return;
        scrollToIndex(columnsEl(), parseInt(idx, 10), true);
      });
    }

    if (navEl.parentNode !== kanban || navEl.nextElementSibling !== c) {
      kanban.insertBefore(navEl, c);
    }
    if (dotsEl && dotsEl.previousElementSibling !== navEl) {
      kanban.insertBefore(dotsEl, c);
    }
    scheduleRefresh();
  }

  var scrollBound = null;
  function bindScroll() {
    var c = columnsEl();
    if (!c) return;
    if (scrollBound === c) return;
    if (scrollBound) scrollBound.removeEventListener("scroll", scheduleRefresh);
    c.addEventListener("scroll", scheduleRefresh, { passive: true });
    scrollBound = c;
  }

  function syncThemeColor() {
    var meta = document.querySelector('meta[name="theme-color"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "theme-color");
      document.head.appendChild(meta);
    }
    var bg = getComputedStyle(document.documentElement).getPropertyValue("--background") ||
      getComputedStyle(document.documentElement).getPropertyValue("--color-background");
    var m = (bg || "").match(/#[0-9a-fA-F]{3,8}/);
    var hex = m ? m[0] : "#041c1c";
    if (hex.length === 9) hex = hex.slice(0, 7);
    if (meta.getAttribute("content") !== hex) meta.setAttribute("content", hex);
  }

  function tick() {
    injectStyle();
    syncThemeColor();
    bindGestures();
    if (document.querySelector(".hermes-kanban")) {
      ensureNav();
      bindScroll();
      syncCardDraggable();
    }
  }

  var pending = false;
  function scheduleTick() {
    if (pending) return;
    pending = true;
    window.setTimeout(function () { pending = false; tick(); }, 60);
  }

  window.addEventListener("resize", function () { scheduleTick(); scheduleRefresh(); }, { passive: true });
  window.addEventListener("orientationchange", scheduleRefresh, { passive: true });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", scheduleTick, { once: true });
  } else {
    scheduleTick();
  }

  var mo = new MutationObserver(scheduleTick);
  mo.observe(document.body, { childList: true, subtree: true });
  new MutationObserver(syncThemeColor).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["style", "class", "data-theme"],
  });
})();
