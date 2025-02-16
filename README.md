# AI Healthcare Platform

A comprehensive AI-powered healthcare platform with features like an AI health assistant, health issue scanning via images, and prescription/medical report scanning.

## Features

- **AI Health Assistant**: Provides health advice and personalized recommendations.
- **AI Vision**: Analyzes images for potential health issues.
- **Document Scanning**: Scans and organizes prescriptions and medical reports.

## Getting Started

These instructions will help you set up and run the project on your local machine.

### Prerequisites

1. **Node.js**: Ensure you have Node.js installed. [Download Node.js](https://nodejs.org/).
2. **Bun (optional)**: Alternatively, you can use [Bun](https://bun.sh/) as the package manager.

### Installation

Clone the repository:

```bash
git clone https://github.com/shubhammukherjee17/ai-healthcare.git
cd ai-healthcare
```

#### Using Bun

If you choose to use **Bun** as your package manager:

1. **Install dependencies**:

   ```bash
   bun install
   ```

2. **Run the development server**:

   ```bash
   bun dev
   ```

3. **Build for production**:

   ```bash
   bun build
   ```

4. **Start the production server**:
   ```bash
   bun start
   ```

#### Using npm

Alternatively, if you prefer **npm**:

1. **Install dependencies**:

   ```bash
   npm install
   ```

2. **Run the development server**:

   ```bash
   npm run dev
   ```

3. **Build for production**:

   ```bash
   npm run build
   ```

4. **Start the production server**:
   ```bash
   npm start
   ```

### Environment Variables

Set up a `.env.local` file with necessary environment variables for Firebase, API keys, etc.
here's sample env file setup

```env
VISION_PRIVATE_KEY=your_private_key_id
VISION_CLIENT_EMAIL=your_client_email
GEMINI_API_KEY=your_gemini_api_key
GOOGLE_GENERATIVE_AI_API_KEY=api-key
NEXT_PUBLIC_FIREBASE_API_KEY=firebase-api-key
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=firebase-message-sender
NEXT_PUBLIC_FIREBASE_APP_ID=firebase-app-id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=firebase-measurement-id
```

### Technologies Used

- **Next.js** for frontend and backend integration.
- **Firebase Firestore** for database management.
- **Vercel AI SDK** for AI capabilities.
- **Google Cloud Vision API** for image analysis.

### Contributing

Feel free to open issues and submit pull requests to improve the platform.

### License

This project is licensed under the MIT License. See the `LICENSE` file for details.
