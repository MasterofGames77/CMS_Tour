const express = require('express');
const router = express.Router();
const TourService = require('../services/tourService');

const tourService = new TourService();

// Get all tours
router.get('/', async (req, res) => {
  try {
    const tours = await tourService.getAllTours();
    res.json(tours);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tours' });
  }
});

// Get tour by ID
router.get('/:id', async (req, res) => {
  try {
    const tour = await tourService.getTourById(req.params.id);
    if (!tour) {
      return res.status(404).json({ error: 'Tour not found' });
    }
    res.json(tour);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tour' });
  }
});

// Create new tour
router.post('/', async (req, res) => {
  try {
    const newTour = await tourService.createTour(req.body);
    res.status(201).json(newTour);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create tour' });
  }
});

// Update tour
router.put('/:id', async (req, res) => {
  try {
    const updatedTour = await tourService.updateTour(req.params.id, req.body);
    if (!updatedTour) {
      return res.status(404).json({ error: 'Tour not found' });
    }
    res.json(updatedTour);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update tour' });
  }
});

// Delete tour
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await tourService.deleteTour(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Tour not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete tour' });
  }
});

module.exports = router; 