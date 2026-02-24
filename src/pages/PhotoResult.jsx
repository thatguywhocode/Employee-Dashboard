import { useLocation, useNavigate } from "react-router-dom";
import "./Photo.css";

function PhotoResult() {
  const location = useLocation();
  const navigate = useNavigate();

const { employee } = location.state || {};

const savedImage = localStorage.getItem(`photo_${employee?.EmpId}`);

if (!savedImage) {
  return <h2>No Image Found</h2>;
}

return (
  <div className="photo-container">
    <h2>Captured Photo</h2>

    <img src={savedImage} alt="Captured" className="captured-image" />

    <p><strong>Name:</strong> {employee?.name}</p>

    <button onClick={() => navigate("/list")}>
      Back to Home
    </button>
  </div>
);
}

export default PhotoResult;