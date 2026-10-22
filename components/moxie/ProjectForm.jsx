"use client";

import { useState } from "react";

const TYPES = ["Vidéo de marque", "Accompagnement image", "Photographie", "Événementiel", "Mariage", "Autre"];
const encode = (data) =>
  Object.keys(data)
    .map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(data[k])}`)
    .join("&");

function Field({ name, label, value, onChange, type = "text", required, area }) {
  const Tag = area ? "textarea" : "input";
  return (
    <div className="form_field-root">
      <Tag
        id={name}
        name={name}
        type={area ? undefined : type}
        required={required}
        value={value}
        onChange={onChange}
        placeholder=""
        className={`form_input${area ? " is-text-area" : ""}${value ? " is-filled" : ""}`}
      />
      <label htmlFor={name} className={`form_label${area ? " is-text-area" : ""}`}>
        {label}
        {required ? " *" : ""}
      </label>
    </div>
  );
}

export default function ProjectForm({ defaultType = "" }) {
  const [v, setV] = useState({
    company: "",
    name: "",
    phone: "",
    email: "",
    website: "",
    startDate: "",
    budget: "",
    budgetType: "Par projet",
    source: "",
    message: "",
  });
  const [types, setTypes] = useState(defaultType ? [defaultType] : []);
  const [status, setStatus] = useState("idle");
  const on = (e) => setV((s) => ({ ...s, [e.target.name]: e.target.value }));
  const toggle = (t) => setTypes((l) => (l.includes(t) ? l.filter((x) => x !== t) : [...l, t]));

  const submit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    try {
      await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: encode({ "form-name": "contact", ...v, types: types.join(", ") }),
      });
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  if (status === "sent")
    return <p className="form_message-success">Merci ! Votre message est bien arrivé — on revient vers vous sous 24h.</p>;

  return (
    <form className="form_form" name="contact" onSubmit={submit} data-netlify="true" netlify-honeypot="bot-field">
      <input type="hidden" name="form-name" value="contact" />
      <p className="form_hp">
        <label>
          Ne pas remplir <input name="bot-field" tabIndex={-1} onChange={() => {}} />
        </label>
      </p>
      <div className="form_field-list">
        <Field name="company" label="Entreprise" value={v.company} onChange={on} />
        <Field name="name" label="Votre nom" value={v.name} onChange={on} required />
        <Field name="phone" label="Téléphone" type="tel" value={v.phone} onChange={on} required />
        <Field name="email" label="Adresse email" type="email" value={v.email} onChange={on} required />
        <Field name="website" label="Site web ou Instagram" value={v.website} onChange={on} />
        <Field name="startDate" label="Date de démarrage souhaitée" value={v.startDate} onChange={on} />
        <div className="form_field-list" style={{ gap: "0.5rem" }}>
          <Field name="budget" label="Budget estimé" value={v.budget} onChange={on} />
          <div className="form_radio-group">
            {["Par projet", "Par mois"].map((o) => (
              <label className="form_radio" key={o}>
                <input type="radio" name="budgetType" value={o} checked={v.budgetType === o} onChange={on} />
                <span className="form_radio-icon" />
                <span>{o}</span>
              </label>
            ))}
          </div>
        </div>
        <div>
          <p className="t-14" style={{ opacity: 0.6, marginBottom: "0.6rem" }}>Type de projet</p>
          <div className="filter_pills">
            {TYPES.map((t) => (
              <button type="button" key={t} className={`pill${types.includes(t) ? " is-active" : ""}`} onClick={() => toggle(t)} aria-pressed={types.includes(t)}>
                {t}
              </button>
            ))}
          </div>
        </div>
        <Field name="source" label="Comment nous avez-vous connus ?" value={v.source} onChange={on} />
        <Field name="message" label="Que devons-nous savoir d'autre ?" value={v.message} onChange={on} area />
        <button type="submit" className="button is-primary is-block" disabled={status === "sending"}>
          {status === "sending" ? "Envoi…" : "Envoyer"}
        </button>
        {status === "error" && <p className="t-14">Une erreur est survenue — écrivez-nous directement par email.</p>}
      </div>
    </form>
  );
}
