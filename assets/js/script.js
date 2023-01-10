const myLibrary = [];
const displayLibrary = document.getElementById("library");

const form = document.getElementById("form-add");
const inputTitle = document.getElementById("input-title");
const inputAuthor = document.getElementById("input-author");
const inputPages = document.getElementById("input-pages");
const inputDate = document.getElementById("input-date");

const template = document.getElementById("card-template");

function Book(title, author, pages, date) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.date = date;
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
  if (this[prop]) {
    return `${prop.at(0).toUpperCase() + prop.slice(1)}.`;
  }
  return `Not ${prop} yet.`;
};

Book.prototype.setDate = function setDate(e) {
  return e.currentTarget.value;
};

Book.prototype.createCard = function createCard() {
  this.setId();
  const card = template.content.cloneNode(true); // created from template as a doc fragment and not node, must be defined as node to manipulate
  const cardTitle = card.querySelector(".card-title");
  cardTitle.textContent = this.title;
  const cardRef = cardTitle.parentNode.parentNode; 
  // children of doc fragments are actual nodes, so cardRef is an actual node
  cardRef.setAttribute("id", this.id);
  const cardAuthor = card.querySelector(".card-author");
  cardAuthor.textContent = `by ${this.author};`;
  const cardPages = card.querySelector(".card-pages");
  cardPages.textContent = `${this.pages} pages.`;
  const cardDate = card.querySelector(".card-date");
  cardDate.textContent = `Return by: ${this.date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })}.`;
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
  cardReadCheckbox.addEventListener("change", () => {
    this.toggleStatus("read", cardReadCheckbox.checked);
    cardReadLabel.childNodes[1].textContent = this.updateLabelText("read");
    // textContent on label alone won't work because checkbox is nested within the label so changing text content would overwrite the checkbox itself.
  });
  cardReturnedCheckbox.addEventListener("change", () => {
    this.toggleStatus("returned", cardReturnedCheckbox.checked);
    this.updateLabelText(cardReturnedLabel, "returned");
    cardReturnedLabel.childNodes[1].textContent =
      this.updateLabelText("returned");
  });

  const dialogDelete = document.querySelector(".confirm");
  const dialogDeleteText = dialogDelete.querySelector(".dialog-text");
  const dialogCancelDelete = dialogDelete.querySelector(".cancel-delete");
  const dialogConfirmDelete = dialogDelete.querySelector(".confirm-delete");

  cardDelete.addEventListener("click", () => {
    dialogDeleteText.textContent = `Are you sure you want to remove "${this.title}"?`;
    dialogDelete.showModal();
  });

  dialogCancelDelete.addEventListener("click", () => {
    dialogDelete.close();
  });

  dialogConfirmDelete.addEventListener("click", () => {    
    myLibrary.splice(myLibrary.indexOf(this), 1);
    cardRef.remove();
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
    Number(inputPages.value),
    inputDate.value
  );
  if (inputDate.value) {
    tempBook.date = new Date(inputDate.value);
  } else {
    tempBook.date = "No date set.";
  }
  addBookToLibrary(tempBook);
  tempBook.createCard();
  form.style.display = "none";
  btnCreate.style.display = "block";
  form.reset();
  e.preventDefault();
}

form.addEventListener("submit", createBook);

// temporary manually added books, free to delete later:

const kockar = new Book(
  "Kockar",
  "F. M. Dostojevski",
  186,
  new Date("2022-12-23")
);
const priceIzSume = new Book(
  "Priče iz šume",
  "Nikoleta Novak",
  146,
  new Date("2022-12-23")
);
const vragolaniIDzangrizala = new Book(
  "Vragolani i džangrizala",
  "Toni Vulf",
  44,
  new Date("2022-12-23")
);
const glineniUdar = new Book(
  "Glineni udar",
  "Donald Lemke",
  41,
  new Date("2022-12-23")
);
const idiot = new Book(
  "Idiot",
  "F. M. Dostojevski",
  681,
  new Date("2022-12-23")
);
const desetLjutihGusara = new Book(
  "Deset Ljutih Gusara",
  "Ljubivoje Ršumović",
  30,
  new Date("2023-01-17")
);
const najgoriUciteljiNaSvetu = new Book(
  "Najgori učitelji na svetu",
  "Dejvid Valijams",
  304,
  new Date("2023-01-17")
);
const priceSaImanja = new Book(
  "Priče sa imanja",
  "Paskal Veder d'Orija, Pjer Kuron",
  112,
  new Date("2023-01-17")
);

addBookToLibrary(kockar);
addBookToLibrary(priceIzSume);
addBookToLibrary(vragolaniIDzangrizala);
addBookToLibrary(glineniUdar);
addBookToLibrary(idiot);
addBookToLibrary(desetLjutihGusara);
addBookToLibrary(najgoriUciteljiNaSvetu);
addBookToLibrary(priceSaImanja);

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
