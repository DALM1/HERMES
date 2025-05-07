import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import { Group } from '../../schemas';
import { fetchUserGroups } from '../../api/groups';

const SidebarContainer = styled.div`
  width: 250px;
  background-color: ${({ theme }) => theme.colors.cardBackground};
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  padding-top: 60px;
  border-right: 1px solid ${({ theme }) => theme.colors.border};
  overflow-y: auto;
`;

const SidebarSection = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.large};
`;

const SectionTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.medium};
  color: ${({ theme }) => theme.colors.textSecondary};
  padding: ${({ theme }) => `${theme.spacing.small} ${theme.spacing.medium}`};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const GroupList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const GroupItem = styled.li`
  margin-bottom: ${({ theme }) => theme.spacing.xsmall};
`;

const GroupLink = styled(Link)<{ active?: boolean }>`
  display: flex;
  align-items: center;
  padding: ${({ theme }) => `${theme.spacing.small} ${theme.spacing.medium}`};
  color: ${({ theme, active }) => active ? theme.colors.primary : theme.colors.text};
  font-weight: ${({ active }) => active ? '600' : '400'};
  border-left: 3px solid ${({ theme, active }) => active ? theme.colors.primary : 'transparent'};
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.background};
  }
`;

const GroupAvatar = styled.img`
  width: 24px;
  height: 24px;
  border-radius: ${({ theme }) => theme.borderRadius.circle};
  margin-right: ${({ theme }) => theme.spacing.small};
`;

const GroupName = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: calc(100% - ${({ theme }) => theme.spacing.large});
  margin: ${({ theme }) => `${theme.spacing.small} ${theme.spacing.medium}`};
  padding: ${({ theme }) => theme.spacing.small};
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  font-weight: 500;
  
  svg {
    margin-right: ${({ theme }) => theme.spacing.small};
  }
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.primary}dd;
  }
`;

const Sidebar: React.FC = () => {
  const [userGroups, setUserGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    const loadGroups = async () => {
      try {
        const groups = await fetchUserGroups();
        setUserGroups(groups);
      } catch (error) {
        console.error('Erreur lors du chargement des groupes:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadGroups();
  }, []);
  
  const handleCreateGroup = () => {
    navigate('/groups/create');
  };
  
  const handleDiscoverGroups = () => {
    navigate('/groups/discover');
  };
  
  return (
    <SidebarContainer>
      <SidebarSection>
        <ActionButton onClick={handleCreateGroup}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 4V20M4 12H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Créer un groupe
        </ActionButton>
        
        <ActionButton onClick={handleDiscoverGroups}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Découvrir des groupes
        </ActionButton>
      </SidebarSection>
      
      <SidebarSection>
        <SectionTitle>Mes groupes</SectionTitle>
        {loading ? (
          <div style={{ padding: '0 16px', color: '#888' }}>Chargement...</div>
        ) : userGroups.length > 0 ? (
          <GroupList>
            {userGroups.map(group => (
              <GroupItem key={group.id}>
                <GroupLink to={`/groups/${group.id}`}>
                  <GroupAvatar 
                    src={group.avatar || 'https://via.placeholder.com/24'} 
                    alt={group.name}
                  />
                  <GroupName>{group.name}</GroupName>
                </GroupLink>
              </GroupItem>
            ))}
          </GroupList>
        ) : (
          <div style={{ padding: '0 16px', color: '#888' }}>
            Vous n'avez rejoint aucun groupe.
          </div>
        )}
      </SidebarSection>
    </SidebarContainer>
  );
};

export default Sidebar;