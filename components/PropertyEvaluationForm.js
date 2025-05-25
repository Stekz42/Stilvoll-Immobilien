// components/PropertyEvaluationForm.js
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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
  const [currentStep, setCurrentStep] = useState(0);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const steps = [
    {
      title: 'Allgemeine Informationen',
      fields: [
        { name: 'address', label: 'Adresse (Straße, Hausnummer)', type: 'text', required: true },
        { name: 'city', label: 'Stadt', type: 'text', required: true },
        { name: 'zipCode', label: 'Postleitzahl', type: 'text', required: true },
        {
          name: 'propertyType',
          label: 'Immobilientyp',
          type: 'select',
          options: [
            { value: 'einfamilienhaus', label: 'Einfamilienhaus' },
            { value: 'wohnung', label: 'Wohnung' },
            { value: 'gewerbe', label: 'Gewerbe' },
          ],
        },
        { name: 'constructionYear', label: 'Baujahr', type: 'number', required: true },
        {
          name: 'evaluationPurpose',
          label: 'Anlass der Bewertung',
          type: 'select',
          options: [
            { value: 'verkauf', label: 'Verkauf' },
            { value: 'finanzierung', label: 'Finanzierung' },
            { value: 'sonstiges', label: 'Sonstiges' },
          ],
        },
      ],
    },
    {
      title: 'Grundstück',
      fields: [
        { name: 'plotSize', label: 'Grundstücksgröße (m²)', type: 'number', required: true },
        {
          name: 'soilValue',
          label: 'Bodenrichtwert (€/m², falls bekannt)',
          type: 'number',
          tooltip: 'Den Bodenrichtwert finden Sie bei Ihrem Gutachterausschuss oder auf boris.nrw.de',
        },
        {
          name: 'developmentStatus',
          label: 'Erschließungszustand',
          type: 'select',
          options: [
            { value: 'vollständig', label: 'Vollständig erschlossen' },
            { value: 'teilweise', label: 'Teilweise erschlossen' },
            { value: 'nicht', label: 'Nicht erschlossen' },
          ],
        },
        {
          name: 'soilCondition',
          label: 'Baugrundbeschaffenheit',
          type: 'select',
          options: [
            { value: 'normal', label: 'Normal tragfähig' },
            { value: 'problematisch', label: 'Problematisch' },
          ],
        },
        {
          name: 'zoningPlan',
          label: 'Bebauungsplan',
          type: 'select',
          options: [
            { value: 'wohngebiet', label: 'Wohngebiet' },
            { value: 'mischgebiet', label: 'Mischgebiet' },
            { value: 'gewerbegebiet', label: 'Gewerbegebiet' },
          ],
        },
        {
          name: 'encumbrances',
          label: 'Grundbuchliche Belastungen (z. B. Wegerecht)',
          type: 'select',
          options: [
            { value: 'nein', label: 'Nein' },
            { value: 'ja', label: 'Ja' },
          ],
        },
        {
          name: 'floodRisk',
          label: 'Liegt die Immobilie in einem Überschwemmungsgebiet?',
          type: 'select',
          options: [
            { value: 'nein', label: 'Nein' },
            { value: 'ja', label: 'Ja' },
          ],
        },
      ],
    },
    {
      title: 'Gebäude und bauliche Anlagen',
      fields: [
        { name: 'livingArea', label: 'Wohnfläche (m²)', type: 'number', required: true },
        { name: 'rooms', label: 'Anzahl der Zimmer', type: 'number', required: true },
        { name: 'floors', label: 'Anzahl der Vollgeschosse', type: 'number', required: true },
        {
          name: 'basement',
          label: 'Unterkellert',
          type: 'select',
          options: [
            { value: 'ja', label: 'Ja' },
            { value: 'nein', label: 'Nein' },
          ],
        },
        {
          name: 'roofing',
          label: 'Bedachung',
          type: 'select',
          options: [
            { value: 'satteldach', label: 'Satteldach' },
            { value: 'flachdach', label: 'Flachdach' },
            { value: 'walmdach', label: 'Walmdach' },
          ],
        },
        {
          name: 'garage',
          label: 'Garage',
          type: 'select',
          options: [
            { value: 'nein', label: 'Nein' },
            { value: 'einzel', label: 'Einzelgarage' },
            { value: 'mehrfach', label: 'Mehrfachgarage' },
          ],
        },
        { name: 'garageArea', label: 'Garagefläche (m²)', type: 'number' },
        {
          name: 'outdoorFacilities',
          label: 'Außenanlagen',
          type: 'checkbox',
          options: [
            { value: 'terrasse', label: 'Terrasse' },
            { value: 'balkon', label: 'Balkon' },
            { value: 'garten', label: 'Garten' },
          ],
        },
        {
          name: 'equipmentLevel',
          label: 'Ausstattungsgrad',
          type: 'select',
          options: [
            { value: 'einfach', label: 'Einfach' },
            { value: 'mittel', label: 'Mittel' },
            { value: 'gehoben', label: 'Gehoben' },
          ],
        },
        {
          name: 'heatingSystem',
          label: 'Heizungssystem',
          type: 'select',
          options: [
            { value: 'gas', label: 'Gas' },
            { value: 'öl', label: 'Öl' },
            { value: 'wärmepumpe', label: 'Wärmepumpe' },
          ],
        },
        {
          name: 'sanitaryCondition',
          label: 'Zustand der Sanitäranlagen',
          type: 'select',
          options: [
            { value: 'modern', label: 'Modern' },
            { value: 'baujahrestypisch', label: 'Baujahrestypisch' },
            { value: 'renovierungsbedürftig', label: 'Renovierungsbedürftig' },
          ],
        },
      ],
    },
    {
      title: 'Modernisierungen und Zustand',
      fields: [
        { name: 'lastModernization', label: 'Jahr der letzten Modernisierung', type: 'number' },
        { name: 'modernizationDetails', label: 'Details zu Modernisierungen', type: 'textarea' },
        { name: 'repairBacklog', label: 'Reparaturstau oder Baumängel', type: 'textarea' },
        {
          name: 'accessibility',
          label: 'Barrierefrei',
          type: 'select',
          options: [
            { value: 'nein', label: 'Nein' },
            { value: 'ja', label: 'Ja' },
          ],
        },
        {
          name: 'energyCertificate',
          label: 'Energieausweis vorhanden',
          type: 'select',
          options: [
            { value: 'nein', label: 'Nein' },
            { value: 'ja', label: 'Ja' },
          ],
        },
        { name: 'energyClass', label: 'Energieeffizienzklasse (falls vorhanden)', type: 'text' },
      ],
    },
    {
      title: 'Lage und Infrastruktur',
      fields: [
        { name: 'localLocation', label: 'Beschreibung der lokalen Lage', type: 'textarea' },
        {
          name: 'publicTransportDistance',
          label: 'Entfernung zu öffentlichen Verkehrsmitteln (km oder Minuten)',
          type: 'text',
        },
        {
          name: 'amenitiesDistance',
          label: 'Entfernung zu Schulen, Geschäften, Freizeiteinrichtungen (km)',
          type: 'text',
        },
      ],
    },
    {
      title: 'Markt- und Ertragsdaten',
      fields: [
        {
          name: 'marketRent',
          label: 'Marktübliche Miete pro m² (€/m²/Monat, falls bekannt)',
          type: 'number',
        },
        { name: 'capitalizationRate', label: 'Liegenschaftszinssatz (%, falls bekannt)', type: 'number' },
      ],
    },
  ];

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
        setCurrentStep(steps.length); // Zeige Ergebnis
      } else {
        setError(data.error || 'Fehler bei der Bewertung');
      }
    } catch (err) {
      setError('Netzwerkfehler. Bitte versuche es erneut.');
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const renderField = (field) => {
    switch (field.type) {
      case 'text':
      case 'number':
        return (
          <motion.div
            className="relative"
            whileHover={{ scale: 1.01 }}
            whileFocus={{ scale: 1.01 }}
          >
            <input
              type={field.type}
              name={field.name}
              value={formData[field.name]}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 shadow-sm"
              placeholder={field.label}
              required={field.required}
            />
            {field.tooltip && (
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-help">
                <span className="tooltip-text bg-gray-800 text-white text-xs rounded p-2 absolute z-10 hidden group-hover:block -top-10 right-0">
                  {field.tooltip}
                </span>
                ❓
              </div>
            )}
          </motion.div>
        );
      case 'select':
        return (
          <motion.select
            name={field.name}
            value={formData[field.name]}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 shadow-sm"
            whileHover={{ scale: 1.01 }}
          >
            {field.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </motion.select>
        );
      case 'textarea':
        return (
          <motion.textarea
            name={field.name}
            value={formData[field.name]}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 shadow-sm"
            rows="4"
            placeholder={field.label}
            whileHover={{ scale: 1.01 }}
          />
        );
      case 'checkbox':
        return (
          <div className="space-y-2">
            {field.options.map((option) => (
              <motion.label
                key={option.value}
                className="flex items-center cursor-pointer"
                whileHover={{ scale: 1.02 }}
              >
                <input
                  type="checkbox"
                  name={field.name}
                  value={option.value}
                  checked={formData[field.name].includes(option.value)}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">{option.label}</span>
              </motion.label>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-neutral flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 font-inter">
      <motion.div
        className="max-w-4xl w-full bg-white shadow-2xl rounded-2xl p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold text-primary mb-6 text-center">
          Immobilienbewertung - Stilvoll Immobilien
        </h2>

        {/* Fortschrittsanzeige */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`flex-1 text-center text-sm font-medium ${
                  index <= currentStep ? 'text-primary' : 'text-gray-400'
                }`}
              >
                <motion.div
                  className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center ${
                    index <= currentStep ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'
                  }`}
                  animate={{ scale: index === currentStep ? 1.2 : 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {index + 1}
                </motion.div>
                {step.title}
              </div>
            ))}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-primary h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          {currentStep < steps.length ? (
            <motion.form
              key={currentStep}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              onSubmit={currentStep === steps.length - 1 ? handleSubmit : (e) => e.preventDefault()}
              className="space-y-6"
            >
              <h3 className="text-xl font-semibold text-primary">{steps[currentStep].title}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {steps[currentStep].fields.map((field) => (
                  <div key={field.name} className="group">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {field.label}
                      {field.required && <span className="text-red-500">*</span>}
                    </label>
                    {renderField(field)}
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-8">
                {currentStep > 0 && (
                  <motion.button
                    type="button"
                    onClick={prevStep}
                    className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-all duration-300 shadow-sm"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Zurück
                  </motion.button>
                )}
                <motion.button
                  type={currentStep === steps.length - 1 ? 'submit' : 'button'}
                  onClick={currentStep < steps.length - 1 ? nextStep : undefined}
                  className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-800 transition-all duration-300 shadow-sm"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {currentStep === steps.length - 1 ? 'Bewertung anfordern' : 'Weiter'}
                </motion.button>
              </div>
            </motion.form>
          ) : (
            response && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center"
              >
                <h3 className="text-2xl font-semibold text-primary mb-4">Ihre Bewertung</h3>
                <div className="bg-neutral p-6 rounded-lg space-y-4 shadow-sm">
                  <p className="text-lg">
                    <strong>Preis:</strong> {response.price}
                  </p>
                  <p className="text-lg">
                    <strong>Lage:</strong> {response.location}
                  </p>
                  <p className="text-lg">
                    <strong>Zustand:</strong> {response.condition}
                  </p>
                </div>
                <motion.button
                  onClick={() => setCurrentStep(0)}
                  className="mt-6 px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-800 transition-all duration-300 shadow-sm"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Neue Bewertung
                </motion.button>
              </motion.div>
            )
          )}
        </AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 text-red-600 text-center"
          >
            {error}
          </motion.p>
        )}
      </motion.div>
    </div>
  );
}
