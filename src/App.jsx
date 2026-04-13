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
  const currentYear = new Date().getFullYear()

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

        <footer className="ownership-footer" aria-label="Project ownership">
          <p>
            Built and maintained by <strong>Alok Kumar</strong> | Copyright (c) {currentYear}
          </p>
          <div className="owner-links">
            <a href="https://www.linkedin.com/in/alokkumar48" target="_blank" rel="noreferrer">
              LinkedIn
            </a>
            <a href="https://alokkumar.vercel.app/" target="_blank" rel="noreferrer">
              Portfolio
            </a>
          </div>
          <span
            className="build-signature"
            aria-hidden="true"
            data-owner="Alok Kumar"
            data-linkedin="https://www.linkedin.com/in/alokkumar48"
            data-portfolio="https://alokkumar.vercel.app/"
          >
            FRAAS-OWNER-SIGNATURE
          </span>
        </footer>
      </main>
    </div>
  )
}

export default App
