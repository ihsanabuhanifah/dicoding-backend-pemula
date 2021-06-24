const { nanoid } = require("nanoid");
const books = require("./books");

const addBookHandler = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  let finished = false;
  if (readPage === pageCount) {
    finished = true;
  }

  const id = nanoid(16);
  const createdAt = new Date().toISOString();
  const updatedAt = createdAt;

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
    finished,
    createdAt,
    updatedAt,
  };

  if (request.payload.hasOwnProperty("name") === false) {
    const response = h.response({
      status: "fail",
      message: "Gagal menambahkan buku. Mohon isi nama buku",
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: "fail",
      message:
        "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount",
    });
    response.code(400);
    return response;
  }
  books.push(newBook);
  const isSuccess = books.filter((book) => book.id === id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: "success",
      message: "Buku berhasil ditambahkan",
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }
  const response = h.response({
    status: "fail",
    message: "Buku gagal ditambahkan",
  });
  response.code(500);
  return response;
};

//get Note

const getBookHandler = (request, h) => {
  const { id = "all" } = request.params;
  const { reading, finished, name } = request.query;

  if (name !== undefined) {
    const readBook = [];
    for (let i = 0; i < books.length; i++) {
      if (books[i]?.name.search(name.toLowerCase()) === 0) {
        readBook.push(books[i]);
      }
    }
    
    if (readBook.length === 0) {
      const response = h.response({
        status: "Fail",
        message: `Buku dengan kata kunci ${name} tidak ditemukan`,
      });
      response.code(200);
      return response;
    } else {
      const response = h.response({
        status: "success",

        data: {
          books: readBook,
        },
      });
      response.code(200);
      return response;
    }
    
  }

  if (parseFloat(reading) === 1) {
    const readBook = [];
    for (let i = 0; i < books.length; i++) {
      if (books[i]?.reading === true) {
        readBook.push(books[i]);
      }
    }

    const response = h.response({
      status: "success",

      data: {
        books: readBook,
      },
    });
    response.code(200);
    return response;
  }
  if (parseFloat(reading) === 0) {
    const readBook = [];
    for (let i = 0; i < books.length; i++) {
      if (books[i]?.reading === false) {
        readBook.push(books[i]);
      }
    }

    const response = h.response({
      status: "success",

      data: {
        books: readBook,
      },
    });
    response.code(200);
    return response;
  }
  if (parseFloat(finished) === 1) {
    const readBook = [];
    for (let i = 0; i < books.length; i++) {
      if (books[i]?.finished === true) {
        readBook.push(books[i]);
      }
    }

    const response = h.response({
      status: "success",

      data: {
        books: readBook,
      },
    });
    response.code(200);
    return response;
  }
  if (parseFloat(finished) === 0) {
    const readBook = [];
    for (let i = 0; i < books.length; i++) {
      if (books[i]?.finished === false) {
        readBook.push(books[i]);
      }
    }

    const response = h.response({
      status: "success",

      data: {
        books: readBook,
      },
    });
    response.code(200);
    return response;
  }

  if (id === "all") {
    const response = h.response({
      status: "success",
      data: {
        books,
      },
    });
    response.code(200);
    return response;
  }

  const index = books.findIndex((book) => book.id === id);
  if (index === -1) {
    const response = h.response({
      status: "failed",
      message: "Buku yang anda cari tidak ditemukan",
    });
    response.code(200);
    return response;
  } else {
    const book = books[index];

    const response = h.response({
      status: "success",
      data: {
        book,
      },
    });
    response.code(200);
    return response;
  }
};

const editBookByIdHandler = (request, h) => {
  const { id } = request.params;
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;
  const updatedAt = new Date().toISOString();
  if (request.payload.hasOwnProperty("name") === false) {
    const response = h.response({
      status: "failed",
      message: "Gagal memperbarui buku. Mohon isi nama buku",
    });

    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: "fail",
      message:
        "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount",
    });
    response.code(400);
    return response;
  }

  const index = books.findIndex((book) => book.id === id);

  if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt,
    };
    const response = h.response({
      status: "success",
      message: "Buku berhasil diperbarui",
    });

    response.code(200);
    return response;
  }
  const response = h.response({
    status: "fail",
    message: "Gagal memperbarui catatan. Id tidak ditemukan",
  });
  response.code(404);
  return response;
};

const deleteBookByIdHandler = (request, h) => {
  const { id } = request.params;

  const index = books.findIndex((book) => book.id === id);

  if (index === -1) {
    const response = h.response({
      status: "Fail",
      message: "Buku gagal dihapus. Id tidak ditemukan",
    });
    response.code(404);
    return response;
  } else {
    books.splice(index, 1);
    const response = h.response({
      status: "success",
      message: "Buku berhasil dihapus",
    });
    response.code(200);
    return response;
  }
};

const getAllBukuStatusReadHandler = (request, h) => {
  const { status } = request.query;
  return status;
};

module.exports = {
  addBookHandler,
  getBookHandler,

  editBookByIdHandler,
  deleteBookByIdHandler,
  getAllBukuStatusReadHandler,
};
