(() => {
  const CA = "0x02853fa4d58d4fc65c0a4d7665c85568dbd18886";
  const copyBtn = document.getElementById("copy-ca");
  const caEl = document.getElementById("ca");

  if (copyBtn && caEl) {
    copyBtn.addEventListener("click", async () => {
      const text = caEl.textContent.trim() || CA;
      try {
        await navigator.clipboard.writeText(text);
      } catch {
        const range = document.createRange();
        range.selectNodeContents(caEl);
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
        document.execCommand("copy");
        sel.removeAllRanges();
      }
      copyBtn.classList.add("copied");
      copyBtn.textContent = "Copied";
      setTimeout(() => {
        copyBtn.classList.remove("copied");
        copyBtn.textContent = "Copy";
      }, 1600);
    });
  }

  // Scroll reveal
  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("in"));
  }

  // Cursor paw trail (desktop only, reduced-motion safe)
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  if (!prefersReduced && canHover) {
    const trail = [];
    const MAX = 8;
    let last = 0;

    const pawSvg = () => {
      const el = document.createElement("div");
      el.className = "paw-trail";
      el.innerHTML =
        '<svg viewBox="0 0 64 64" width="16" height="16" fill="currentColor"><ellipse cx="18" cy="16" rx="7" ry="10" transform="rotate(-20 18 16)"/><ellipse cx="32" cy="10" rx="6.5" ry="9.5"/><ellipse cx="46" cy="14" rx="6.5" ry="9.5" transform="rotate(16 46 14)"/><ellipse cx="54" cy="26" rx="5.5" ry="8" transform="rotate(30 54 26)"/><ellipse cx="32" cy="38" rx="14" ry="12"/></svg>';
      document.body.appendChild(el);
      return el;
    };

    for (let i = 0; i < MAX; i++) trail.push(pawSvg());

    let idx = 0;
    window.addEventListener(
      "mousemove",
      (e) => {
        const now = performance.now();
        if (now - last < 70) return;
        last = now;
        const node = trail[idx % MAX];
        idx += 1;
        const rot = (idx % 2 === 0 ? -1 : 1) * (12 + (idx % 5) * 4);
        node.style.left = `${e.clientX - 8}px`;
        node.style.top = `${e.clientY - 8}px`;
        node.style.opacity = "0.55";
        node.style.transform = `rotate(${rot}deg) scale(1)`;
        requestAnimationFrame(() => {
          node.style.transition = "opacity 0.7s ease, transform 0.7s ease";
          node.style.opacity = "0";
          node.style.transform = `rotate(${rot}deg) scale(0.4) translateY(10px)`;
        });
      },
      { passive: true }
    );
  }

  // Parallax-ish glow on hero art
  const art = document.querySelector(".hero-art");
  if (art && canHover && !prefersReduced) {
    art.addEventListener("mousemove", (e) => {
      const rect = art.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      const frame = art.querySelector(".hero-frame");
      if (frame) {
        frame.style.transform = `perspective(800px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg)`;
      }
    });
    art.addEventListener("mouseleave", () => {
      const frame = art.querySelector(".hero-frame");
      if (frame) frame.style.transform = "";
    });
  }
})();
