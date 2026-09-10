export type StateAgriProfile = {
  state: string;
  stateHi: string;
  agroClimaticZone: string;
  agroClimaticZoneHi: string;
  rainfall: string;
  rainfallHi: string;
  soil: string;
  soilHi: string;
  kharifCrops: string[];
  kharifCropsHi: string[];
  rabiCrops: string[];
  rabiCropsHi: string[];
  zaidCrops: string[];
  zaidCropsHi: string[];
  irrigation: string;
  irrigationHi: string;
  groundwater: string;
  groundwaterHi: string;
  tenure: string;
  tenureHi: string;
  challenges: string[];
  challengesHi: string[];
  schemes: string[];
  schemesHi: string[];
  alliedActivities: string;
  alliedActivitiesHi: string;
  kvk: string;
  kvkHi: string;
  university: string;
  universityHi: string;
  evidence: string;
  evidenceHi: string;
  sources: string[];
};

// First reviewable profile. Unknown or non-comparable fields are intentionally labelled.
import { stateFarmData } from '@/data/stateFarmData';

export const stateAgriProfiles: Record<string, StateAgriProfile> = {
  'Uttar Pradesh': {
    state: 'Uttar Pradesh',
    stateHi: 'उत्तर प्रदेश',
    agroClimaticZone: 'Gangetic alluvial plains and Bundelkhand plateau; official sub-zone boundaries should be checked against the state agriculture classification.',
    agroClimaticZoneHi: 'गंगा के जलोढ़ मैदान और बुंदेलखंड पठार; आधिकारिक उप-क्षेत्र सीमाओं को राज्य कृषि वर्गीकरण से जांचना होगा।',
    rainfall: 'Not independently verified here; use IMD normal rainfall data for the selected district before making a farm decision.',
    rainfallHi: 'इस प्रोफाइल में स्वतंत्र रूप से सत्यापित नहीं; कृषि निर्णय से पहले चुने जिले के लिए IMD की सामान्य वर्षा रिपोर्ट देखें।',
    soil: 'Alluvial soils are common across the Gangetic plains; Bundelkhand has distinct soil and moisture constraints that need district-level testing.',
    soilHi: 'गंगा के मैदानों में जलोढ़ मिट्टी सामान्य है; बुंदेलखंड में मिट्टी और नमी की अलग चुनौतियां हैं, इसलिए जिला-स्तर की जांच जरूरी है।',
    kharifCrops: ['Rice', 'Maize', 'Pigeon pea', 'Millets'],
    kharifCropsHi: ['धान', 'मक्का', 'अरहर', 'मिलेट'],
    rabiCrops: ['Wheat', 'Mustard', 'Chickpea', 'Lentil'],
    rabiCropsHi: ['गेहूं', 'सरसों', 'चना', 'मसूर'],
    zaidCrops: ['Summer vegetables', 'Moong where locally suitable'],
    zaidCropsHi: ['ग्रीष्मकालीन सब्जियां', 'स्थानीय अनुकूलता होने पर मूंग'],
    irrigation: 'District-level irrigation share and source mix are not independently verified in this profile. Canal and groundwater irrigation are both important in the state; verify locally.',
    irrigationHi: 'जिला-स्तर पर सिंचाई प्रतिशत और स्रोत मिश्रण इस प्रोफाइल में स्वतंत्र रूप से सत्यापित नहीं हैं। राज्य में नहर और भूजल दोनों महत्वपूर्ण हैं; स्थानीय आंकड़े जांचें।',
    groundwater: 'Not independently verified for the state as a single category; CGWB assessment must be checked by block or assessment unit.',
    groundwaterHi: 'पूरे राज्य के लिए एक ही श्रेणी स्वतंत्र रूप से सत्यापित नहीं; CGWB का आकलन ब्लॉक या assessment unit के अनुसार देखें।',
    tenure: 'State-wide owner-cultivator versus leased-land split is not independently verified here; do not infer it from holding counts.',
    tenureHi: 'राज्य-स्तरीय मालिक-किसान और पट्टे की भूमि का अनुपात इस प्रोफाइल में स्वतंत्र रूप से सत्यापित नहीं; जोत संख्या से अनुमान न लगाएं।',
    challenges: ['Small and fragmented holdings in many districts', 'Water stress and drought exposure in Bundelkhand', 'Flood and waterlogging risk in parts of the Gangetic and eastern districts', 'Storage, grading, and reliable market access vary by district'],
    challengesHi: ['कई जिलों में छोटी और बिखरी हुई जोत', 'बुंदेलखंड में पानी की कमी और सूखे का जोखिम', 'गंगा के मैदानी और पूर्वी जिलों के कुछ हिस्सों में बाढ़ और जलभराव', 'भंडारण, grading और भरोसेमंद बाजार सुविधा जिले के अनुसार बदलती है'],
    schemes: ['PM-KISAN', 'PMFBY', 'Kisan Credit Card', 'Soil Health Card Scheme', 'PM Krishi Sinchai Yojana'],
    schemesHi: ['PM-KISAN', 'PMFBY', 'किसान क्रेडिट कार्ड', 'Soil Health Card योजना', 'प्रधानमंत्री कृषि सिंचाई योजना'],
    alliedActivities: 'Dairy, livestock, poultry, and food processing are relevant allied activities; district-specific scale and income contribution require official verification.',
    alliedActivitiesHi: 'डेयरी, पशुपालन, poultry और food processing महत्वपूर्ण संबद्ध गतिविधियां हैं; जिला-स्तरीय योगदान के लिए आधिकारिक सत्यापन जरूरी है।',
    kvk: 'Not independently verified in this build. Confirm count and district locations through the official ICAR KVK directory.',
    kvkHi: 'इस बिल्ड में स्वतंत्र रूप से सत्यापित नहीं। आधिकारिक ICAR KVK directory से संख्या और जिलों की पुष्टि करें।',
    university: 'Acharya Narendra Deva University of Agriculture and Technology; other state agricultural universities should be listed from the official state/ICAR directory.',
    universityHi: 'आचार्य नरेंद्र देव कृषि एवं प्रौद्योगिकी विश्वविद्यालय; अन्य राज्य कृषि विश्वविद्यालयों की सूची आधिकारिक राज्य/ICAR directory से लें।',
    evidence: 'Verified in the supplied dataset: average monthly agricultural-household income ₹8,061 (NSS Report 587, 2018-19), average holding 0.73 ha and 23.82 million operational holdings (Agriculture Census 2015-16). Other fields above require source-by-source review before publication.',
    evidenceHi: 'दिए गए dataset में सत्यापित: औसत मासिक कृषि-परिवार आय ₹8,061 (NSS Report 587, 2018-19), औसत जोत 0.73 हेक्टेयर और 23.82 मिलियन operational holdings (Agriculture Census 2015-16)। बाकी fields को प्रकाशित करने से पहले स्रोत-वार जांचना होगा।',
    sources: [
      'NSS Report No. 587, Situation Assessment Survey of Agricultural Households, 77th Round (2019)',
      'Agriculture Census 2015-16, Ministry of Agriculture & Farmers Welfare',
      'IMD climate normals: https://mausam.imd.gov.in/',
      'CGWB groundwater assessment: https://cgwb.gov.in/',
      'ICAR KVK directory: https://icar.gov.in/',
      'Uttar Pradesh Agriculture Department: https://agriculture.up.gov.in/',
    ],
  },
};

export const allStateAgriProfiles: Record<string, StateAgriProfile> = Object.fromEntries(
  stateFarmData.map((state) => {
    const existing = stateAgriProfiles[state.state];
    if (existing) return [state.state, existing];

    const crops = state.crops.slice(0, 3);
    const cropsHi = state.cropsHi.slice(0, 3);
    const pendingEnglish = `Not independently verified for ${state.state}; add an official state or district source before publication.`;
    const pendingHindi = `${state.stateHi} के लिए स्वतंत्र रूप से सत्यापित नहीं; प्रकाशित करने से पहले आधिकारिक राज्य या जिला स्रोत जोड़ें।`;

    return [state.state, {
      state: state.state,
      stateHi: state.stateHi,
      agroClimaticZone: pendingEnglish,
      agroClimaticZoneHi: pendingHindi,
      rainfall: pendingEnglish,
      rainfallHi: pendingHindi,
      soil: pendingEnglish,
      soilHi: pendingHindi,
      kharifCrops: crops,
      kharifCropsHi: cropsHi,
      rabiCrops: [],
      rabiCropsHi: [],
      zaidCrops: [],
      zaidCropsHi: [],
      irrigation: pendingEnglish,
      irrigationHi: pendingHindi,
      groundwater: pendingEnglish,
      groundwaterHi: pendingHindi,
      tenure: pendingEnglish,
      tenureHi: pendingHindi,
      challenges: [pendingEnglish],
      challengesHi: [pendingHindi],
      schemes: ['PM-KISAN', 'PMFBY', 'Kisan Credit Card', 'Soil Health Card Scheme'],
      schemesHi: ['PM-KISAN', 'PMFBY', 'किसान क्रेडिट कार्ड', 'Soil Health Card योजना'],
      alliedActivities: pendingEnglish,
      alliedActivitiesHi: pendingHindi,
      kvk: pendingEnglish,
      kvkHi: pendingHindi,
      university: pendingEnglish,
      universityHi: pendingHindi,
      evidence: `Verified in the supplied state dataset: average monthly income ${state.income ? `₹${state.income.toLocaleString('en-IN')}` : 'not listed'}, average holding ${state.land} ha, and operational holdings ${state.holdings ? `${state.holdings} million` : 'not listed'}. The deep research fields remain pending official source review.`,
      evidenceHi: `दिए गए state dataset में सत्यापित: औसत मासिक आय ${state.income ? `₹${state.income.toLocaleString('en-IN')}` : 'उपलब्ध नहीं'}, औसत जोत ${state.land} हेक्टेयर और operational holdings ${state.holdings ? `${state.holdings} मिलियन` : 'उपलब्ध नहीं'}। गहन शोध fields आधिकारिक स्रोत समीक्षा के लिए लंबित हैं।`,
      sources: ['Supplied state dataset: NSS Report No. 587 and Agriculture Census 2015-16', 'Official state agriculture department source required', 'Official IMD, CGWB, ICAR, NABARD, or myscheme.gov.in source required'],
    } satisfies StateAgriProfile];
  }),
);
