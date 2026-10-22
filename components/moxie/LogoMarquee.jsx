import { wordmarkClass } from "@/lib/rich";

// Infinite client strip with faded edges. Client names are set as typographic wordmarks.
export default function LogoMarquee({ names }) {
  if (!names?.length) return null;
  const list = names.length < 6 ? [...names, ...names, ...names] : names;
  const line = (hidden) => (
    <ul className="home-hero_marque-line" aria-hidden={hidden || undefined}>
      {list.map((n, i) => (
        <li className="home-hero_marque-logo" key={`${n}-${i}`}>
          <span className={wordmarkClass(n)}>{n}</span>
        </li>
      ))}
    </ul>
  );
  return (
    <div className="padding-global">
      <div className="home-hero_marque">
        {line(false)}
        {line(true)}
        {line(true)}
      </div>
    </div>
  );
}
