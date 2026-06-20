import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function CompanyDashboard() {
    const { user } = useAuth();
    const [internships, setInternships] = useState([]);
    const [applicants, setApplicants] = useState({});
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        title: '', description: '', domain: '',
        location: '', duration: '', remote: false,
        paid: false, salary: ''
    });

    useEffect(() => {
        fetchMyInternships();
    }, []);

    const fetchMyInternships = async () => {
        try {
            const res = await api.get('/internships');
            // filter only this company's internships
            const mine = res.data.filter(i => i.companyId._id === user.id || i.companyId === user.id);
            setInternships(mine);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchApplicants = async (internshipId) => {
        try {
            const res = await api.get(`/applications/internship/${internshipId}`);
            setApplicants(prev => ({ ...prev, [internshipId]: res.data }));
        } catch (err) {
            console.error(err);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/internships', formData);
            setShowForm(false);
            setFormData({ title: '', description: '', domain: '', location: '', duration: '', remote: false, paid: false, salary: '' });
            fetchMyInternships();
        } catch (err) {
            console.error(err);
        }
    };

    const updateStatus = async (applicationId, status, internshipId) => {
        try {
            await api.put(`/applications/${applicationId}`, { status });
            fetchApplicants(internshipId);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div style={styles.page}>
            <div style={styles.header}>
                <h1 style={styles.title}>Welcome, {user.name}</h1>
                <button onClick={() => setShowForm(!showForm)} style={styles.button}>
                    {showForm ? 'Cancel' : '+ Post Internship'}
                </button>
            </div>

            {/* Post internship form */}
            {showForm && (
                <div style={styles.form}>
                    <h2 style={styles.subtitle}>New Internship</h2>
                    <form onSubmit={handleSubmit}>
                        {[
                            { name: 'title', placeholder: 'Title' },
                            { name: 'domain', placeholder: 'Domain (e.g. Web Dev)' },
                            { name: 'location', placeholder: 'Location' },
                            { name: 'duration', placeholder: 'Duration (e.g. 2 months)' },
                        ].map(field => (
                            <input
                                key={field.name}
                                name={field.name}
                                placeholder={field.placeholder}
                                value={formData[field.name]}
                                onChange={handleChange}
                                style={styles.input}
                                required
                            />
                        ))}
                        <textarea
                            name="description"
                            placeholder="Description"
                            value={formData.description}
                            onChange={handleChange}
                            style={{ ...styles.input, height: '100px' }}
                            required
                        />
                        <div style={styles.checkboxRow}>
                            <label>
                                <input type="checkbox" name="remote" checked={formData.remote} onChange={handleChange} />
                                {' '} Remote
                            </label>
                            <label>
                                <input type="checkbox" name="paid" checked={formData.paid} onChange={handleChange} />
                                {' '} Paid
                            </label>
                        </div>
                        {formData.paid && (
                            <input
                                name="salary"
                                type="number"
                                placeholder="Salary (TND)"
                                value={formData.salary}
                                onChange={handleChange}
                                style={styles.input}
                            />
                        )}
                        <button type="submit" style={styles.button}>Post Internship</button>
                    </form>
                </div>
            )}

            {/* My internships */}
            <h2 style={styles.subtitle}>My Internships</h2>
            {loading ? <p>Loading...</p> : internships.length === 0 ? (
                <p style={styles.empty}>No internships posted yet.</p>
            ) : (
                internships.map(internship => (
                    <div key={internship._id} style={styles.card}>
                        <div style={styles.cardHeader}>
                            <div>
                                <h3 style={styles.cardTitle}>{internship.title}</h3>
                                <p style={styles.meta}>{internship.location} · {internship.duration} · {internship.paid ? 'Paid' : 'Unpaid'}</p>
                            </div>
                            <button
                                onClick={() => fetchApplicants(internship._id)}
                                style={styles.outlineButton}
                            >
                                View Applicants
                            </button>
                        </div>

                        {/* Applicants list */}
                        {applicants[internship._id] && (
                            <div style={styles.applicantsList}>
                                {applicants[internship._id].length === 0 ? (
                                    <p style={styles.empty}>No applicants yet.</p>
                                ) : (
                                    applicants[internship._id].map(app => (
                                        <div key={app._id} style={styles.applicant}>
                                            <div>
                                                <p style={styles.applicantName}>{app.studentId?.name}</p>
                                                <p style={styles.applicantMeta}>{app.studentId?.email} · {app.studentId?.university}</p>
                                                {app.coverNote && <p style={styles.coverNote}>"{app.coverNote}"</p>}
                                            </div>
                                            <select
                                                value={app.status}
                                                onChange={(e) => updateStatus(app._id, e.target.value, internship._id)}
                                                style={styles.statusSelect}
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="seen">Seen</option>
                                                <option value="accepted">Accepted</option>
                                                <option value="rejected">Rejected</option>
                                            </select>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </div>
                ))
            )}
        </div>
    );
}

const styles = {
    page: { maxWidth: '900px', margin: '0 auto', padding: '2rem' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' },
    title: { color: '#1e1b4b' },
    subtitle: { color: '#4f46e5', marginBottom: '1rem', marginTop: '1.5rem' },
    form: { backgroundColor: '#fff', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', marginBottom: '2rem' },
    input: { display: 'block', width: '100%', padding: '0.6rem', marginBottom: '0.75rem', borderRadius: '4px', border: '1px solid #ccc', fontSize: '0.95rem', boxSizing: 'border-box' },
    checkboxRow: { display: 'flex', gap: '1.5rem', marginBottom: '0.75rem' },
    button: { backgroundColor: '#4f46e5', color: '#fff', border: 'none', padding: '0.6rem 1.2rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.95rem' },
    outlineButton: { backgroundColor: 'transparent', color: '#4f46e5', border: '1px solid #4f46e5', padding: '0.4rem 1rem', borderRadius: '4px', cursor: 'pointer', whiteSpace: 'nowrap' },
    card: { backgroundColor: '#fff', borderRadius: '8px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', marginBottom: '1rem' },
    cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    cardTitle: { color: '#1e1b4b', marginBottom: '0.25rem' },
    meta: { color: '#6b7280', fontSize: '0.9rem' },
    applicantsList: { marginTop: '1rem', borderTop: '1px solid #e5e7eb', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' },
    applicant: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f9fafb', padding: '0.75rem', borderRadius: '6px' },
    applicantName: { fontWeight: '600', color: '#1e1b4b' },
    applicantMeta: { color: '#6b7280', fontSize: '0.85rem' },
    coverNote: { color: '#6b7280', fontStyle: 'italic', fontSize: '0.85rem' },
    statusSelect: { padding: '0.4rem', borderRadius: '4px', border: '1px solid #ccc', cursor: 'pointer' },
    empty: { color: '#6b7280' },
};