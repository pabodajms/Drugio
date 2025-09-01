import React, { useEffect, useState } from "react";
import DashboardStats from "./DashboardStats";
import DashboardTable from "./DashboardTable";
import DashboardChart from "./DashboardChart";
import { fetchDashboardData } from "../../services/dashboardServices";
import { Container, Row, Col } from "react-bootstrap";

const DashboardPage = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchDashboardData().then(setData).catch(console.error);
  }, []);

  if (!data) return <p>Loading...</p>;

  const chartData = {
    labels: data.monthlyTrend.map((item) => item.month),
    datasets: [
      {
        label: "Prescriptions",
        data: data.monthlyTrend.map((item) => item.count),
        backgroundColor: "rgba(80, 152, 204, 0.6)",
      },
    ],
  };

  return (
    <Container fluid className="p-4 mt-5">
      <DashboardStats stats={data} />

      <Row>
        <Col md={6} lg={5}>
          <DashboardTable
            recentActivity={data.recentActivity}
            notifications={data.notifications}
          />
        </Col>
        <Col md={6} lg={7}>
          <DashboardChart chartData={chartData} />
        </Col>
      </Row>
    </Container>
  );
};

export default DashboardPage;
