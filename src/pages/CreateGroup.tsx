import React from 'react';
import styled from 'styled-components';
import MainLayout from '../components/layout/MainLayout';
import CreateGroupForm from '../components/groups/CreateGroupForm';

const PageContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const PageTitle = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes.xxlarge};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.medium};
`;

const CreateGroup: React.FC = () => {
  return (
    <MainLayout>
      <PageContainer>
        <PageTitle>Créer un nouveau groupe</PageTitle>
        <CreateGroupForm />
      </PageContainer>
    </MainLayout>
  );
};

export default CreateGroup;