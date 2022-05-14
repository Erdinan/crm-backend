const Department = require("../models/department");

module.exports = {
    createOne: async (req, res) => {
        try {
            let department = new Department(req.body)
            department.save(function(err) {
                if (err) return res.status(500).json(err)
                res.json(department)
            })
        }
        catch(err){
            res.status(400);
            return res.send("Database query failed");
        }
    },
    deleteOne: async (req, res) => {
        try {
            await Department.findOneAndRemove({ departmentName: req.params.name }, function (err) {
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
            await Department.find({ departmentName: req.params.name})
            .exec(function (err, department) {
                if (err) return res.status(404).json(err);
                res.json(department);
            });
        }
        catch(err){
            res.status(400);
            return res.send("Database query failed");
        }
    },
    getAll: async (req, res) => {
        try {
            await Department.find({})
            .exec(function (err, department) {
                if (err) return res.status(404).json(err);
                res.json(department);
            })
        }
        catch(err){
            res.status(400);
            return res.send("Database query failed");
        }
    }
}