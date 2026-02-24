import { useNavigate, useLocation } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    navigate("/");
  };

  return (
     <nav className="navbar">
      <div className="nav-left">
        <img src="/logo.jpg" alt="Jotish Logo" className="nav-logo" />
        <span className="nav-title">JØTISH</span>
      </div>

      {location.pathname === "/list" && (
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      )}
    </nav>
  );
}

export default Navbar;