import { useContext, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../services/authService.js';
import { AuthContext } from '../contexts/AuthContext.jsx';

const Register = () => {
  const { setAuth } = useContext(AuthContext);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [role, setRole] = useState('user');
  const navigate = useNavigate();

  const submitRegister = async (event) => {
    event.preventDefault();
    try {
      const data = await registerUser({ name, email, password, role });
      setAuth({ token: data.token, user: data.user });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <section className="auth-page">
      <div className="auth-panel">
        <h2>Create Account</h2>
        {error && <div className="flash-message error">{error}</div>}
        <form onSubmit={submitRegister}>
          <label>Name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <label>Role</label>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          <button className="button button-primary" type="submit">Register</button>
        </form>
        <p className="auth-note">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </section>
  );
};

export default Register;
