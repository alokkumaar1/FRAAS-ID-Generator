import { useRef } from "react"
import { toPng } from "html-to-image"
import { QRCodeSVG } from "qrcode.react"
import "../styles/IdCardPreview.css"

function IdCardPreview({ studentData }) {
  const cardRef = useRef(null)

  const detailLabel = studentData.mode === "professional" ? "Designation" : "Class / Division"
  const detailValue = studentData.mode === "professional" ? studentData.designation : studentData.classDivision
  const cardTypeTitle = studentData.mode === "professional" ? "Official Professional Identity Card" : "Official Student Identity Card"

  const hasRequiredData =
    studentData.name.trim() &&
    studentData.idNumber.trim() &&
    detailValue &&
    studentData.organizationName.trim() &&
    studentData.photoPreview

  const verificationPayload = [
    "FRAAS STUDENT ID",
    `Organization: ${studentData.organizationName || "N/A"}`,
    `Mode: ${studentData.mode === "professional" ? "Professional" : "Student"}`,
    `Name: ${studentData.name || "N/A"}`,
    `${detailLabel}: ${detailValue || "N/A"}`,
    `ID: ${studentData.idNumber || "N/A"}`,
  ].join("\n")

  const handleDownload = async () => {
    if (!cardRef.current || !hasRequiredData) {
      return
    }

    try {
      const image = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 2.2,
      })

      const link = document.createElement("a")
      link.download = `${studentData.name.replace(/\s+/g, "-")}-${studentData.idNumber}.png`
      link.href = image
      link.click()
    } catch (error) {
      console.error("Unable to export ID card", error)
    }
  }

  return (
    <div className="id-card-preview">
      <div className="preview-stage">
        <div ref={cardRef} className="premium-id-card">
          <div className="card-top">
            <div className="brand-row">
              <div className="logo-chip">
                {studentData.logoPreview ? (
                  <img src={studentData.logoPreview} alt="Organization logo" />
                ) : (
                  <span>LOGO</span>
                )}
              </div>
              <div>
                <p className="school-name">{studentData.organizationName || "Organization / School"}</p>
                <p className="card-subtitle">{cardTypeTitle}</p>
              </div>
            </div>
          </div>

          <div className="card-body">
            <div className="photo-wrap">
              {studentData.photoPreview ? (
                <img src={studentData.photoPreview} alt="Student" />
              ) : (
                <div className="photo-placeholder">Photo</div>
              )}
            </div>

            <div className="student-details">
              <p className="detail-label">Student Name</p>
              <p className="detail-value">{studentData.name || "-"}</p>

              <p className="detail-label">{detailLabel}</p>
              <p className="detail-value">{detailValue || "-"}</p>

              <p className="detail-label">ID Number</p>
              <p className="detail-value">{studentData.idNumber || "Auto-generated"}</p>
            </div>

            <div className="qr-wrap" aria-label="Verification QR">
              <QRCodeSVG
                value={verificationPayload}
                size={102}
                bgColor="#ffffff"
                fgColor="#0f172a"
                level="M"
                includeMargin
              />
              <p>Verification QR</p>
            </div>
          </div>

          <div className="card-footer">
            <span>FRAAS ID Generator</span>
            <span>Verified</span>
          </div>
        </div>
      </div>

      <button className="download-btn" onClick={handleDownload} disabled={!hasRequiredData}>
        Download as PNG
      </button>
      {!hasRequiredData && <p className="helper-text">Complete all fields to enable download.</p>}
    </div>
  )
}

export default IdCardPreview
