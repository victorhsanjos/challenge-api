const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const createError = require('http-errors');
const NodeGeocoder = require('node-geocoder');

const geocoder = NodeGeocoder({
    provider: process.env.GEOCODER_PROVIDER,
    apiKey: process.env.GEOCODER_API_KEY
});

const phoneSchema = new Schema({
    ddd: {
        type: String,
        required: true
    },
    number: {
        type: String,
        required: true,
    }
}, { _id: false, autoIndex: false });

const geolocationSchema = new Schema({
    type: {
        type: String,
        enum: ['Point'],
        required: true
    },
    coordinates: {
        type: [Number],
        required: true
    }
}, { _id: false, autoIndex: false });

const userSchema = new Schema({
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
        required: true
    },
    phones: {
        type: [phoneSchema],
        default: undefined
    },
    zipcode: {
        type: String,
        required: true
    },
    geolocation: {
        type: geolocationSchema,
    },
    token: {
        type: String,
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
}, { versionKey: false });

userSchema.pre('save', async function (next) {
    const user = this;

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }

    return next();
});

userSchema.methods.generateAuthToken = async function () {
    const user = this;

    const token = jwt.sign({ _id: user._id }, process.env.JWT_KEY);

    user.token = token;

    await user.save()

    return token
}

userSchema.methods.findGeolocation = async function () {
    const user = this;

    const results = await geocoder.geocode(user.zipcode);

    if (results.length) {
        const { latitude, longitude } = results[0];
        const geolocation = {
            type: 'Point',
            coordinates: [latitude, longitude]
        };

        user.geolocation = geolocation;

        user.save();
    }
}

userSchema.statics.findByEmail = async (email) => {
    return await User.findOne({ email });
}

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email });

    if (!user) {
        throw new createError(400, 'Invalid login credentials');
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
        throw new createError(401, 'Invalid login credentials');
    }

    return user;
}

const User = mongoose.model('User', userSchema)

module.exports = User;