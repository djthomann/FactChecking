import { Route, Routes } from 'react-router-dom'
import './App.css'
import ClaimOverviewPage from './pages/ClaimOverviewPage'
import ClaimDetailPage from './pages/ClaimDetailPage'

function App() {

  return (
    <Routes>
      <Route path="/" element={<ClaimOverviewPage />}></Route>
      <Route path="/claims/:id" element={<ClaimDetailPage />}></Route>
    </Routes>
  )
}

export default App
