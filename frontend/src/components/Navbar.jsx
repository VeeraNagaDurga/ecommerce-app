import { useContext } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext.jsx';

const Navbar = () => {
  const { auth, logout } = useContext(AuthContext);
  const cartCount = auth.user ? 'Cart' : 'Cart';

  return (
    <header className="navbar-container">
      <div className="brand-group">
        <Link to="/" className="brand-logo">Modern Shop</Link>
        <p className="brand-tag">Clean ecommerce experience</p>
      </div>
      <nav className="nav-links">
        <NavLink to="/" end>Home</NavLink>
        {auth.user && <NavLink to="/cart">{cartCount}</NavLink>}
        {auth.user && <NavLink to="/orders">Orders</NavLink>}
        {auth.user?.role === 'admin' && <NavLink to="/admin">Admin</NavLink>}
        {auth.user ? (
          <button className="nav-button" onClick={logout}>Logout</button>
        ) : (
          <div className="auth-links">
            <NavLink to="/login">Login</NavLink>
            <NavLink to="/register">Register</NavLink>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
