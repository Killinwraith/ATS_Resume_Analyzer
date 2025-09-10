# ATS Resume Analyzer

A modern, AI-powered web application that analyzes resumes against job descriptions to provide comprehensive ATS (Applicant Tracking System) compatibility feedback. Built with Next.js, TypeScript, and Google's Gemini AI, this tool helps job seekers optimize their resumes for better ATS performance.

## 🚀 Features

### Core Functionality

- **PDF Resume Upload**: Drag-and-drop interface for easy resume upload (PDF format)
- **Job Description Analysis**: Text input for job descriptions with real-time word count
- **AI-Powered Analysis**: Uses Google Gemini AI to perform comprehensive resume analysis
- **Real-time Progress Tracking**: Visual progress indicators during analysis
- **Comprehensive Scoring**: Multi-dimensional scoring system (Overall, Skills, Experience, Education, Keywords)

### Analysis Components

- **ATS Match Score**: Numerical score (0-100) with detailed explanations
- **Keyword Analysis**: Extracts and matches important keywords from job descriptions
- **Skills Assessment**: Categorizes hard and soft skills with match indicators
- **Personalized Recommendations**: Actionable suggestions for resume improvement
- **Candidate Information Extraction**: Automatically extracts contact and experience details

### User Experience

- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Modern UI Components**: Built with Radix UI and custom components
- **Interactive Dashboard**: Clean, intuitive interface for analysis workflow
- **Detailed Results View**: Comprehensive analysis results with visual indicators

## 🛠️ Tech Stack

### Frontend

- **Next.js 15.5.2** - React framework with App Router
- **React 19.1.0** - UI library
- **TypeScript 5** - Type-safe development
- **Tailwind CSS 4** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Lucide React** - Icon library

### Backend & AI

- **Google Gemini AI** - AI analysis engine
- **PDF2JSON** - PDF text extraction
- **Next.js API Routes** - Server-side processing

### Development Tools

- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Turbopack** - Fast bundling

## 📋 Prerequisites

- Node.js 18+
- npm or yarn
- Google Gemini API key

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd ATS_Resume_Analyzer/my-app
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📖 Usage Guide

### Step 1: Upload Resume

1. Navigate to the dashboard
2. Drag and drop your PDF resume or click "Choose File"
3. Supported format: PDF (max 10MB)

### Step 2: Enter Job Description

1. Paste the job description in the text area
2. Monitor word count for optimal analysis
3. Ensure both resume and job description are provided

### Step 3: Start Analysis

1. Click "Start Analysis" button
2. Monitor progress bar during processing
3. Wait for AI analysis to complete

### Step 4: Review Results

1. View comprehensive analysis dashboard
2. Check ATS match score and breakdown
3. Review skills assessment and recommendations
4. Implement suggested improvements

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/analyze/       # API endpoint for resume analysis
│   ├── dashboard/         # Main upload interface
│   └── analysisDashboard/ # Results display
├── components/            # React components
│   ├── AnalysisDash/     # Analysis result components
│   ├── ui/               # Reusable UI components
│   ├── ResumeUploader.tsx
│   └── JobDescriptionInput.tsx
├── models/               # TypeScript interfaces
├── hooks/                # Custom React hooks
└── lib/                  # Utility functions
```

## 🔧 API Endpoints

### POST /api/analyze

Analyzes resume against job description using AI.

**Request:**

- FormData with `resume` (File) and `jobDescription` (string)

**Response:**

```json
{
  "analysis": "string",
  "success": true
}
```

## 🎯 Key Features Implementation

### PDF Processing

- Extracts text from PDF files using PDF2JSON
- Cleans and normalizes extracted text
- Handles various PDF formats and layouts

### AI Analysis

- Uses Google Gemini 2.5 Flash model
- Structured prompt engineering for consistent results
- Comprehensive analysis covering multiple dimensions

### Responsive Design

- Mobile-first approach
- Grid layouts for different screen sizes
- Accessible components with proper ARIA labels

## 🚀 Deployment

### Build for Production

```bash
npm run build
npm start
```

### Environment Variables

Ensure the following environment variables are set:

- `GEMINI_API_KEY`: Your Google Gemini API key

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔮 Future Enhancements

- [ ] Support for multiple file formats (DOCX, TXT)
- [ ] Batch resume analysis
- [ ] Resume template suggestions
- [ ] Industry-specific analysis
- [ ] Integration with job boards
- [ ] User authentication and history
- [ ] Export analysis reports
- [ ] A/B testing for resume versions

## 🐛 Known Issues

- PDF parsing may not work perfectly with image-based PDFs
- Large job descriptions (>5000 words) may impact analysis quality
- Analysis results are currently displayed with mock data

## 📞 Support

For support, email [your-email@example.com] or create an issue in the repository.

---

**Built with ❤️ using Next.js, TypeScript, and Google Gemini AI**
