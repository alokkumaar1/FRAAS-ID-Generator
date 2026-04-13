import { useState } from "react"
import StudentForm from "./components/StudentForm"
import IdCardPreview from "./components/IdCardPreview"
import "./App.css"

const initialStudentData = {
  mode: "student",
  name: "",
  idNumber: "",
  classDivision: "",
  designation: "",
  organizationSelection: "",
  organizationName: "",
  address: "",
  issueDate: "",
  expiryDate: "",
  additionalDetails: "",
  photoPreview: "",
  logoPreview: "",
}

function App() {
  const [studentData, setStudentData] = useState(initialStudentData)
  const [isGenerated, setIsGenerated] = useState(false)

  const handleFieldChange = (field, value) => {
    setStudentData((prev) => ({ ...prev, [field]: value }))
    setIsGenerated(false)
  }

  const handleGenerate = () => {
    setStudentData((prev) => {
      if (prev.idNumber.trim()) {
        return prev
      }

      const modeCode = prev.mode === "professional" ? "PRO" : "STU"
      const uniqueCode = String(Date.now()).slice(-6)
      return {
        ...prev,
        idNumber: `FRAAS-${modeCode}-${uniqueCode}`,
      }
    })
    setIsGenerated(true)
  }

  return (
    <div className="app-shell">
      <div className="ambient-shape ambient-one" aria-hidden="true" />
      <div className="ambient-shape ambient-two" aria-hidden="true" />

      <main className="container">
        <header className="app-header">
          <p className="eyebrow">FRAAS Platform</p>
          <h1>FRAAS ID Generator</h1>
          <p className="subheading">Create premium Student and Professional ID cards with live preview and one-click PNG export.</p>
        </header>

        <section className="app-layout">
          <div className="panel form-panel">
            <StudentForm data={studentData} onFieldChange={handleFieldChange} onGenerate={handleGenerate} />
          </div>

          <div className="panel preview-panel">
            <div className="preview-headline">
              <h2>Live ID Preview</h2>
              {isGenerated && <span className="generated-pill">Ready</span>}
            </div>
            <IdCardPreview studentData={studentData} />
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
