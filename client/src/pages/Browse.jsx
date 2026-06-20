import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function Browse() {
    const [internships, setInternships] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({ domain: '', remote: '', paid: '' });
    const { user } = useAuth();
    const [applied, setApplied] = useState({});

    const handleApply = async (internshipId) => {
    try {
        await api.post('/applications', { internshipId, coverNote: '' });
        setApplied(prev => ({ ...prev, [internshipId]: true }));
    } catch (err) {
        if (err.response?.data?.message === 'You already applied to this internship') {
            setApplied(prev => ({ ...prev, [internshipId]: true }));
        }
        console.error(err);
    }
    };
    useEffect(() => {
        fetchInternships();
    }, []);

    const fetchInternships = async (appliedFilters = {}) => {
        try {
            setLoading(true);
            const res = await api.get('/internships', { params: appliedFilters });
            setInternships(res.data);
        } catch (err) {
            console.error('Failed to fetch internships', err);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (e) => {
        const updated = { ...filters, [e.target.name]: e.target.value };
        setFilters(updated);
        // Remove empty filters before sending to API
        const clean = Object.fromEntries(Object.entries(updated).filter(([_, v]) => v !== ''));
        fetchInternships(clean);
    };

    return (
        <div style={styles.page}>
            <h1 style={styles.title}>Browse Internships</h1>

            {/* Filters */}
            <div style={styles.filters}>
                <input
                    type="text"
                    name="domain"
                    placeholder="Filter by domain"
                    value={filters.domain}
                    onChange={handleFilterChange}
                    style={styles.filterInput}
                />
                <select name="remote" value={filters.remote} onChange={handleFilterChange} style={styles.filterInput}>
                    <option value="">Remote or Onsite</option>
                    <option value="true">Remote</option>
                    <option value="false">Onsite</option>
                </select>
                <select name="paid" value={filters.paid} onChange={handleFilterChange} style={styles.filterInput}>
                    <option value="">Paid or Unpaid</option>
                    <option value="true">Paid</option>
                    <option value="false">Unpaid</option>
                </select>
            </div>

            {/* Internship cards */}
            {loading ? (
                <p style={styles.center}>Loading...</p>
            ) : internships.length === 0 ? (
                <p style={styles.center}>No internships found.</p>
            ) : (
                <div style={styles.grid}>
                    {internships.map((internship) => (
                        <div key={internship._id} style={styles.card}>
                            <h3 style={styles.cardTitle}>{internship.title}</h3>
                            <p style={styles.company}>{internship.companyId?.companyName}</p>
                            <div style={styles.tags}>
                                <span style={styles.tag}>{internship.domain}</span>
                                <span style={styles.tag}>{internship.location}</span>
                                <span style={styles.tag}>{internship.duration}</span>
                                <span style={{
                                    ...styles.tag,
                                    backgroundColor: internship.paid ? '#d1fae5' : '#fee2e2',
                                    color: internship.paid ? '#065f46' : '#991b1b',
                                }}>
                                    {internship.paid ? `Paid ${internship.salary ? `- ${internship.salary} TND` : ''}` : 'Unpaid'}
                                </span>
                                <span style={{
                                    ...styles.tag,
                                    backgroundColor: internship.remote ? '#dbeafe' : '#f3f4f6',
                                    color: internship.remote ? '#1e40af' : '#374151',
                                }}>
                                    {internship.remote ? 'Remote' : 'Onsite'}
                                </span>
                            </div>
                            <p style={styles.description}>{internship.description}</p>
                            {user?.role === 'student' && (
                                <button
                                    onClick={() => handleApply(internship._id)}
                                    disabled={applied[internship._id]}
                                    style={{
                                        ...styles.applyButton,
                                        backgroundColor: applied[internship._id] ? '#6b7280' : '#4f46e5',
                                        cursor: applied[internship._id] ? 'default' : 'pointer',
                                    }}
                                >
                                    {applied[internship._id] ? 'Applied' : 'Apply'}
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

const styles = {
    page: {
        maxWidth: '1100px',
        margin: '0 auto',
        padding: '2rem',
    },
    title: {
        marginBottom: '1.5rem',
        color: '#1e1b4b',
    },
    filters: {
        display: 'flex',
        gap: '1rem',
        marginBottom: '2rem',
        flexWrap: 'wrap',
    },
    filterInput: {
        padding: '0.5rem',
        borderRadius: '4px',
        border: '1px solid #ccc',
        fontSize: '0.95rem',
        minWidth: '180px',
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '1.5rem',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: '8px',
        padding: '1.5rem',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
    },
    cardTitle: {
        color: '#1e1b4b',
        fontSize: '1.1rem',
    },
    company: {
        color: '#4f46e5',
        fontWeight: '600',
        fontSize: '0.95rem',
    },
    tags: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.5rem',
    },
    tag: {
        backgroundColor: '#f3f4f6',
        color: '#374151',
        padding: '0.25rem 0.6rem',
        borderRadius: '999px',
        fontSize: '0.8rem',
    },
    description: {
        color: '#6b7280',
        fontSize: '0.9rem',
        lineHeight: '1.5',
    },
    applyButton: {
    color: '#fff',
    border: 'none',
    padding: '0.5rem 1.2rem',
    borderRadius: '4px',
    fontSize: '0.9rem',
    alignSelf: 'flex-start',
    },
};