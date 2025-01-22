import { Schema, model } from 'mongoose';

const FileSchema = new Schema({
  filename: { type: String, required: true },
  filepath: { type: String, required: true },
  uploadedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  assignedTo: { type: Schema.Types.ObjectId, ref: 'User', required: false },
  uploadedAt: { type: Date, default: Date.now },
});

export default model('File', FileSchema);

