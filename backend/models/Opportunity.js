import mongoose from 'mongoose';

const opportunitySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true }, 
  organization: { type: String, required: true },
  activityType: { type: String, required: true }, 
  date: { type: Date, required: true },
  urgency: { type: String, enum: ['Normal', 'High', 'Critical'], default: 'Normal' },
  status: { type: String, enum: ['Open', 'Filled', 'Closed'], default: 'Open' }, 
  passcode: { type: String, required: true },
  imageUrl: { type: String }, 
  skillsRequired: [{ type: String }],
  
  // Embedded Document 1: Capacity
  capacity: {
    isFlexibleHours: { type: Boolean, default: false },
    requiredHours: { type: Number },
    isUnlimitedVolunteers: { type: Boolean, default: false },
    volunteersNeeded: { type: Number },
    volunteersSignedUp: { type: Number, default: 0 }
  },
  
  // Embedded Document 2: Location
  location: {
    city: { type: String, required: true },
    pinCode: { type: String, required: true }
  },
  
  // Embedded Document 3: Contact
  contactPerson: {
    name: { type: String, required: true },
    email: { type: String, required: true }
  }
}, { timestamps: true });

export default mongoose.model('Opportunity', opportunitySchema);