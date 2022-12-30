const myLibrary = [];
const displayLibrary = document.querySelector("#library");

function Book(title, author, pages) {
  this.title = title;
  this.author = author;
  this.pages = pages;
}

function addBookToLibrary(book) {
  myLibrary.unshift(book); // add as first item
}

/* Book.prototype.isRead = function isRead(checked) { // called when clicking on a checkbox, if it's checked the book is read
  this.read = checked ?? false; // nuelish coaelescing, because it's also called on load before any checking, so return false if undefined
}; */

Book.prototype.createCard = function createCard() {
  const displayItem = document.createElement("li");
  const displayTitle = document.createElement("h2");
  displayTitle.textContent = this.title;
  const displayAuthor = document.createElement("p");
  displayAuthor.textContent = `by ${this.author};`;
  const displayPages = document.createElement("p");
  displayPages.textContent = `${this.pages} pages.`;

 /* const displayCheckboxStatus = document.createElement("input");
  displayCheckboxStatus.setAttribute("type", "checkbox"); */

  const displayStatus = document.createElement("p");
  // this.isRead(this.read);
  displayStatus.textContent = this.read;
  /* displayCheckboxStatus.addEventListener("click", (e) => {
    this.isRead(e.target.checked); // boolean
    displayStatus.textContent = this.read;
  }); */
  const deleteItem = document.createElement("button");
  deleteItem.textContent = "Delete book";
  displayItem.appendChild(displayTitle);
  displayItem.appendChild(displayAuthor);
  displayItem.appendChild(displayPages);
  // displayItem.appendChild(displayCheckboxStatus);
  displayItem.appendChild(displayStatus);
  displayItem.appendChild(deleteItem);
  deleteItem.addEventListener("click", () => {
    myLibrary.splice(myLibrary.indexOf(this), 1);
    displayItem.remove();
  });
  displayItem.classList.add("card");
  displayLibrary.appendChild(displayItem);
};

function updateDisplay() {
  displayLibrary.textContent = ""; // first empty out the display array, then add all books, is there a better way?
  myLibrary.forEach((book) => {
    // book.isRead();
    book.createCard();
  });
}

const form = document.querySelector("form");
const btnShowForm = document.getElementById("show-form");
btnShowForm.addEventListener("click", () => {
  form.style.display = "block";
  btnShowForm.style.display = "none";
});

const inputTitle = document.getElementById("title");
const inputAuthor = document.getElementById("author");
const inputPages = document.getElementById("pages");
// const inputStatus = document.getElementById("status");


function getValue(e) {
  const tempBook = new Book(
    inputTitle.value,
    inputAuthor.value,
    inputPages.value,
  );
  /* inputStatus.addEventListener("click", () => {
    tempBook.isRead(inputStatus.checked); // boolean
}); */
  addBookToLibrary(tempBook);
  updateDisplay();
  form.style.display = "none";
  btnShowForm.style.display = "block";
  e.preventDefault();
}

const btnAddBook = document.getElementById("add-book");
btnAddBook.addEventListener("click", getValue);

// temporary manually added books, free to delete later

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

// end temporary

updateDisplay();
