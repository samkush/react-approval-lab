import { useState } from 'react';

const initialRequests = [
  { id: 1, name: 'Reporting access', status: 'Pending' },
  { id: 2, name: 'Add delegate', status: 'Pending' },
  { id: 3, name: 'Export permission', status: 'Approved' },
];

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
  const [requests, setRequests] = useState(initialRequests);

  const [filter, setFilter] = useState('All');
  const visible = requests.filter(request => filter === 'All' || request.status === filter);
  const pendingCount = requests.filter(request => request.status === 'Pending').length;

  const [name, setName] = useState('');

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
