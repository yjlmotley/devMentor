
const getState = ({ getStore, getActions, setStore }) => {
    return {
        store: {
            isMentorLoggedIn: false,
            isCustomerLoggedIn: false,
            mentors: [],
            currentUserData: null,
            sessionRequests: [],
            customerId: undefined,
            mentorId: undefined,
            customerSessions: [],
            messages: [],
            token: sessionStorage.getItem("token"),
            // sessionStorageChecked: !!sessionStorage.getItem("token")
        },

        actions: {

            getCurrentUser: async () => {
                const response = await fetch(`${process.env.BACKEND_URL}/api/current/user`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + sessionStorage.getItem('token')
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    console.log("userdata from token", data);
                    if (data.role == "mentor") {
                        setStore({
                            isMentorLoggedIn: true,
                            currentUserData: data,
                            mentorId: data.user_data.id
                        })
                    }
                    if (data.role == "customer") {
                        setStore({
                            isCustomerLoggedIn: true,
                            currentUserData: data
                        })
                    }
                } else {
                    console.error("Login failed with status:", response.status);
                    getActions().logOut()
                }
            },
            checkStorage: () => {
                const token = sessionStorage.getItem("token", undefined)
                const customer_id = sessionStorage.getItem("customerId", undefined)
                setStore({
                    token: token,
                    customerId: customer_id,
                });
            },
            checkStorageMentor: () => {
                const token = sessionStorage.getItem("token", undefined)
                const mentor_id = sessionStorage.getItem("mentorId", undefined)
                setStore({
                    token: token,
                    mentorId: mentor_id,
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
                if (getStore().isMentorLoggedIn) {
                    window.location.href = process.env.FRONTEND_URL + "/mentor-login"
                }
                if (getStore().isCustomerLoggedIn) {
                    window.location.href = process.env.FRONTEND_URL + "/customer-login"
                }

                setStore({
                    token: undefined,
                    customerId: undefined,
                    isMentorLoggedIn: false,
                    isCustomerLoggedIn: false,
                    currentUserData: null
                });

                sessionStorage.clear();
                // -- or -- (remove specific items from sessionStorage)
                // sessionStorage.removeItem("token");
                // sessionStorage.removeItem("customerId");

                // console.log("Logged out. Updated store:", getStore());
                console.log("Logged out. Token should be undefined:", getStore().token === undefined);
            },

            signUpCustomer: async (customer) => {
                const response = await fetch(
                    process.env.BACKEND_URL + "/api/customer/signup", {
                    method: "POST",
                    body: JSON.stringify({ first_name: customer.first_name, last_name: customer.last_name, phone: customer.phone, email: customer.email, password: customer.password, city: customer.city, what_state: customer.what_state, country: customer.country }),
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
                if (response.status !== 201) return false;

                const responseBody = await response.json();
                console.log(responseBody)

                return true;
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
                        customer_id: session.customer_id,
                        title: session.title,
                        description: session.description,
                        is_active: session.is_active,
                        schedule: session.schedule,
                        focus_areas: session.focus_areas,
                        skills: session.skills,
                        resourceLink: session.resourceLink,
                        duration: session.duration,
                        totalHours: session.totalHours,
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

            getAllSessionRequests: async () => {
                const store = getStore();
                const token = sessionStorage.getItem("token");
            
                if (!token) {
                    console.error("No token found in sessionStorage");
                    return false;
                }
            
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/sessions`, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`
                        }
                    });
            
                    if (response.ok) {
                        const data = await response.json();
                        setStore({ ...store, sessionRequests: data });
                        return true;
                    } else {
                        console.error("Failed to fetch sessions with status:", response.status);
                        return false;
                    }
                } catch (error) {
                    console.error("Error fetching sessions:", error);
                    return false;
                }
            },

            getCustomerSessions: async () => {
                const store = getStore();
                const token = sessionStorage.getItem('token');

                if (!token) {
                    console.error("No token found in sessionStorage");
                    return;
                }

                const response = await fetch(
                    process.env.BACKEND_URL + "/api/sessions/customer", {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": "Bearer " + sessionStorage.getItem('token')
                        }
                    }
                )
                if (response.ok) {
                    const sessions = await response.json();
                    console.log("Customer sessions:", sessions);
                    setStore({...store, customerSessions: sessions})
                } else {
                    console.error("Failed to fetch customer sessions with status:", response.status);
                }
            },
            sendMessageMentor: async (sessionId, text) => {
                const token = sessionStorage.getItem("token");
                if (!token) {
                    console.error("No token found in sessionStorage");
                    return false;
                }

                const response = await fetch(`${process.env.BACKEND_URL}/api/message-mentor`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        session_id: sessionId,
                        text: text,
                    })
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log("Message sent successfully:", data);
                    
                    return true;
                } else {
                    console.error("Failed to send message with status:", response.status);
                    return false;
                }
            },
            sendMessageCustomer: async (sessionId, text, mentorId) => {
                const token = sessionStorage.getItem("token");
                if (!token) {
                    console.error("No token found in sessionStorage");
                    return false;
                }
            
                const response = await fetch(`${process.env.BACKEND_URL}/api/message-customer`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        session_id: sessionId,
                        text: text,
                        mentor_id: mentorId
                    })
                });
            
                if (response.ok) {
                    const data = await response.json();
                    console.log("Message sent successfully:", data);
                    return true;
                } else {
                    console.error("Failed to send message with status:", response.status);
                    return false;
                }
            }
        }
    };
};

export default getState;