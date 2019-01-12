const errors = require('restify-errors');
const Patient = require('../models/Patient');

module.exports = server => {
    //Get Patients
    server.get('/patients', async (req, res, next) => {
        
        try{
            const patients = await Patient.find({});
            res.send(patients);
            next();
        }catch(err) {
            return next(new errors.InvalidContentError(err));
        }
    });

    // Add Patients
    server.post('/patients', async (req, res, next) => {
        //Check for JSON
        if(!req.is('application/json')){
            return next(new errors.InvalidContentError("Expects 'application/json'"));
        }
        const {name, occupation, contact, email, gender, dateOfBirth, insurance } = req.body;

        const patient = new Patient({
            name,
            occupation,
            contact,
            email,
            gender,
            dateOfBirth,
            insurance
        });
        try {
            const newPatient = await patient.save();
            res.send(201);
        } catch(err) {
            return next(new errors.InternalError(err.message));
        }
    });
    //Get Single Patients
    server.get('/patients/:id', async (req, res, next) => {
        
        try{
            const patient = await Patient.findById(req.params.id);
            res.send(patient);
            next();
        }catch(err) {
            return next(new errors.ResourceNotFoundError(`There is no patient with the id of ${req.params.id}`));
        }
    });
    
    //Update Patient
    server.put('/patients/:id', async (req, res, next) => {
        //Check for JSON
        if(!req.is('application/json')){
            return next(new errors.InvalidContentError("Expects 'application/json'"));
        }

        try {
            const patient = await Patient.findOneAndUpdate({ _id: req.params.id }, req.body);
            res.send(200);
        } catch(err) {
            return next(new errors.ResourceNotFoundError(`There is no patient with the id of ${req.params.id}`));
        }
    });
    //Delete Patient
    server.del('/patients/:id', async (req, res, next) => {
        try {
            const patient = await Patient.findByIdAndRemove({_id: req.params.id});
        } catch (err){
            return next(new errors.ResourceNotFoundError(`There is no patient with the id of ${req.params.id}`));
        }
    });
};