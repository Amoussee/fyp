// middleware/survey.validator.js
class SurveyValidator {
  validateCreate = (req, res, next) => {
    const {status} = req.body;

    // if survey is ready to be sent out, run strict checks
    if (status === 'open') {
      return this.validatePublish(req, res, next);
    }

    // if survey is just a draft, run loose checks
    return this.validateDraft(req, res, next);
  };

  validateUpdate = (req, res, next) => {
    const {id} = req.params;
    const {status} = req.body;

    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ error: "form_id must be a valid integer" });
    }

    if (status === 'open') {
      return this.validatePublish(req, res, next);
    }
    return this.validateTypeCheck(req, res, next);
  };

  validateDraft = (req, res, next) => {
    const { title, created_by } = req.body;
    const userId = req.user ? req.user.id : created_by;

    // drafts only need title and owner
    if (!title) {
      return res.status(400).json({ error: "Draft must have a title" });
    }
    if (!userId) {
      return res.status(400).json({ error: "Missing created_by (User ID required)" });
    }

    next();
  };

  validatePublish = (req, res, next) => {
    const { title, schema_json, recipients } = req.body;
    // 1. Title Required
    if (!title || typeof title !== 'string' || title.trim() === '') {
        return res.status(400).json({ error: "Title is required to publish" });
    }

    // 2. Questions Required
    // We check if schema_json exists AND has a questions array
    if (!schema_json || !schema_json.questions || !Array.isArray(schema_json.questions) || schema_json.questions.length === 0) {
        return res.status(400).json({ error: "Cannot publish a survey without questions" });
    }

    // 3. Recipients Required
    if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
        return res.status(400).json({ error: "Cannot publish without recipient schools" });
    }

    next();
  };

  // used for general updates but not publishing
  validateTypeCheck = (req, res, next) => {
    const { title, description, survey_type, metadata, schema_json } = req.body;

    const hasUpdatableField =
      title !== undefined ||
      description !== undefined ||
      survey_type !== undefined ||
      metadata !== undefined ||
      schema_json !== undefined;

    if (!hasUpdatableField && req.body.status === undefined) {
      return res.status(400).json({ error: "At least one field must be provided for update" });
    }

    if (title !== undefined && typeof title !== "string") {
      return res.status(400).json({ error: "title must be a string" });
    }

    if (description !== undefined && typeof description !== "string") {
      return res.status(400).json({ error: "description must be a string" });
    }

    if (survey_type !== undefined && typeof survey_type !== "string") {
      return res.status(400).json({ error: "survey_type must be a string" });
    }

    if (metadata !== undefined && typeof metadata !== "object") {
      return res.status(400).json({ error: "metadata must be an object" });
    }

    if (schema_json !== undefined && typeof schema_json !== "object") {
      return res.status(400).json({ error: "schema_json must be an object" });
    }

    next();
  };
}

export default new SurveyValidator();
