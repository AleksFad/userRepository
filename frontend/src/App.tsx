import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom';
import Login from './components/Auth/Login';
import Logout from './components/Auth/Logout';
import { AuthProvider } from './components/Auth/AuthContext';
import UserList from './components/User/UserList';
import DetailUser from './components/User/DetailUser';
import { RedirectHandler } from './components/Common/RedirectHandler';
import Navbar from './components/Common/Navbar';
import UserValidate from './components/Auth/UserValidate';
import RecoverPassword from './components/Auth/RecoverPassword';
import UserForm from './components/User/UserForm';
import LanguageSwitcher from './components/Common/LanguageSwitcher';
import './i18n';

function App() {

  return (
      <Router>
        <AuthProvider>
          <Navbar />
          <LanguageSwitcher />
          <RedirectHandler />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/register" element={<UserForm isRegistration />} />{" "}
            <Route path="/user-list" element={<UserList />} />
            <Route path="/user-add" element={<UserForm />} />
            <Route path="/detail" element={<DetailUser />} />
            <Route path="/validate" element={<UserValidate />} />
            <Route path="/recover-password" element={<RecoverPassword />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </AuthProvider>
      </Router>
  );
}

export default App;