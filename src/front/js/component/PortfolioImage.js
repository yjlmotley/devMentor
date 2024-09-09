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
    <div>
      <div>
        <div className="row">
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
          {/* Render empty preview placeholders if less than 12 images */}
        </div>
        
        {editMode &&
          <>
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
              className="btn btn-primary"
              onClick={handleNewImage}
            >
              Upload Portfolio Images
            </button>
         </> 
        }
      </div>

      <div className="container-flex">
        <div className="row gap-1 justify-content-center">
          {portfolioImgs && portfolioImgs.map((image, index) => {
            return <div class="col-3 p-0 d-flex justify-content-center align-items-center">
              <img
                key={index}
                className="img-fluid"
                src={image.image_url || image}
                alt="Random"
              // style={{
              //   maxHeight: "500px",
              //   width: "auto",
              //   objectFit: "cover"
              // }}
              />
            </div>
          })}
        </div>
      </div>
    </div>
  );
};



export default PortfolioImage