import { useLocation, useNavigate } from "react-router-dom";
import "./Details.css";

function Details() {
  const location = useLocation();
  const navigate = useNavigate();

  const employee = location.state;

  if (!employee) {
    return (
      <div className="details-container">
        <h2>No employee data found</h2>
        <button onClick={() => navigate("/list")}>
          Back to Home
        </button>
      </div>
    );
  }

  const savedPhoto = localStorage.getItem(
    `photo_${employee.EmpId}`
  );

  return (
    <div className="details-container">
<div className="details-card">
  <h2 className="details-heading">Employee Details</h2>

  <div className="details-content">
    <div className="details-left">

            <p><strong>Name:</strong> {employee.name}</p>
            <p><strong>Role:</strong> {employee.role}</p>
            <p><strong>City:</strong> {employee.city}</p>
            <p><strong>Employee ID:</strong> {employee.EmpId}</p>
            <p><strong>Joining Date:</strong> {employee.JoiningDate}</p>
            <p><strong>Salary:</strong> {employee.salary}</p>

            <div className="details-buttons">
              <button onClick={() => navigate(-1)}>
                Back
              </button>

              <button
                onClick={() => navigate("/photo", { state: employee })}
              >
                {savedPhoto ? "Retake Photo" : "Capture Photo"}
              </button>
            </div>
          </div>

          <div className="details-right">
            {savedPhoto ? (
              <img
                src={savedPhoto}
                alt="Employee"
                className="employee-photo"
              />
            ) : (
              <div className="photo-placeholder">
                No Photo
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

export default Details;