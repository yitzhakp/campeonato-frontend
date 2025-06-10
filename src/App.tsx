import './index.css'
import { Route, Routes, Link } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import Player from './pages/Player'
import NotFound from './pages/NotFound'
import AdminLogin from './pages/AdminLogin'
import Admin from './pages/Admin'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <>
      <div className="min-h-screen min-w-screen bg-[#F8F9FA] flex flex-col">
        <nav className="w-full bg-[#002B5B] shadow-md">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img
                src="src/assets/logo_iea.png"
                alt="Logo del Instituto Experimental"
                className="h-12 w-auto rounded"
              />
              <span className="text-2xl font-bold"
                style={{ color: "#FFC107", textShadow: "1px 1px 2px #002B5B" }}>
                Campeonato IEA 2025
              </span>
            </div>
            <div className="flex gap-6 text-lg">
              <Link
                to="/"
                className="font-medium transition-colors px-2 py-1 rounded
                  text-[#F8F9FA] hover:text-primary hover:bg-[#FFC107] hover:shadow"
              >
                Home
              </Link>
              <Link
                to="/about"
                className="font-medium transition-colors px-2 py-1 rounded
                  text-[#F8F9FA] hover:text-verde-cesped hover:bg-[#28A745] hover:shadow"
              >
                About
              </Link>
              <Link
                to="/adminlogin"
                className="font-medium transition-colors px-2 py-1 rounded
                  text-[#F8F9FA] hover:text-[#28A745] hover:bg-[#FFC107] hover:shadow"
              >
                Admin
              </Link>
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
      </div>
    </>
  )
}

export default App