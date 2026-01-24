// middleware/response.validator.js
class ResponseValidator {
  validateSubmission = (req, res, next) => {
    const { form_id, responses, user_id } = req.body;

    // 1. Required fields
    if (!form_id || !responses) {
      return res.status(400).json({
        error: "form_id and responses are required"
      });
    }

    // 2. form_id must be integer
    if (!Number.isInteger(Number(form_id))) {
      return res.status(400).json({
        error: "form_id must be a valid integer"
      });
    }

    // 3. responses must be a JSON object
    if (typeof responses !== "object" || Array.isArray(responses)) {
      return res.status(400).json({
        error: "responses must be a valid JSON object"
      });
    }

    // 4. user_id validation (OPTIONAL field)
    if (user_id !== undefined && user_id !== null) {
      if (!Number.isInteger(Number(user_id))) {
        return res.status(400).json({
          error: "user_id must be a valid integer if provided"
        });
      }
    }

    next();
  };
}

export default new ResponseValidator();
