import { STEPS } from "../../data/landingData";

function HowItWorks() {
  return (
    <div className="ld-how" id="how-it-works">
      <div className="how-inner">
        <div className="section-tag">Simple as 1-2-3</div>
        <h2>How it works</h2>

        <div className="ld-steps-grid">
          {STEPS.map((s) => (
            <div key={s.num} className="step reveal">
              <div className="step-num">{s.num}</div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default HowItWorks;