const handlePhoneChange = (value, countryData) => {
    const phoneValidation = ValidatePhoneNumber(value, countryData.countryCode);
    setSelectedCountry(countryData.countryCode);
    if (phoneValidation.isValid) {
        setPhoneError('');
    } else {
        setPhoneError(phoneValidation.message);
    }
    console.log(value);
    setMentor(prevMentorInfo => ({
        ...prevMentorInfo,
        phone: value
    }));
};