"use client";

import { useState } from "react";

export default function Accordion({ items }) {
  const [open, setOpen] = useState(null);
  const list = (items || []).filter((f) => f.published !== false);
  if (!list.length) return null;
  return (
    <div className="faq_list">
      {list.map((f) => (
        <div className={`faq_item${open === f.id ? " is-open" : ""}`} key={f.id}>
          <button type="button" className="faq_q" aria-expanded={open === f.id} onClick={() => setOpen(open === f.id ? null : f.id)}>
            {f.question}
            <span className="faq_icon" aria-hidden="true" />
          </button>
          <div className="faq_a">
            <div>
              <p>{f.answer}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
