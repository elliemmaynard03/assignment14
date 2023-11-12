const getCountries = async() => {
    try {
        return (await fetch("https://countries.onrender.com/api/countries")).json();
    } catch (error) {
        console.log(error);
    }
};

const showCountries = async() => {
    let countries = await getCountries();
    let countriesDiv = document.getElementById("country-list");
    countriesDiv.innerHTML = "";
    countries.forEach((country) => {
        const section = document.createElement("section");
        section.classList.add("country");
        countriesDiv.append(section);

        const a = document.createElement("a");
        a.href = "#";
        section.append(a);

        const h3 = document.createElement("h3");
        h3.innerHTML = country.name;
        a.append(h3);

        a.onclick = (e) => {
            e.preventDefault();
            displayDetails(country);
        };
    });
};

const displayDetails = (country) => {
    const countryDetails = document.getElementById("country-details");
    countryDetails.innerHTML = "";

    const h3 = document.createElement("h3");
    h3.innerHTML = country.name;
    countryDetails.append(h3);

    const language = document.createElement("p");
    countryDetails.append(language);
    language.innerHTML = "Language: "+country.language;

    const origin = document.createElement("p");
    countryDetails.append(origin);
    origin.innerHTML = "Origin: "+country.origin;

    const p = document.createElement("p");
    countryDetails.append(p);
    p.innerHTML = "Capitol: "+country.capitol;

    const president = document.createElement("p");
    countryDetails.append(president);
    president.innerHTML = "President: "+country.president;

    const ul = document.createElement("ul");
    countryDetails.append(ul);
    ul.innerHTML = "Funfacts: ";
    console.log(country.funfacts);
    country.funfacts.forEach((funfact) => {
        const li = document.createElement("li");
        ul.append(li);
        li.innerHTML = funfact;
    });

    populateEditForm(country);
};

const populateEditForm = (country) => {};

const addEditCountry = async(e) => {
    e.preventDefault();
    const form = document.getElementById("add-edit-country-form");
    const formData = new FormData(form);
    let response;
  
    if (form._id.value == -1) {
        formData.delete("_id");
        formData.delete("img");
        formData.append("funfacts", getFunfacts());

        console.log(...formData);

        response = await fetch("https://countries.onrender.com/api/countries", {
            method: "POST",
            body: formData
        });
    }

    //successfully got data from server
    if (response.status != 200) {
        const errorMessage = document.getElementById("error-message");
        errorMessage.style.display = "block";

        // Delay hiding the error message for 3 seconds
        setTimeout(() => {
            errorMessage.style.display = "none";
        }, 3000);

        console.log("Error posting data");
        return;
    } else {
        // Display success message for 3 seconds
        const successMessage = document.getElementById("success-message");
        successMessage.style.display = "block";
        setTimeout(() => {
            successMessage.style.display = "none";
            resetForm();
        document.querySelector(".dialog").classList.add("transparent");
        showCountries();
        }, 3000);
    }

    response = await response.json();
    
};

const getFunfacts = () => {
    const inputs = document.querySelectorAll("#funfact-boxes input");
    let funfacts = [];

    inputs.forEach((input) => {
        funfacts.push(input.value);
    });

    return funfacts;
}

const resetForm = () => {
    const form = document.getElementById("add-edit-country-form");
    form.reset();
    form._id = "-1";
    document.getElementById("funfact-boxes").innerHTML = "";
};

const showHideAdd = (e) => {
    e.preventDefault();
    document.querySelector(".dialog").classList.remove("transparent");
    document.querySelector(".dialog").classList.add("animation");
    document.getElementById("add-edit-title").innerHTML = "Add Country";
    resetForm();
};

const addFunfact = (e) => {
    e.preventDefault();
    const section = document.getElementById("funfact-boxes");
    const input = document.createElement("input");
    input.type = "text";
    section.append(input);
}



window.onload = () => {
    showCountries();
    document.getElementById("add-edit-country-form").onsubmit = addEditCountry;
    document.getElementById("add-link").onclick = showHideAdd;

    document.querySelector(".close").onclick = () => {
        document.querySelector(".dialog").classList.add("transparent");
    };

    document.getElementById("add-funfact").onclick = addFunfact;
};