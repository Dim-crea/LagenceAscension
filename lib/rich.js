import { createElement, Fragment } from "react";

// "Votre jour, *raconté comme un film*" → italic accent phrase.
export function renderEm(text = "") {
  return String(text)
    .split("*")
    .map((part, i) => (i % 2 === 1 ? createElement("em", { key: i }, part) : createElement(Fragment, { key: i }, part)));
}

export const splitList = (s = "") =>
  String(s)
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);

// Deterministic "wordmark" style so each client name gets its own typographic identity.
export function wordmarkClass(name = "") {
  let h = 0;
  for (const c of name) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return ["wm-a", "wm-b", "wm-c", "wm-d"][h % 4];
}
