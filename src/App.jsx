import { useCallback, useState } from "react";
import RequestRow from "./RequestRow";

const initialRequests = [
  { id: 1, name: 'Reporting access', status: 'Pending' },
  { id: 2, name: 'Add delegate', status: 'Pending' },
  { id: 3, name: 'Export permission', status: 'Approved' },
];

export default function App() {
  const [requests, setRequests] = useState(initialRequests)

  // state for input field
  const [requestName, setRequestName] = useState("");

  // add error state

  const [error, setError] = useState('');

  const [statusFilter, setStatusFilter] = useState("All");

  const [searchQuery, setSearchQuery] =useState("");

  // step 2 update request status 

  // function updateStatus(id, nextStatus) {
  //   setRequests( previousRequest => 
  //     previousRequest.map( request => 
  //       request.id === id ? { ...request , status : nextStatus} :  request
  //     )
  //   )
  // }

  const updateStatus = useCallback((id, status) => {
    setRequests( (previousRequest) => 
    previousRequest.map( (request) => 
    request.id === id ?  {... request, status} : request ))
  }, [])

  // add new request 
  function addRequest(event) {
    event.preventDefault();
    if(requestName.trim() === '') {
      setError('Request Name is required')
      return
    }

    const newRequest = {
      id: crypto.randomUUID(),
      name: requestName.trim(),
      status: 'Pending'
    }

    setRequests( previousRequest => [
      ...previousRequest,
      newRequest
    ] )

    setRequestName("")
    setError("")

  }

  // delete request 
  // function deleteRequest(id) {
  //   setRequests( previousRequest => 
  //     previousRequest.filter( request => request.id !== id)
  //   )

  // }

  const deleteRequest = useCallback( (id) => {
    setRequests ( (previousRequest) => 
      previousRequest.filter ( (request) => 
        request.id !== id
      )
    )
  }, [])

const normalizedQuery = searchQuery.trim().toLowerCase();
  const visibleRequests = requests.filter(
    (request) => {
      const matchesStatus =  statusFilter === 'All' || request.status === statusFilter ;
      const matchesSearch = request.name
      .toLocaleLowerCase()
      .includes(normalizedQuery)

     return matchesStatus && matchesSearch

    }
  ) 


  return (
    
<section className="request-panel">
  

  <h2 className="request-heading">Request Approval</h2>

  <header className="request-header">

   <div className="request-filter">
      <label htmlFor="">Filter by status</label>
      <select 
      id="status-filter"
      value={statusFilter}
      onChange = { (event) => setStatusFilter(event.target.value)}
      >
        <option value="All">All</option>
        <option value="Pending">Pending</option>
        <option value="Approved">Approved</option>
      </select>
    
    </div>

    <div className="request-filter">
     <label htmlFor="request-search">Search Requests</label>
     <input 
     id= 'request-search'
     type="search"
     placeholder="search by name"
     value={searchQuery}
     onChange={ (event) => setSearchQuery(event.target.value)}
      />
    
    </div>
  </header>





 <form onSubmit={addRequest}>
  <input 
  type="text" 
  placeholder="Enter request"
  value={ requestName } 
  onChange={ (event) => {
    setRequestName(event.target.value);
    setError("");
  }}
   />

   { error && (
    <p style={{ color: "red" }}> {error}</p>
   )}

  <button type="submit" disabled={!requestName.trim()}> Add Request</button>
 
 </form>
  
  <h2>Request list </h2>
 
 {visibleRequests.length === 0 && (
  <p className="request-empty">
    {requests.length === 0
      ? 'Add a request to get started.'
      : 'No requests match your search and filter.'}
  </p>
)}
  <ul className="request-list">

   



  { visibleRequests.map( request => (

    <RequestRow
    key={request.id}
    request={request}
    onStatusChange={updateStatus}
    onDeleteRequest={deleteRequest}


    />
  ))

  }
  </ul>

   <p className="request-total" aria-live="polite">
          Showing {visibleRequests.length} of {requests.length} requests
        </p>
  
  </section>
  )
  
  
}
