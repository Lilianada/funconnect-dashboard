import React, { useState, useEffect } from "react";
import Header from "../Header";
import AddModal from "./Modals/add";
import EditModal from "./Modals/edit";
import axios from "axios";
import "./style.css";

export default function Places() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [places, setPlaces] = useState([]);
  const [placeId, setplaceId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);

  useEffect(() => {
    getPlaces(); 
  }, []); 

  const getPlaces = async (page) => {
    const apiToken = localStorage.getItem("apiToken");
    let url = `https://api.funconnect.app/places?page=${currentPage}`;
    setLoading(true);
    try {
      if (page) {
        url = page;
      }
      const response = await axios.get(url, {
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + apiToken,
        },
      });
      setLoading(false);
      const responseBody = response.data;
      if (responseBody.message === "OK") {
        const places = responseBody.data.data;
        setPlaces(places);
        setCurrentPage(responseBody.data.current_page);
        setNextPage(responseBody.data.next_page_url);
        setPrevPage(responseBody.data.prev_page_url);
      } else {
        setError("Unable to fetch data.");
      }
    } catch (error) {
      setError("Unable to fetch data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleNextPage = () => {
    if (nextPage !== null) {
      getPlaces(nextPage);
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (prevPage !== null) {
      getPlaces(prevPage);
      setCurrentPage(currentPage - 1);
    }
  };

  //open and close add modal
  const [modal, setModal] = useState(false);
  const handleModal = () => {
    setModal(!modal);
  };

  //opens edit modal
  const [editModal, setEditModal] = useState(false);
  function handleEditModal(placeId) {
    return () => {
      setplaceId(placeId);
      setEditModal(true);
    };
  }

  //closes edit modal
  function closeModal() {
    setEditModal(false);
    setplaceId(null);
  }

  return (
    <div className="">
      <Header />
      <div className="places">
        <div className="places__header">
          <h3>A list of all the available places</h3>
          <button className="header__btn" onClick={handleModal}>
            Add New Place
          </button>
        </div>
        {loading ? (
          <div className="loader">
            <div className="spinner"></div>
          </div>
        ) : (
          <div className="places__body">
            {places.map((place) => {
              return (
                <div
                  className="place__item"
                  key={place.id}
                  onClick={handleEditModal(place.id)}
                >
                  <img
                    className="place__image"
                    src={place.cover_image_path}
                    alt="cover photos"
                  />
                  <p className="place__name">{place.name}</p>
                </div>
              );
            })}
          </div>
        )}
        {editModal && <EditModal closeModal={closeModal} placeId={placeId} />}
        {modal && <AddModal closeModal={handleModal} />}
        <div className="places__footer">
          {prevPage && (
            <button
              className="footer__btn prev"
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
            >
              Previous
            </button>
          )}
          {nextPage && (
            <button
              className="footer__btn next"
              onClick={handleNextPage}
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
