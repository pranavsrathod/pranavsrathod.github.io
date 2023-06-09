// Read the CSV file2
file2 = "Pow/customModels.csv";
xhr2 = new XMLHttpRequest();
xhr2.open("GET", file2, true);
xhr2.onreadystatechange = function () {
  if (xhr2.readyState === 4 && xhr2.status === 200) {
    const csvData = xhr2.responseText;
    const items = parseCSV(csvData);
    generateCards(items);
  }
};
xhr2.send();

// Function to parse the CSV data
function parseCSV(csv) {
  const lines = csv.split("\n");
  const headers = lines[0].split(",");
  const items = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(",");
    const item = {};

    for (let j = 0; j < headers.length; j++) {
      item[headers[j]] = values[j];
    }

    items.push(item);
  }

  return items;
}

// Function to generate cards from the CSV data
function generateCards(items) {
  const cardContainer = document.getElementById("custom-list");

  items.forEach((item) => {
    const card = document.createElement("div");
    card.className = "card";
    card.style.width = "20rem";

    const image = document.createElement("img");
    image.className = "card-img-top";
    image.src = "Pow/" + item.ImageAddress;
    image.alt = "Card image cap";
    
    console.log("Girly Pop" + item.ImageAddress);
    // colog(image);

    const cardBody = document.createElement("div");
    cardBody.className = "card-body";

    const title = document.createElement("h5");
    title.className = "card-title";
    title.textContent = item.Name;

    const author = document.createElement("p");
    author.textContent = item.Author;

    const list = document.createElement("ul");
    list.className = "list-group list-group-flush";

    const interactiveness = document.createElement("li");
    interactiveness.className = "list-group-item";
    interactiveness.textContent = "Interactiveness: " + item.Interactiveness;

    const sound = document.createElement("li");
    sound.className = "list-group-item";
    sound.textContent = "Sound: " + item.Sound;

    const animation = document.createElement("li");
    animation.className = "list-group-item";
    animation.textContent = "Animation: " + item.Animation;

    list.appendChild(interactiveness);
    list.appendChild(sound);
    list.appendChild(animation);

    cardBody.appendChild(title);
    cardBody.appendChild(author);

    card.appendChild(image);
    card.appendChild(cardBody);
    card.appendChild(list);

    cardContainer.appendChild(card);
  });
}

