import React, { useState } from 'react';
import '../styles/Login.css';
import '../styles/Form.css';
import { FiEye, FiEyeOff } from 'react-icons/fi';


// Menerima prop 'setCurrentView' untuk mengontrol navigasi
const Login = ({ setCurrentView, setIsLoggedIn, setIsDashboardLoading }) => {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(''); 
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(prev => !prev);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === 'username') {
      setUsername(value);
    } else if (name === 'password') {
      setPassword(value);
    }
    setMessage('');
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    
    if (!username || !password) {
        setMessage('Username dan Kata Sandi wajib diisi.');
        return;
    }
    
    setIsSubmitting(true);
    setMessage('Verifikasi data...');

    const loginCredentials = { username, password };

    try {
      const response = await fetch('http://localhost:3001/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginCredentials),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Login berhasil!');
        setIsDashboardLoading(true);
        setIsLoggedIn(true);

      } else {
        setMessage(`Login gagal: ${data.message || 'Username atau Kata Sandi salah.'}`);
      }
    } catch (error) {
      console.error('Error during login:', error);
      setMessage('Gagal terhubung ke server. Pastikan server berjalan.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page-wrapper">
      <div className='form-card'>

        <header className='form-header'>
          <img src="/logo-text.svg" alt="CHILL Logo" className='logo'/> 
          <h2>Masuk</h2>
          <p className='subtitle'>Selamat datang kembali!</p>
        </header>

        <form className='auth-form' onSubmit={handleLogin}>
          <div className='input-group'>
            <label className='label-text' htmlFor="username">Username</label>
            <input 
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={handleInputChange}
              placeholder="Masukkan username"
              className='input-field'
              required        
            />
          </div>
          
          <div className='input-group'>
            <label className='label-text' htmlFor="password">Password</label>
            <input 
              type={isPasswordVisible ? 'text' : 'password'}
              id="password"
              name="password"
              value={password}
              onChange={handleInputChange}
              placeholder="Masukkan password"
              className='input-field'
              required
            />
            <span className="password-toggle" onClick={togglePasswordVisibility}>
              {isPasswordVisible ? 
              <FiEyeOff size={20} color="#aaa" /> : 
              <FiEye size={20} color="#aaa" />
              }
            </span>
          </div>

          <div className="password-link-bar">
            <div className="link-register">
                Belum punya akun? 
                <span onClick={() => setCurrentView('register')} className="action-link">
                    Daftar
                </span>
            </div>
            
            <div className="link-forgot">
                <span className="action-link">
                    Lupa kata sandi?
                </span>
            </div>
        </div>

          {message && <p className={`message ${message.includes('berhasil') ? 'success' : 'error'}`}>{message}</p>}
          <button type="submit" className="submit-btn" disabled={isSubmitting}>
            Masuk
          </button>
        </form>

        <div className="separator">
          <hr/>
          <span>Atau</span>
          <hr/>
        </div>
        
        <button className="social-login-btn google">
          <img src="/google-icon.png" alt="Google" className="google-logo" /> 
            Masuk dengan Google
          </button>
      </div>      
    </div>
  );
};

export default Login;