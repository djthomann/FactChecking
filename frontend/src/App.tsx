import { Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import ClaimOverviewPage from './pages/ClaimOverviewPage'
import ClaimDetailPage from './pages/ClaimDetailPage'
import ClaimNavbar from './components/ClaimNavbar'
import { useEffect, useState } from 'react'

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
                        <Route path="/" element={<Navigate to="/claims" replace />} />

                        <Route path="/claims" element={<ClaimOverviewPage />}></Route>
                        <Route path="/claims/:id" element={<ClaimDetailPage />}></Route>
                </Routes>
            </div>
        </>
    )
}

export default App
