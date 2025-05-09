import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// import { useAuth } from './context/useAuth'; // Adjust path if different
import { useAuth } from './useAuth'

const RoleBasedRedirect = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  console.log('user data : ',user);
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { replace: true });
    } else if (user?.role === 'admin') {
      navigate('/admin', { replace: true });
    } else {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  return null;
};

export default RoleBasedRedirect;
