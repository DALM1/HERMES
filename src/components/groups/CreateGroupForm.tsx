import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { createGroup } from '../../api/groups';

const FormContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.cardBackground};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  padding: ${({ theme }) => theme.spacing.medium};
  margin-bottom: ${({ theme }) => theme.spacing.medium};
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  margin: 0 auto;
`;

const FormTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.xlarge};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.medium};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.medium};
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xsmall};
`;

const Label = styled.label`
  font-size: ${({ theme }) => theme.fontSizes.medium};
  color: ${({ theme }) => theme.colors.text};
`;

const Input = styled.input`
  padding: ${({ theme }) => theme.spacing.small};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  font-size: ${({ theme }) => theme.fontSizes.medium};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const TextArea = styled.textarea`
  padding: ${({ theme }) => theme.spacing.small};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  font-size: ${({ theme }) => theme.fontSizes.medium};
  min-height: 100px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const Select = styled.select`
  padding: ${({ theme }) => theme.spacing.small};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  font-size: ${({ theme }) => theme.fontSizes.medium};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const FileInput = styled.div`
  position: relative;
`;

const FileInputLabel = styled.label`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.small};
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing.small};
  border: 1px dashed ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.background};
  }
`;

const HiddenInput = styled.input`
  position: absolute;
  width: 0;
  height: 0;
  opacity: 0;
`;

const SubmitButton = styled.button`
  padding: ${({ theme }) => theme.spacing.small};
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  font-size: ${({ theme }) => theme.fontSizes.medium};
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.primary}dd;
  }
  
  &:disabled {
    background-color: ${({ theme }) => theme.colors.disabled};
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.p`
  color: ${({ theme }) => theme.colors.error};
  font-size: ${({ theme }) => theme.fontSizes.small};
`;

const SelectedFile = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.small};
  margin-top: ${({ theme }) => theme.spacing.small};
  padding: ${({ theme }) => theme.spacing.small};
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius.small};
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.error};
  cursor: pointer;
  font-size: ${({ theme }) => theme.fontSizes.medium};
`;

const CreateGroupForm: React.FC = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [privacy, setPrivacy] = useState('public');
  const [avatar, setAvatar] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAvatar(e.target.files[0]);
    }
  };
  
  const removeAvatar = () => {
    setAvatar(null);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError('Le nom du groupe est requis');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError(null);
      
      // Créer un FormData pour l'upload de fichier
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      formData.append('privacy', privacy);
      if (avatar) {
        formData.append('avatar', avatar);
      }
      
      // Utiliser la fonction API réelle pour créer le groupe
      const newGroup = await createGroup(formData);
      
      // Redirection vers la page du groupe après création
      navigate(`/groups/${newGroup.id}`);
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la création du groupe');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <FormContainer>
      <FormTitle>Créer un nouveau groupe</FormTitle>
      
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="name">Nom du groupe</Label>
          <Input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="description">Description</Label>
          <TextArea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="privacy">Confidentialité</Label>
          <Select
            id="privacy"
            value={privacy}
            onChange={(e) => setPrivacy(e.target.value)}
          >
            <option value="public">Public - Tout le monde peut voir et rejoindre</option>
            <option value="private">Privé - Sur invitation uniquement</option>
          </Select>
        </FormGroup>
        
        <FormGroup>
          <Label>Avatar du groupe</Label>
          <FileInput>
            <FileInputLabel>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M17 8L12 3L7 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 3V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {avatar ? 'Changer d\'avatar' : 'Ajouter un avatar'}
              <HiddenInput
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
              />
            </FileInputLabel>
          </FileInput>
          
          {avatar && (
            <SelectedFile>
              <span>{avatar.name}</span>
              <RemoveButton type="button" onClick={removeAvatar}>
                ×
              </RemoveButton>
            </SelectedFile>
          )}
        </FormGroup>
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        <SubmitButton type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Création en cours...' : 'Créer le groupe'}
        </SubmitButton>
      </Form>
    </FormContainer>
  );
};

export default CreateGroupForm;