import { Link as RouterLink } from "react-router-dom";


function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="site-container">
        <div className="site-footer-content">
          <p className="site-footer-name">
            TechSmart Learning for Seniors
          </p>
          <nav aria-label="Footer navigation" className="site-footer-navigation">
            <RouterLink to="/need-help">
              I Need Help
            </RouterLink>
            <RouterLink to="/want-to-help">
              I Want to Help
            </RouterLink>
            <RouterLink to="/resources">
              Resources
            </RouterLink>
            <RouterLink to="/contact">
              Contact
            </RouterLink>
          </nav>
          <p className="site-footer-copyright">
            © {currentYear} TechSmart Learning for Seniors
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
