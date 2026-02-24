import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Photo.css";

function Photo() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [stream, setStream] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();
  const employee = location.state;

  useEffect(() => {
    startCamera();

    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }

      setStream(mediaStream);
    } catch (error) {
      console.error("Camera access denied:", error);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const capturePhoto = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0);

    const imageData = canvas.toDataURL("image/png");

    setPreviewImage(imageData);
    stopCamera(); 
  };

  const handleConfirm = () => {
    if (!employee?.EmpId) {
      alert("Employee ID not found.");
      return;
    }

    localStorage.setItem(`photo_${employee.EmpId}`, previewImage);

    navigate("/photo-result", { state: { employee } });
  };

  const handleRetake = () => {
    setPreviewImage(null);
    startCamera();
  };

  if (!employee) {
    return <h2>No Employee Selected</h2>;
  }

  return (
    <div className="photo-container">
      <h2>Capture Employee Photo</h2>

      {!previewImage ? (
        <>
          <video ref={videoRef} autoPlay className="video-preview" />
          <button onClick={capturePhoto}>Capture</button>
        </>
      ) : (
        <div className="preview-section">
          <img
            src={previewImage}
            alt="Preview"
            className="preview-image"
          />

          <div className="preview-buttons">
            <button onClick={handleConfirm}>Use This Photo</button>
            <button onClick={handleRetake}>Retake</button>
          </div>
        </div>
      )}

      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
}

export default Photo;