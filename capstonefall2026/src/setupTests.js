// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// jsdom (bundled with Jest 27, used by react-scripts 5) does not expose
// TextEncoder/TextDecoder, which react-router-dom v7 requires at import time.
import { TextEncoder, TextDecoder } from "node:util";

if (typeof global.TextEncoder === "undefined") {
    Object.assign(global, { TextEncoder, TextDecoder });
}
