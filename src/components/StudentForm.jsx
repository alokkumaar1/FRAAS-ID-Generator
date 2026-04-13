import { useState } from "react";
import "../styles/StudentForm.css";

const StudentForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    name: "",
    rollNumber: "",
    classDiv: "",
    allergies: [],
    photo: null,
    photoPreview: null,
    rackNumber: "",
    busRouteNumber: "",
  });

  const [errors, setErrors] = useState({});
  const [isGenerating, setIsGenerating] = useState(false);

  const classOptions = [...Array(12)].flatMap((_, i) => [`Class ${i + 1}-A`, `Class ${i + 1}-B`]);
  const busRoutes = [
    "Route 1: North Campus", "Route 2: South Campus", "Route 3: East Campus", 
    "Route 4: West Campus", "Route 5: Central Area", "Route 6: Suburban Area",
    "Route 7: Downtown", "Route 8: Hillside Area",
  ];
  const allergyOptions = ["Milk", "Eggs", "Wheat", "Fish", "Gluten", "Sesame"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (errors[name]) setErrors({ ...errors, [name]: null });
  };

  const handleAllergyChange = (allergy) => {
    setFormData({
      ...formData,
      allergies: formData.allergies.includes(allergy)
        ? formData.allergies.filter((a) => a !== allergy)
        : [...formData.allergies, allergy],
    });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, photo: file, photoPreview: reader.result });
      };
      reader.readAsDataURL(file);
      if (errors.photo) setErrors({ ...errors, photo: null });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.rollNumber.trim()) newErrors.rollNumber = "Roll Number is required";
    if (!formData.classDiv) newErrors.classDiv = "Class & Division is required";
    if (!formData.rackNumber.trim()) newErrors.rackNumber = "Rack Number is required";
    if (!formData.busRouteNumber) newErrors.busRouteNumber = "Bus Route is required";
    if (!formData.photo) newErrors.photo = "Photo is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsGenerating(true);
    setTimeout(() => {
      onSubmit(formData);
      setIsGenerating(false);
    }, 1500);
  };

  return (
    <form onSubmit={handleSubmit} className="student-form">
      <h2>Student Information</h2>

      <div className="form-group">
        <label>Name</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} className={errors.name ? "error" : ""} />
        {errors.name && <p className="error-message">{errors.name}</p>}
      </div>

      <div className="form-group">
        <label>Roll Number</label>
        <input type="text" name="rollNumber" value={formData.rollNumber} onChange={handleChange} className={errors.rollNumber ? "error" : ""} />
        {errors.rollNumber && <p className="error-message">{errors.rollNumber}</p>}
      </div>

      <div className="form-group">
        <label>Class & Division</label>
        <select name="classDiv" value={formData.classDiv} onChange={handleChange} className={errors.classDiv ? "error" : ""}>
          <option value="">Select Class & Division</option>
          {classOptions.map((option) => <option key={option} value={option}>{option}</option>)}
        </select>
        {errors.classDiv && <p className="error-message">{errors.classDiv}</p>}
      </div>

      <div className="form-group">
        <label>Allergies (if any)</label>
        <div className="allergies-grid">
          {allergyOptions.map((allergy) => (
            <div key={allergy} className="allergy-option">
              <input type="checkbox" id={`allergy-${allergy}`} checked={formData.allergies.includes(allergy)} onChange={() => handleAllergyChange(allergy)} />
              <label htmlFor={`allergy-${allergy}`}>{allergy}</label>
            </div>
          ))}
        </div>
      </div>

      <div className="form-group">
        <label>Photo Upload</label>
        <input type="file" accept="image/*" onChange={handlePhotoChange} className={errors.photo ? "error" : ""} />
        {errors.photo && <p className="error-message">{errors.photo}</p>}

        {formData.photoPreview && (
          <div className="photo-preview">
            <img src={formData.photoPreview || "/placeholder.svg"} alt="Preview" />
          </div>
        )}
      </div>

      <div className="form-group">
        <label>Rack Number</label>
        <input type="text" name="rackNumber" value={formData.rackNumber} onChange={handleChange} className={errors.rackNumber ? "error" : ""} />
        {errors.rackNumber && <p className="error-message">{errors.rackNumber}</p>}
      </div>

      <div className="form-group">
        <label>Bus Route Number</label>
        <select name="busRouteNumber" value={formData.busRouteNumber} onChange={handleChange} className={errors.busRouteNumber ? "error" : ""}>
          <option value="">Select Bus Route</option>
          {busRoutes.map((route) => <option key={route} value={route}>{route}</option>)}
        </select>
        {errors.busRouteNumber && <p className="error-message">{errors.busRouteNumber}</p>}
      </div>

      <button type="submit" className="submit-btn" disabled={isGenerating}>
        {isGenerating ? "Generating..." : "Generate ID Card"}
      </button>
    </form>
  );
};

export default StudentForm;
