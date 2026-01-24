// controllers/response.controller.js
import SurveyResponseModel from '../models/responses.model.js';

class ResponseController {
    // POST /responses
    create = async (req, res) => {
        try {
            const newResponse = await SurveyResponseModel.create(req.body);
            res.status(201).json(newResponse);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    };

    // GET /responses/form/:formId
    getByFormId = async (req, res) => {
        try {
            const { formId } = req.params;
            const data = await SurveyResponseModel.findByFormId(formId);
            res.status(200).json(data);
        } catch (error) {
            res.status(500).json({ error: "Failed to fetch responses" });
        }
    };

    // GET /responses/:id
    getOne = async (req, res) => {
        try {
            const response = await SurveyResponseModel.findById(req.params.id);
            if (!response) return res.status(404).json({ message: "Response not found" });
            res.status(200).json(response);
        } catch (error) {
            res.status(500).json({ error: "Error retrieving response" });
        }
    };

    // DELETE /responses/:id
    delete = async (req, res) => {
        try {
            const success = await SurveyResponseModel.delete(req.params.id);
            if (!success) return res.status(404).json({ message: "Response not found" });
            res.status(200).json({ message: "Response deleted successfully" });
        } catch (error) {
            res.status(500).json({ error: "Delete failed" });
        }
    };

    // DELETE /responses/form/:formId
    deleteByForm = async (req, res) => {
        try {
            await SurveyResponseModel.deleteByFormId(req.params.formId);
            res.status(200).json({ message: `All responses for form ${req.params.formId} cleared` });
        } catch (error) {
            res.status(500).json({ error: "Batch delete failed" });
        }
    };
}

export default new ResponseController();