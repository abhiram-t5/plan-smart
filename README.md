
# PlanSmart – AI-Powered Trip Planner

> Effortlessly plan your next adventure with AI. Get personalized itineraries, hotel recommendations, and more in seconds.

---

## 🚀 Features

- **Conversational AI Trip Planning**: Chat with an AI assistant to plan your trip step-by-step.
- **Personalized Itineraries**: Receive day-by-day plans with activities, best times to visit, and local tips.
- **Hotel & Activity Suggestions**: Get curated hotel options and must-see places for your destination.
- **Budget & Group Customization**: Tailor your trip by budget, group size, and duration.
- **User Authentication**: Secure sign-in/sign-up with Clerk.
- **Save & View Trips**: Store your trips and revisit them anytime.
- **Modern UI/UX**: Responsive, beautiful design with Tailwind CSS and shadcn/ui components.

---

## 🏗️ Tech Stack

- **Next.js 16** (App Router)
- **React 19**
- **Convex** (serverless DB & backend)
- **Clerk** (authentication)
- **Google Gemini AI** (trip planning)
- **Tailwind CSS** & **shadcn/ui** (UI components)
- **Arcjet** (rate limiting & security)
- **TypeScript**

---

## 📦 Project Structure

```
src/
  app/
	 _components/         # Shared UI components (Hero, Header, etc.)
	 create-new-trip/     # Trip planning chat, itinerary, hotel cards, etc.
	 my-trips/            # User's saved trips
	 view-trip/           # View details of a planned trip
	 pricing/             # Pricing page
	 api/                 # API routes (AI, Arcjet, Google Place)
  components/ui/         # UI primitives (button, timeline, etc.)
  hooks/                 # Custom React hooks
  lib/                   # Utility functions
  utils/                 # AI, parsing, zod schemas
context/                 # React context for user/trip state
convex/                  # Convex backend (schema, queries, mutations)
public/                  # Static assets
```

---

## 🛠️ Getting Started

1. **Clone the repo:**
	```bash
	git clone https://github.com/abhiram-t5/plan-smart.git
	cd plan-smart
	```
2. **Install dependencies:**
	```bash
	npm install
	# or yarn or pnpm
	```
3. **Set up environment variables:**
	- Copy `.env.example` to `.env.local` and fill in your API keys for Clerk, Convex, Google Gemini, Arcjet, etc.
4. **Run the development server:**
	```bash
	npm run dev
	```
5. **Open [http://localhost:3000](http://localhost:3000) in your browser.**

---

## ✨ Usage

1. **Sign up or log in** to your account.
2. **Start a new trip**: Use the chat to answer questions about your trip (origin, destination, group size, budget, duration).
3. **Get your AI-generated itinerary**: View hotels, activities, and a day-by-day plan.
4. **Save and revisit trips** anytime from the "My Trips" page.

---

## 🔒 Authentication

- Uses [Clerk](https://clerk.com/) for secure user authentication.
- Only authenticated users can create and save trips.

---

## 🤖 AI & API

- **Google Gemini** powers the conversational trip planner and itinerary generation.
- **Convex** stores user and trip data securely.
- **Arcjet** provides rate limiting and security for API endpoints.

---

## 🖼️ UI/UX

- Built with [Tailwind CSS](https://tailwindcss.com/) and [shadcn/ui](https://ui.shadcn.com/).
- Modern, responsive design for all devices.

---

## 📁 Environment Variables

Create a `.env.local` file with the following (see `.env.example`):

```
CLERK_PUBLISHABLE_KEY=your-clerk-key
CONVEX_URL=your-convex-url
GEMINI_API_KEY=your-gemini-key
ARCJET_KEY=your-arcjet-key
GOOGLE_PLACE_API_KEY=your-google-place-key
```

---

## 🙏 Acknowledgements

- [Next.js](https://nextjs.org/)
- [Convex](https://convex.dev/)
- [Clerk](https://clerk.com/)
- [Google Gemini](https://ai.google.dev/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Arcjet](https://arcjet.com/)

---

## 📬 Contact

For questions, feedback, or support, please open an issue or contact [abhiramtoleti5@gmail.com](mailto:abhiramtoleti5@gmail.com).
