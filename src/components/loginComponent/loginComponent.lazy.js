import React, { lazy, Suspense } from 'react';

const LazyLoginComponent = lazy(() => import('./LoginComponent'));

const LoginComponent = props => (
  <Suspense fallback={null}>
    <LazyLoginComponent {...props} />
  </Suspense>
);

export default LoginComponent;
