// components/PropertyForm.js
import { useState } from 'react';

export default function PropertyForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    address: '',
    objectType: '',
    buildYear: '',
    livingArea: '',
    plotArea: '',
    condition: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap gap-4 p-4 bg-gray-100 rounded">
      <div className="w-full sm:w-1/2 md:w-1/3">
        <label className="block text-gray-800">Adresse</label>
        <input
          type="text"
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-600 hover:shadow-lg"
          placeholder="z. B. Demostraße 1, 51399 Burscheid"
        />
      </div>
      <div className="w-full sm:w-1/2 md:w-1/3">
        <label className="block text-gray-800">Objektart</label>
        <select
          value={formData.objectType}
          onChange={(e) => setFormData({ ...formData, objectType: e.target.value })}
          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-600 hover:shadow-lg"
        >
          <option value="">Auswählen...</option>
          <option value="Einfamilienhaus">Einfamilienhaus</option>
          <option value="Doppelhaus">Doppelhaus</option>
          <option value="Eigentumswohnung">Eigentumswohnung</option>
        </select>
      </div>
      <div className="w-full sm:w-1/2 md:w-1/3">
        <label className="block text-gray-800">Baujahr</label>
        <select
          value={formData.buildYear}
          onChange={(e) => setFormData({ ...formData, buildYear: e.target.value })}
          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-600 hover:shadow-lg"
        >
          <option value="">Auswählen...</option>
          <option value="vor 1900">Vor 1900</option>
          <option value="1900-1950">1900–1950</option>
          <option value="1951-2000">1951–2000</option>
          <option value="2001-heute">2001–heute</option>
        </select>
      </div>
      <div className="w-full sm:w-1/2 md:w-1/3">
        <label className="block text-gray-800">Wohnfläche (m²)</label>
        <input
          type="number"
          value={formData.livingArea}
          onChange={(e) => setFormData({ ...formData, livingArea: e.target.value })}
          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-600 hover:shadow-lg"
          placeholder="z. B. 155"
        />
      </div>
      <div className="w-full sm:w-1/2 md:w-1/3">
        <label className="block text-gray-800">Grundstücksfläche (m²)</label>
        <input
          type="number"
          value={formData.plotArea}
          onChange={(e) => setFormData({ ...formData, plotArea: e.target.value })}
          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-600 hover:shadow-lg"
          placeholder="z. B. 560"
        />
      </div>
      <div className="w-full sm:w-1/2 md:w-1/3">
        <label className="block text-gray-800">Zustand</label>
        <select
          value={formData.condition}
          onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-600 hover:shadow-lg"
        >
          <option value="">Auswählen...</option>
          <option value="renoviert">Renoviert</option>
          <option value="gepflegt">Gepflegt</option>
          <option value="sanierungsbedürftig">Sanierungsbedürftig</option>
          <option value="neuwertig">Neuwertig</option>
        </select>
      </div>
      <button
        type="submit"
        className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Bewertung starten
      </button>
    </form>
  );
}
