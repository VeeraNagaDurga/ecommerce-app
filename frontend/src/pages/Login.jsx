import { useContext, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { loginUser } from '../services/authService.js';
import { AuthContext } from '../contexts/AuthContext.jsx';

const Login = () => {
  const { setAuth } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const submitLogin = async (event) => {
    event.preventDefault();
    try {
      const data = await loginUser({ email, password });
      setAuth({ token: data.token, user: data.user });
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <section className="auth-page">
      <div className="auth-panel">
        <h2>Login</h2>
        {error && <div className="flash-message error">{error}</div>}
        <form onSubmit={submitLogin}>
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button className="button button-primary" type="submit">Login</button>
        </form>
        <p className="auth-note">
          New here? <Link to="/register">Create an account</Link>
        </p>
      </div>
    </section>
  );
};

export default Login;
