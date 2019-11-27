const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PhoneSchema = new Schema({
    ddd: {
        type: String,
        required: true
    },
    number: {
        type: String,
        required: true,
    }
});

const GeolocationSchema = new Schema({
    type: {
        type: String,
        enum: ['Point'],
        required: true
    },
    coordinates: {
        type: [Number],
        required: true
    }
});

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    phones: {
        type: [PhoneSchema],
        default: undefined
    },
    cep: {
        type: String,
        required: true,
    },
    geolocation:{
        type: GeolocationSchema,
        required: true
    },
    token: {
        type: String,
        required: true,
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    },
    last_login_at: {
        type: Date,
        default: Date.now
    }
});

mongoose.model('User', UserSchema);