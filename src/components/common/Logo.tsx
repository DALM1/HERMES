import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
}

const LogoContainer = styled(Link)<LogoProps>`
  display: flex;
  align-items: center;
  text-decoration: none;
  margin-bottom: ${props => props.size === 'large' ? '2rem' : '0'};
`;

const LogoIcon = styled.div<LogoProps>`
  font-size: ${props => {
    switch (props.size) {
      case 'small': return '1.5rem';
      case 'large': return '3rem';
      default: return '2rem';
    }
  }};
  font-weight: bold;
  color: ${props => props.theme.colors.primary};
  margin-right: 0.5rem;
`;

const LogoText = styled.span<LogoProps>`
  font-size: ${props => {
    switch (props.size) {
      case 'small': return '1.25rem';
      case 'large': return '2.5rem';
      default: return '1.75rem';
    }
  }};
  font-weight: bold;
  color: ${props => props.theme.colors.textPrimary};
`;

const Logo: React.FC<LogoProps> = ({ size = 'medium' }) => {
  return (
    <LogoContainer to="/" size={size}>
      <LogoIcon size={size}>H</LogoIcon>
      <LogoText size={size}>Hermes</LogoText>
    </LogoContainer>
  );
};

export default Logo;