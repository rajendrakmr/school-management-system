import React, { Suspense, FC } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import NotFoundPage from '@/pages/NotFoundPage';
import routes from '@/router/routes';
import './AppContent.css'; // import fade-in CSS

interface AppRoute {
  url: string;
  exact?: boolean;
  name: string;
  component: React.ComponentType;
}

interface appContentProps<T = any> { 
  isToggle: boolean;
}

const AppContent: FC<appContentProps> = ({ isToggle }) => {
  return (
    <div className={`rk_content ${isToggle ? "rkToogleContent" : ""}`} id="kt_app_main">
      <Suspense
        fallback={
          <div className="w-full h-screen text-gray-300 dark:text-gray-200 bg-base-100 flex items-center justify-center">
            Loading...
          </div>
        }
      >
        <Routes>
          {routes.map((route: AppRoute, idx: number) => (
            route.component && (
              <Route
                key={idx}
                path={route.url}
                element={
                  <div className="fade-in">
                    <route.component />
                  </div>
                }
              />
            )
          ))}
          <Route path="/" element={<Navigate to="backend/dashboard" replace />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </div>
  );
};

export default AppContent;
