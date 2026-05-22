import { TESTIMONIALS } from "../../data/landingData";

function Testimonials() {
  return (
    <section className="ld-section reveal" id="reviews">
      <div className="section-tag">People love it</div>
      <h2>What users say</h2>

      <div className="ld-testi-grid">
        {TESTIMONIALS.map((t) => (
          <div key={t.name} className="testi-card reveal">
            <div className="testi-stars">★★★★★</div>
            <p className="testi-text">"{t.text}"</p>
            <div className="testi-author">
              <div className={`testi-avatar ${t.avatarClass}`}>{t.initials}</div>
              <div>
                <div className="testi-name">{t.name}</div>
                <div className="testi-role">{t.role}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Testimonials;