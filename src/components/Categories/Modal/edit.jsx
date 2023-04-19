import React, { useState, useEffect, useRef } from "react";
import Dialog from "../../Dialog";
import axios from "axios";
import "./style.css";

export default function EditModal({ closeModal, categoryId }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const statusRef = useRef(null);
  const [categoryData, setCategoryData] = useState({
    name: "",

    cover_photo: null,
  });

  useEffect(() => {
    const getCategoryData = async () => {
      setLoading(true);
      const baseUrl = process.env.REACT_APP_BASE_URL;
      const apiKey = process.env.REACT_APP_API_KEY;

      try {
        const response = await axios.get(
          `${baseUrl}/places/categories/${categoryId}`,
          {
            headers: {
              Accept: "application/json",
              Authorization: "Bearer " + localStorage.getItem("apiToken"),
              "Content-Type": "multipart/form-data",
              "x-api-key": apiKey,
            },
          }
        );
        setLoading(false);
        console.log(response.data);
        setCategoryData({
          name: response.data.data.name,
          cover_photo: response.data.data.cover_photo,
        });
      } catch (error) {
        console.log(error);
        setError("Unable to fetch category data.");
      } finally {
        setLoading(false);
      }
    };

    getCategoryData();
  }, [categoryId]);

  const handleInputChange = (event) => {
    const { name, value, files } = event.target;
    setCategoryData({
      ...categoryData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
  
    const baseUrl = process.env.REACT_APP_BASE_URL;
    const apiKey = process.env.REACT_APP_API_KEY;
  
    const formData = new FormData();
    formData.append("name", event.target.elements.name.value);
    formData.append(
      "status",
      statusRef.current.checked ? "active" : "inactive"
    );
  
    const coverPhoto = event.target.elements.cover?.files?.[0];
    if (coverPhoto) {
      formData.append("cover_photo", coverPhoto);
    }
  
    try {
      const response = await axios.post(
        `${baseUrl}/places/categories/${categoryId}`,
        formData,
        {
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + localStorage.getItem("apiToken"),
            "Content-Type": "multipart/form-data",
            "x-api-key": apiKey,
          },
          maxBodyLength: Infinity,
        }
      );
      setLoading(false);
      if (response.message === "OK") {
        setSuccess("Category updated successfully!");
        setTimeout(() => {
          setSuccess("");
        }, 4000);

      } else {
        const error = response.error.message;
        setError(error);
        setTimeout(() => setError(""), 4000);
        console.log(error);
      }
    } catch (error) {
      console.log(error);
      setError("Unable to update category data.");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <Dialog>
      <div className="wrap__category">
        <div className="category__header">
          <h3 className="form__head">Edit Category</h3>
          <input type="checkbox" name="status" id="status" ref={statusRef} />
          <label htmlFor="status"></label>
        </div>

        <form onSubmit={handleSubmit} className="category__form">
          <input
            type="file"
            name="cover_photo"
            className="form__field"
            placeholder="Cover photo"
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="name"
            className="form__field"
            placeholder="Name"
            value={categoryData.name}
            onChange={handleInputChange}
          />
          {error && <p className="error__message">{error}</p>}
          <div className="form__group">
            <button className="form__btn close" onClick={closeModal}>
              Close
            </button>
            <button type="submit" disabled={loading} className="form__btn save">
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </Dialog>
  );
}