import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import SignUp from "./components/login and signup/SignUp";
import Login from "./components/login and signup/Login";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Footer from "./components/Footer";
import MedicineTable from "./components/medicine/MedicineTable";
import MedicineDetails from "./components/medicine/MedicineDetails";
import AddMedicinePage from "./components/medicine/AddMedicinePage";
import UpdateMedicineForm from "./components/medicine/UpdateMedicineForm";
import PharmacyTable from "./components/pharmacy/PharmacyTable";
import PharmacyDetails from "./components/pharmacy/PharmacyDetails";
import AddPharmacy from "./components/pharmacy/AddPharmacy";
import UpdatePharmacy from "./components/pharmacy/UpdatePharmacy";
import DashboardPage from "./components/dashboard/DashboardPage";
import PrescriptionMonitoringTable from "./components/prescriptions/PrescriptionMonitoringTable";
import PrescriptionDetailsPage from "./components/prescriptions/PrescriptionDetailsPage";
import "bootstrap/dist/css/bootstrap.min.css";

const Settings = () => <div></div>;

function Layout() {
  const location = useLocation();
  const hideSidebarRoutes = ["/login", "/signup"];

  return (
    <div className="d-flex">
      {!hideSidebarRoutes.includes(location.pathname) && <Sidebar />}
      <div className="flex-grow-1">
        {!hideSidebarRoutes.includes(location.pathname) && <Header />}
        <div className="container mt-5">
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin-dashboard" element={<DashboardPage />} />
            <Route path="/medicines" element={<MedicineTable />} />
            <Route
              path="/medicine/medicinedetails/:id"
              element={<MedicineDetails />}
            />
            <Route path="/medicine/add" element={<AddMedicinePage />} />
            <Route
              path="/medicine/update/:id"
              element={<UpdateMedicineForm />}
            />
            <Route path="/pharmacies" element={<PharmacyTable />} />{" "}
            <Route
              path="/pharmacy/pharmacydetails/:id"
              element={<PharmacyDetails />}
            />
            <Route path="/pharmacy/add" element={<AddPharmacy />} />
            <Route path="/pharmacy/update/:id" element={<UpdatePharmacy />} />
            <Route
              path="/prescriptions"
              element={<PrescriptionMonitoringTable />}
            />
            <Route
              path="/prescriptions/:id"
              element={<PrescriptionDetailsPage />}
            />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </div>
        {!hideSidebarRoutes.includes(location.pathname) && <Footer />}
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;
