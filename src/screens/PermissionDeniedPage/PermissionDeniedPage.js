import React, {useEffect} from 'react';
import styled from 'styled-components';

const PermissionDeniedContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const PermissionDeniedContent = styled.div`
  text-align: center;
  margin-top: 30vh;
`;

const PermissionDeniedTitle = styled.h1`
  font-size: 2rem;
  color: #ff4444;
  margin-bottom: 20px;
`;

const PermissionDeniedText = styled.p`
  font-size: 1.2rem;
  color: #555; 
  margin-bottom: 30px;
`;

const PermissionDeniedPage = (props) => {
  useEffect(() => {
    props.setHeaderTitle('')
  }, [])
  return (
    <PermissionDeniedContainer>
      <PermissionDeniedContent>
        <PermissionDeniedTitle>Permission Denied</PermissionDeniedTitle>
        <PermissionDeniedText>
          Sorry, you don't have permission to access this page.
        </PermissionDeniedText>
      </PermissionDeniedContent>
    </PermissionDeniedContainer>
  );
};

export default PermissionDeniedPage;