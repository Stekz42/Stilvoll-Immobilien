// pages/api/evaluate-property.js
import fs from 'fs';
import path from 'path';
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

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
    soilValue: parseFloat(soilValue) || 370,
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
    marketRent: parseFloat(marketRent) || 12,
    capitalizationRate: parseFloat(capitalizationRate) || 2.8,
  };

  try {
    // Daten speichern (z. B. in einer Datei)
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filePath = path.join(process.cwd(), 'data', `submission-${timestamp}.json`);
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, JSON.stringify(propertyData, null, 2));

    // E-Mail senden
    const msg = {
      to: 'info@konzept-stilvoll.de',
      from: 'noreply@stilvoll-immobilien.de', // Ersetze dies mit der verifizierten Absender-E-Mail-Adresse aus SendGrid
      subject: 'Neue Immobilienbewertung',
      text: `Eine neue Bewertung wurde eingereicht:\n\n${JSON.stringify(propertyData, null, 2)}`,
    };

    await sgMail.send(msg);
    console.log('E-Mail erfolgreich gesendet an info@konzept-stilvoll.de');

    // Sachwertverfahren (primäres Verfahren)
    const Bodenwert = propertyData.plotSize * propertyData.soilValue;
    const Normalherstellungskosten = propertyData.livingArea * 1550.80;
    const Gesamtnutzungsdauer = propertyType === 'einfamilienhaus' ? 80 : 60;
    const Alter = 2025 - propertyData.constructionYear;
    const Modernisierungsfaktor = propertyData.lastModernization
      ? (2025 - propertyData.lastModernization) <= 10
        ? 0.1
        : 0
      : 0;
    const Alterswertminderung = (Alter / Gesamtnutzungsdauer) * (1 - Modernisierungsfaktor);
    const SachwertGebäude = Normalherstellungskosten * (1 - Alterswertminderung);
    const SachwertGarage = propertyData.garage !== 'nein' ? propertyData.garageArea * 665.50 : 0;
    const AußenanlagenWert = propertyData.outdoorFacilities.length * 10000;
    const VorläufigerSachwert = SachwertGebäude + SachwertGarage + AußenanlagenWert + Bodenwert;
    const Marktanpassung = VorläufigerSachwert * 1.09;
    const AbschlagWegerecht = propertyData.encumbrances === 'ja' ? 1387.5 : 0;
    const VerkehrswertSachwert = Marktanpassung - AbschlagWegerecht;

    // Ertragswertverfahren (Plausibilitätsprüfung)
    const Jahresrohertrag = propertyData.livingArea * propertyData.marketRent * 12;
    const Bewirtschaftungskosten = 3279;
    const Jahresreinertrag = Jahresrohertrag - Bewirtschaftungskosten;
    const Bodenwertverzinsung = Bodenwert * (propertyData.capitalizationRate / 100);
    const ReinertragGebäude = Jahresreinertrag - Bodenwertverzinsung;
    const Vervielfältiger = 28.52;
    const ErtragswertGebäude = ReinertragGebäude * Vervielfältiger;
    const VerkehrswertErtrag = ErtragswertGebäude + Bodenwert - AbschlagWegerecht;

    // Finaler Verkehrswert
    const Verkehrswert = Math.round(VerkehrswertSachwert / 1000) * 1000;

    // Lagebewertung
    let Lagebewertung = `Lage in ${city}: ${localLocation || 'Ruhige Wohnlage
