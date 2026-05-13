import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { initiateInstantPayout } from './src/lib/stripe';

const app = express();
const PORT = 3000;

app.use(express.json());

// API routes FIRST
app.post('/api/payouts/instant', async (req, res) => {
  try {
    // In a real application, you would verify the user's authentication token (e.g. Supabase JWT)
    // and retrieve the connectedAccountId from their profile in the database.
    
    // For this demonstration, we'll use a mocked connected account ID from Supabase if provided by the client,
    // or fallback to a dummy Stripe test account ID.
    const { connectedAccountId, amount, currency } = req.body;
    
    if (!connectedAccountId) {
      return res.status(400).json({ error: 'Missing connectedAccountId' });
    }

    const payoutAmount = amount || 5000; // $50 default
    const payoutCurrency = currency || 'usd';

    // Initiate the payout using the custom server-side function
    try {
      const payout = await initiateInstantPayout(connectedAccountId, payoutAmount, payoutCurrency);
      res.json({ success: true, payout });
    } catch (stripeError: any) {
      // Pass along Stripe specific errors securely
      res.status(400).json({ error: stripeError.message || 'Operation failed with Stripe' });
    }
  } catch (error: any) {
    console.error('Payout initiation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Note: ensure compiled output paths align with this
    const distPath = path.join(process.cwd(), 'dist', 'client'); 
    // Wait, by default vite build puts things in "dist"
    // So let's fall back to "dist" unless otherwise specified.
    // We'll use 'dist' as the default
    const resolvedDistPath = path.join(process.cwd(), 'dist');
    app.use(express.static(resolvedDistPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(resolvedDistPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
