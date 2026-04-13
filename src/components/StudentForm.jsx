import { useState } from "react"
import "../styles/StudentForm.css"

const organizationOptions = [
  "FRAAS Public School",
  "FRAAS Innovation Labs",
  "BluePeak Technologies",
  "Northstar Consulting",
  "Other",
]

const classDivisionOptions = [
  "Class 1 - A",
  "Class 1 - B",
  "Class 2 - A",
  "Class 2 - B",
  "Class 3 - A",
  "Class 3 - B",
  "Class 4 - A",
  "Class 4 - B",
  "Class 5 - A",
  "Class 5 - B",
  "Class 6 - A",
  "Class 6 - B",
  "Class 7 - A",
  "Class 7 - B",
  "Class 8 - A",
  "Class 8 - B",
  "Class 9 - A",
  "Class 9 - B",
  "Class 10 - A",
  "Class 10 - B",
  "Class 11 - Science",
  "Class 11 - Commerce",
  "Class 12 - Science",
  "Class 12 - Commerce",
]

function StudentForm({ data, onFieldChange, onGenerate }) {
  const [errors, setErrors] = useState({})

  const clearError = (field) => {
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const handleInput = (event) => {
    const { name, value } = event.target
    onFieldChange(name, value)
    clearError(name)
  }

  const handleModeChange = (mode) => {
    onFieldChange("mode", mode)
    onFieldChange("classDivision", "")
    onFieldChange("designation", "")
    clearError("classDivision")
    clearError("designation")
  }

  const handleOrganizationSelection = (event) => {
    const value = event.target.value
    onFieldChange("organizationSelection", value)
    clearError("organizationSelection")

    if (value !== "Other") {
      onFieldChange("organizationName", value)
      clearError("organizationName")
    } else {
      onFieldChange("organizationName", "")
    }
  }

  const readImageFile = (file, targetField) => {
    const reader = new FileReader()
    reader.onload = () => {
      onFieldChange(targetField, String(reader.result || ""))
      clearError(targetField)
    }
    reader.readAsDataURL(file)
  }

  const handlePhotoChange = (event) => {
    const file = event.target.files?.[0]
    if (!file) {
      return
    }
    readImageFile(file, "photoPreview")
  }

  const handleLogoChange = (event) => {
    const file = event.target.files?.[0]
    if (!file) {
      return
    }
    readImageFile(file, "logoPreview")
  }

  const validate = () => {
    const nextErrors = {}

    if (!data.name.trim()) nextErrors.name = "Name is required"
    if (!data.organizationSelection) nextErrors.organizationSelection = "Please select an organization"
    if (data.organizationSelection === "Other" && !data.organizationName.trim()) {
      nextErrors.organizationName = "Enter your organization name"
    }
    if (data.mode === "student" && !data.classDivision) {
      nextErrors.classDivision = "Class / division is required"
    }
    if (data.mode === "professional" && !data.designation.trim()) {
      nextErrors.designation = "Designation is required"
    }
    if (!data.photoPreview) nextErrors.photoPreview = "Student photo is required"

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!validate()) {
      return
    }
    onGenerate()
  }

  return (
    <form className="student-form" onSubmit={handleSubmit}>
      <div className="form-heading">
        <h2>Identity Details</h2>
        <p>Switch mode, fill required fields, and generate a modern digital ID card.</p>
      </div>

      <div className="form-group">
        <label>Mode</label>
        <div className="mode-switch" role="tablist" aria-label="ID mode">
          <button
            type="button"
            className={data.mode === "student" ? "mode-btn active" : "mode-btn"}
            onClick={() => handleModeChange("student")}
          >
            Student Mode
          </button>
          <button
            type="button"
            className={data.mode === "professional" ? "mode-btn active" : "mode-btn"}
            onClick={() => handleModeChange("professional")}
          >
            Professional Mode
          </button>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="name">Name</label>
        <input
          id="name"
          type="text"
          name="name"
          value={data.name}
          onChange={handleInput}
          placeholder="Enter full name"
          className={errors.name ? "error" : ""}
        />
        {errors.name && <p className="error-message">{errors.name}</p>}
      </div>

      <div className="form-group">
        <label htmlFor="idNumber">ID Number</label>
        <input
          id="idNumber"
          type="text"
          name="idNumber"
          value={data.idNumber}
          onChange={handleInput}
          placeholder="Leave empty to auto-generate"
        />
      </div>

      {data.mode === "student" ? (
        <div className="form-group">
          <label htmlFor="classDivision">Class / Division</label>
          <select
            id="classDivision"
            name="classDivision"
            value={data.classDivision}
            onChange={handleInput}
            className={errors.classDivision ? "error" : ""}
          >
            <option value="">Select class and division</option>
            {classDivisionOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {errors.classDivision && <p className="error-message">{errors.classDivision}</p>}
        </div>
      ) : (
        <div className="form-group">
          <label htmlFor="designation">Designation</label>
          <input
            id="designation"
            type="text"
            name="designation"
            value={data.designation}
            onChange={handleInput}
            placeholder="Example: CEO, HR Manager"
            className={errors.designation ? "error" : ""}
          />
          {errors.designation && <p className="error-message">{errors.designation}</p>}
        </div>
      )}

      <div className="form-group">
        <label htmlFor="organizationSelection">Organization / School Name</label>
        <select
          id="organizationSelection"
          name="organizationSelection"
          value={data.organizationSelection}
          onChange={handleOrganizationSelection}
          className={errors.organizationSelection ? "error" : ""}
        >
          <option value="">Select organization</option>
          {organizationOptions.map((organization) => (
            <option key={organization} value={organization}>
              {organization}
            </option>
          ))}
        </select>
        {errors.organizationSelection && <p className="error-message">{errors.organizationSelection}</p>}
      </div>

      {data.organizationSelection === "Other" && (
        <div className="form-group">
          <label htmlFor="organizationName">Custom Organization Name</label>
          <input
            id="organizationName"
            type="text"
            name="organizationName"
            value={data.organizationName}
            onChange={handleInput}
            placeholder="Type organization/school name"
            className={errors.organizationName ? "error" : ""}
          />
          {errors.organizationName && <p className="error-message">{errors.organizationName}</p>}
        </div>
      )}

      <div className="form-group">
        <label htmlFor="address">Address</label>
        <input
          id="address"
          type="text"
          name="address"
          value={data.address}
          onChange={handleInput}
          placeholder="Enter full address"
        />
      </div>

      <div className="form-group">
        <label htmlFor="issueDate">Date of Issue</label>
        <input id="issueDate" type="date" name="issueDate" value={data.issueDate} onChange={handleInput} />
      </div>

      <div className="form-group">
        <label htmlFor="expiryDate">Expiry Date</label>
        <input id="expiryDate" type="date" name="expiryDate" value={data.expiryDate} onChange={handleInput} />
      </div>

      <div className="form-group">
        <label htmlFor="additionalDetails">Additional Details</label>
        <textarea
          id="additionalDetails"
          name="additionalDetails"
          value={data.additionalDetails}
          onChange={handleInput}
          rows="3"
          placeholder="Emergency contact, department, blood group, or notes"
        />
      </div>

      <div className="upload-grid">
        <div className="form-group">
          <label htmlFor="photoUpload">Photo Upload</label>
          <input
            id="photoUpload"
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            className={errors.photoPreview ? "error" : ""}
          />
          {errors.photoPreview && <p className="error-message">{errors.photoPreview}</p>}

          {data.photoPreview && (
            <div className="photo-preview">
              <img src={data.photoPreview} alt="Profile preview" />
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="logoUpload">Logo Upload</label>
          <input id="logoUpload" type="file" accept="image/*" onChange={handleLogoChange} />
          {data.logoPreview && (
            <div className="logo-preview">
              <img src={data.logoPreview} alt="Logo preview" />
            </div>
          )}
        </div>
      </div>

      <button type="submit" className="submit-btn">
        Generate ID Card
      </button>
    </form>
  )
}

export default StudentForm
