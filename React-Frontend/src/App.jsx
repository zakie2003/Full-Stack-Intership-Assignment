// App.js
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/login';
import ProtectedRoute from './components/ProtectedRoutes';
import DashBoard from './pages/dashboard';
import Teamboard from './pages/team_pages';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path='/dashboard' element={
          <ProtectedRoute>
            <DashBoard/>
          </ProtectedRoute>
        }></Route>
        <Route path='/team_board' element={
          <ProtectedRoute>
            <Teamboard/>
          </ProtectedRoute>
        }></Route>
      </Routes>
    </Router>
  );
}

export default App;
