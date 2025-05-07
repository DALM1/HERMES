import React from 'react';
import styled from 'styled-components';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

interface MainLayoutProps {
  children: React.ReactNode;
}

const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
`;

const Content = styled.main`
  flex: 1;
  margin-left: 250px;
  padding: 80px 20px 20px;
`;

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <LayoutContainer>
      <Navbar />
      <Sidebar />
      <Content>{children}</Content>
    </LayoutContainer>
  );
};

export default MainLayout;