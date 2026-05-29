'use client';

import { useEffect, useState } from 'react';
import { healthApi } from '@/lib/api';

/**
 * Simple component to test backend connection
 * Place this in your app temporarily to verify the connection works
 * Remove it once you confirm everything is working
 */
export default function ConnectionTest() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState<string>('');
  const [details, setDetails] = useState<any>(null);

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    setStatus('loading');
    try {
      const result = await healthApi.check();
      setStatus('success');
      setMessage('✓ Backend connection successful!');
      setDetails(result);
    } catch (error: any) {
      setStatus('error');
      const errorMsg = error.message || 'Failed to connect to backend';
      setMessage(`✗ Connection failed: ${errorMsg}`);
      setDetails({
        error: errorMsg,
        hint: 'Make sure:',
        steps: [
          '1. Backend is running: npm run dev (in codekrafters-server)',
          '2. Frontend is running on port 3000',
          '3. .env.local has NEXT_PUBLIC_API_URL=http://localhost:4000/api',
          '4. Backend .env has CORS_ORIGIN=http://localhost:3000',
        ],
      });
    }
  };

  return (
    <div className="fixed bottom-4 right-4 max-w-sm p-4 rounded-lg shadow-lg border-2 font-mono text-sm z-50"
      style={{
        backgroundColor: status === 'success' ? '#d4edda' : status === 'error' ? '#f8d7da' : '#e2e3e5',
        borderColor: status === 'success' ? '#28a745' : status === 'error' ? '#dc3545' : '#6c757d',
        color: status === 'success' ? '#155724' : status === 'error' ? '#721c24' : '#383d41',
      }}>
      <div className="flex justify-between items-start mb-2">
        <strong>Connection Test</strong>
        <button 
          onClick={testConnection}
          className="text-xs px-2 py-1 rounded hover:opacity-70"
          style={{ backgroundColor: 'currentColor', color: 'inherit' }}>
          Retry
        </button>
      </div>
      
      <div className="mb-2">{message}</div>
      
      {details && (
        <div className="text-xs opacity-75 space-y-1 mt-2 max-h-48 overflow-auto">
          {Array.isArray(details.steps) ? (
            details.steps.map((step: string, i: number) => (
              <div key={i}>{step}</div>
            ))
          ) : (
            <pre className="whitespace-pre-wrap break-words">{JSON.stringify(details, null, 2)}</pre>
          )}
        </div>
      )}
    </div>
  );
}
