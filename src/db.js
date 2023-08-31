const mysql = require('mysql2/promise');

// koneksi ke database mysql
const db = mysql.createPool({
    host: process.env.MYSQL_HOST || 'localhost',
    user: process.env.MYSQL_USER || 'root',
    database: process.env.MYSQL_DBNAME || 'contact-manager',
    password: process.env.MYSQL_PASSWORD || '123123',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

// migrasi database mysql
const migration = async () => {
    try {
        // query mysql untuk membuat table contacts
        await db.query(
            `
            CREATE TABLE IF NOT EXISTS contacts (
            id int not null auto_increment,
            full_name varchar(255) not null,
            phone_number varchar(255) not null,
            email varchar(255) not null,
            primary key (id)
            )
        `
        );
        console.log('Running Migration Successfully!');
    } catch (err) {
        throw err;
    }
};

// TODO: Lengkapi fungsi dibawah ini untuk mengambil data didalam database
const find = async () => {
    const query = 'SELECT id, full_name, phone_number, email FROM contacts';
    const connection = await db.getConnection();
    const [results] = await connection.query(query);
    connection.release();
    const formattedResults = results.map((result) => ({
        id: result.id,
        full_name: result.full_name,
        phone_number: result.phone_number,
        email: result.email,
    }));

    return formattedResults;
};

// TODO: Lengkapi fungsi dibawah ini untuk mengambil satu data didalam database
const findOne = async (id) => {
    const query =
        'SELECT id, full_name, phone_number, email FROM contacts WHERE id = ?';
    const connection = await db.getConnection();
    const result = await connection.query(query, id);

    connection.release();

    return result[0].length > 0;
};

// TODO: Lengkapi fungsi dibawah ini untuk menyimpan data kedalam database
const create = async (data) => {
    const query =
        'INSERT INTO contacts (full_name, phone_number, email) VALUES (?, ?, ?)';
    const connection = await db.getConnection();
    const { full_name, phone_number, email } = {
        full_name: data.full_name,
        phone_number: data.phone_number,
        email: data.email,
    };
    const results = await connection.query(query, [
        full_name,
        phone_number,
        email,
    ]);

    connection.release();

    return {
        id: results[0].insertId,
        full_name: data.full_name,
        phone_number: data.phone_number,
        email: data.email,
    };
};

// TODO: Lengkapi fungsi dibawah ini untuk mengedit data didalam database
const update = async (id, data) => {
    const query = 'UPDATE contacts SET email = ? WHERE id = ? ';
    const connection = await db.getConnection();

    await connection.query(query, [data.email, id]);
    connection.release();

    return {
        id: parseInt(id),
        email: data.email,
    };
};

// TODO: Lengkapi fungsi dibawah ini untuk menghapus data didalam database
const destroy = async (id) => {
    const query = 'DELETE FROM contacts WHERE contacts.id = ?';
    const connection = await db.getConnection();

    await connection.query(query, id);
    connection.release();

    return parseInt(id);
};

// chack
const checkData = async (data) => {
    const query =
        'SELECT full_name, phone_number, email FROM contacts WHERE full_name = ? OR phone_number = ? OR email = ?';
    const connection = await db.getConnection();
    const { full_name, phone_number, email } = {
        full_name: data.full_name,
        phone_number: data.phone_number,
        email: data.email,
    };
    const results = await connection.query(query, [
        full_name,
        phone_number,
        email,
    ]);

    connection.release();

    let result = {
        full_name: '',
        phone_number: '',
        email: '',
    };

    if (results[0].length != 0) {
        result = {
            full_name: results[0][0].full_name,
            phone_number: results[0][0].phone_number,
            email: results[0][0].email,
        };
    }

    return result;
};

module.exports = {
    migration,
    find,
    create,
    update,
    destroy,
    findOne,
    checkData,
};
