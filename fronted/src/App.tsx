import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const AuthRoute = lazy(() => import('@/layouts/AuthRoute'));
const DefaultLayout = lazy(() => import('@/layouts/DefaultLayout')); 
const AuthLogin = lazy(() => import('@/pages/Auth/AuthLogin'));
const App: React.FC = () => {
    const isAuthenticated = true;

    return (
        <Router basename="/apps">
            <Suspense fallback={<div>Loading...</div>}>
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
