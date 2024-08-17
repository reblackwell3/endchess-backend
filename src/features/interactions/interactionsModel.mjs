// models/interactions.mjs
import mongoose from 'mongoose';

const { Schema } = mongoose;

// Define the schema for an interaction
const interactionSchema = new Schema({
  result: {
    type: String,
    enum: ['success', 'fail', 'other'],
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

// Define the schema for a feature's interactions
const featureSchema = new Schema({
  feature_id: {
    type: String,
    required: true
  },
  interactions: [interactionSchema]
});

// Define the schema for player interactions
const interactionsSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  interactions: {
    type: Map,
    of: [featureSchema],
    required: true
  }
});

// Create the model
const Interactions = mongoose.model('Interactions', interactionsSchema);

export default Interactions;
