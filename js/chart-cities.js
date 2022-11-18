// navbar menu toggle

const menu = document.querySelector("#mobile-menu")
const menuLinks = document.querySelector(".navbar_menu")

menu.addEventListener("click", function () {
  menu.classList.toggle("is-active")
  menuLinks.classList.toggle("active")
})

// color theme
const colorThemes = document.querySelectorAll('[name="theme"]')

function storeTheme(theme) {
  localStorage.setItem("theme", theme)
}

function setTheme() {
  const activeTheme = localStorage.getItem("theme")
  colorThemes.forEach((themeOption) => {
    if (themeOption.id === activeTheme) {
      themeOption.checked = true
    }
  })
  // document.documentElement.className = theme
}

colorThemes.forEach((themeOption) => {
  themeOption.addEventListener("click", () => {
    storeTheme(themeOption.id)
  })
})

document.onload = setTheme()

//cities
const getBtn = document.querySelector("#getbtn")
const postBtn = document.querySelector("#postbtn")
const patchBtn = document.querySelector("#patchbtn")
const list = document.querySelector("#ul_list")
const dropdown = document.querySelector("#dropdown_list")
const city = document.querySelector("#name")
const population = document.querySelector("#popluation")
const form = document.querySelector("#form")

// fetch api
function getCities() {
  fetch("https://avancera.app/cities/")
    .then((response) => response.json())
    .then((data) => {
      console.log(data)
      list.innerHTML = ""
      dropdown.innerHTML = ""
      // creates the list and items
      for (let i = 0; i < data.length; i++) {
        console.log(data[i].name)
        let listitem = document.createElement("li")
        let deleteBtn = document.createElement("button")
        deleteBtn.classList.add("delete_btn")
        deleteBtn.textContent = "Delete"
        let option = document.createElement("option")
        let optionlist = document.createTextNode(data[i].name)
        let name = document.createTextNode(
          data[i].name + " - " + data[i].population
        )
        list.appendChild(listitem)
        listitem.appendChild(name)
        listitem.appendChild(deleteBtn)
        dropdown.appendChild(option)
        option.appendChild(optionlist)
        // changes the api
        patchBtn.addEventListener("click", () => {
          if (data[i].name === document.querySelector("#dropdown_list").value) {
            fetch(`https://avancera.app/cities/${data[i].id}`, {
              body: JSON.stringify({
                name: city.value,
                population: parseInt(
                  document.querySelector("#population").value
                ),
              }),
              headers: { "Content-Type": "application/json" },
              method: "PATCH",
            }).then((response) => {
              console.log(response)
              getCities()
            })
          }
        })
        // deletes the selected api
        deleteBtn.addEventListener("click", () => {
          fetch(`https://avancera.app/cities/${data[i].id}`, {
            method: "DELETE",
          }).then((response) => {
            console.log(response)
            getCities()
          })
        })
      }
    })
}

function submitForm(e) {
  e.preventDefault()
}

getBtn.addEventListener("click", getCities)
form.addEventListener("submit", submitForm)

// posts an api
function postCities() {
  fetch("https://avancera.app/cities/", {
    body: JSON.stringify({
      name: city.value,
      population: parseInt(document.querySelector("#population").value),
    }),
    headers: { "Content-Type": "application/json" },
    method: "POST",
  })
    .then((response) => response.json())
    .then((result) => {
      console.log(result)
      getCities()
    })
}

postBtn.addEventListener("click", postCities)

// chartjs
getData()

async function getData() {
  const response = await fetch(
    "https://www.themealdb.com/api/json/v1/1/categories.php"
  )

  const data = await response.json()
  length = data.categories.length

  labels = []
  values = []
  for (i = 0; i < length; i++) {
    labels.push(data.categories[i].strCategory)
    values.push(data.categories[i].idCategory)
  }

  new Chart(document.querySelector("#myChart"), {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Categories",
          backgroundColor: [
            "#3e95cd",
            "#8e5ea2",
            "#3cba9f",
            "#e8c3b9",
            "#c45850",
            "#CD5C5C",
            "#40E0D0",
            "#3e95cd",
            "#8e5ea2",
            "#3cba9f",
            "#e8c3b9",
            "#c45850",
            "#CD5C5C",
            "#40E0D0",
          ],
          data: values,
        },
      ],
    },
    options: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "Categories",
      },
    },
  })
}
