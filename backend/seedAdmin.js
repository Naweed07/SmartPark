import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User.js';

dotenv.config();

const createOrFixAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected...');

        let adminUser = await User.findOne({ email: 'admin@smartpark.com' });

        if (adminUser) {
            // The User model has a pre('save') hook that automatically hashes plaintext passwords.
            // Our previous script hashed it early, resulting in a double-hash. We fix it by saving plaintext.
            adminUser.password = 'Admin@123';
            await adminUser.save();
            console.log('Super Admin password fixed and successfully reset!');
        } else {
            const newAdmin = new User({
                name: 'Super Admin',
                email: 'admin@smartpark.com',
                password: 'Admin@123',
                role: 'ADMIN'
            });
            await newAdmin.save();
            console.log('Super Admin user created successfully!');
        }

        console.log('Email: admin@smartpark.com');
        console.log('Password: Admin@123');

        process.exit(0);
    } catch (error) {
        console.error('Error creating or fixing admin:', error);
        process.exit(1);
    }
};

createOrFixAdmin();
