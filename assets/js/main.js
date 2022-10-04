const KEY_RAK_SELESAI_DIBACA = "Rak Selesai Dibaca";
const KEY_RAK_BELUM_DIBACA = "Rak Belum Dibaca";

var rakSelesaiDibacaList = [];
var originalRakSelesaiDibacaList = [];
var rakBelumDibacaList = [];
var originalRakBelumDibacaList = [];

var contentForm = undefined;
var contentRakSelesaiDibaca = undefined;
var contentRakBelumDibaca = undefined;

document.addEventListener("DOMContentLoaded", function () {
  contentForm = document.getElementById("contentForm");
  contentRakSelesaiDibaca = document.getElementById("rakSelesaiDibaca");
  contentRakBelumDibaca = document.getElementById("rakBelumDibaca");

  if (checkHasStorage()) {
    reloadRakSelesaiDibaca();
    reloadRakBelumDibaca();

    contentForm.querySelector("form").addEventListener("submit", function (event) {
      event.preventDefault();
      let data = {};
      let id = this.querySelector("input[name='id']").value;
      data.id = id || +new Date();
      data.judul = this.querySelector("input[name='judul']").value;
      data.penerbit = this.querySelector("input[name='penerbit']").value;
      data.tahun = this.querySelector("input[name='tahun']").value;
      data.url_cover = this.querySelector("input[name='url_cover']").value;
      data.isComplete = this.querySelector("input[name='isComplete']").checked;

      saveDataToStorage(data, data.isComplete, id);

      reloadRakSelesaiDibaca();
      reloadRakBelumDibaca();
      closeForm();
      this.reset();
    });

    document.getElementById("inputRakSelesaiDibaca").addEventListener("input", function (event) {
      let value = event.target.value;
      rakSelesaiDibacaList = originalRakSelesaiDibacaList.filter((item) => {
        return item.judul.toLowerCase().includes(value.toLowerCase());
      });

      let cardBody = contentRakSelesaiDibaca.querySelector(".card-body");
      setBookItem(rakSelesaiDibacaList, cardBody, true);
    });

    document.getElementById("inputRakBelumDibaca").addEventListener("input", function (event) {
      let value = event.target.value;
      rakBelumDibacaList = originalRakBelumDibacaList.filter((item) => {
        return item.judul.toLowerCase().includes(value.toLowerCase());
      });

      let cardBody = contentRakBelumDibaca.querySelector(".card-body");
      setBookItem(rakBelumDibacaList, cardBody, false);
    });
  }
});

function showForm(book = {}) {
  if (contentForm.classList.contains("d-none")) {
    contentForm.classList.remove("d-none");
    contentForm.classList.add("d-block");
  }

  if (contentRakSelesaiDibaca.classList.contains("d-block")) {
    contentRakSelesaiDibaca.classList.remove("d-block");
    contentRakSelesaiDibaca.classList.add("d-none");
  }

  if (contentRakBelumDibaca.classList.contains("d-block")) {
    contentRakBelumDibaca.classList.remove("d-block");
    contentRakBelumDibaca.classList.add("d-none");
  }

  if (book.id) {
    contentForm.querySelector(".card-header-title").innerText = "Edit Buku";
    contentForm.querySelector("input[name='id']").value = book.id;
    contentForm.querySelector("input[name='judul']").value = book.judul;
    contentForm.querySelector("input[name='penerbit']").value = book.penerbit;
    contentForm.querySelector("input[name='tahun']").value = book.tahun;
    contentForm.querySelector("input[name='url_cover']").value = book.url_cover;
    contentForm.querySelector("input[name='isComplete']").checked = book.isComplete;
  } else {
    contentForm.querySelector(".card-header-title").innerText = "Tambah Buku";
  }
}

function closeForm() {
  if (contentForm.classList.contains("d-block")) {
    contentForm.classList.remove("d-block");
    contentForm.classList.add("d-none");
  }

  if (contentRakSelesaiDibaca.classList.contains("d-none")) {
    contentRakSelesaiDibaca.classList.remove("d-none");
    contentRakSelesaiDibaca.classList.add("d-block");
  }

  if (contentRakBelumDibaca.classList.contains("d-none")) {
    contentRakBelumDibaca.classList.remove("d-none");
    contentRakBelumDibaca.classList.add("d-block");
  }
}

function checkHasStorage() {
  if (typeof Storage === undefined) {
    alert("Browser kamu tidak mendukung local storage");
    return false;
  }
  return true;
}

function saveDataToStorage(data, isComplete, id) {
  let isStorageExist = checkHasStorage();
  if (isStorageExist) {
    if (id) {
      let indexSelesai = originalRakSelesaiDibacaList.findIndex((item) => item.id == id);
      let indexBelum = originalRakBelumDibacaList.findIndex((item) => item.id == id);
      if (indexSelesai > -1) {
        originalRakSelesaiDibacaList.splice(indexSelesai, 1);
        originalRakBelumDibacaList.push(data);
      } else if (indexBelum > -1) {
        originalRakBelumDibacaList.splice(indexBelum, 1);
        originalRakSelesaiDibacaList.push(data);
      }
    } else {
      if (isComplete) {
        originalRakSelesaiDibacaList.push(data);
      } else {
        originalRakBelumDibacaList.push(data);
      }
    }

    localStorage.setItem(KEY_RAK_SELESAI_DIBACA, JSON.stringify(originalRakSelesaiDibacaList));
    localStorage.setItem(KEY_RAK_BELUM_DIBACA, JSON.stringify(originalRakBelumDibacaList));
  }
}

function getDataFromStorage(KEY_STORAGE) {
  let isStorageExist = checkHasStorage();
  if (isStorageExist) {
    let data = localStorage.getItem(KEY_STORAGE);
    if (data !== null) {
      return JSON.parse(data);
    }
  }
  return [];
}

function reloadRakSelesaiDibaca() {
  originalRakSelesaiDibacaList = getDataFromStorage(KEY_RAK_SELESAI_DIBACA);

  originalRakSelesaiDibacaList.sort((a, b) => {
    return a.judul.localeCompare(b.judul);
  });

  rakSelesaiDibacaList = originalRakSelesaiDibacaList;

  let cardBody = contentRakSelesaiDibaca.querySelector(".card-body");

  setBookItem(rakSelesaiDibacaList, cardBody, true);
}

function reloadRakBelumDibaca() {
  originalRakBelumDibacaList = getDataFromStorage(KEY_RAK_BELUM_DIBACA);

  originalRakBelumDibacaList.sort((a, b) => {
    return a.judul.localeCompare(b.judul);
  });

  rakBelumDibacaList = originalRakBelumDibacaList;

  let cardBody = contentRakBelumDibaca.querySelector(".card-body");

  setBookItem(rakBelumDibacaList, cardBody, false);
}

function setBookItem(books, body, isCompleted) {
  body.innerHTML = "";

  if (books.length === 0) {
    body.innerHTML = "<p class='text-center'>Tidak ada buku</p>";
    return;
  }

  for (let [key, book] of books.entries()) {
    let bookItem = document.createElement("div");
    let bookCoverDiv = document.createElement("div");
    let bookCover = document.createElement("img");
    let bookDetailDiv = document.createElement("div");
    let bookTitle = document.createElement("h3");
    let bookAuthor = document.createElement("p");
    let bookYear = document.createElement("p");
    let bookButtonDiv = document.createElement("div");
    let bookButtonDelete = document.createElement("button");
    let bookButtonMove = document.createElement("button");
    let bookButtonEdit = document.createElement("button");

    bookItem.classList.add("book-item", "row");
    bookCoverDiv.classList.add("book-item-cover", "col-auto");
    bookDetailDiv.classList.add("book-item-detail", "col");
    bookButtonDiv.classList.add("book-item-action", "col-3");
    bookTitle.classList.add("book-item-title");
    bookAuthor.classList.add("book-item-author");
    bookYear.classList.add("book-item-year");

    if (isCompleted) {
      bookButtonMove.classList.add("btn", "btn-green");
      bookButtonMove.innerText = "Belum Selesai Dibaca";
    } else {
      bookButtonMove.classList.add("btn", "btn-green");
      bookButtonMove.innerText = "Selesai Dibaca";
    }
    bookButtonMove.addEventListener("click", function (e) {
      moveBook(key, book, isCompleted);
    });

    bookButtonEdit.classList.add("btn", "btn-yellow");
    bookButtonEdit.innerText = "Edit";
    bookButtonEdit.addEventListener("click", function (e) {
      showForm(book);
    });

    bookButtonDelete.classList.add("btn", "btn-red");
    bookButtonDelete.innerText = "Hapus Buku";
    bookButtonDelete.addEventListener("click", function (e) {
      removeBook(key, isCompleted);
    });

    bookCover.src = book.url_cover || "./assets/img/cover_book.jpg";
    bookCover.alt = book.judul;
    bookTitle.innerText = book.judul;
    bookAuthor.innerText = book.penerbit;
    bookYear.innerText = book.tahun;

    bookCoverDiv.appendChild(bookCover);
    bookDetailDiv.appendChild(bookTitle);
    bookDetailDiv.appendChild(bookAuthor);
    bookDetailDiv.appendChild(bookYear);
    bookButtonDiv.appendChild(bookButtonMove);
    bookButtonDiv.appendChild(bookButtonEdit);
    bookButtonDiv.appendChild(bookButtonDelete);
    bookItem.appendChild(bookCoverDiv);
    bookItem.appendChild(bookDetailDiv);
    bookItem.appendChild(bookButtonDiv);
    body.appendChild(bookItem);
  }
}

function moveBook(index, book, isCompleted) {
  let isStorageExist = checkHasStorage();
  if (isStorageExist) {
    if (isCompleted) {
      originalRakSelesaiDibacaList.splice(index, 1);
      book.isComplete = false;
      originalRakBelumDibacaList.push(book);
    } else {
      originalRakBelumDibacaList.splice(index, 1);
      book.isComplete = true;
      originalRakSelesaiDibacaList.push(book);
    }

    localStorage.setItem(KEY_RAK_SELESAI_DIBACA, JSON.stringify(originalRakSelesaiDibacaList));
    localStorage.setItem(KEY_RAK_BELUM_DIBACA, JSON.stringify(rakBelumDibacaList));
    reloadRakSelesaiDibaca();
    reloadRakBelumDibaca();
  }
}

function removeBook(index, isCompleted) {
  let isStorageExist = checkHasStorage();
  if (isStorageExist) {
    confirm("Apakah anda yakin ingin menghapus buku ini?").then((result) => {
      if (result) {
        if (isCompleted) {
          originalRakSelesaiDibacaList.splice(index, 1);
          localStorage.setItem(KEY_RAK_SELESAI_DIBACA, JSON.stringify(originalRakSelesaiDibacaList));
          reloadRakSelesaiDibaca();
        } else {
          originalRakBelumDibacaList.splice(index, 1);
          localStorage.setItem(KEY_RAK_BELUM_DIBACA, JSON.stringify(originalRakBelumDibacaList));
          reloadRakBelumDibaca();
        }
      }
    });
  }
}

window.alert = function (msg, title = "Perhatian!") {
  let modalAlert = document.createElement("div");
  let modalContent = document.createElement("div");
  let modalTitle = document.createElement("h2");
  let modalContentText = document.createElement("p");
  let modalButton = document.createElement("button");

  modalAlert.classList.add("modal-alert");
  modalContent.classList.add("modal-alert-content");
  modalButton.classList.add("modal-alert-btn");

  modalButton.innerText = "OK";

  modalTitle.innerText = title;
  modalContentText.innerText = msg;
  modalContent.appendChild(modalTitle);
  modalContent.appendChild(modalContentText);
  modalContent.appendChild(modalButton);
  modalAlert.appendChild(modalContent);
  document.body.appendChild(modalAlert);

  modalButton.addEventListener("click", function () {
    modalAlert.remove();
  });
};

window.confirm = function (msg, title = "Konfirmasi") {
  return new Promise((resolve, reject) => {
    let modalAlert = document.createElement("div");
    let modalContent = document.createElement("div");
    let modalTitle = document.createElement("h2");
    let modalContentText = document.createElement("p");
    let modalButton = document.createElement("button");
    let modalButtonCancel = document.createElement("button");

    modalAlert.classList.add("modal-alert");
    modalContent.classList.add("modal-alert-content");
    modalButton.classList.add("modal-alert-btn", "btn-red", "mr-2");
    modalButtonCancel.classList.add("modal-alert-btn");

    modalButton.innerText = "OK";
    modalButtonCancel.innerText = "Cancel";

    modalTitle.innerText = title;
    modalContentText.innerText = msg;
    modalContent.appendChild(modalTitle);
    modalContent.appendChild(modalContentText);
    modalContent.appendChild(modalButton);
    modalContent.appendChild(modalButtonCancel);
    modalAlert.appendChild(modalContent);
    document.body.appendChild(modalAlert);

    modalButton.addEventListener("click", function () {
      modalAlert.remove();
      resolve(true);
    });

    modalButtonCancel.addEventListener("click", function () {
      modalAlert.remove();
      resolve(false);
    });
  });
};
