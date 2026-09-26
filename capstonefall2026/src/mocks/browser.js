import { setupWorker } from "msw/browser";
import { handlers } from "./handlers";

/**
 * Browser-side MSW worker (PBI-4, Acceptance Criterion 3).
 * Started conditionally from src/index.js — see enableMocking() there.
 */
export const worker = setupWorker(...handlers);
