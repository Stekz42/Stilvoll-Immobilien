// components/PropertyEvaluationForm.js
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaHome, FaLandmark, FaBuilding, FaTools, FaMap, FaChartLine, FaCheckCircle, FaMapMarkerAlt, FaUser } from 'react-icons/fa';

export default function PropertyEvaluationForm() {
  const [formData, setFormData] = useState(() => {
    const savedData = typeof window !== 'undefined' ? localStorage.getItem('formData') : null;
    return savedData ? JSON.parse(savedData) : {
      firstName: '',
      lastName: '',
      addressPersonal: '',
      phone: '',
      email: '',
      address: '',
      city: '',
      zipCode: '',
      propertyType: 'einfamilienhaus',
      numberOfUnits: '', // Für Mehrfamilienhäuser
      annualGrossRent: '', // Für Mehrfamilienhäuser und Gewerbe
      operatingCosts: '', // Für Mehrfamilienhäuser und Gewerbe
      vacancyRate: '', // Für Mehrfamilienhäuser
      commercialUseType: '', // Für Gewerbeimmobilien
      usableArea: '', // Für Gewerbeimmobilien
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
  const [currentStep, setCurrentStep] = useState(-1); // Start bei -1 für Begrüßungskachel
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem('formData', JSON.stringify(formData));
  }, [formData]);

  const steps = [
    {
      title: 'Persönliche Daten',
      icon: <FaUser />,
      fields: [
        { name: 'firstName', label: 'Vorname', type: 'text', required: true, section: 'Persönliche Daten', description: 'Geben Sie Ihren Vornamen ein (z. B. Max).' },
        { name: 'lastName', label: 'Nachname', type: 'text', required: true, section: 'Persönliche Daten', description: 'Geben Sie Ihren Nachnamen ein (z. B. Mustermann).' },
        { name: 'addressPersonal', label: 'Anschrift (Straße, Hausnummer, PLZ, Ort)', type: 'text', required: true, section: 'Persönliche Daten', description: 'Geben Sie Ihre vollständige Anschrift ein (z. B. Hauptstraße 10, 40210 Düsseldorf).' },
        { name: 'phone', label: 'Telefonnummer', type: 'text', required: true, section: 'Persönliche Daten', description: 'Geben Sie Ihre Telefonnummer ein (z. B. +49123456789).' },
        { name: 'email', label: 'E-Mail-Adresse', type: 'email', required: true, section: 'Persönliche Daten', description: 'Geben Sie Ihre E-Mail-Adresse ein (z. B. max.mustermann@example.com).' },
      ],
    },
    {
      title: 'Allgemeine Informationen',
      icon: <FaHome />,
      fields: [
        { name: 'address', label: 'Adresse (Straße, Hausnummer)', type: 'text', required: true, section: 'Adresse', description: 'Geben Sie die vollständige Adresse der Immobilie ein (z. B. Musterstraße 1).' },
        { name: 'city', label: 'Stadt', type: 'text', required: true, section: 'Adresse', description: 'Geben Sie die Stadt ein, in der sich die Immobilie befindet (z. B. Berlin).' },
        { name: 'zipCode', label: 'Postleitzahl', type: 'text', required: true, section: 'Adresse', description: 'Geben Sie die Postleitzahl der Immobilie ein (z. B. 10115).' },
        {
          name: 'propertyType',
          label: 'Immobilientyp',
          type: 'select',
          options: [
            { value: 'einfamilienhaus', label: 'Einfamilienhaus' },
            { value: 'mehrfamilienhaus', label: 'Mehrfamilienhaus' }, // Neue Option
            { value: 'wohnung', label: 'Wohnung' },
            { value: 'gewerbe', label: 'Gewerbe' },
          ],
          section: 'Immobilientyp',
          description: 'Wählen Sie den Typ der Immobilie aus (z. B. Einfamilienhaus).',
        },
        { name: 'constructionYear', label: 'Baujahr', type: 'number', required: true, section: 'Immobilientyp', description: 'Geben Sie das Jahr ein, in dem die Immobilie fertiggestellt wurde (z. B. 1990).' },
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
          description: 'Wählen Sie den Grund für die Bewertung aus (z. B. Verkauf).',
        },
      ],
    },
    {
      title: 'Spezifische Informationen',
      icon: <FaBuilding />,
      fields: [
        // Dynamische Felder für Mehrfamilienhäuser
        ...(formData.propertyType === 'mehrfamilienhaus' ? [
          { name: 'numberOfUnits', label: 'Anzahl der Wohneinheiten', type: 'number', required: true, section: 'Mehrfamilienhaus', description: 'Geben Sie die Anzahl der Wohneinheiten ein (z. B. 3).' },
          { name: 'annualGrossRent', label: 'Jahresbruttomiete (€)', type: 'number', required: true, section: 'Mehrfamilienhaus', description: 'Geben Sie die gesamte Jahresbruttomiete ein (z. B. 36.000 €).' },
          { name: 'operatingCosts', label: 'Bewirtschaftungskosten (€/Jahr)', type: 'number', required: true, section: 'Mehrfamilienhaus', description: 'Geben Sie die jährlichen Bewirtschaftungskosten ein (z. B. 5.000 €).' },
          { name: 'vacancyRate', label: 'Mietausfallrisiko (%)', type: 'number', required: true, section: 'Mehrfamilienhaus', description: 'Geben Sie das Mietausfallrisiko in Prozent ein (z. B. 5 %).' },
        ] : []),
        // Dynamische Felder für Gewerbeimmobilien
        ...(formData.propertyType === 'gewerbe' ? [
          { name: 'usableArea', label: 'Nutzfläche (m²)', type: 'number', required: true, section: 'Gewerbeimmobilie', description: 'Geben Sie die Nutzfläche in Quadratmetern ein (z. B. 200 m²).' },
          {
            name: 'commercialUseType',
            label: 'Art der Gewerbenutzung',
            type: 'select',
            options: [
              { value: 'büro', label: 'Büro' },
              { value: 'lager', label: 'Lager' },
              { value: 'einzelhandel', label: 'Einzelhandel' },
              { value: 'sonstiges', label: 'Sonstiges' },
            ],
            required: true,
            section: 'Gewerbeimmobilie',
            description: 'Wählen Sie die Art der Gewerbenutzung aus.',
          },
          { name: 'annualGrossRent', label: 'Jahresbruttomiete (€)', type: 'number', required: true, section: 'Gewerbeimmobilie', description: 'Geben Sie die gesamte Jahresbruttomiete ein (z. B. 50.000 €).' },
          { name: 'operatingCosts', label: 'Bewirtschaftungskosten (€/Jahr)', type: 'number', required: true, section: 'Gewerbeimmobilie', description: 'Geben Sie die jährlichen Bewirtschaftungskosten ein (z. B. 8.000 €).' },
        ] : []),
      ].filter(field => field), // Entfernt leere Felder
    },
    {
      title: 'Grundstück',
      icon: <FaLandmark />,
      fields: [
        { name: 'plotSize', label: 'Grundstücksgröße (m²)', type: 'number', required: true, section: 'Grundstücksdetails', description: 'Geben Sie die Größe des Grundstücks in Quadratmetern ein (z. B. 500).' },
        {
          name: 'soilValue',
          label: 'Bodenrichtwert (€/m², falls bekannt)',
          type: 'number',
          section: 'Grundstücksdetails',
          description: 'Geben Sie den Bodenrichtwert pro Quadratmeter ein, falls bekannt (z. B. 370). Diesen finden Sie beim Gutachterausschuss oder auf boris.nrw.de.',
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
          description: 'Wählen Sie aus, ob das Grundstück vollständig, teilweise oder nicht erschlossen ist (z. B. vollständig erschlossen).',
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
          description: 'Wählen Sie aus, ob der Baugrund normal tragfähig oder problematisch ist (z. B. normal tragfähig).',
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
          description: 'Wählen Sie den Typ des Bebauungsplans aus (z. B. Wohngebiet).',
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
          description: 'Wählen Sie aus, ob grundbuchliche Belastungen wie Wegerechte oder Hypotheken eingetragen sind (z. B. Nein).',
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
          description: 'Wählen Sie aus, ob die Immobilie in einem Überschwemmungsgebiet liegt. Diese Information finden Sie bei Ihrer Gemeinde oder auf Karten von Umweltbehörden.',
        },
      ],
    },
    {
      title: 'Gebäude und bauliche Anlagen',
      icon: <FaBuilding />,
      fields: [
        ...(formData.propertyType !== 'gewerbe' ? [
          { name: 'livingArea', label: 'Wohnfläche (m²)', type: 'number', required: true, section: 'Gebäudedetails', description: 'Geben Sie die tatsächliche Wohnfläche ohne Nebenflächen (z. B. Keller) in Quadratmetern ein (z. B. 120).' },
          { name: 'rooms', label: 'Anzahl der Zimmer', type: 'number', required: true, section: 'Gebäudedetails', description: 'Geben Sie die Anzahl der Zimmer ein (z. B. 4).' },
          { name: 'floors', label: 'Anzahl der Vollgeschosse', type: 'number', required: true, section: 'Gebäudedetails', description: 'Geben Sie die Anzahl der Vollgeschosse ein (z. B. 2).' },
          {
            name: 'basement',
            label: 'Unterkellert',
            type: 'select',
            options: [
              { value: 'ja', label: 'Ja' },
              { value: 'nein', label: 'Nein' },
            ],
            section: 'Gebäudedetails',
            description: 'Wählen Sie aus, ob die Immobilie unterkellert ist (z. B. Ja).',
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
            description: 'Wählen Sie den Typ der Bedachung aus (z. B. Satteldach).',
          },
        ] : []),
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
          description: 'Wählen Sie aus, ob eine Garage vorhanden ist (z. B. Nein).',
        },
        { name: 'garageArea', label: 'Garagefläche (m²)', type: 'number', section: 'Zusätzliche Anlagen', description: 'Geben Sie die Fläche der Garage in Quadratmetern ein, falls vorhanden (z. B. 30).' },
        ...(formData.propertyType !== 'gewerbe' ? [
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
            description: 'Wählen Sie alle zutreffenden Außenanlagen aus (z. B. Terrasse, Garten).',
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
            description: 'Wählen Sie den Ausstattungsgrad der Immobilie aus (z. B. Mittel).',
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
            description: 'Wählen Sie das Heizungssystem aus (z. B. Gas).',
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
            description: 'Wählen Sie den Zustand der Sanitäranlagen aus (z. B. Baujahrestypisch).',
          },
        ] : []),
      ],
    },
    {
      title: 'Modernisierungen und Zustand',
      icon: <FaTools />,
      fields: [
        { name: 'lastModernization', label: 'Jahr der letzten Modernisierung', type: 'number', section: 'Modernisierungen', description: 'Geben Sie das Jahr der letzten Modernisierung ein, falls zutreffend (z. B. 2015).' },
        { name: 'modernizationDetails', label: 'Details zu Modernisierungen', type: 'textarea', section: 'Modernisierungen', description: 'Geben Sie Details zu den Modernisierungen ein (z. B. neue Fenster 2015).' },
        { name: 'repairBacklog', label: 'Reparaturstau oder Baumängel', type: 'textarea', section: 'Zustand', description: 'Beschreiben Sie eventuellen Reparaturstau oder Baumängel (z. B. undichtes Dach).' },
        {
          name: 'accessibility',
          label: 'Barrierefrei',
          type: 'select',
          options: [
            { value: 'nein', label: 'Nein' },
            { value: 'ja', label: 'Ja' },
          ],
          section: 'Zustand',
          description: 'Wählen Sie aus, ob die Immobilie barrierefrei ist (z. B. Nein).',
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
          description: 'Wählen Sie aus, ob ein Energieausweis vorhanden ist (z. B. Nein).',
        },
        { name: 'energyClass', label: 'Energieeffizienzklasse (falls vorhanden)', type: 'text', section: 'Energie', description: 'Geben Sie die Energieeffizienzklasse ein, falls ein Energieausweis vorhanden ist (z. B. C).' },
      ],
    },
    {
      title: 'Lage und Infrastruktur',
      icon: <FaMap />,
      fields: [
        { name: 'localLocation', label: 'Beschreibung der lokalen Lage', type: 'textarea', section: 'Lage', description: 'Beschreiben Sie die Lage der Immobilie (z. B. ruhige Wohngegend).' },
        {
          name: 'publicTransportDistance',
          label: 'Entfernung zu öffentlichen Verkehrsmitteln (km oder Minuten)',
          type: 'text',
          section: 'Infrastruktur',
          description: 'Geben Sie die Entfernung zu öffentlichen Verkehrsmitteln ein (z. B. 0.5 km oder 5 Minuten).',
        },
        {
          name: 'amenitiesDistance',
          label: 'Entfernung zu Schulen, Geschäften, Freizeiteinrichtungen (km)',
          type: 'text',
          section: 'Infrastruktur',
          description: 'Geben Sie die Entfernung zu wichtigen Einrichtungen in Kilometern ein (z. B. 1 km).',
        },
      ],
    },
    {
      title: 'Markt- und Ertragsdaten',
      icon: <FaChartLine />,
      fields: [
        ...(formData.propertyType !== 'mehrfamilienhaus' && formData.propertyType !== 'gewerbe' ? [
          {
            name: 'marketRent',
            label: 'Marktübliche Miete pro m² (€/m²/Monat, falls bekannt)',
            type: 'number',
            section: 'Marktdaten',
            description: 'Geben Sie die marktübliche Miete pro Quadratmeter ein, falls bekannt (z. B. 12). Diese Information finden Sie in Mietspiegeln oder bei Immobilienportalen.',
          },
        ] : []),
        { name: 'capitalizationRate', label: 'Liegenschaftszinssatz (%, falls bekannt)', type: 'number', section: 'Marktdaten', description: 'Geben Sie den Liegenschaftszinssatz in Prozent ein, falls bekannt (z. B. 2.8).' },
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
    textContent += 'Persönliche Daten:\n';
    textContent += `Vorname: ${formData.firstName}\n`;
    textContent += `Nachname: ${formData.lastName}\n`;
    textContent += `Anschrift: ${formData.addressPersonal}\n`;
    textContent += `Telefonnummer: ${formData.phone}\n`;
    textContent += `E-Mail-Adresse: ${formData.email}\n`;
    textContent += '\nEingegebene Daten:\n';
    for (const [key, value] of Object.entries(formData)) {
      if (!['firstName', 'lastName', 'addressPersonal', 'phone', 'email'].includes(key)) {
        textContent += `${key}: ${Array.isArray(value) ? value.join(', ') : value}\n`;
      }
    }

    // Auswertung hinzufügen, falls vorhanden
    if (response) {
      textContent += '\nAuswertung:\n';
      textContent += `Geschätzter Verkehrswert: ${response.price}\n`;
      textContent += `Lagebewertung: ${response.location}\n`;
      textContent += `Zustand: ${response.condition}\n`;
      if (response.breakdown) {
        textContent += '\nAufschlüsselung des Verkehrswerts:\n';
        textContent += `Bodenwert: ${response.breakdown.Bodenwert || 'Nicht verfügbar'} €\n`;
        textContent += `Sachwert des Gebäudes: ${response.breakdown.SachwertGebäude || 'Nicht verfügbar'} €\n`;
        textContent += `Sachwert der Garage: ${response.breakdown.SachwertGarage || 'Nicht verfügbar'} €\n`;
        textContent += `Wert der Außenanlagen: ${response.breakdown.AußenanlagenWert || 'Nicht verfügbar'} €\n`;
        textContent += `Marktanpassung: +${response.breakdown.Marktanpassung || 'Nicht verfügbar'} €\n`;
        textContent += `Abschlag (Wegerecht): -${response.breakdown.AbschlagWegerecht || 'Nicht verfügbar'} €\n`;
      }
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
        {field.type === 'text' || field.type === 'number' || field.type === 'email' ? (
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
            {field.description && (
              <small className="d-block text-muted mt-1" style={{ fontSize: '12px' }}>
                {field.description}
              </small>
            )}
          </motion.div>
        ) : field.type === 'select' ? (
          <motion.div whileHover={{ scale: 1.02 }}>
            <motion.select
              name={field.name}
              value={formData[field.name]}
              onChange={handleChange}
              className={`form-select ${hasError ? 'is-invalid' : ''}`}
              style={{ fontSize: '16px', borderRadius: '8px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}
            >
              {field.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </motion.select>
            {hasError && (
              <div className="invalid-feedback" style={{ display: 'block', fontSize: '14px' }}>
                {hasError}
              </div>
            )}
            {field.description && (
              <small className="d-block text-muted mt-1" style={{ fontSize: '12px' }}>
                {field.description}
              </small>
            )}
          </motion.div>
        ) : field.type === 'textarea' ? (
          <motion.div whileHover={{ scale: 1.02 }}>
            <motion.textarea
              name={field.name}
              value={formData[field.name]}
              onChange={handleChange}
              className={`form-control ${hasError ? 'is-invalid' : ''}`}
              style={{ fontSize: '16px', borderRadius: '8px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}
              rows="4"
              placeholder={field.label}
            />
            {hasError && (
              <div className="invalid-feedback" style={{ display: 'block', fontSize: '14px' }}>
                {hasError}
              </div>
            )}
            {field.description && (
              <small className="d-block text-muted mt-1" style={{ fontSize: '12px' }}>
                {field.description}
              </small>
            )}
          </motion.div>
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
            {field.description && (
              <small className="d-block text-muted mt-1" style={{ fontSize: '12px' }}>
                {field.description}
              </small>
            )}
          </div>
        ) : null}
      </div>
    );
  };

  // Berechne den Fortschritt, begrenze ihn auf 100 %
  const progressPercentage = Math.min((currentStep >= 0 ? currentStep / (steps.length - 1) : 0) * 100, 100);

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

        {/* Fortschrittsanzeige (wird nur ab Step 0 angezeigt) */}
        {currentStep >= 0 && (
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
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 0.8, ease: 'easeInOut' }}
                  style={{ backgroundColor: '#60C8E8' }}
                />
              </div>
              <span className="text-muted fw-medium" style={{ fontSize: '14px' }}>
                {Math.round(progressPercentage)}%
              </span>
            </div>
          </div>
        )}

        <AnimatePresence mode="wait">
          {currentStep === -1 ? (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="text-center"
            >
              <div className="card p-5 mb-4" style={{ backgroundColor: '#FFFFFF', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                <h2 className="fs-3 fw-bold text-dark mb-3">Herzlich willkommen bei Stilvoll Immobilien</h2>
                <p className="fs-5 text-muted mb-4">
                  Bewerten Sie heute kostenlos Ihre Immobilie datenbasiert in unserem Online-Tool
                </p>
                <motion.button
                  onClick={() => setCurrentStep(0)}
                  className="btn btn-primary"
                  style={{ padding: '12px 30px', fontSize: '16px', borderRadius: '8px', backgroundColor: '#60C8E8', borderColor: '#60C8E8' }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Jetzt starten
                </motion.button>
              </div>
            </motion.div>
          ) : currentStep < steps.length ? (
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
                  {response.breakdown ? (
                    <div className="mt-4 text-start">
                      <h5 className="fs-5 fw-semibold text-dark">Aufschlüsselung des Verkehrswerts:</h5>
                      <table className="table table-bordered">
                        <tbody>
                          <tr>
                            <td>Bodenwert</td>
                            <td>{response.breakdown.Bodenwert} €</td>
                          </tr>
                          <tr>
                            <td>Sachwert des Gebäudes</td>
                            <td>{response.breakdown.SachwertGebäude} €</td>
                          </tr>
                          <tr>
                            <td>Sachwert der Garage</td>
                            <td>{response.breakdown.SachwertGarage} €</td>
                          </tr>
                          <tr>
                            <td>Wert der Außenanlagen</td>
                            <td>{response.breakdown.AußenanlagenWert} €</td>
                          </tr>
                          <tr>
                            <td>Marktanpassung</td>
                           <td className={parseFloat(response.breakdown.Marktanpassung.replace('.', '').replace(',', '.')) >= 0 ? 'text-success' : 'text-danger'}>
  {parseFloat(response.breakdown.Marktanpassung.replace('.', '').replace(',', '.')) >= 0 ? '+' : '-'}
  {Math.abs(parseFloat(response.breakdown.Marktanpassung.replace('.', '').replace(',', '.'))).toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
</td>
                          </tr>
                          <tr>
                            <td>Abschlag (Wegerecht)</td>
                            <td>-{response.breakdown.AbschlagWegerecht} €</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-muted mt-4">Aufschlüsselung des Verkehrswerts ist derzeit nicht verfügbar.</p>
                  )}
                  <div className="mt-4 text-start">
                    <h5 className="fs-5 fw-semibold text-dark">Preissteigernde Faktoren:</h5>
                    <ul className="list-group list-group-flush">
                      {response.priceIncreaseFactors.slice(0, 3).map((factor, index) => (
                        <li key={index} className="list-group-item">{factor}</li>
                      ))}
                    </ul>
                    <h5 className="fs-5 fw-semibold text-dark mt-3">Preissenkende Faktoren:</h5>
                    <ul className="list-group list-group-flush">
                      {response.priceDecreaseFactors.slice(0, 3).map((factor, index) => (
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
