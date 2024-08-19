"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserFeatureInteractions = exports.createOrUpdateFeatureIdInteraction = exports.getFeatureIdInteractions = exports.getInteractions = exports.createOrUpdateInteraction = void 0;
// controllers/interactionsController.mjs
const interactionsModel_mjs_1 = __importDefault(require("./interactionsModel.mjs"));
// Create or update interaction
const createOrUpdateInteraction = async (req, res) => {
    const { username } = req.params;
    const { featureName, featureId, result } = req.body;
    try {
        let interaction = await interactionsModel_mjs_1.default.findOne({ username });
        if (!interaction) {
            // Create a new document if the user doesn't exist
            interaction = new interactionsModel_mjs_1.default({
                username,
                interactions: new Map([
                    [featureName, [{ feature_id: featureId, interactions: [{ result }] }]]
                ])
            });
        }
        else {
            // Update the existing document
            if (!interaction.interactions.has(featureName)) {
                interaction.interactions.set(featureName, [{ feature_id: featureId, interactions: [{ result }] }]);
            }
            else {
                const features = interaction.interactions.get(featureName);
                const feature = features.find(f => f.feature_id === featureId);
                if (feature) {
                    feature.interactions.push({ result });
                }
                else {
                    features.push({ feature_id: featureId, interactions: [{ result }] });
                }
                interaction.interactions.set(featureName, features);
            }
        }
        await interaction.save();
        res.status(200).json({ message: 'Interaction updated successfully' });
    }
    catch (error) {
        res.status(500).json({ error: 'Error updating interaction' });
    }
};
exports.createOrUpdateInteraction = createOrUpdateInteraction;
// Get all interactions for a user
const getInteractions = async (req, res) => {
    const { username } = req.params;
    try {
        const interactions = await interactionsModel_mjs_1.default.findOne({ username });
        if (!interactions) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(interactions);
    }
    catch (error) {
        res.status(500).json({ error: 'Error fetching interactions' });
    }
};
exports.getInteractions = getInteractions;
// Get specific feature interactions for a user
const getFeatureIdInteractions = async (req, res) => {
    const { username, featureName, featureId } = req.params;
    try {
        const interactions = await interactionsModel_mjs_1.default.findOne({ username });
        if (!interactions || !interactions.interactions.has(featureName)) {
            return res.status(404).json({ error: 'Feature interactions not found' });
        }
        const featureInteractions = interactions.interactions.get(featureName);
        const specificFeature = featureInteractions.find(f => f.feature_id === featureId);
        if (!specificFeature) {
            return res.status(404).json({ error: 'Feature ID interactions not found' });
        }
        res.status(200).json(specificFeature);
    }
    catch (error) {
        res.status(500).json({ error: 'Error fetching feature interactions' });
    }
};
exports.getFeatureIdInteractions = getFeatureIdInteractions;
// Create or update specific feature interaction
const createOrUpdateFeatureIdInteraction = async (req, res) => {
    const { username, featureName, featureId } = req.params;
    const { result } = req.body;
    try {
        let interaction = await interactionsModel_mjs_1.default.findOne({ username });
        if (!interaction) {
            // Create a new document if the user doesn't exist
            interaction = new interactionsModel_mjs_1.default({
                username,
                interactions: new Map([
                    [featureName, [{ feature_id: featureId, interactions: [{ result }] }]]
                ])
            });
        }
        else {
            // Update the existing document
            if (!interaction.interactions.has(featureName)) {
                interaction.interactions.set(featureName, [{ feature_id: featureId, interactions: [{ result }] }]);
            }
            else {
                const features = interaction.interactions.get(featureName);
                const feature = features.find(f => f.feature_id === featureId);
                if (feature) {
                    feature.interactions.push({ result });
                }
                else {
                    features.push({ feature_id: featureId, interactions: [{ result }] });
                }
                interaction.interactions.set(featureName, features);
            }
        }
        await interaction.save();
        res.status(200).json({ message: 'Feature interaction updated successfully' });
    }
    catch (error) {
        res.status(500).json({ error: 'Error updating feature interaction' });
    }
};
exports.createOrUpdateFeatureIdInteraction = createOrUpdateFeatureIdInteraction;
// Get all interactions for a user and feature
const getUserFeatureInteractions = async (req, res) => {
    const { username, featureName } = req.params;
    try {
        const interactions = await interactionsModel_mjs_1.default.findOne({ username });
        if (!interactions || !interactions.interactions.has(featureName)) {
            return res.status(404).json({ error: 'Feature interactions not found' });
        }
        const featureInteractions = interactions.interactions.get(featureName);
        res.status(200).json(featureInteractions);
    }
    catch (error) {
        res.status(500).json({ error: 'Error fetching feature interactions' });
    }
};
exports.getUserFeatureInteractions = getUserFeatureInteractions;
