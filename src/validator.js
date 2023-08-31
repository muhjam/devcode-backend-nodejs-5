// TODO: Lengkapi fungsi dibawah ini untuk memvalidasi terdapat data seperti full_name, email, dan phone_number
const validateData = (data) => {
    return !data.full_name || !data.email || !data.phone_number;
};

const validateUpdate = (data) => {
    return !data.email;
};

// TODO: Lengkapi fungsi dibawah ini untuk memvalidasi tidak terdapat data yang sama pada database
const isDataDuplicated = (data, checkData) => {
    return (
        data.full_name == checkData.full_name ||
        data.phone_number == checkData.phone_number ||
        data.email == checkData.email
    );
};

module.exports = { validateData, isDataDuplicated, validateUpdate };
