import React, { useState } from 'react';
export default function RegisterPage() {
  const [form, setForm] = useState({ username: '', email: '', password: '', confirm: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      alert('Les mots de passe ne correspondent pas !');
      return;
    }
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="register-page">
        <div className="register-card">
          <div className="register-success">
            <span className="register-success__icon">🎉</span>
            <h2 className="register-success__title">Inscription réussie !</h2>
            <p className="register-success__text">
              Bienvenue, <strong>{form.username}</strong> ! Tu peux maintenant combattre des Pokémon.
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
          </div>
          <button type="submit" className="register-btn">
            S'inscrire
          </button>
        </form>
      </div>
    </div>
  );
}
