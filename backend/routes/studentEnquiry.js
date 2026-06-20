const express = require("express");
const router = express.Router();
const db = require("../config/db");
const fs = require('fs');
const path = require('path');

// Ensure logs directory exists
const logsDir = path.join(__dirname, '..', 'logs');
if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir, { recursive: true });
const logFile = path.join(logsDir, 'student_enquiry_requests.log');

// Basic request logger for this router
router.use((req, res, next) => {
	try {
		const entry = {
			ts: new Date().toISOString(),
			method: req.method,
			path: req.originalUrl,
			body: req.body || null,
			ip: req.ip || req.connection?.remoteAddress || null
		};
		const line = JSON.stringify(entry) + '\n';
		fs.appendFile(logFile, line, () => {});
		console.log('[student-enquiry]', req.method, req.originalUrl);
	} catch (e) {}
	next();
});

router.get("/", async (req, res) => {
	try {
		// Support server-side search, filtering and pagination
		const { q, page = 1, perPage = 10, job_type, createdAt } = req.query;

		const whereClauses = [];
		const params = [];

		if (q) {
			whereClauses.push(`(
				LOWER(full_name) LIKE ? OR
				LOWER(email) LIKE ? OR
				LOWER(phone) LIKE ? OR
				LOWER(job_type) LIKE ? OR
				LOWER(career_option) LIKE ?
			)`);
			const qParam = `%${String(q).toLowerCase()}%`;
			params.push(qParam, qParam, qParam, qParam, qParam);
		}

		if (job_type) {
			// normalize job_type (accept IT / Non-IT / variants)
			const jt = String(job_type).trim().toLowerCase();
			if (jt === 'it') params.push('IT');
			else params.push('Non-IT');
			whereClauses.push(`job_type = ?`);
		}

		if (createdAt) {
			// expect createdAt as YYYY-MM-DD
			whereClauses.push(`DATE(created_at) = ?`);
			params.push(createdAt);
		}

		const whereSql = whereClauses.length ? `WHERE ${whereClauses.join(' AND ')}` : '';

		// Count total
		const [[{ total }]] = await db.query(
			`SELECT COUNT(*) as total FROM student_enquiry ${whereSql}`,
			params
		);

		const pageNum = Math.max(1, parseInt(page, 10) || 1);
		const per = Math.max(1, Math.min(100, parseInt(perPage, 10) || 10));
		const offset = (pageNum - 1) * per;

		// final query with ordering, limit & offset
		// interpolate numeric LIMIT/OFFSET to avoid parameter-binding issues in some drivers
		const perInt = Number(per);
		const offsetInt = Number(offset);
		const finalSql = `SELECT * FROM student_enquiry ${whereSql} ORDER BY created_at DESC LIMIT ${perInt} OFFSET ${offsetInt}`;
		const [rows] = await db.query(finalSql, params);

		res.json({
			success: true,
			data: rows,
			page: pageNum,
			perPage: per,
			total: Number(total || 0),
		});
	} catch (err) {
		console.error('[student-enquiry] GET / error', err);
		res.status(500).json({ success: false, error: err.message || String(err) });
	}
});

router.post("/", async (req, res) => {
	try {
		const { full_name, phone, email, career_option, job_type } = req.body;

		// server-side validation for job_type (accept lowercase, normalize)
		const jt = String(job_type || '').trim().toLowerCase();
		if (!jt || !['it', 'non-it', 'nonit', 'non_it', 'non it'].includes(jt)) {
			return res.status(400).json({ success: false, message: 'Invalid job_type. Allowed values: IT, Non-IT' });
		}
		const normalizedJobType = jt === 'it' ? 'IT' : 'Non-IT';

		if (!full_name || !phone || !email) {
			return res.status(400).json({
				success: false,
				message: "Name, Phone, and Email are required"
			});
		}

		const [result] = await db.query(
			`
				INSERT INTO student_enquiry
					(full_name, phone, email, career_option, job_type, created_at)
				VALUES (?, ?, ?, ?, ?, NOW())
			`,
			[
				full_name,
				phone,
				email,
				career_option || null,
				normalizedJobType,
			]
		);

		res.status(201).json({
			success: true,
			message: "Request submitted successfully!",
			id: result.insertId,
		});
	} catch (err) {
		res.status(500).json({
			success: false,
			error: err.message,
			message: "Failed to submit request",
		});
	}
});

// GET enquiries by exact date (YYYY-MM-DD)
router.get('/date/:date', async (req, res) => {
	try {
		const date = req.params.date;
		const [rows] = await db.query(`SELECT * FROM student_enquiry WHERE DATE(created_at) = ? ORDER BY created_at DESC`, [date]);
		res.json(rows);
	} catch (err) {
		res.status(500).json({ success: false, error: err.message });
	}
});

// GET enquiries by month (YYYY-MM)
router.get('/month/:month', async (req, res) => {
	try {
		const month = req.params.month; // format YYYY-MM
		const [rows] = await db.query(`SELECT * FROM student_enquiry WHERE DATE_FORMAT(created_at, '%Y-%m') = ? ORDER BY created_at DESC`, [month]);
		res.json(rows);
	} catch (err) {
		res.status(500).json({ success: false, error: err.message });
	}
});

router.put("/:id", async (req, res) => {
	const {
		full_name,
		phone,
		email,
		career_option,
		job_type,
	} = req.body;

	// server-side validation for job_type on update (accept lowercase, normalize)
	const jtUpdate = String(job_type || '').trim().toLowerCase();
	if (!jtUpdate || !['it', 'non-it', 'nonit', 'non_it', 'non it'].includes(jtUpdate)) {
		return res.status(400).json({ success: false, message: 'Invalid job_type. Allowed values: IT, Non-IT' });
	}
	const normalizedJobTypeUpdate = jtUpdate === 'it' ? 'IT' : 'Non-IT';

	await db.query(
		`
			UPDATE student_enquiry
			SET full_name=?,
					phone=?,
					email=?,
					career_option=?,
					job_type=?
			WHERE id=?
		`,
		[
			full_name,
			phone,
			email,
			career_option,
			normalizedJobTypeUpdate,
			req.params.id,
		]
	);

	res.json({
		success: true,
	});
});

router.delete("/:id", async (req, res) => {
	await db.query(
		"DELETE FROM student_enquiry WHERE id=?",
		[req.params.id]
	);

	res.json({
		success: true,
	});
});

module.exports = router;

