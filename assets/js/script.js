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

Book.prototype.isRead = function isRead(checked) {
  if (checked) {
    this.read = "Yes.";
  } else {
    this.read = "Not read yet.";
  }
};

const template = document.getElementById("card-template");

const inputStatus = document.getElementById("status");

Book.prototype.createCard = function createCard() {
  const displayItem = template.content.cloneNode(true);
  const displayTitle = displayItem.querySelector(".card-title");
  displayTitle.textContent = this.title;
  const displayAuthor = displayItem.querySelector(".card-author");
  displayAuthor.textContent = `by ${this.author};`;
  const displayPages = displayItem.querySelector(".card-pages");
  displayPages.textContent = `${this.pages} pages.`;
  const displayStatus = displayItem.querySelector(".card-read");
  this.isRead(inputStatus.checked);
  /* const editStatus = displayItem.querySelector(".edit-status");
  editStatus.addEventListener("change", () => {
  }) */
  displayStatus.textContent = this.read;
  const deleteItem = displayItem.querySelector(".card-delete");
  displayLibrary.insertBefore(displayItem, displayLibrary.firstChild);
  deleteItem.addEventListener("click", (e) => {
    myLibrary.splice(myLibrary.indexOf(this), 1);
    e.currentTarget.parentNode.remove();
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

/* inputStatus.addEventListener("change", (e) => {
  if (e.target.checked) {
    console.log(inputStatus.value)
    console.log(inputStatus.checked)
    return true
  } 
    console.log(inputStatus.value)
    console.log(inputStatus.checked)
    return false
  
  
}); */

function getValue(e) {
  const tempBook = new Book(
    inputTitle.value,
    inputAuthor.value,
    Number(inputPages.value)
  );
  // console.log(inputStatus.checked)
  // tempBook.isRead(inputStatus.checked);
  addBookToLibrary(tempBook);
  tempBook.createCard();
  form.style.display = "none";
  btnShowForm.style.display = "block";
  form.reset();
  e.preventDefault();
}

form.addEventListener("submit", getValue);

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

kockar.isRead();
priceIzSume.isRead();
vragolaniIDzangrizala.isRead();
glineniUdar.isRead();

kockar.createCard();
priceIzSume.createCard();
vragolaniIDzangrizala.createCard();
glineniUdar.createCard();
console.table(myLibrary);

// end temporary
