# QR Code Booking Website

A modern, responsive booking page with app store redirects and guest booking functionality.

## Features

- 📱 **App Store Redirects**: Automatic device detection with appropriate download buttons
- 👤 **Guest Booking**: Book appointments without registration
- 🎯 **Service Selection**: Choose from available services
- 👥 **Staff Selection**: Pick preferred staff members
- 📅 **Time Slot Booking**: Select available date and time slots
- 🏢 **Business Information**: Display hours, location, contact info
- 📱 **Responsive Design**: Mobile-first approach
- 🎨 **Modern UI**: Beautiful, intuitive interface
- ⚡ **Performance Optimized**: Fast loading and smooth interactions
- 🔍 **SEO Optimized**: Meta tags and structured data

## Technology Stack

- **Frontend**: React 18
- **Styling**: CSS3 with modern features
- **Icons**: Emoji icons for simplicity
- **Analytics**: Google Analytics integration ready
- **SEO**: React Helmet for meta tags

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd qr_code_website
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### Environment Variables

Create a `.env` file in the root directory:

```env
REACT_APP_API_URL=http://localhost:3000/api
REACT_APP_GOOGLE_ANALYTICS_ID=your-ga-id
REACT_APP_FACEBOOK_PIXEL_ID=your-pixel-id
```

## Project Structure

```
src/
├── components/          # React components
│   ├── BookingPage.js   # Main booking page
│   ├── AppStoreRedirect.js
│   ├── BusinessInfo.js
│   ├── ServiceSelection.js
│   ├── StaffSelection.js
│   ├── DateTimeSelection.js
│   ├── BookingForm.js
│   ├── BookingSuccessModal.js
│   └── SEOHead.js
├── services/           # API services
│   └── api.js
├── utils/              # Utility functions
│   ├── deviceDetection.js
│   ├── validation.js
│   └── analytics.js
├── hooks/              # Custom React hooks
│   └── useAnalytics.js
├── App.js
├── App.css
├── index.js
└── index.css
```

## API Integration

The app includes mock data for development. To connect to your backend API:

1. Update the `API_BASE_URL` in `src/services/api.js`
2. Ensure your API endpoints match the expected structure:

### Required API Endpoints

- `GET /api/businesses/:id` - Get business information
- `GET /api/services?business=:id` - Get services for a business
- `GET /api/staff?businessId=:id` - Get staff members
- `GET /api/appointments/available-slots` - Get available time slots
- `POST /api/appointments/manual` - Submit booking

### API Response Formats

#### Business Data
```json
{
  "_id": "business_id",
  "name": "Business Name",
  "description": "Business description",
  "category": "Beauty & Wellness",
  "region": "New York, NY",
  "location": {
    "address": "123 Main Street, New York, NY 10001"
  },
  "phone": "+1 (555) 123-4567",
  "businessHours": [
    {
      "day": "Monday",
      "open": "9:00 AM",
      "close": "6:00 PM",
      "isOpen": true
    }
  ],
  "paymentOptions": ["card", "cash"],
  "instagramLink": "https://instagram.com/business"
}
```

#### Services Data
```json
{
  "services": [
    {
      "_id": "service_id",
      "name": "Service Name",
      "description": "Service description",
      "duration": 60,
      "price": 75
    }
  ]
}
```

## Customization

### App Store Links

Update the app store URLs in:
- `src/components/AppStoreRedirect.js`
- `src/utils/deviceDetection.js`

### Styling

The app uses CSS modules for styling. Main color scheme:
- Primary: `#8b5cf6` (Purple)
- Success: `#10b981` (Green)
- Error: `#dc2626` (Red)
- Text: `#1f2937` (Dark gray)

### Business Information

Update mock data in `src/services/api.js` or connect to your API.

## Deployment

### Build for Production

```bash
npm run build
```

This builds the app for production to the `build` folder.

### Deploy to Netlify

1. Build the project
2. Drag and drop the `build` folder to Netlify
3. Configure environment variables in Netlify dashboard

### Deploy to Vercel

1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Configure environment variables in Vercel dashboard

## SEO Features

- Meta tags for social media sharing
- Structured data for local business
- Mobile-friendly design
- Fast loading performance
- Semantic HTML structure

## Analytics Integration

The app includes analytics tracking for:
- Page views
- Service selections
- Staff selections
- Date/time selections
- Booking completions
- App store clicks

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, email support@example.com or create an issue in the repository.
