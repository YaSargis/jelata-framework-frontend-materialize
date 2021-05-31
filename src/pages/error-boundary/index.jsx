import React from 'react';
import { Result } from 'antd';
import enhance from 'src/pages/error-boundary/enhance';

const ErrorBoundary = ({ hasError, children }) => {
  if (hasError)
    return (
      <Result status='error' title='Error' subTitle='Unknown Error' />
    );
  return children;
};

export default enhance(ErrorBoundary);
