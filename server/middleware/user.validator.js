class UserValidator {
  validateId = (req, res, next) => {
    if (!Number.isInteger(Number(req.params.id))) {
      return res.status(400).json({ error: 'Invalid user ID format' });
    }
    next();
  };

  validateCreate = (req, res, next) => {
    const { first_name, last_name, email, role, organisation } = req.body;

    if (!first_name || !last_name || !email || !role || !organisation) {
      return res.status(400).json({
        error: 'Missing required user fields',
      });
    }

    next();
  };

  validateUpdate = (req, res, next) => {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        error: 'At least one field is required to update',
      });
    }

    next();
  };
}

export default new UserValidator();
