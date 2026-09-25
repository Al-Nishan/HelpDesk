import { useEffect, useState } from "react";
import { getComments } from "../services/ticketService";
import type { TicketComment } from "../types/Comment";

interface CommentsListProps {
  ticketId: number;
  refreshKey?: number;
}

function CommentsList({ ticketId, refreshKey }: CommentsListProps) {
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
  }, [ticketId, refreshKey]);

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
        <div className="comment-item" key={comment.id}>
          <div className="comment-header">
            <strong>{comment.createdBy}</strong>

            <small>
              {new Date(comment.createdAt).toLocaleString()}
            </small>
          </div>

          <p>{comment.comment}</p>
        </div>
      ))}
    </div>
  );
}

export default CommentsList;