
import { memo } from "react";

const RequestRow = memo(function RequestRow({
  request,
  approvers,
  onUpdateStatus,
  onDelete,
  onAssignApprover
}) {
  console.log("Rendering RequestRow:", request.name);

  const hasApprover =
    request.approverId !== undefined &&
    request.approverId !== null &&
    request.approverId !== "";

  return (
    <div className="request-row">
      <div className="request-details">
        <strong>{request.name}</strong>

        <span
          className={
            request.status === "Approved"
              ? "status approved"
              : "status pending"
          }
        >
          {request.status}
        </span>

        <select
          value={request.approverId ?? ""}
          disabled={request.status === "Approved"}
          onChange={(event) =>
            onAssignApprover(
              request.id,
              event.target.value
            )
          }
        >
          <option value="">
            Select an approver
          </option>

          {approvers.map(approver => (
            <option
              key={approver.id}
              value={approver.id}
            >
              {approver.name}
            </option>
          ))}
        </select>
      </div>

      <div className="actions">
        {request.status === "Pending" && (
          <button
            className="approve-btn"
            disabled={!hasApprover}
            onClick={() =>
              onUpdateStatus(
                request.id,
                "Approved"
              )
            }
          >
            Approve
          </button>
        )}

        {request.status === "Approved" && (
          <button
            className="reopen-btn"
            onClick={() =>
              onUpdateStatus(
                request.id,
                "Pending"
              )
            }
          >
            Reopen
          </button>
        )}

        <button
          className="delete-btn"
          onClick={() => onDelete(request.id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
});

export default RequestRow;
