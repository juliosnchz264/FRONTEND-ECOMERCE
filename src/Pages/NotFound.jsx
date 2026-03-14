import { Link } from 'react-router-dom';
import './NotFound.css'; // Opcional para estilos

const NotFound = () => {
  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <h1 className="error-code">404</h1>
        <h2>¡Ups! Página no encontrada</h2>
        <p>La página que buscas no existe o ha sido movida.</p>
        <p className="url">{window.location.pathname}</p>
        <Link to="/" className="btn-home">
          ← Volver al inicio
        </Link>
      </div>
    </div>
  );
};

export default NotFound;