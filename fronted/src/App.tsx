import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Lazy-loaded components
const AuthRoute = lazy(() => import('@/layouts/AuthRoute'));
const DefaultLayout = lazy(() => import('@/layouts/DefaultLayout'));
const AuthLogin = lazy(() => import('@/pages/Auth/Login'));

// Colorful, blurred loader
const Loader: React.FC = () => (
  <div style={{
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backdropFilter: "blur(6px)",
    background: "rgba(0,0,0,0.3)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999
  }}>
    <div style={{ position: "relative", width: 80, height: 80 }}>
      {[0, 1, 2, 3].map(i => (
        <div key={i} style={{
          position: "absolute",
          width: 16,
          height: 16,
          borderRadius: "50%",
          background: "linear-gradient(45deg, #ff3cac, #784ba0, #2b86c5)",
          animation: `loader-spin 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite`,
          top: i < 2 ? 8 : undefined,
          bottom: i >= 2 ? 8 : undefined,
          left: i % 2 === 0 ? 8 : undefined,
          right: i % 2 === 1 ? 8 : undefined,
          animationDelay: `${-0.3 * i}s`
        }} />
      ))}
    </div>

    {/* Keyframes */}
    <style>
      {`
        @keyframes loader-spin {
          0%, 100% { transform: scale(0); }
          50% { transform: scale(1); }
        }
      `}
    </style>
  </div>
);

const App: React.FC = () => {
  const isAuthenticated = true; // example auth flag

  return (
    <Router basename="/apps">
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/login" element={<AuthLogin />} />
          <Route
            path="*"
            element={
              <AuthRoute isAuthenticated={isAuthenticated}>
                <DefaultLayout />
              </AuthRoute>
            }
          />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;
