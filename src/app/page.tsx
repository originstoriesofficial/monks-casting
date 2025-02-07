'use client';

import React, { useState, ChangeEvent } from 'react';

export default function Home() {
  const [photo, setPhoto] = useState<File | null>(null);
  const [characterName, setCharacterName] = useState('');
  const [hasName, setHasName] = useState('no');
  const [breakdown, setBreakdown] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPhoto(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!photo) {
      alert('Please upload a photo.');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('photo', photo);
    formData.append('characterName', characterName);
    formData.append('hasName', hasName);

    try {
      const response = await fetch('/api/generate-character', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      setBreakdown(data.breakdown);
    } catch (error) {
      console.error('Error generating breakdown:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2 text-red-500">MØNKS Casting Office</h1>
        <p className="text-lg text-gray-700">Submit to our award-winning agents</p>
      </header>

      <div className="space-y-6 bg-white p-6 rounded shadow max-w-lg mx-auto">
        <div>
          <label className="block font-medium mb-1">Upload Character Photo</label>
          <input type="file" accept="image/*" onChange={handlePhotoChange} />
        </div>

        <div>
          <label className="block font-medium mb-1">Do you have a name for your character?</label>
          <select
            value={hasName}
            onChange={(e) => setHasName(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="no">No</option>
            <option value="yes">Yes</option>
          </select>
          {hasName === 'yes' && (
            <input
              type="text"
              placeholder="Enter character name"
              className="w-full p-2 border rounded mt-2"
              value={characterName}
              onChange={(e) => setCharacterName(e.target.value)}
            />
          )}
        </div>

        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 w-full"
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Submit'}
        </button>
      </div>

      {breakdown && (
        <div className="mt-8 bg-white p-6 rounded shadow max-w-lg mx-auto">
          <h2 className="text-2xl font-bold mb-4">Character Breakdown</h2>
          <pre className="whitespace-pre-wrap">{breakdown}</pre>
        </div>
      )}
    </div>
  );
}
