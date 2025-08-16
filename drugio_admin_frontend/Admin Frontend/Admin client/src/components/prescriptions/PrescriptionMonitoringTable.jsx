import React, { useEffect, useState } from "react";
import { getPrescriptionMonitoring } from "../../services/prescriptionServices";
import { Table, Spinner, Button, Pagination } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const PrescriptionMonitoringTable = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Show 10 rows per page
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getPrescriptionMonitoring();
        setPrescriptions(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <Spinner animation="border" />;

  // Pagination logic
  const totalPages = Math.ceil(prescriptions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = prescriptions.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div>
      <h2 className="mb-4">Prescription Monitoring</h2>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Prescription ID</th>
            <th>Uploaded Date & Time</th>
            <th>User ID</th>
            <th>Pharmacist Responses</th>
            <th>Status</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((p) => (
            <tr key={p.prescription_Id}>
              <td>{p.prescription_Id}</td>
              <td>{new Date(p.uploaded_at).toLocaleString()}</td>
              <td>{p.user_Id}</td>
              <td>{p.response_count}</td>
              <td>
                <span
                  className={
                    p.status === "Responded" ? "text-success" : "text-warning"
                  }
                >
                  {p.status}
                </span>
              </td>
              <td>
                <Button
                  size="sm"
                  onClick={() =>
                    navigate(`/prescriptions/${p.prescription_Id}`)
                  }
                >
                  View
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Pagination Controls */}
      <Pagination className="justify-content-center">
        <Pagination.Prev
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        />
        {[...Array(totalPages)].map((_, index) => (
          <Pagination.Item
            key={index + 1}
            active={index + 1 === currentPage}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </Pagination.Item>
        ))}
        <Pagination.Next
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        />
      </Pagination>
    </div>
  );
};

export default PrescriptionMonitoringTable;
