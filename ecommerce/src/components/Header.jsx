import { NavLink, Link, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";

function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="header">
      <Link to={user ? "/" : "/login"} className="logo">
        CYBER<span>MERCE</span>
      </Link>

      <nav className="navigation">
        {user ? (
          <>
            <NavLink to="/" end>
              <span>⌂</span> Products
            </NavLink>

            <NavLink to="/my-products">
              <span>▦</span> My Products
            </NavLink>

            <NavLink to="/cart">
              <span>🛒</span> Cart
            </NavLink>

            <NavLink to="/my-orders">
              <span>▤</span> My Orders
            </NavLink>

            <NavLink to="/profile">
              <span>◉</span> Profile
            </NavLink>

            <button className="logout-button" onClick={handleLogout}>
              LOGOUT <span>↗</span>
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login">Login</NavLink>
            <NavLink to="/register">Register</NavLink>
          </>
        )}
      </nav>
    </header>
  );
}

export default Header;
