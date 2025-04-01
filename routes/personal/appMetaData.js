import express from "express";
const router = express.Router();
import AppMetaData from '../../models/app.js';

// Handler to get the average OpenAI time
const getAverageOpenaiTime = async (req, res) => {
    try {
        const app = await AppMetaData.findOne({});
        res.status(200).json({ timePerCard: app ? app.timePerCard : null });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Handler to update the average OpenAI time
const updateAverageOpenaiTime = async (req, res) => {
    try {
        const { timePerCard } = req.body;
        let app = await AppMetaData.findOne({});
        if (!app) {
            app = new AppMetaData({
                timePerCard: []
            });
        }
        
        if (timePerCard) {
            app.timePerCard.push(timePerCard);
        }
        
        await app.save();
        res.status(200).json({ timePerCard: app.timePerCard });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

router.route('/').get(getAverageOpenaiTime).patch(updateAverageOpenaiTime);

export  default router;
