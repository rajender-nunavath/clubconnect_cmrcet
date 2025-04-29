import { auth, database } from "./firebase-config.js";
import { signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { ref, get } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

// Login Function
window.login = function () {
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    signInWithEmailAndPassword(auth, email, password)
        .then(userCredential => {
            const user = userCredential.user;
            const userRef = ref(database, "users/" + user.uid);
            get(userRef).then(snapshot => {
                const userData = snapshot.val();

                if (userData) {
                    sessionStorage.setItem("userName", userData.name);
                    sessionStorage.setItem("userRole", userData.role);
                    sessionStorage.setItem("userClub", userData.club);

                    const club = userData.club;
                    const role = userData.role;

                    // ✅ Use correct path from scripts folder
                    if (role === "admin") {
                        window.location.href = `/clubs/${club}/admin-dashboard.html`;  
                    } else {
                        window.location.href = `/clubs/${club}/user-dashboard.html`;
                    }
                } else {
                    alert("User data not found!");
                }
            });
        })
        .catch(error => alert(error.message));
};

// Logout Function
window.logout = function () {
    signOut(auth)
        .then(() => {
            sessionStorage.clear();
            alert("Logged out successfully!");
            window.location.href = "../login.html"; // ✅ Corrected path
        })
        .catch(error => alert(error.message));
};
