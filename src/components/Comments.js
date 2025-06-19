import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaUser, FaHeart, FaReply } from 'react-icons/fa';
import '../styles/Comments.css';

const Comments = ({ fundraiserId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [replyTo, setReplyTo] = useState(null);

  useEffect(() => {
    fetchComments();
  }, [fundraiserId]);

  const fetchComments = async () => {
    try {
      const response = await axios.get(`/api/fundraisers/${fundraiserId}/comments`);
      setComments(response.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const response = await axios.post(`/api/fundraisers/${fundraiserId}/comments`, {
        content: newComment,
        parentId: replyTo?.id
      });

      setComments(prev => [...prev, response.data]);
      setNewComment('');
      setReplyTo(null);
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };

  const handleLike = async (commentId) => {
    try {
      await axios.post(`/api/comments/${commentId}/like`);
      fetchComments(); // Refresh comments to get updated likes
    } catch (error) {
      console.error('Error liking comment:', error);
    }
  };

  const renderComment = (comment) => (
    <div key={comment._id} className="comment">
      <div className="comment-header">
        <div className="user-info">
          <FaUser className="user-avatar" />
          <span className="user-name">{comment.user.name}</span>
        </div>
        <span className="comment-date">
          {new Date(comment.createdAt).toLocaleDateString()}
        </span>
      </div>
      <div className="comment-content">{comment.content}</div>
      <div className="comment-actions">
        <button onClick={() => handleLike(comment._id)} className="like-btn">
          <FaHeart className={comment.liked ? 'liked' : ''} />
          <span>{comment.likes || 0}</span>
        </button>
        <button onClick={() => setReplyTo(comment)} className="reply-btn">
          <FaReply /> Reply
        </button>
      </div>
      {comment.replies?.length > 0 && (
        <div className="replies">
          {comment.replies.map(reply => renderComment(reply))}
        </div>
      )}
    </div>
  );

  if (loading) {
    return <div className="loading">Loading comments...</div>;
  }

  return (
    <div className="comments-section">
      <h3>Comments</h3>
      <form onSubmit={handleSubmitComment} className="comment-form">
        {replyTo && (
          <div className="replying-to">
            Replying to {replyTo.user.name}
            <button type="button" onClick={() => setReplyTo(null)}>×</button>
          </div>
        )}
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
          rows="3"
        />
        <button type="submit" className="submit-btn">
          {replyTo ? 'Reply' : 'Comment'}
        </button>
      </form>
      <div className="comments-list">
        {comments.map(comment => renderComment(comment))}
      </div>
    </div>
  );
};

export default Comments; 