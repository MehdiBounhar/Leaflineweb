import React, { useState } from "react";

const FormComponent = ({ fetchData, toggleForm }) => {
  const [formData, setFormData] = useState({
    Plante: "",
    Organisme: "",
    Temp_rature_min_C: "",
    Temp_rature_max_C: "",
    HR_min: "",
    H_A1R_max: "",
    Ensoleillement: "",
    Humidit_du_sol: "",
    Type: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5001/maladies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        // Close the form and fetch updated data
        toggleForm();
      } else {
        console.error("Error submitting form:", response.statusText);
        // Handle error
      }
    } catch (error) {
      console.error("Error submitting form:", error.message);
      // Handle error
    }
  };

  return (
    <div className="modal" style={{ display: "block" }}>
      <div
        className="modal-content"
        style={{ maxWidth: "400px", marginTop: "150px" }}
      >
        <span className="close" onClick={toggleForm}>
          &times;
        </span>
        <form onSubmit={handleSubmit}>
          <div>
            <label>
              Plante:
              <br></br>
              <input
                type="text"
                name="Plante"
                value={formData.Plante}
                onChange={handleChange}
                required
              />
            </label>
          </div>
          <div>
            <label>
              Organisme:
              <br></br>
              <input
                type="text"
                name="Organisme"
                value={formData.Organisme}
                onChange={handleChange}
                required
              />
            </label>
          </div>
          <div>
            <label>
              Temperature Min (°C):
              <br></br>
              <input
                type="number"
                name="Temp_rature_min_C"
                value={formData.Temp_rature_min_C}
                onChange={handleChange}
                required
              />
            </label>
          </div>
          <div>
            <label>
              Temperature Max (°C):
              <br></br>
              <input
                type="number"
                name="Temp_rature_max_C"
                value={formData.Temp_rature_max_C}
                onChange={handleChange}
                required
              />
            </label>
          </div>
          <div>
            <label>
              HR Min:
              <br></br>
              <input
                type="number"
                name="HR_min"
                value={formData.HR_min}
                onChange={handleChange}
                required
              />
            </label>
          </div>
          <div>
            <label>
              HR Max:
              <br></br>
              <input
                type="number"
                name="H_A1R_max"
                value={formData.H_A1R_max}
                onChange={handleChange}
                required
              />
            </label>
          </div>
          <div>
            <label>
              Ensoleillement:
              <br></br>
              <input
                type="text"
                name="Ensoleillement"
                value={formData.Ensoleillement}
                onChange={handleChange}
                required
              />
            </label>
          </div>
          <div>
            <label>
              Humidité du sol:
              <br></br>
              <input
                type="text"
                name="Humidit_du_sol"
                value={formData.Humidit_du_sol}
                onChange={handleChange}
                required
              />
            </label>
          </div>
          <div>
            <label>
              Type:
              <br></br>
              <input
                type="text"
                name="Type"
                value={formData.Type}
                onChange={handleChange}
                required
              />
            </label>
          </div>

          <div>
            <br></br>
            <button type="submit">Submit</button>
            <button type="button" onClick={toggleForm}>
              Close
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormComponent;
