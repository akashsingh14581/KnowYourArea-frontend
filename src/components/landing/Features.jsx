import { FEATURES } from "../../data/landingData";

function Features() {
  return (
    <section className="ld-section">
      <h2>Features</h2>

      <div className="ld-features-grid">
        {FEATURES.map((f, i) => (
          <div key={i} className="ld-feat-card">
            <div className={`ld-feat-icon ${f.color}`}>
              {f.icon}
            </div>
            <h3>{f.title}</h3>
            <p>{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Features;