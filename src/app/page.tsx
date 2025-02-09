'use client';
import React, { useState, ChangeEvent } from 'react';
import { Upload, Camera, Loader } from 'lucide-react';
import Image from 'next/image';

export default function CastingAI() {
  const [photo, setPhoto] = useState<File | null>(null);
  const [characterName, setCharacterName] = useState('');
  const [hasName, setHasName] = useState('no');
  const [breakdown, setBreakdown] = useState('');
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handlePhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPhoto(e.target.files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setPhoto(e.dataTransfer.files[0]);
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
      console.log(data, 'breakdown')
      setBreakdown(data.breakdown);
    } catch (error) {
      console.error('Error generating breakdown:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen  text-white flex flex-col items-center">
      <div className="w-full max-w-4xl px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-6xl font-bold font-secondary text-primary">
            Monks Casting Studio
          </h1>
          <p className="mt-4 text-white">Transform your character with AI-powered casting insights</p>
        </header>

        <div className="w-full flex flex-col items-center">
          <div className="w-full max-w-xl border border-primary  bg-background backdrop-blur-sm rounded-xl shadow-xl  overflow-hidden">
            <div className="p-8 space-y-6">
              {photo ? (
                <div className="relative group" style={{ width: '600px', height: '400px', position: 'relative' }}>
                  <Image
                    // fill={true}
                    // layout="fill"
                    fill
                    src={URL.createObjectURL(photo)}
                    alt="Character Preview"
                    className="w-full h-64 object-cover rounded-lg border-2 border-yellow-500/50"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <label className="cursor-pointer bg-yellow-900 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                      <Camera size={20} />
                      Change Photo
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              ) : (
                <div
                  className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors
                    ${dragActive ? 'border-yellow-900 bg-yellow-900/10' : 'border-gray-600 hover:border-yellow-900/50'}`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <div className="flex flex-col items-center gap-4">
                    <Upload size={48} className="text-gray-400" />
                    <div>
                      <p className="text-lg font-medium">Drag and drop your photo here</p>
                      <p className="text-gray-400">or</p>
                      <label className="inline-block mt-2">
                        <span className="bg-yellow-900 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-yellow-900 transition-colors">
                          Browse Files
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoChange}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <label className="block">
                  <span className="text-gray-300 text-sm font-medium">Character Name Status</span>
                  <select
                    value={hasName}
                    onChange={(e) => setHasName(e.target.value)}
                    className="mt-1 block w-full rounded-lg  text-white px-4 py-2.5 focus:ring-2 focus:ring-yellow-900 focus:border-yellow-900 transition-colors"
                  >
                    <option value="no">No name yet</option>
                    <option value="yes">I have a name</option>
                  </select>
                </label>

                {hasName === 'yes' && (
                  <label className="block">
                    <span className="text-gray-300 text-sm font-medium">Character Name</span>
                    <input
                      type="text"
                      placeholder="Enter your character's name"
                      className="mt-1 block w-full rounded-lg  text-white px-4 py-2.5 focus:ring-2 focus:ring-yellow-900 focus:border-yellow-900 transition-colors"
                      value={characterName}
                      onChange={(e) => setCharacterName(e.target.value)}
                    />
                  </label>
                )}
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-primary text-black  py-3 px-6 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader className="animate-spin" size={20} />
                    Processing...
                  </>
                ) : (
                  'Generate Character Breakdown'
                )}
              </button>
            </div>
          </div>

          {breakdown && (
            <div className="w-full max-w-xl mt-8 bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-xl border border-gray-700/50 p-8">
              <h2 className="text-3xl font-bold mb-6 text-transparent">
                Character Breakdown
              </h2>
              <div className="prose prose-invert max-w-none">
                <pre className="whitespace-pre-wrap text-gray-300 font-mono text-sm bg-gray-900 p-6 rounded-lg">
                  {breakdown}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}