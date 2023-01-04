const myLibrary = [];
const displayLibrary = document.querySelector("#library");

const form = document.querySelector("form");
const inputTitle = document.getElementById("input-title");
const inputAuthor = document.getElementById("input-author");
const inputPages = document.getElementById("input-pages");
const inputRead = document.getElementById("input-read");

const template = document.getElementById("card-template");

function Book(title, author, pages) {
  this.title = title;
  this.author = author;
  this.pages = pages;
}

function addBookToLibrary(book) {
  myLibrary.unshift(book);
}

Book.prototype.isRead = function isRead(checked) {
  if (checked) {
    this.read = "Yes.";
  } else {
    this.read = "Not read yet.";
  }
};

Book.prototype.createCard = function createCard() {
  const card = template.content.cloneNode(true);
  const cardTitle = card.querySelector(".card-title");
  cardTitle.textContent = this.title;
  const cardAuthor = card.querySelector(".card-author");
  cardAuthor.textContent = `by ${this.author};`;
  const cardPages = card.querySelector(".card-pages");
  cardPages.textContent = `${this.pages} pages.`;
  const cardEditRead = card.querySelector(".edit-read");
  const editReadLabel = card.querySelector(".edit-read-label")
  editReadLabel.setAttribute("for", `edit-read-${Date.now() + myLibrary.indexOf(this)}`)
  cardEditRead.setAttribute("id", editReadLabel.getAttribute("for")) // checkbox and label must have matching and unique ids and fors
  cardEditRead.checked = inputRead.checked; // if checked on creation leave it checked
  const cardRead = card.querySelector(".card-read");
  this.isRead(inputRead.checked);
  cardRead.textContent = this.read;
  const cardDelete = card.querySelector(".card-delete");
  displayLibrary.insertBefore(card, displayLibrary.firstChild);

  cardEditRead.addEventListener("click", () => {
    this.isRead(cardEditRead.checked);
    cardRead.textContent = this.read;
  }); 
  cardDelete.addEventListener("click", (e) => {
    myLibrary.splice(myLibrary.indexOf(this), 1);
    e.currentTarget.parentNode.remove(); // same as card.remove() but it won't work because card is not added to DOM at this point.
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
const desetLjutihGusara = new Book("Deset Ljutih Gusara", "Ljubivoje Ršumović", 30);
const najgoriUciteljiNaSvetu = new Book("Najgori učitelji na svetu", "Dejvid Valijams", 304);
const priceSaImanja = new Book("Priče sa imanja", "Paskal Veder d'Orija, Pjer Kuron", 112)

addBookToLibrary(kockar);
addBookToLibrary(priceIzSume);
addBookToLibrary(vragolaniIDzangrizala);
addBookToLibrary(glineniUdar);
addBookToLibrary(idiot);
addBookToLibrary(desetLjutihGusara);
addBookToLibrary(najgoriUciteljiNaSvetu);
addBookToLibrary(priceSaImanja);

kockar.isRead();
priceIzSume.isRead();
vragolaniIDzangrizala.isRead();
glineniUdar.isRead();
idiot.isRead();
desetLjutihGusara.isRead();
najgoriUciteljiNaSvetu.isRead();
priceSaImanja.isRead();

kockar.createCard();
priceIzSume.createCard();
vragolaniIDzangrizala.createCard();
glineniUdar.createCard();
idiot.createCard();
desetLjutihGusara.createCard();
najgoriUciteljiNaSvetu.createCard();
priceSaImanja.createCard();

// end temporary
