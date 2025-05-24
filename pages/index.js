// pages/index.js
import { useState } from 'react';
import PropertyForm from '../components/PropertyForm';

export default function Home() {
  const [evaluation, setEvaluation] = useState(null);

  const handleSubmit = async (formData) => {
    try {
      const res = await fetch('/api/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      setEvaluation(data.evaluation);
    } catch (error) {
      console.error('Error:', error);
      setEvaluation({ error: 'Bewertung fehlgeschlagen' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">
        Immobilienbewertung - Stilvoll Immobilien
      </h1>
      <PropertyForm onSubmit={handleSubmit} />
      {evaluation && (
        <div className="mt-4 p-4 bg-white rounded shadow">
          {evaluation.error ? (
            <p className="text-red-600">{evaluation.error}</p>
          ) : (
            <>
              <p className="text-gray-800 font-bold">{evaluation.value}</p>
              <p className="text-gray-600 mt-2">{evaluation.explanation}</p>
              <p className="text-gray-600 mt-4">
                Dies ist eine datenbasierte Ersteinschätzung. Für eine genaue Bewertung ist eine Vor-Ort-Besichtigung erforderlich.
              </p>
              <a
                href="/termin"
                className="inline-block mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Termin vereinbaren
              </a>
            </>
          )}
        </div>
      )}
    </div>
  );
}
