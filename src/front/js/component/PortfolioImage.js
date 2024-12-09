import React, { useState, useContext } from 'react';
import { Context } from "../store/appContext";

const PortfolioImage = ({ portfolioImgs, setMentor, editMode }) => {
  const { store, actions } = useContext(Context);
  const [imageSizeError, setImageSizeError] = useState(false)
  const [uploadedImages, setUploadedImages] = useState([]);


  const handleImageUpload = (event) => {
    const files = event.target.files;
    let file_size = event.target.files[0].size;
    console.log(file_size)
    if (file_size <= 100000) {
      console.log(">>> files", files);
      setImageSizeError(false)
      const images = [];
      for (let index = 0; index < files.length; index++) {
        images.push(files.item(index));
      }
      setUploadedImages((prev) => ([
        ...prev,
        ...images
      ]));
    } else {
      setImageSizeError(true)
    }
  };

  const handleNewImage = async () => {
    const success = await actions.addPortfolioImages(uploadedImages);
    if (success) {
      fetch(process.env.BACKEND_URL + "/api/mentor", {
        headers: { Authorization: "Bearer " + sessionStorage.getItem("token") }
      })
        .then(resp => resp.json())
        .then(data => setMentor(data))
        .catch(error => console.log(error))
    }
  }


  console.log(`from portfolio Image.js: ${portfolioImgs}`)


  return (
    <div className="mt-5">
      <>
          {uploadedImages.map((image, index) => (
            <div key={index} className="col">
              <img
                key={index}
                style={{
                  maxWidth: "100px",
                  maxHeight: "100px",
                  margin: "5px",
                }}
                src={URL.createObjectURL(image)}
                alt={`Uploaded Preview ${index}`}
              />
              <button
                type="button"
                onClick={() =>
                  setUploadedImages((imageList) =>
                    imageList.filter((_, imageIndex) => imageIndex !== index)
                  )
                }
                className="btn btn-outline-danger position-absolute top-0 end-0 m-2"
                style={{
                  borderRadius: "15%",
                  padding: "0.25rem 0.5rem",
                  fontSize: "0.75rem",
                }}
              >
                x
              </button>
            </div>
          ))}

        {editMode &&
          <div className="row d-flex justify-content-center mb-4 px-5">
            <input
              type="file"
              className="form-control"
              id="portfolio-images"
              aria-describedby="inputGroupFileAddon04"
              aria-label="Upload"
              multiple
              onChange={handleImageUpload}
              filename={`${uploadedImages.length > 0 ? uploadedImages.length : "No"} selected file${uploadedImages.length === 1 ? "" : "s"}`}
            />
            <button
              className="btn btn-primary mt-1"
              onClick={handleNewImage}
            >
              Upload Portfolio Images
            </button>
          </div>
        }
      </>

      <div className="container-flex">
        <div className="row gap-1 justify-content-center">
          {portfolioImgs && portfolioImgs.map((image, index) => {
            return (
              <div key={index} className="col-3 p-0 d-flex justify-content-center align-items-center">
                <img
                  key={index}
                  className="img-fluid cursor-pointer"
                  src={image.image_url || image}
                  alt={`Portfolio ${index}`}
                  data-bs-toggle="modal"
                  data-bs-target={`#portfolioModal${index}`}
                />

                {/* Modal for each image */}
                <div
                  className="modal fade"
                  id={`portfolioModal${index}`}
                  tabIndex="-1"
                  aria-labelledby={`portfolioModalLabel${index}`}
                  aria-hidden="true"
                >
                  <div className="modal-dialog modal-dialog-centered modal-fullscreen-sm-down">
                    <div className="modal-content bg-transparent border-0">
                      <button
                        type="button"
                        className="btn-close bg-white position-absolute top-4 end-4 z-10"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                      />
                      <div className="d-flex justify-content-center align-items-center min-vh-100">
                        <img
                          src={image.image_url || image}
                          alt={`Portfolio ${index}`}
                          className="img-fluid"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover"
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};



export default PortfolioImage