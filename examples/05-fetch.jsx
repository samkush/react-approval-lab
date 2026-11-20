import { useEffect, useState } from 'react';

function RequestRow({ request, onApprove }) {
  return (
    <li>
      {request.name} — {request.status}
      {request.status === 'Pending' && (
        <button onClick={() => onApprove(request.id)}>Approve</button>
      )}
    </li>
  );
}

export default function App() {
  const [requests, setRequests] = useState([]);

  const [filter, setFilter] = useState('All');
  const visible = requests.filter(request => filter === 'All' || request.status === filter);
  const pendingCount = requests.filter(request => request.status === 'Pending').length;

  const [name, setName] = useState('');

  const [phase, setPhase] = useState('loading');
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function loadRequests() {
      try {
        const response = await fetch('/requests.json', { signal: controller.signal });
        if (!response.ok) throw new Error('Load failed');
        const data = await response.json();
        if (controller.signal.aborted) return;
        setRequests(data);
        setPhase('ready');
      } catch {
        if (!controller.signal.aborted) setPhase('error');
      }
    }

    loadRequests();
    return () => controller.abort();
  }, [attempt]);

  function retry() {
    setPhase('loading');
    setAttempt(previous => previous + 1);
  }

  function addRequest(event) {
    event.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    const request = { id: crypto.randomUUID(), name: trimmed, status: 'Pending' };
    setRequests(previous => [...previous, request]);
    setName('');
    setFilter('All');
  }

  function approve(id) {
    setRequests(previous => previous.map(request =>
      request.id === id ? { ...request, status: 'Approved' } : request
    ));
  }

  if (phase === 'loading') return <main><p>Loading requests…</p></main>;
  if (phase === 'error') {
    return <main><p>Could not load requests.</p><button onClick={retry}>Retry</button></main>;
  }

  return (
    <main>
      <h1>Request approvals</h1>
      <form onSubmit={addRequest}>
        <label>Request name <input value={name} onChange={event => setName(event.target.value)} /></label>
        <button disabled={!name.trim()}>Add request</button>
      </form>
      <p>Pending requests: {pendingCount}</p>
      <label>
        Status
        <select value={filter} onChange={event => setFilter(event.target.value)}>
          <option>All</option>
          <option>Pending</option>
          <option>Approved</option>
        </select>
      </label>
      {visible.length === 0 && <p>No matching requests.</p>}
      <ul>
        {visible.map(request => (
          <RequestRow key={request.id} request={request} onApprove={approve} />
        ))}
      </ul>
    </main>
  );
}
