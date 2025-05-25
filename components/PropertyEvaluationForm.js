// components/PropertyEvaluationForm.js
import { useState } from 'react';

export default function PropertyEvaluationForm() {
  const [formData, setFormData] = useState({
    address: '',
    city: '',
    zipCode: '',
    propertyType: 'einfamilienhaus',
    constructionYear: '',
    evaluationPurpose: 'verkauf',
    plotSize: '',
    soilValue: '',
    developmentStatus: 'vollständig',
    soilCondition: 'normal',
    zoningPlan: 'wohngebiet',
    encumbrances: 'nein',
    floodRisk: 'nein',
    livingArea: '',
    rooms: '',
    floors: '',
    basement: 'ja',
    roofing: 'satteldach',
    garage: 'nein',
    garageArea: '',
    outdoorFacilities: [],
    equipmentLevel: 'mittel',
    heatingSystem: 'gas',
    sanitaryCondition: 'baujahrestypisch',
    lastModernization: '',
    modernizationDetails: '',
    repairBacklog: '',
    accessibility: 'nein',
    energyCertificate: 'nein',
    energyClass: '',
    localLocation: '',
    publicTransportDistance: '',
    amenitiesDistance: '',
    marketRent: '',
    capitalizationRate: '',
  });
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData((prev) => ({
        ...prev,
        [name]: checked
          ? [...prev[name], value]
          : prev[name].filter((item) => item !== value),
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setResponse(null);

    try {
      const res = await fetch('/api/evaluate-property', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        setResponse(data.evaluation);
      } else {
        setError(data.error || 'Fehler bei der Bewertung');
      }
    } catch (err) {
      setError('Netzwerkfehler. Bitte versuche es erneut.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Immobilienbewertung</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Allgemeine Objektinformationen */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Allgemeine Informationen</h3>
          <div>
            <label className="block text-sm font-medium">Adresse (Straße, Hausnummer)</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="mt-1 w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Stadt und Postleitzahl</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="mt-1 w-full p-2 border rounded"
              required
            />
            <input
              type="text"
              name="zipCode"
              value={formData.zipCode}
              onChange={handleChange}
              className="mt-1 w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Immobilientyp</label>
            <select
              name="propertyType"
              value={formData.propertyType}
              onChange={handleChange}
              className="mt-1 w-full p-2 border rounded"
            >
              <option value="einfamilienhaus">Einfamilienhaus</option>
              <option value="wohnung">Wohnung</option>
              <option value="gewerbe">Gewerbe</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">Baujahr</label>
            <input
              type="number"
              name="constructionYear"
              value={formData.constructionYear}
              onChange={handleChange}
              className="mt-1 w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Anlass der Bewertung</label>
            <select
              name="evaluationPurpose"
              value={formData.evaluationPurpose}
              onChange={handleChange}
              className="mt-1 w-full p-2 border rounded"
            >
              <option value="verkauf">Verkauf</option>
              <option value="finanzierung">Finanzierung</option>
              <option value="sonstiges">Sonstiges</option>
            </select>
          </div>
        </div>

        {/* Grundstück */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Grundstück</h3>
          <div>
            <label className="block text-sm font-medium">Grundstücksgröße (m²)</label>
            <input
              type="number"
              name="plotSize"
              value={formData.plotSize}
              onChange={handleChange}
              className="mt-1 w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Bodenrichtwert (€/m², falls bekannt)</label>
            <input
              type="number"
              name="soilValue"
              value={formData.soilValue}
              onChange={handleChange}
              className="mt-1 w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Erschließungszustand</label>
            <select
              name="developmentStatus"
              value={formData.developmentStatus}
              onChange={handleChange}
              className="mt-1 w-full p-2 border rounded"
            >
              <option value="vollständig">Vollständig erschlossen</option>
              <option value="teilweise">Teilweise erschlossen</option>
              <option value="nicht">Nicht erschlossen</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">Baugrundbeschaffenheit</label>
            <select
              name="soilCondition"
              value={formData.soilCondition}
              onChange={handleChange}
              className="mt-1 w-full p-2 border rounded"
            >
              <option value="normal">Normal tragfähig</option>
              <option value="problematisch">Problematisch</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">Bebauungsplan</label>
            <select
              name="zoningPlan"
              value={formData.zoningPlan}
              onChange={handleChange}
              className="mt-1 w-full p-2 border rounded"
            >
              <option value="wohngebiet">Wohngebiet</option>
              <option value="mischgebiet">Mischgebiet</option>
              <option value="gewerbegebiet">Gewerbegebiet</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">Grundbuchliche Belastungen (z. B. Wegerecht)</label>
            <select
              name="encumbrances"
              value={formData.encumbrances}
              onChange={handleChange}
              className="mt-1 w-full p-2 border rounded"
            >
              <option value="nein">Nein</option>
              <option value="ja">Ja</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">Liegt die Immobilie in einem Überschwemmungsgebiet?</label>
            <select
              name="floodRisk"
              value={formData.floodRisk}
              onChange={handleChange}
              className="mt-1 w-full p-2 border rounded"
            >
              <option value="nein">Nein</option>
              <option value="ja">Ja</option>
            </select>
          </div>
        </div>

        {/* Gebäude und bauliche Anlagen */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Gebäude und bauliche Anlagen</h3>
          <div>
            <label className="block text-sm font-medium">Wohnfläche (m²)</label>
            <input
              type="number"
              name="livingArea"
              value={formData.livingArea}
              onChange={handleChange}
              className="mt-1 w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Anzahl der Zimmer</label>
            <input
              type="number"
              name="rooms"
              value={formData.rooms}
              onChange={handleChange}
              className="mt-1 w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Anzahl der Vollgeschosse</label>
            <input
              type="number"
              name="floors"
              value={formData.floors}
              onChange={handleChange}
              className="mt-1 w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Unterkellert</label>
            <select
              name="basement"
              value={formData.basement}
              onChange={handleChange}
              className="mt-1 w-full p-2 border rounded"
            >
              <option value="ja">Ja</option>
              <option value="nein">Nein</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">Bedachung</label>
            <select
              name="roofing"
              value={formData.roofing}
              onChange={handleChange}
              className="mt-1 w-full p-2 border rounded"
            >
              <option value="satteldach">Satteldach</option>
              <option value="flachdach">Flachdach</option>
              <option value="walmdach">Walmdach</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">Garage</label>
            <select
              name="garage"
              value={formData.garage}
              onChange={handleChange}
              className="mt-1 w-full p-2 border rounded"
            >
              <option value="nein">Nein</option>
              <option value="einzel">Einzelgarage</option>
              <option value="mehrfach">Mehrfachgarage</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">Garagefläche (m²)</label>
            <input
              type="number"
              name="garageArea"
              value={formData.garageArea}
              onChange={handleChange}
              className="mt-1 w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Außenanlagen</label>
            <div className="space-y-2">
              <label>
                <input
                  type="checkbox"
                  name="outdoorFacilities"
                  value="terrasse"
                  checked={formData.outdoorFacilities.includes('terrasse')}
                  onChange={handleChange}
                  className="mr-2"
                />
                Terrasse
              </label>
              <label>
                <input
                  type="checkbox"
                  name="outdoorFacilities"
                  value="balkon"
                  checked={formData.outdoorFacilities.includes('balkon')}
                  onChange={handleChange}
                  className="mr-2"
                />
                Balkon
              </label>
              <label>
                <input
                  type="checkbox"
                  name="outdoorFacilities"
                  value="garten"
                  checked={formData.outdoorFacilities.includes('garten')}
                  onChange={handleChange}
                  className="mr-2"
                />
                Garten
              </label>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium">Ausstattungsgrad</label>
            <select
              name="equipmentLevel"
              value={formData.equipmentLevel}
              onChange={handleChange}
              className="mt-1 w-full p-2 border rounded"
            >
              <option value="einfach">Einfach</option>
              <option value="mittel">Mittel</option>
              <option value="gehoben">Gehoben</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">Heizungssystem</label>
            <select
              name="heatingSystem"
              value={formData.heatingSystem}
              onChange={handleChange}
              className="mt-1 w-full p-2 border rounded"
            >
              <option value="gas">Gas</option>
              <option value="öl">Öl</option>
              <option value="wärmepumpe">Wärmepumpe</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">Zustand der Sanitäranlagen</label>
            <select
              name="sanitaryCondition"
              value={formData.sanitaryCondition}
              onChange={handleChange}
              className="mt-1 w-full p-2 border rounded"
            >
              <option value="modern">Modern</option>
              <option value="baujahrestypisch">Baujahrestypisch</option>
              <option value="renovierungsbedürftig">Renovierungsbedürftig</option>
            </select>
          </div>
        </div>

        {/* Modernisierungen und Zustand */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Modernisierungen und Zustand</h3>
          <div>
            <label className="block text-sm font-medium">Jahr der letzten Modernisierung</label>
            <input
              type="number"
              name="lastModernization"
              value={formData.lastModernization}
              onChange={handleChange}
              className="mt-1 w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Details zu Modernisierungen</label>
            <textarea
              name="modernizationDetails"
              value={formData.modernizationDetails}
              onChange={handleChange}
              className="mt-1 w-full p-2 border rounded"
              rows="4"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Reparaturstau oder Baumängel</label>
            <textarea
              name="repairBacklog"
              value={formData.repairBacklog}
              onChange={handleChange}
              className="mt-1 w-full p-2 border rounded"
              rows="4"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Barrierefrei</label>
            <select
              name="accessibility"
              value={formData.accessibility}
              onChange={handleChange}
              className="mt-1 w-full p-2 border rounded"
            >
              <option value="nein">Nein</option>
              <option value="ja">Ja</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">Energieausweis vorhanden</label>
            <select
              name="energyCertificate"
              value={formData.energyCertificate}
              onChange={handleChange}
              className="mt-1 w-full p-2 border rounded"
            >
              <option value="nein">Nein</option>
              <option value="ja">Ja</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">Energieeffizienzklasse (falls vorhanden)</label>
            <input
              type="text"
              name="energyClass"
              value={formData.energyClass}
              onChange={handleChange}
              className="mt-1 w-full p-2 border rounded"
            />
          </div>
        </div>

        {/* Lage und Infrastruktur */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Lage und Infrastruktur</h3>
          <div>
            <label className="block text-sm font-medium">Beschreibung der lokalen Lage</label>
            <textarea
              name="localLocation"
              value={formData.localLocation}
              onChange={handleChange}
              className="mt-1 w-full p-2 border rounded"
              rows="4"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Entfernung zu öffentlichen Verkehrsmitteln (km oder Minuten)</label>
            <input
              type="text"
              name="publicTransportDistance"
              value={formData.publicTransportDistance}
              onChange={handleChange}
              className="mt-1 w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Entfernung zu Schulen, Geschäften, Freizeiteinrichtungen (km)</label>
            <input
              type="text"
              name="amenitiesDistance"
              value={formData.amenitiesDistance}
              onChange={handleChange}
              className="mt-1 w-full p-2 border rounded"
            />
          </div>
        </div>

        {/* Markt- und Ertragsdaten */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Markt- und Ertragsdaten</h3>
          <div>
            <label className="block text-sm font-medium">Marktübliche Miete pro m² (€/m²/Monat, falls bekannt)</label>
            <input
              type="number"
              name="marketRent"
              value={formData.marketRent}
              onChange={handleChange}
              className="mt-1 w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Liegenschaftszinssatz (%, falls bekannt)</label>
            <input
              type="number"
              name="capitalizationRate"
              value={formData.capitalizationRate}
              onChange={handleChange}
              className="mt-1 w-full p-2 border rounded"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700"
        >
          Bewertung anfordern
        </button>
      </form>
      {response && (
        <div className="mt-6 p-4 bg-gray-100 rounded">
          <h3 className="text-lg font-semibold">Bewertung:</h3>
          <p><strong>Preis:</strong> {response.price}</p>
          <p><strong>Lage:</strong> {response.location}</p>
          <p><strong>Zustand:</strong> {response.condition}</p>
        </div>
      )}
      {error && <p className="mt-4 text-red-600">{error}</p>}
    </div>
  );
}
