import React from 'react';
import styled, { keyframes } from 'styled-components';
import { useTranslation } from 'react-i18next';

const fadeInOut = keyframes`
  0%, 100% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
`;

const Message = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 60vh;
  font-size: 1.5em;
  color: #666;
  animation: ${fadeInOut} 3s infinite;
  text-align: center;
`;

const LoadingAnimation = () => {
  const { t } = useTranslation();
  return (
    <Message>
      {t('pleaseSelectEmployee')}
    </Message>
  );
};

export default LoadingAnimation;