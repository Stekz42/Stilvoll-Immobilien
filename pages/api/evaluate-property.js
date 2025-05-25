// pages/api/evaluate-property.js
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const {
    firstName,
    lastName,
    addressPersonal,
    phone,
    email,
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

  try {
    // Validierung
    if (!firstName || !lastName || !addressPersonal || !phone || !email || !address || !city || !zipCode || !livingArea || !rooms || !floors || !plotSize) {
      return res.status(400).json({ error: 'Pflichtfelder fehlen' });
    }

    // Daten für Bewertung formatieren mit sicherer Typkonvertierung
    const propertyData = {
      firstName,
      lastName,
      addressPersonal,
      phone,
      email,
      address,
      city,
      zipCode,
      propertyType,
      constructionYear: parseInt(constructionYear, 10) || 2000,
      plotSize: parseInt(plotSize, 10) || 0,
      soilValue: parseFloat(soilValue) || 370,
      developmentStatus,
      soilCondition,
      zoningPlan,
      encumbrances,
      floodRisk,
      livingArea: parseInt(livingArea, 10) || 0,
      rooms: parseInt(rooms, 10) || 0,
      floors: parseInt(floors, 10) || 0,
      basement,
      roofing,
      garage,
      garageArea: parseInt(garageArea, 10) || 0,
      outdoorFacilities: Array.isArray(outdoorFacilities) ? outdoorFacilities : [],
      equipmentLevel,
      heatingSystem,
      sanitaryCondition,
      lastModernization: parseInt(lastModernization, 10) || null,
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
    let Lagebewertung = `${city}: ${localLocation || 'Ruhige Wohnlage'}`;
    if (propertyData.floodRisk === 'ja') {
      Lagebewertung += ', jedoch in einem Überschwemmungsgebiet (Wertminderung möglich)';
    }
    if (propertyData.publicTransportDistance && parseFloat(propertyData.publicTransportDistance) <= 1) {
      Lagebewertung += ', hervorragende Anbindung an öffentliche Verkehrsmittel';
    } else if (propertyData.publicTransportDistance && parseFloat(propertyData.publicTransportDistance) > 3) {
      Lagebewertung += ', eingeschränkte Anbindung an öffentliche Verkehrsmittel';
    }

    // Zustandsbewertung
    let Zustand = `${propertyData.sanitaryCondition}`;
    if (propertyData.modernizationDetails) {
      Zustand += `, Modernisierungen: ${propertyData.modernizationDetails}`;
    }
    if (propertyData.repairBacklog) {
      Zustand += `, Reparaturstau: ${propertyData.repairBacklog}`;
    }
    if (propertyData.energyCertificate === 'ja' && propertyData.energyClass) {
      Zustand += `, Energieeffizienzklasse: ${propertyData.energyClass}`;
    }

    // Preissteigernde Faktoren (nur 3)
    const priceIncreaseFactors = [];
    if (propertyData.publicTransportDistance && parseFloat(propertyData.publicTransportDistance) <= 1) {
      priceIncreaseFactors.push('Hervorragende Anbindung an öffentliche Verkehrsmittel');
    }
    if (propertyData.equipmentLevel === 'gehoben') {
      priceIncreaseFactors.push('Gehobene Ausstattung');
    }
    if (propertyData.lastModernization && (2025 - propertyData.lastModernization) <= 10) {
      priceIncreaseFactors.push('Kürzliche Modernisierung in den letzten 10 Jahren');
    }
    if (propertyData.livingArea > 150 && priceIncreaseFactors.length < 3) {
      priceIncreaseFactors.push('Große Wohnfläche über 150 m²');
    }
    if (propertyData.outdoorFacilities.length > 0 && priceIncreaseFactors.length < 3) {
      priceIncreaseFactors.push(`Zusätzliche Außenanlagen (${propertyData.outdoorFacilities.join(', ')})`);
    }
    while (priceIncreaseFactors.length < 3) {
      priceIncreaseFactors.push('Kein weiterer preissteigernder Faktor');
    }

    // Preissenkende Faktoren (nur 3)
    const priceDecreaseFactors = [];
    if (propertyData.floodRisk === 'ja') {
      priceDecreaseFactors.push('Lage in einem Überschwemmungsgebiet');
    }
    if (propertyData.sanitaryCondition === 'renovierungsbedürftig') {
      priceDecreaseFactors.push('Renovierungsbedürftige Sanitäranlagen');
    }
    if (propertyData.repairBacklog) {
      priceDecreaseFactors.push('Vorhandener Reparaturstau');
    }
    if (propertyData.constructionYear < 1970 && priceDecreaseFactors.length < 3) {
      priceDecreaseFactors.push('Älteres Baujahr (vor 1970)');
    }
    if (propertyData.encumbrances === 'ja' && priceDecreaseFactors.length < 3) {
      priceDecreaseFactors.push('Grundbuchliche Belastungen (z. B. Wegerecht)');
    }
    while (priceDecreaseFactors.length < 3) {
      priceDecreaseFactors.push('Kein weiterer preissenkender Faktor');
    }

    // Evaluation-Objekt erstellen
    const evaluation = {
      price: `${Verkehrswert.toLocaleString('de-DE')} €`,
      location: Lagebewertung,
      condition: Zustand,
      priceIncreaseFactors,
      priceDecreaseFactors,
      breakdown: {
        Bodenwert: Bodenwert.toLocaleString('de-DE'),
        SachwertGebäude: SachwertGebäude.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
        SachwertGarage: SachwertGarage.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
        AußenanlagenWert: AußenanlagenWert.toLocaleString('de-DE'),
        Marktanpassung: (Marktanpassung - VorläufigerSachwert).toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
        AbschlagWegerecht: AbschlagWegerecht.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      },
    };

    // Daten in MongoDB speichern
    try {
      await client.connect();
      const database = client.db('immobilienbewertung');
      const submissions = database.collection('submissions');

      const submission = {
        formData: propertyData,
        evaluation,
        timestamp: new Date(),
      };

      await submissions.insertOne(submission);
      console.log('Daten erfolgreich in MongoDB gespeichert');
    } catch (dbError) {
      console.error('Fehler beim Speichern in MongoDB:', dbError.message);
      // Trotz Datenbankfehler die Bewertung zurückgeben
    } finally {
      await client.close();
    }

    res.status(200).json(evaluation);
  } catch (error) {
    console.error('Fehler:', error.message);
    res.status(500).json({ error: 'Fehler bei der Bewertung: ' + error.message });
  }
}
