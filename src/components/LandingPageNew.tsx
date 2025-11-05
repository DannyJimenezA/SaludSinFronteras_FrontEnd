import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/LandingPageNew.css';

interface Plan {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  popular: boolean;
}

export function LandingPageNew() {
  const navigate = useNavigate();

  const plans: Plan[] = [
    {
      id: 'free',
      name: 'Gratuito',
      price: '$0',
      period: '/mes',
      description: 'Perfecto para comenzar',
      features: [
        '1 consulta al mes',
        'Videollamadas básicas',
        'Chat con traducción',
        'Historial médico básico',
        'Soporte por email',
      ],
      popular: false,
    },
    {
      id: 'basic',
      name: 'Básico',
      price: '$29',
      period: '/mes',
      description: 'Ideal para cuidado regular',
      features: [
        '5 consultas al mes',
        'Videollamadas HD',
        'Traducción en tiempo real',
        'Historial médico completo',
        'Recetas digitales',
        'Análisis básicos',
        'Soporte prioritario 24/7',
      ],
      popular: true,
    },
    {
      id: 'premium',
      name: 'Premium',
      price: '$79',
      period: '/mes',
      description: 'Acceso completo',
      features: [
        'Consultas ilimitadas',
        'Videollamadas 4K',
        'Traducción AI avanzada',
        'Grabación de consultas',
        'Especialistas premium',
        'Análisis completos',
        'Consultas de emergencia',
        'Planes familiares',
      ],
      popular: false,
    },
  ];

  return (
    <div className="landing-page">
      {/* Navbar */}
      <nav className="landing-navbar">
        <div className="landing-container">
          <div className="navbar-content">
            <div className="navbar-logo">
              <span className="logo-text">Salud Sin Fronteras</span>
            </div>
            <div className="navbar-actions">
              <button className="btn-primary" onClick={() => navigate('/login')}>
                Iniciar Sesión
              </button>
              <button className="btn-primary" onClick={() => navigate('/login')}>
                Registrarse
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="landing-container">
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="hero-title">
                Tu salud, <span className="hero-title-highlight">sin fronteras</span>
              </h1>

              <p className="hero-description">
                Conectamos pacientes con médicos certificados de todo el mundo. Consultas
                profesionales con traducción en tiempo real, disponible 24/7 desde cualquier lugar.
              </p>

              

              <div className="hero-stats">
                <div className="user-avatars">
                  <div className="avatar">A</div>
                  <div className="avatar">B</div>
                  <div className="avatar">C</div>
                  <div className="avatar">D</div>
                </div>
                <div className="stats-text">
                  <p className="stats-number">50,000+ usuarios activos</p>
                  <div className="stats-rating">
                    <span className="stars">★★★★★</span>
                    <span className="rating-text">4.9/5</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="hero-image">
              <img
                src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=600&fit=crop"
                alt="Doctor consultation"
                className="doctor-image"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="landing-container">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <p className="stat-value">50K+</p>
              <p className="stat-label">Usuarios Activos</p>
            </div>

            <div className="stat-item">
              <div className="stat-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
              </div>
              <p className="stat-value">4.9/5</p>
              <p className="stat-label">Rating Promedio</p>
            </div>

            <div className="stat-item">
              <div className="stat-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                </svg>
              </div>
              <p className="stat-value">100+</p>
              <p className="stat-label">Médicos Certificados</p>
            </div>

            <div className="stat-item">
              <div className="stat-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
              </div>
              <p className="stat-value">24/7</p>
              <p className="stat-label">Soporte Disponible</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="landing-container">
          <div className="section-header">
            
            <h2 className="section-title">¿Por qué elegirnos?</h2>
            <p className="section-description">
              Ofrecemos la mejor experiencia de telemedicina con tecnología de punta
            </p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="2" y1="12" x2="22" y2="12"></line>
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                </svg>
              </div>
              <h3 className="feature-title">Sin Barreras de Idioma</h3>
              <p className="feature-description">Traducción en tiempo real en 100+ idiomas</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="23 7 16 12 23 17 23 7"></polygon>
                  <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
                </svg>
              </div>
              <h3 className="feature-title">Videollamadas HD/4K</h3>
              <p className="feature-description">Consultas con calidad de imagen superior</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
              </div>
              <h3 className="feature-title">100% Seguro</h3>
              <p className="feature-description">Encriptación E2E y cumplimiento HIPAA</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
              </div>
              <h3 className="feature-title">Disponible 24/7</h3>
              <p className="feature-description">Médicos disponibles en todo momento</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                </svg>
              </div>
              <h3 className="feature-title">Médicos Certificados</h3>
              <p className="feature-description">Solo profesionales verificados</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                </svg>
              </div>
              <h3 className="feature-title">Historial Médico</h3>
              <p className="feature-description">Toda tu información en un solo lugar</p>
            </div>
          </div>
        </div>
      </section>

      {/* Specialties Section */}
      <section className="specialties-section">
        <div className="landing-container">
          <div className="section-header">
            
            <h2 className="section-title">Nuestras Especialidades</h2>
            <p className="section-description">
              Conectamos con especialistas en diversas áreas de la medicina
            </p>
          </div>

          <div className="specialties-grid">
            <div className="specialty-card">
              <div className="specialty-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
              </div>
              <p className="specialty-name">Cardiología</p>
            </div>

            <div className="specialty-card">
              <div className="specialty-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                  <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
              </div>
              <p className="specialty-name">Neurología</p>
            </div>

            <div className="specialty-card">
              <div className="specialty-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                </svg>
              </div>
              <p className="specialty-name">Medicina General</p>
            </div>

            <div className="specialty-card">
              <div className="specialty-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              </div>
              <p className="specialty-name">Oftalmología</p>
            </div>

            <div className="specialty-card">
              <div className="specialty-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="8.5" cy="7" r="4"></circle>
                  <line x1="20" y1="8" x2="20" y2="14"></line>
                  <line x1="23" y1="11" x2="17" y2="11"></line>
                </svg>
              </div>
              <p className="specialty-name">Pediatría</p>
            </div>

            <div className="specialty-card">
              <div className="specialty-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2a10 10 0 1 0 10 10"></path>
                  <path d="M22 12A10 10 0 0 0 12 2v10z"></path>
                </svg>
              </div>
              <p className="specialty-name">Dermatología</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="pricing-section">
        <div className="landing-container">
          <div className="section-header">
            <h2 className="section-title">Planes para Todos</h2>
            <p className="section-description">
              Elige el plan que mejor se adapte a tus necesidades
            </p>
          </div>

          <div className="pricing-grid">
            {plans.map((plan) => (
              <div key={plan.id} className={`pricing-card ${plan.popular ? 'popular' : ''}`}>
                {plan.popular && <div className="popular-badge">Más Popular</div>}

                <div className="pricing-header">
                  <h3 className="plan-name">{plan.name}</h3>
                  <div className="plan-price">
                    <span className="price">{plan.price}</span>
                    <span className="period">{plan.period}</span>
                  </div>
                  <p className="plan-description">{plan.description}</p>
                </div>

                <div className="pricing-body">
                  <ul className="features-list">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="feature-item">
                        <svg className="check-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button className="btn-select-plan" onClick={() => navigate('/login')}>
                    Seleccionar Plan
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="landing-container">
          <div className="cta-content">
            <h2 className="cta-title">¿Listo para Transformar tu Salud?</h2>
            <p className="cta-description">
              Únete a miles de usuarios que ya confían en Salud Sin Fronteras
            </p>
            <div className="cta-buttons">
              <button className="btn-cta-primary" onClick={() => navigate('/login')}>
                Comenzar Gratis
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </button>
              <button className="btn-cta-secondary" onClick={() => navigate('/login')}>
                Hablar con Ventas
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="landing-container">
          <div className="footer-grid">
            <div className="footer-column">
              <div className="footer-logo">
                <span className="footer-logo-text">Salud Sin Fronteras</span>
              </div>
              <p className="footer-description">
                Conectando pacientes con médicos de todo el mundo, sin barreras de idioma.
              </p>
            </div>

            <div className="footer-column">
              <h3 className="footer-title">Producto</h3>
              <ul className="footer-links">
                <li><a href="#caracteristicas">Características</a></li>
                <li><a href="#precios">Precios</a></li>
                <li><a href="#especialidades">Especialidades</a></li>
                <li><a href="#medicos">Médicos</a></li>
              </ul>
            </div>

            <div className="footer-column">
              <h3 className="footer-title">Compañía</h3>
              <ul className="footer-links">
                <li><a href="#sobre">Sobre Nosotros</a></li>
                <li><a href="#blog">Blog</a></li>
                <li><a href="#carreras">Carreras</a></li>
                <li><a href="#contacto">Contacto</a></li>
              </ul>
            </div>

            <div className="footer-column">
              <h3 className="footer-title">Contacto</h3>
              <ul className="footer-contact">
                <li>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                  <span>info@saludsinfronteras.com</span>
                </li>
                <li>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                  <span>+1 (555) 123-4567</span>
                </li>
                <li>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="2" y1="12" x2="22" y2="12"></line>
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                  </svg>
                  <span>24/7 Soporte</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <p>
              © 2025 Salud Sin Fronteras. Todos los derechos reservados. |{' '}
              <a href="#privacidad">Privacidad</a> | <a href="#terminos">Términos</a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
