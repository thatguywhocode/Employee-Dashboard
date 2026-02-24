import { useLocation, useNavigate } from "react-router-dom";
import { useMap } from "react-leaflet";
import { useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { MapContainer, TileLayer, Marker, Tooltip as LeafletTooltip } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./Analytics.css";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

function AutoFitBounds({ positions }) {
  const map = useMap();

  useEffect(() => {
    if (positions.length > 0) {
      const bounds = L.latLngBounds(positions);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [positions, map]);

  return null;
}

function Analytics() {

  const navigate = useNavigate();
const location = useLocation();

const employees =
  location.state ||
  JSON.parse(localStorage.getItem("employees")) ||
  [];

  const numericEmployees = employees.map(emp => ({
  ...emp,
  numericSalary: Number(emp.salary.replace(/[^0-9.-]+/g, ""))
}));

const totalEmployees = employees.length;

const highestSalary = Math.max(
  ...numericEmployees.map(emp => emp.numericSalary)
);

const averageSalary =
  numericEmployees.reduce((acc, emp) => acc + emp.numericSalary, 0) /
  (numericEmployees.length || 1);

const totalCities = new Set(employees.map(emp => emp.city)).size;

const sortedEmployees = [...employees]
  .map(emp => ({
    ...emp,
    numericSalary: Number(emp.salary.replace(/[^0-9.-]+/g, ""))
  }))
  .sort((a, b) => b.numericSalary - a.numericSalary)
  .slice(0, 10);

const names = sortedEmployees.map(emp => emp.name);
const salaries = sortedEmployees.map(emp => emp.numericSalary);

const chartData = {
  labels: names,
  datasets: [
    {
      label: "Salary",
      data: salaries,
      borderRadius: 8,
      barThickness: 42,
      backgroundColor: (context) => {
        const chart = context.chart;
        const { ctx, chartArea } = chart;

        if (!chartArea) return null;

        const gradient = ctx.createLinearGradient(
          0,
          chartArea.top,
          0,
          chartArea.bottom
        );

        gradient.addColorStop(0, "rgba(75, 192, 192, 0.9)");
        gradient.addColorStop(1, "rgba(75, 192, 192, 0.4)");

        return gradient;
      },
    },
  ],
};

const chartOptions = {
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
  },
  scales: {
    x: {
      ticks: {
        color: "#ffffff",
        font: {
          size: 12,
          weight: "600",   
        },
      },
      grid: {
        display: false,
      },
    },
    y: {
      ticks: {
        color: "#ffffff",
        font: {
          weight: "500",
        },
        callback: function (value) {
          return value / 1000 + "k";
        },
      },
      grid: {
        color: "rgba(253, 250, 250, 0.08)",
      },
    },
  },
};

  const cityCoordinates = {
    Edinburgh: [55.9533, -3.1883],
    London: [51.5074, -0.1278],
    Tokyo: [35.6762, 139.6503],
    "New York": [40.7128, -74.006],
    "San Francisco": [37.7749, -122.4194],
  };
const cityCount = {};

employees.forEach(emp => {
  cityCount[emp.city] = (cityCount[emp.city] || 0) + 1;
});

const topCities = Object.entries(cityCount)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 10);
 const markerPositions = topCities
  .map(([city]) => cityCoordinates[city])
  .filter(Boolean);
  return (
  <div className="analytics-container">
    <div className="analytics-header">

      <h2>Employee Analytics</h2>
      <p className="analytics-subtitle">
        Salary Insights & Workforce Distribution
      </p>
    </div>

    <div className="analytics-sections">
        <div className="summary-grid">

  <div className="summary-card">
    <h4>Total Employees</h4>
    <p>{totalEmployees}</p>
  </div>

  <div className="summary-card">
    <h4>Highest Salary</h4>
    <p>${highestSalary.toLocaleString()}</p>
  </div>

  <div className="summary-card">
    <h4>Average Salary</h4>
    <p>${Math.round(averageSalary).toLocaleString()}</p>
  </div>

  <div className="summary-card">
    <h4>Total Cities</h4>
    <p>{totalCities}</p>
  </div>

</div>


      <div className="analytics-card chart-section">
        <div className="card-header">
          <h3>Top 10 Salary Distribution</h3>
        </div>

        <div className="card-body">
          <Bar data={chartData} options={chartOptions} />
        </div>
      </div>

      {/* ---------- MAP CARD ---------- */}
      <div className="analytics-card map-section">
        <div className="card-header">
          <h3>Employee Location Overview</h3>
        </div>

        <div className="card-body">
<MapContainer
  zoom={2}
  scrollWheelZoom={true}
  style={{ height: "350px", width: "100%" }}
>
  <TileLayer
    attribution="© OpenStreetMap contributors"
    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  />

  <AutoFitBounds positions={markerPositions} />

  {topCities.map(([city, count], index) => {
  const coords = cityCoordinates[city];
  if (!coords) return null;

  return (
    <Marker key={index} position={coords}>
      <LeafletTooltip direction="top" offset={[0, -10]} opacity={1}>
        <strong>{city}</strong>
        <br />
        Employees: {count}
      </LeafletTooltip>
    </Marker>
    );
  })}
</MapContainer>
        </div>
      </div>

    </div>

    <button className="back-btn" onClick={() => navigate("/list")}>
      Back to Home
    </button>
  </div>
);
}

export default Analytics;