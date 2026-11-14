// Vercel Node.js Serverless Function entry point (Milestone 3 / PBI-13
// production integration fix — see documentation/api-contract.md).
//
// This file deploys the existing Express mock API (src/mocks/mockServer.mjs)
// as a real Vercel backend instead of duplicating its routes, validation, or
// response formats here.
//
// NOTE: an earlier version of this file used Vercel's filesystem catch-all
// naming convention (api/[...path].mjs) to match every /api/* subpath with
// zero vercel.json configuration. That convention is unreliable for
// multi-level nested paths (e.g. /api/v1/advocate-inquiries, which is two
// segments deep) and produced a hard 404 NOT_FOUND on the Vercel preview
// deployment instead of reaching this function. The supported, reliable
// pattern is a single, non-dynamic entry point ("index") combined with an
// explicit vercel.json rewrite that forwards all /api/* requests to this
// function's canonical URL, "/api/index" (Vercel serves a Function at its
// filename with the extension stripped — see
// https://vercel.com/docs/build-output-api/primitives#functions) — the
// rewrite preserves the original request path/method/body, so the Express
// app's own full-path routes (e.g. app.post("/api/v1/advocate-inquiries",
// ...)) still match unchanged.
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
