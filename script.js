const fruitForm = document.querySelector("#inputSection form");
const fruitList = document.querySelector("#fruitSection ul");
const fruitNutrition = document.querySelector("#nutritionSection p");
const createForm = document.querySelector("#createForm");
const deleteForm = document.querySelector("#deleteForm");

let cal = 0;
const fruitCal = {};
const apiKey = "49561278-0045f3ad356d6e1e391312a23";

fruitForm.addEventListener("submit", extractFruit);
createForm.addEventListener("submit", createNewFruit);
deleteForm.addEventListener("submit", deleteFruit);

function extractFruit(e) {
  e.preventDefault();
  fetchFruitData(e.target.fruitInput.value);
  e.target.fruitInput.value = "";
}

async function fetchFruitData(fruit) {
  try {
    //Make sure to replace this link with your deployed API URL in this fetch
    const respData = await fetch(
      `https://fruit-api-rdpe.onrender.com/fruits/${fruit}`
    );
    const respImg = await fetch(
      `https://pixabay.com/api/?q=${fruit}+fruit&key=${apiKey}`
    );

    if (respData.ok && respImg.ok) {
      const data = await respData.json();
      const imgData = await respImg.json();
      addFruit(data, imgData);
    } else {
      throw "Something has gone wrong with one of the API requests";
    }
  } catch (e) {
    console.log(e);
  }
}

function addFruit(fruit, fruitImg) {
  const img = document.createElement("img");
  img.classList.add("fruits");
  img.alt = fruit.name;
  img.src = fruitImg.hits[0].previewURL;

  img.addEventListener("click", removeFruit, { once: true });
  fruitList.appendChild(img);

  fruitCal[fruit.name] = fruit.nutritions.calories;

  cal += fruit.nutritions.calories;
  fruitNutrition.textContent = "Total Calories: " + cal;
}

function removeFruit(e) {
  const fruitName = e.target.alt;
  cal -= fruitCal[fruitName];
  fruitNutrition.textContent = "Total Calories: " + cal;

  delete fruitCal[fruitName];
  e.target.remove();
}

async function createNewFruit(params) {
  params.preventDefault();

  const response = await fetch("https://fruit-api-rdpe.onrender.com/fruits", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: params.target.fruitInput.value,
    }),
  });
  //console.log(response);
  let messageStatus = document.querySelector("#createMessage");

  if (response.status === 201) {
    params.target.fruitInput.value = "";
    messageStatus.textContent = "Fruit Successfully Created!";

    setTimeout(() => {
      messageStatus.textContent = "";
    }, 4000);
  } else {
    params.target.fruitInput.value = "";
    messageStatus.textContent = "Fruit Creation Failed!";
    setTimeout(() => {
      messageStatus.textContent = "";
    }, 4000);
  }
}

async function deleteFruit(params) {
  params.preventDefault();
  let fruit = params.target.fruitInput.value;

  const response = await fetch(
    `https://fruit-api-rdpe.onrender.com/fruits/${fruit}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: params.target.fruitInput.value,
      }),
    }
  );
  if (response.status === 204) {
    params.target.fruitInput.value = "";
    deleteMessage.textContent = "Fruit Successfully Deleted!";

    setTimeout(() => {
      deleteMessage.textContent = "";
    }, 4000);
  } else {
    params.target.fruitInput.value = "";
    deleteMessage.textContent = "Fruit Deletion Failed!";
    setTimeout(() => {
      deleteMessage.textContent = "";
    }, 4000);
  }
}
