// middleware/survey.validator.js
class SurveyValidator {
  validateCreate = (req, res, next) => {
    const { title, schema_json, created_by } = req.body;

    if (!title || !schema_json || !created_by) {
      return res.status(400).json({
        error: "Missing required fields: title, schema_json, or created_by"
      });
    }

    next();
  };

  validateUpdate = (req, res, next) => {
    const { id } = req.params;
    const {
      title,
      description,
      survey_type,
      metadata,
      schema_json
    } = req.body;

    if (!id || !Number.isInteger(Number(id))) {
      return res.status(400).json({
        error: "form_id must be a valid integer"
      });
    }

    const hasUpdatableField =
      title !== undefined ||
      description !== undefined ||
      survey_type !== undefined ||
      metadata !== undefined ||
      schema_json !== undefined;

    if (!hasUpdatableField) {
      return res.status(400).json({
        error: "At least one field must be provided for update"
      });
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
