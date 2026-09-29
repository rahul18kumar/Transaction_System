const express = require('express');

const HOST = 'localhost';
const PORT = 3000;
const app = express();

app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

	if (req.method === 'OPTIONS') {
		return res.sendStatus(204);
	}

	next();
});

app.use(express.json({ limit: '1mb' }));

app.get('/', (req, res) => {
	res.type('text/plain').send('Transaction server is running');
});

app.post('/data', (req, res) => {
	const data = req.body ?? null;
	console.log('Received data:', data);
	res.json({ success: true, received: data });
});

app.use((req, res) => {
	res.status(404).json({ error: 'Not found' });
});

app.use((err, req, res, next) => {
	if (err.type === 'entity.too.large') {
		return res.status(413).json({ error: 'Request body too large' });
	}
	if (err instanceof SyntaxError && err.status === 400) {
		return res.status(400).json({ error: 'Invalid JSON' });
	}
	return res.status(500).json({ error: 'Internal server error' });
	});

app.listen(PORT, HOST, () => {
	console.log(`Server listening at http://${HOST}:${PORT}`);
});