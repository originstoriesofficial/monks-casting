mport React, { useState } from 'react';
import { useRouter } from 'next/router';

export default function CharacterForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    tokenId: '',
    walletAddress: '',
    visionAttributes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/character', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create character');
      }

      const result = await response.json();
      
      // Redirect to the newly created character page
      router.push(`/character/${formData.tokenId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-yellow-800 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-6 text-yellow-200">Create Mantle Monk Character</h1>
      
      {error && (
        <div className="bg-red-500 text-white p-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-yellow-200 mb-1">Character Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded bg-yellow-100"
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="tokenId" className="block text-yellow-200 mb-1">Token ID</label>
          <input
            type="text"
            id="tokenId"
            name="tokenId"
            value={formData.tokenId}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded bg-yellow-100"
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="walletAddress" className="block text-yellow-200 mb-1">Wallet Address (Optional)</label>
          <input
            type="text"
            id="walletAddress"
            name="walletAddress"
            value={formData.walletAddress}
            onChange={handleChange}
            className="w-full p-2 border rounded bg-yellow-100"
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="visionAttributes" className="block text-yellow-200 mb-1">Vision Attributes</label>
          <textarea
            id="visionAttributes"
            name="visionAttributes"
            value={formData.visionAttributes}
            onChange={handleChange}
            rows={4}
            className="w-full p-2 border rounded bg-yellow-100"
            placeholder="Describe the visual appearance of your character"
          />
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className={`w-full p-3 rounded font-bold ${
            loading ? 'bg-gray-400' : 'bg-yellow-500 hover:bg-yellow-600'
          } text-yellow-900`}
        >
          {loading ? 'Creating...' : 'Generate Character'}
        </button>
      </form>
    </div>
  );
}