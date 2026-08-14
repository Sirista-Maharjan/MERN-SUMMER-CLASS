import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Header() {
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="">
      <nav className="bg-green-900 text-white p-6 h-20">
        <div className="float-left">
          <Link to="/" className="text-2xl">Task Tracker</Link>
        </div>
        <div className="float-right mr-5 flex items-center h-full">
          {isAuthenticated ? (
            <>
              {/* Item 6: show the logged-in username in the navbar */}
              <span className="ml-5 text-amber-200">Hi, {user.username}</span>
              <button
                type="button"
                onClick={handleLogout}
                className="ml-5 text-amber-200 hover:text-white"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="ml-5 text-amber-200 hover:text-white">Login</Link>
              <Link to="/register" className="ml-5 text-amber-200 hover:text-white">Register</Link>
            </>
          )}
        </div>
      </nav>
    </header>
  )
}
export default Header;
