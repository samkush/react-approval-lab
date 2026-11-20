import { useState } from "react";

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

  const [error, setError] = useState('')

  // step 2 update request status 

  function updateStatus(id, nextStatus) {
    setRequests( previousRequest => 
      previousRequest.map( request => 
        request.id === id ? { ...request , status : nextStatus} :  request
      )
    )
  }

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
  function deleteRequest(id) {
    setRequests( previousRequest => 
      previousRequest.filter( request => request.id !== id)
    )

  }

  return (
    
<section className="request-panel">
  

  <h2>Request Approval System</h2>
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

  <button type="submit"> Add Request</button>
 
 </form>
  
  <h2>Request list </h2>
 

  <ul className="request-list">
  { requests.map( request => (
    <li className="request-row" key={request.id}>
    <div className="request-details">
    <span className="request-name">{request.name}</span>
    <span className="request-status">{request.status}</span>

    </div>

    <div className="request-actions">
         { request.status === 'Pending' && (
        <button type="button"
        onClick={ ()=> updateStatus(request.id, 'Approved')}
        >
        Approve
        </button>
  )}

  {
    request.status === 'Approved' && (
      <button 
      onClick={ () => updateStatus(request.id, 'Pending')}
      >
       Reopen
      </button>
    )}

      <button style={ {color: "red", background: "white"}} onClick={ () => deleteRequest(request.id)}>
      Delete
      </button>
    
    </div>



  


    </li>
  ))

  }
  </ul>

  <p style={{ margin: "10px"}}> Total Requests : { requests.length} </p>
  
  </section>
  )
  
  
}
