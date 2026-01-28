import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPG extends Document {
    submittedBy: 'owner' | 'manager' | 'tenant';
    pgName: string;
    city: string;
    area: string;
    landmark?: string;
    genderType: 'boys' | 'girls' | 'unisex';
    securityDeposit?: number;
    facilities: {
        food: boolean;
        wifi: boolean;
        washingMachine: boolean;
        roomCleaning: boolean;
        powerBackup: boolean;
        ac: boolean;
        attachedWashroom: boolean;
    };
    rules: {
        nightEntryTime?: string;
        visitorPolicy: 'allowed' | 'not_allowed';
        smokingDrinking: 'allowed' | 'not_allowed';
    };
    photos: string[];
    contact: {
        phone: string;
        whatsapp?: string;
    };
    status: 'pending' | 'approved' | 'rejected';
    createdAt: Date;
    updatedAt: Date;
}

const PGSchema = new Schema<IPG>(
    {
        submittedBy: { type: String, enum: ['owner', 'manager', 'tenant'], required: true, default: 'owner' },
        pgName: { type: String, required: true },
        city: { type: String, required: true },
        area: { type: String, required: true },
        landmark: { type: String },
        genderType: { type: String, enum: ['boys', 'girls', 'unisex'], required: true },
        securityDeposit: { type: Number, default: 0 },
        facilities: {
            food: { type: Boolean, default: false },
            wifi: { type: Boolean, default: false },
            washingMachine: { type: Boolean, default: false },
            roomCleaning: { type: Boolean, default: false },
            powerBackup: { type: Boolean, default: false },
            ac: { type: Boolean, default: false },
            attachedWashroom: { type: Boolean, default: false },
        },
        rules: {
            nightEntryTime: { type: String },
            visitorPolicy: { type: String, enum: ['allowed', 'not_allowed'], default: 'not_allowed' },
            smokingDrinking: { type: String, enum: ['allowed', 'not_allowed'], default: 'not_allowed' },
        },
        photos: [{ type: String }],
        contact: {
            phone: { type: String, required: true },
            whatsapp: { type: String, required: false },
        },
        status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    },
    { timestamps: true }
);

// Indexes
// pgs : { city: 1, status: 1 }
PGSchema.index({ city: 1, status: 1 });
// pgs : text index on pgName
PGSchema.index({ pgName: 'text' });

export default (mongoose.models.PG as Model<IPG>) || mongoose.model<IPG>('PG', PGSchema);
