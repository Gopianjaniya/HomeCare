const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
            required: true
        },
        fullName: {
            type: String,
        },
        email: {
            type: String,
        },
        gender: {
            type: String,
            enum: ["male", "female", "others"]
        },
        dob: {
            type: String
        },
        profileLink: {
            type: String
        },
        address: [{
            line1: { type: String },
            line2: { type: String },
            city: { type: String },
            state: { type: String },
            pincode: { type: String }
        }],
    },
    {
        timestamps: true,
    }
);

const CustomerModel = mongoose.model("customer", customerSchema);

module.exports = CustomerModel;


/*

data : {
    email:"",
    

}



*/ 