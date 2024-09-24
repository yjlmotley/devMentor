import React, { useState, useContext } from 'react';
import { Context } from "../store/appContext";

const ProfilePhoto = ({ url, setMentor, editMode }) => {
  const { store, actions } = useContext(Context);
  const [imageSizeError, setImageSizeError] = useState(false)
  const [uploadedImages, setUploadedImages] = useState([]);


  const handleImageUpload = (event) => {
    const files = event.target.files;
    let file_size = files[0].size;
    // console.log(file_size)
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
    const success = await actions.addMentorImage(uploadedImages);
    if (success) {
      fetch(process.env.BACKEND_URL + "/api/mentor", {
        headers: { Authorization: "Bearer " + sessionStorage.getItem("token") }
      })
        .then(resp => resp.json())
        .then(data => setMentor(data))
        .catch(error => console.log(error))
    }
  }

  const deleteProfilePhoto = () => {
      fetch(process.env.BACKEND_URL + "/api/mentor/delete-photo", {
        headers: { Authorization: "Bearer " + sessionStorage.getItem("token") },
        method: 'DELETE'
      })
        .then(resp => resp.json())
        .then(data => setMentor(data.mentor))
        .catch(error => console.log(error))
  }

  return (
    <div className="row">
      <div className="col-8 position-relative">
        {editMode && <i className="fa-solid fa-x position-absolute top-0 end-0" onClick={deleteProfilePhoto} />}
        <img
          src={url}
          alt="Profile Picture"
          className="rounded-circle w-100 img-fluid"
        // style={{ width: '300px', height: '300px' }}
        />
      </div>
      {editMode &&
        <div className='col-4'>
        <input
          type="file"
          id="profile-picture"
          className="form-control-file"
          onChange={handleImageUpload}
        />
        {imageSizeError ? (<label className="text-danger">Error: The size of the image must be below 100kb</label>) : ""}
        <button
          className="btn btn-primary"
          onClick={handleNewImage}
        >
          Upload Photo
        </button>
      </div>
      }
      
    </div>
  );
};

export default ProfilePhoto