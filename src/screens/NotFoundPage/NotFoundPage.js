import React from 'react';
import styled from 'styled-components';

const NotFoundContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 30vh;
`;

const NotFoundTitle = styled.h1`
  font-size: 35px;
  margin-bottom: 15px;
`;

const NotFoundSubtitle = styled.p`
  font-size: 18px;
  text-align: center;
  color: #555;
`;

const NotFoundPage = () => {
  return (
    <NotFoundContainer>
      <NotFoundTitle>Uh-ohh! Page not found</NotFoundTitle>
      <NotFoundSubtitle>
        Sorry, the requested page does not exist. Please check the URL and try again.
      </NotFoundSubtitle>
    </NotFoundContainer>
  );
};

export default NotFoundPage;

