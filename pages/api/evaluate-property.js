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
    numberOfUnits,
    annualGrossRent,
    operatingCosts,
    vacancyRate,
    usableArea,
    commercialUseType,
    constructionYear,
    buildingMaterial,
    valueAddedFeatures,
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
    dsgvoAccepted,
  } = req.body;

  try {
    // Validierung
    if (!firstName || !lastName || !addressPersonal || !phone || !email || !address || !city || !zipCode || !plotSize) {
      return res.status(400).json({ error: 'Pflichtfelder fehlen' });
    }
    if (propertyType !== 'gewerbe' && !livingArea) {
      return res.status(400).json({ error: 'Wohnfläche ist erforderlich' });
    }
    if (propertyType === 'gewerbe' && !usableArea) {
      return res.status(400).json({ error: 'Nutzfläche ist erforderlich' });
    }
    if (propertyType === 'mehrfamilienhaus' && (!numberOfUnits || !annualGrossRent || !operatingCosts || !vacancyRate)) {
      return res.status(400).json({ error: 'Pflichtfelder für Mehrfamilienhaus fehlen' });
    }
    if (propertyType === 'gewerbe' && (!annualGrossRent || !operatingCosts || !commercialUseType)) {
      return res.status(400).json({ error: 'Pflichtfelder für Gewerbeimmobilie fehlen' });
    }
    if (!dsgvoAccepted) {
      return res.status(400).json({ error: 'Datenschutzerklärung muss akzeptiert werden' });
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
      numberOfUnits: parseInt(numberOfUnits, 10) || 0,
      annualGrossRent: parseFloat(annualGrossRent) || 0,
      operatingCosts: parseFloat(operatingCosts) || 0,
      vacancyRate: parseFloat(vacancyRate) || 0,
      usableArea: parseInt(usableArea, 10) || 0,
      commercialUseType,
      constructionYear: parseInt(constructionYear, 10) || 2000,
      buildingMaterial,
      valueAddedFeatures: Array.isArray(valueAddedFeatures) ? valueAddedFeatures : [],
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
      dsgvoAccepted,
    };

    // Sachwertverfahren (primäres Verfahren für Einfamilienhäuser und Wohnungen)
    const Bodenwert = propertyData.plotSize * propertyData.soilValue;
    let Normalherstellungskosten = 0;
    if (propertyType === 'gewerbe') {
      Normalherstellungskosten = propertyData.usableArea * 1200; // Gewerbe: 1200 €/m² angenommen
    } else {
      Normalherstellungskosten = propertyData.livingArea * 1550.80; // Einfamilienhaus/Wohnung: 1550,80 €/m²
    }
    const Gesamtnutzungsdauer = propertyType === 'einfamilienhaus' || propertyType === 'mehrfamilienhaus' ? 80 : propertyType === 'wohnung' ? 60 : 50; // Gewerbe: 50 Jahre
    const Alter = 2025 - propertyData.constructionYear;
    const Modernisierungsfaktor = propertyData.lastModernization
      ? (2025 - propertyData.lastModernization) <= 10
        ? 0.1
        : 0
      : 0;
    const WertminderungProJahr = (propertyData.constructionYear >= 1900 && propertyData.constructionYear <= 1990) ? 0.015 : 0.0125; // 1,5 % für ältere Häuser, 1,25 % für neuere
    const Alterswertminderung = (Alter * WertminderungProJahr) * (1 - Modernisierungsfaktor);
    let SachwertGebäude = Normalherstellungskosten * (1 - Alterswertminderung);

    // Bausubstanz-Faktor
    let BausubstanzFaktor = 1.0;
    if (propertyData.buildingMaterial === 'gemauert') {
      BausubstanzFaktor = 1.1; // +10 %
    } else if (propertyData.buildingMaterial === 'holzhaus') {
      BausubstanzFaktor = 0.9; // -10 %
    }
    SachwertGebäude *= BausubstanzFaktor;

    // Zustandsanpassung
    let ZustandsFaktor = 1.0;
    if (propertyData.sanitaryCondition === 'renovierungsbedürftig') {
      ZustandsFaktor = 0.9; // -10 % bei Renovierungsbedarf
    } else if (propertyData.sanitaryCondition === 'modern') {
      ZustandsFaktor = 1.05; // +5 % bei modernem Zustand
    }
    SachwertGebäude *= ZustandsFaktor;

    // Dachart-Anpassung
    let DachartFaktor = 1.0;
    if (propertyData.roofing === 'schraegesFlachdach') {
      DachartFaktor = 1.02; // +2 % für modernes schräges Flachdach
    }
    SachwertGebäude *= DachartFaktor;

    // Aufwertungskriterien für Einfamilienhäuser
    let AufwertungsWert = 0;
    if (propertyType === 'einfamilienhaus') {
      if (propertyData.valueAddedFeatures.includes('pvAnlage')) AufwertungsWert += 15000;
      if (propertyData.valueAddedFeatures.includes('pvSpeicher')) AufwertungsWert += 10000;
      if (propertyData.valueAddedFeatures.includes('smartHome')) AufwertungsWert += 10000;
      if (propertyData.valueAddedFeatures.includes('elektrischesGaragentor')) AufwertungsWert += 5000;
      if (propertyData.valueAddedFeatures.includes('umzaeuntesGrundstueck')) AufwertungsWert += 5000;
    }

    const SachwertGarage = propertyData.garage !== 'nein' ? propertyData.garageArea * 665.50 : 0;
    const AußenanlagenWert = propertyType !== 'gewerbe' ? propertyData.outdoorFacilities.length * 10000 : 0;
    const VorläufigerSachwert = SachwertGebäude + SachwertGarage + AußenanlagenWert + Bodenwert + AufwertungsWert;
    const Marktanpassungsfaktor = (propertyData.constructionYear > 1990) ? 1.15 : 1.09; // +15 % für neuere Häuser, +9 % für ältere
    const Marktanpassung = VorläufigerSachwert * Marktanpassungsfaktor;
    const AbschlagWegerecht = propertyData.encumbrances === 'ja' ? 1387.5 : 0;
    const VerkehrswertSachwert = Marktanpassung - AbschlagWegerecht;

    // Ertragswertverfahren (wichtiger für Mehrfamilienhäuser und Gewerbe)
    let Jahresrohertrag = 0;
    if (propertyType === 'mehrfamilienhaus' || propertyType === 'gewerbe') {
      Jahresrohertrag = propertyData.annualGrossRent;
    } else {
      Jahresrohertrag = propertyData.livingArea * propertyData.marketRent * 12;
    }
    const Bewirtschaftungskosten = propertyType === 'mehrfamilienhaus' || propertyType === 'gewerbe' ? propertyData.operatingCosts : 3279;
    const Mietausfall = propertyType === 'mehrfamilienhaus' ? (Jahresrohertrag * (propertyData.vacancyRate / 100)) : 0;
    const Jahresreinertrag = Jahresrohertrag - Bewirtschaftungskosten - Mietausfall;
    const Bodenwertverzinsung = Bodenwert * (propertyData.capitalizationRate / 100);
    const ReinertragGebäude = Jahresreinertrag - Bodenwertverzinsung;
    const Vervielfältiger = propertyType === 'gewerbe' ? 20 : 28.52; // Gewerbe: niedrigerer Vervielfältiger
    const ErtragswertGebäude = ReinertragGebäude * Vervielfältiger;
    const VerkehrswertErtrag = ErtragswertGebäude + Bodenwert - AbschlagWegerecht;

    // Finaler Verkehrswert
    let Verkehrswert;
    if (propertyType === 'mehrfamilienhaus' || propertyType === 'gewerbe') {
      Verkehrswert = Math.round(VerkehrswertErtrag / 1000) * 1000; // Ertragswertverfahren bevorzugt
    } else {
      Verkehrswert = Math.round(VerkehrswertSachwert / 1000) * 1000; // Sachwertverfahren für Einfamilienhäuser/Wohnungen
    }

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
    let Zustand = propertyData.sanitaryCondition || 'Nicht angegeben';
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
    if ((propertyData.livingArea > 150 || propertyData.usableArea > 200) && priceIncreaseFactors.length < 3) {
      priceIncreaseFactors.push(`Große ${propertyType === 'gewerbe' ? 'Nutzfläche' : 'Wohnfläche'} über ${propertyType === 'gewerbe' ? '200' : '150'} m²`);
    }
    if (propertyData.outdoorFacilities?.length > 0 && priceIncreaseFactors.length < 3) {
      priceIncreaseFactors.push(`Zusätzliche Außenanlagen (${propertyData.outdoorFacilities.join(', ')})`);
    }
    if (propertyData.valueAddedFeatures?.length > 0 && priceIncreaseFactors.length < 3) {
      priceIncreaseFactors.push(`Zusätzliche Ausstattung (${propertyData.valueAddedFeatures.join(', ')})`);
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
