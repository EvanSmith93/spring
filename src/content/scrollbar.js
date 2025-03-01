const style = document.createElement("style");
style.setAttribute("no-scrollbar-style", "");
style.textContent = `
        body::-webkit-scrollbar {
            display: none;
        }
    `;

export class ScrollbarHider {
  static on() {
    document.head.appendChild(style);
  }

  static off() {
    document
      .querySelectorAll("[no-scrollbar-style]")
      .forEach((e) => e.remove());
  }
}
