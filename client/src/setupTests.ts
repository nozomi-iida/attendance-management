// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";

Object.defineProperty(window, "matchMedia", {
  value: () => ({
    matches: false,
    addListener: jest.fn(),
    removeListener: jest.fn(),
  }),
});

// https://github.com/yiminghe/async-validator/issues/92
const { warn } = console;
// eslint-disable-next-line no-console
console.warn = (...args: any[]) => {
  if (typeof args[0] === "string" && args[0].startsWith("async-validator:"))
    return;

  warn(...args);
};
