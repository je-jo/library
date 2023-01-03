const myLibrary = [];
const displayLibrary = document.querySelector("#library");

function Book(title, author, pages) {
  this.title = title;
  this.author = author;
  this.pages = pages;
}

function addBookToLibrary(book) {
  myLibrary.unshift(book);
}

/* Book.prototype.isRead = function isRead(checked) { // called when clicking on a checkbox, if it's checked the book is read
  this.read = checked ?? false; // nuelish coaelescing, because it's also called on load before any checking, so return false if undefined
}; */

const template = document.getElementById("card-template");

Book.prototype.createCard = function createCard() {
  const displayItem = template.content.cloneNode(true);
  const displayTitle = displayItem.querySelector(".book-title");
  displayTitle.textContent = this.title;
  const displayAuthor = displayItem.querySelector(".book-author");
  displayAuthor.textContent = `by ${this.author};`;;
  const displayPages = displayItem.querySelector(".book-pages");
  displayPages.textContent = `${this.pages} pages.`;
  const displayStatus = displayItem.querySelector(".book-read");
  displayStatus.textContent = `Not read yet.`;
  const deleteItem = displayItem.querySelector(".book-delete");
  displayLibrary.insertBefore(displayItem, displayLibrary.firstChild);
  deleteItem.addEventListener("click", (e) => {
    myLibrary.splice(myLibrary.indexOf(this), 1);
    e.currentTarget.parentNode.remove()
  });
};

const form = document.querySelector("form");
const btnShowForm = document.getElementById("show-form");
btnShowForm.addEventListener("click", () => {
  form.style.display = "block";
  btnShowForm.style.display = "none";
});

const inputTitle = document.getElementById("title");
const inputAuthor = document.getElementById("author");
const inputPages = document.getElementById("pages");

function getValue(e) {
  const tempBook = new Book(
    inputTitle.value,
    inputAuthor.value,
    Number(inputPages.value),
  );
  addBookToLibrary(tempBook);
  tempBook.createCard();
  form.style.display = "none";
  btnShowForm.style.display = "block";
  inputTitle.value = "";
  inputAuthor.value = "";
  inputPages.value = "";
  e.preventDefault();
}

const btnAddBook = document.getElementById("add-book");
btnAddBook.addEventListener("click", getValue);

// temporary manually added books, free to delete later:

const kockar = new Book("Kockar", "F.M.Dostojevski", 186);
const priceIzSume = new Book("Priče iz šume", "Nikoleta Novak", 146, false);
const vragolaniIDzangrizala = new Book(
  "Vragolani i džangrizala",
  "Toni Vulf",
  44
);
const glineniUdar = new Book("Glineni udar", "Donald Lemke", 41); 

addBookToLibrary(kockar);
addBookToLibrary(priceIzSume);
addBookToLibrary(vragolaniIDzangrizala);
addBookToLibrary(glineniUdar); 

kockar.createCard();
priceIzSume.createCard();
vragolaniIDzangrizala.createCard();
glineniUdar.createCard();

// end temporary


