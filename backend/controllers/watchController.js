import Watch from '../models/Watch.js';
import { Op } from 'sequelize';
import Preference from '../models/Preference.js';

export const getAllWatches = async (req, res) => {
  try {
    const watches = await Watch.findAll({
      where: { watch_stock: { [Op.gt]: 0 } }, 
    });

    return res.json(watches);
  } catch (error) {
    console.error('Get watches error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const getWatchById = async (req, res) => {
  try {
    const watchId = req.params.id;
    const watch = await Watch.findByPk(watchId);

    if (!watch) {
      return res.status(404).json({ message: 'Watch not found' });
    }

    return res.json(watch);
  } catch (error) {
    console.error('Get watch error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const getWatchesByPreference = async (req, res) => {
  try {
    const preferenceId = req.params.preferenceId;
    const watches = await Watch.findAll({
      where: { watch_characteristic: preferenceId, watch_stock: { [Op.gt]: 0 } },
      include: [
        {
          model: Preference,
          as: 'characteristic',
          attributes: ['preference_name']
        }
      ]
    });

    return res.json(watches);
  } catch (error) {
    console.error('Get watches by preference error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const createWatch = async (req, res) => {
  try {
    const { watch_name, watch_image, watch_characteristic, watch_price, watch_stock } = req.body;

    const watch = await Watch.create({
      watch_name,
      watch_image,
      watch_characteristic,
      watch_price,
      watch_stock
    });

    return res.status(201).json({
      message: 'Watch created successfully',
      watchId: watch.watch_id
    });
  } catch (error) {
    console.error('Create watch error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const updateWatch = async (req, res) => {
  try {
    const watchId = req.params.id;
    const { watch_name, watch_image, watch_characteristic, watch_price, watch_stock } = req.body;

    const watch = await Watch.findByPk(watchId);

    if (!watch) {
      return res.status(404).json({ message: 'Watch not found' });
    }

    await watch.update({
      watch_name,
      watch_image,
      watch_characteristic,
      watch_price,
      watch_stock
    });

    return res.json({ message: 'Watch updated successfully' });
  } catch (error) {
    console.error('Update watch error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const deleteWatch = async (req, res) => {
  try {
    const watchId = req.params.id;

    const watch = await Watch.findByPk(watchId);

    if (!watch) {
      return res.status(404).json({ message: 'Watch not found' });
    }

    await watch.destroy();

    return res.json({ message: 'Watch deleted successfully' });
  } catch (error) {
    console.error('Delete watch error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export default {
  getAllWatches,
  getWatchById,
  getWatchesByPreference,
  createWatch,
  updateWatch,
  deleteWatch
};
