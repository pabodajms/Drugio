import React from "react";
import { Card, Row, Col } from "react-bootstrap";
import { FaPills, FaStore, FaUserMd, FaUpload, FaClock } from "react-icons/fa";

const DashboardStats = ({ stats }) => {
  const cards = [
    {
      title: "Total Medicines",
      value: stats.totalMedicines,
      icon: <FaPills size={28} />,
    },
    {
      title: "Total Pharmacies",
      value: stats.totalPharmacies,
      icon: <FaStore size={28} />,
    },
    {
      title: "Active Pharmacists",
      value: stats.activePharmacists,
      icon: <FaUserMd size={28} />,
    },
    {
      title: "Prescriptions Uploaded Today",
      value: stats.prescriptionsToday,
      icon: <FaUpload size={28} />,
    },
    {
      title: "Pending Responses",
      value: stats.pendingResponses,
      icon: <FaClock size={28} />,
    },
  ];

  return (
    <Row className="mb-4">
      {cards.map((card, idx) => (
        <Col md={4} lg={2} key={idx} className="mb-3">
          <Card className="text-center shadow-sm h-100 border-0">
            <Card.Body>
              <div className="mb-2 text-primary">{card.icon}</div>
              <Card.Title className="fw-semibold">{card.title}</Card.Title>
              <h4 className="fw-bold">{card.value}</h4>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default DashboardStats;
