import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import PostForm from '../components/PostForm';

export default function NewPost() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await api.post('/posts', data);
      navigate(`/posts/${res.data.post.slug}`);
    } finally { setLoading(false); }
  };

  return (
    <div className="page container post-form-page">
      <PostForm onSubmit={handleSubmit} loading={loading} title="Write a new story" />
    </div>
  );
}
