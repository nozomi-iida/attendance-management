export const ApiHost = (() => {
  switch (process.env.REACT_APP_ENV) {
    default:
      return "http://localhost:8080";
  }
})();
