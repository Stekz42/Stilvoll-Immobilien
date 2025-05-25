// pages/api/evaluate-property.js
import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const {
    address,
    city,
    zipCode,
    propertyType,
    constructionYear,
    evaluationPurpose,
    plotSize,
    soilValue,
    developmentStatus,
    soilCondition,
    zoningPlan,
    encumbrances,
    floodRisk,
    livingArea,
    rooms,
    floors,
    basement,
    roofing,
    garage,
    garageArea,
    outdoorFacilities,
    equipmentLevel,
    heatingSystem,
    sanitaryCondition,
    lastModernization,
    modernizationDetails,
    repairBacklog,
    accessibility,
    energyCertificate,
    energyClass,
    localLocation,
    publicTransportDistance,
    amenitiesDistance,
    marketRent,
    capitalizationRate,
  } = req.body;

  // Validierung
  if (!address || !city || !zipCode || !livingArea || !rooms || !floors || !plotSize) {
    return res.status(400).json({ error: 'Pflichtfelder fehlen' });
  }

  // Daten für Grok formatieren
  const propertyData = {
    address,
    city,
    zipCode,
    propertyType,
    constructionYear: parseInt(constructionYear) || null,
    evaluationPurpose,
    plotSize: parseInt(plotSize) || null,
    soilValue: parseFloat(soilValue) || null,
    developmentStatus,
    soilCondition,
    zoningPlan,
    encumbrances,
    floodRisk,
    livingArea: parseInt(livingArea) || null,
    rooms: parseInt(rooms) || null,
    floors: parseInt(floors) || null,
    basement,
    roofing,
    garage,
    garageArea: parseInt(garageArea) || null,
    outdoorFacilities,
    equipmentLevel,
    heatingSystem,
    sanitaryCondition,
    lastModernization: parseInt(lastModernization) || null,
    modernizationDetails,
    repairBacklog,
    accessibility,
    energyCertificate,
    energyClass,
    localLocation,
    publicTransportDistance,
    amenitiesDistance,
    marketRent: parseFloat(marketRent) || null,
    capitalizationRate: parseFloat(capitalizationRate) || null,
  };

  try {
    // Mock-Bewertung (da xAI-API noch nicht verfügbar)
    const mockEvaluation = {
      price: `Geschätzter Preis: €${(
        propertyData.livingArea * 4000 +
        (propertyData.plotSize * (propertyData.soilValue || 370))
      ).toLocaleString('de-DE')}`,
      location: `Lage in ${city}: ${localLocation || 'Gut'}`,
      condition: `Zustand: ${sanitaryCondition}, Modernisierungen: ${modernizationDetails || 'Keine'}`,
    };

    // TODO: Echte xAI-API-Integration
    /*
    const grokResponse = await axios.post(
      'https://api.x.ai/grok/evaluate',
      { query: `Bitte bewerte die folgende Immobilie hinsichtlich Preis, Lage und Zustand: ${JSON.stringify(propertyData)}` },
      { headers: { Authorization: `Bearer ${process.env.XAI_API_KEY}`, 'Content-Type': 'application/json' } }
    );
    const evaluation = grokResponse.data.evaluation || mockEvaluation;
    */

    res.status(200).json({ evaluation: mockEvaluation });
  } catch (error) {
    console.error('Fehler:', error.message);
    res.status(500).json({ error: 'Fehler bei der Bewertung' });
  }
}
