import { DATA_SOURCES } from '../components/DriverActivities';

/**
 * Service for handling DDD (Digital Driver Data) operations
 */
export class DDDDataService {
  /**
   * Processes raw activity data and determines data sources
   * @param {Array} rawActivities - Raw activity data from API
   * @param {Array} dddFiles - DDD file records
   * @returns {Array} Processed activities with data source information
   */
  static processActivityData(rawActivities, dddFiles = []) {
    return rawActivities.map(activity => ({
      ...activity,
      dataSource: this.determineDataSource(activity, dddFiles),
      dddFileId: this.getDDDFileId(activity, dddFiles)
    }));
  }

  /**
   * Determines the data source for a specific activity
   * @param {Object} activity - Activity record
   * @param {Array} dddFiles - DDD file records
   * @returns {string} Data source type
   */
  static determineDataSource(activity, dddFiles) {
    const hasOverwrite = dddFiles.some(ddd => 
      ddd.driver_id === activity.driver_id &&
      ddd.processing_status === 'completed' &&
      this.isDateInRange(activity.date, ddd.data_start_date, ddd.data_end_date)
    );

    return hasOverwrite ? DATA_SOURCES.DDD_OVERWRITE : DATA_SOURCES.TACHO_SERVICE;
  }

  /**
   * Gets the DDD file ID that overwrote the activity data
   * @param {Object} activity - Activity record
   * @param {Array} dddFiles - DDD file records
   * @returns {string|null} DDD file ID or null
   */
  static getDDDFileId(activity, dddFiles) {
    const overwriteFile = dddFiles.find(ddd => 
      ddd.driver_id === activity.driver_id &&
      ddd.processing_status === 'completed' &&
      this.isDateInRange(activity.date, ddd.data_start_date, ddd.data_end_date)
    );

    return overwriteFile ? overwriteFile.id : null;
  }

  /**
   * Checks if a date is within a range
   * @param {string} date - Date to check (YYYY-MM-DD)
   * @param {string} startDate - Range start date
   * @param {string} endDate - Range end date
   * @returns {boolean} True if date is in range
   */
  static isDateInRange(date, startDate, endDate) {
    const checkDate = new Date(date);
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    return checkDate >= start && checkDate <= end;
  }

  /**
   * Simulates DDD file processing
   * @param {Object} dddFile - DDD file to process
   * @param {Array} existingActivities - Existing activity data
   * @returns {Promise<Object>} Processing result
   */
  static async processDDDFile(dddFile, existingActivities) {
    try {
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      const affectedActivities = existingActivities.filter(activity =>
        activity.driver_id === dddFile.driver_id &&
        this.isDateInRange(activity.date, dddFile.data_start_date, dddFile.data_end_date)
      );

      const processedActivities = affectedActivities.map(activity => ({
        ...activity,
        dataSource: DATA_SOURCES.DDD_OVERWRITE,
        dddFileId: dddFile.id,
        ddd_overwrite_timestamp: new Date().toISOString(),
        original_data_timestamp: activity.created_at
      }));

      return {
        success: true,
        recordsProcessed: processedActivities.length,
        recordsOverwritten: affectedActivities.length,
        processedActivities
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        recordsProcessed: 0,
        recordsOverwritten: 0
      };
    }
  }

  /**
   * Creates audit record for data source changes
   * @param {string} driverId - Driver ID
   * @param {string} activityDate - Activity date
   * @param {string} previousSource - Previous data source
   * @param {string} newSource - New data source
   * @param {string} dddFileId - DDD file ID
   * @param {number} recordsAffected - Number of records affected
   * @returns {Object} Audit record
   */
  static createAuditRecord(driverId, activityDate, previousSource, newSource, dddFileId, recordsAffected) {
    return {
      driver_id: driverId,
      activity_date: activityDate,
      previous_data_source: previousSource,
      new_data_source: newSource,
      ddd_file_id: dddFileId,
      records_affected: recordsAffected,
      audit_timestamp: new Date().toISOString()
    };
  }

  /**
   * Validates DDD file format and data
   * @param {Object} dddFile - DDD file data
   * @returns {Object} Validation result
   */
  static validateDDDFile(dddFile) {
    const errors = [];

    if (!dddFile.driver_id) {
      errors.push('Driver ID is required');
    }

    if (!dddFile.data_start_date || !dddFile.data_end_date) {
      errors.push('Start and end dates are required');
    }

    if (new Date(dddFile.data_start_date) > new Date(dddFile.data_end_date)) {
      errors.push('Start date cannot be after end date');
    }

    if (!dddFile.file_hash) {
      errors.push('File hash is required for integrity verification');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Gets data source statistics for a date range
   * @param {Array} activities - Activity data
   * @param {string} startDate - Start date
   * @param {string} endDate - End date
   * @returns {Object} Statistics object
   */
  static getDataSourceStats(activities, startDate, endDate) {
    const filteredActivities = activities.filter(activity =>
      this.isDateInRange(activity.date, startDate, endDate)
    );

    const tachoCount = filteredActivities.filter(a => a.dataSource === DATA_SOURCES.TACHO_SERVICE).length;
    const dddCount = filteredActivities.filter(a => a.dataSource === DATA_SOURCES.DDD_OVERWRITE).length;
    const total = filteredActivities.length;

    return {
      total,
      tachoService: {
        count: tachoCount,
        percentage: total > 0 ? (tachoCount / total * 100).toFixed(1) : 0
      },
      dddOverwrite: {
        count: dddCount,
        percentage: total > 0 ? (dddCount / total * 100).toFixed(1) : 0
      }
    };
  }

  /**
   * Generates mock DDD file data for testing
   * @param {string} driverId - Driver ID
   * @param {string} startDate - Start date
   * @param {string} endDate - End date
   * @returns {Object} Mock DDD file
   */
  static generateMockDDDFile(driverId, startDate, endDate) {
    const fileId = `ddd_${driverId}_${Date.now()}`;
    
    return {
      id: fileId,
      driver_id: driverId,
      file_name: `driver_${driverId}_${startDate.replace(/-/g, '')}.ddd`,
      file_path: `/ddd_files/${fileId}.ddd`,
      file_size: Math.floor(Math.random() * 10000) + 1000,
      file_hash: this.generateHash(),
      processing_status: 'completed',
      data_start_date: startDate,
      data_end_date: endDate,
      records_processed: Math.floor(Math.random() * 100) + 10,
      records_overwritten: Math.floor(Math.random() * 50) + 5,
      uploaded_at: new Date().toISOString(),
      processed_at: new Date().toISOString()
    };
  }

  /**
   * Generates a mock hash for testing
   * @returns {string} Mock hash
   */
  static generateHash() {
    return Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join('');
  }
}

export default DDDDataService;