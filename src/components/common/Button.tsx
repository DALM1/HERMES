import styled from 'styled-components';
import { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
}

const getButtonStyles = (variant: string, theme: any) => {
  switch (variant) {
    case 'secondary':
      return `
        background-color: ${theme.colors.secondary};
        color: white;
      `;
    case 'outline':
      return `
        background-color: transparent;
        color: ${theme.colors.primary};
        border: 1px solid ${theme.colors.primary};
        
        &:hover {
          background-color: ${theme.colors.primary}10;
        }
      `;
    default:
      return `
        background-color: ${theme.colors.primary};
        color: white;
      `;
  }
};

const getButtonSize = (size: string, theme: any) => {
  switch (size) {
    case 'small':
      return `
        padding: ${theme.spacing.xsmall} ${theme.spacing.small};
        font-size: ${theme.fontSizes.small};
      `;
    case 'large':
      return `
        padding: ${theme.spacing.medium} ${theme.spacing.large};
        font-size: ${theme.fontSizes.large};
      `;
    default:
      return `
        padding: ${theme.spacing.small} ${theme.spacing.medium};
        font-size: ${theme.fontSizes.medium};
      `;
  }
};

const StyledButton = styled.button<ButtonProps>`
  ${({ variant = 'primary', theme }) => getButtonStyles(variant, theme)}
  ${({ size = 'medium', theme }) => getButtonSize(size, theme)}
  
  width: ${({ fullWidth }) => (fullWidth ? '100%' : 'auto')};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    opacity: 0.9;
  }
  
  &:disabled {
    background-color: ${({ theme }) => theme.colors.disabled};
    cursor: not-allowed;
  }
`;

const Button = ({ children, ...props }: ButtonProps) => {
  return <StyledButton {...props}>{children}</StyledButton>;
};

export default Button;