import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

// Load env vars FIRST, before any other imports that might depend on them
try {
    const envPath = path.resolve(__dirname, '../.env');
    if (fs.existsSync(envPath)) {
        console.log('Loading .env from', envPath);
        const envConfig = fs.readFileSync(envPath, 'utf8');
        envConfig.split('\n').forEach(line => {
            const parts = line.split('=');
            if (parts.length >= 2) {
                const key = parts[0].trim();
                // Join the rest back together in case value contains '='
                const value = parts.slice(1).join('=').trim().replace(/^["']|["']$/g, '');

                if (key && value && !process.env[key]) {
                    process.env[key] = value;
                }
            }
        });
    } else {
        console.warn('.env file not found at', envPath);
    }
} catch (e) {
    console.warn('Could not load .env file', e);
}

async function main() {
    if (!process.env.MONGODB_URI) {
        console.error('MONGODB_URI is not defined in process.env');
        process.exit(1);
    }

    // Dynamic imports to ensure env vars are loaded first
    const { default: dbConnect } = await import('../src/lib/db');
    const { default: Admin } = await import('../src/models/Admin');

    await dbConnect();
    console.log('Connected to Database');

    const email = 'ahmadaatif6@gmail.com';
    const password = 'aatif@opg123';
    const name = 'Ahmad Aatif';

    try {
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            console.log('Admin already exists');
            process.exit(0);
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const newAdmin = await Admin.create({
            name,
            email,
            passwordHash,
        });

        console.log('Admin user created successfully:', newAdmin.email);
    } catch (error) {
        console.error('Error creating admin:', error);
        process.exit(1);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
}

main();
