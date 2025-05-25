// pages/api/evaluate-property.js
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

  // Daten für Bewertung formatieren
  const propertyData = {
    address,
    city,
    zipCode,
    propertyType,
    constructionYear: parseInt(constructionYear) || 2000,
    plotSize: parseInt(plotSize) || 0,
    soilValue: parseFloat(soilValue) || 370, // Default Bodenrichtwert aus PDF
    developmentStatus,
    soilCondition,
    zoningPlan,
    encumbrances,
    floodRisk,
    livingArea: parseInt(livingArea) || 0,
    rooms: parseInt(rooms) || 0,
    floors: parseInt(floors) || 0,
    basement,
    roofing,
    garage,
    garageArea: parseInt(garageArea) || 0,
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
    marketRent: parseFloat(marketRent) || 12, // Default Miete aus PDF (ca. 12 €/m²)
    capitalizationRate: parseFloat(capitalizationRate) || 2.8, // Default Liegenschaftszinssatz aus PDF
  };

  try {
    // Mock-Bewertung basierend auf PDF-Logik
    // Bodenwert
    const Bodenwert = propertyData.plotSize * propertyData.soilValue;

    // Sachwert (vereinfacht)
    const Normalherstellungskosten = propertyData.livingArea * 1550; // Kostenkennwert aus PDF
    const Alterswertminderung = (2025 - propertyData.constructionYear) * 0.0125; // 1.25% pro Jahr (vereinfacht)
    const SachwertGebäude = Normalherstellungskosten * (1 - Alterswertminderung);
    const SachwertGarage = propertyData.garage !== 'nein' ? propertyData.garageArea * 665 : 0; // Kostenkennwert Garage
    const Außenanlagen = outdoorFacilities.length * 5000; // Pauschale pro Außenanlage
    const VorläufigerSachwert = SachwertGebäude + SachwertGarage + Außenanlagen + Bodenwert;
    const MarktAnpassung = VorläufigerSachwert * 1.09; // Sachwertfaktor aus PDF
    const VerkehrswertSachwert = MarktAnpassung - (propertyData.encumbrances === 'ja' ? 1387.5 : 0); // Abschlag Wegerecht

    // Ertragswert (vereinfacht)
    const Jahresrohertrag = propertyData.livingArea * propertyData.marketRent * 12;
    const Bewirtschaftungskosten = 3279; // Pauschale aus PDF
    const Jahresreinertrag = Jahresrohertrag - Bewirtschaftungskosten;
    const Bodenwertverzinsung = Bodenwert * (propertyData.capitalizationRate / 100);
    const ReinertragGebäude = Jahresreinertrag - Bodenwertverzinsung;
    const Vervielfältiger = 28.52; // Aus PDF
    const ErtragswertGebäude = ReinertragGebäude * Vervielfältiger;
    const VerkehrswertErtrag = ErtragswertGebäude + Bodenwert - (propertyData.encumbrances === 'ja' ? 1387.5 : 0);

    // Finaler Verkehrswert (Sachwert primär, Ertragswert als Plausibilitätsprüfung)
    const Verkehrswert = Math.round(VerkehrswertSachwert / 1000) * 1000;

    const evaluation = {
      price: `Geschätzter Verkehrswert: ${Verkehrswert.toLocaleString('de-DE')} €`,
      location: `Lage in ${city}: ${localLocation || 'Ruhige Wohnlage'}${
        floodRisk === 'ja' ? ', jedoch in einem Überschwemmungsgebiet' : ''
      }`,
      condition: `Zustand: ${sanitaryCondition}${modernizationDetails ? `, Modernisierungen: ${modernizationDetails}` : ''}${
        repairBacklog ? `, Reparaturstau: ${repairBacklog}` : ''
      }`,
    };

    res.status(200).json({ evaluation });
  } catch (error) {
    console.error('Fehler:', error.message);
    res.status(500).json({ error: 'Fehler bei der Bewertung' });
  }
}
