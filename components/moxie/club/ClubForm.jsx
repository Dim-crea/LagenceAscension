"use client";

import { useState } from "react";

const encode = (d) => Object.keys(d).map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(d[k])}`).join("&");

function F({ name, label, value, onChange, type = "text", required, area }) {
  const Tag = area ? "textarea" : "input";
  return (
    <div className="form_field-root">
      <Tag id={`club-${name}`} name={name} type={area ? undefined : type} required={required} value={value} onChange={onChange} placeholder="" className={`form_input${area ? " is-text-area" : ""}${value ? " is-filled" : ""}`} />
      <label htmlFor={`club-${name}`} className={`form_label${area ? " is-text-area" : ""}`}>{label}{required ? " *" : ""}</label>
    </div>
  );
}

export default function ClubForm() {
  const [v, setV] = useState({ name: "", email: "", activity: "", link: "", message: "" });
  const [status, setStatus] = useState("idle");
  const on = (e) => setV((s) => ({ ...s, [e.target.name]: e.target.value }));
  const submit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    try {
      await fetch("/", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: encode({ "form-name": "club", ...v }) });
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };
  if (status === "sent") return <p className="form_message-success">Bienvenue dans la cordée ! On vous écrit très vite.</p>;
  return (
    <form className="form_form" name="club" onSubmit={submit} data-netlify="true" netlify-honeypot="bot-field">
      <input type="hidden" name="form-name" value="club" />
      <p className="form_hp"><label>Ne pas remplir <input name="bot-field" tabIndex={-1} onChange={() => {}} /></label></p>
      <div className="form_field-list">
        <F name="name" label="Votre nom" value={v.name} onChange={on} required />
        <F name="email" label="Adresse email" type="email" value={v.email} onChange={on} required />
        <F name="activity" label="Votre activité" value={v.activity} onChange={on} required />
        <F name="link" label="Site web ou Instagram" value={v.link} onChange={on} />
        <F name="message" label="Pourquoi voulez-vous rejoindre le club ?" value={v.message} onChange={on} area />
        <button type="submit" className="button is-primary is-block" disabled={status === "sending"}>{status === "sending" ? "Envoi…" : "Demander à rejoindre le club"}</button>
        {status === "error" && <p className="t-14">Une erreur est survenue — écrivez-nous directement par email.</p>}
      </div>
    </form>
  );
}
