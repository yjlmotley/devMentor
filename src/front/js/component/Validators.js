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

export const ValidateTitle = (title, setInvalidItems) => {
    if (title.trim() === "" || title.length < 5 || title.length > 125) {
        setInvalidItems(prevInvalidItems => [...prevInvalidItems, "title"]);
        return false;
    }
    return true;
};

export const ValidateDescription = (description, setInvalidItems) => {
    if (description.trim() === "" || description.length < 5 || description.length > 750) {
        setInvalidItems(prevInvalidItems => [...prevInvalidItems, "description"]);
        return false;
    }
    return true;
};

export const ValidateSchedule = (schedule, setInvalidItems) => {
    const hasSelectedDay = Object.values(schedule).some(day => day.checked);
    if (!hasSelectedDay) {
        setInvalidItems(prevInvalidItems => [...prevInvalidItems, "schedule"]);
        return false;
    }
    return true;
};

export const ValidateFocusAreas = (focus_areas, setInvalidItems) => {
    if (focus_areas.length === 0) {
        setInvalidItems(prevInvalidItems => [...prevInvalidItems, "focus_areas"]);
        return false;
    }
    return true;
};

export const ValidateSkills = (skills, setInvalidItems) => {
    if (skills.length === 0) {
        setInvalidItems(prevInvalidItems => [...prevInvalidItems, "skills"]);
        return false;
    }
    return true;
};

export const ValidateResourceLink = (resourceLink, setInvalidItems) => {
    // Check if resourceLink has more than 4 characters
    if (resourceLink.trim().length > 4) {
        return true;
    } else {
        setInvalidItems(prevInvalidItems => [...prevInvalidItems, "resourceLink"]);
        return false;
    }
};

export const ValidateDuration = (duration, setInvalidItems) => {
    const validDurations = ["30", "60", "90", "120", "150", "180"];
    if (!validDurations.includes(duration)) {
        setInvalidItems(prevInvalidItems => [...prevInvalidItems, "duration"]);
        return false;
    }
    return true;
};

export const ValidateTotalHours = (totalHours, setInvalidItems) => {
    if (totalHours <= 0 || totalHours > 100 || !Number.isInteger(totalHours)) {
        setInvalidItems(prevInvalidItems => [...prevInvalidItems, "totalHours"]);
        return false;
    }
    return true;
};

export const ValidateVisibility = (is_active, setInvalidItems) => {
    if (is_active === "") {
        setInvalidItems(prevInvalidItems => [...prevInvalidItems, "is_active"]);
        return false;
    }
    return true;
};