
const getState = ({ getStore, getActions, setStore }) => {
    return {
        store: {
            isMentorLoggedIn: sessionStorage.getItem("isMentorLoggedIn") === "true" || false,
            isCustomerLoggedIn: sessionStorage.getItem("isCustomerLoggedIn") === "true" || false,
            mentors: [],
            mentor: null,
            selectedSession: null,
            currentUserData: JSON.parse(sessionStorage.getItem("currentUserData")) || null,
            sessionRequests: [],
            customerId: sessionStorage.getItem("customerId") || null,
            mentorId: sessionStorage.getItem("mentorId") || null,
            customerSessions: [],
            messages: [],
            token: sessionStorage.getItem("token") || null,
            // sessionStorageChecked: !!sessionStorage.getItem("token")
        },

        actions: {

            getCurrentUser: async () => {
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/current/user`, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": "Bearer " + sessionStorage.getItem('token')
                        }
                    });
                    if (response.ok) {
                        const data = await response.json();
                        // console.log("userdata from token", data);
                        if (data.role == "mentor") {
                            setStore({
                                isMentorLoggedIn: true,
                                currentUserData: data,
                                mentorId: data.user_data.id
                            });
                            return true;
                        }
                        if (data.role == "customer") {
                            setStore({
                                isCustomerLoggedIn: true,
                                currentUserData: data,
                                customerId: data.user_data.id
                            });
                            return true;
                        }
                    } else {
                        console.error("get current user status:", response.status);
                        getActions().logOut();
                        alert("Your login token has expired. Please log in again to continue.");
                        return false;
                    }
                } catch (error) {
                    console.error("Failed to fetch current user:", error);
                    getActions().logOut();
                    // alert("Connection error. Please check your internet connection. Otherwise, our server is down at the moment. Please try again at another time.");
                    alert("Token has expired. Please log in again to continue.");
                    return false;
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
                const currentUserData = JSON.parse(sessionStorage.getItem("currentUserData"));
                setStore({
                    token: token,
                    mentorId: mentor_id,
                    currentUserData: currentUserData,
                    isMentorLoggedIn: !!token // set to true if token exists
                });
            },

            signUpMentor: async (mentor) => {
                try {
                    const response = await fetch(
                        process.env.BACKEND_URL + "/api/mentor/signup", {
                        method: "POST",
                        body: JSON.stringify({
                            first_name: mentor.first_name,
                            email: mentor.email.toLowerCase(),
                            password: mentor.password,
                            last_name: mentor.last_name,
                            city: mentor.city,
                            what_state: mentor.what_state,
                            country: mentor.country,
                            phone: mentor.phone
                        }),
                        headers: {
                            "Content-Type": "application/json"
                        }
                    });
                    const responseBody = await response.json();

                    if (response.status === 201) {
                        console.log(responseBody);
                        return {
                            success: true,
                            message: responseBody.msg || "Account successfully created! Please log in."
                        };
                    } else {
                        return {
                            message: false,
                            message: responseBody.msg || "An error occurred during sign up."
                        };
                    }
                } catch (error) {
                    console.error("Signup error:, error");
                    return {
                        success: false,
                        message: "An unexpected error occured. Please try again later."
                    }
                }

            },
            logInMentor: async (mentor) => {
                const response = await fetch(process.env.BACKEND_URL + "/api/mentor/login", {
                    method: "POST",
                    body: JSON.stringify({
                        email: mentor.email.toLowerCase(),
                        password: mentor.password
                    }),
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
                if (response.status !== 200) return false;

                const data = await response.json();
                setStore({
                    token: data.access_token,
                    isMentorLoggedIn: true,
                    mentorId: data.mentor_id,
                    currentUserData: data.mentor_data,
                });
                sessionStorage.setItem("token", data.access_token);
                sessionStorage.setItem("isMentorLoggedIn", true);
                sessionStorage.setItem("mentorId", data.mentor_id);
                sessionStorage.setItem("currentUserData", JSON.stringify(data.mentor_data));
                return true;
            },

            getMentors: async () => {
                const store = getStore();
                const token = sessionStorage.getItem("token");

                if (!token) {
                    console.error("No token found in sessionStorage");
                    return false;
                }

                const response = await fetch(`${process.env.BACKEND_URL}/api/mentorsnosession`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                })
                if (response.ok) {
                    const data = await response.json();
                    setStore({ ...store, mentors: data });
                    return true;
                } else {
                    console.error("Failed to fetch all Mentors:", response.status)
                    return false;
                }
            },

            getMentorById: async (mentorId) => {
                try {
                    const store = getStore();
                    const token = sessionStorage.getItem("token");

                    if (!token) {
                        console.error("No token found in sessionStorage");
                        return false;
                    }

                    const response = await fetch(`${process.env.BACKEND_URL}/api/mentor/${mentorId}`, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`
                        }
                    });

                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }

                    const data = await response.json();

                    // Update both mentor and selectedMentor in the store
                    setStore({
                        ...store,
                        mentor: data,
                        selectedMentor: data
                    });

                    return true;
                } catch (error) {
                    console.error("Error fetching mentor:", error);
                    return false;
                }
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
                // if (getStore().isMentorLoggedIn) {
                //     window.location.href = process.env.FRONTEND_URL + "/mentor-login"
                // }
                // if (getStore().isCustomerLoggedIn) {
                //     window.location.href = process.env.FRONTEND_URL + "/customer-login"
                // }

                setStore({
                    token: undefined,
                    customerId: undefined,
                    mentorId: undefined,
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
                try {
                    const response = await fetch(
                        process.env.BACKEND_URL + "/api/customer/signup", {
                        method: "POST",
                        body: JSON.stringify({
                            first_name: customer.first_name,
                            last_name: customer.last_name,
                            phone: customer.phone,
                            email: customer.email.toLowerCase(),
                            password: customer.password
                        }),
                        headers: {
                            "Content-Type": "application/json"
                        }
                    });
                    const responseBody = await response.json();

                    if (response.status == 201) {
                        return {
                            success: true,
                            message: responseBody.msg || "Account successfully created! Please log in."
                        };
                    } else {
                        return {
                            success: false,
                            message: responseBody.msg || "An error occurred during signup"
                        };
                    }
                } catch (error) {
                    console.error("Signup error:", error);
                    return {
                        success: false,
                        message: "An unexpected error occurred. Please try again later."
                    }
                }
            },

            logInCustomer: async (customer) => {
                const response = await fetch(`${process.env.BACKEND_URL}/api/customer/login`, {
                    method: "POST",
                    body: JSON.stringify({
                        email: customer.email.toLowerCase(),
                        password: customer.password
                    }),
                    headers: { "Content-Type": "application/json" }
                });
                if (response.ok) {
                    const data = await response.json();
                    setStore({
                        token: data.access_token,
                        customerId: data.customer_id,
                        currentUserData: data.customer_data,
                        isCustomerLoggedIn: true
                    });
                    sessionStorage.setItem("token", data.access_token);
                    sessionStorage.setItem("customerId", data.customer_id);
                    sessionStorage.setItem("currentUserData", JSON.stringify(data.customer_data));
                    sessionStorage.setItem("isCustomerLoggedIn", true);
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
                try {
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

                    if (response.status !== 201) {
                        throw new Error("Failed to create session");
                    }

                    const responseBody = await response.json();
                    console.log("Session creation response:", responseBody);

                    // Return the actual response data instead of just true
                    return responseBody;
                } catch (error) {
                    console.error("Error creating session:", error);
                    throw error;
                }
            },

            editSession: async (sessionId, updatedSession, token) => {
                try {
                    const response = await fetch(
                        process.env.BACKEND_URL + `/api/session/edit/${sessionId}`,
                        {
                            method: "PUT",
                            body: JSON.stringify({
                                title: updatedSession.title,
                                description: updatedSession.description,
                                is_active: updatedSession.is_active,
                                schedule: updatedSession.schedule,
                                focus_areas: updatedSession.focus_areas,
                                skills: updatedSession.skills,
                                resourceLink: updatedSession.resourceLink,
                                duration: updatedSession.duration,
                                totalHours: updatedSession.totalHours,
                            }),
                            headers: {
                                "Content-Type": "application/json",
                                "Authorization": `Bearer ${token}`
                            }
                        }
                    );

                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }

                    const responseBody = await response.json();
                    console.log(responseBody);

                    return true;
                } catch (error) {
                    console.error("Error in editSession:", error);
                    return false;
                }
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

            deleteSessionById: async (sessionId) => {
                const token = sessionStorage.getItem("token")
                let options = {
                    method: "DELETE",
                    headers: {
                        Authorization: "Bearer " + token
                    }
                }
                let response = await fetch(process.env.BACKEND_URL + "/api/session/delete/" + sessionId, options)
                if (response.status === 200) {
                    let data = await response.json()
                    console.log(data)
                    return true
                } else {
                    alert("Delete Unsuccessful")
                    return false
                }
            },

            // getSessionById: async (sessionId) => {
            //     const token = sessionStorage.getItem("token"); // or however you're storing the token
            //     if (!token) {
            //         console.error("No token found");
            //         return false;
            //     }

            //     try {
            //         const response = await fetch(
            //             process.env.BACKEND_URL + `/api/session/${sessionId}`, {
            //             method: "GET",
            //             headers: {
            //                 "Content-Type": "application/json",
            //                 "Authorization": `Bearer ${token}`
            //             }
            //         });

            //         if (!response.ok) {
            //             console.error("Response not OK:", response.status, response.statusText);
            //             return false;
            //         }

            //         const sessionData = await response.json();
            //         console.log("Session data received:", sessionData);
            //         return sessionData;
            //     } catch (error) {
            //         console.error("Error fetching session data:", error);
            //         return false;
            //     }
            // },

            getSessionById: async (sessionId) => {
                const token = sessionStorage.getItem("token"); // Retrieve the token
                if (!token) {
                    console.error("No token found. Please log in.");
                    return null;
                }

                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/session/${sessionId}`, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`, // Include the token in the Authorization header
                        },
                    });

                    if (!response.ok) throw new Error(`Failed to fetch session. Status: ${response.status}`);

                    const data = await response.json();
                    setStore({ selectedSession: data }); // Save the fetched data in the global store
                    console.log("Session data retrieved successfully:", data);
                } catch (error) {
                    console.error("Error fetching session data:", error);
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
                    process.env.BACKEND_URL + "/api/sessions/customer-sessions", {
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
                    setStore({ ...store, customerSessions: sessions })
                } else {
                    console.error("Failed to fetch customer sessions with status:", response.status);
                }
            },

            confirmMentorForSession: async (sessionId, mentorId, startTime, endTime) => {
                try {
                    const store = getStore();
                    const token = sessionStorage.getItem("token");

                    if (!token) {
                        console.error("No token found, user must be logged in");
                        return false;
                    }

                    const response = await fetch(`${process.env.BACKEND_URL}/api/session/${sessionId}/confirm-mentor/${mentorId}`, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`
                        },
                        body: JSON.stringify({ start_time: startTime, end_time: endTime })
                    });

                    if (response.ok) {
                        const data = await response.json();
                        console.log("Mentor confirmed for session:", data);

                        // Update the relevant store properties
                        const updatedSessions = store.customerSessions.map(session =>
                            session.id === sessionId ? data.session : session
                        );

                        setStore({
                            customerSessions: updatedSessions
                        });

                        return true;
                    } else {
                        console.error("Failed to confirm mentor with status:", response.status);
                        const errorData = await response.json();
                        console.error("Error details:", errorData);
                        return false;
                    }
                } catch (error) {
                    console.error("Error confirming mentor for session:", error);
                    return false;
                }
            },

            addMeetingToAppointment: async (sessionId, appointmentIndex, meetingUrl) => {
                try {
                    const store = getStore();
                    const token = sessionStorage.getItem("token");

                    if (!token) {
                        console.error("No token found, user must be logged in");
                        return false;
                    }

                    const response = await fetch(`${process.env.BACKEND_URL}/api/session/${sessionId}/appointment/meeting`, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`
                        },
                        body: JSON.stringify({
                            appointment_index: appointmentIndex,
                            meetingUrl: meetingUrl
                        })
                    });

                    if (response.ok) {
                        const data = await response.json();
                        console.log("Meeting URL added to appointment:", data);

                        // Update the relevant store properties if needed
                        // This might involve updating customerSessions or other state
                        const updatedSessions = store.customerSessions.map(session => {
                            if (session.id === sessionId) {
                                // Create a new session object with updated appointments
                                return {
                                    ...session,
                                    appointments: session.appointments.map((appointment, index) =>
                                        index === appointmentIndex
                                            ? { ...appointment, meetingUrl: meetingUrl }
                                            : appointment
                                    )
                                };
                            }
                            return session;
                        });

                        setStore({
                            customerSessions: updatedSessions
                        });

                        return data;
                    } else {
                        console.error("Failed to add meeting URL with status:", response.status);
                        const errorData = await response.json();
                        console.error("Error details:", errorData);
                        return false;
                    }
                } catch (error) {
                    console.error("Error adding meeting URL to appointment:", error);
                    return false;
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