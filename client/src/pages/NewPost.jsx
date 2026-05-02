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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
      <h1 style={{ fontFamily: 'var(--font-head)', fontSize: '2rem', marginBottom: '2rem' }}>
        Write a new post
      </h1>
      <PostForm onSubmit={handleSubmit} loading={loading} />
    </div>
  );
}
