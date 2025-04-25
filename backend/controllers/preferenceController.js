import Preference from "../models/Preference.js";

export const getAllPreferences = async (req, res) => {
  try {
    const preferences = await Preference.findAll();
    return res.json(preferences);
  } catch (error) {
    console.error('Get preferences error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const getPreferenceById = async (req, res) => {
  try {
    const preferenceId = req.params.id;
    const preference = await Preference.findByPk(preferenceId);

    if (!preference) {
      return res.status(404).json({ message: 'Preference not found' });
    }

    return res.json(preference);
  } catch (error) {
    console.error('Get preference error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const createPreference = async (req, res) => {
  try {
    const { preference_name } = req.body;

    const preference = await Preference.create({ preference_name });

    return res.status(201).json({
      message: 'Preference created successfully',
      preferenceId: preference.preference_id
    });
  } catch (error) {
    console.error('Create preference error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const updatePreference = async (req, res) => {
  try {
    const preferenceId = req.params.id;
    const { preference_name } = req.body;

    const preference = await Preference.findByPk(preferenceId);

    if (!preference) {
      return res.status(404).json({ message: 'Preference not found' });
    }

    await preference.update({ preference_name });

    return res.json({ message: 'Preference updated successfully' });
  } catch (error) {
    console.error('Update preference error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const deletePreference = async (req, res) => {
  try {
    const preferenceId = req.params.id;

    const preference = await Preference.findByPk(preferenceId);

    if (!preference) {
      return res.status(404).json({ message: 'Preference not found' });
    }

    await preference.destroy();

    return res.json({ message: 'Preference deleted successfully' });
  } catch (error) {
    console.error('Delete preference error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export default { getAllPreferences, getPreferenceById, createPreference, updatePreference, deletePreference };
