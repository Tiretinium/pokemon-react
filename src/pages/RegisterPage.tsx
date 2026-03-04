import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '../services/api';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      setError('Les mots de passe ne correspondent pas !');
      return;
    }
    setLoading(true);
    try {
      await authApi.register({
        username: form.username,
        email: form.email,
        password: form.password,
      });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="register-page">
        <div className="register-card">
          <div className="register-success">
            <span className="register-success__icon">🎉</span>
            <h2 className="register-success__title">Inscription réussie !</h2>
            <p className="register-success__text">
              Bienvenue, <strong>{form.username}</strong> ! Redirection vers la connexion...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="register-page">
      <div className="register-card">
        <div className="register-card__header">
          <img src="/PokemonRegister.svg" alt="Pokémon Register" className="register-card__icon" />
          <h1 className="register-card__title">Créer un compte</h1>
          <p className="register-card__subtitle">Rejoins l'aventure Pokémon !</p>
        </div>

        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-field">
            <label>Nom de dresseur</label>
            <input type="text" name="username" required value={form.username}
              onChange={handleChange} placeholder="Ash Ketchum" />
          </div>
          <div className="form-field">
            <label>Email</label>
            <input type="email" name="email" required value={form.email}
              onChange={handleChange} placeholder="ash@pokemon.com" />
          </div>
          <div className="form-field">
            <label>Mot de passe</label>
            <input type="password" name="password" required value={form.password}
              onChange={handleChange} placeholder="••••••••" />
          </div>
          <div className="form-field">
            <label>Confirmer le mot de passe</label>
            <input type="password" name="confirm" required value={form.confirm}
              onChange={handleChange} placeholder="••••••••" />
          </div>          <button type="submit" className="register-btn" disabled={loading}>
            {loading ? 'Inscription...' : "S'inscrire"}
          </button>
          {error && <p className="form-error">{error}</p>}
          <p className="form-link">
            Déjà un compte ? <Link to="/login">Se connecter</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
