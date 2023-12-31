require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const app = express();
const db = require('./db');
const {
    validateData,
    isDataDuplicated,
    validateUpdate,
} = require('./validator');

const port = process.env.PORT || 3030;
const host = process.env.HOST || 'localhost';

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// routes
app.get('/hello', (req, res) => {
    res.json({ message: 'Hello world' });
});

// get all contacts
app.get('/contacts', async (req, res) => {
    // TODO: ambil semua data kontak dari database
    const data = await db.find();

    res.json({ status: 'Success', data: data });
});

// create contact
app.post('/contacts', async (req, res) => {
    const body = req.body;

    // TODO: validasi body request
    const validateBody = validateData(body);
    if (validateBody) {
        return res.status(400).json({
            status: 'Failed',
            message: 'full_name, phone_number, and email is required',
        });
    }

    // TODO: validasi data agar tidak terjadi duplikasi pada data
    const checkData = await db.checkData(body);
    const isDuplicated = isDataDuplicated(body, checkData);
    if (isDuplicated) {
        return res.status(400).json({
            status: 'Failed',
            message: 'full_name, phone_number, and email is duplicate',
        });
    }

    // TODO: simpan data dari request body kedalam database
    const data = await db.create(body);

    res.json({
        status: 'Success',
        message: 'Contact created',
        data: data,
    });
});

// update contact
app.put('/contacts/:id', async (req, res) => {
    const { id } = req.params;
    const body = req.body;

    // TODO: validasi id kontak
    const isExist = await db.findOne(id);
    if (!isExist) {
        return res.status(400).json({
            status: 'Failed',
            message: `Contact with id ${id} is not found`,
        });
    }

    // TODO: validasi body request
    const validateBody = validateUpdate(body);
    if (validateBody) {
        return res.status(400).json({
            status: 'Failed',
            message: 'no contact updated',
        });
    }

    // TODO: edit data (full_name/email/phone_number) pada database berdasarkan id nya
    const data = await db.update(id, body);

    res.json({
        status: 'Success',
        message: 'Contact updated',
        data: data,
    });
});

// delete contact
app.delete('/contacts/:id', async (req, res) => {
    const { id } = req.params;

    // TODO: validasi id kontak
    const isExist = await db.findOne(id);
    if (!isExist) {
        return res.status(400).json({
            status: 'Failed',
            message: `Contact with id ${id} is not found`,
        });
    }

    // TODO: hapus data pada database berdasarkan id nya
    const deletedId = await db.destroy(id);

    res.json({
        status: 'Success',
        message: 'Contact deleted',
        deletedId: deletedId,
    });
});

// 404 endpoint middleware
app.all('*', (req, res) => {
    res.status(404).json({ message: `${req.originalUrl} not found!` });
});

// error handler
app.use((err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    return res.status(err.statusCode).json({
        status: err.status,
        message: err.message || 'An error occurred.',
    });
});

const run = async () => {
    await db.migration(); // 👈 running migration before server
    app.listen(port); // running server
    console.log(`Server run on http://${host}:${port}/`);
};

run();
