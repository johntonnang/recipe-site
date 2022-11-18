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

// recipe and food items
const searchBtn = document.querySelector("#search_btn")
const foodList = document.querySelector("#food")
const foodDetailsContent = document.querySelector(".food_details_content")
const recipeCloseBtn = document.querySelector("#recipe_close_btn")

searchBtn.addEventListener("click", getFoodList)
foodList.addEventListener("click", getFoodRecipe)
recipeCloseBtn.addEventListener("click", () => {
  foodDetailsContent.parentElement.classList.remove("showRecipe")
})

// function to fetch food list
function getFoodList() {
  let searchInputTxt = document.querySelector("#search_input").value.trim()
  fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?i=${searchInputTxt}`
  )
    .then((response) => response.json())
    .then((data) => {
      let html = ""
      if (data.meals) {
        data.meals.forEach((food) => {
          html += `
          <div class="food_item" data-id ="${food.idMeal}">
            <div class="food_img">
              <img src="${food.strMealThumb}" alt="food">
            </div>
          <div class="food_name">
            <h3>${food.strMeal}</h3>
            <a href="#" class="recipe_btn">Get recipe</a>
          </div>
        </div>
          `
        })
        foodList.classList.remove("notFound")
      } else {
        html =
          "Sorry, we were unable to find any recipes for this ingredient. Please try again."
        foodList.classList.add("notFound")
      }

      foodList.innerHTML = html
    })
}

// function to get the recipe
function getFoodRecipe(e) {
  e.preventDefault()
  if (e.target.classList.contains("recipe_btn")) {
    let foodItem = e.target.parentElement.parentElement
    fetch(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${foodItem.dataset.id}`
    )
      .then((response) => response.json())
      .then((data) => foodRecipeModal(data.meals))
  }
}

// function to open the recipe modal
function foodRecipeModal(food) {
  food = food[0]
  const ingredients = []

  for (let i = 1; i <= 20; i++) {
    if (food[`strIngredient${i}`]) {
      ingredients.push(
        `${food[`strIngredient${i}`]} - ${food[`strMeasure${i}`]}`
      )
    } else {
      break
    }
  }
  let html = `
  <h2 class="recipe_title">${food.strMeal}</h2>
  <p class="recipe_category">${food.strCategory}</p>
  <p class="recipe_category">${food.strArea}</p>
  <h3>Ingredients:</h3>
  <ul class="ingredient_list">
    ${ingredients.map((ingredient) => `<li>${ingredient}</li>`).join("")}
  </ul>
  <div class="recipe_instruct">
    <h3>Instructions:</h3>
    <p>${food.strInstructions}</p>
  </div>
  <div class="recipe_food_img">
    <img src="${food.strMealThumb}" alt="food">
  </div>
  <div class="recipe_link">
    <a href="${food.strYoutube}" target="_blank">Watch Video</a>
  </div>
  `
  foodDetailsContent.innerHTML = html
  foodDetailsContent.parentElement.classList.add("showRecipe")
}
