import SurveyTemplateModel from '../models/surveyTemplate.model.js';

class SurveyTemplateController {
  // GET /survey-templates
  getAll = async (req, res) => {
    try {
      const templates = await SurveyTemplateModel.findAll();
      res.status(200).json(templates);
    } catch (error) {
      console.error('getAllSurveyTemplates error:', error);
      res.status(500).json({ error: 'Failed to fetch survey templates' });
    }
  };

  // GET /survey-templates/:id
  getById = async (req, res) => {
    try {
      const template = await SurveyTemplateModel.findById(req.params.id);
      if (!template) {
        return res.status(404).json({ message: 'Template not found' });
      }
      res.status(200).json(template);
    } catch (error) {
      console.error('getSurveyTemplateById error:', error);
      res.status(500).json({ error: 'Error retrieving survey template' });
    }
  };

  // POST /survey-templates
  create = async (req, res) => {
    try {
      const { recipients: _, ...templateData } = req.body; // explicitly discard recipients
      if (req.user) templateData.created_by = req.user.id; // Ensure created_by is set
      const newTemplate = await SurveyTemplateModel.create(templateData);
      res.status(201).json({
        message: 'Survey template created successfully',
        template: newTemplate,
      });
    } catch (error) {
      console.error('createSurveyTemplates error:', error);
      res.status(500).json({ error: 'Failed to create survey template' });
    }
  };

  // PUT /survey-templates/:id
  update = async (req, res) => {
    try {
      const updatedTemplate = await SurveyTemplateModel.update(req.params.id, req.body);
      if (!updatedTemplate) {
        return res.status(404).json({ message: 'Template not found' });
      }
      res.status(200).json({
        message: 'Survey template updated successfully',
        template: updatedTemplate,
      });
    } catch (error) {
      console.error('updateSurveyTemplates error:', error);
      res.status(500).json({ error: 'Error updating survey template' });
    }
  };

  // DELETE /survey-templates/:id
  delete = async (req, res) => {
    try {
      const success = await SurveyTemplateModel.delete(req.params.id);
      if (!success) {
        return res.status(404).json({ message: 'Template not found' });
      }
      res.status(200).json({ message: 'Survey template deleted successfully' });
    } catch (error) {
      console.error('deleteSurveyTemplates error:', error);
      res.status(500).json({ error: 'Failed to delete survey template' });
    }
  };
}

export default new SurveyTemplateController();
