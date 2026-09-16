import { 
  Crop, 
  CropRecommendationResult, 
  SoilAdviceResult, 
  FertilizerAdvice 
} from '@/types';
import { MOCK_CROPS } from './mock-data';

const GENERAL_DISCLAIMER = {
  en: "This is general guidance. For exact fertilizer doses, consult a soil test report or local agriculture officer.",
  hi: "यह सामान्य मार्गदर्शन है। खाद की सटीक मात्रा के लिए मिट्टी परीक्षण रिपोर्ट या स्थानीय कृषि अधिकारी से संपर्क करें।"
};

// 1. Rule-Based Crop Recommendation Engine
export function recommendCrops(
  soilType: string,
  irrigationType: string,
  season: string
): CropRecommendationResult[] {
  const allCrops = MOCK_CROPS;

  return allCrops.map(crop => {
    let score = 50; // base score
    const enReasons: string[] = [];
    const hiReasons: string[] = [];

    // Soil Match
    if (crop.suitable_soils.includes(soilType)) {
      score += 25;
      enReasons.push(`Soil type '${soilType}' is highly suitable for ${crop.name}.`);
      hiReasons.push(`मिट्टी का प्रकार '${soilType}' ${crop.name} की खेती के लिए बहुत अनुकूल है।`);
    } else {
      score -= 15;
      enReasons.push(`Soil texture '${soilType}' requires extra organic matter for ${crop.name}.`);
      hiReasons.push(`मिट्टी '${soilType}' में ${crop.name} के लिए अतिरिक्त जैविक खाद की आवश्यकता है।`);
    }

    // Season Match
    if (crop.season === season || crop.season === 'All-season') {
      score += 20;
      enReasons.push(`Optimal sowing season (${season}).`);
      hiReasons.push(`बुआई के लिए उत्तम मौसम (${season})।`);
    } else {
      score -= 20;
      enReasons.push(`Off-season crop; higher risk of low germination.`);
      hiReasons.push(`बेमौसम की फसल; कम अंकुरण का जोखिम।`);
    }

    // Irrigation Match
    const highWaterIrrigation = ['Borewell', 'Canal', 'Drip', 'Sprinkler'];
    if (crop.irrigation_need === 'High' && highWaterIrrigation.includes(irrigationType)) {
      score += 15;
      enReasons.push(`Water availability via ${irrigationType} supports high crop water demand.`);
      hiReasons.push(`${irrigationType} द्वारा जल उपलब्धता उच्च जल मांग को पूरा करती है।`);
    } else if (crop.irrigation_need === 'Low') {
      score += 10;
      enReasons.push(`Low water requirement fits your irrigation setup.`);
      hiReasons.push(`कम पानी की आवश्यकता आपकी सिंचाई व्यवस्था के अनुकूल है।`);
    }

    // Normalize score
    score = Math.min(100, Math.max(10, score));
    const suitability: 'High' | 'Moderate' | 'Low' = score >= 75 ? 'High' : score >= 50 ? 'Moderate' : 'Low';

    return {
      crop,
      matchScore: score,
      suitability,
      reasons: {
        en: enReasons,
        hi: hiReasons
      }
    };
  }).sort((a, b) => b.matchScore - a.matchScore);
}

// 2. Rule-Based Soil Health Evaluation
export function evaluateSoilHealth(
  ph: number,
  nitrogen: number,
  phosphorus: number,
  potassium: number
): SoilAdviceResult {
  let phStatusEn = "Optimal pH balance (6.0 - 7.5)";
  let phStatusHi = "मिट्टी का सही pH संतुलन (6.0 - 7.5)";

  if (ph < 6.0) {
    phStatusEn = "Acidic Soil (pH < 6.0)";
    phStatusHi = "अम्लीय मिट्टी (pH < 6.0)";
  } else if (ph > 7.5) {
    phStatusEn = "Alkaline / Saline Soil (pH > 7.5)";
    phStatusHi = "क्षारीय मिट्टी (pH > 7.5)";
  }

  const getLevel = (val: number, lowThresh: number, optThresh: number) => {
    if (val < lowThresh) return 'Low';
    if (val < optThresh) return 'Medium';
    return 'Optimal';
  };

  const nLevel = getLevel(nitrogen, 250, 400);
  const pLevel = getLevel(phosphorus, 15, 30);
  const kLevel = getLevel(potassium, 120, 250);

  const enRecs: string[] = [];
  const hiRecs: string[] = [];

  if (ph < 6.0) {
    enRecs.push("Apply agricultural lime or wood ash at 250 kg/acre to neutralize soil acidity.");
    hiRecs.push("मिट्टी की अम्लता दूर करने के लिए 250 किग्रा/एकड़ की दर से कृषि चूना मिलाएं।");
  } else if (ph > 7.5) {
    enRecs.push("Apply Gypsum (200 kg/acre) and incorporate green manure (Daincha) to reduce alkalinity.");
    hiRecs.push("क्षारीयता कम करने के लिए जिप्सम (200 किग्रा/एकड़) और हरी खाद (ढैंचा) का प्रयोग करें।");
  }

  if (nLevel === 'Low') {
    enRecs.push("Nitrogen deficient. Apply Neem-coated Urea in split doses or apply Farm Yard Manure (FYM) @ 5 tonnes/acre.");
    hiRecs.push("नाइट्रोजन की कमी है। नीम लेपित यूरिया की स्प्लिट डोज दें या गोबर की खाद (5 टन/एकड़) डालें।");
  }

  if (pLevel === 'Low') {
    enRecs.push("Phosphorus low. Apply Single Super Phosphate (SSP) or DAP near the root zone during sowing.");
    hiRecs.push("फास्फोरस कम है। बुवाई के समय सिंगल सुपर फास्फेट (SSP) या डीएपी का प्रयोग करें।");
  }

  if (kLevel === 'Low') {
    enRecs.push("Potassium deficient. Apply Muriate of Potash (MOP) to improve stem strength and disease resistance.");
    hiRecs.push("पोटाश की कमी है। तने की मजबूती और रोग प्रतिरोधक क्षमता बढ़ाने के लिए MOP डालें।");
  }

  if (enRecs.length === 0) {
    enRecs.push("Soil nutrient balance is good! Maintain health with annual compost addition.");
    hiRecs.push("मिट्टी में पोषक तत्वों का संतुलन अच्छा है! जैविक कंपोस्ट का प्रयोग जारी रखें।");
  }

  return {
    phStatus: { en: phStatusEn, hi: phStatusHi },
    nutrientStatus: {
      nitrogen: {
        level: nLevel as any,
        en: `Nitrogen: ${nitrogen} kg/ha (${nLevel})`,
        hi: `नाइट्रोजन: ${nitrogen} किग्रा/हेक्टेयर (${nLevel === 'Low' ? 'कम' : nLevel === 'Medium' ? 'मध्यम' : 'उत्तम'})`
      },
      phosphorus: {
        level: pLevel as any,
        en: `Phosphorus: ${phosphorus} kg/ha (${pLevel})`,
        hi: `फास्फोरस: ${phosphorus} किग्रा/हेक्टेयर (${pLevel === 'Low' ? 'कम' : pLevel === 'Medium' ? 'मध्यम' : 'उत्तम'})`
      },
      potassium: {
        level: kLevel as any,
        en: `Potassium: ${potassium} kg/ha (${kLevel})`,
        hi: `पोटाश: ${potassium} किग्रा/हेक्टेयर (${kLevel === 'Low' ? 'कम' : kLevel === 'Medium' ? 'मध्यम' : 'उत्तम'})`
      }
    },
    recommendations: {
      en: enRecs,
      hi: hiRecs
    }
  };
}

// 3. Rule-Based Stage-Wise Fertilizer Guidance Engine
export function getFertilizerAdvice(cropName: string, stage: string): FertilizerAdvice {
  let nDosage = "N: 40 kg/acre (General Range)";
  let pDosage = "P: 20 kg/acre (General Range)";
  let kDosage = "K: 15 kg/acre (General Range)";
  
  let generalEn = `General stage-specific nutrition advice for ${cropName} during ${stage} stage.`;
  let generalHi = `${cropName} की ${stage} अवस्था के लिए सामान्य पोषण मार्गदर्शन।`;

  if (stage === 'Sowing') {
    generalEn = "Basal application: Apply full dose of Phosphorus & Potassium along with 1/3rd Nitrogen at sowing.";
    generalHi = "बुआई के समय (बेसल खुराक): फास्फोरस और पोटाश की पूरी मात्रा तथा नाइट्रोजन का 1/3 भाग बुआई के समय डालें।";
  } else if (stage === 'Vegetative') {
    generalEn = "First Top Dressing: Apply 1/3rd dose of Nitrogen (Neem Coated Urea) 25-30 days after sowing after weeding.";
    generalHi = "प्रथम टॉप ड्रेसिंग: बुआई के 25-30 दिन बाद निराई-गुड़ाई करके नाइट्रोजन (यूरिया) का 1/3 भाग छिड़कें।";
  } else if (stage === 'Flowering') {
    generalEn = "Flowering & Grain Filling: Spray Water Soluble Fertilizer NPK 13-0-45 @ 10g/litre to promote kernel weight.";
    generalHi = "फूल व बाली बनते समय: दानों की चमक व वजन बढ़ाने हेतु घुलनशील खाद NPK 13-0-45 (10 ग्राम/लीटर) का स्प्रे करें।";
  } else if (stage === 'Harvesting') {
    generalEn = "Harvesting Stage: Stop nitrogen application. Ensure soil moisture is depleted gradually prior to harvesting.";
    generalHi = "कटाई का चरण: रासायनिक खाद का प्रयोग रोकें। कटाई से 10-15 दिन पहले सिंचाई बंद करें।";
  }

  return {
    cropName,
    stage,
    generalAdvice: { en: generalEn, hi: generalHi },
    nitrogenDosage: nDosage,
    phosphorusDosage: pDosage,
    potassiumDosage: kDosage,
    organicAlternatives: {
      en: [
        "Vermi-compost @ 2 tonnes/acre",
        "Jeevamrut / Bio-fertilizer liquid application (100 Litres/acre)",
        "Azotobacter / PSB seed treatment"
      ],
      hi: [
        "वर्मी-कंपोस्ट (केंचुआ खाद) @ 2 टन/एकड़",
        "जीवामृत / बायोकल्चर घोल (100 लीटर/एकड़)",
        "एज़ोटोबैक्टर एवं पीएसबी संवर्धन"
      ]
    },
    disclaimer: GENERAL_DISCLAIMER
  };
}

// 4. Multilingual Farming Q&A Assistant Engine
export function answerAssistantQuery(question: string, language: 'en' | 'hi') {
  const qLower = question.toLowerCase();

  if (qLower.includes('rain') || qLower.includes('बारिश') || qLower.includes('मौसम') || qLower.includes('spray')) {
    return {
      answer: language === 'hi' 
        ? "कल बारिश की संभावना है। आज कीटनाशक या रासायनिक छिड़काव (spraying) से बचें और खेत की नालियों की सफाई करें।"
        : "Rain is expected tomorrow. Avoid chemical spraying today and ensure clear field drainage.",
      category: "weather"
    };
  }

  if (qLower.includes('wheat') || qLower.includes('गेहूँ') || qLower.includes('रतुआ') || qLower.includes('rust')) {
    return {
      answer: language === 'hi'
        ? "गेहूँ में पीला रतुआ (Yellow Rust) के लक्षण दिखने पर प्रोपिकोनाज़ोल (Propiconazole 25% EC) @ 1 मिली/लीटर पानी में घोलकर तुरंत स्प्रे करें।"
        : "For Yellow Rust in Wheat, spray Propiconazole 25% EC @ 1 ml per litre of water immediately upon early detection.",
      category: "disease"
    };
  }

  if (qLower.includes('rice') || qLower.includes('धान') || qLower.includes('paddy')) {
    return {
      answer: language === 'hi'
        ? "धान की फसल में तना छेदक (Stem Borer) से बचाव के लिए कारटैप हाइड्रोक्लोराइड 4G @ 7.5 किग्रा/एकड़ खेत में बालू के साथ मिलाकर डालें।"
        : "To control Stem Borer in paddy fields, broadcast Cartap Hydrochloride 4G @ 7.5 kg/acre mixed with dry sand.",
      category: "pest"
    };
  }

  if (qLower.includes('fertilizer') || qLower.includes('खाद') || qLower.includes('यूरिया') || qLower.includes('urea')) {
    return {
      answer: language === 'hi'
        ? "यूरिया का प्रयोग हमेशा सुबह या शाम के समय नमी वाले खेत में करें। अत्यधिक प्रयोग से बचें। " + GENERAL_DISCLAIMER.hi
        : "Always apply Urea during cool morning or evening hours in moist soil. Avoid over-application. " + GENERAL_DISCLAIMER.en,
      category: "fertilizer"
    };
  }

  // Fallback
  return {
    answer: language === 'hi'
      ? "कृषि मित्र परामर्श: फसल की अच्छी वृद्धि के लिए सही समय पर सिंचाई और जैविक कंपोस्ट का प्रयोग करें। " + GENERAL_DISCLAIMER.hi
      : "Agrimatter Guidance: Ensure timely irrigation and apply well-decomposed organic manure for optimal soil health. " + GENERAL_DISCLAIMER.en,
    category: "general"
  };
}
