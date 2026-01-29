// controllers/survey.controller.js
import SurveyModel from '../models/survey.model.js';

class SurveyController {
  // GET /surveys
  getAllsurveys = async (req, res) => {
    try {
      const { status, type } = req.query;
      const userId = req.user ? req.user.id : undefined;
      const filters = {status, type, userId};

      const data = await SurveyModel.findAll(filters);
      res.status(200).json(data);
    } catch (err) {
      res.status(500).json({ error: 'Failed to retrieve surveys' });
    }
  };

  // GET /surveys/:id
  getById = async (req, res) => {
    try {
      const surveyId = req.params.id;
      const userId = req.user ? req.user.id : null;
      
      const survey = await SurveyModel.findById(surveyId, userId);
      if (!survey) return res.status(404).json({ message: 'Survey not found' });
      res.status(200).json(survey);
    } catch (err) {
      res.status(500).json({ error: 'Error fetching survey' });
    }
  };

  // GET /surveys/status/:status
  getByStatus = async (req, res) => {
    try {
      const { status } = req.params;
      const userId = req.user ? req.user.id : undefined;

      // Validate against ENUM list
      const validStatuses = ['draft', 'open', 'ready', 'closed'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({error: `Invalid status` });
      }
      // Call the specific model function
      const surveys = await SurveyModel.findByStatus(status);
      res.status(200).json(surveys);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch surveys by status' });
    }
  };

  // POST /surveys
  createSurvey = async (req, res) => {
    try {
      const newSurvey = await SurveyModel.create(req.body);
      const shareableLink = `${process.env.FRONTEND_URL}/surveys/respond/${newSurvey.form_id}`;
      res.status(201).json({newSurvey, link: shareableLink, message: "Survey created successfully"});
    } catch (err) {
      res.status(500).json({ error: 'Could not create survey' });
    }
  };

  // PUT /surveys/:id
  update = async (req, res) => {
    try {
      // Ensure the request body has fields to update
      if (Object.keys(req.body).length === 0) {
        return res.status(400).json({ message: 'No fields to update' });
      }

      // Call the model to update the survey
      const updated = await SurveyModel.update(req.params.id, req.body);

      if (!updated) return res.status(404).json({ message: 'Survey not found' });

      res.status(200).json(updated);  // Return the updated survey data
    } catch (err) {
      res.status(500).json({ error: 'Update failed', details: err.message });
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