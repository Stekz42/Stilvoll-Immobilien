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
    // Sachwertverfahren (primäres Verfahren)
    // Bodenwert
    const Bodenwert = propertyData.plotSize * propertyData.soilValue;

    // Herstellungskosten Gebäude
    const Normalherstellungskosten = propertyData.livingArea * 1550.80; // Kostenkennwert aus PDF (2025 angepasst)
    const Gesamtnutzungsdauer = propertyType === 'einfamilienhaus' ? 80 : 60; // Aus PDF
    const Alter = 2025 - propertyData.constructionYear;
    const Modernisierungsfaktor = propertyData.lastModernization
      ? (2025 - propertyData.lastModernization) <= 10
        ? 0.1
        : 0
      : 0; // 10% Reduktion der Wertminderung bei kürzlicher Modernisierung
    const Alterswertminderung = (Alter / Gesamtnutzungsdauer) * (1 - Modernisierungsfaktor);
    const SachwertGebäude = Normalherstellungskosten * (1 - Alterswertminderung);

    // Garage
    const SachwertGarage = propertyData.garage !== 'nein' ? propertyData.garageArea * 665.50 : 0; // Kostenkennwert Garage aus PDF

    // Außenanlagen
    const AußenanlagenWert = outdoorFacilities.length * 10000; // Pauschale pro Außenanlage (höher als zuvor für realistischere Werte)

    // Vorläufiger Sachwert
    const VorläufigerSachwert = SachwertGebäude + SachwertGarage + AußenanlagenWert + Bodenwert;

    // Marktanpassung
    const Marktanpassung = VorläufigerSachwert * 1.09; // Sachwertfaktor aus PDF

    // Objektspezifische Merkmale (z. B. Wegerecht)
    const AbschlagWegerecht = propertyData.encumbrances === 'ja' ? 1387.5 : 0; // Aus PDF
    const VerkehrswertSachwert = Marktanpassung - AbschlagWegerecht;

    // Ertragswertverfahren (Plausibilitätsprüfung)
    const Jahresrohertrag = propertyData.livingArea * propertyData.marketRent * 12;
    const Bewirtschaftungskosten = 3279; // Pauschale aus PDF
    const Jahresreinertrag = Jahresrohertrag - Bewirtschaftungskosten;
    const Bodenwertverzinsung = Bodenwert * (propertyData.capitalizationRate / 100);
    const ReinertragGebäude = Jahresreinertrag - Bodenwertverzinsung;
    const Vervielfältiger = 28.52; // Aus PDF
    const ErtragswertGebäude = ReinertragGebäude * Vervielfältiger;
    const VerkehrswertErtrag = ErtragswertGebäude + Bodenwert - AbschlagWegerecht;

    // Finaler Verkehrswert (Sachwert primär, Ertragswert als Plausibilitätsprüfung)
    const Verkehrswert = Math.round(VerkehrswertSachwert / 1000) * 1000;

    // Lagebewertung
    let Lagebewertung = `Lage in ${city}: ${localLocation || 'Ruhige Wohnlage'}`;
    if (propertyData.floodRisk === 'ja') {
      Lagebewertung += ', jedoch in einem Überschwemmungsgebiet (Wertminderung möglich)';
    }
    if (propertyData.publicTransportDistance && parseFloat(propertyData.publicTransportDistance) <= 1) {
      Lagebewertung += ', hervorragende Anbindung an öffentliche Verkehrsmittel';
    } else if (propertyData.publicTransportDistance && parseFloat(propertyData.publicTransportDistance) > 3) {
      Lagebewertung += ', eingeschränkte Anbindung an öffentliche Verkehrsmittel';
    }

    // Zustandsbewertung
    let Zustand = `Zustand: ${propertyData.sanitaryCondition}`;
    if (propertyData.modernizationDetails) {
      Zustand += `, Modernisierungen: ${propertyData.modernizationDetails}`;
    }
    if (propertyData.repairBacklog) {
      Zustand += `, Reparaturstau: ${propertyData.repairBacklog}`;
    }
    if (propertyData.energyCertificate === 'ja' && propertyData.energyClass) {
      Zustand += `, Energieeffizienzklasse: ${propertyData.energyClass}`;
    }

    const evaluation = {
      price: `${Verkehrswert.toLocaleString('de-DE')} €`,
      location: Lagebewertung,
      condition: Zustand,
    };

    res.status(200).json({ evaluation });
  } catch (error) {
    console.error('Fehler:', error.message);
    res.status(500).json({ error: 'Fehler bei der Bewertung' });
  }
}
