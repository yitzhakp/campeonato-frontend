import './index.css'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import Player from './pages/Player'
import NotFound from './pages/NotFound'
import AdminLogin from './pages/AdminLogin'
import Admin from './pages/Admin'
import ProtectedRoute from './components/ProtectedRoute'
import ElementNavBar from './components/ElementNavBar'
import Header from './components/Header'
function App() {
  return (
    <>
      <div className="min-h-screen min-w-screen bg-gris-claro flex flex-col">

        <nav className="w-full bg-azul-noche shadow-md">
          <div className="max-w-6xl mx-auto px-4 py-6 flex items-center justify-between">

            <div className="flex items-center gap-4">
              <Header></Header>
            </div>

            <div className="flex gap-6 text-lg">
              <ElementNavBar to="/">Home</ElementNavBar>
              <ElementNavBar to="/about">About</ElementNavBar>
              <ElementNavBar to="/admin">Admin</ElementNavBar>
            </div>

          </div>
        </nav>

        <main className="flex-1 w-full flex flex-col items-center justify-start">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/player/:name" element={<Player />} />
            <Route path="*" element={<NotFound />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <Admin />
                </ProtectedRoute>
              }
            />
            <Route path="/adminlogin" element={<AdminLogin />} />
          </Routes>
        </main>
        <footer className="py-8 mt-10 bg-gray-800 text-white text-center">
          <p>© 2025 Campeonato Intercolegiado. Todos los derechos reservados.</p>
        </footer>
      </div>
    </>
  )
}

export default App