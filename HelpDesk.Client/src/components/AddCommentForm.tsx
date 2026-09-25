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
    <div className="comment-form">
      <h4>Add a comment</h4>

      <textarea
        value={comment}
        onChange={(event) => setComment(event.target.value)}
        placeholder="Write a comment..."
        rows={4}
      />

      <div className="comment-form-actions">
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

        <button
          type="button"
          className="secondary-button"
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default AddCommentForm;