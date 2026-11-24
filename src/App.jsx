
import { useState, useEffect, useCallback } from "react";
import RequestRow from "./RequestRow";
import "./style.css";

const STORAGE_KEY = "requests";

const initialRequests = [
  {
    id: 1,
    name: "Reporting access",
    status: "Pending",
    approverId: ""
  },
  {
    id: 2,
    name: "Add delegate",
    status: "Pending",
    approverId: ""
  },
  {
    id: 3,
    name: "Export permission",
    status: "Approved",
    approverId: ""
  }
];

export default function App() {
  // Load saved requests from localStorage
  const [requests, setRequests] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);

      if (saved !== null) {
        const parsed = JSON.parse(saved);

        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (error) {
      console.error("Error loading requests:", error);
    }

    return initialRequests;
  });

  const [requestName, setRequestName] = useState("");
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // API states
  const [approvers, setApprovers] = useState([]);
  const [loadingApprovers, setLoadingApprovers] = useState(true);
  const [approverError, setApproverError] = useState("");

  // Save requests to localStorage
  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(requests)
    );
  }, [requests]);

  // Fetch approvers from API
  useEffect(() => {
    const controller = new AbortController();

    async function fetchApprovers() {
      try {
        setLoadingApprovers(true);
        setApproverError("");

        const response = await fetch(
          "https://jsonplaceholder.typicode.com/users",
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch approvers");
        }

        const data = await response.json();

        if (!controller.signal.aborted) {
          setApprovers(data);
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          setApproverError(error.message);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoadingApprovers(false);
        }
      }
    }

    fetchApprovers();

    return () => {
      controller.abort();
    };
  }, []);

  // Approve or reopen a request
  const updateStatus = useCallback((id, status) => {
    setRequests(previousRequests =>
      previousRequests.map(request =>
        request.id === id
          ? { ...request, status }
          : request
      )
    );
  }, []);

  // Delete a request
  const deleteRequest = useCallback((id) => {
    setRequests(previousRequests =>
      previousRequests.filter(request =>
        request.id !== id
      )
    );
  }, []);

  // Assign an approver
  const assignApprover = useCallback((requestId, approverId) => {
    setRequests(previousRequests =>
      previousRequests.map(request =>
        request.id === requestId
          ? { ...request, approverId }
          : request
      )
    );
  }, []);

  // Add a new request
  function addRequest(event) {
    event.preventDefault();

    const trimmedName = requestName.trim();

    if (!trimmedName) {
      setError("Request name is required");
      return;
    }

    const newRequest = {
      id: crypto.randomUUID(),
      name: trimmedName,
      status: "Pending",
      approverId: ""
    };

    setRequests(previousRequests => [
      ...previousRequests,
      newRequest
    ]);

    setRequestName("");
    setError("");
  }

  // Search and filter requests
  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.name
      .toLowerCase()
      .includes(search.trim().toLowerCase());

    const matchesStatus =
      statusFilter === "All" ||
      request.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <main className="app">
      <h1>React Approval Lab</h1>

      <h2>Add New Request</h2>

      <form onSubmit={addRequest} className="request-form">
        <input
          type="text"
          placeholder="Enter request name"
          value={requestName}
          onChange={(event) => {
            setRequestName(event.target.value);
            setError("");
          }}
        />

        <button type="submit">
          Add Request
        </button>
      </form>

      {error && <p className="error">{error}</p>}

      <h2>Search and Filter</h2>

      <div className="filters">
        <input
          type="text"
          placeholder="Search requests"
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
        />

        <select
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(event.target.value)
          }
        >
          <option value="All">All</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
        </select>
      </div>

      <h2>Request List</h2>

      {loadingApprovers && (
        <p>Loading approvers...</p>
      )}

      {approverError && (
        <p className="error">{approverError}</p>
      )}

      {filteredRequests.length === 0 ? (
        <p>No requests found</p>
      ) : (
        <div className="request-list">
          {filteredRequests.map(request => (
            <RequestRow
              key={request.id}
              request={request}
              approvers={approvers}
              onUpdateStatus={updateStatus}
              onDelete={deleteRequest}
              onAssignApprover={assignApprover}
            />
          ))}
        </div>
      )}

      <p className="total">
        Total Requests: {requests.length}
      </p>
    </main>
  );
}
