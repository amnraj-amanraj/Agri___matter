# Agrimatter - Mobile-First Agricultural Decision-Support System

**Agrimatter** is a full-stack, mobile-first agricultural web application designed to help small and marginal farmers in India receive localized, simple farming advice based on location, weather, soil type, season, crop, and crop growth stage.

---

## 🌟 Key Features

1. **Dual Language Support (English & हिंदी)**:
   - Full English and Hindi translation dictionary with an instant header switcher.
   - Farmer-friendly terminology ("Namaste, Ramesh ji", "Kal baarish ki sambhavna hai...").

2. **Localized Weather Advisories (Open-Meteo Integration)**:
   - Real-time weather, 7-day daily forecast, hourly breakdown, and field spraying warnings.

3. **Crop Advisor**:
   - Rule-based suitability recommendations matching soil texture (Loam, Clay, Sandy, Black, Red, Alluvial), irrigation availability, and cropping season (Kharif, Rabi, Zaid).

4. **Soil Health Evaluator**:
   - Diagnostic analysis for pH levels, Nitrogen (N), Phosphorus (P), and Potassium (K) with organic amendment guidelines.

5. **Stage-Wise Fertilizer Guide**:
   - Crop growth stage advice (Sowing, Vegetative, Flowering, Harvesting) with organic alternatives and **compulsory safety disclaimers**.

6. **Kisan AI Voice & Text Assistant**:
   - Multilingual Q&A assistant with suggested queries and interactive microphone UI.

7. **Farmer Onboarding & Profile**:
   - Simple wizard to capture land size (acres), village location, irrigation type, and active crops.

8. **Admin Portal**:
   - Control master crop records, advisory rules, and system statistics.

9. **Farmer FAQ Search**:
   - Search questions across English, Hindi, answers, categories, and keywords.
   - Filter by practical topics such as soil, irrigation, pests, weather, schemes, markets, and livestock.

10. **State-Wise Agriculture Explorer**:
   - Browse state-wise produce using circular image cards and a numbered visual board.
   - View available income, land-holding, operational-holding, crop, and regional data.
   - Includes bilingual deep-profile fields and visible source/review status.

11. **Mandi Price Checker**:
   - Available at `/mandi` with state, district, and commodity filters.
   - Uses the official data.gov.in Agmarknet resource when server credentials are configured.
   - Displays min, modal, and max prices, market, variety, date, source, and cache status.
   - Never displays invented prices when the official API is unavailable.

---

## 🛠 Tech Stack

- **Frontend Framework**: Next.js (App Router, React 18)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom agricultural palette (Green, Soil Brown, Harvest Yellow, Sky Blue)
- **Icons**: Lucide React
- **Backend**: Next.js API Routes (`/api/weather`, `/api/crop-recommendations`, `/api/soil-advice`, `/api/fertilizer-advice`, `/api/assistant`)
- **Database & Auth**: Supabase PostgreSQL with Row Level Security (RLS) policies

The active application is the Next.js App Router under `src/app`. The repository also contains an older Vite-style entry point (`src/App.jsx` and `src/main.jsx`) kept for legacy reference; `npm run dev` runs Next.js, not that legacy entry point.

## 📁 Project Guide

| Location | Purpose |
| --- | --- |
| `src/app/` | Next.js pages, layouts, and server API routes |
| `src/app/api/` | Server-side route handlers for weather, advice, AI, and Mandi data |
| `src/components/` | Reusable UI, navigation, FAQ, state explorer, and farmer tools |
| `src/context/` | Authentication, language, and theme providers |
| `src/data/` | Crop, FAQ, state, and reference datasets |
| `src/lib/` | API clients, advisory logic, translations, and data normalization |
| `src/types/` | Shared TypeScript types |
| `supabase/schema.sql` | Supabase tables, RLS policies, and seed crop data |
| `tailwind.config.js` | Tailwind content paths and AgriMatter color tokens |
| `src/app/globals.css` | Global Tailwind layers, theme overrides, and visual polish |

## 🧭 Main Routes

| Route | Use |
| --- | --- |
| `/` | Landing page, state-wise agriculture explorer, and farmer FAQs |
| `/dashboard` | Farmer overview and quick actions |
| `/mandi` | Official mandi price search |
| `/weather` | Forecast and farming advisory |
| `/crop-advisor` | Crop suitability matching |
| `/soil-health` | Soil pH and NPK evaluation |
| `/fertilizer-guide` | Stage-wise fertilizer guidance |
| `/crop-doctor` | Crop issue and disease help |
| `/ai-assistant` | AI text and voice assistant |
| `/farm-plan` | Farm planning workflow |
| `/profile` | Farmer profile |

## 🔐 Environment Variables

Copy `.env.example` to `.env.local` and keep all real credentials server-side. Never commit `.env.local` or use `NEXT_PUBLIC_` for private API keys.

```env
# Required only for live Mandi prices
DATA_GOV_API_KEY=your_data_gov_in_api_key
DATA_GOV_MANDI_RESOURCE_ID=your_agmarknet_resource_id

# Optional integrations used by other features
GEMINI_API_KEY=your_gemini_key
MONGODB_URI=your_mongodb_connection_string
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Without the data.gov.in values, `/api/mandi` returns a clear configuration response and the UI does not show fake market prices.

## ✅ Data Accuracy Policy

- Live market prices must come from official data.gov.in/Agmarknet data.
- Weather is fetched through the configured weather service and should be checked against local conditions.
- State income and holding figures currently use the supplied NSS Report No. 587 and Agriculture Census 2015-16 snapshots.
- State deep-profile fields that are not independently verified are labelled in the UI instead of being presented as facts.
- Scheme eligibility, prices, rainfall, groundwater status, and deadlines are time-sensitive. Confirm them with the relevant official department before acting.

## 🛠 Useful Commands

```bash
npm run dev       # Start the Next.js development server
npm run lint      # Run Next.js ESLint checks
npm run build     # Create and validate a production build
npm run start     # Serve the production build
```

If port `3000` is occupied, use another port:

```bash
npm run dev -- -p 3001
```

If CSS or generated chunks return `404` during development, stop duplicate Next.js processes, remove `.next`, and restart one server:

```powershell
Remove-Item .next -Recurse -Force
npm run dev
```

## 🤝 Contributing

Keep farmer-facing text in `src/lib/translations.ts`, prefer server-side API calls for private credentials, preserve the Hindi experience, and add source notes whenever introducing government or agricultural data. Run `npm run lint` and `npm run build` before submitting changes.

---

## 🗄 Database Schema (Supabase PostgreSQL)

The complete SQL schema with Row Level Security (RLS) policies and seed data is located at `supabase/schema.sql`.

### Tables Created:
- `profiles`: `id`, `full_name`, `phone`, `language`, `state`, `district`, `village`, `created_at`
- `farms`: `id`, `user_id`, `land_size`, `irrigation_type`, `latitude`, `longitude`, `soil_type`
- `crops`: `id`, `name`, `season`, `suitable_soils`, `irrigation_need`, `sowing_months`, `description`
- `farmer_crops`: `id`, `farm_id`, `crop_id`, `crop_stage`, `sowing_date`
- `soil_reports`: `id`, `farm_id`, `ph`, `nitrogen`, `phosphorus`, `potassium`, `report_date`
- `crop_advisories`: `id`, `crop_id`, `crop_stage`, `weather_condition`, `advice_english`, `advice_hindi`
- `weather_alerts`: `id`, `farm_id`, `alert_type`, `alert_date`, `message`
- `assistant_conversations`: `id`, `user_id`, `question`, `answer`, `language`, `created_at`

Seed data included for: **Rice, Wheat, Maize, Mustard, Soybean, and Tomato**.

---

## 🚀 Quick Start & Local Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Setup
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build & Type Check
```bash
npm run build
```

---

## ⚠️ Mandatory Safety Disclaimer
> "This is general guidance. For exact fertilizer doses, consult a soil test report or local agriculture officer."
