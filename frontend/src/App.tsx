import { Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import ClaimOverviewPage from './pages/ClaimOverviewPage'
import ClaimDetailPage from './pages/ClaimDetailPage'

function App() {

  return (
      <div className="container main p-4 d-flex flex-column gap-4">
          <Routes>
                <Route path="/" element={<Navigate to="/claims" replace />} />

                <Route path="/claims" element={<ClaimOverviewPage />}></Route>
                <Route path="/claims/:id" element={<ClaimDetailPage />}></Route>
          </Routes>
      </div>

  )
}

export default App
