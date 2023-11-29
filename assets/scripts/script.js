const key = "junx";
const menambahkanBuku = document.getElementById("memasukanBuku");
const mencari = document.getElementById("cari");

function mengecekStorage() {
  return typeof Storage !== "undefined";
}

function getListBuku() {
  if (mengecekStorage) {
    return JSON.parse(localStorage.getItem(key));
  }
  return [];
}

function ResetAllForm() {
  document.getElementById("masukanJudulBuku").value = "";
  document.getElementById("masukanPenulisBuku").value = "";
  document.getElementById("masukanTahunBuku").value = "";
  document.getElementById("bukuTerbaca").checked = false;
  document.getElementById("mencariBuku").value = "";
}

window.addEventListener("load", function () {
  if (mengecekStorage) {
    if (localStorage.getItem(key) !== null) {
      const dataBuku = getListBuku();
      RenderlistBuku(dataBuku);
    }
  } else {
    alert("Browser yang Anda gunakan tidak mendukung Web Storage");
  }
});

function RenderlistBuku(dataBuku) {
  if (dataBuku === null) {
    return;
  }
  const containerIncomplete = document.getElementById("listBukuBelumTerbaca");
  const containerComplete = document.getElementById("listBukuTerbaca");
  function membuatTombolPindah(buku, eventListener) {
    const selesai = buku.isComplete
      ? `<i class="fa-solid fa-book-open"></i>`
      : `<i class="fa-solid fa-book-bookmark"></i>`;
    const buttonPindah = document.createElement("button");
    buttonPindah.classList.add("pindahkan");
    buttonPindah.innerHTML = selesai + " pindahkan";
    buttonPindah.addEventListener("click", (e) => {
      eventListener(e);
    });
    return buttonPindah;
  }
  function membuatTombolHapus(eventListener) {
    const buttonHapus = document.createElement("button");
    buttonHapus.classList.add("hapus");
    buttonHapus.innerHTML = `<i class="fa-solid fa-trash"></i>` + " hapus";
    buttonHapus.addEventListener("click", (e) => {
      eventListener(e);
    });
    return buttonHapus;
  }
  containerIncomplete.innerHTML = "";
  containerComplete.innerHTML = "";
  for (let buku of dataBuku) {
    const id = buku.id;
    const image =
      buku.image === undefined ? "assets/image/book.jpg" : buku.image;
    const title = buku.title;
    const author = buku.author;
    const year = buku.year;
    const category = buku.category;
    const isComplete = buku.isComplete;

    let itemBuku = document.createElement("article");
    itemBuku.classList.add("buku");
    itemBuku.innerHTML = `<img src="${image}"/>`;
    itemBuku.innerHTML += `<div class="title" name = ${id}>
    <h2>${title.charAt(0).toUpperCase() + title.slice(1)}</h2></div>`;
    itemBuku.innerHTML += `<div class="deskripsi" ><h5>Penulis : ${
      author.charAt(0).toUpperCase() + author.slice(1)
    }</h5><h5>Tahun : ${year}</h5></div>`;
    itemBuku.innerHTML += `<h5 class="${category}">${
      category.charAt(0).toUpperCase() + category.slice(1)
    }</h5>`;
    let containerActionItem = document.createElement("div");
    containerActionItem.classList.add("action");

    const pindah = membuatTombolPindah(buku, (e) => {
      handleComplete(e.target.parentElement.parentElement);

      const dataBuku = getListBuku();
      ResetAllForm();
      RenderlistBuku(dataBuku);
    });

    const hapus = membuatTombolHapus((e) => {
      menghapus(e.target.parentElement.parentElement);

      const dataBuku = getListBuku();
      ResetAllForm();
      RenderlistBuku(dataBuku);
    });

    containerActionItem.append(pindah, hapus);
    itemBuku.append(containerActionItem);

    if (isComplete === false) {
      containerIncomplete.append(itemBuku);

      continue;
    }
    containerComplete.append(itemBuku);
  }
}
menambahkanBuku.addEventListener("submit", function (e) {
  const title = document.getElementById("masukanJudulBuku").value;
  const author = document.getElementById("masukanPenulisBuku").value;
  const year = document.getElementById("masukanTahunBuku").value;
  const category = document.getElementById("kategori").value;
  const isComplete = document.getElementById("bukuTerbaca").checked;
  const idTemp = document.getElementById("mencariBuku").name;
  if (idTemp !== "") {
    const dataBuku = getListBuku();
    {
      dataBuku.map((i) => {
        if (dataBuku[i].id === idTemp) {
          dataBuku[i].title = title;
          dataBuku[i].image = image_preview.src;
          dataBuku[i].author = author;
          dataBuku[i].year = year;
          dataBuku[i].category = category;
          dataBuku[i].isComplete = isComplete;
        }
      });
    }
    localStorage.setItem(key, JSON.stringify(dataBuku));
    ResetAllForm();
    RenderBookList(dataBuku);
    return;
  }
  const id =
    JSON.parse(localStorage.getItem(key)) === null
      ? 0 + Date.now()
      : JSON.parse(localStorage.getItem(key)).length + Date.now();
  const bukuBaru = {
    id: id,
    image: image_preview.src,
    title: title,
    author: author,
    year: parseInt(year),
    category: category,
    isComplete: isComplete,
  };
  meletakanBukuBaru(bukuBaru);
  const dataBuku = getListBuku();
  RenderlistBuku(dataBuku);
});
function meletakanBukuBaru(data) {
  if (mengecekStorage()) {
    let dataBuku = [];
    if (localStorage.getItem(key) !== null) {
      dataBuku = JSON.parse(localStorage.getItem(key));
    }
    dataBuku.push(data);
    localStorage.setItem(key, JSON.stringify(dataBuku));
  }
}
function menghapus(i) {
  const dataBuku = getListBuku();
  if (dataBuku.length === 0) {
    return;
  }
  const titleNameAttribut = i.childNodes[1].getAttribute("name");
  for (let i = 0; i < dataBuku.length; i++) {
    if (dataBuku[i].id == titleNameAttribut) {
      dataBuku.splice(i, 1);
      break;
    }
  }
  localStorage.setItem(key, JSON.stringify(dataBuku));
}
function handleComplete(i) {
  const dataBuku = getListBuku();
  if (dataBuku.length === 0) {
    return;
  }
  const titleNameAttribut = i.childNodes[1].getAttribute("name");
  for (let i = 0; i < dataBuku.length; i++) {
    if (dataBuku[i].id == titleNameAttribut) {
      dataBuku[i].isComplete = !dataBuku[i].isComplete;
      break;
    }
  }
  localStorage.setItem(key, JSON.stringify(dataBuku));
}
function SearchBookList(title) {
  const dataBuku = getListBuku();
  if (dataBuku.length === 0) {
    return;
  }
  const listBuku = [];
  for (let i = 0; i < dataBuku.length; i++) {
    const tempTitle = dataBuku[i].title.toLowerCase();
    const tempTitleTarget = title.toLowerCase();
    if (
      dataBuku[i].title.includes(title) ||
      tempTitle.includes(tempTitleTarget)
    ) {
      listBuku.push(dataBuku[i]);
    }
  }
  return listBuku;
}
mencari.addEventListener("submit", (e) => {
  e.preventDefault();
  const dataBuku = getListBuku();
  if (dataBuku.length === 0) {
    return;
  }
  const title = document.getElementById("mencariBuku").value;
  if (title === null) {
    RenderlistBuku(dataBuku);
    return;
  }
  const listBuku = SearchBookList(title);
  RenderlistBuku(listBuku);
});
const kontrol = document.getElementById("kontrol");
kontrol.addEventListener("click", () => {
  location.reload();
});
const horror = document.getElementById("horror");
horror.addEventListener("click", () => {
  const dataBuku = getListBuku();
  const listBuku = [];
  for (let i = 0; i < dataBuku.length; i++) {
    const tempTitle = dataBuku[i].category;
    if (tempTitle === horror.value) {
      listBuku.push(dataBuku[i]);
      RenderlistBuku(listBuku);
    }
  }
});
const drama = document.getElementById("drama");
drama.addEventListener("click", () => {
  const dataBuku = getListBuku();
  const listBuku = [];
  for (let i = 0; i < dataBuku.length; i++) {
    const tempTitle = dataBuku[i].category;
    if (tempTitle === drama.value) {
      listBuku.push(dataBuku[i]);
      RenderlistBuku(listBuku);
    }
  }
});
const komedi = document.getElementById("komedi");
komedi.addEventListener("click", () => {
  const dataBuku = getListBuku();
  const listBuku = [];
  for (let i = 0; i < dataBuku.length; i++) {
    const tempTitle = dataBuku[i].category;
    if (tempTitle === komedi.value) {
      listBuku.push(dataBuku[i]);
      RenderlistBuku(listBuku);
    }
  }
});
const fantasi = document.getElementById("fantasi");
fantasi.addEventListener("click", () => {
  const dataBuku = getListBuku();
  const listBuku = [];
  for (let i = 0; i < dataBuku.length; i++) {
    const tempTitle = dataBuku[i].category;
    if (tempTitle === fantasi.value) {
      listBuku.push(dataBuku[i]);
      RenderlistBuku(listBuku);
    }
  }
});
const anime = document.getElementById("anime");
anime.addEventListener("click", () => {
  const dataBuku = getListBuku();
  const listBuku = [];
  for (let i = 0; i < dataBuku.length; i++) {
    const tempTitle = dataBuku[i].category;
    if (tempTitle === anime.value) {
      listBuku.push(dataBuku[i]);
      RenderlistBuku(listBuku);
    }
  }
});
const image_preview = document.getElementById("image-preview");
const upload_image = document.getElementById("upload-image");
upload_image.onchange = () => {
  if (upload_image.files[0].size < 1000000) {
    const fr = new FileReader();
    fr.onload = (e) => {
      const image_url = e.target.result;
      image_preview.src = image_url;
      if (image_preview.src === image_url) {
        hapusGambar.classList.remove("close-inActive");
        hapusGambar.classList.add("close-active");
        upload_image_icon.classList.remove("upload-active");
        upload_image_icon.classList.add("upload-inActive");
      }
    };
    fr.readAsDataURL(upload_image.files[0]);
  } else {
    alert("Ukuran terlalu besar");
  }
};
const upload_image_icon = document.getElementById("upload");
const hapusGambar = document.getElementById("close");
hapusGambar.addEventListener("click", () => {
  hapusGambar.classList.add("close-inActive");
  hapusGambar.classList.remove("close-active");
  image_preview.src = "assets/image/book.jpg";
  window.location.reload();
});

const tombolBukuBaru = document.getElementById("buku-baru");
const kembali = document.getElementById("kembali");
const modal = document.getElementById("input-section");
tombolBukuBaru.addEventListener("click", () => {
  modal.classList.add("input-active");
  modal.classList.remove("input-inActive");
});
kembali.addEventListener("click", () => {
  modal.classList.add("input-inActive");
  modal.classList.remove("input-active");
});

const tombolKategori = document.getElementById("kategori-inActive");
const modalKategori = document.getElementById("kontrol");
const kembaliKategori = document.getElementById("close-kategori");
tombolKategori.addEventListener("click", () => {
  modalKategori.classList.add("kontrol-active");
  modalKategori.classList.remove("kontrol-inActive");
  kembaliKategori.classList.add("close-kategori-active");
  kembaliKategori.classList.remove("close-kategori-inActive");
});
kembaliKategori.addEventListener("click", () => {
  modalKategori.classList.add("kontrol-inActive");
  modalKategori.classList.remove("kontrol-active");
  kembaliKategori.classList.add("close-kategori-inActive");
  kembaliKategori.classList.remove("close-kategori-active");
});
window.addEventListener("scroll", () => {
  modalKategori.classList.add("kontrol-inActive", window.screenY > 300);
  modalKategori.classList.remove("kontrol-active", window.screenY > 300);
  kembaliKategori.classList.add(
    "close-kategori-inActive",
    window.screenY > 300
  );
  kembaliKategori.classList.remove(
    "close-kategori-active",
    window.screenY > 300
  );
});
