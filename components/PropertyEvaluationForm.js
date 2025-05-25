// components/PropertyEvaluationForm.js
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaHome, FaLandmark, FaBuilding, FaTools, FaMap, FaChartLine, FaCheckCircle } from 'react-icons/fa';

export default function PropertyEvaluationForm() {
  const [formData, setFormData] = useState(() => {
    const savedData = typeof window !== 'undefined' ? localStorage.getItem('formData') : null;
    return savedData ? JSON.parse(savedData) : {
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
    };
  });
  const [currentStep, setCurrentStep] = useState(0);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem('formData', JSON.stringify(formData));
  }, [formData]);

  const steps = [
    {
      title: 'Allgemeine Informationen',
      icon: <FaHome />,
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
      icon: <FaLandmark />,
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
      icon: <FaBuilding />,
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
      icon: <FaTools />,
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
      icon: <FaMap />,
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
      icon: <FaChartLine />,
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

  const validateStep = () => {
    const errors = {};
    steps[currentStep].fields.forEach((field) => {
      if (field.required && !formData[field.name]) {
        errors[field.name] = 'Dieses Feld ist erforderlich';
      }
    });
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

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
      if (fieldErrors[name]) {
        setFieldErrors((prev) => ({ ...prev, [name]: null }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep()) return;

    setIsLoading(true);
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
        setCurrentStep(steps.length);
        localStorage.removeItem('formData');
      } else {
        setError(data.error || 'Fehler bei der Bewertung');
      }
    } catch (err) {
      setError('Netzwerkfehler. Bitte versuche es erneut.');
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => {
    if (validateStep() && currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderField = (field) => {
    const hasError = fieldErrors[field.name];
    return (
      <div className="relative">
        {field.type === 'text' || field.type === 'number' ? (
          <motion.div
            className="relative"
            whileHover={{ scale: 1.02 }}
            whileFocus={{ scale: 1.02 }}
          >
            <input
              type={field.type}
              name={field.name}
              value={formData[field.name]}
              onChange={handleChange}
              className={`w-full p-4 border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 bg-neutral shadow-input text-gray-800 placeholder-gray-400 text-base sm:text-lg ${
                hasError ? 'border-red-500' : 'border-gray-200'
              }`}
              placeholder={field.label}
              required={field.required}
            />
            {formData[field.name] && !hasError && (
              <FaCheckCircle className="absolute right-4 top-1/2 transform -translate-y-1/2 text-green-500" />
            )}
            {hasError && (
              <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-red-500 text-sm">
                {hasError}
              </span>
            )}
            {field.tooltip && (
              <div className="absolute right-12 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-help">
                <span className="tooltip-text bg-gray-800 text-white text-xs rounded p-2 absolute z-10 hidden group-hover:block -top-10 right-0">
                  {field.tooltip}
                </span>
                ❓
              </div>
            )}
          </motion.div>
        ) : field.type === 'select' ? (
          <motion.select
            name={field.name}
            value={formData[field.name]}
            onChange={handleChange}
            className={`w-full p-4 border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 bg-neutral shadow-input text-gray-800 text-base sm:text-lg ${
              hasError ? 'border-red-500' : 'border-gray-200'
            }`}
            whileHover={{ scale: 1.02 }}
          >
            {field.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </motion.select>
        ) : field.type === 'textarea' ? (
          <motion.textarea
            name={field.name}
            value={formData[field.name]}
            onChange={handleChange}
            className={`w-full p-4 border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 bg-neutral shadow-input text-gray-800 placeholder-gray-400 text-base sm:text-lg ${
              hasError ? 'border-red-500' : 'border-gray-200'
            }`}
            rows="4"
            placeholder={field.label}
            whileHover={{ scale: 1.02 }}
          />
        ) : field.type === 'checkbox' ? (
          <div className="space-y-3">
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
                  className="h-5 w-5 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <span className="ml-3 text-base text-gray-700">{option.label}</span>
              </motion.label>
            ))}
          </div>
        ) : null}
      </div>
    );
  };

  const isStepCompleted = (stepIndex) => {
    return steps[stepIndex].fields.every((field) => !field.required || formData[field.name]);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 font-inter">
      <motion.div
        className="max-w-4xl w-full bg-neutral shadow-card rounded-2xl overflow-hidden"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: 'easeOut' }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-800 to-blue-600 p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FaHome className="text-secondary text-4xl sm:text-5xl" />
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              Stilvoll Immobilien
            </h2>
          </div>
          <div className="text-white text-sm sm:text-base">
            Immobilienbewertung
          </div>
        </div>

        {/* Hauptinhalt */}
        <div className="p-8 sm:p-12">
          {/* Fortschrittsanzeige */}
          <div className="mb-12">
            <div className="flex justify-between mb-4">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className={`flex-1 text-center text-sm font-medium flex flex-col items-center relative ${
                    index <= currentStep ? 'text-primary' : 'text-gray-400'
                  }`}
                >
                  <motion.div
                    className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 border-2 ${
                      index <= currentStep
                        ? 'bg-primary text-white border-primary'
                        : 'bg-neutral text-gray-600 border-gray-200'
                    }`}
                    animate={{
                      scale: index === currentStep ? 1.2 : 1,
                      rotate: index <= currentStep ? 360 : 0,
                    }}
                    transition={{ duration: 0.8, ease: 'easeInOut' }}
                  >
                    {isStepCompleted(index) && index < currentStep ? (
                      <FaCheckCircle className="text-green-500" />
                    ) : (
                      step.icon
                    )}
                  </motion.div>
                  <span className="text-xs sm:text-sm">{step.title}</span>
                </div>
              ))}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <motion.div
                className="bg-gradient-to-r from-blue-800 to-blue-600 h-3 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                transition={{ duration: 0.8, ease: 'easeInOut' }}
              />
            </div>
            <div className="text-center mt-2 text-sm text-gray-600">
              Fortschritt: {Math.round(((currentStep + 1) / steps.length) * 100)}%
            </div>
          </div>

          <AnimatePresence mode="wait">
            {currentStep < steps.length ? (
              <motion.form
                key={currentStep}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.8, ease: 'easeInOut' }}
                onSubmit={currentStep === steps.length - 1 ? handleSubmit : (e) => e.preventDefault()}
                className="space-y-10"
              >
                <h3 className="text-2xl sm:text-3xl font-semibold text-blue-800 flex items-center gap-3">
                  {steps[currentStep].icon} {steps[currentStep].title}
                </h3>
                <div className="space-y-8">
                  {steps[currentStep].fields.map((field) => (
                    <motion.div
                      key={field.name}
                      className="bg-neutral p-6 rounded-xl shadow-card border border-gray-100 group"
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    >
                      <label className="block text-sm sm:text-base font-medium text-gray-700 mb-3">
                        {field.label}
                        {field.required && <span className="text-red-500">*</span>}
                      </label>
                      {renderField(field)}
                    </motion.div>
                  ))}
                </div>
                <div className="flex justify-between mt-12">
                  {currentStep > 0 && (
                    <motion.button
                      type="button"
                      onClick={prevStep}
                      className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all duration-300 shadow-sm text-sm sm:text-base"
                      whileHover={{ scale: 1.05, backgroundColor: '#D1D5DB' }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Zurück
                    </motion.button>
                  )}
                  <motion.button
                    type={currentStep === steps.length - 1 ? 'submit' : 'button'}
                    onClick={currentStep < steps.length - 1 ? nextStep : undefined}
                    className="px-6 py-3 bg-blue-800 text-white rounded-xl hover:bg-blue-900 transition-all duration-300 shadow-sm text-sm sm:text-base flex items-center justify-center"
                    whileHover={{ scale: 1.05, backgroundColor: '#1E3A8A' }}
                    whileTap={{ scale: 0.95 }}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                    ) : null}
                    {currentStep === steps.length - 1 ? 'Bewertung anfordern' : 'Weiter'}
                  </motion.button>
                </div>
              </motion.form>
            ) : (
              response && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className="text-center"
                >
                  <h3 className="text-2xl sm:text-3xl font-semibold text-blue-800 mb-6 flex items-center justify-center gap-3">
                    <FaChartLine className="text-secondary" /> Ihre Bewertung
                  </h3>
                  <div className="bg-accent p-8 rounded-xl space-y-6 shadow-card">
                    <p className="text-lg sm:text-xl">
                      <strong className="text-blue-800">Geschätzter Verkehrswert:</strong>{' '}
                      <span className="text-secondary font-bold">{response.price}</span>
                    </p>
                    <p className="text-lg sm:text-xl">
                      <strong className="text-blue-800">Lagebewertung:</strong> {response.location}
                    </p>
                    <p className="text-lg sm:text-xl">
                      <strong className="text-blue-800">Zustand:</strong> {response.condition}
                    </p>
                  </div>
                  <motion.button
                    onClick={() => setCurrentStep(0)}
                    className="mt-8 px-6 py-3 bg-blue-800 text-white rounded-xl hover:bg-blue-900 transition-all duration-300 shadow-sm text-sm sm:text-base"
                    whileHover={{ scale: 1.05, backgroundColor: '#1E3A8A' }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Neue Bewertung starten
                  </motion.button>
                </motion.div>
              )
            )}
          </AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-6 text-red-600 text-center text-sm sm:text-base"
            >
              {error}
              <button
                onClick={() => setCurrentStep(0)}
                className="ml-2 text-blue-800 underline hover:text-blue-900"
              >
                Zurück zum Anfang
              </button>
            </motion.p>
          )}
        </div>
      </motion.div>
    </div>
  );
}
