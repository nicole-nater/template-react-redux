/* eslint-disable no-undef, arrow-body-style */
const Item = require('../models/item-model');

getItems = async (req, res) => {
    await Item.find({}, (err, items) => {
        if (err) {
            console.error(`[Hack.Diversity React Template] - 400 in 'getItems': ${err}`);
            return res
                .status(400)
                .json({
                    success: false,
                    error: err,
                });
        }
        if (!items.length) {
            console.error(`[Hack.Diversity React Template] - 404 in 'getItems': Items not found`);
            return res
                .status(404)
                .json({
                    success: false,
                    error: 'Items not found',
                });
        }
        console.log(`[Hack.Diversity React Template] - 200 in 'getItems': Items fetched!`);
        return res
            .status(200)
            .json({
                success: true,
                items: items,
            });
    }).catch(err => {
        console.error(err);
        return err;
    });
};

getItemById = async (req, res) => {
    await Item.find({ _id: req.params.id }, (err, items) => {
        if (err) {
            console.error(`[Hack.Diversity React Template] - 400 in 'getItemById': ${err}`);
            return res
                .status(400)
                .json({
                    success: false,
                    error: err,
                });
        }
        if (!items.length) {
            console.error(`[Hack.Diversity React Template] - 404 in 'getItemById': Item not found`);
            throw res
                .status(404)
                .json({
                    success: false,
                    error: 'Item not found',
                });
        }
        console.log(`[Hack.Diversity React Template] - 200 in 'getItemById': Item fetched!`);
        return res
            .status(200)
            .json({
                success: true,
                item: items[0],
            });
    }).catch(err => {
        console.error(err);
        return err;
    });
};

createItem = (req, res) => {
    const body = req.body;
    // console.log('----------------------- createItem: req -----------------------')
    // console.log(req);
    // console.log('----------------------- createItem: body -----------------------')
    // console.log(body);

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide an item.',
        });
    }

    const item = new Item(body);

    if (!item) {
        console.error(`[Hack.Diversity React Template] - 400 in 'createItem': 'item' is malformed.`);
        return res.status(400).json({
            success: false,
            error: err,
        });
    }

    // console.log('----------------------- createItem: item -----------------------')
    // console.log(item);

    item
        .save()
        .then(() => {
            console.error(`[Hack.Diversity React Template] - 201 in 'createItem': Item created!`);
            return res.status(201).json({
                success: true,
                id: item._id,
                message: 'Item created!',
            });
        })
        .catch(err => {
            console.error(`[Hack.Diversity React Template] - 400 in 'createItem': Item not created.....`);
            console.error(err);
            return res.status(400).json({
                err,
                message: 'Item not created!',
            });
        });
};

updateItem = async (req, res) => {
    const body = req.body;
    // console.log('----------------------- updateItem: req -----------------------');
    // console.log(req);
    // console.log('----------------------- updateItem: body -----------------------');
    // console.log(body);
    if (!body) {
        console.error(`[Hack.Diversity React Template] - 400 in 'updateItem': You must provide an item to update.`);
        return res.status(400).json({
            success: false,
            error: 'You must provide an item to update.',
        });
    }

    const itemForUpdate = {
        _id: req.params.id,
        name: body.name,
        daysOfWeek: body.daysOfWeek,
        timeframeNote: body.timeframeNote,
        priority: body.priority,
        content: body.content,
    };

    // console.log('----------------------- updateItem: res -----------------------');
    // console.log(res);

    await Item.updateOne({ _id: req.params.id }, itemForUpdate, (err, writeOpRes) => {
        if (err) {
            console.error(`[Hack.Diversity React Template] - 404 in 'updateItem': Item not found!`);
            return res.status(404).json({
                err,
                message: 'Item not found!',
            });
        }
        // TODO: make this neater
        // console.log('----------------------- updateItem: item -----------------------');
        // console.log(item);
        return writeOpRes;
    })
    .then(writeMsg => {
        console.log('----------------------- updateItem - findOne: res -----------------------');
        console.log(res);
        return res.status(200)
            .json({
                success: true,
                id: req.params.id,
                message: 'Item updated!',
                writeOpResult: writeMsg
            });
    }).catch(err => {
        console.error(`[Hack.Diversity React Template] - 404 in 'updateItem': ${err}`);
        console.error(err);
        return err;
    });
};

deleteItem = async (req, res) => {
    await Item.findOneAndDelete({ _id: req.params.id }, (err, item) => {
        if (err) {
            return res
                .status(400)
                .json({
                    succes: false,
                    error: err,
                });
        }

        if (!item) {
            return res
                .status(400)
                .json({
                    success: false,
                    error: 'Item not found!',
                });
        }

        return res
            .status(200)
            .json({
                success: true,
                data: item,
            });
    }).catch(err => {
        console.error(err);
        return err;
    });
};

module.exports = {
    getItems,
    getItemById,
    createItem,
    updateItem,
    deleteItem,
};
