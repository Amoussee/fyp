import UserModel from '../models/user.model.js';

class UserController {
  getAll = async (req, res) => {
    try {
      const users = await UserModel.findAll();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  getActive = async (req, res) => {
    try {
      const users = await UserModel.findActive();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  getById = async (req, res) => {
    try {
      const user = await UserModel.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  create = async (req, res) => {
    try {
      const result = await UserModel.create(req.body);
      res.status(201).json({
        message: 'User created successfully',
        user_id: result.user_id,
      });
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  update = async (req, res) => {
    const { id } = req.params;

    const allowedUpdates = {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      full_name: req.body.full_name,
      organisation: req.body.organisation,
      phone_number: req.body.phone_number,
      number_child: req.body.number_child,
      child_details: req.body.child_details,
    };

    Object.keys(allowedUpdates).forEach(
      (key) => allowedUpdates[key] === undefined && delete allowedUpdates[key],
    );

    const updatedUser = await UserModel.update(id, allowedUpdates);
    res.status(200).json(updatedUser);
  };

  delete = async (req, res) => {
    try {
      const success = await UserModel.delete(req.params.id);
      if (!success) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  deactivate = async (req, res) => {
    try {
      const user = await UserModel.deactivate(req.params.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json({ message: 'User deactivated', user });
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
}

export default new UserController();
