// components/PropertyEvaluationForm.js
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PropertyEvaluationForm() {
  const [formData, setFormData] = useState({
    address: '',
    city: '',
    zipCode: '',
    // ... restliche Formularfelder
  });
  const [currentStep, setCurrentStep] = useState(0);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const steps = [
    { title: 'Allgemeine Informationen', fields: [
      { name: 'address', label: 'Adresse (Straße, Hausnummer)', type: 'text', required: true },
      { name: 'city', label: 'Stadt', type: 'text', required: true },
      { name: 'zipCode', label: 'Postleitzahl', type: 'text', required: true },
    ]},
    // ... weitere Schritte
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // ... Submit-Logik
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg font-inter">
      {/* Fortschrittsanzeige */}
      <div className="mb-6">
        <div className="flex justify-between mb-2">
          {steps.map((step, index) => (
            <div key={index} className="flex-1 text-center">
              <motion.div
                className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center ${
                  index <= currentStep ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'
                }`}
                animate={{ scale: index === currentStep ? 1.2 : 1 }}
                transition={{ duration: 0.3 }}
              >
                {index + 1}
              </motion.div>
              <p className="text-sm mt-1">{step.title}</p>
            </div>
          ))}
        </div>
        <div className="h-2 bg-gray-200 rounded">
          <motion.div
            className="h-full bg-primary rounded"
            animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Formular */}
      <AnimatePresence mode="wait">
        <motion.form
          key={currentStep}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          <h2 className="text-2xl font-bold text-primary">{steps[currentStep].title}</h2>
          {steps[currentStep].fields.map((field) => (
            <div key={field.name} className="relative">
              <label className="block text-sm font-medium text-gray-700">
                {field.label}
                {field.required && <span className="text-red-500">*</span>}
              </label>
              {field.type === 'text' || field.type === 'number' ? (
                <motion.input
                  type={field.type}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  className="mt-1 w-full p-3 border rounded-lg focus:ring-primary focus:border-primary"
                  required={field.required}
                  whileFocus={{ scale: 1.02 }}
                />
              ) : null}
            </div>
          ))}
          <div className="flex justify-between">
            {currentStep > 0 && (
              <motion.button
                type="button"
                onClick={prevStep}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                whileHover={{ scale: 1.05 }}
              >
                Zurück
              </motion.button>
            )}
            {currentStep < steps.length - 1 ? (
              <motion.button
                type="button"
                onClick={nextStep}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700"
                whileHover={{ scale: 1.05 }}
              >
                Weiter
              </motion.button>
            ) : (
              <motion.button
                type="submit"
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700"
                whileHover={{ scale: 1.05 }}
              >
                Bewertung anfordern
              </motion.button>
            )}
          </div>
        </motion.form>
      </AnimatePresence>

      {response && (
        <motion.div
          className="mt-6 p-4 bg-neutral rounded-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <h3 className="text-lg font-semibold">Bewertung:</h3>
          <p><strong>Preis:</strong> {response.price}</p>
          <p><strong>Lage:</strong> {response.location}</p>
          <p><strong>Zustand:</strong> {response.condition}</p>
        </motion.div>
      )}
      {error && <p className="mt-4 text-red-600">{error}</p>}
    </div>
  );
}
