import { useEffect, useRef, useState } from "react";
import { STATS } from "../../data/landingData";

function AnimatedNumber({ target }) {
  const [value, setValue] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const step = target / 50;
          let n = 0;
          const iv = setInterval(() => {
            n += step;
            if (n >= target) { setValue(target); clearInterval(iv); }
            else setValue(Math.floor(n));
          }, 20);
        }
      },
      { threshold: 0.2 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target]);

  return <span ref={ref}>{value.toLocaleString("en-IN")}</span>;
}

function StatsBar() {
  return (
    <div className="stats-strip">
      {STATS.map((s) => (
        <div key={s.label} className="stat-item">
          <div className={`stat-icon ${s.colorClass}`}>{s.icon}</div>
          <div>
            <div className="stat-val">
              {s.staticVal ? (
                s.staticVal
              ) : (
                <>
                  <AnimatedNumber target={s.value} />
                  {s.suffix}
                </>
              )}
            </div>
            <div className="stat-label">{s.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default StatsBar;