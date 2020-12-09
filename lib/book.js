const pool = require('./utils/pool');

module.exports = class Book {
    id;
    title;
    genre;
    author;
    good;

    constructor(row) {
        this.id = row.id;
        this.title = row.title;
        this.genre = row.genre;
        this.author = row.author;
        this.good = row.good;
    }

    static async find() {
        const { rows } = await pool.query('SELECT * FROM books');
        return rows.map(row => new Book(row));
    }

    static async findById(id) {
        const { rows } = await pool.query('SELECT * FROM books WHERE id=$1',
            [id]
        );

        if (!rows[0]) throw new Error(`Sorry hommie, no books with that id ${id}`);
        return new Book(rows[0]);
    }

    static async insert({ title, genre, author, good }) {
        const { rows } = await pool.query('INSERT INTO books (title, genre, author, good) VALUES ($1, $2, $3, $4) RETURNING *',
            [title, genre, author, good]
        );
        return new Book(rows[0]);
    }

    static async update(id, { title, genre, author, good }) {
        const { rows } = await pool.query(
            `UPDATE books
            SET title=$1,
                genre=$2,
                author=$3,
                good=$4
            WHERE id=$5
            RETURNING *`,
            [title, genre, author, good, id]
        );
        return new Book(rows[0]);
    }

    static async delete(id) {
        const { rows } = await pool.query(
            `DELETE from books
            WHERE id=$1
            RETURNING *`,
            [id]
        );
    }
};
