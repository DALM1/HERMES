import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import styled from 'styled-components';
import { LoginFormData, loginSchema } from '../../types/auth';
import Input from '../common/Input';
import Button from '../common/Button';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 400px;
  padding: ${({ theme }) => theme.spacing.lg};
  background-color: ${({ theme }) => theme.colors.cardBackground};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const FormTitle = styled.h2`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  color: ${({ theme }) => theme.colors.text};
  text-align: center;
`;

const ErrorAlert = styled.div`
  padding: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  background-color: rgba(255, 0, 0, 0.1);
  color: ${({ theme }) => theme.colors.error};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  text-align: center;
`;

const LoginForm = () => {
  const [apiError, setApiError] = useState<string | null>(null);
  const navigate = useNavigate();
  
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setApiError(null);
      // Ici, vous feriez un appel API pour vous connecter
      // Exemple: await login(data.email, data.password);
      console.log('Login data:', data);
      navigate('/'); // Redirection vers la page d'accueil après connexion
    } catch (error) {
      setApiError('Échec de la connexion. Veuillez vérifier vos identifiants.');
      console.error('Login error:', error);
    }
  };

  return (
    <FormContainer onSubmit={handleSubmit(onSubmit)}>
      <FormTitle>Connexion</FormTitle>
      
      {apiError && <ErrorAlert>{apiError}</ErrorAlert>}
      
      <Input
        type="email"
        placeholder="Email"
        fullWidth
        {...register('email')}
        error={errors.email?.message}
      />
      
      <Input
        type="password"
        placeholder="Mot de passe"
        fullWidth
        {...register('password')}
        error={errors.password?.message}
      />
      
      <Button type="submit" fullWidth>Se connecter</Button>
    </FormContainer>
  );
};

export default LoginForm;