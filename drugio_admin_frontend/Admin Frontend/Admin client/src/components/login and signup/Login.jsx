import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../../config/firebase";
import { Container, Form, Button, Alert, Card } from "react-bootstrap";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const token = await userCredential.user.getIdToken();

      const response = await fetch(
        "http://localhost:3030/api/admin/dashboard",
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.ok) {
        navigate("/admin-dashboard");
      } else {
        const resData = await response.json();
        throw new Error(resData.message || "Login failed");
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Card className="p-4 shadow-lg" style={{ width: "400px" }}>
        <h2 className="text-center mb-4 text-primary">Admin Login</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleLogin}>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>
          <Button type="submit" className="w-100">
            Login
          </Button>
        </Form>
        <p className="mt-3 text-center">
          Don't have an account? <a href="/signup">Sign up here</a>
        </p>
      </Card>
    </Container>
  );
};

export default Login;
