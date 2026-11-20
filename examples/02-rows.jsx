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

  function approve(id) {
    setRequests(previous => previous.map(request =>
      request.id === id ? { ...request, status: 'Approved' } : request
    ));
  }

  return (
    <main>
      <h1>Request approvals</h1>
      <ul>
        {requests.map(request => (
          <RequestRow key={request.id} request={request} onApprove={approve} />
        ))}
      </ul>
    </main>
  );
}
