// pages/index.js
import PropertyForm from '../components/PropertyForm';

export default function Home() {
  const handleSubmit = (formData) => {
    console.log('Form submitted:', formData);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">
        Immobilienbewertung - Stilvoll Immobilien
      </h1>
      <PropertyForm onSubmit={handleSubmit} />
    </div>
  );
}
