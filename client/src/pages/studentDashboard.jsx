import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function StudentDashboard() {
    const { user } = useAuth();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            const res = await api.get('/applications/my');
            setApplications(res.data);
        } catch (err) {
            console.error('Failed to fetch applications', err);
        } finally {
            setLoading(false);
        }
    };

    const getStatusStyle = (status) => {
        const map = {
            pending:  { backgroundColor: '#fef9c3', color: '#854d0e' },
            seen:     { backgroundColor: '#dbeafe', color: '#1e40af' },
            accepted: { backgroundColor: '#d1fae5', color: '#065f46' },
            rejected: { backgroundColor: '#fee2e2', color: '#991b1b' },
        };
        return map[status] || {};
    };

    return (
        <div style={styles.page}>
            <h1 style={styles.title}>Welcome, {user.name}</h1>
            <h2 style={styles.subtitle}>My Applications</h2>

            {loading ? (
                <p>Loading...</p>
            ) : applications.length === 0 ? (
                <p style={styles.empty}>You haven't applied to any internships yet.</p>
            ) : (
                <div style={styles.list}>
                    {applications.map((app) => (
                        <div key={app._id} style={styles.card}>
                            <div style={styles.cardHeader}>
                                <div>
                                    <h3 style={styles.cardTitle}>{app.internshipId?.title}</h3>
                                    <p style={styles.location}>{app.internshipId?.location}</p>
                                </div>
                                <span style={{ ...styles.status, ...getStatusStyle(app.status) }}>
                                    {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                                </span>
                            </div>
                            {app.coverNote && (
                                <p style={styles.coverNote}>"{app.coverNote}"</p>
                            )}
                            <p style={styles.date}>
                                Applied: {new Date(app.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

const styles = {
    page: {
        maxWidth: '800px',
        margin: '0 auto',
        padding: '2rem',
    },
    title: {
        color: '#1e1b4b',
        marginBottom: '0.25rem',
    },
    subtitle: {
        color: '#4f46e5',
        marginBottom: '1.5rem',
        fontWeight: '500',
    },
    empty: {
        color: '#6b7280',
    },
    list: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: '8px',
        padding: '1.5rem',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
    },
    cardHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    cardTitle: {
        color: '#1e1b4b',
        marginBottom: '0.25rem',
    },
    location: {
        color: '#6b7280',
        fontSize: '0.9rem',
    },
    status: {
        padding: '0.25rem 0.75rem',
        borderRadius: '999px',
        fontSize: '0.85rem',
        fontWeight: '600',
        whiteSpace: 'nowrap',
    },
    coverNote: {
        color: '#6b7280',
        fontStyle: 'italic',
        fontSize: '0.9rem',
    },
    date: {
        color: '#9ca3af',
        fontSize: '0.8rem',
    },
};