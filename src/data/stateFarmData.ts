export type StateFarmData = {
  state: string;
  stateHi: string;
  region: string;
  regionHi: string;
  income: number | null;
  land: number;
  holdings: number | null;
  crops: string[];
  cropsHi: string[];
  specialty: string;
  specialtyHi: string;
  image: string;
};

const farmImages = {
  field: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=900&q=85',
  harvest: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=900&q=85',
  rice: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=900&q=85',
  orchard: 'https://images.unsplash.com/photo-1499529112087-3cb3b73cec95?auto=format&fit=crop&w=900&q=85',
};

export const stateFarmData: StateFarmData[] = [
  { state: 'Andhra Pradesh', stateHi: 'आंध्र प्रदेश', region: 'South', regionHi: 'दक्षिण', income: 10480, land: 0.94, holdings: 8.52, crops: ['Rice', 'Cotton', 'Chillies', 'Groundnut'], cropsHi: ['चावल', 'कपास', 'मिर्च', 'मूंगफली'], specialty: 'Rice, chillies and coastal farming', specialtyHi: 'चावल, मिर्च और तटीय खेती', image: farmImages.harvest },
  { state: 'Arunachal Pradesh', stateHi: 'अरुणाचल प्रदेश', region: 'North-East', regionHi: 'उत्तर-पूर्व', income: 19225, land: 3.35, holdings: null, crops: ['Rice', 'Maize', 'Millet'], cropsHi: ['चावल', 'मक्का', 'मिलेट'], specialty: 'Mountain farming and millets', specialtyHi: 'पहाड़ी खेती और मिलेट', image: farmImages.field },
  { state: 'Assam', stateHi: 'असम', region: 'North-East', regionHi: 'उत्तर-पूर्व', income: 10675, land: 1.09, holdings: null, crops: ['Tea', 'Rice', 'Jute'], cropsHi: ['चाय', 'चावल', 'जूट'], specialty: 'Tea gardens and floodplain rice', specialtyHi: 'चाय बागान और बाढ़ क्षेत्र का चावल', image: farmImages.field },
  { state: 'Bihar', stateHi: 'बिहार', region: 'East', regionHi: 'पूर्व', income: 7542, land: 0.39, holdings: 16.41, crops: ['Rice', 'Wheat', 'Sugarcane'], cropsHi: ['चावल', 'गेहूं', 'गन्ना'], specialty: 'Rice-wheat farming on small holdings', specialtyHi: 'छोटी जोत पर चावल-गेहूं की खेती', image: farmImages.harvest },
  { state: 'Chhattisgarh', stateHi: 'छत्तीसगढ़', region: 'Central', regionHi: 'मध्य', income: 9677, land: 1.25, holdings: null, crops: ['Rice', 'Maize'], cropsHi: ['चावल', 'मक्का'], specialty: 'Rice bowl and rainfed agriculture', specialtyHi: 'धान का कटोरा और वर्षा आधारित खेती', image: farmImages.rice },
  { state: 'Goa', stateHi: 'गोवा', region: 'West', regionHi: 'पश्चिम', income: null, land: 0.81, holdings: null, crops: ['Rice', 'Coconut', 'Cashew'], cropsHi: ['चावल', 'नारियल', 'काजू'], specialty: 'Coconut, cashew and coastal orchards', specialtyHi: 'नारियल, काजू और तटीय बागान', image: farmImages.orchard },
  { state: 'Gujarat', stateHi: 'गुजरात', region: 'West', regionHi: 'पश्चिम', income: 12631, land: 1.88, holdings: null, crops: ['Cotton', 'Groundnut', 'Tobacco'], cropsHi: ['कपास', 'मूंगफली', 'तंबाकू'], specialty: 'Cotton and groundnut belt', specialtyHi: 'कपास और मूंगफली क्षेत्र', image: farmImages.field },
  { state: 'Haryana', stateHi: 'हरियाणा', region: 'North', regionHi: 'उत्तर', income: 22841, land: 2.22, holdings: null, crops: ['Wheat', 'Rice', 'Mustard'], cropsHi: ['गेहूं', 'चावल', 'सरसों'], specialty: 'Irrigated wheat-rice productivity', specialtyHi: 'सिंचित गेहूं-चावल उत्पादकता', image: farmImages.harvest },
  { state: 'Himachal Pradesh', stateHi: 'हिमाचल प्रदेश', region: 'North', regionHi: 'उत्तर', income: 12153, land: 0.95, holdings: null, crops: ['Apples', 'Wheat', 'Maize'], cropsHi: ['सेब', 'गेहूं', 'मक्का'], specialty: 'Apple orchards and hill crops', specialtyHi: 'सेब के बागान और पहाड़ी फसलें', image: farmImages.orchard },
  { state: 'Jharkhand', stateHi: 'झारखंड', region: 'East', regionHi: 'पूर्व', income: 4895, land: 1.17, holdings: null, crops: ['Rice', 'Maize', 'Pulses'], cropsHi: ['चावल', 'मक्का', 'दालें'], specialty: 'Rice, pulses and forest-edge farming', specialtyHi: 'चावल, दालें और वन क्षेत्र की खेती', image: farmImages.rice },
  { state: 'Karnataka', stateHi: 'कर्नाटक', region: 'South', regionHi: 'दक्षिण', income: 13441, land: 1.35, holdings: 8.68, crops: ['Ragi', 'Coffee', 'Sugarcane'], cropsHi: ['रागी', 'कॉफी', 'गन्ना'], specialty: 'Ragi and coffee landscapes', specialtyHi: 'रागी और कॉफी क्षेत्र', image: farmImages.field },
  { state: 'Kerala', stateHi: 'केरल', region: 'South', regionHi: 'दक्षिण', income: 17915, land: 0.18, holdings: 7.58, crops: ['Rubber', 'Coconut', 'Pepper'], cropsHi: ['रबड़', 'नारियल', 'काली मिर्च'], specialty: 'Plantation and spice farming', specialtyHi: 'प्लांटेशन और मसाला खेती', image: farmImages.orchard },
  { state: 'Madhya Pradesh', stateHi: 'मध्य प्रदेश', region: 'Central', regionHi: 'मध्य', income: 8339, land: 1.57, holdings: 10, crops: ['Soybean', 'Wheat', 'Gram'], cropsHi: ['सोयाबीन', 'गेहूं', 'चना'], specialty: 'Soybean, wheat and pulse rotation', specialtyHi: 'सोयाबीन, गेहूं और दलहन चक्र', image: farmImages.harvest },
  { state: 'Maharashtra', stateHi: 'महाराष्ट्र', region: 'West', regionHi: 'पश्चिम', income: 11492, land: 1.35, holdings: 15.29, crops: ['Cotton', 'Sugarcane', 'Onion'], cropsHi: ['कपास', 'गन्ना', 'प्याज'], specialty: 'Cotton, sugarcane and onion markets', specialtyHi: 'कपास, गन्ना और प्याज बाजार', image: farmImages.harvest },
  { state: 'Manipur', stateHi: 'मणिपुर', region: 'North-East', regionHi: 'उत्तर-पूर्व', income: 11227, land: 1.14, holdings: null, crops: ['Rice', 'Maize'], cropsHi: ['चावल', 'मक्का'], specialty: 'Valley rice and hill agriculture', specialtyHi: 'घाटी का चावल और पहाड़ी खेती', image: farmImages.rice },
  { state: 'Meghalaya', stateHi: 'मेघालय', region: 'North-East', regionHi: 'उत्तर-पूर्व', income: 29348, land: 1.29, holdings: null, crops: ['Rice', 'Potato', 'Ginger'], cropsHi: ['चावल', 'आलू', 'अदरक'], specialty: 'Potato and ginger in high rainfall hills', specialtyHi: 'अधिक वर्षा वाली पहाड़ियों में आलू और अदरक', image: farmImages.field },
  { state: 'Mizoram', stateHi: 'मिज़ोरम', region: 'North-East', regionHi: 'उत्तर-पूर्व', income: 17964, land: 1.25, holdings: null, crops: ['Rice', 'Ginger'], cropsHi: ['चावल', 'अदरक'], specialty: 'Terraced hill farming and ginger', specialtyHi: 'सीढ़ीदार पहाड़ी खेती और अदरक', image: farmImages.rice },
  { state: 'Nagaland', stateHi: 'नागालैंड', region: 'North-East', regionHi: 'उत्तर-पूर्व', income: 9877, land: 5.06, holdings: null, crops: ['Rice', 'Millets'], cropsHi: ['चावल', 'मिलेट'], specialty: 'Large hill holdings and millets', specialtyHi: 'बड़ी पहाड़ी जोत और मिलेट', image: farmImages.field },
  { state: 'Odisha', stateHi: 'ओडिशा', region: 'East', regionHi: 'पूर्व', income: 5112, land: 0.95, holdings: null, crops: ['Rice', 'Pulses', 'Jute'], cropsHi: ['चावल', 'दालें', 'जूट'], specialty: 'Rice and pulse farming across coastal plains', specialtyHi: 'तटीय मैदानों में चावल और दलहन', image: farmImages.rice },
  { state: 'Punjab', stateHi: 'पंजाब', region: 'North', regionHi: 'उत्तर', income: 26701, land: 3.62, holdings: null, crops: ['Wheat', 'Rice', 'Cotton'], cropsHi: ['गेहूं', 'चावल', 'कपास'], specialty: 'High-productivity wheat-rice systems', specialtyHi: 'उच्च उत्पादकता वाली गेहूं-चावल प्रणाली', image: farmImages.harvest },
  { state: 'Rajasthan', stateHi: 'राजस्थान', region: 'North', regionHi: 'उत्तर', income: 12520, land: 2.73, holdings: 7.66, crops: ['Bajra', 'Mustard', 'Wheat'], cropsHi: ['बाजरा', 'सरसों', 'गेहूं'], specialty: 'Dryland bajra and mustard farming', specialtyHi: 'शुष्क क्षेत्र में बाजरा और सरसों', image: farmImages.field },
  { state: 'Sikkim', stateHi: 'सिक्किम', region: 'North-East', regionHi: 'उत्तर-पूर्व', income: 12447, land: 1.13, holdings: null, crops: ['Maize', 'Cardamom'], cropsHi: ['मक्का', 'इलायची'], specialty: 'Organic mountain crops and cardamom', specialtyHi: 'जैविक पहाड़ी फसलें और इलायची', image: farmImages.orchard },
  { state: 'Tamil Nadu', stateHi: 'तमिलनाडु', region: 'South', regionHi: 'दक्षिण', income: 11924, land: 0.75, holdings: 7.94, crops: ['Rice', 'Sugarcane', 'Banana'], cropsHi: ['चावल', 'गन्ना', 'केला'], specialty: 'Rice, sugarcane and banana systems', specialtyHi: 'चावल, गन्ना और केला प्रणाली', image: farmImages.rice },
  { state: 'Telangana', stateHi: 'तेलंगाना', region: 'South', regionHi: 'दक्षिण', income: 9403, land: 1, holdings: null, crops: ['Rice', 'Cotton', 'Turmeric'], cropsHi: ['चावल', 'कपास', 'हल्दी'], specialty: 'Cotton, turmeric and irrigated rice', specialtyHi: 'कपास, हल्दी और सिंचित चावल', image: farmImages.harvest },
  { state: 'Tripura', stateHi: 'त्रिपुरा', region: 'North-East', regionHi: 'उत्तर-पूर्व', income: 9918, land: 0.49, holdings: null, crops: ['Rice', 'Jute', 'Tea'], cropsHi: ['चावल', 'जूट', 'चाय'], specialty: 'Rice, tea and jute landscapes', specialtyHi: 'चावल, चाय और जूट क्षेत्र', image: farmImages.field },
  { state: 'Uttar Pradesh', stateHi: 'उत्तर प्रदेश', region: 'North', regionHi: 'उत्तर', income: 8061, land: 0.73, holdings: 23.82, crops: ['Wheat', 'Sugarcane', 'Rice'], cropsHi: ['गेहूं', 'गन्ना', 'चावल'], specialty: 'India’s largest operational holdings base', specialtyHi: 'भारत का सबसे बड़ा जोत आधार', image: farmImages.harvest },
  { state: 'Uttarakhand', stateHi: 'उत्तराखंड', region: 'North', regionHi: 'उत्तर', income: 13552, land: 0.95, holdings: null, crops: ['Rice', 'Wheat'], cropsHi: ['चावल', 'गेहूं'], specialty: 'Terrace farming in Himalayan valleys', specialtyHi: 'हिमालयी घाटियों में सीढ़ीदार खेती', image: farmImages.field },
  { state: 'West Bengal', stateHi: 'पश्चिम बंगाल', region: 'East', regionHi: 'पूर्व', income: 6762, land: 0.76, holdings: null, crops: ['Rice', 'Jute', 'Tea'], cropsHi: ['चावल', 'जूट', 'चाय'], specialty: 'Rice, jute and tea production', specialtyHi: 'चावल, जूट और चाय उत्पादन', image: farmImages.rice },
];
