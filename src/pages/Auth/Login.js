import React, { useState } from 'react';
import { Building2, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    overflow: 'hidden',
  },
  leftPanel: {
    flex: 1,
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  leftImage: {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  leftOverlay: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(135deg, rgba(37,99,235,0.75) 0%, rgba(79,70,229,0.75) 100%)',
  },
  leftContent: {
    position: 'relative',
    zIndex: 1,
    textAlign: 'center',
    padding: '0 40px',
    color: '#fff',
  },
  rightPanel: {
    width: 480,
    minWidth: 480,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '48px 40px',
    background: 'linear-gradient(135deg, #EFF6FF 0%, #E0E7FF 100%)',
    position: 'relative',
    overflow: 'hidden',
  },
  blob1: {
    position: 'absolute',
    top: -100,
    right: -80,
    width: 280,
    height: 280,
    borderRadius: 9999,
    background: 'linear-gradient(135deg, rgba(59,130,246,0.3), rgba(99,102,241,0.3))',
    filter: 'blur(50px)',
    pointerEvents: 'none',
  },
  blob2: {
    position: 'absolute',
    bottom: -100,
    left: -80,
    width: 280,
    height: 280,
    borderRadius: 9999,
    background: 'linear-gradient(135deg, rgba(244,114,182,0.25), rgba(167,139,250,0.25))',
    filter: 'blur(55px)',
    pointerEvents: 'none',
  },
  wrapper: {
    width: '100%',
    maxWidth: 400,
    position: 'relative',
    zIndex: 1,
  },
  logoBox: {
    height: 64,
    width: 64,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto',
    borderRadius: 16,
    background: 'linear-gradient(135deg, #2563EB 0%, #4F46E5 100%)',
    boxShadow: '0 10px 25px rgba(59,130,246,0.4)',
    border: '4px solid rgba(255,255,255,0.65)'
  },
  title: {
    marginTop: 16,
    textAlign: 'center',
    fontSize: 28,
    fontWeight: 800,
    color: '#111827',
  },
  subtitle: {
    marginTop: 6,
    textAlign: 'center',
    color: '#4B5563',
  },
  card: {
    position: 'relative',
    marginTop: 20,
    borderRadius: 16,
    background: 'rgba(255,255,255,0.85)',
    backdropFilter: 'saturate(180%) blur(10px)',
    WebkitBackdropFilter: 'saturate(180%) blur(10px)',
    padding: 24,
    boxShadow: '0 15px 35px rgba(0,0,0,0.08)',
    border: '1px solid rgba(0,0,0,0.05)'
  },
  label: {
    display: 'block',
    fontSize: 14,
    fontWeight: 600,
    color: '#374151',
    marginBottom: 8,
  },
  inputWrap: {
    position: 'relative',
  },
  iconLeft: {
    position: 'absolute',
    left: 12,
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#9CA3AF',
    pointerEvents: 'none',
  },
  iconButton: {
    position: 'absolute',
    right: 8,
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#9CA3AF',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    padding: 4,
  },
  input: {
    width: '100%',
    padding: '12px 12px 12px 40px',
    border: '1px solid #E5E7EB',
    borderRadius: 12,
    background: 'rgba(255,255,255,0.9)',
    color: '#111827',
    fontSize: 14,
    outline: 'none',
    transition: 'box-shadow .15s ease, border-color .15s ease',
    boxSizing: 'border-box',
  },
  inputFocus: {
    borderColor: '#3B82F6',
    boxShadow: '0 0 0 4px rgba(59,130,246,0.15)'
  },
  helpText: {
    marginTop: 6,
    fontSize: 12,
    color: '#6B7280'
  },
  rowBetween: {
    marginTop: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  linkButton: {
    background: 'none',
    border: 'none',
    color: '#1D4ED8',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    padding: 0,
    textDecoration: 'underline',
    textUnderlineOffset: 4,
  },
  button: {
    width: '100%',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 8,
    padding: '12px 16px',
    border: 'none',
    borderRadius: 12,
    color: '#FFFFFF',
    fontWeight: 700,
    fontSize: 14,
    cursor: 'pointer',
    background: 'linear-gradient(90deg, #2563EB 0%, #4F46E5 100%)',
    boxShadow: '0 12px 20px rgba(37,99,235,0.3)'
  },
  buttonDisabled: {
    opacity: 0.6,
    cursor: 'not-allowed'
  },
  demo: {
    marginTop: 16,
    padding: 12,
    borderRadius: 12,
    background: '#F9FAFB',
    border: '1px solid #E5E7EB',
    color: '#374151',
    fontSize: 14,
  },
  footer: {
    marginTop: 24,
    textAlign: 'center',
    color: '#6B7280',
    fontSize: 12,
  }
};

const Login = () => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: 'admin@realestate.com',
    password: 'admin123'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focusEmail, setFocusEmail] = useState(false);
  const [focusPassword, setFocusPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        // Only allow admin users to access admin panel
        if (result.user.role !== 'admin') {
          toast.error('Access denied. Admin credentials required.');
          return;
        }
        toast.success('Welcome back, Admin!');
      } else {
        toast.error(result.error || 'Login failed');
      }
    } catch (error) {
      toast.error('An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>

      {/* Left Image Panel */}
      <div style={styles.leftPanel}>
        <img
          src="https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1200"
          alt="Real Estate"
          style={styles.leftImage}
        />
        <div style={styles.leftOverlay} />
        <div style={styles.leftContent}>
          <Building2 size={48} color="#fff" style={{ marginBottom: 20 }} />
          <h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 12 }}>Real Estate Admin</h2>
          <p style={{ fontSize: 16, opacity: 0.85, lineHeight: 1.6, maxWidth: 360 }}>
            Manage properties, users, transactions and more from one powerful dashboard.
          </p>
          <div style={{ display: 'flex', gap: 32, justifyContent: 'center', marginTop: 40 }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 28, fontWeight: 800 }}>2,500+</div>
              <div style={{ fontSize: 13, opacity: 0.8 }}>Properties</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 28, fontWeight: 800 }}>98%</div>
              <div style={{ fontSize: 13, opacity: 0.8 }}>Satisfaction</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 28, fontWeight: 800 }}>50+</div>
              <div style={{ fontSize: 13, opacity: 0.8 }}>Agents</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Form Panel */}
      <div style={styles.rightPanel}>
        <div style={styles.blob1} />
        <div style={styles.blob2} />

        <div style={styles.wrapper}>
          {/* Logo and Title */}
          <div style={styles.logoBox}>
            <Building2 size={28} color="#fff" />
          </div>
          <h1 style={styles.title}>Welcome back</h1>
          <p style={styles.subtitle}>Sign in to Real Estate Admin</p>

          {/* Login Card */}
          <div style={styles.card}>
          <form onSubmit={handleSubmit} aria-busy={loading}>
            {/* Email Field */}
            <div style={{ marginBottom: 16 }}>
              <label htmlFor="email" style={styles.label}>
                Email address
              </label>
              <div style={styles.inputWrap}>
                <div style={styles.iconLeft}>
                  <Mail size={18} />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={() => setFocusEmail(true)}
                  onBlur={() => setFocusEmail(false)}
                  style={{ ...styles.input, ...(focusEmail ? styles.inputFocus : null) }}
                  placeholder="you@example.com"
                />
              </div>
              <p style={styles.helpText}>We'll never share your email.</p>
            </div>

            {/* Password Field */}
            <div style={{ marginBottom: 16 }}>
              <label htmlFor="password" style={styles.label}>
                Password
              </label>
              <div style={styles.inputWrap}>
                <div style={styles.iconLeft}>
                  <Lock size={18} />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => setFocusPassword(true)}
                  onBlur={() => setFocusPassword(false)}
                  style={{ ...styles.input, paddingRight: 40, ...(focusPassword ? styles.inputFocus : null) }}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  style={styles.iconButton}
                  onClick={() => setShowPassword(!showPassword)}
                  aria-pressed={showPassword}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div style={styles.rowBetween}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input id="remember-me" name="remember-me" type="checkbox" />
                <label htmlFor="remember-me" style={{ fontSize: 14, color: '#374151' }}>
                  Remember me
                </label>
              </div>
              <button type="button" style={styles.linkButton}>
                Forgot password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              style={{ ...styles.button, ...(loading ? styles.buttonDisabled : null) }}
            >
              {loading ? (
                <>
                  <span className="spinner" style={{ width: 16, height: 16, borderWidth: 2, borderTopColor: 'transparent' }} />
                  <span>Signing in...</span>
                </>
              ) : (
                'Sign in'
              )}
            </button>
          </form>

          {/* Demo Credentials */}
          <div style={styles.demo}>
            <h3 style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Demo credentials</h3>
            <div style={{ color: '#374151' }}>
              <p><strong>Email:</strong> admin@realestate.com</p>
              <p><strong>Password:</strong> admin123</p>
            </div>
          </div>
          </div>

          {/* Footer */}
          <div style={styles.footer}>
            <p>© 2024 Real Estate Admin Panel. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
