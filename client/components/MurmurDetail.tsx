import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { murmurService, Murmur } from '../services/murmurService';
import { MurmurCard } from './MurmurCard';

export const MurmurDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [murmur, setMurmur] = useState<Murmur | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadMurmur = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const data = await murmurService.getById(parseInt(id));
        setMurmur(data);
      } catch (err: any) {
        setError(err.response?.status === 404 ? 'Murmur not found' : 'Error loading murmur');
      } finally {
        setLoading(false);
      }
    };
    loadMurmur();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error || !murmur) {
    return (
      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
        <h2>404 - Murmur Not Found</h2>
        <p>{error || 'The murmur you are looking for does not exist.'}</p>
        <Link to="/timeline">Back to Timeline</Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <Link to="/timeline" style={{ marginBottom: '20px', display: 'block' }}>← Back to Timeline</Link>
      <MurmurCard murmur={murmur} />
    </div>
  );
};

