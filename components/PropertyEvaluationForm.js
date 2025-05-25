// components/PropertyEvaluationForm.js
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaHome, FaLandmark, FaBuilding, FaTools, FaMap, FaChartLine, FaCheckCircle, FaMapMarkerAlt } from 'react-icons/fa';

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
        { name: 'address', label: 'Adresse (Straße, Hausnummer)', type: 'text', required: true, section: 'Adresse' },
        { name: 'city', label: 'Stadt', type: 'text', required: true, section: 'Adresse' },
        { name: 'zipCode', label: 'Postleitzahl', type: 'text', required: true, section: 'Adresse' },
        {
          name: 'propertyType',
          label: 'Immobilientyp',
          type: 'select',
          options: [
            { value: 'einfamilienhaus', label: 'Einfamilienhaus' },
            { value: 'wohnung', label: 'Wohnung' },
            { value: 'gewerbe', label: 'Gewerbe' },
          ],
          section: 'Immobilientyp',
        },
        { name: 'constructionYear', label: 'Baujahr', type: 'number', required: true, section: 'Immobilientyp' },
        {
          name: 'evaluationPurpose',
          label: 'Anlass der Bewertung',
          type: 'select',
          options: [
            { value: 'verkauf', label: 'Verkauf' },
            { value: 'finanzierung', label: 'Finanzierung' },
            { value: 'sonstiges', label: 'Sonstiges' },
          ],
          section: 'Immobilientyp',
        },
      ],
    },
    {
      title: 'Grundstück',
      icon: <FaLandmark />,
      fields: [
        { name: 'plotSize', label: 'Grundstücksgröße (m²)', type: 'number', required: true, section: 'Grundstücksdetails' },
        {
          name: 'soilValue',
          label: 'Bodenrichtwert (€/m², falls bekannt)',
          type: 'number',
          tooltip: 'Den Bodenrichtwert finden Sie bei Ihrem Gutachterausschuss oder auf boris.nrw.de',
          section: 'Grundstücksdetails',
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
          section: 'Grundstücksdetails',
        },
        {
          name: 'soilCondition',
          label: 'Baugrundbeschaffenheit',
          type: 'select',
          options: [
            { value: 'normal', label: 'Normal tragfähig' },
            { value: 'problematisch', label: 'Problematisch' },
          ],
          section: 'Grundstücksdetails',
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
          section: 'Bebauungsdetails',
        },
        {
          name: 'encumbrances',
          label: 'Grundbuchliche Belastungen (z. B. Wegerecht)',
          type: 'select',
          options: [
            { value: 'nein', label: 'Nein' },
            { value: 'ja', label: 'Ja' },
          ],
          section: 'Bebauungsdetails',
        },
        {
          name: 'floodRisk',
          label: 'Liegt die Immobilie in einem Überschwemmungsgebiet?',
          type: 'select',
          options: [
            { value: 'nein', label: 'Nein' },
            { value: 'ja', label: 'Ja' },
          ],
          section: 'Bebauungsdetails',
        },
      ],
    },
    {
      title: 'Gebäude und bauliche Anlagen',
      icon: <FaBuilding />,
      fields: [
        { name: 'livingArea', label: 'Wohnfläche (m²)', type: 'number', required: true, section: 'Gebäudedetails' },
        { name: 'rooms', label: 'Anzahl der Zimmer', type: 'number', required: true, section: 'Gebäudedetails' },
        { name: 'floors', label: 'Anzahl der Vollgeschosse', type: 'number', required: true, section: 'Gebäudedetails' },
        {
          name: 'basement',
          label: 'Unterkellert',
          type: 'select',
          options: [
            { value: 'ja', label: 'Ja' },
            { value: 'nein', label: 'Nein' },
          ],
          section: 'Gebäudedetails',
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
          section: 'Gebäudedetails',
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
          section: 'Zusätzliche Anlagen',
        },
        { name: 'garageArea', label: 'Garagefläche (m²)', type: 'number', section: 'Zusätzliche Anlagen' },
        {
          name: 'outdoorFacilities',
          label: 'Außenanlagen',
          type: 'checkbox',
          options: [
            { value: 'terrasse', label: 'Terrasse' },
            { value: 'balkon', label: 'Balkon' },
            { value: 'garten', label: 'Garten' },
          ],
          section: 'Zusätzliche Anlagen',
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
          section: 'Ausstattung',
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
          section: 'Ausstattung',
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
          section: 'Ausstattung',
        },
      ],
    },
    {
      title: 'Modernisierungen und Zustand',
      icon: <FaTools />,
      fields: [
        { name: 'lastModernization', label: 'Jahr der letzten Modernisierung', type: 'number', section: 'Modernisierungen' },
        { name: 'modernizationDetails', label: 'Details zu Modernisierungen', type: 'textarea', section: 'Modernisierungen' },
        { name: 'repairBacklog', label: 'Reparaturstau oder Baumängel', type: 'textarea', section: 'Zustand' },
        {
          name: 'accessibility',
          label: 'Barrierefrei',
          type: 'select',
          options: [
            { value: 'nein', label: 'Nein' },
            { value: 'ja', label: 'Ja' },
          ],
          section: 'Zustand',
        },
        {
          name: 'energyCertificate',
          label: 'Energieausweis vorhanden',
          type: 'select',
          options: [
            { value: 'nein', label: 'Nein' },
            { value: 'ja', label: 'Ja' },
          ],
          section: 'Energie',
        },
        { name: 'energyClass', label: 'Energieeffizienzklasse (falls vorhanden)', type: 'text', section: 'Energie' },
      ],
    },
    {
      title: 'Lage und Infrastruktur',
      icon: <FaMap />,
      fields: [
        { name: 'localLocation', label: 'Beschreibung der lokalen Lage', type: 'textarea', section: 'Lage' },
        {
          name: 'publicTransportDistance',
          label: 'Entfernung zu öffentlichen Verkehrsmitteln (km oder Minuten)',
          type: 'text',
          section: 'Infrastruktur',
        },
        {
          name: 'amenitiesDistance',
          label: 'Entfernung zu Schulen, Geschäften, Freizeiteinrichtungen (km)',
          type: 'text',
          section: 'Infrastruktur',
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
          section: 'Marktdaten',
        },
        { name: 'capitalizationRate', label: 'Liegenschaftszinssatz (%, falls bekannt)', type: 'number', section: 'Marktdaten' },
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

  const handleStepClick = (index) => {
    if (index <= currentStep || isStepCompleted(currentStep)) {
      setCurrentStep(index);
    }
  };

  const isStepCompleted = (stepIndex) => {
    return steps[stepIndex].fields.every((field) => !field.required || formData[field.name]);
  };

  const renderField = (field) => {
    const hasError = fieldErrors[field.name];
    return (
      <div className="relative w-full">
        {field.type === 'text' || field.type === 'number' ? (
          <motion.div
            className="relative"
            whileHover={{ scale: 1.02 }}
            whileFocus={{ scale: 1.02 }}
          >
            <div className="relative">
              <input
                type={field.type}
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                className={`w-full max-w-lg p-4 pl-12 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:ring-opacity-50 focus:border-transparent transition-all duration-300 bg-white text-gray-800 placeholder-gray-400 text-base shadow-sm ${
                  hasError ? 'border-red-500' : 'border-gray-200'
                }`}
                placeholder={field.label}
                required={field.required}
              />
              <FaMapMarkerAlt className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            {formData[field.name] && !hasError && (
              <FaCheckCircle className="absolute right-4 top-1/2 transform -translate-y-1/2 text-primary" />
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
            className={`w-full max-w-lg p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:ring-opacity-50 focus:border-transparent transition-all duration-300 bg-white text-gray-800 text-base shadow-sm ${
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
            className={`w-full max-w-lg p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:ring-opacity-50 focus:border-transparent transition-all duration-300 bg-white text-gray-800 placeholder-gray-400 text-base shadow-sm ${
              hasError ? 'border-red-500' : 'border-gray-200'
            }`}
            rows="4"
            placeholder={field.label}
            whileHover={{ scale: 1.02 }}
          />
        ) : field.type === 'checkbox' ? (
          <div className="space-y-2.5">
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
                  className="h-5 w-5 text-primary focus:ring-primary border-gray-200 rounded"
                />
                <span className="ml-2 text-base text-gray-700">{option.label}</span>
              </motion.label>
            ))}
          </div>
        ) : null}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-between py-8 px-4 sm:px-6 lg:px-8 font-roboto">
      <div className="max-w-5xl w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 px-4">
          <div className="flex items-center">
            <h2 className="text-xl font-bold text-primary">Stilvoll Immobilien</h2>
          </div>
          <div className="text-sm text-gray-600">Die Nr. 1 für Immobilien.</div>
        </div>

        {/* Fortschrittsanzeige */}
        <div className="flex justify-end mb-8 px-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-600">Bewertung</span>
            <div className="w-32 bg-gray-200 rounded-full h-2">
              <motion.div
                className="bg-primary h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                transition={{ duration: 0.8, ease: 'easeInOut' }}
              />
            </div>
            <span className="text-sm font-medium text-gray-600">
              {Math.round(((currentStep + 1) / steps.length) * 100)}%
            </span>
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
              className="space-y-10 flex flex-col items-center"
            >
              <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                {steps[currentStep].title}
              </h3>
              <div className="space-y-8 w-full max-w-2xl">
                {[...new Set(steps[currentStep].fields.map((field) => field.section))].map((section) => (
                  <div key={section} className="space-y-5">
                    <h4 className="text-lg font-semibold text-gray-700 text-center">{section}</h4>
                    <div className="flex flex-col items-center gap-6">
                      {steps[currentStep].fields
                        .filter((field) => field.section === section)
                        .map((field) => (
                          <div key={field.name} className="w-full flex justify-center">
                            {renderField(field)}
                          </div>
                        ))}
                    </div>
                    <hr className="border-t border-gray-200" />
                  </div>
                ))}
              </div>
              <div className="flex justify-center mt-12 gap-4">
                {currentStep > 0 && (
                  <motion.button
                    type="button"
                    onClick={prevStep}
                    className="px-8 py-4 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all duration-300 shadow-sm text-base font-medium"
                    whileHover={{ scale: 1.05, backgroundColor: '#D1D5DB' }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Zurück
                  </motion.button>
                )}
                <motion.button
                  type={currentStep === steps.length - 1 ? 'submit' : 'button'}
                  onClick={currentStep < steps.length - 1 ? nextStep : undefined}
                  className="px-8 py-4 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all duration-300 shadow-sm text-base font-medium flex items-center justify-center"
                  whileHover={{ scale: 1.05, backgroundColor: '#D1D5DB' }}
                  whileTap={{ scale: 0.95 }}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <svg className="animate-spin h-5 w-5 mr-2 text-gray-700" viewBox="0 0 24 24">
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
                <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center justify-center gap-2">
                  <FaChartLine className="text-secondary" /> Ihre Bewertung
                </h3>
                <div className="bg-neutral p-8 rounded-xl space-y-6 shadow-card">
                  <p className="text-base">
                    <strong className="text-primary">Geschätzter Verkehrswert:</strong>{' '}
                    <span className="text-secondary font-bold">{response.price}</span>
                  </p>
                  <p className="text-base">
                    <strong className="text-primary">Lagebewertung:</strong> {response.location}
                  </p>
                  <p className="text-base">
                    <strong className="text-primary">Zustand:</strong> {response.condition}
                  </p>
                </div>
                <motion.button
                  onClick={() => setCurrentStep(0)}
                  className="mt-8 px-8 py-4 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all duration-300 shadow-sm text-base font-medium"
                  whileHover={{ scale: 1.05, backgroundColor: '#D1D5DB' }}
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
            className="mt-6 text-red-600 text-center text-sm"
          >
            {error}
            <button
              onClick={() => setCurrentStep(0)}
              className="ml-2 text-primary underline hover:text-blue-900"
            >
              Zurück zum Anfang
            </button>
          </motion.p>
        )}
      </div>

      {/* Footer */}
      <footer className="mt-12 text-center text-xs text-gray-600">
        Wir finanzieren diesen Service über die Provision unserer Immobilienprofis
      </footer>
    </div>
  );
}
