function presentKeyScrolling(event) {
  if (
    (event.key == "ArrowDown" || event.key == "ArrowUp" || event.key == " ") &&
    event.target == document.body
  ) {
    event.preventDefault();
  }
}

export class PreventKeyScrolling {
  static on() {
    window.addEventListener("keydown", presentKeyScrolling);
  }

  static off() {
    window.removeEventListener("keydown", presentKeyScrolling);
  }
}
