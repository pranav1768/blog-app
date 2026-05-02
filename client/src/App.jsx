import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Home        from './pages/Home';
import PostDetail  from './pages/PostDetail';
import Login       from './pages/Login';
import Register    from './pages/Register';
import Dashboard   from './pages/Dashboard';
import NewPost     from './pages/NewPost';
import EditPost    from './pages/EditPost';
import AdminPanel  from './pages/AdminPanel';

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="spinner" />;
  return user ? children : <Navigate to="/login" replace />;
}

function AdminRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="spinner" />;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'admin') return <Navigate to="/" replace />;
  return children;
}

function Layout() {
  return (
    <>
      <Navbar />
      <main style={{ minHeight: 'calc(100vh - 140px)', paddingTop: '5rem' }}>
        <Routes>
          <Route path="/"            element={<Home />} />
          <Route path="/posts/:slug" element={<PostDetail />} />
          <Route path="/login"       element={<Login />} />
          <Route path="/register"    element={<Register />} />
          <Route path="/dashboard"   element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/posts/new"   element={<PrivateRoute><NewPost /></PrivateRoute>} />
          <Route path="/posts/:id/edit" element={<PrivateRoute><EditPost /></PrivateRoute>} />
          <Route path="/admin"       element={<AdminRoute><AdminPanel /></AdminRoute>} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Layout />
      </BrowserRouter>
    </AuthProvider>
  );
}
