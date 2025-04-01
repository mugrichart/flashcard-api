import express from "express";
const router = express.Router();

import AppMetaData from '../../models/app.js'

import {
    addWordToDeck,
    addToWishList,
    wordProcessing
} from "../../controllers/personal/words.js"

const batchRequest = async (req, res) => {
    const successRequests = {};
    try {
        const totalRequest = [...req.body.requests];
        const deckAcquiredIds = {}
        for (const { route, body } of totalRequest) {
            if (route === 'toAdd') {
                const results = await Promise.all(body.map(async wordBody => await addWordToDeck(wordBody)));
                let success = true;
                for (const result of results) {
                    if (result.msg === 'error') success = false
                    else deckAcquiredIds[result.deck.name] = result.deck.id;
                }
                successRequests.toAdd = success 
            }
            
            if (route === 'toWish') {
                let app = await AppMetaData.findOne({});
                if (!app) {
                    app = new AppMetaData({});
                }
                const results = await Promise.all(body.map(async wordBody => await addToWishList({...wordBody, deckId: (wordBody.deckName && !wordBody.deckId && deckAcquiredIds[wordBody.deckName]) ?  deckAcquiredIds[wordBody.deckName]: wordBody.deckId}, app)));
                successRequests.toWish = !results.some(res => res.msg === 'error');  // true if none is error
                const appLangsToProcess = Array.from(app.new_words_to_add.entries())
                                            .filter(([language, setsToProcess]) => 
                                                setsToProcess.reduce((length, curr) => length + (curr?.words?.length || 0), 0) >= app?.max_wishes
                                         );
                for (const [language, setsToProcess] of appLangsToProcess) {
                    //const appCopy = JSON.parse(JSON.stringify(app));
                    const langApp = {language, new_words_to_add: setsToProcess}
                    // Remove this specific language key from the original app
                    
                    //console.log('......................processing starting');
                    wordProcessing(langApp)
                        .then(d => {
                            //console.log(d.msg, '...................processing done');
                            app.new_words_to_add.delete(language);
                            app.save();
                        })
                        .catch(err => console.error(`\n-----Processing error for ${language}: `, err));

                }
                //await app.save();  // Ensure app is saved after toWish logic
            }
        }

        //console.log(successRequests)
        // Send response after sequential execution
        res.json({ successRequests });

    } catch (error) {
        //console.log(error);
        res.json({ successRequests });
    }
};


router.route('/').post(batchRequest)

export  default router
