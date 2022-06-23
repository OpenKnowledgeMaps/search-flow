export const trackMatomoEvent = (category, action, name, value, dimensions) => {
  // _paq is a global variable defined by the matomo script
  if (typeof _paq !== "undefined") {
    _paq.push(["trackEvent", category, action, name, value, dimensions]);
  }
};

const useMatomo = () => {
  const trackEvent = trackMatomoEvent;

  return { trackEvent };
};

export default useMatomo;
