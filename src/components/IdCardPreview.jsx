import { useRef } from "react";
import { toPng } from "html-to-image";
import Template1 from "./Template1";
import Template2 from "./Template2";
import "../styles/IdCardPreview.css";

const IdCardPreview = ({ studentData, template }) => {
  const cardRef = useRef(null);

  const handleDownload = async () => {
    if (cardRef.current) {
      try {
        const dataUrl = await toPng(cardRef.current, { quality: 0.95 });

        const link = document.createElement("a");
        link.download = `${studentData.name.replace(/\s+/g, "-")}-ID-Card.png`;
        link.href = dataUrl;
        link.click();
      } catch (error) {
        console.error("Error generating image:", error);
      }
    }
  };

  const qrCodeData = JSON.stringify({
    name: studentData.name,
    rollNumber: studentData.rollNumber,
    classDiv: studentData.classDiv,
    rackNumber: studentData.rackNumber,
    busRouteNumber: studentData.busRouteNumber,
  });

  return (
    <div className="id-card-preview">
      <div ref={cardRef} className="card-container">
        {template === "template1" ? (
          <Template1 studentData={studentData} qrCodeData={qrCodeData} />
        ) : (
          <Template2 studentData={studentData} qrCodeData={qrCodeData} />
        )}
      </div>

      <button onClick={handleDownload} className="download-btn">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
          <polyline points="7 10 12 15 17 10"></polyline>
          <line x1="12" y1="15" x2="12" y2="3"></line>
        </svg>
        Download as PNG
      </button>
    </div>
  );
};

export default IdCardPreview;
