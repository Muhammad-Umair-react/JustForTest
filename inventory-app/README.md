# Driver Activities Chart - MUI Version with DDD Data Tracking

A React component for visualizing driver activities with enhanced DDD (Digital Driver Data) tracking capabilities, converted from Ant Design to Material-UI.

## Features

### Core Functionality
- **Interactive Activity Chart**: Horizontal stacked bar chart showing driver states over time
- **Date Range Selection**: Configurable date range with 7-day maximum limit
- **Driver & Vehicle Filtering**: Filter activities by specific drivers and vehicles
- **Responsive Design**: Works seamlessly on desktop and mobile devices

### DDD Data Tracking
- **Data Source Visualization**: Clear indicators showing whether data comes from tacho service or DDD files
- **Visual Indicators**: Green border and background for DDD-overwritten data
- **Data Source Legend**: Comprehensive legend explaining all indicators
- **Audit Trail**: Track when data is overwritten by DDD files

## Installation

```bash
# Install required dependencies
npm install @mui/material @emotion/react @emotion/styled @mui/icons-material @mui/x-date-pickers dayjs react-apexcharts

# For development
npm install --save-dev @types/react @types/react-dom
```

## Usage

### Basic Implementation

```jsx
import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import DriverActivities from './components/DriverActivities';

const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#dc004e' },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DriverActivities />
      </LocalizationProvider>
    </ThemeProvider>
  );
}
```

### With Props

```jsx
const mockData = [
  {
    date: '2025-01-15',
    dateObj: dayjs('2025-01-15'),
    commitment: '8h30',
    drivingTime: '6h15',
    dataSource: 'ddd_overwrite',
    dddFileId: 'ddd_file_001',
    states: [
      { start: 0, end: 60, state: 'DRIVING', duration: 60 },
      { start: 60, end: 120, state: 'BREAK', duration: 60 },
      // ... more states
    ],
    isEmpty: false
  }
];

<DriverActivities
  driverId="1"
  vehiclePlate="AB123CD"
  fromVehicleView={true}
  apiActivitiesData={mockData}
/>
```

## Component Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `driverId` | `string` | `null` | Pre-selected driver ID |
| `vehiclePlate` | `string` | `null` | Pre-selected vehicle plate |
| `fromVehicleView` | `boolean` | `false` | Show back navigation button |
| `apiActivitiesData` | `Array` | `[]` | API data with activity information |

## Data Structure

### Activity Data Format

```javascript
{
  date: '2025-01-15',           // Date in YYYY-MM-DD format
  dateObj: dayjs('2025-01-15'), // Dayjs object for date manipulation
  commitment: '8h30',           // Total commitment time
  drivingTime: '6h15',          // Total driving time
  dataSource: 'ddd_overwrite',  // 'tacho_service' or 'ddd_overwrite'
  dddFileId: 'ddd_file_001',    // DDD file ID (if applicable)
  states: [                     // Array of activity states
    {
      start: 0,                 // Start time in minutes from midnight
      end: 60,                  // End time in minutes from midnight
      state: 'DRIVING',         // Activity state
      duration: 60              // Duration in minutes
    }
  ],
  isEmpty: false                // Whether the day has no data
}
```

### Supported Driver States

- `DRIVING` - Driving within limits (green)
- `DRIVING_WARNING` - Approaching 4h30 limit (orange)
- `DRIVING_VIOLATION` - Over 4h30 limit (red)
- `BREAK` - Break time (blue)
- `REST` - Rest period (purple)
- `AVAILABLE` - Available for work (cyan)
- `WORK` - Work not driving (gray)

## DDD Data Tracking

### Visual Indicators

1. **DDD Overwritten Data**:
   - Green left border on commitment rows
   - Light green background
   - "DDD Data" chip indicator

2. **Tacho Service Data**:
   - Standard appearance
   - No special indicators

### Database Integration

The component expects data with the following structure for DDD tracking:

```sql
-- Activity records with data source tracking
SELECT 
  driver_id,
  activity_date,
  activity_type,
  duration_minutes,
  data_source,
  ddd_file_id,
  ddd_overwrite_timestamp
FROM driver_activities
WHERE driver_id = ? AND activity_date BETWEEN ? AND ?;
```

## Services

### DDDDataService

Utility service for handling DDD operations:

```javascript
import DDDDataService from './services/dddDataService';

// Process activity data with DDD information
const processedData = DDDDataService.processActivityData(rawActivities, dddFiles);

// Get data source statistics
const stats = DDDDataService.getDataSourceStats(activities, startDate, endDate);

// Validate DDD file
const validation = DDDDataService.validateDDDFile(dddFile);
```

## Customization

### Theme Customization

```javascript
const customTheme = createTheme({
  palette: {
    primary: { main: '#2196f3' },
    secondary: { main: '#f50057' },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        },
      },
    },
  },
});
```

### Chart Customization

Modify the `chartOptions` object in the component to customize:
- Colors
- Tooltips
- Axis labels
- Animation settings

## Development

### Running the Development Server

```bash
npm run dev
```

### Building for Production

```bash
npm run build
```

### Testing

```bash
npm run test
```

## Migration from Ant Design

Key changes when migrating from the original Ant Design version:

1. **Component Imports**: Replace Ant Design components with MUI equivalents
2. **Styling**: Convert from Ant Design classes to MUI `sx` props
3. **Date Picker**: Use MUI X DatePicker with LocalizationProvider
4. **Icons**: Replace Ant Design icons with MUI icons
5. **Form Controls**: Use MUI Select and FormControl components

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Dependencies

- React 18+
- Material-UI 5+
- MUI X Date Pickers
- Dayjs
- React ApexCharts
- Emotion (for styling)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

For questions and support, please refer to the documentation or create an issue in the repository.
