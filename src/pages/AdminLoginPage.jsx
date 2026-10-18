import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, Lock, User, Eye, EyeOff, ArrowLeft, KeyRound } from 'lucide-react';

export function AdminLoginPage() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If already logged in, redirect immediately
  if (isAuthenticated) {
    const destination = location.state?.from?.pathname || '/admin/dashboard';
    navigate(destination, { replace: true });
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!username.trim() || !password) {
      setErrorMsg('Username dan password harus diisi!');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await login(username, password);
      if (res.success) {
        const destination = location.state?.from?.pathname || '/admin/dashboard';
        navigate(destination, { replace: true });
      } else {
        setErrorMsg(res.message || 'Kredensial login tidak valid.');
      }
    } catch (err) {
      setErrorMsg('Terjadi kesalahan koneksi login.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      background: 'radial-gradient(circle at center, #15121c 0%, #08070b 100%)',
      position: 'relative'
    }}>
      {/* Top hazard bar */}
      <div className="hazard-stripe" style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px' }} />

      <div style={{
        width: '100%',
        maxWidth: '440px',
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-md)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.8), 0 0 20px var(--accent-glow)',
        overflow: 'hidden'
      }}>
        
        {/* Header */}
        <div style={{
          padding: '24px 24px 18px 24px',
          background: 'var(--bg-tertiary)',
          borderBottom: '1px solid var(--border-color)',
          textAlign: 'center'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '10px',
            border: '2px solid var(--accent-primary)',
            overflow: 'hidden',
            margin: '0 auto 14px auto',
            boxShadow: '0 0 20px var(--accent-glow)',
            background: '#000'
          }}>
            <img 
              src="/logo.png" 
              alt="Faust Store" 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
            />
          </div>

          <h2 className="serif-title" style={{ fontSize: '1.3rem', fontWeight: 900, color: 'var(--text-main)' }}>
            FAUST STORE // ADMIN LOGIN
          </h2>
          <p className="mono" style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            RESTRICTED ACCESS // CLEARANCE LEVEL 5
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {errorMsg && (
            <div style={{
              background: 'rgba(255, 42, 68, 0.12)',
              border: '1px solid #ff2a44',
              color: '#ff2a44',
              padding: '10px 14px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.82rem',
              fontFamily: 'var(--font-mono)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <ShieldAlert size={16} style={{ flexShrink: 0 }} />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Username Input */}
          <div>
            <label className="mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
              USERNAME ADMINISTRATOR:
            </label>
            <div style={{ position: 'relative' }}>
              <User size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                required
                autoFocus
                className="input"
                style={{ paddingLeft: '38px' }}
                placeholder="Masukkan username admin..."
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label className="mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
              KATA SANDI / SECURITY KEY:
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                className="input"
                style={{ paddingLeft: '38px', paddingRight: '40px' }}
                placeholder="Masukkan password admin..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer'
                }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary"
            style={{ padding: '12px', marginTop: '6px' }}
          >
            <KeyRound size={16} />
            <span>{isSubmitting ? 'MEMVERIFIKASI...' : 'MASUK KE DASHBOARD ADMIN'}</span>
          </button>

          {/* Back to store */}
          <div style={{ textAlign: 'center', marginTop: '10px' }}>
            <Link
              to="/"
              style={{
                color: 'var(--text-muted)',
                fontSize: '0.78rem',
                fontFamily: 'var(--font-mono)',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <ArrowLeft size={13} />
              <span>Kembali ke Halaman Toko Utama</span>
            </Link>
          </div>

        </form>

        {/* Footer Notice */}
        <div style={{
          background: 'var(--bg-primary)',
          padding: '12px 20px',
          borderTop: '1px solid var(--border-color)',
          textAlign: 'center',
          fontSize: '0.7rem',
          color: 'var(--text-muted)',
          fontFamily: 'var(--font-mono)'
        }}>
          SECURE PROTOCOL ACTIVE // UNAUTHORIZED ATTEMPTS ARE LOGGED
        </div>

      </div>
    </div>
  );
}
