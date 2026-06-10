import React, { useState, useEffect } from 'react';
import api from '../apiClient';
import PlacementLayout from './PlacementLayout';

export default function InterviewsComp() {
	const [interviews, setInterviews] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');

	useEffect(() => {
		let mounted = true;
		const fetch = async () => {
			try {
				const res = await api.get('/interviews');
				if (!mounted) return;
				setInterviews(res.data?.data || []);
			} catch (e) {
				console.error('Failed to load interviews', e);
				if (mounted) setError('Failed to load interviews');
			} finally {
				if (mounted) setLoading(false);
			}
		};
		fetch();
		return () => { mounted = false; };
	}, []);

	const handleDelete = async (id) => {
		if (!window.confirm('Delete this interview?')) return;
		try {
			await api.delete(`/interviews/${id}`);
			setInterviews((prev) => prev.filter((i) => i.id !== id));
		} catch (e) {
			console.error('Delete failed', e);
			setError('Failed to delete interview');
		}
	};

	const [formVisible, setFormVisible] = useState(false);
	const [editing, setEditing] = useState(null);
	const [companies, setCompanies] = useState([]);
	const [students, setStudents] = useState([]);

	useEffect(() => {
		let mounted = true;
		const loadRefs = async () => {
			try {
				const [cRes, sRes] = await Promise.all([
					api.get('/companies').catch(() => ({ data: { data: [] } })),
					api.get('/students').catch(() => ({ data: { data: [] } }))
				]);
				if (!mounted) return;
				setCompanies(cRes.data?.data || []);
				setStudents(sRes.data?.data || []);
			} catch (e) {
				console.error('Failed to load refs', e);
			}
		};
		loadRefs();
		return () => { mounted = false; };
	}, []);

	const openCreate = () => {
		setEditing({ company_id: '', student_id: '', interview_date: '', mode: 'Onsite', status: 'Scheduled' });
		setFormVisible(true);
	};

	const openEdit = (iv) => {
		setEditing({ ...iv });
		setFormVisible(true);
	};

	const handleFormChange = (field, value) => {
		setEditing((e) => ({ ...(e || {}), [field]: value }));
	};

	const handleFormSubmit = async (e) => {
		e.preventDefault();
		try {
			if (!editing) return;
			if (editing.id) {
				await api.put(`/interviews/${editing.id}`, editing);
			} else {
				const res = await api.post('/interviews', editing);
				if (res.data && res.data.data && res.data.data.id) {
					editing.id = res.data.data.id;
				}
			}
			setFormVisible(false);
			setEditing(null);
			// refresh list
			const r = await api.get('/interviews');
			setInterviews(r.data?.data || []);
		} catch (err) {
			console.error('Save failed', err);
			setError('Failed to save interview');
		}
	};

	return (
		<PlacementLayout title="Interviews">
			<div style={{ padding: 16 }}>
					<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
						<h2>Interviews</h2>
						<div>
							<button className="btn" onClick={openCreate}>Create Interview</button>
						</div>
					</div>

				{error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}

				<div style={{ marginTop: 12 }}>
					{loading ? <div>Loading...</div> : (
						<table className="table">
							<thead>
								<tr><th>ID</th><th>Company</th><th>Student</th><th>Date</th><th>Mode</th><th>Status</th><th>Actions</th></tr>
							</thead>
							<tbody>
								{interviews.length === 0 ? (
									<tr><td colSpan="7" style={{ textAlign: 'center' }}>No interviews scheduled</td></tr>
								) : (
									interviews.map((iv) => (
										<tr key={iv.id}>
											<td>{iv.id}</td>
											<td>{companies.find(c => c.id === iv.company_id)?.company_name || iv.company_name}</td>
											<td>{students.find(s => s.id === iv.student_id)?.name || iv.student_name}</td>
											<td>{new Date(iv.interview_date).toLocaleString()}</td>
											<td>{iv.mode}</td>
											<td>{iv.status}</td>
											<td>
												<button className="btn btn-sm" onClick={() => openEdit(iv)}>Edit</button>{' '}
												<button className="btn btn-sm" onClick={() => handleDelete(iv.id)}>Delete</button>
											</td>
										</tr>
									))
								)}
							</tbody>
						</table>
					)}
					</div>

					{/* Modal form rendered once */}
						

					{/* Modal form rendered once */}
					{formVisible && editing && (
						<div style={{ position: 'fixed', left: 0, right: 0, top: 0, bottom: 0, background: 'rgba(0,0,0,0.4)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
							<form onSubmit={handleFormSubmit} style={{ background: '#fff', padding: 16, borderRadius: 8, width: 560, maxWidth: '95%' }}>
								<h3>{editing.id ? 'Edit Interview' : 'Create Interview'}</h3>
								<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
									<select value={editing.company_id || ''} onChange={(e) => handleFormChange('company_id', e.target.value)} required>
										<option value="">Select Company</option>
										{companies.map(c => <option key={c.id} value={c.id}>{c.company_name || c.name}</option>)}
									</select>
									<select value={editing.student_id || ''} onChange={(e) => handleFormChange('student_id', e.target.value)} required>
										<option value="">Select Student</option>
										{students.map(s => <option key={s.id} value={s.id}>{s.name || s.student_name}</option>)}
									</select>
									<input type="datetime-local" value={editing.interview_date ? (()=>{ const d=new Date(editing.interview_date); const local=new Date(d.getTime()-d.getTimezoneOffset()*60000).toISOString().slice(0,16); return local; })() : ''} onChange={(e) => handleFormChange('interview_date', e.target.value)} required />
									<select value={editing.mode || 'Onsite'} onChange={(e) => handleFormChange('mode', e.target.value)}>
										<option>Onsite</option>
										<option>Online</option>
									</select>
									<select value={editing.status || 'Scheduled'} onChange={(e) => handleFormChange('status', e.target.value)}>
										<option>Scheduled</option>
										<option>Completed</option>
										<option>Cancelled</option>
									</select>
								</div>
								<div style={{ marginTop: 12, display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
									<button className="btn" type="button" onClick={() => { setFormVisible(false); setEditing(null); }}>Cancel</button>
									<button className="btn" type="submit">Save</button>
								</div>
							</form>
						</div>
					)}
			</div>
		</PlacementLayout>
	);
}
