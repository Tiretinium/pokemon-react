import { NavLink } from "react-router-dom";

export default function NavBar() {
  return (
    <nav className="navbar">
      <div className="navbar__inner">
        <NavLink to="/" className="navbar__logo">
          <span className="navbar__logo-icon">⚡</span>
          <span className="navbar__logo-text">Poké<span className="navbar__logo-accent">Battle</span></span>
        </NavLink>
        <ul className="navbar__links">
          <li>
            <NavLink to="/" end className={({ isActive }) => "navbar__link" + (isActive ? " active" : "")}>
              <svg className="navbar__link-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 9.5V20a1 1 0 001 1h6v-6h6v6h6a1 1 0 001-1V9.5L12 2z"/>
              </svg>
              <span>Accueil</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/pokedex" className={({ isActive }) => "navbar__link" + (isActive ? " active" : "")}>
              <svg className="navbar__link-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="2" y1="12" x2="22" y2="12"/>
                <circle cx="12" cy="12" r="3" fill="currentColor" stroke="none"/>
              </svg>
              <span>Pokédex</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/register" className={({ isActive }) => "navbar__link" + (isActive ? " active" : "")}>
              <svg className="navbar__link-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              <span>S'inscrire</span>
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
}
