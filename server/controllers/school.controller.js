import SchoolModel from '../models/school.model.js';

class SchoolController {
    getAll = async (req, res) => {
        try {
            const schools = await SchoolModel.findAll();
            res.status(200).json(schools);
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    };

    getById = async (req, res) => {
        try {
            const school = await SchoolModel.findById(req.params.id);
            if (!school) {
                return res.status(404).json({ message: 'School not found' });
            }
            res.status(200).json(school);
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    };

    search = async (req, res) => {
        try {
            const filters = req.body;

            if (!filters || Object.keys(filters).length === 0) {
                return res.status(400).json({
                    message: 'At least one search filter is required',
                });
            }

            const schools = await SchoolModel.search(filters);

            if (schools.length === 0) {
                return res.status(404).json({ message: 'No schools found' });
            }

            res.status(200).json(schools);
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    };

    create = async (req, res) => {
        try {
            const school = await SchoolModel.create(req.body);
            res.status(201).json({ message: 'Created', school });
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    };

    update = async (req, res) => {
        try {
            const school = await SchoolModel.update(req.params.id, req.body);

            if (!school) {
                return res.status(404).json({ message: 'School not found' });
            }

            res.status(200).json({
                message: 'Updated successfully',
                school,
            });
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    };

    updateStatus = async (req, res) => {
        try {
            const { status } = req.body;

            if (!status) {
                return res.status(400).json({ message: 'Status is required' });
            }

            const school = await SchoolModel.updateStatus(req.params.id, status);

            if (!school) {
                return res.status(404).json({ message: 'School not found' });
            }

            res.status(200).json({
                message: `Status updated to ${status}`,
                school,
            });
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    };

    delete = async (req, res) => {
        try {
            const success = await SchoolModel.delete(req.params.id);

            if (!success) {
                return res.status(404).json({ message: 'School not found' });
            }

            res.status(200).json({ message: 'Deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    };
}

export default new SchoolController();
