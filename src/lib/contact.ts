export function focusContact() {
  window.setTimeout(() => {
    document.getElementById("connect-title")?.scrollIntoView({ block: "start" });
    document
      .querySelector<HTMLInputElement>(
        '[data-panel="about"] form input[autocomplete="name"]',
      )
      ?.focus({ preventScroll: true });
  }, 400);
}
