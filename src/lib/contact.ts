export function focusContact() {
  window.setTimeout(() => {
    const target = document.getElementById("connect-title");
    const box = document.querySelector<HTMLElement>("main .hud-scroll");
    if (target && box) {
      const delta =
        target.getBoundingClientRect().top - box.getBoundingClientRect().top;
      box.scrollTo({ top: box.scrollTop + delta - 8 });
    }
    document
      .querySelector<HTMLInputElement>(
        '[data-panel="about"] form input[autocomplete="name"]',
      )
      ?.focus({ preventScroll: true });
  }, 400);
}
