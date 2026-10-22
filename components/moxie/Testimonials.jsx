"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { useRef, useState } from "react";

const QUOTE = (
  <svg viewBox="0 0 24 18" aria-hidden="true">
    <path d="M0 18V10.4C0 4.4 3.4.9 9 0l.8 2.3C6.6 3.5 5.2 5.2 5 8h4.8v10H0Zm14.2 0V10.4c0-6 3.4-9.5 9-10.4l.8 2.3c-3.2 1.2-4.6 2.9-4.8 5.7H24v10H14.2Z" />
  </svg>
);
const ARROW = (dir) => (
  <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
    <path d={dir === "prev" ? "M8 1 3 6l5 5" : "M4 1l5 5-5 5"} />
  </svg>
);

export default function Testimonials({ title, items }) {
  const list = items.filter((t) => t.published !== false);
  const [nav, setNav] = useState({ prev: null, next: null });
  const prev = useRef(null);
  const next = useRef(null);
  if (!list.length) return null;

  return (
    <section className="section_testimonials">
      <div className="padding-global padding-section-large">
        <div className="container-large">
          <div className="testimonials_content">
            <div className="testimonials_header">
              <h2 className="hd-32">{title}</h2>
              <div className="swiper-navigation">
                <button ref={prev} className="swiper-arrow" aria-label="Avis précédent">
                  {ARROW("prev")}
                </button>
                <button ref={next} className="swiper-arrow" aria-label="Avis suivant">
                  {ARROW("next")}
                </button>
              </div>
            </div>
            <Swiper
              className="testimonials_swiper"
              modules={[Navigation]}
              speed={800}
              navigation={{ prevEl: prev.current, nextEl: next.current }}
              onBeforeInit={(sw) => {
                sw.params.navigation.prevEl = prev.current;
                sw.params.navigation.nextEl = next.current;
              }}
              breakpoints={{ 0: { slidesPerView: "auto", spaceBetween: 18 }, 768: { slidesPerView: 2, spaceBetween: 18 } }}
            >
              {list.map((t) => (
                <SwiperSlide key={t.id}>
                  <div className="testimonials_card-copy">
                    <div className="testimonials_card-txt is-top">
                      <div className="testimonials_card-icon">{QUOTE}</div>
                      <p className="t-18">{t.quote}</p>
                    </div>
                    <div className="testimonials_card-txt">
                      <p className="t-14 t-medium" style={{ lineHeight: 1 }}>{t.name}</p>
                      <p className="t-14 opacity-50" style={{ lineHeight: 1 }}>{t.role}</p>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
    </section>
  );
}
