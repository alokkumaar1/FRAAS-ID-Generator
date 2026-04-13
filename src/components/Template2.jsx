import { QRCodeSVG } from "qrcode.react"
import "../styles/Template2.css"

const Template2 = ({ studentData, qrCodeData }) => {
  return (
    <div className="template2">
      <div className="card-header-t2">
        <div className="school-logo">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z" />
          </svg>
        </div>
        <div className="school-info">
          <h2>UNITY ACADEMY</h2>
          <p>Excellence in Education</p>
        </div>
      </div>

      <div className="card-body-t2">
        <div className="student-profile">
          <div className="student-photo-t2">
            <img src={studentData.photoPreview || "/placeholder.svg"} alt={studentData.name} />
          </div>
          <h3>{studentData.name}</h3>
          <p>{studentData.classDiv}</p>
        </div>

        <div className="details-container">
          <div className="student-details-t2">
            <h4>Student Details</h4>
            <p>
              <span>Roll No:</span> {studentData.rollNumber}
            </p>
            <p>
              <span>Rack No:</span> {studentData.rackNumber}
            </p>
            <p>
              <span>Bus:</span> {studentData.busRouteNumber.split(":")[0]}
            </p>
          </div>

          <div className="qr-code-t2">
            <QRCodeSVG
              value={qrCodeData}
              size={100}
              bgColor={"#ffffff"}
              fgColor={"#000000"}
              level={"L"}
              includeMargin={false}
            />
          </div>
        </div>

        {studentData.allergies.length > 0 && (
          <div className="allergies-section">
            <h4>Medical Alert - Allergies</h4>
            <div className="allergies-list-t2">
              {studentData.allergies.map((allergy) => (
                <span key={allergy} className="allergy-tag-t2">
                  {allergy}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="card-footer-t2">
        <div className="footer-left">
          <p>ID: {studentData.id}</p>
          <p>Route: {studentData.busRouteNumber.split(":")[1]}</p>
        </div>
        <div className="footer-right">
          <p>Valid until: May 31, 2026</p>
          <p>Emergency: +108</p>
        </div>
      </div>
    </div>
  )
}

export default Template2
