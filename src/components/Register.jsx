import React, { useState } from 'react';
import '../styles/Register.css';
import '../styles/Form.css';
import { FiEye, FiEyeOff } from 'react-icons/fi';


const Register = ({ setCurrentView }) => {
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(prev => !prev);
  };

  const toggleConfirmPasswordVisibility = () => {
    setIsConfirmPasswordVisible(prev => !prev);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === 'username') {
      setUsername(value);
    } else if (name === 'password') {
      setPassword(value);
    } else if (name === 'confirmPassword') {
      setConfirmPassword(value);
    }
    setMessage('');
  };

  const handleCloseModal = () => {
      setIsModalOpen(false); // Tutup modal
      setCurrentView('login'); // Pindah ke halaman login
  };

  const handleSubmit = async (event) => {
    event.preventDefault(); // Mencegah submit form secara default

    if (!username || !password || !confirmPassword) {
      setMessage('Semua field harus diisi!');
      return; // Validasi field kosong
    }

    if (password !== confirmPassword) {
      setMessage('Password dan Konfirmasi Password harus sama!');
      return; // Validasi password dan konfirmasi password
    }


    setIsSubmitting(true); // Menandai bahwa proses submit sedang berlangsung
    setMessage('Mengirim data ke server...');
    console.log('Mendaftar dengan:', { username, password, confirmPassword });

    const dataToSubmit = {
      username,
      password
    };

    try {
      // panggil fetch API register
      const response = await fetch('http://localhost:3001/register',{
        method: 'POST', // Metode POST untuk mengirim data
        headers: {
          'Content-Type': 'application/json' // Menyatakan bahwa data yang dikirim berupa JSON
        },
        body: JSON.stringify(dataToSubmit), // Mengubah data menjadi format JSON
      });

      const data = await response.json(); // Mengambil response JSON dari server

      if (response.ok) {
        setMessage(`Pendaftaran berhasil! Silahkan login ${data.user.username}.`);


        setIsModalOpen(true);

        // Reset form setelah pendaftaran berhasil
        setUsername('');
        setPassword('');
        setConfirmPassword('');

        setTimeout(() => setCurrentView('login'), 2000); // Pindah ke halaman login setelah 2 detik

      } else {
        setMessage(`Pendaftaran gagal: ${data.message || 'Terjadi kesalahan pada server.'}`);
      }

    } catch (error) {
      console.error('Error:', error);
      setMessage('Gagal terhubung ke server. Pastikan server backend berjalan di Port 3001.');
    } finally {
      setIsSubmitting(false); // Menandai bahwa proses submit selesai
    }

    
  };


  return (
    <>
    <div className="auth-page-wrapper">
      <div className='form-card'>
        <header className='form-header'>
          <img src="/logo-text.svg" alt="CHILL Logo" className='logo'/> 
          <h2>Daftar</h2>
          <p className='subtitle'>Selamat datang!</p>
        </header>

      
        <form className='auth-form' 
          onSubmit={handleSubmit} 
          >

          <div className='input-group'>
            <label className='label-text' htmlFor="username">Username</label>
            <input 
              type="text"
              id="username"
              name="username"
              value={username}
              placeholder="Masukkan username"
              onChange={handleInputChange}
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
              placeholder="Masukkan password"
              onChange={handleInputChange}
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

          <div className='input-group'>
            <label className='label-text' htmlFor="confirmPassword">Konfirmasi Password</label>
            <input 
              type={isConfirmPasswordVisible ? 'text' : 'password'}
              id="confirmPassword"
              name="confirmPassword"
              value={confirmPassword}
              placeholder="Konfirmasi password"
              onChange={handleInputChange}
              className='input-field'
              required
            />
            <span className="password-toggle" onClick={toggleConfirmPasswordVisibility}>
              {isConfirmPasswordVisible ? 
                <FiEyeOff size={20} color="#aaa" /> : 
                <FiEye size={20} color="#aaa" />
              }
            </span>
          </div>

          <div className='login-link-container'>
            Sudah punya akun?
            <span onClick={() => setCurrentView('login')} className="action-link">
                Masuk
            </span>
          </div>           

          {message && <p className={`message ${message.includes('berhasil') ? 'success' : 'error'}`}>{message}</p>}
                    
          <button type="submit" className="submit-btn" disabled={isSubmitting}>
            {isSubmitting ? 'Memproses...' : 'Daftar'}
          </button>

        </form>
                
        <div className='separator'>
          <hr />
            <span>atau</span>
          <hr />
        </div>

        <button className='social-login-btn google'>
          <img src="/google-icon.png" 
            alt="Google Logo" 
            className='google-logo'/>
          Daftar dengan Google
        </button>

    </div>
      {isModalOpen && (
        <div className="modal-backdrop"> {/* Background hitam transparan */}
            <div className="modal-content">
              <h3>Pendaftaran Sukses! 🎉</h3>
              <p>{message}</p>
              <p>Silakan masuk sekarang.</p>
              <button 
                onClick={handleCloseModal} 
                type="button" // Penting: Jangan sampai submit form
                className="submit-btn"
                >
                Ke Halaman Login
              </button>
          </div>
        </div>
      )}
    </div>
    </>
  );
};

export default Register;