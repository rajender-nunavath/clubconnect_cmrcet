function redirectTo(club) {
    sessionStorage.setItem("selectedClub", club);
    window.location.href = "signup.html";
}
