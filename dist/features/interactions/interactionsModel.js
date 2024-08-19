"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// models/interactions.mjs
const mongoose_1 = __importDefault(require("mongoose"));
const { Schema } = mongoose_1.default;
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
const Interactions = mongoose_1.default.model('Interactions', interactionsSchema);
exports.default = Interactions;
