import { NavLink } from "react-router-dom";

export default function NavBar() {
  return (
    <nav className="navbar">
      <div className="navbar__inner">
        <span className="navbar__logo">
          <span>⚡</span> PokéBattle
        </span>
        <ul className="navbar__links">
          <li>
            <NavLink to="/" end className={({ isActive }) => "navbar__link" + (isActive ? " active" : "")}>
               Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/pokedex" className={({ isActive }) => "navbar__link" + (isActive ? " active" : "")}>
               Pokédex
            </NavLink>
          </li>
          <li>
            <NavLink to="/register" className={({ isActive }) => "navbar__link" + (isActive ? " active" : "")}>
               S'inscrire
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
}
