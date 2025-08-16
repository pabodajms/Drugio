import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPrescriptionDetails } from "../../services/prescriptionServices";
import { Card, Button, Spinner, Table } from "react-bootstrap";

const PrescriptionDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [prescription, setPrescription] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const data = await getPrescriptionDetails(id);
        setPrescription(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  if (loading) return <Spinner animation="border" />;

  if (!prescription) return <p>No details found.</p>;

  return (
    <div>
      <Button variant="secondary" onClick={() => navigate(-1)} className="mb-3">
        Back
      </Button>

      <h2>Prescription #{prescription.prescription_Id}</h2>

      <Card className="mb-3">
        <Card.Body>
          <p>
            <strong>User ID:</strong> {prescription.user_Id}
          </p>
          <p>
            <strong>Uploaded:</strong>{" "}
            {new Date(prescription.uploaded_at).toLocaleString()}
          </p>
          <p>
            <strong>Comment:</strong>{" "}
            {prescription.comment || "No comment provided"}
          </p>
          <div>
            <strong>Image:</strong>
            <br />
            <img
              src={prescription.image_url}
              alt="Prescription"
              style={{
                maxWidth: "400px",
                border: "1px solid #ccc",
                marginTop: "10px",
              }}
            />
          </div>
        </Card.Body>
      </Card>

      <h4>Pharmacist Responses</h4>
      {prescription.responses.length === 0 ? (
        <p>No responses yet.</p>
      ) : (
        <Table bordered hover responsive>
          <thead>
            <tr>
              <th>Pharmacist</th>
              <th>Suggested Medicines</th>
              <th>Directions</th>
              <th>Comment</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {prescription.responses.map((r) => (
              <tr key={r.response_Id}>
                <td>{r.pharmacist_name}</td>
                <td>{r.suggested_medicines}</td>
                <td>{r.directions}</td>
                <td>{r.pharmacist_comment}</td>
                <td>{new Date(r.response_date).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default PrescriptionDetailsPage;
