import { useState, useEffect } from "react"
import StudentForm from "./components/StudentForm"
import IdCardPreview from "./components/IdCardPreview"
import StoredCards from "./components/StoredCards"
import "./App.css"

function App() {
  const [studentData, setStudentData] = useState(null)
  const [template, setTemplate] = useState("template1")
  const [storedCards, setStoredCards] = useState([])
  const [showStoredCards, setShowStoredCards] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem("studentCards")
    if (stored) {
      setStoredCards(JSON.parse(stored))
    }
  }, [])

  const handleFormSubmit = (data) => {
    const newStudentData = {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    }

    setStudentData(newStudentData)
    
    const updatedCards = [newStudentData, ...storedCards]
    setStoredCards(updatedCards)
    localStorage.setItem("studentCards", JSON.stringify(updatedCards))
  }

  const handleTemplateChange = (newTemplate) => {
    setTemplate(newTemplate)
  }

  const handleViewStoredCards = () => {
    setShowStoredCards(!showStoredCards)
  }

  const handleLoadCard = (card) => {
    setStudentData(card)
    setShowStoredCards(false)
  }

  const handleDeleteCard = (id) => {
    const updatedCards = storedCards.filter((card) => card.id !== id)
    setStoredCards(updatedCards)
    localStorage.setItem("studentCards", JSON.stringify(updatedCards))
  }

  return (
    <div className="container">
      <h1 className="main-title">Smart Student ID Generator</h1>

      <div className="app-layout">
        <div className="form-section">
          <StudentForm onSubmit={handleFormSubmit} />

          <div className="stored-cards-section">
            <button onClick={handleViewStoredCards} className="view-cards-btn">
              {showStoredCards ? "Hide Saved Cards" : "View Saved Cards"}
            </button>

            {showStoredCards && (
              <StoredCards cards={storedCards} onLoadCard={handleLoadCard} onDeleteCard={handleDeleteCard} />
            )}
          </div>
        </div>

        <div className="preview-section">
          {studentData ? (
            <>
              <div className="preview-header">
                <h2>ID Card Preview</h2>
                <div className="template-selector">
                  <span>Template:</span>
                  <select value={template} onChange={(e) => handleTemplateChange(e.target.value)}>
                    <option value="template1">Template 1</option>
                    <option value="template2">Template 2</option>
                  </select>
                </div>
              </div>
              <IdCardPreview studentData={studentData} template={template} />
            </>
          ) : (
            <div className="empty-preview">
              <p>Fill out the form and submit to generate an ID card preview</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
