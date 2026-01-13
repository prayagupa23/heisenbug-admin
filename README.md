# NexusPay Admin Dashboard

A production-ready web admin dashboard for a fintech application built with Next.js, Tailwind CSS, and Recharts.

## Features

- **Real-time Dashboard Overview** with KPI cards and transaction monitoring
- **Dark/Light Theme Toggle** with persistent user preference
- **Responsive Design** that works on all screen sizes
- **Interactive Charts** using Recharts for data visualization
- **Security Alerts Table** with severity indicators and action buttons
- **System Health Monitoring** with real-time status indicators
- **Geographic Risk Visualization** with map placeholder
- **Modern UI Components** built with Radix UI primitives

## Tech Stack

- **Frontend**: Next.js 15 (App Router), JavaScript
- **Styling**: Tailwind CSS with custom design system
- **Charts**: Recharts
- **Icons**: Lucide React
- **UI Components**: Radix UI
- **Theme**: Custom dark/light mode implementation

## Getting Started

First, install dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
src/
├── app/
│   ├── globals.css      # Global styles and theme variables
│   ├── layout.js        # Root layout with theme provider
│   └── transactionspage.js          # Main dashboard page
├── components/
│   ├── Sidebar.js       # Navigation sidebar
│   ├── Header.js        # Top header with search and theme toggle
│   ├── KPICard.js       # K metric cards
│   ├── TransactionChart.js  # Main transaction volume chart
│   ├── SystemHealth.js  # System health status panel
│   ├── GeographicRisk.js    # Geographic risk visualization
│   ├── SecurityAlertsTable.js  # Security alerts data table
│   ├── ThemeProvider.js # Theme context and toggle logic
│   └── LucideIcon.js    # Icon wrapper component
└── lib/
    └── utils.js         # Utility functions
```

## Design System

The dashboard follows a fintech-grade design system with:

- **Light Mode**: Clean white backgrounds with soft card surfaces
- **Dark Mode**: Deep charcoal backgrounds with subtle shadows
- **Colors**: Muted palette with semantic status colors (success, warning, destructive)
- **Typography**: Inter font family with clear hierarchy
- **Components**: Consistent spacing, rounded corners, and subtle borders

## Customization

### Adding New KPI Cards

1. Update the `kpiData` array in `src/app/transactionspage.js`
2. Add new icon mappings in `src/components/LucideIcon.js`
3. Customize colors in `tailwind.config.js`

### Modifying the Theme

Update color variables in `src/app/globals.css` and `tailwind.config.js` to customize the appearance.

### Adding New Pages

1. Create new route files in `src/app/`
2. Update navigation items in `src/components/Sidebar.js`
3. Ensure consistent styling with existing components

## Deployment

The easiest way to deploy is using the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
