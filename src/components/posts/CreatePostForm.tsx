import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { createPost } from '../../api/posts';
import { fetchUserGroups } from '../../api/groups';

const FormContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.cardBackground};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  padding: ${({ theme }) => theme.spacing.medium};
  margin-bottom: ${({ theme }) => theme.spacing.medium};
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.small};
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
  margin-top: ${({ theme }) => theme.spacing.small};
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

interface Group {
  id: string;
  name: string;
}

const CreatePostForm: React.FC = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [groupId, setGroupId] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userGroups, setUserGroups] = useState<Group[]>([]);
  const navigate = useNavigate();
  const { user } = useAuth();
  
  React.useEffect(() => {
    // Charger les groupes de l'utilisateur
    const fetchGroups = async () => {
      try {
        const groups = await fetchUserGroups();
        setUserGroups(groups);
      } catch (err) {
        console.error('Erreur lors du chargement des groupes:', err);
      }
    };
    
    fetchGroups();
  }, []);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };
  
  const removeFile = () => {
    setFile(null);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError('Le titre est requis');
      return;
    }
    
    if (!groupId) {
      setError('Veuillez sélectionner un groupe');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError(null);
      
      // Créer un FormData pour l'upload de fichier
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      formData.append('groupId', groupId);
      if (file) {
        formData.append('media', file);
      }
      
      // Utiliser la fonction API réelle pour créer le post
      const newPost = await createPost(formData);
      
      // Redirection vers la page d'accueil après création
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la création du post');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <FormContainer>
      <Form onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="Titre du post"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        
        <TextArea
          placeholder="Contenu du post"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        
        <Select
          value={groupId}
          onChange={(e) => setGroupId(e.target.value)}
          required
        >
          <option value="">Sélectionner un groupe</option>
          {userGroups.map((group) => (
            <option key={group.id} value={group.id}>
              {group.name}
            </option>
          ))}
        </Select>
        
        <FileInput>
          <FileInputLabel>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M17 8L12 3L7 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 3V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {file ? 'Changer de fichier' : 'Ajouter une image ou vidéo'}
            <HiddenInput
              type="file"
              accept="image/*,video/*"
              onChange={handleFileChange}
            />
          </FileInputLabel>
        </FileInput>
        
        {file && (
          <SelectedFile>
            <span>{file.name}</span>
            <RemoveButton type="button" onClick={removeFile}>
              ×
            </RemoveButton>
          </SelectedFile>
        )}
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        <SubmitButton type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Publication en cours...' : 'Publier'}
        </SubmitButton>
      </Form>
    </FormContainer>
  );
};

export default CreatePostForm;