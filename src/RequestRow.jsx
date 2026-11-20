import { memo } from "react";

 function RequestRow ({ request , onStatusChange, onDeleteRequest }) {
    const isApproved = request.status === 'Approved';

    return (
         <li className="request-row" key={request.id}>

        <div className="request-details">
            <span className="request-name">{request.name}</span>
            <span className="request-status">{request.status}</span>

        </div>

    <div className="request-actions">
        
        <button type="button"
        onClick={ ()=> onStatusChange(request.id, isApproved ? 'Pending' : 'Approved' )}
        >
        { isApproved ? 'Reopen' : 'Approve'}
        </button>
 

      <button style={ {color: "red", background: "white"}} 
      onClick={ () => onDeleteRequest(request.id)}>
        Delete
      </button>
    
    </div>



  


    </li>
    )
}

export default memo(RequestRow);