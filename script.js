let country = document.getElementById("country");
let center = document.querySelector(".center");
let second = document.querySelector(".second");
let error = document.querySelector(".error");

document.getElementById("searchForm").addEventListener("submit", (e) => {
  e.preventDefault();
  getAPIdata();
});

function generate(key, value, container) {
  let keydiv = document.createElement("div");
  keydiv.innerHTML = key;
  keydiv.classList.add("keydiv");

  let valuediv = document.createElement("div");
  if (key === "Flags :-") {
    let img = document.createElement("img");
    img.src = value;
    valuediv.append(img);
  } else if (key === "Maps :-") {
    let a = document.createElement("a");
    a.href = value;
    a.target = "_blank";
    a.innerHTML = "Google Map";
    valuediv.append(a);
  } else {
    valuediv.innerHTML = value;
  }

  let items = document.createElement("div");
  items.classList.add("items");

  items.appendChild(keydiv);
  items.appendChild(valuediv);
  container.appendChild(items);
}

function generateLeft(value, container, type = "text") {
  let valuediv = document.createElement("div");
  if (type === "img") {
    let img = document.createElement("img");
    img.src = value;
    valuediv.append(img);
  } else {
    valuediv.innerHTML = value;
  }
  container.appendChild(valuediv);
}

async function getAPIdata() {
  let name = country.value.trim();
  country.value = "";

  if (!name) {
    second.style.display = "none";
    error.style.display = "block";
    error.innerHTML = `<p style="color:red; text-align:center;">Please enter a country name</p>`;
    return;
  }

  try {
    let res = await fetch(`https://restcountries.com/v3.1/name/${name}?fullText=false`);
    if (!res.ok) {
      second.style.display = "none";
      error.style.display = "block";
      error.innerHTML = `<p style="color:red; text-align:center;">Country not found</p>`;
      return;
    }
    let data = await res.json();

    data = data.filter(
  country =>
    country.name.common.toLowerCase() === name.toLowerCase() ||
    (country.altSpellings &&
      country.altSpellings.some(sp => sp.toLowerCase() === name.toLowerCase()))
);

    if (!data || data.length === 0) {
      second.style.display = "none";
      error.style.display = "block";
      error.innerHTML = `<p style="color:red; text-align:center;">Country not found</p>`;
      return;
    }
    second.innerHTML = "";
    second.style.display = "flex";
    error.style.display = "none";

    data.forEach((country) => {
      let countryBox = document.createElement("div");
      countryBox.classList.add("country-box");

      let leftBox = document.createElement("div");
      leftBox.classList.add("left-box");

      let rightBox = document.createElement("div");
      rightBox.classList.add("right-box");

      generateLeft(country.name.common, leftBox);
      generateLeft(country.flags.png, leftBox, "img");

      generate("Official Name :-", country.name.official, rightBox);
      generate(
        "Capital :-",
        country.capital ? country.capital.join(", ") : "N/A",
        rightBox
      );
      generate("Population :-", country.population.toLocaleString(), rightBox);
      generate("Region :-", country.region, rightBox);
      generate("Subregion :-", country.subregion, rightBox);
      generate("Continents :-", country.continents, rightBox);
      generate(
        "Currency :-",
        country.currencies
          ? Object.values(country.currencies)[0].name +
              " (" +
              Object.values(country.currencies)[0].symbol +
              ")"
          : "N/A",
        rightBox
      );
      generate(
        "Languages :-",
        country.languages ? Object.values(country.languages).join(", ") : "N/A",
        rightBox
      );
      generate("Maps :-", country.maps.googleMaps, rightBox);
      countryBox.appendChild(leftBox);
      countryBox.appendChild(rightBox);

      second.appendChild(countryBox);
    });
  } catch (err) {
    error.style.display = "block";
    second.style.display = "none";
    error.innerHTML = `<p style="color:red; text-align:center;">${err.message}</p>`;
  }
}
