import React from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const NavbarContainer = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  background-color: ${({ theme }) => theme.colors.cardBackground};
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  padding: 0 ${({ theme }) => theme.spacing.medium};
  z-index: 1000;
`;

const Logo = styled(Link)`
  font-size: ${({ theme }) => theme.fontSizes.xlarge};
  font-weight: bold;
  color: ${({ theme }) => theme.colors.primary};
  margin-right: auto;
`;

const NavActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.medium};
`;

const UserAvatar = styled.img`
  width: 36px;
  height: 36px;
  border-radius: ${({ theme }) => theme.borderRadius.circle};
  cursor: pointer;
`;

const Button = styled.button`
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  padding: ${({ theme }) => `${theme.spacing.tiny} ${theme.spacing.small}`};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  font-weight: 500;
  font-size: ${({ theme }) => theme.fontSizes.medium};
  transition: background-color 0.2s;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.primary}dd;
  }
`;

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <NavbarContainer>
      <Logo to="/">Hermes</Logo>
      
      <NavActions>
        {user ? (
          <>
            <UserAvatar 
              src={user.avatar || 'https://via.placeholder.com/36'} 
              alt={user.username}
              onClick={() => navigate(`/profile/${user.id}`)}
            />
            <Button onClick={handleLogout}>Déconnexion</Button>
          </>
        ) : (
          <>
            <Button onClick={() => navigate('/login')}>Connexion</Button>
            <Button onClick={() => navigate('/register')}>Inscription</Button>
          </>
        )}
      </NavActions>
    </NavbarContainer>
  );
};

export default Navbar;