import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="ld-footer">
      <div className="footer-logo">
        <div className="logo-icon-sm">📍</div>
        ShopFinder
      </div>

      <div className="footer-links">
        <Link to="/about">About</Link>
        <Link to="/privacy">Privacy</Link>
        <Link to="/contact">Contact</Link>
      </div>

      <div className="footer-copy">Made with ❤️ for India · 2024</div>
    </footer>
  );
}

export default Footer;