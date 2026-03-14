import { Link } from 'react-router-dom';
import './ServerError.css';

const ServerError = () => {
    return (
        <div className="server-error-container">
            <div className="server-error-content">
                <div className="error-code">500</div>
                <h1>Error Interno del Servidor</h1>
                <p className="message">
                    Algo salió mal en nuestros servidores. 
                    Nuestro equipo ha sido notificado y estamos trabajando en ello.
                </p>
                <div className="progress-bar">
                    <div className="progress-fill"></div>
                </div>
                <p className="retry-text">Reintentando en <span id="countdown">10</span> segundos...</p>
                <div className="actions">
                    <button onClick={() => window.location.reload()} className="btn-retry">
                        🔄 Reintentar ahora
                    </button>
                    <Link to="/" className="btn-home">
                        ← Volver al inicio
                    </Link>
                </div>
                <div className="support-info">
                    ¿El problema persiste? <a href="mailto:support@tudominio.com">Reporta este error</a>
                </div>
            </div>
        </div>
    );
};

export default ServerError;