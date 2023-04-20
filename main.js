let menuIcon = document.querySelector("header .container > img");
let modMenu = "close";
let mobileNav = document.querySelector("header ul.mobile-nav");
let form = document.forms[0];
let input = document.querySelector("section.form .container form div input");
let linksSection = document.querySelector("section.links .container");
let copyBtns = document.querySelectorAll("section.links .link div button");
let data = [];
if (window.sessionStorage.getItem("links") != null) {
  data = JSON.parse(window.sessionStorage.getItem("links"));
  addToPage(data);
}
let tryBtn = document.querySelector("section.main button");

menuIcon.addEventListener("click", () => {
  if (modMenu == "close") {
    mobileNav.style.display = "flex";
    modMenu = "open";
  } else {
    mobileNav.style.display = "none";
    modMenu = "close";
  }
});
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (input.value == "") {
    input.parentElement.classList.add("not-valid");
  } else {
    input.parentElement.classList.remove("not-valid");
    await addToArray(input.value);
    addToSession(data);
    addToPage(data);
    input.value = "";
  }
});
function copyButtons() {
  copyBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      for (let item of data) {
        if (item.shortLink == btn.previousElementSibling.textContent) {
          item.copy = true;
          navigator.clipboard.writeText(btn.previousElementSibling.textContent);
          addToPage(data);
          addToSession(data);
          break;
        }
      }
    });
  });
}
copyButtons();
async function addToArray(inputValue) {
  try {
    let item = {
      link: inputValue,
      shortLink: await shortenURL(input.value),
      copy: false,
      id: Date.now(),
    };
    data.push(item);
  } catch (error) {
    console.log(error.message);
  }
}
function addToSession(array) {
  let jsonData = JSON.stringify(array);
  window.sessionStorage.setItem("links", jsonData);
}
function addToPage(array) {
  linksSection.innerHTML = "";
  array.forEach((item) => {
    linksSection.innerHTML += `<div class="link">
      <p>${item.link}</p>
      <div>
        <p id=${item.id}>${item.shortLink}</p>
        <button class="btn" data-copy="${item.copy}">${
      item.copy ? "copied" : "copy"
    }</button>
      </div>
    </div>`;
  });
  copyBtns = document.querySelectorAll("section.links .link div button");
  copyButtons();
}

async function shortenURL(longURL) {
  const baseURL = "https://api.shrtco.de/v2/shorten?url=";
  const apiURL = baseURL + encodeURIComponent(longURL);
  try {
    const response = await fetch(apiURL);
    if (response.ok) {
      const data = await response.json();
      const shortURL = data.result.full_short_link;
      return shortURL;
    } else {
      console.error("Error:", response.statusText);
      throw new Error(response.statusText);
    }
  } catch (error) {
    console.error("Error:", error.message);
    return "";
  }
}
tryBtn.addEventListener("click", () => {
  document.forms[0].querySelector("input[type='text']").focus();
  window.scrollTo({
    top: 390,
    behavior: "smooth",
  });
});
