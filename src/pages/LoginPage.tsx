import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { token, user } = await authApi.login(form);
      login(token, user);
      navigate('/');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-card">
        <div className="register-card__header">
          <img src="/PokemonRegister.svg" alt="Pokémon Login" className="register-card__icon" />
          <h1 className="register-card__title">Connexion</h1>
          <p className="register-card__subtitle">Content de te revoir, dresseur !</p>
        </div>

        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-field">
            <label>Email</label>
            <input
              type="email" name="email" required
              value={form.email} onChange={handleChange}
              placeholder="ash@pokemon.com"
            />
          </div>
          <div className="form-field">
            <label>Mot de passe</label>
            <input
              type="password" name="password" required
              value={form.password} onChange={handleChange}
              placeholder="••••••••"
            />
          </div>
          <button type="submit" className="register-btn" disabled={loading}>
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
          {error && <p className="form-error">{error}</p>}
          <p className="form-link">
            Pas encore de compte ? <Link to="/register">S'inscrire</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
