function getLimitScroll(action, force) {
  return function limitScroll(event) {
    const root = document.documentElement;

    switch (action) {
      case "spring": {
        event.preventDefault();
        let scrollSpeedY = event.deltaY;

        if (scrollSpeedY > 0) {
          const scrollFactor = force / (force + root.scrollTop ** 1.3);
          scrollSpeedY *= scrollFactor;
        }

        root.scrollBy(0, scrollSpeedY);

        break;
      }
      case "fade": {
        const opacity = Math.min(1, force / (force + root.scrollTop ** 1.1));
        root.style.opacity = opacity;

        break;
      }
    }
  };
}

export class WheelLimiter {
  static limitScroll;

  static on(action, force) {
    this.limitScroll = getLimitScroll(action, force);

    window.addEventListener("wheel", this.limitScroll, { passive: false });
  }

  static off() {
    window.removeEventListener("wheel", this.limitScroll);
    document.documentElement.style.opacity = 1;
  }
}
