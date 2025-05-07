import styled from 'styled-components';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
  showSidebar?: boolean;
}

const LayoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const MainContent = styled.div<{ showSidebar?: boolean }>`
  display: flex;
  flex: 1;
`;

const ContentWrapper = styled.main`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.md};
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
`;

const Layout = ({ children, showSidebar = true }: LayoutProps) => {
  return (
    <LayoutContainer>
      <Navbar />
      <MainContent showSidebar={showSidebar}>
        {showSidebar && <Sidebar />}
        <ContentWrapper>{children}</ContentWrapper>
      </MainContent>
    </LayoutContainer>
  );
};

export default Layout;