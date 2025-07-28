export enum DriverState {
  DRIVING = 'DRIVING',
  DRIVING_WARNING = 'DRIVING_WARNING',
  DRIVING_VIOLATION = 'DRIVING_VIOLATION',
  BREAK = 'BREAK',
  REST = 'REST',
  AVAILABLE = 'AVAILABLE',
  WORK = 'WORK'
}

export enum DataSource {
  TACHO_SERVICE = 'tacho_service',
  DDD_OVERWRITE = 'ddd_overwrite'
}

export interface DriverStateConfig {
  name: string;
  color: string;
}

export interface ActivityState {
  start: number;
  end: number;
  state: DriverState;
  duration: number;
}

export interface DayActivity {
  date: string;
  dateObj: any; // dayjs object
  commitment: string;
  drivingTime: string;
  dataSource: DataSource;
  dddFileId?: string;
  states: ActivityState[];
  isEmpty: boolean;
}

export interface Driver {
  id: string;
  name: string;
}

export interface Vehicle {
  plate: string;
  driverId: string;
}

export interface DriverActivitiesProps {
  driverId?: string;
  vehiclePlate?: string;
  fromVehicleView?: boolean;
  apiActivitiesData?: DayActivity[];
}

export interface ErrorDialog {
  open: boolean;
  message: string;
}

export interface DDDFile {
  id: string;
  driver_id: string;
  vehicle_plate?: string;
  file_name: string;
  file_path: string;
  file_size: number;
  file_hash: string;
  processing_status: 'pending' | 'processing' | 'completed' | 'failed';
  data_start_date: string;
  data_end_date: string;
  records_processed: number;
  records_overwritten: number;
  uploaded_at: string;
  processed_at?: string;
}

export interface DataSourceAudit {
  id: number;
  driver_id: string;
  activity_date: string;
  previous_data_source?: DataSource;
  new_data_source: DataSource;
  ddd_file_id?: string;
  records_affected: number;
  audit_timestamp: string;
}

export interface DriverActivityRecord {
  id: number;
  driver_id: string;
  vehicle_plate?: string;
  activity_date: string;
  activity_start_time: string;
  activity_end_time: string;
  activity_type: DriverState;
  duration_minutes: number;
  data_source: DataSource;
  ddd_file_id?: string;
  ddd_overwrite_timestamp?: string;
  original_data_timestamp?: string;
  created_at: string;
  updated_at: string;
}

export interface APIResponse {
  activities: DayActivity[];
  drivers?: Driver[];
  vehicles?: Vehicle[];
  ddd_files?: DDDFile[];
}