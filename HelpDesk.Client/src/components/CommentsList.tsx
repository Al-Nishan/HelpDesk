import { useEffect, useState } from "react";
import { getComments } from "../services/ticketService";
import type { TicketComment } from "../types/Comment";

interface CommentsListProps {
  ticketId: number;
}

function CommentsList({ ticketId }: CommentsListProps) {
  const [comments, setComments] = useState<TicketComment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadComments() {
      try {
        const data = await getComments(ticketId);
        setComments(data);
      } catch (error) {
        console.error("Failed to load comments:", error);
      } finally {
        setLoading(false);
      }
    }

    loadComments();
  }, [ticketId]);

  if (loading) {
    return <p>Loading comments...</p>;
  }

  if (comments.length === 0) {
    return <p>No comments yet.</p>;
  }

  return (
    <div>
      <h4>Comments</h4>

      {comments.map((comment) => (
        <div key={comment.id}>
          <p>{comment.comment}</p>

          <small>
            {comment.createdBy} ·{" "}
            {new Date(comment.createdAt).toLocaleString()}
          </small>
        </div>
      ))}
    </div>
  );
}

export default CommentsList;