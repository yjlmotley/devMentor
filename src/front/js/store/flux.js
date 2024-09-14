
const getState = ({ getStore, getActions, setStore }) => {
    return {
        store: {
            isMentorLoggedIn: false,
            isCustomerLoggedIn: false,
            mentors: [],
            sessionRequests: [],
            customerId: undefined,
            // sessions: [],
            // message: null,
            token: sessionStorage.getItem("token"),
            sessionStorageChecked: !!sessionStorage.getItem("token")
        },

        actions: {

            checkStorage: () => {
                const token = sessionStorage.getItem("token", undefined)
                const customer_id = sessionStorage.getItem("customerId", undefined)
                setStore({
                    token: token,
                    customerId: customer_id,
                });
            },
            signUpMentor: async (mentor) => {
                const response = await fetch(
                    process.env.BACKEND_URL + "/api/mentor/signup", {
                    method: "POST",
                    body: JSON.stringify({ first_name: mentor.first_name, email: mentor.email, password: mentor.password, last_name: mentor.last_name, city: mentor.city, what_state: mentor.what_state, country: mentor.country, phone: mentor.phone }),
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
                if (response.status !== 201) return false;

                const responseBody = await response.json();
                console.log(responseBody)

                return true;
            },
            logInMentor: async (mentor) => {
                const response = await fetch(process.env.BACKEND_URL + "/api/mentor/login", {
                    method: "POST",
                    body: JSON.stringify({ email: mentor.email, password: mentor.password }),
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
                if (response.status !== 200) return false;

                const responseBody = await response.json();
                setStore({
                    token: responseBody.access_token,
                    isMentorLoggedIn: true
                });
                sessionStorage.setItem("token", responseBody.access_token);

                return true;
            },

            editMentor: async (mentor) => {
                console.log("Updating mentor with data:", mentor);
                const token = getStore().token;
                console.log("Token being used:", token);
                console.log("Updating mentor with data:", mentor);
                const response = await fetch(
                    process.env.BACKEND_URL + "/api/mentor/edit-self", {
                    method: "PUT",
                    body: JSON.stringify(mentor),
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                }
                );
                if (response.status !== 200) {
                    console.log("Error updating mentor information");
                    return false
                };
                const responseBody = await response.json();
                setStore({ ...getStore(), mentor: responseBody })
                console.log(responseBody)
                return true;
            },

            addMentorImage: async (images) => {

                let formData = new FormData();
                console.log(">>> 🍎 images:", images);
                console.log(">>> 🍎 images:", images.images);
                // formData.append("file", images[0]);
                for (let i = 0; i < images.length; i++) {
                    formData.append("file", images[i]);
                }


                const response = await fetch(process.env.BACKEND_URL + "/api/mentor/upload-photo", {
                    method: "POST",
                    headers: {
                        Authorization: "Bearer " + sessionStorage.getItem("token")
                    },
                    body: formData
                })

                if (response.status !== 200) return false;
                const responseBody = await response.json();
                console.log(responseBody)
                console.log("This is the Response Body")
                return true;
            },

            addPortfolioImages: async (images) => {

                let formData = new FormData();
                console.log(">>> 🍎 images:", images);

                for (let i = 0; i < images.length; i++) {
                    formData.append("file", images[i]);
                }


                const response = await fetch(process.env.BACKEND_URL + "/api/mentor/upload-portfolio-image", {
                    method: "POST",
                    headers: {
                        Authorization: "Bearer " + sessionStorage.getItem("token")
                    },
                    body: formData
                })
                if (response.status !== 200) return false;
                const responseBody = await response.json();
                console.log(responseBody)
                console.log("This is the Response Body")
                return true;
            },

            logOut: () => {
                setStore({
                    token: undefined,
                    customerId: undefined,
                    isMentorLoggedIn: false,
                    isCustomerLoggedIn: false
                });
                sessionStorage.removeItem("token");
                sessionStorage.removeItem("customerId");
                console.log("Logged out:", getStore().token)
            },

            logInCustomer: async (customerCredentials) => {
                const response = await fetch(`${process.env.BACKEND_URL}/api/customer/login`, {
                    method: "POST",
                    body: JSON.stringify(customerCredentials),
                    headers: { "Content-Type": "application/json" }
                });
                if (response.ok) {
                    const data = await response.json();
                    setStore({
                        token: data.access_token,
                        customerId: data.customer_id,
                        isCustomerLoggedIn: true
                    });
                    sessionStorage.setItem("token", data.access_token);
                    sessionStorage.setItem("customerId", data.customer_id);
                    return true;
                } else {
                    console.error("Login failed with status:", response.status);
                    return false;
                }
            },

            verifyCustomer: ({ access_token, customer_id, ...args }) => {
                setStore({
                    token: access_token,
                    customerId: customer_id
                });
                sessionStorage.setItem("token", access_token);
                sessionStorage.setItem("customerId", customer_id);
            },

            createSession: async (session) => {
                const response = await fetch(
                    process.env.BACKEND_URL + "/api/session/create", {
                    method: "POST",
                    body: JSON.stringify({ 
                        title: session.title,
                        details: session.details,
                        skills: session.skills,
                        schedule: session.schedule,
                        is_active: session.visibility,
                        focusAreas: session.focusAreas,
                        totalHours: session.totalHours,
                        resourceLink: session.resourceLink
                    }),
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
                );
                if (response.status !== 201) return false;
                const responseBody = await response.json();
                console.log(responseBody)

                return true;
            },

            getAllSessionRequests: () => {
                fetch(
                    process.env.BACKEND_URL + "/api/sessions"
                )
                .then(response => response.json())
                .then(data => setStore({
                    sessionRequests: data
                }))
            }
        }
    };
};

export default getState;