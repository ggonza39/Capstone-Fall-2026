// Vercel Node.js Serverless Function entry point (Milestone 3 / PBI-13
// production integration fix — see documentation/api-contract.md).
//
// This file deploys the existing Express mock API (src/mocks/mockServer.mjs)
// as a real Vercel backend instead of duplicating its routes, validation, or
// response formats here. The catch-all filename ("[...path]") is Vercel's
// zero-config file-system routing convention: it makes this function the
// handler for every request under /api/* (e.g. /api/v1/advocate-inquiries,
// /api/workshops/123) without needing a vercel.json rewrite, and — just as
// importantly — Vercel passes this function the full, unmodified request
// URL (including the "/api" prefix), which is exactly what the Express
// app's routes (e.g. app.post("/api/v1/advocate-inquiries", ...)) expect.
//
// The ".mjs" extension forces Node/Vercel to parse this file as an ES module
// regardless of package.json's "type" field (see src/mocks/mockServer.mjs
// for the same convention), since this project's package.json currently has
// a "type:" typo instead of "type", so plain ".js" files here otherwise
// default to CommonJS.
//
// An Express app instance is itself a valid (req, res) request handler, so
// no additional adapter (e.g. serverless-http) is required: Vercel invokes
// this default export directly with the incoming request and response.
import app from "../src/mocks/mockServer.mjs";

export default app;
