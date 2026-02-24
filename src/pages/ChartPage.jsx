import { useLocation, useNavigate } from "react-router-dom";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import "./Chart.css";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

function ChartPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const employees = location.state || [];

  const firstTen = employees.slice(0, 10);

  const names = firstTen.map((emp) => emp.name);
  const salaries = firstTen.map((emp) =>
    Number(emp.salary.replace(/[^0-9.-]+/g, ""))
  );

  const data = {
    labels: names,
    datasets: [
      {
        label: "Salary",
        data: salaries,
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  };

  return (
    <div className="chart-container">
      <h2>Salary Chart (Top 10 Employees)</h2>

      <Bar data={data} />

      <button onClick={() => navigate("/list")}>Back</button>
    </div>
  );
}

export default ChartPage;