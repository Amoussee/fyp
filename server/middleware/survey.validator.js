// middleware/survey.validator.js
class SurveyValidator {
    validateCreate = (req, res, next) => {
        const { title, schema_json, created_by } = req.body;

        if (!title || !schema_json || !created_by) {
            return res.status(400).json({ error: "Missing required fields: title, schema_json, or created_by" });
        }

        next();
    };
}
export default new SurveyValidator();