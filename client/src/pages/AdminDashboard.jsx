import { useState, useEffect } from 'react';
import api from '../services/api';

export default function AdminDashboard() {
    const [companies, setCompanies] = useState([]);
    const [internships, setInternships] = useState([]);

    useEffect(() => {
        fetchCompanies();
        fetchInternships();
    }, []);

    const fetchCompanies = async () => {
        const res = await api.get('/admin/companies');
        setCompanies(res.data);
    };

    const fetchInternships = async () => {
        const res = await api.get('/admin/internships');
        setInternships(res.data);
    };

    const verifyCompany = async (id) => {
        await api.put(`/admin/companies/${id}/verify`);
        fetchCompanies();
    };

    const deleteInternship = async (id) => {
        await api.delete(`/admin/internships/${id}`);
        fetchInternships();
    };

    return (
        <div style={styles.page}>
            <h1 style={styles.title}>Admin Dashboard</h1>

            <h2 style={styles.subtitle}>Companies</h2>
            {companies.map(company => (
                <div key={company._id} style={styles.card}>
                    <div>
                        <p style={styles.name}>{company.companyName}</p>
                        <p style={styles.meta}>{company.email} · {company.sector}</p>
                    </div>
                    {company.verified ? (
                        <span style={styles.verified}>✓ Verified</span>
                    ) : (
                        <button onClick={() => verifyCompany(company._id)} style={styles.button}>
                            Verify
                        </button>
                    )}
                </div>
            ))}

            <h2 style={styles.subtitle}>All Internships</h2>
            {internships.map(internship => (
                <div key={internship._id} style={styles.card}>
                    <div>
                        <p style={styles.name}>{internship.title}</p>
                        <p style={styles.meta}>{internship.companyId?.companyName} · {internship.location}</p>
                    </div>
                    <button onClick={() => deleteInternship(internship._id)} style={styles.deleteButton}>
                        Delete
                    </button>
                </div>
            ))}
        </div>
    );
}

const styles = {
    page: { maxWidth: '800px', margin: '0 auto', padding: '2rem' },
    title: { color: '#1e1b4b', marginBottom: '1.5rem' },
    subtitle: { color: '#4f46e5', margin: '1.5rem 0 1rem' },
    card: { backgroundColor: '#fff', borderRadius: '8px', padding: '1rem 1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', marginBottom: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    name: { fontWeight: '600', color: '#1e1b4b' },
    meta: { color: '#6b7280', fontSize: '0.85rem' },
    button: { backgroundColor: '#4f46e5', color: '#fff', border: 'none', padding: '0.4rem 1rem', borderRadius: '4px', cursor: 'pointer' },
    deleteButton: { backgroundColor: '#ef4444', color: '#fff', border: 'none', padding: '0.4rem 1rem', borderRadius: '4px', cursor: 'pointer' },
    verified: { color: '#065f46', backgroundColor: '#d1fae5', padding: '0.3rem 0.75rem', borderRadius: '999px', fontSize: '0.85rem' },
};