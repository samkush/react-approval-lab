import { useState } from 'react';

export default function App() {
  const [status, setStatus] = useState('Pending');

  return (
    <main>
      <h1>Request approvals</h1>
      <h2>Reporting access</h2>
      <p>Status: {status}</p>
      {status === 'Pending' && (
        <button onClick={() => setStatus('Approved')}>Approve</button>
      )}
    </main>
  );
}
