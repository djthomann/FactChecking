import { Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import ClaimOverviewPage from './pages/ClaimOverviewPage'
import ClaimDetailPage from './pages/ClaimDetailPage'
import ClaimNavbar from './components/ClaimNavbar'
import { useEffect, useState } from 'react'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ProfilePage from './pages/ProfilePage'
import BrowsePage from './pages/BrowsePage'
import ContributePage from './pages/ContributePage'
import RequireAuth from './components/RequireAuth'
import AccountRedirect from './components/AccountRedirect'

function App() {

    const [theme, setTheme] = useState(() => {
        return localStorage.getItem('theme') || 'dark';
    });

    useEffect(() => {
        document.documentElement.setAttribute('data-bs-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    return (
        <>
            <ClaimNavbar theme={theme} toggleTheme={toggleTheme} />
            <div className="container main p-4 d-flex flex-column gap-4">
                <Routes>
                        <Route path="/" element={<Navigate to="/browse" replace />} />
                        <Route path="/login" element={<LoginPage />}></Route>
                        <Route path="/register" element={<RegisterPage />}></Route>
                        <Route path="/users/:username" element={<ProfilePage />} />
                        <Route element={<RequireAuth />}>
                            <Route path="/account" element={<AccountRedirect />} />
                        </Route>
                        <Route path="/user/:username" element={<ProfilePage />}></Route>
                        <Route path="/contribute" element={<ContributePage />}></Route>
                        <Route path="/browse" element={<BrowsePage />}></Route>
                        <Route path="/claims/:id" element={<ClaimDetailPage />}></Route>
                </Routes>
            </div>
        </>
    )
}

export default App
