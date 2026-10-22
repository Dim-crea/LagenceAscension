"use client";

import { useState } from "react";

const encode = (data) =>
  Object.keys(data)
    .map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(data[k])}`)
    .join("&");

const FIELDS = [
  { name: "name", label: "Nom", type: "text", autoComplete: "name" },
  { name: "phone", label: "Numéro de téléphone", type: "tel", autoComplete: "tel" },
  { name: "project", label: "Votre projet", type: "text" },
  { name: "budget", label: "Budget", type: "text" },
];

// Short lead form: name, phone, project, budget.
export default function QuickForm() {
  const [v, setV] = useState({ name: "", phone: "", project: "", budget: "" });
  const [status, setStatus] = useState("idle");
  const on = (e) => setV((s) => ({ ...s, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: encode({ "form-name": "quick", ...v }),
      });
      setStatus(res.ok ? "sent" : "error");
    } catch {
      setStatus("error");
    }
  };

  if (status === "sent")
    return <p className="form_message-success">Merci ! On vous rappelle très vite.</p>;

  return (
    <form className="form_form" name="quick" onSubmit={submit} data-netlify="true" netlify-honeypot="bot-field">
      <input type="hidden" name="form-name" value="quick" />
      <p className="form_hp">
        <label>
          Ne pas remplir <input name="bot-field" tabIndex={-1} onChange={() => {}} />
        </label>
      </p>
      <div className="form_field-list">
        {FIELDS.map((f) => (
          <div className="form_field-root" key={f.name}>
            <input
              id={`quick-${f.name}`}
              name={f.name}
              type={f.type}
              autoComplete={f.autoComplete}
              required={f.name !== "budget"}
              value={v[f.name]}
              onChange={on}
              placeholder=""
              className={`form_input${v[f.name] ? " is-filled" : ""}`}
            />
            <label htmlFor={`quick-${f.name}`} className="form_label">
              {f.label}
              {f.name !== "budget" ? " *" : ""}
            </label>
          </div>
        ))}
        <button type="submit" className="button is-primary is-block" disabled={status === "sending"}>
          {status === "sending" ? "Envoi…" : "Être rappelé"}
        </button>
        {status === "error" && <p className="t-14">Une erreur est survenue — écrivez-nous directement par email.</p>}
      </div>
    </form>
  );
}
