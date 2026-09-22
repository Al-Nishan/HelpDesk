import { useState } from "react";
import { addComment } from "../services/ticketService";

interface AddCommentFormProps {
  ticketId: number;
  onAdded: () => void;
  onCancel: () => void;
}

function AddCommentForm({
  ticketId,
  onAdded,
  onCancel,
}: AddCommentFormProps) {
  const [comment, setComment] = useState("");

  return (
    <div>
      <h4>Add Comment</h4>

      <textarea
        value={comment}
        onChange={(event) => setComment(event.target.value)}
        placeholder="Enter your comment"
      />

      <br />
      <br />

      <button
        type="button"
        onClick={async () => {
          try {
            await addComment(ticketId, comment);
            onAdded();
          } catch (error) {
            console.error("Failed to add comment:", error);
            alert("Failed to add comment.");
          }
        }}
      >
        Add Comment
      </button>

      <button type="button" onClick={onCancel}>
        Cancel
      </button>
    </div>
  );
}

export default AddCommentForm;