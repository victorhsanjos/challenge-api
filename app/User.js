const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const validator = require('validator')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

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
        unique: true,
        validate: value => {
            if (!validator.isEmail(value)) {
                throw new Error({ error: 'Invalid Email address' });
            }
        }
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
        validate: value => {
            if (!validator.isPostalCode(value, 'BR')) {
                throw new Error({ error: 'Invalid Post code' });
            }
        }
    },
    geolocation: {
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

UserSchema.pre('save', async function (next) {
    const user = this;

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }

    return next();
});

UserSchema.methods.generateAuthToken = async function () {
    const user = this;
    const token = jwt.sign({ _id: user._id }, process.env.JWT_KEY);

    user.token = token;

    await user.save()

    return token
}

UserSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email });

    if (!user) {
        throw new Error({ error: 'Invalid login credentials' });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
        throw new Error({ error: 'Invalid login credentials' });
    }

    return user;
}

mongoose.model('User', UserSchema);