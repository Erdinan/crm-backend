const Organisation = require("../models/organisation");

module.exports = {
    createOne: async (req, res) => {
        try {
            let organisation = new Organisation(req.body)
            await organisation.save(function(err) {
                if (err) return res.status(500).json(err)
                res.json(organisation)
            })
        }
        catch(err){
            res.status(400);
            return res.send("Database query failed");
        }
    },
    deleteOne: async (req, res) => {
        try {
            await Organisation.findOneAndRemove({ orgName: req.params.name, userId : req.session.userId }, function (err) {
                if (err) return res.status(400).json(err);
                res.status(204).json({});
            });
        }
        catch(err){
            res.status(400);
            return res.send("Database query failed");
        }
    },
    getOne: async (req, res) => {
        try {
            await Organisation.find({ _id: req.params.id})
            .exec(function (err, org) {
                if (err) return res.status(404).json(err);
                res.json(org);
            });
        }
        catch(err){
            res.status(400);
            return res.send("Database query failed");
        }
    },
    getAll: async (req, res) => {
        try {
            await Organisation.find({userId : req.session.userId})
            .exec(function (err, org) {
                if (err) return res.status(404).json(err);
                res.json(org);
            })
        }
        catch(err){
            res.status(400);
            return res.send("Database query failed");
        }
    }
}