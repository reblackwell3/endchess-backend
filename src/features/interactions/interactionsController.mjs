// controllers/interactionsController.mjs
import Interactions from './interactionsModel.mjs';

// Create or update interaction
export const createOrUpdateInteraction = async (req, res) => {
  const { username } = req.params;
  const { featureName, featureId, result } = req.body;

  try {
    let interaction = await Interactions.findOne({ username });
    if (!interaction) {
      // Create a new document if the user doesn't exist
      interaction = new Interactions({
        username,
        interactions: new Map([
          [featureName, [{ feature_id: featureId, interactions: [{ result }] }]]
        ])
      });
    } else {
      // Update the existing document
      if (!interaction.interactions.has(featureName)) {
        interaction.interactions.set(featureName, [{ feature_id: featureId, interactions: [{ result }] }]);
      } else {
        const features = interaction.interactions.get(featureName);
        const feature = features.find(f => f.feature_id === featureId);
        if (feature) {
          feature.interactions.push({ result });
        } else {
          features.push({ feature_id: featureId, interactions: [{ result }] });
        }
        interaction.interactions.set(featureName, features);
      }
    }
    await interaction.save();
    res.status(200).json({ message: 'Interaction updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error updating interaction' });
  }
};

// Get all interactions for a user
export const getInteractions = async (req, res) => {
  const { username } = req.params;

  try {
    const interactions = await Interactions.findOne({ username });
    if (!interactions) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(interactions);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching interactions' });
  }
};

// Get specific feature interactions for a user
export const getFeatureIdInteractions = async (req, res) => {
  const { username, featureName, featureId } = req.params;

  try {
    const interactions = await Interactions.findOne({ username });
    if (!interactions || !interactions.interactions.has(featureName)) {
      return res.status(404).json({ error: 'Feature interactions not found' });
    }
    const featureInteractions = interactions.interactions.get(featureName);
    const specificFeature = featureInteractions.find(f => f.feature_id === featureId);
    if (!specificFeature) {
      return res.status(404).json({ error: 'Feature ID interactions not found' });
    }
    res.status(200).json(specificFeature);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching feature interactions' });
  }
};

// Create or update specific feature interaction
export const createOrUpdateFeatureIdInteraction = async (req, res) => {
  const { username, featureName, featureId } = req.params;
  const { result } = req.body;

  try {
    let interaction = await Interactions.findOne({ username });
    if (!interaction) {
      // Create a new document if the user doesn't exist
      interaction = new Interactions({
        username,
        interactions: new Map([
          [featureName, [{ feature_id: featureId, interactions: [{ result }] }]]
        ])
      });
    } else {
      // Update the existing document
      if (!interaction.interactions.has(featureName)) {
        interaction.interactions.set(featureName, [{ feature_id: featureId, interactions: [{ result }] }]);
      } else {
        const features = interaction.interactions.get(featureName);
        const feature = features.find(f => f.feature_id === featureId);
        if (feature) {
          feature.interactions.push({ result });
        } else {
          features.push({ feature_id: featureId, interactions: [{ result }] });
        }
        interaction.interactions.set(featureName, features);
      }
    }
    await interaction.save();
    res.status(200).json({ message: 'Feature interaction updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error updating feature interaction' });
  }
};

// Get all interactions for a user and feature
export const getUserFeatureInteractions = async (req, res) => {
  const { username, featureName } = req.params;

  try {
    const interactions = await Interactions.findOne({ username });
    if (!interactions || !interactions.interactions.has(featureName)) {
      return res.status(404).json({ error: 'Feature interactions not found' });
    }
    const featureInteractions = interactions.interactions.get(featureName);
    res.status(200).json(featureInteractions);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching feature interactions' });
  }
};
