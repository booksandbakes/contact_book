
const register_user = `INSERT INTO registered_user (name,email,password)
VALUES (:name, :email, :hash)`;

const contact_reg = `INSERT INTO contacts (user_id,name,email,phone_no)
VALUES (:user_id, :name, :email, :phone_no)`;

module.exports ={

    register: register_user,
    contact: contact_reg
};


