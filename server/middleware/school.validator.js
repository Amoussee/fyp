class SchoolValidator {
    validateCreate = (req, res, next) => {
        const { school_name, address } = req.body;

        if (!school_name || !address) {
            return res.status(400).json({
                error: 'School name and address are required',
            });
        }

        next();
    };

    validateUpdate = (req, res, next) => {
        if (Object.keys(req.body).length === 0) {
            return res.status(400).json({
                error: 'At least one field is required to update',
            });
        }

        next();
    };

    validateStatus = (req, res, next) => {
        const { status } = req.body;
        if (!status) {
            return res.status(400).json({ error: 'Status is required' });
        }

        next();
    };

    validateId = (req, res, next) => {
        if (!Number.isInteger(Number(req.params.id))) {
            return res.status(400).json({ error: 'Invalid ID format' });
        }

        next();
    };

    validateSearch = (req, res, next) => {
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({
                error: 'At least one search filter must be provided',
            });
        }
        next();
    };

}

export default new SchoolValidator();
