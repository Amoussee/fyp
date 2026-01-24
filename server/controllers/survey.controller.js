// controllers/survey.controller.js
import SurveyModel from '../models/survey.model.js';

class SurveyController {
  // GET /surveys
  getAllsurverys = async (req, res) => {
    try {
      const data = await SurveyModel.findAll();
      res.status(200).json(data);
    } catch (err) {
      res.status(500).json({ error: 'Failed to retrieve surveys' });
    }
  };

  // GET /surveys/:id
  getById = async (req, res) => {
    try {
      const survey = await SurveyModel.findById(req.params.id);
      if (!survey) return res.status(404).json({ message: 'Survey not found' });
      res.status(200).json(survey);
    } catch (err) {
      res.status(500).json({ error: 'Error fetching survey' });
    }
  };

  // POST /surveys
  createSurvey = async (req, res) => {
    try {
      const newSurvey = await SurveyModel.create(req.body);
      res.status(201).json(newSurvey);
    } catch (err) {
      res.status(500).json({ error: 'Could not create survey' });
    }
  };

  // PUT /surveys/:id
  update = async (req, res) => {
    try {
      const updated = await SurveyModel.update(req.params.id, req.body);
      if (!updated) return res.status(404).json({ message: 'Survey not found' });
      res.status(200).json(updated);
    } catch (err) {
      res.status(500).json({ error: 'Update failed' });
    }
  };

  // DELETE /surveys/:id
  delete = async (req, res) => {
    try {
      const deleted = await SurveyModel.delete(req.params.id);
      if (!deleted) return res.status(404).json({ message: 'Survey not found' });
      res.status(200).json({ message: 'Deleted successfully' });
    } catch (err) {
      res.status(500).json({ error: 'Delete failed' });
    }
  };
}

export default new SurveyController();