require('dotenv').config();
const request = require('supertest');
const express = require('express');
const app = require('./app');
const fs = require('fs');
const Book = require('./book');
const pool = require('./utils/pool');

app.use(express.json());

describe('app tests', () => {
    beforeEach(() => {
        return pool.query(fs.readFileSync('setup.sql', 'utf-8'));
    });

    afterAll(() => {
        return pool.end();
    });

    it('GETs all books in books table', async () => {
        const newBook = await Book.insert({ title: 'What is Man?', genre: 'fiction', author: 'Mark Twain', good: true });

        const response = await request(app)
            .get('/books');

        expect(response.body).toEqual([newBook]);
    });

    it('GETs a single book by id', async () => {
        const newBook = await Book.insert({ title: 'What is Man?', genre: 'fiction', author: 'Mark Twain', good: true });

        const response = await request(app)
            .get('/books/1');

        expect(response.body).toEqual(newBook);
    });

    it('Creates a new book via POST', async () => {
        const response = await request(app)
            .post('/books')
            .send({
                title: "What is Man?",
                genre: "fiction",
                author: "Mark Twain",
                good: true
            });

        expect(response.body).toEqual({
            id: "1",
            title: "What is Man?",
            genre: "fiction",
            author: "Mark Twain",
            good: true
        });
    });

    it('Updates a book by id via PUT', async () => {
        const newBook = await Book.insert({ title: 'What is Man?', genre: 'fiction', author: 'Mark Twain', good: true });

        const response = await request(app)
            .put(`/books/${newBook.id}`)
            .send({
                title: 'The Adventures of Tom Sawyer',
                genre: 'fiction',
                author: 'Mark Twain',
                good: true
            });

        expect(response.body).toEqual({
            ...newBook,
            title: 'The Adventures of Tom Sawyer'
        });
    });

    it('Deletes a book by id via DELETE', async () => {
        const newBook = await Book.insert({ title: 'What is Man?', genre: 'fiction', author: 'Mark Twain', good: true });

        const response = await request(app)
            .delete(`/books/${newBook.id}`);

        expect(response.body).toEqual({});
    });
});
