"use strict";

const { useEffect } = React;

const useOutsideClick = (ref, handler) => {
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        handler();
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [ref]);
};

const trackMatomoEvent = (category, action, name, value, dimensions) => {
  if (typeof _paq !== "undefined") {
    _paq.push(["trackEvent", category, action, name, value, dimensions]);
  }
};

const useMatomo = () => {
  const trackEvent = trackMatomoEvent;

  return { trackEvent };
};
