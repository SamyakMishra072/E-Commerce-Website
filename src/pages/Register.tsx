// src/pages/Register.tsx
import React, { useState } from 'react';
import { authService } from '../services/authService';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

type Step = 'email' | 'verify';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('email');
  const [form, setForm] = useState({
    name: '',
    email: '',
    code: '',
    password: '',
  });
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const sendCode = async () => {
    if (!form.email || (step === 'email' && !form.name)) {
      toast.error('Please enter your name and email.');
      return;
    }
    setSending(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE}api/auth/send-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email }),
      });
      if (!res.ok) throw new Error('Failed to send code');
      toast.success('Verification code sent to your email');
      setStep('verify');
    } catch (err: any) {
      toast.error(err.message || 'Error sending code');
    } finally {
      setSending(false);
    }
  };

  const verifyAndRegister = async () => {
    if (!form.code || !form.password) {
      toast.error('Please enter the code and your password.');
      return;
    }
    setVerifying(true);
    try {
      // 1) verify code
      let res = await fetch(`${import.meta.env.VITE_API_BASE}/auth/verify-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, code: form.code }),
      });
      if (!res.ok) {
        const { message } = await res.json();
        throw new Error(message || 'Invalid or expired code');
      }

      // 2) register user
      const user = await authService.register(form.name, form.email, form.password);
      toast.success(`Welcome, ${user.name}!`);
      navigate('/');
    } catch (err: any) {
      toast.error(err.message || 'Verification or registration failed');
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-6 bg-white rounded-lg shadow">
      {step === 'email' ? (
        <>
          <h2 className="text-2xl font-semibold mb-4">Register</h2>
          <div className="space-y-4">
            <div>
              <label className="block mb-1">Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                placeholder="Your full name"
              />
            </div>
            <div>
              <label className="block mb-1">Email</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                placeholder="you@example.com"
              />
            </div>
            <button
              onClick={sendCode}
              disabled={sending}
              className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {sending ? 'Sending Code...' : 'Send Verification Code'}
            </button>
          </div>
        </>
      ) : (
        <>
          <h2 className="text-2xl font-semibold mb-4">Verify & Set Password</h2>
          <p className="mb-4 text-gray-600">
            We sent a code to <strong>{form.email}</strong>. Enter it below.
          </p>
          <div className="space-y-4">
            <div>
              <label className="block mb-1">Verification Code</label>
              <input
                name="code"
                value={form.code}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                placeholder="6-digit code"
              />
            </div>
            <div>
              <label className="block mb-1">Password</label>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                placeholder="Create a password"
              />
            </div>
            <button
              onClick={verifyAndRegister}
              disabled={verifying}
              className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700 disabled:opacity-50"
            >
              {verifying ? 'Verifying...' : 'Verify & Register'}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Register;
