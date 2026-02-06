// controllers/survey.controller.js
import SurveyModel from '../models/survey.model.js';

class SurveyController {
  // GET /surveys
  getAllsurveys = async (req, res) => {
    try {
      const { status, type } = req.query;
      const userId = req.user ? req.user.id : undefined;
      const filters = { status, type, userId };
      const validStatuses = ['draft', 'open', 'ready', 'closed'];
      if (status && !validStatuses.includes(status)) {
        return res.status(400).json({ error: `Invalid status parameter` });
      }

      const data = await SurveyModel.findAll(filters);
      res.status(200).json(data);
    } catch (err) {
      console.error('Error in getAllsurveys:', err);
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
    } catch {
      res.status(500).json({ error: 'Error fetching survey' });
    }
  };

  // POST /surveys
  createSurvey = async (req, res) => {
    try {
      const surveyData = {
        ...req.body,
        created_by: req.user ? req.user.id : req.body.created_by,
      };

      const newSurvey = await SurveyModel.create(surveyData);
      const shareableLink = `${process.env.FRONTEND_URL}/surveys/respond/${newSurvey.form_id}`;
      res
        .status(201)
        .json({ newSurvey, link: shareableLink, message: 'Survey created successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Could not create survey' });
    }
  };

  // PUT /surveys/:id
  update = async (req, res) => {
    try {
      const userId = req.user.id;
      const surveyId = req.params.id;
      const updates = req.body;

      // Ensure the request body has fields to update
      if (Object.keys(updates).length === 0) {
        return res.status(400).json({ message: 'No fields to update' });
      }

      if (updates.status) {
        return res.status(400).json({
          error: 'Unable to edit status using this method',
        });
      }

      const existingSurvey = await SurveyModel.findById(surveyId, userId);
      if (!existingSurvey) {
        return res.status(404).json({ error: 'Survey not found' });
      }
      if (existingSurvey.created_by !== userId) {
        return res.status(403).json({ error: 'You do not have permission to edit this survey' });
      }
      // lock questions if status is not draft
      if (existingSurvey.status !== 'draft' && updates.schema_json) {
        return res.status(400).json({ error: 'Cannot edit questions while survey is live.' });
      }

      // Call the model to update the survey
      const updated = await SurveyModel.update(surveyId, userId, updates);

      if (!updated) return res.status(404).json({ message: 'Survey not found' });
      res.status(200).json(updated); // Return the updated survey data
    } catch (err) {
      res.status(500).json({ error: 'Update failed', details: err.message });
    }
  };

  updateStatus = async (req, res) => {
    try {
      const userId = req.user.id;
      const surveyId = req.params.id;
      const { status: newStatus } = req.body;

      const survey = await SurveyModel.findById(surveyId, userId);

      if (!survey) return res.status(404).json({ error: 'Survey not found' });
      if (survey.created_by != userId) return res.status(403).json({ error: 'Access denied' });

      switch (newStatus) {
        // draft -> open
        case 'open':
          if (survey.status !== 'draft') {
            return res
              .status(400)
              .json({ error: `Cannot open survey. Current status is '${survey.status}'.` });
          }

          if (!survey.title) return res.status(400).json({ error: 'Title is required.' });

          let schema = survey.schema_json;
          if (typeof schema === 'string') {
            try {
              schema = JSON.parse(schema);
            } catch {
              schema = {};
            }
          }

          const pages = Array.isArray(schema?.pages) ? schema.pages : [];
          const elementCount = pages.reduce((acc, p) => {
            const els = Array.isArray(p?.elements) ? p.elements : [];
            return acc + els.length;
          }, 0);

          if (elementCount === 0) {
            return res.status(400).json({ error: 'Cannot publish a survey without questions.' });
          }

          break;

        // open/ready -> closed
        case 'closed':
          const allowedOrigins = ['open', 'ready'];
          if (!allowedOrigins.includes(survey.status)) {
            return res
              .status(400)
              .json({ error: 'Survey cannot be closed from its current state.' });
          }
          break;

        default:
          // block users from manually sending "ready", "draft"
          return res.status(400).json({
            error: `Invalid status transition to '${newStatus}'. Status updates are restricted.`,
          });
      }

      const result = await SurveyModel.update(surveyId, userId, { status: newStatus });
      res.status(200).json({ message: `Survey is now ${newStatus}`, survey: result });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Status update failed', details: err.message });
    }
  };

  // DELETE /surveys/:id
  delete = async (req, res) => {
    try {
      const deleted = await SurveyModel.delete(req.params.id);
      if (!deleted) return res.status(404).json({ message: 'Survey not found' });
      res.status(200).json({ message: 'Deleted successfully' });
    } catch {
      res.status(500).json({ error: 'Delete failed' });
    }
  };

  // GET /surveys/status/:status
  // getByStatus = async (req, res) => {
  //   try {
  //     const { status } = req.params;
  //     const userId = req.user ? req.user.id : undefined;

  //     // Validate against ENUM list
  //     const validStatuses = ['draft', 'open', 'ready', 'closed'];
  //     if (!validStatuses.includes(status)) {
  //       return res.status(400).json({error: `Invalid status` });
  //     }
  //     // Call the specific model function
  //     const surveys = await SurveyModel.findByStatus(status);
  //     res.status(200).json(surveys);
  //   } catch (err) {
  //     console.error(err);
  //     res.status(500).json({ error: 'Failed to fetch surveys by status' });
  //   }
  // };
}

export default new SurveyController();
