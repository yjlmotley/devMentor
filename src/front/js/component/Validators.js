import phoneRegex from '../store/phoneRegex';


export const ValidateEmail = (email, setInvalidItems) => {
    let validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (email.match(validRegex)) {
        return true;
    } else {
        setInvalidItems(prevInvalidItems => [...prevInvalidItems, "email"]);
        return false;
    }
};

// export const ValidatePhone = (phone, setInvalidItems) => {
//     if (phone.trim() === "" || phone.length < 10 || phone.length > 15) {
//         setInvalidItems(prevInvalidItems => [...prevInvalidItems, "phone"]);
//         return false;
//     }
//     return true;
// };

export const ValidatePhone = (phoneNumber, countryCode, setInvalidItems) => {
    const regex = phoneRegex[countryCode];
    // leave the 3 console log statements below for testing purposes:
    // console.log(countryCode);
    // console.log(phoneNumber)
    // console.log("regex:", regex);

    if (!regex || !regex.test(phoneNumber)) {
        setInvalidItems(prevInvalidItems => [...prevInvalidItems, "phone"]);
        return false;
    }

    return true;
};

export const ValidatePhoneNumber = (phoneNumber, country) => {
    console.log(country);
    console.log(phoneNumber);
    const regex = phoneRegex[country];
    console.log("regex:", regex);

    if (!regex) {
        return { isValid: false, message: 'Invalid country code or phone number format' };
    }

    if (regex.test(phoneNumber)) {
        return { isValid: true, message: '' };
    } else {
        return { isValid: false, message: 'Invalid phone number' };
    }
};

export const ValidateFirstName = (first_name, setInvalidItems) => {
    if (first_name.trim() === "" || first_name.length < 2 || first_name.length > 25) {
        setInvalidItems(prevInvalidItems => [...prevInvalidItems, "first_name"]);
        return false;
    }
    return true;
};

export const ValidateLastName = (last_name, setInvalidItems) => {
    if (last_name.trim() === "" || last_name.length < 2 || last_name.length > 25) {
        setInvalidItems(prevInvalidItems => [...prevInvalidItems, "last_name"]);
        return false;
    }
    return true;
};

export const ValidatePassword = (password, setInvalidItems) => {
    if (password.trim() === "" || password.length < 5 || password.length > 20) {
        setInvalidItems(prevInvalidItems => [...prevInvalidItems, "password"]);
        return false;
    }
    return true;
};

export const ValidateAddress = (address, setInvalidItems) => {
    if (address.trim() === "" || address.length < 6 || address.length > 80) {
        setInvalidItems(prevInvalidItems => [...prevInvalidItems, "address"]);
        return false;
    }
    return true;
};

export const ValidateCity = (city, setInvalidItems) => {
    if (city.trim() === "" || city.length < 1 || city.length > 80) {
        setInvalidItems(prevInvalidItems => [...prevInvalidItems, "city"]);
        return false;
    }
    return true;
};

export const ValidateWhatState = (what_state, setInvalidItems) => {
    if (what_state.trim() === "" || what_state.length < 2 || what_state.length > 80) {
        setInvalidItems(prevInvalidItems => [...prevInvalidItems, "what_state"]);
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

export const ValidateYear = (year, setInvalidItems) => {
    if (year.trim() === "" || year.length < 4 || year.length < 4) {
        setInvalidItems(prevInvalidItems => [...prevInvalidItems, "year"]);
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

export const ValidatePrice = (price, setInvalidItems) => {
    const priceRegex = /^\d+(\.\d{2})?$/;
    if (price === null || price.trim() === "" || price == "Null") {
        return true;
    }
    if (!priceRegex.test(price)) {
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