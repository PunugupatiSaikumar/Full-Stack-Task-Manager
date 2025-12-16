/**
 * Login Component
 * 
 * Handles user login and registration
 */

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import FormInput from '../FormInput/FormInput';
import './Login.css';

const Login = () => {
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');

  /**
   * Handle input change
   */
  const handleChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear errors when user types
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
    setSubmitError('');
  };

  /**
   * Validate form
   */
  const validate = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!isLogin && !formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');

    if (!validate()) {
      return;
    }

    setLoading(true);
    try {
      let result;
      if (isLogin) {
        result = await login(formData.email, formData.password);
      } else {
        result = await register(formData.email, formData.password, formData.name);
      }

      if (!result.success) {
        setSubmitError(result.error || 'Authentication failed');
      }
    } catch (error) {
      setSubmitError(error.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Toggle between login and register
   */
  const toggleMode = () => {
    setIsLogin(!isLogin);
    setErrors({});
    setSubmitError('');
    setFormData({
      email: '',
      password: '',
      name: ''
    });
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>📋 Task Manager</h1>
          <p>{isLogin ? 'Welcome back!' : 'Create your account'}</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {submitError && (
            <div className="login-error">
              {submitError}
            </div>
          )}

          {!isLogin && (
            <FormInput
              label="Name"
              name="name"
              type="text"
              value={formData.name}
              onChange={(value) => handleChange('name', value)}
              error={errors.name}
              required
              placeholder="Enter your name"
            />
          )}

          <FormInput
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={(value) => handleChange('email', value)}
            error={errors.email}
            required
            placeholder="Enter your email"
          />

          <FormInput
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={(value) => handleChange('password', value)}
            error={errors.password}
            required
            placeholder="Enter your password"
          />

          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={loading}
          >
            {loading ? 'Please wait...' : (isLogin ? 'Login' : 'Register')}
          </button>
        </form>

        <div className="login-footer">
          <p>
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <button
              type="button"
              className="link-button"
              onClick={toggleMode}
            >
              {isLogin ? 'Register' : 'Login'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

