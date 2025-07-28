import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Typography,
  Box,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Divider,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { ArrowBack, Refresh } from "@mui/icons-material";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import ReactApexChart from "react-apexcharts";

dayjs.extend(isBetween);

const DRIVER_STATES = {
  DRIVING: { name: "Driving (within limit)", color: "#52c41a" },
  DRIVING_WARNING: { name: "Driving (approaching 4h30)", color: "#faad14" },
  DRIVING_VIOLATION: { name: "Driving (over 4h30)", color: "#f5222d" },
  BREAK: { name: "Break", color: "#1890ff" },
  REST: { name: "Rest", color: "#722ed1" },
  AVAILABLE: { name: "Available", color: "#13c2c2" },
  WORK: { name: "Work (not driving)", color: "gray" },
};

const DRIVER_STATE_KEYS = Object.keys(DRIVER_STATES);

// Data source types for tracking DDD overwrites
const DATA_SOURCES = {
  TACHO_SERVICE: "tacho_service",
  DDD_OVERWRITE: "ddd_overwrite",
};

const DriverActivities = ({
  driverId: propDriverId,
  vehiclePlate,
  fromVehicleView,
  apiActivitiesData,
}) => {
  const [driverId, setDriverId] = useState(propDriverId || null);
  const [startDate, setStartDate] = useState(dayjs().subtract(6, "days"));
  const [endDate, setEndDate] = useState(dayjs());
  const [loading, setLoading] = useState(false);
  const [activitiesData, setActivitiesData] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [vehicleFilter, setVehicleFilter] = useState(vehiclePlate || null);
  const [errorDialog, setErrorDialog] = useState({ open: false, message: "" });
  const [successMessage, setSuccessMessage] = useState("");

  const generateContinuousStates = () => {
    const states = [];
    let currentMinute = 0;
    while (currentMinute < 1440) {
      const randomState =
        DRIVER_STATE_KEYS[Math.floor(Math.random() * DRIVER_STATE_KEYS.length)];
      const durationOptions = [60, 60, 60, 120, 120, 180];
      let duration =
        durationOptions[Math.floor(Math.random() * durationOptions.length)];
      if (currentMinute + duration > 1440) {
        duration = 1440 - currentMinute;
      }
      states.push({
        start: currentMinute,
        end: currentMinute + duration,
        state: randomState,
        duration,
      });
      currentMinute += duration;
    }
    return states;
  };

  const generateMockData = () => {
    const data = [];
    const startDateObj = startDate ? startDate.startOf("day") : dayjs().subtract(6, "days").startOf("day");
    const endDateObj = endDate ? endDate.startOf("day") : dayjs().startOf("day");
    const daysInRange = endDateObj.diff(startDateObj, "days") + 1;

    const predefinedData = [
      { commitment: "10h30", drivingTime: "7h00", dataSource: DATA_SOURCES.DDD_OVERWRITE },
      { commitment: "7h30", drivingTime: "4h15", dataSource: DATA_SOURCES.TACHO_SERVICE },
      { commitment: "9h15", drivingTime: "5h45", dataSource: DATA_SOURCES.DDD_OVERWRITE },
      { commitment: "4h30", drivingTime: "2h00", dataSource: DATA_SOURCES.TACHO_SERVICE },
      { commitment: "7h30", drivingTime: "4h00", dataSource: DATA_SOURCES.DDD_OVERWRITE },
      { commitment: "7h45", drivingTime: "5h45", dataSource: DATA_SOURCES.TACHO_SERVICE },
      { commitment: "0h00", drivingTime: "0h00", dataSource: DATA_SOURCES.TACHO_SERVICE },
    ];

    for (let i = 0; i < daysInRange; i++) {
      const date = startDateObj.add(i, "day");
      const dayData = predefinedData[i % predefinedData.length];
      const states = generateContinuousStates();

      data.push({
        date: date.format("YYYY-MM-DD"),
        dateObj: date,
        commitment: dayData.commitment,
        drivingTime: dayData.drivingTime,
        dataSource: dayData.dataSource,
        states,
        isEmpty: false,
      });
    }
    return data;
  };

  useEffect(() => {
    if (
      apiActivitiesData &&
      Array.isArray(apiActivitiesData) &&
      apiActivitiesData.length > 0
    ) {
      setActivitiesData(apiActivitiesData);
      setDrivers([
        { id: "1", name: "Marco Rossi" },
        { id: "2", name: "Luigi Bianchi" },
        { id: "3", name: "Giovanni Verdi" },
      ]);
      setVehicles([
        { plate: "AB123CD", driverId: "1" },
        { plate: "EF456GH", driverId: "1" },
        { plate: "IJ789KL", driverId: "2" },
      ]);
      setLoading(false);
    } else {
      setLoading(true);
      setTimeout(() => {
        setDrivers([
          { id: "1", name: "Marco Rossi" },
          { id: "2", name: "Luigi Bianchi" },
          { id: "3", name: "Giovanni Verdi" },
        ]);
        setVehicles([
          { plate: "AB123CD", driverId: "1" },
          { plate: "EF456GH", driverId: "1" },
          { plate: "IJ789KL", driverId: "2" },
        ]);
        setActivitiesData(generateMockData());
        setLoading(false);
      }, 500);
    }
  }, [apiActivitiesData, driverId, startDate, endDate, vehicleFilter]);

  const handleDateChange = (newDate, isStart = true) => {
    if (isStart) {
      if (newDate && endDate) {
        const diffInDays = endDate.diff(newDate, "days");
        if (diffInDays > 6) {
          setErrorDialog({
            open: true,
            message: "Maximum date range is 7 days",
          });
          return;
        }
        if (newDate.isAfter(dayjs())) {
          setErrorDialog({
            open: true,
            message: "Future dates are not allowed",
          });
          return;
        }
      }
      setStartDate(newDate);
    } else {
      if (newDate && startDate) {
        const diffInDays = newDate.diff(startDate, "days");
        if (diffInDays > 6) {
          setErrorDialog({
            open: true,
            message: "Maximum date range is 7 days",
          });
          return;
        }
        if (newDate.isAfter(dayjs())) {
          setErrorDialog({
            open: true,
            message: "Future dates are not allowed",
          });
          return;
        }
      }
      setEndDate(newDate);
    }
  };

  const handleReset = () => {
    setStartDate(dayjs().subtract(6, "days"));
    setEndDate(dayjs());
    if (!propDriverId) setDriverId(null);
    setVehicleFilter(null);
    setSuccessMessage("Reset to last 7 days");
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const shouldDisableDate = (date) => date && date > dayjs().endOf("day");

  const chartSeries = DRIVER_STATE_KEYS.map((stateKey) => ({
    name: DRIVER_STATES[stateKey].name,
    data: activitiesData.map((day) =>
      day.isEmpty
        ? 0
        : day.states
            .filter((s) => s.state === stateKey)
            .reduce((sum, s) => sum + s.duration, 0) / 60
    ),
  }));

  const barHeightPx = (420 * 0.8) / (activitiesData.length || 7);

  const chartOptions = {
    chart: {
      type: "bar",
      stacked: true,
      height: 420,
      toolbar: { show: false },
      animations: { enabled: true },
    },
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: "80%",
        borderRadius: 6,
      },
    },
    xaxis: {
      min: 0,
      max: 24,
      tickAmount: 6,
      title: { text: "Time (hours)" },
      labels: {
        formatter: (val) => `${val}:00`,
        style: { fontWeight: "600" },
      },
    },
    yaxis: {
      categories:
        activitiesData.length > 0
          ? activitiesData.map((day) => day.dateObj.format("ddd"))
          : [],
      title: { text: "Day" },
      labels: {
        style: { fontWeight: "600" },
      },
    },
    colors: DRIVER_STATE_KEYS.map((k) => DRIVER_STATES[k].color),
    tooltip: {
      shared: false,
      intersect: true,
      custom: function ({ series, seriesIndex, dataPointIndex, w }) {
        const seriesName = w.globals.seriesNames[seriesIndex];
        const value = series[seriesIndex][dataPointIndex];
        if (value === 0) return "";

        return `
          <div class="custom-tooltip" style="padding: 8px; background: white; border-radius: 4px; box-shadow: 0 2px 6px rgba(0,0,0,0.15);">
            <div style="font-weight: 600; color: black">${seriesName}: ${value.toFixed(2)}h</div>
          </div>
        `;
      },
    },
    legend: { show: false },
    dataLabels: { enabled: false },
    grid: { xaxis: { lines: { show: false } } },
  };

  const getDataSourceIndicator = (dataSource) => {
    if (dataSource === DATA_SOURCES.DDD_OVERWRITE) {
      return {
        borderLeft: "4px solid #4caf50",
        backgroundColor: "rgba(76, 175, 80, 0.05)",
      };
    }
    return {};
  };

  const getDataSourceChip = (dataSource) => {
    if (dataSource === DATA_SOURCES.DDD_OVERWRITE) {
      return (
        <Chip
          label="DDD Data"
          size="small"
          sx={{
            backgroundColor: "#4caf50",
            color: "white",
            fontSize: "0.7rem",
            height: "20px",
          }}
        />
      );
    }
    return null;
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Card sx={{ margin: 2 }}>
        <CardContent>
          {/* Header */}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mt: 5, mb: 4 }}
          >
            <Box display="flex" alignItems="center">
              {fromVehicleView && (
                <Button
                  startIcon={<ArrowBack />}
                  onClick={() => window.history.back()}
                  sx={{ mr: 2 }}
                />
              )}
              <Typography variant="h5" component="h1">
                Driver Activities
              </Typography>
            </Box>
            <Button
              startIcon={<Refresh />}
              onClick={handleReset}
              variant="contained"
            >
              Reset to Last 7 Days
            </Button>
          </Box>

          {/* Success Message */}
          {successMessage && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {successMessage}
            </Alert>
          )}

          {/* Filters */}
          <Grid container spacing={2} sx={{ mb: 2 }}>
            {!propDriverId && (
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Select Driver</InputLabel>
                  <Select
                    value={driverId || ""}
                    onChange={(e) => setDriverId(e.target.value || null)}
                    label="Select Driver"
                  >
                    <MenuItem value="">Clear Selection</MenuItem>
                    {drivers.map((driver) => (
                      <MenuItem key={driver.id} value={driver.id}>
                        {driver.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            )}
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Filter by Vehicle</InputLabel>
                <Select
                  value={vehicleFilter || ""}
                  onChange={(e) => setVehicleFilter(e.target.value || null)}
                  label="Filter by Vehicle"
                >
                  <MenuItem value="">Clear Filter</MenuItem>
                  {vehicles
                    .filter((v) => !driverId || v.driverId === driverId)
                    .map((vehicle) => (
                      <MenuItem key={vehicle.plate} value={vehicle.plate}>
                        {vehicle.plate}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <DatePicker
                label="Start Date"
                value={startDate}
                onChange={(newValue) => handleDateChange(newValue, true)}
                shouldDisableDate={shouldDisableDate}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <DatePicker
                label="End Date"
                value={endDate}
                onChange={(newValue) => handleDateChange(newValue, false)}
                shouldDisableDate={shouldDisableDate}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </Grid>
          </Grid>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Maximum date range: 7 days
          </Typography>

          {/* Driver and Date Info */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6">
              {driverId
                ? drivers.find((d) => d.id === driverId)?.name
                : "Select a driver"}{" "}
              • {startDate?.format("MMM D") || "N/A"} -{" "}
              {endDate?.format("MMM D, YYYY") || "N/A"}
              {vehicleFilter && ` • Vehicle: ${vehicleFilter}`}
            </Typography>
          </Box>

          {/* Chart and Commitment Data */}
          <Box
            display="flex"
            gap={3}
            sx={{
              overflowX: "auto",
              alignItems: "flex-start",
            }}
          >
            <Box sx={{ flex: 1, minWidth: 700 }}>
              <ReactApexChart
                options={chartOptions}
                series={chartSeries}
                type="bar"
                height={420}
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
                minWidth: 150,
                mt: 3,
                fontSize: 14,
              }}
            >
              {activitiesData.map((day, idx) => (
                <Box
                  key={idx}
                  sx={{
                    height: `${barHeightPx}px`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderBottom:
                      idx !== activitiesData.length - 1
                        ? "1px solid #f0f0f0"
                        : "none",
                    boxSizing: "border-box",
                    px: 1,
                    ...getDataSourceIndicator(day.dataSource),
                  }}
                >
                  <Box display="flex" flexDirection="column" alignItems="flex-start">
                    <Typography variant="body2">Commitment:</Typography>
                    {getDataSourceChip(day.dataSource)}
                  </Box>
                  <Typography variant="body2" fontWeight="bold">
                    {day.commitment}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Legend */}
          <Box>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Legend
            </Typography>
            <Grid container spacing={2}>
              {Object.entries(DRIVER_STATES).map(([key, config]) => (
                <Grid item key={key} xs={12} sm={6} md={4} lg={3}>
                  <Box display="flex" alignItems="center" sx={{ mb: 1 }}>
                    <Box
                      sx={{
                        backgroundColor: config.color,
                        width: 20,
                        height: 20,
                        mr: 1,
                        borderRadius: 1,
                      }}
                    />
                    <Typography variant="body2">{config.name}</Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
            
            {/* Data Source Legend */}
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Data Source Indicators:
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Box display="flex" alignItems="center">
                    <Box
                      sx={{
                        width: 20,
                        height: 20,
                        borderLeft: "4px solid #4caf50",
                        backgroundColor: "rgba(76, 175, 80, 0.05)",
                        mr: 1,
                      }}
                    />
                    <Typography variant="body2">
                      Data overwritten by DDD file
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box display="flex" alignItems="center">
                    <Box
                      sx={{
                        width: 20,
                        height: 20,
                        border: "1px solid #e0e0e0",
                        mr: 1,
                      }}
                    />
                    <Typography variant="body2">
                      Data from tacho service
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Box>

          {/* Error Dialog */}
          <Dialog
            open={errorDialog.open}
            onClose={() => setErrorDialog({ open: false, message: "" })}
          >
            <DialogTitle>Invalid Selection</DialogTitle>
            <DialogContent>
              <Typography>{errorDialog.message}</Typography>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => setErrorDialog({ open: false, message: "" })}
                color="primary"
              >
                OK
              </Button>
            </DialogActions>
          </Dialog>
        </CardContent>
      </Card>
    </LocalizationProvider>
  );
};

export default DriverActivities;