document.getElementById("ice-cream-form").onsubmit = () => {
    let isValid = true;
    //clear all errors upon submitting the form
    clearErrors();

    //Validate name
    let name = document.getElementById("name").value;
    if(name === "") {
        document.getElementById("error-name").style.display = "block";
        isValid = false;
    }
    
    //Validate email
    let email = document.getElementById("email").value;
    if(email === "") {
        document.getElementById("error-email").style.display = "block";
        isValid = false;
    }

    //Validate flavor
    let flavor = document.getElementById("flavor").value;
    if(flavor === "none") {
        document.getElementById("error-flavor").style.display = "block";
        isValid = false;
    }

    //Validate cone
    let coneButtons = document.getElementsByName("cone");
    let coneSelected = false;
    for(let i  = 0; i < coneButtons.length; i++) {
        if(coneButtons[i].checked) {
            coneSelected = true;
        }
    }
    if(!coneSelected) {
        document.getElementById("error-cone").style.display = "block";
        isValid = false;
    }

    return isValid;
}

//clear errors
function clearErrors() {
    let errors = document.getElementsByClassName("error");
    for(let i = 0; i < errors.length; i++) {
        errors[i].style.display = "none";
    }
}

