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
        { name: 'constructionYear', label: 'Baujahr', type: 'number', required: true, section: 'Immobilientyp', tooltip: 'Geben Sie das Jahr der Fertigstellung des Gebäudes ein.' },
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
          tooltip: 'Grundbuchliche Belastungen sind Rechte Dritter, wie z. B. ein Wegerecht oder eine Hypothek, die im Grundbuch eingetragen sind.',
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
          tooltip: 'Informationen zu Überschwemmungsgebieten finden Sie bei Ihrer Gemeinde oder auf Karten von Umweltbehörden.',
          section: 'Bebauungsdetails',
        },
      ],
    },
    {
      title: 'Gebäude und bauliche Anlagen',
      icon: <FaBuilding />,
      fields: [
        { name: 'livingArea', label: 'Wohnfläche (m²)', type: 'number', required: true, section: 'Gebäudedetails', tooltip: 'Geben Sie die tatsächliche Wohnfläche ohne Nebenflächen (z. B. Keller) ein.' },
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
          tooltip: 'Informationen zur marktüblichen Miete finden Sie in Mietspiegeln oder bei Immobilienportalen.',
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

  const downloadFormDataAsText = () => {
    // Formulardaten formatieren
    let textContent = '=== Immobilienbewertung ===\n\n';
    textContent += 'Eingegebene Daten:\n';
    for (const [key, value] of Object.entries(formData)) {
      textContent += `${key}: ${Array.isArray(value) ? value.join(', ') : value}\n`;
    }

    // Auswertung hinzufügen, falls vorhanden
    if (response) {
      textContent += '\nAuswertung:\n';
      textContent += `Geschätzter Verkehrswert: ${response.price}\n`;
      textContent += `Lagebewertung: ${response.location}\n`;
      textContent += `Zustand: ${response.condition}\n`;
      textContent += '\nPreissteigernde Faktoren:\n';
      response.priceIncreaseFactors.forEach((factor, index) => {
        textContent += `${index + 1}. ${factor}\n`;
      });
      textContent += '\nPreissenkende Faktoren:\n';
      response.priceDecreaseFactors.forEach((factor, index) => {
        textContent += `${index + 1}. ${factor}\n`;
      });
    }

    // Textdokument erstellen und herunterladen
    const blob = new Blob([textContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'immobilienbewertung.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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
        setResponse(data);
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
      <div className="position-relative w-100">
        {field.type === 'text' || field.type === 'number' ? (
          <motion.div
            className="position-relative"
            whileHover={{ scale: 1.02 }}
            whileFocus={{ scale: 1.02 }}
          >
            <div className="position-relative">
              <input
                type={field.type}
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                className={`form-control ${hasError ? 'is-invalid' : ''}`}
                style={{ paddingLeft: '40px', fontSize: '16px', borderRadius: '8px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}
                placeholder={field.label}
                required={field.required}
              />
              <FaMapMarkerAlt className="position-absolute" style={{ left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#6c757d' }} />
            </div>
            {formData[field.name] && !hasError && (
              <FaCheckCircle className="position-absolute text-success" style={{ right: '10px', top: '50%', transform: 'translateY(-50%)' }} />
            )}
            {hasError && (
              <div className="invalid-feedback" style={{ display: 'block', fontSize: '14px' }}>
                {hasError}
              </div>
            )}
            {field.tooltip && (
              <div className="position-absolute" style={{ right: '40px', top: '50%', transform: 'translateY(-50%)', color: '#6c757d', cursor: 'help' }}>
                <span className="bg-dark text-white p-2 rounded position-absolute" style={{ display: 'none', top: '-40px', right: '0', fontSize: '12px' }}>
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
            className={`form-select ${hasError ? 'is-invalid' : ''}`}
            style={{ fontSize: '16px', borderRadius: '8px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}
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
            className={`form-control ${hasError ? 'is-invalid' : ''}`}
            style={{ fontSize: '16px', borderRadius: '8px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}
            rows="4"
            placeholder={field.label}
            whileHover={{ scale: 1.02 }}
          />
        ) : field.type === 'checkbox' ? (
          <div className="d-flex flex-column gap-2">
            {field.options.map((option) => (
              <motion.label
                key={option.value}
                className="form-check-label d-flex align-items-center"
                style={{ cursor: 'pointer' }}
                whileHover={{ scale: 1.02 }}
              >
                <input
                  type="checkbox"
                  name={field.name}
                  value={option.value}
                  checked={formData[field.name].includes(option.value)}
                  onChange={handleChange}
                  className="form-check-input me-2"
                  style={{ width: '20px', height: '20px' }}
                />
                <span style={{ fontSize: '16px', color: '#333' }}>{option.label}</span>
              </motion.label>
            ))}
          </div>
        ) : null}
      </div>
    );
  };

  return (
    <div
      className="min-vh-100 d-flex flex-column align-items-center justify-content-between py-4 px-3"
      style={{
        fontFamily: "'Roboto', sans-serif",
        backgroundColor: '#FFFFFF',
        backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\"http://www.w3.org/2000/svg\" width=\"40\" height=\"40\" viewBox=\"0 0 40 40\"%3E%3Cg fill=\"%23E5E7EB\" fill-opacity=\"0.3\"%3E%3Cpath d=\"M0 0h40v40H0z\"/%3E%3Cpath d=\"M20 20a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v4zm8 0a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v4zm-16 8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v4zm16 0a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v4z\"/%3E%3C/g%3E%3C/svg%3E")',
        backgroundSize: '40px 40px',
        backgroundOpacity: '0.8',
      }}
    >
      <div className="w-100" style={{ maxWidth: '800px' }}>
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4 px-3">
          <div className="d-flex align-items-center gap-2">
            <img src="/logo.png" alt="Stilvoll Immobilien Logo" style={{ height: '40px' }} />
            <h2 className="fs-4 fw-bold m-0" style={{ color: '#60C8E8' }}>
              Stilvoll Immobilien
            </h2>
          </div>
          <div className="text-muted" style={{ fontSize: '14px' }}>
            Die Nr. 1 für Immobilien.
          </div>
        </div>

        {/* Fortschrittsanzeige */}
        <div className="d-flex justify-content-end mb-4 px-3">
          <div className="d-flex align-items-center gap-2">
            <span className="text-muted fw-medium" style={{ fontSize: '14px' }}>
              Bewertung
            </span>
            <div className="progress" style={{ width: '120px', height: '8px', borderRadius: '4px', backgroundColor: '#E5E7EB' }}>
              <motion.div
                className="progress-bar"
                role="progressbar"
                initial={{ width: 0 }}
                animate={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
                transition={{ duration: 0.8, ease: 'easeInOut' }}
                style={{ backgroundColor: '#60C8E8' }}
              />
            </div>
            <span className="text-muted fw-medium" style={{ fontSize: '14px' }}>
              {Math.round((currentStep / (steps.length - 1)) * 100)}%
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
              className="d-flex flex-column align-items-center gap-4"
            >
              <h3 className="fs-3 fw-bold text-dark">{steps[currentStep].title}</h3>
              <div className="w-100" style={{ maxWidth: '500px' }}>
                {[...new Set(steps[currentStep].fields.map((field) => field.section))].map((section) => (
                  <div key={section} className="mb-4">
                    <h4 className="fs-5 fw-semibold text-dark text-center mb-3">{section}</h4>
                    <div className="d-flex flex-column align-items-center gap-3">
                      {steps[currentStep].fields
                        .filter((field) => field.section === section)
                        .map((field) => (
                          <div key={field.name} className="w-100">
                            {renderField(field)}
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="d-flex justify-content-center gap-3 mt-4">
                {currentStep > 0 && (
                  <motion.button
                    type="button"
                    onClick={prevStep}
                    className="btn btn-outline-secondary"
                    style={{ padding: '12px 30px', fontSize: '16px', borderRadius: '8px' }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Zurück
                  </motion.button>
                )}
                <motion.button
                  type={currentStep === steps.length - 1 ? 'submit' : 'button'}
                  onClick={currentStep < steps.length - 1 ? nextStep : undefined}
                  className="btn btn-outline-secondary d-flex align-items-center justify-content-center"
                  style={{ padding: '12px 30px', fontSize: '16px', borderRadius: '8px' }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <svg className="spinner-border spinner-border-sm me-2" role="status" style={{ width: '20px', height: '20px' }}>
                      <span className="visually-hidden">Loading...</span>
                    </svg>
                  ) : null}
                  {currentStep === steps.length - 1 ? 'Bewertung anfordern' : 'Weiter'}
                </motion.button>
              </div>
              {/* Terminanfrage-Button */}
              <div className="mt-4">
                <a
                  href="https://wa.me/message/ZAG46FMPWMZ5G1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline-primary"
                  style={{ padding: '12px 30px', fontSize: '16px', borderRadius: '8px', color: '#60C8E8', borderColor: '#60C8E8' }}
                >
                  Terminanfrage stellen
                </a>
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
                <h3 className="fs-3 fw-bold text-dark mb-4">Ihre Bewertung</h3>
                <div className="card p-4 mb-4" style={{ backgroundColor: '#FFFFFF', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                  <p className="fs-5">
                    <strong style={{ color: '#60C8E8' }}>Geschätzter Verkehrswert:</strong>{' '}
                    <span style={{ color: '#FBBF24', fontWeight: 'bold' }}>{response.price}</span>
                  </p>
                  <p className="fs-5">
                    <strong style={{ color: '#60C8E8' }}>Lagebewertung:</strong> {response.location}
                  </p>
                  <p className="fs-5">
                    <strong style={{ color: '#60C8E8' }}>Zustand:</strong> {response.condition}
                  </p>
                  <div className="mt-4 text-start">
                    <h5 className="fs-5 fw-semibold text-dark">Preissteigernde Faktoren:</h5>
                    <ul className="list-group list-group-flush">
                      {response.priceIncreaseFactors.map((factor, index) => (
                        <li key={index} className="list-group-item">{factor}</li>
                      ))}
                    </ul>
                    <h5 className="fs-5 fw-semibold text-dark mt-3">Preissenkende Faktoren:</h5>
                    <ul className="list-group list-group-flush">
                      {response.priceDecreaseFactors.map((factor, index) => (
                        <li key={index} className="list-group-item">{factor}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="d-flex justify-content-center gap-3">
                  <motion.button
                    onClick={() => setCurrentStep(0)}
                    className="btn btn-outline-secondary"
                    style={{ padding: '12px 30px', fontSize: '16px', borderRadius: '8px' }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Neue Bewertung starten
                  </motion.button>
                  <motion.button
                    onClick={downloadFormDataAsText}
                    className="btn btn-outline-primary"
                    style={{ padding: '12px 30px', fontSize: '16px', borderRadius: '8px', color: '#60C8E8', borderColor: '#60C8E8' }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Daten und Auswertung herunterladen
                  </motion.button>
                </div>
              </motion.div>
            )
          )}
        </AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 text-danger text-center"
            style={{ fontSize: '14px' }}
          >
            {error}
            <button
              onClick={() => setCurrentStep(0)}
              className="ms-2 text-primary text-decoration-underline"
              style={{ color: '#60C8E8' }}
            >
              Zurück zum Anfang
            </button>
          </motion.p>
        )}
      </div>

      {/* Footer */}
      <footer className="mt-4 text-center text-muted" style={{ fontSize: '12px' }}>
        Wir finanzieren diesen Service über die Provision unserer Immobilienprofis
      </footer>
    </div>
  );
}
