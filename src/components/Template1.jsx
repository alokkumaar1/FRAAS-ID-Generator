import { QRCodeSVG } from "qrcode.react"
import "../styles/Template1.css"

const Template1 = ({ studentData, qrCodeData }) => {
  return (
    <div className="template1">
      <div className="card-header">
        <h2>UNITY SCHOOL</h2>
        <p>Student Identification Card</p>
      </div>

      <div className="card-body">
        <div className="card-left">
          <div className="student-photo">
            <img src={studentData.photoPreview || "/placeholder.svg"} alt={studentData.name} />
          </div>

          <div className="qr-code">
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

        <div className="card-right">
          <table className="student-details">
            <tbody>
              <tr>
                <td className="detail-label">Name:</td>
                <td>{studentData.name}</td>
              </tr>
              <tr>
                <td className="detail-label">Roll Number:</td>
                <td>{studentData.rollNumber}</td>
              </tr>
              <tr>
                <td className="detail-label">Class:</td>
                <td>{studentData.classDiv}</td>
              </tr>
              <tr>
                <td className="detail-label">Rack Number:</td>
                <td>{studentData.rackNumber}</td>
              </tr>
              <tr>
                <td className="detail-label">Bus Route:</td>
                <td>{studentData.busRouteNumber}</td>
              </tr>
              {studentData.allergies.length > 0 && (
                <tr>
                  <td className="detail-label">Allergies:</td>
                  <td>
                    <div className="allergies-list">
                      {studentData.allergies.map((allergy) => (
                        <span key={allergy} className="allergy-tag">
                          {allergy}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card-footer">
        <p>This card is the property of Unity School. If found, please return to the Unity school office.</p>
        <p>Valid for Academic Year 2025-2026</p>
      </div>
    </div>
  )
}

export default Template1
