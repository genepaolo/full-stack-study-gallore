import { Routes, Route } from 'react-router-dom'
import AppShell from './components/layout/AppShell.jsx'
import HomePage from './pages/HomePage.jsx'
import TrackPage from './pages/TrackPage.jsx'
import ModulePage from './pages/ModulePage.jsx'
import LessonPage from './pages/LessonPage.jsx'
import GlossaryPage from './pages/GlossaryPage.jsx'
import ProgressPage from './pages/ProgressPage.jsx'

export default function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/track/:slug" element={<TrackPage />} />
        <Route path="/module/:slug" element={<ModulePage />} />
        <Route path="/lesson/:id" element={<LessonPage />} />
        <Route path="/glossary" element={<GlossaryPage />} />
        <Route path="/progress" element={<ProgressPage />} />
        <Route path="*" element={<HomePage />} />
      </Routes>
    </AppShell>
  )
}
