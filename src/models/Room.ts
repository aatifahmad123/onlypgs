import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IRoom extends Document {
    pgId: mongoose.Types.ObjectId;
    roomType: 'single' | 'double_sharing' | 'triple_sharing' | 'four_sharing';
    price: number;
}

const RoomSchema = new Schema<IRoom>({
    pgId: { type: Schema.Types.ObjectId, ref: 'PG', required: true },
    roomType: {
        type: String,
        enum: ['single', 'double_sharing', 'triple_sharing', 'four_sharing'],
        required: true,
    },
    price: { type: Number, required: true },
});

// Indexes
// rooms : { pgId: 1 }
RoomSchema.index({ pgId: 1 });
// rooms : { roomType: 1, price: 1 }
RoomSchema.index({ roomType: 1, price: 1 });

export default (mongoose.models.Room as Model<IRoom>) || mongoose.model<IRoom>('Room', RoomSchema);
