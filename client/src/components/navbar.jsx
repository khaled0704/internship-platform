import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const getDashboardLink = () => {
        if (user?.role === 'student') return '/student';
        if (user?.role === 'company') return '/company';
        if (user?.role === 'admin') return '/admin';
    };

    return (
        <nav style={styles.nav}>
            <Link to="/" style={styles.logo}>InternHub</Link>
            <div style={styles.links}>
                {user ? (
                    <>
                        <Link to={getDashboardLink()} style={styles.link}>
                            Dashboard
                        </Link>
                        <span style={styles.name}>Hi, {user.name}</span>
                        <button onClick={handleLogout} style={styles.button}>
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" style={styles.link}>Login</Link>
                        <Link to="/register" style={styles.link}>Register</Link>
                    </>
                )}
            </div>
        </nav>
    );
}

const styles = {
    nav: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem 2rem',
        backgroundColor: '#4f46e5',
        color: '#fff',
    },
    logo: {
        color: '#fff',
        textDecoration: 'none',
        fontSize: '1.3rem',
        fontWeight: 'bold',
    },
    links: {
        display: 'flex',
        alignItems: 'center',
        gap: '1.5rem',
    },
    link: {
        color: '#fff',
        textDecoration: 'none',
    },
    name: {
        color: '#c7d2fe',
    },
    button: {
        backgroundColor: 'transparent',
        border: '1px solid #fff',
        color: '#fff',
        padding: '0.4rem 1rem',
        borderRadius: '4px',
        cursor: 'pointer',
    }
};