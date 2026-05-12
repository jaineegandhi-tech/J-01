# Real Estate Marketplace Admin Panel

A comprehensive React-based admin panel for managing a real estate marketplace. This application provides a complete dashboard for managing properties, users, transactions, inquiries, payments, and generating reports.

## Features

### 🏠 Property Management
- **Property Listings**: View, add, edit, and delete properties
- **Property Types**: Manage different property categories (apartments, houses, villas, etc.)
- **Property Status**: Track active, pending, sold, and rented properties
- **Image Upload**: Support for multiple property images
- **Advanced Filtering**: Search and filter properties by type, status, location, and price

### 👥 User Management
- **User Roles**: Support for admins, agents, buyers, sellers, landlords, and tenants
- **User Status**: Active, inactive, pending, and suspended user states
- **User Analytics**: Track user activity and engagement
- **Role-based Permissions**: Different access levels for different user types

### 💰 Transaction Management
- **Transaction Tracking**: Monitor sales, rentals, and lease transactions
- **Payment Processing**: Track payment status and history
- **Commission Calculation**: Automatic commission calculations for agents
- **Transaction Reports**: Detailed transaction analytics

### 📊 Dashboard & Analytics
- **Real-time Statistics**: Key metrics and KPIs
- **Interactive Charts**: Sales trends, property distribution, revenue analytics
- **Recent Activities**: Live feed of system activities
- **Top Performers**: Track top properties and agents

### 🔧 System Features
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Dark/Light Theme**: User preference-based theming
- **Search & Filtering**: Advanced search capabilities across all modules
- **Data Export**: Export reports and data in various formats
- **Notifications**: Real-time notifications for important events

## Technology Stack

- **Frontend**: React 18, React Router DOM
- **Styling**: CSS3, Responsive Design
- **Charts**: Chart.js, React Chart.js 2
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **State Management**: React Context API
- **Authentication**: JWT-based authentication (mock implementation)

## Project Structure

```
src/
├── components/           # Reusable UI components
│   └── Layout/          # Layout components (Sidebar, Header)
├── constants/           # Application constants and configurations
├── contexts/            # React Context providers
├── pages/              # Page components
│   ├── Auth/           # Authentication pages
│   ├── Dashboard/      # Dashboard and analytics
│   ├── Properties/     # Property management
│   ├── Users/          # User management
│   ├── Transactions/   # Transaction management
│   ├── Inquiries/      # Inquiry management
│   ├── Payments/       # Payment management
│   ├── Reports/        # Reports and analytics
│   └── Settings/       # System settings
├── utils/              # Utility functions
└── App.js              # Main application component
```

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn package manager

### Installation

1. **Clone or download the project**
   ```bash
   cd "Admin Panel"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Login Credentials

Use these demo credentials to access the admin panel:
- **Email**: admin@realestate.com
- **Password**: admin123

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm eject` - Ejects from Create React App (one-way operation)

## Key Components

### Dashboard
- Real-time statistics and KPIs
- Interactive charts showing sales trends and property distribution
- Recent activities feed
- Top-performing properties and agents

### Property Management
- Comprehensive property listing with search and filters
- Add/Edit property form with image upload
- Property type management
- Status tracking and updates

### User Management
- User listing with role-based filtering
- User profile management
- Role and permission management
- Activity tracking

### Transaction Management
- Transaction history and status tracking
- Payment processing and monitoring
- Commission calculations
- Financial reporting

## Customization

### Adding New Property Types
1. Update the `PROPERTY_TYPES` constant in `src/constants/index.js`
2. The new types will automatically appear in dropdowns and filters

### Adding New User Roles
1. Update the `USER_ROLES` constant in `src/constants/index.js`
2. Implement role-based permissions in the authentication context

### Styling Customization
- Main styles are in `src/index.css` and `src/App.css`
- Component-specific styles are included in respective components
- CSS custom properties are used for consistent theming

## API Integration

The current implementation uses mock data for demonstration. To integrate with a real backend:

1. **Update API endpoints** in `src/constants/index.js`
2. **Implement API service functions** in `src/services/`
3. **Update authentication context** to use real JWT tokens
4. **Replace mock data** with actual API calls

## Responsive Design

The admin panel is fully responsive and works on:
- **Desktop**: Full sidebar navigation and multi-column layouts
- **Tablet**: Collapsible sidebar with optimized layouts
- **Mobile**: Mobile-first navigation with stacked layouts

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation for common solutions

## Future Enhancements

- **Real-time Notifications**: WebSocket integration for live updates
- **Advanced Analytics**: More detailed reporting and insights
- **Mobile App**: React Native companion app
- **Multi-language Support**: Internationalization (i18n)
- **Advanced Search**: Elasticsearch integration
- **Document Management**: File upload and management system
- **Calendar Integration**: Appointment scheduling for property viewings
- **Map Integration**: Interactive property location maps

---

Built with ❤️ for real estate professionals