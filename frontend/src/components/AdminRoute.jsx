import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext.jsx';

const AdminRoute = ({ children }) => {
  const { auth } = useContext(AuthContext);
  if (!auth.user || auth.user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }
  return children;
};

export default AdminRoute;
