import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Tabs, Tab, Paper } from '@mui/material';
import { styled } from '@mui/system';
import { AuthContext } from '../../context/AuthContext';

const StyledPaper = styled(Paper)({
  backgroundColor: '#fff',
  width: '100%',
});

const StyledTabs = styled(Tabs)({
  borderBottom: '2px solid #ddd',
});

const StyledTab = styled(Tab)(({ theme, selected }) => ({
  textTransform: 'none',
  minWidth: 0,
  fontWeight: selected ? 'bold' : 'normal',
  fontSize: '16px',
  padding: '12px 24px',
  color: selected ? '#47bf93' : '#888',
  backgroundColor: selected ? '#f5f5f5' : 'transparent',
  borderRadius: '5px',
  '&:hover': {
    backgroundColor: selected ? '#f5f5f5' : '#fafafa',
  },
}));

const SettingsTabs = () => {
  const navigate = useNavigate();
  const { userInfo } = useContext(AuthContext);

  const tabData = [
    { label: 'User Profile', path: '/settings/user-profile' },
    { label: 'Restaurant Info', path: '/settings/tenant-info' },
    { label: 'User Management', path: '/settings/user-management' },
    { label: 'Create User', path: '/settings/create-user' },
  ];

  const handleTabChange = (event, newValue) => {
    navigate(tabData[newValue].path);
  };

  return (
    <StyledPaper elevation={3} square>
      <StyledTabs
        value={tabData.findIndex(tab => window.location.pathname.includes(tab.path))}
        onChange={handleTabChange}
        indicatorColor="success"
        textColor="success"
        // variant="fullWidth"
        // centered
      >
        {tabData.map((tab, index) => (
          <StyledTab
            key={index}
            label={tab.label}
            component={Link}
            to={tab.path}
            disabled={!userInfo.user.userAllowedRoutes.includes(tab.path)}
          />
        ))}
      </StyledTabs>
    </StyledPaper>
  );
};

export default SettingsTabs;
