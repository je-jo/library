const myLibrary = [];
const displayLibrary = document.getElementById("library");

const btnCreate = document.getElementById("btn-create");
const btnCancelCreate = document.getElementById("cancel-create");

const formAdd = document.getElementById("form-add");
const inputTitle = document.getElementById("input-title");
const inputAuthor = document.getElementById("input-author");
const inputPages = document.getElementById("input-pages");
const inputDate = document.getElementById("input-date");

const dialogAdd = document.getElementById("dialog-add");

const template = document.getElementById("card-template");

const dialogDelete = document.getElementById("dialog-delete");
const dialogDeleteText = document.getElementById("dialog-text");
const dialogCancelDelete = document.getElementById("cancel-delete");
const dialogConfirmDelete = document.getElementById("confirm-delete");

let indexOfItemToDelete; // values set when clicking on card's delete button
let nodeToDelete;

const formEdit = document.getElementById("form-edit");
const editTitle = document.getElementById("edit-title");
const editAuthor = document.getElementById("edit-author");
const editPages = document.getElementById("edit-pages");
const editDate = document.getElementById("edit-date");

const dialogEdit = document.getElementById("dialog-edit");
const dialogCancelEdit = document.getElementById("cancel-edit");

let bookObjToEditId;
let nodeToEdit;
let editedTitle;
let editedAuthor;
let editedPages;
let editedDate;

function formatDate(date) {
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

formEdit.addEventListener("submit", (e) => {
myLibrary.forEach(book => {
    if (bookObjToEditId === book.id) {
      editedTitle = editTitle.value;
      editedAuthor= editAuthor.value;
      editedPages = Number(editPages.value);
      if (editDate.value) {
        editedDate = new Date(editDate.value);
      } else {
        editedDate = "No date set";
      }
      book.editBook();
    }
  });
  nodeToEdit.querySelector(".card-title").textContent = editedTitle;
  nodeToEdit.querySelector(".card-author").textContent = `by ${editedAuthor};`;
  nodeToEdit.querySelector(".card-pages").textContent = `${editedPages} pages.`;
  nodeToEdit.querySelector(".card-date").textContent = `\xa0\xa0${formatDate(editedDate)}.\xa0`;
  e.preventDefault();
  dialogEdit.close();
});

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
  this.id = Date.now() + Math.random(1000);
};

Book.prototype.editBook = function editBook() {
  this.title = editedTitle;
  this.author = editedAuthor;
  this.pages = editedPages;
  this.date = editedDate;
}

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
  const card = template.content.cloneNode(true); // created from template as a #document-fragment and not node, must be defined as node to manipulate.
  const cardTitle = card.querySelector(".card-title");
  const cardReference = cardTitle.parentNode.parentNode;
  cardReference.setAttribute("id", this.id);
  // Children of doc fragments are actual nodes. To reference doc fragment as a node, it can be defined as a parent of it's child (grandparent in this case).
  // Otherwise, the usual node methods (setAttribute(), remove()...) won't work.
  const cardAuthor = card.querySelector(".card-author");
  const cardPages = card.querySelector(".card-pages");
  const cardDate = card.querySelector(".card-date");
  const cardReadCheckbox = card.querySelector(".card-read-checkbox");
  const cardReadLabel = card.querySelector(".card-read-label");
  cardReadLabel.setAttribute("for", `card-read-${this.id}`);
  cardReadCheckbox.setAttribute("id", cardReadLabel.getAttribute("for")); // checkbox and label must have matching and unique ids and fors
  const cardReturnedCheckbox = card.querySelector(".card-returned-checkbox");
  const cardReturnedLabel = card.querySelector(".card-returned-label");
  cardReturnedLabel.setAttribute("for", `card-returned-${this.id}`);
  cardReturnedCheckbox.setAttribute("id", cardReturnedLabel.getAttribute("for"));
  const cardEdit = card.querySelector(".card-edit");
  const cardDelete = card.querySelector(".card-delete");
  
  cardTitle.textContent = this.title;
  cardAuthor.textContent = `by ${this.author};`;
  cardPages.textContent = `${this.pages} pages.`;
  cardDate.textContent = `\xa0\xa0${formatDate(this.date)}.\xa0`; // Non-breakable space added

  displayLibrary.insertBefore(card, displayLibrary.firstChild); // add new books to top

  cardReadCheckbox.addEventListener("change", () => {
    this.toggleStatus("read", cardReadCheckbox.checked);
    cardReference.dataset.read = this.read;
    cardReadLabel.childNodes[1].textContent = this.updateLabelText("read");
    // textContent on label element alone won't work because checkbox is nested within the label so changing text content would overwrite the checkbox itself.
  });

  cardReturnedCheckbox.addEventListener("change", () => {
    this.toggleStatus("returned", cardReturnedCheckbox.checked);
    cardReference.dataset.returned = this.returned;
    cardReturnedLabel.childNodes[1].textContent = this.updateLabelText("returned");
  });

  cardEdit.addEventListener("click", () => {
    bookObjToEditId = this.id;
    nodeToEdit = cardReference;
    dialogEdit.showModal();
    editTitle.value = this.title;
    editAuthor.value = this.author;
    editPages.value = this.pages;
    editDate.value = this.date.toLocaleDateString("en-CA"); // converts date object back to appropriate string
  });

  cardDelete.addEventListener("click", () => {
    dialogDeleteText.textContent = `Are you sure you want to remove "${this.title}"?`;
    indexOfItemToDelete = myLibrary.indexOf(this);
    nodeToDelete = cardReference;
    dialogDelete.showModal();
  });
};


dialogCancelEdit.addEventListener("click", () => {
  dialogEdit.close();
});

dialogCancelDelete.addEventListener("click", () => {
  dialogDelete.close();
});

dialogConfirmDelete.addEventListener("click", () => {
  myLibrary.splice(indexOfItemToDelete, 1);
  nodeToDelete.remove();
  dialogDelete.close();
});

btnCreate.addEventListener("click", () => {
  dialogAdd.showModal();
});

btnCancelCreate.addEventListener("click", () => {
  dialogAdd.close();
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
    tempBook.date = "No date set";
  }
  addBookToLibrary(tempBook);
  tempBook.createCard();
  formAdd.reset();
  e.preventDefault();
  dialogAdd.close();
}

formAdd.addEventListener("submit", createBook);



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

/* const desetLjutihGusara = new Book("Deset Ljutih Gusara", "Ljubivoje Ršumović", 30, new Date("2023-01-17"));
addBookToLibrary(desetLjutihGusara);
desetLjutihGusara.toggleStatus("read");
desetLjutihGusara.toggleStatus("returned");
desetLjutihGusara.createCard(); */
