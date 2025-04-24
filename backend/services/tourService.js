// Import required Node.js modules for file system operations
const fs = require('fs').promises;
const path = require('path');
const performanceMonitor = require('../utils/performanceMonitor');

// Define the path to the JSON database file
const dbPath = path.join(__dirname, '../data/db.json');

// TourService class for managing tour data operations
class TourService {
  constructor() {
    this.cache = {
      tours: null,
      lastUpdate: null,
      cacheDuration: 5000 // Cache duration in milliseconds (5 seconds)
    };
  }

  async _readFromFile() {
    performanceMonitor.start('fileRead');
    const data = await fs.readFile(dbPath, 'utf8');
    const duration = performanceMonitor.end('fileRead');
    console.log(`File read took ${duration}ms`);
    return JSON.parse(data);
  }

  async _writeToFile(data) {
    performanceMonitor.start('fileWrite');
    await fs.writeFile(dbPath, JSON.stringify(data, null, 2));
    const duration = performanceMonitor.end('fileWrite');
    console.log(`File write took ${duration}ms`);
  }

  async _getCachedTours() {
    const now = Date.now();
    if (!this.cache.tours || !this.cache.lastUpdate || 
        (now - this.cache.lastUpdate) > this.cache.cacheDuration) {
      const data = await this._readFromFile();
      this.cache.tours = data.tours;
      this.cache.lastUpdate = now;
    }
    return this.cache.tours;
  }

  // Retrieve all tours from the database
  async getAllTours() {
    performanceMonitor.start('getAllTours');
    const tours = await this._getCachedTours();
    const duration = performanceMonitor.end('getAllTours');
    console.log(`getAllTours took ${duration}ms`);
    return tours;
  }

  // Find a specific tour by its ID
  async getTourById(id) {
    performanceMonitor.start('getTourById');
    const tours = await this._getCachedTours();
    const tour = tours.find(tour => tour.id === id);
    const duration = performanceMonitor.end('getTourById');
    console.log(`getTourById took ${duration}ms`);
    return tour;
  }

  // Create a new tour and save it to the database
  async createTour(tourData) {
    performanceMonitor.start('createTour');
    const tours = await this._getCachedTours();
    
    // Generate a new tour object with metadata
    const newTour = {
      id: (tours.length + 1).toString(), // Simple ID generation
      ...tourData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    // Add the new tour and save to file
    tours.push(newTour);
    await this._writeToFile({ tours });
    this.cache.tours = tours;
    this.cache.lastUpdate = Date.now();
    
    const duration = performanceMonitor.end('createTour');
    console.log(`createTour took ${duration}ms`);
    return newTour;
  }

  // Update an existing tour in the database
  async updateTour(id, tourData) {
    performanceMonitor.start('updateTour');
    const tours = await this._getCachedTours();
    
    // Find the tour to update
    const index = tours.findIndex(tour => tour.id === id);
    if (index === -1) return null;

    // Update the tour with new data and timestamp
    tours[index] = {
      ...tours[index],
      ...tourData,
      updated_at: new Date().toISOString()
    };

    // Save the updated tours array to file
    await this._writeToFile({ tours });
    this.cache.tours = tours;
    this.cache.lastUpdate = Date.now();
    
    const duration = performanceMonitor.end('updateTour');
    console.log(`updateTour took ${duration}ms`);
    return tours[index];
  }

  // Delete a tour from the database
  async deleteTour(id) {
    performanceMonitor.start('deleteTour');
    const tours = await this._getCachedTours();
    
    // Filter out the tour to delete
    const filteredTours = tours.filter(tour => tour.id !== id);
    if (filteredTours.length === tours.length) return false;
    
    // Save the filtered tours array to file
    await this._writeToFile({ tours: filteredTours });
    this.cache.tours = filteredTours;
    this.cache.lastUpdate = Date.now();
    
    const duration = performanceMonitor.end('deleteTour');
    console.log(`deleteTour took ${duration}ms`);
    return true;
  }
}

// Export the TourService class for use in other modules
module.exports = TourService; 