import React, { useState } from "react";




export const ValidateEmail = (email, setInvalidItems) => {
    let validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (email.match(validRegex)) {
        return true;
    } else {
        setInvalidItems(prevInvalidItems => [...prevInvalidItems, "email"]);
        return false;
    }
};

export const ValidatePhone = (phone, setInvalidItems) => {
    if (phone.trim() === "" || phone.length < 10 || phone.length > 15) {
        setInvalidItems(prevInvalidItems => [...prevInvalidItems, "phone"]);
        return false;
    }
    return true;
};

export const ValidateFirstName = (first_name, setInvalidItems) => {
    if (first_name.trim() === "" || first_name.length <= 2 || first_name.length > 25) {
        setInvalidItems(prevInvalidItems => [...prevInvalidItems, "first_name"]);
        return false;
    }
    return true;
};

export const ValidateLastName = (last_name, setInvalidItems) => {
    if (last_name.trim() === "" || last_name.length <= 2 || last_name.length > 25) {
        setInvalidItems(prevInvalidItems => [...prevInvalidItems, "last_name"]);
        return false;
    }
    return true;
};

export const ValidatePassword = (password, setInvalidItems) => {
    if (password.trim() === "" || password.length <= 5 || password.length > 20) {
        setInvalidItems(prevInvalidItems => [...prevInvalidItems, "password"]);
        return false;
    }
    return true;
};

export const ValidateAddress = (address, setInvalidItems) => {
    if (address.trim() === "" || address.length <= 6 || address.length > 80) {
        setInvalidItems(prevInvalidItems => [...prevInvalidItems, "address"]);
        return false;
    }
    return true;
};

export const ValidateCity = (city, setInvalidItems) => {
    if (city.trim() === "" || city.length <= 2 || city.length > 80) {
        setInvalidItems(prevInvalidItems => [...prevInvalidItems, "city"]);
        return false;
    }
    return true;
};

export const ValidateWhatState = (whatState, setInvalidItems) => {
    if (whatState.trim() === "" || whatState.length < 2 || whatState.length > 80) {
        setInvalidItems(prevInvalidItems => [...prevInvalidItems, "whatState"]);
        return false;
    }
    return true;
};

export const ValidateCountry = (country, setInvalidItems) => {
    if (country.trim() === "" || country.length < 3 || country.length > 80) {
        setInvalidItems(prevInvalidItems => [...prevInvalidItems, "country"]);
        return false;
    }
    return true;
};

export const ValidateMake = (make, setInvalidItems) => {
    if (make === null || make.trim() === "" || make.length <= 1 || make.length > 20) {
        setInvalidItems(prevInvalidItems => [...prevInvalidItems, "make"]);
        return false;
    }
    return true;
};

export const ValidateModel = (model, setInvalidItems) => {
    if (model.trim() === "" || model.length <= 1 || model.length > 20) {
        setInvalidItems(prevInvalidItems => [...prevInvalidItems, "model"]);
        return false;
    }
    return true;
};

export const ValidateYear = (year, setInvalidItems) => {
    if (year.trim() === "" || year.length < 4 || year.length < 4) {
        setInvalidItems(prevInvalidItems => [...prevInvalidItems, "year"]);
        return false;
    }
    return true;
};

export const ValidateVin = (vin, setInvalidItems) => {
    // Regular expression for VIN validation
    const vinRegex = /^[A-HJ-NPR-Z0-9]{17}$/;

    if (vinRegex.test(vin)) {
        // VIN is valid
        return true;
    } else {
        // VIN is invalid
        setInvalidItems(prevInvalidItems => [...prevInvalidItems, "vin"]);
        return false;
    }
};

export const ValidateLicense = (license, setInvalidItems) => {
    if (license.trim() === "" || license.length < 1 || license.length > 10) {
        setInvalidItems(prevInvalidItems => [...prevInvalidItems, "license"]);
        return false;
    }
    return true;
};

export const ValidateColor = (color, setInvalidItems) => {
    if (color.trim() === "" || color.length <= 2 || color.length > 20) {
        setInvalidItems(prevInvalidItems => [...prevInvalidItems, "color"]);
        return false;
    }
    return true;
};

export const ValidateImages = (uploadedImages, setInvalidItems) => {
    if (uploadedImages.length === 0) {
        setInvalidItems(prevInvalidItems => [...prevInvalidItems, "uploadedImages"]);
        return false;
    }
    return true;
};

export const ValidateWoStages = (woStages, setInvalidItems) => {
    if (woStages[0] === "" || woStages.length <= 2 || woStages.length > 12) {
        setInvalidItems(prevInvalidItems => [...prevInvalidItems, "woStages"]);
        return false;
    }
    return true;
};

export const ValidateComments = (comments, setInvalidItems) => {
    if (comments === "" || comments.length <= 2 || comments.length > 500) {
        setInvalidItems(prevInvalidItems => [...prevInvalidItems, "comments"]);
        return false;
    }
    return true;
};

export function ValidateEstCompletion(est_completion, setInvalidItems) {
    console.log(est_completion)
    var currentDate = new Date();
    let formattedCurrentDate = new Date(est_completion)
    console.log(currentDate)
    console.log(formattedCurrentDate)

    if (formattedCurrentDate <= currentDate || est_completion.trim() === "" || est_completion.length <= 6 || est_completion.length > 20) {
        setInvalidItems(prevInvalidItems => [...prevInvalidItems, "est_completion"]);
        return false;
    }

    return true;
}

export const ValidatePrice = (price, setInvalidItems) => {
    const priceRegex = /^\d+(\.\d{2})?$/;
    if (!priceRegex.test(price) || price.trim() === "") {
        setInvalidItems(prevInvalidItems => [...prevInvalidItems, "price"]);
        return false;
    }
    return true;
};

export const ValidateNumber = (years_exp, setInvalidItems) => {
    if (isNaN(years_exp)) {
        setInvalidItems(prevInvalidItems => [...prevInvalidItems, "years_exp"]);
        return false;
    }
    return true;
}