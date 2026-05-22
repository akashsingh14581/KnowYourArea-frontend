import { Link } from "react-router-dom";

function CTA() {
  return (
    <section className="ld-cta-section reveal">
      <div className="cta-orb" />
      <div className="ld-cta-card">
        <h2>Start finding shops now</h2>
        <p>Free forever. No account needed. Works on any device.</p>
        <div className="cta-btns">
          <Link to="/map" className="btn-primary">
            🗺 Open the Map
          </Link>
          <Link to="/create-shop" className="btn-ghost">
            ＋ List Your Shop
          </Link>
        </div>
      </div>
    </section>
  );
}

export default CTA;