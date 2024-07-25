import React, { useState, useContext } from 'react';
import { Context } from "../store/appContext";

const ProfilePhoto = ({url, setMentor}) => {
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
        const success = await actions.addMentorImage(uploadedImages);
        if(success){
          fetch(process.env.BACKEND_URL + "/api/mentor", {
            headers: { Authorization: "Bearer " + sessionStorage.getItem("token") }
          })
            .then(resp => resp.json())
            .then(data => setMentor(data))
            .catch(error => console.log(error))
        }
      }


        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-4 offset-md-4">
                        <div className="text-center">
                            <img
                                src={url}
                                alt="Profile Picture"
                                className="rounded-circle img-fluid"
                                style={{ width: '300px', height: '300px' }}
                            />
                            <input
                                type="file"
                                id="profile-picture"
                                className="form-control-file"
                                onChange={handleImageUpload}
                            />
                            <button
                                className="btn btn-primary"
                                onClick={handleNewImage}
                            >
                                Upload Photo
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

export default ProfilePhoto