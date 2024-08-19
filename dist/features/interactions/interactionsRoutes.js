"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// routes/interactionsRoutes.mjs
const express_1 = __importDefault(require("express"));
const interactionsController_mjs_1 = require("./interactionsController.mjs");
const router = express_1.default.Router();
// General interactions routes
router.post('/interactions/:username', interactionsController_mjs_1.createOrUpdateInteraction);
router.get('/interactions/:username', interactionsController_mjs_1.getInteractions);
// Feature-specific interactions routes
router.get('/interactions/:username/:featureName/:featureId', interactionsController_mjs_1.getFeatureIdInteractions);
router.post('/interactions/:username/:featureName/:featureId', interactionsController_mjs_1.createOrUpdateFeatureIdInteraction);
// Shortened feature-specific interactions route
router.get('/int/:username/:featureName', interactionsController_mjs_1.getUserFeatureInteractions);
exports.default = router;
