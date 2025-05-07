import styled from 'styled-components';
import { forwardRef, InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  fullWidth?: boolean;
}

const InputContainer = styled.div<{ fullWidth?: boolean }>`
  display: flex;
  flex-direction: column;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  width: ${({ fullWidth }) => (fullWidth ? '100%' : 'auto')};
`;

const StyledInput = styled.input<{ hasError?: boolean }>`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme, hasError }) => 
    hasError ? theme.colors.error : theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  font-size: 1rem;
  outline: none;
  
  &:focus {
    border-color: ${({ theme, hasError }) => 
      hasError ? theme.colors.error : theme.colors.secondary};
    box-shadow: 0 0 0 2px ${({ theme, hasError }) => 
      hasError ? 'rgba(255, 0, 0, 0.2)' : 'rgba(0, 121, 211, 0.2)'};
  }
`;

const ErrorMessage = styled.span`
  color: ${({ theme }) => theme.colors.error};
  font-size: 0.875rem;
  margin-top: ${({ theme }) => theme.spacing.xs};
`;

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ error, fullWidth, ...props }, ref) => {
    return (
      <InputContainer fullWidth={fullWidth}>
        <StyledInput ref={ref} hasError={!!error} {...props} />
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </InputContainer>
    );
  }
);

Input.displayName = 'Input';

export default Input;