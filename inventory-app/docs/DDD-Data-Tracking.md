# DDD Data Tracking in Driver Activities Chart

## Overview

The Driver Activities component has been enhanced to track and display data sources, specifically distinguishing between:

1. **Data from Tacho Service** - Real-time data obtained from the unit
2. **Data Overwritten by DDD File** - Data that has been periodically overwritten by DDD (Digital Driver Data) files

## Visual Indicators

### Data Source Indicators
- **DDD Overwritten Data**: Rows with green left border and light green background
- **Tacho Service Data**: Standard appearance with subtle border
- **DDD Data Chip**: Green chip labeled "DDD Data" appears for overwritten entries

### Legend
The component includes a comprehensive legend showing:
- Driver state colors and meanings
- Data source indicators with clear explanations

## Database Schema Proposal

Based on the tachograph data requirements, here's the proposed database structure:

### Table: `driver_activities`
```sql
CREATE TABLE driver_activities (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    driver_id VARCHAR(50) NOT NULL,
    vehicle_plate VARCHAR(20),
    activity_date DATE NOT NULL,
    activity_start_time TIME NOT NULL,
    activity_end_time TIME NOT NULL,
    activity_type ENUM('DRIVING', 'DRIVING_WARNING', 'DRIVING_VIOLATION', 'BREAK', 'REST', 'AVAILABLE', 'WORK') NOT NULL,
    duration_minutes INT NOT NULL,
    data_source ENUM('tacho_service', 'ddd_overwrite') NOT NULL DEFAULT 'tacho_service',
    ddd_file_id VARCHAR(100) NULL,
    ddd_overwrite_timestamp TIMESTAMP NULL,
    original_data_timestamp TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_driver_date (driver_id, activity_date),
    INDEX idx_vehicle_date (vehicle_plate, activity_date),
    INDEX idx_data_source (data_source),
    INDEX idx_ddd_file (ddd_file_id)
);
```

### Table: `ddd_files`
```sql
CREATE TABLE ddd_files (
    id VARCHAR(100) PRIMARY KEY,
    driver_id VARCHAR(50) NOT NULL,
    vehicle_plate VARCHAR(20),
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size BIGINT NOT NULL,
    file_hash VARCHAR(64) NOT NULL,
    processing_status ENUM('pending', 'processing', 'completed', 'failed') NOT NULL DEFAULT 'pending',
    data_start_date DATE NOT NULL,
    data_end_date DATE NOT NULL,
    records_processed INT DEFAULT 0,
    records_overwritten INT DEFAULT 0,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    processed_at TIMESTAMP NULL,
    
    INDEX idx_driver_dates (driver_id, data_start_date, data_end_date),
    INDEX idx_vehicle_dates (vehicle_plate, data_start_date, data_end_date),
    INDEX idx_processing_status (processing_status)
);
```

### Table: `data_source_audit`
```sql
CREATE TABLE data_source_audit (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    driver_id VARCHAR(50) NOT NULL,
    activity_date DATE NOT NULL,
    previous_data_source ENUM('tacho_service', 'ddd_overwrite'),
    new_data_source ENUM('tacho_service', 'ddd_overwrite') NOT NULL,
    ddd_file_id VARCHAR(100) NULL,
    records_affected INT NOT NULL,
    audit_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_driver_date_audit (driver_id, activity_date),
    INDEX idx_ddd_file_audit (ddd_file_id),
    FOREIGN KEY (ddd_file_id) REFERENCES ddd_files(id)
);
```

## Implementation Features

### Component Features
1. **Visual Data Source Tracking**: Clear visual indicators for data sources
2. **Responsive Design**: Works on mobile and desktop devices
3. **Date Range Validation**: Maximum 7-day range with future date prevention
4. **Interactive Chart**: ApexCharts with custom tooltips
5. **Filter Capabilities**: Driver and vehicle filtering
6. **Reset Functionality**: Quick reset to last 7 days

### Data Processing Logic
```javascript
// Example of how data source tracking works
const processActivityData = (rawData, dddOverwrites) => {
  return rawData.map(activity => ({
    ...activity,
    dataSource: dddOverwrites.some(ddd => 
      ddd.driver_id === activity.driver_id &&
      ddd.data_start_date <= activity.activity_date &&
      ddd.data_end_date >= activity.activity_date
    ) ? DATA_SOURCES.DDD_OVERWRITE : DATA_SOURCES.TACHO_SERVICE
  }));
};
```

## API Integration

### Expected API Response Format
```json
{
  "activities": [
    {
      "date": "2025-01-15",
      "driver_id": "1",
      "vehicle_plate": "AB123CD",
      "commitment": "8h30",
      "drivingTime": "6h15",
      "dataSource": "ddd_overwrite",
      "dddFileId": "ddd_file_20250115_001",
      "states": [
        {
          "start": 0,
          "end": 60,
          "state": "DRIVING",
          "duration": 60
        }
      ]
    }
  ]
}
```

## Future Enhancements

1. **Real-time Updates**: WebSocket integration for live data updates
2. **Export Functionality**: PDF/Excel export with data source information
3. **Detailed Audit Trail**: Click-through to see detailed overwrite history
4. **Data Quality Indicators**: Show confidence levels for different data sources
5. **Conflict Resolution**: Handle cases where DDD and tacho data conflict

## Configuration

The component accepts the following props:
- `driverId`: Pre-selected driver ID
- `vehiclePlate`: Pre-selected vehicle plate
- `fromVehicleView`: Boolean to show back navigation
- `apiActivitiesData`: API data with DDD tracking information

## Migration Notes

When migrating from the Ant Design version:
1. Update all component imports to MUI equivalents
2. Replace Ant Design date picker with MUI X DatePicker
3. Update styling from Ant Design classes to MUI sx props
4. Add LocalizationProvider wrapper for date pickers
5. Implement DDD data source tracking in the data layer