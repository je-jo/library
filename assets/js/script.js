const myLibrary = [];
const displayLibrary = document.getElementById("library");

const form = document.getElementById("form-add");
const inputTitle = document.getElementById("input-title");
const inputAuthor = document.getElementById("input-author");
const inputPages = document.getElementById("input-pages");

const template = document.getElementById("card-template");

function Book(title, author, pages) {
  this.title = title;
  this.author = author;
  this.pages = pages;
}

function addBookToLibrary(book) {
  myLibrary.unshift(book);
}

Book.prototype.setId = function setId() {
  this.id = Date.now() + myLibrary.indexOf(this);
};

Book.prototype.toggleStatus = function toggleStatus(key, checked) {
  this[key] = !!checked; // if checkbox checked, set value of object's key to true
};

Book.prototype.updateLabelText = function updateLabelText(prop) {
  const string = String(prop);
  if (this[prop]) {
    return `${string.at(0).toUpperCase() + string.slice(1)}.`;
  }
  return `Not ${string} yet.`;
};

Book.prototype.createCard = function createCard() {
  this.setId();
  const card = template.content.cloneNode(true);
  const cardTitle = card.querySelector(".card-title");
  cardTitle.textContent = this.title;
  const cardAuthor = card.querySelector(".card-author");
  cardAuthor.textContent = `by ${this.author};`;
  const cardPages = card.querySelector(".card-pages");
  cardPages.textContent = `${this.pages} pages.`;

  const cardReadCheckbox = card.querySelector(".card-read-checkbox");
  const cardReadLabel = card.querySelector(".card-read-label");
  const cardReturnedCheckbox = card.querySelector(".card-returned-checkbox");
  const cardReturnedLabel = card.querySelector(".card-returned-label");
  cardReadLabel.setAttribute("for", `card-read-${this.id}`);
  cardReadCheckbox.setAttribute("id", cardReadLabel.getAttribute("for")); // checkbox and label must have matching and unique ids and fors
  cardReturnedLabel.setAttribute("for", `card-returned-${this.id}`);
  cardReturnedCheckbox.setAttribute(
    "id",
    cardReturnedLabel.getAttribute("for")
  );

  const cardDelete = card.querySelector(".card-delete");
  displayLibrary.insertBefore(card, displayLibrary.firstChild); // add new books to top

  cardReadCheckbox.addEventListener("click", () => {
    this.toggleStatus("read", cardReadCheckbox.checked);
    cardReadLabel.childNodes[1].textContent = this.updateLabelText("read");
    // textContent on label alone won't work because checkbox is nested within the label so changing text content would overwrite the checkbox itself.
  });

  cardReturnedCheckbox.addEventListener("click", () => {
    this.toggleStatus("returned", cardReturnedCheckbox.checked);
    this.updateLabelText(cardReturnedLabel, "returned");
    cardReturnedLabel.childNodes[1].textContent =
      this.updateLabelText("returned");
  });

  cardDelete.addEventListener("click", (e) => {
    if (window.confirm(`Are you sure you want to delete "${this.title}"`)) {
      myLibrary.splice(myLibrary.indexOf(this), 1);
      e.currentTarget.parentNode.parentNode.remove(); // same as card.remove() but it won't work because card is not added to DOM at this point.
    }
  });
};

const btnCreate = document.getElementById("btn-create");
btnCreate.addEventListener("click", () => {
  form.style.display = "block";
  btnCreate.style.display = "none";
});

function createBook(e) {
  const tempBook = new Book(
    inputTitle.value,
    inputAuthor.value,
    Number(inputPages.value)
  );
  addBookToLibrary(tempBook);
  tempBook.createCard();
  form.style.display = "none";
  btnCreate.style.display = "block";
  form.reset();
  e.preventDefault();
}

form.addEventListener("submit", createBook);

// temporary manually added books, free to delete later:

const kockar = new Book("Kockar", "F. M. Dostojevski", 186);
const priceIzSume = new Book("Priče iz šume", "Nikoleta Novak", 146);
const vragolaniIDzangrizala = new Book(
  "Vragolani i džangrizala",
  "Toni Vulf",
  44
);
const glineniUdar = new Book("Glineni udar", "Donald Lemke", 41);
const idiot = new Book("Idiot", "F. M. Dostojevski", 681);
const desetLjutihGusara = new Book(
  "Deset Ljutih Gusara",
  "Ljubivoje Ršumović",
  30
);
const najgoriUciteljiNaSvetu = new Book(
  "Najgori učitelji na svetu",
  "Dejvid Valijams",
  304
);
const priceSaImanja = new Book(
  "Priče sa imanja",
  "Paskal Veder d'Orija, Pjer Kuron",
  112
);

addBookToLibrary(kockar);
addBookToLibrary(priceIzSume);
addBookToLibrary(vragolaniIDzangrizala);
addBookToLibrary(glineniUdar);
addBookToLibrary(idiot);
addBookToLibrary(desetLjutihGusara);
addBookToLibrary(najgoriUciteljiNaSvetu);
addBookToLibrary(priceSaImanja);

kockar.toggleStatus("read");
priceIzSume.toggleStatus("read");
vragolaniIDzangrizala.toggleStatus("read");
glineniUdar.toggleStatus("read");
idiot.toggleStatus("read");
desetLjutihGusara.toggleStatus("read");
najgoriUciteljiNaSvetu.toggleStatus("read");
priceSaImanja.toggleStatus("read");
kockar.toggleStatus("returned");
priceIzSume.toggleStatus("returned");
vragolaniIDzangrizala.toggleStatus("returned");
glineniUdar.toggleStatus("returned");
idiot.toggleStatus("returned");
desetLjutihGusara.toggleStatus("returned");
najgoriUciteljiNaSvetu.toggleStatus("returned");
priceSaImanja.toggleStatus("returned");

kockar.createCard();
priceIzSume.createCard();
vragolaniIDzangrizala.createCard();
glineniUdar.createCard();
idiot.createCard();
desetLjutihGusara.createCard();
najgoriUciteljiNaSvetu.createCard();
priceSaImanja.createCard();

// end temporary

// example book

/* const desetLjutihGusara = new Book("Deset Ljutih Gusara", "Ljubivoje Ršumović", 30);
addBookToLibrary(desetLjutihGusara);
desetLjutihGusara.toggleStatus("read");
desetLjutihGusara.toggleStatus("returned");
desetLjutihGusara.createCard(); */
