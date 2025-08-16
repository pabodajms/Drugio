import React from "react";
import { Card } from "react-bootstrap";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const DashboardChart = ({ chartData }) => {
  return (
    <Card className="shadow-sm border-0">
      <Card.Header className="fw-semibold bg-light">
        Weekly Prescription Upload Trend
      </Card.Header>
      <Card.Body>
        <Bar
          data={chartData}
          options={{
            responsive: true,
            plugins: { legend: { position: "top" } },
          }}
        />
      </Card.Body>
    </Card>
  );
};

export default DashboardChart;
