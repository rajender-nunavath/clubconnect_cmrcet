import { database, auth } from "../../scripts/firebase-config.js";
        import { ref, get, remove } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";
        import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

        document.addEventListener("DOMContentLoaded", function () {
            const userName = sessionStorage.getItem("userName");
            const userRole = sessionStorage.getItem("userRole");
            const userClub = sessionStorage.getItem("userClub");
            let userEmail = sessionStorage.getItem("userEmail"); // Store email
        
            if (!userName || userRole !== "admin" || !userClub) {
                window.location.href = "../../login.html"; // Redirect if session data is missing
                return;
            }
        
            // If email is null, fetch from Firebase Auth
            if (!userEmail) {
                onAuthStateChanged(auth, (user) => {
                    if (user) {
                        userEmail = user.email; // Get email from Firebase Auth
                        sessionStorage.setItem("userEmail", userEmail); // Store it in sessionStorage
                        document.getElementById("emailInfo").innerText = `Email: ${userEmail}`;
                    } else {
                        console.log("Admin email not found.");
                    }
                });
            } else {
                document.getElementById("emailInfo").innerText = `Email: ${userEmail}`;
            }
        
            // Set Admin Details
            document.getElementById("admin-name").innerText = userName;
            document.getElementById("welcomeMessage").innerText = `Welcome, Admin ${userName}`;
            document.getElementById("clubInfo").innerText = `Club: ${userClub}`;
        
            // Fetch Club Data
            fetchClubData(userClub);
        });
        

        function fetchClubData(club) {
            const membersRef = ref(database, "users");
            get(membersRef).then(snapshot => {
                let members = [];
                snapshot.forEach(childSnapshot => {
                    const userData = childSnapshot.val();
                    if (userData.club === club && userData.role === "user") {
                        members.push({ id: childSnapshot.key, ...userData });
                    }
                });

                document.getElementById("member-count").innerText = members.length;
                const membersList = document.getElementById("members-list");
                membersList.innerHTML = "";

                members.forEach(member => {
                    let row = document.createElement("tr");
                    row.innerHTML = `
                        <td>${member.name}</td>
                        <td>${member.email}</td>
                        <td>${member.phone || "No phone"}</td>
                        <td><button class="remove-btn" onclick="removeMember('${member.id}')">Remove</button></td>
                    `;
                    membersList.appendChild(row);
                });
            });

            // Fetch Announcements
            const announcementsRef = ref(database, `clubs/${club}/announcements`);
            get(announcementsRef).then(snapshot => {
                const announcements = snapshot.val() ? Object.values(snapshot.val()) : [];
                document.getElementById("announcement-count").innerText = announcements.length;
            });

            // Fetch Messages
            const messagesRef = ref(database, `clubs/${club}/messages`);
            get(messagesRef).then(snapshot => {
                const messages = snapshot.val() ? Object.values(snapshot.val()) : [];
                document.getElementById("message-count").innerText = messages.length;
            });
        }

        // Remove Member Function
        window.removeMember = function (userId) {
            if (confirm("Are you sure you want to remove this member?")) {
                remove(ref(database, `users/${userId}`))
                    .then(() => {
                        alert("Member removed successfully");
                        location.reload();
                    })
                    .catch(error => alert("Error: " + error.message));
            }
        };

        // Logout Function
        window.logout = function () {
            signOut(auth).then(() => {
                sessionStorage.clear();
                alert("Logged out successfully!");
                window.location.href = "../../login.html";
            }).catch(error => alert(error.message));
        };