// Import required Node.js modules for file system operations
const fs = require('fs').promises;
const path = require('path');

// Define the path to the JSON database file
const dbPath = path.join(__dirname, '../data/db.json');

// TourService class for managing tour data operations
class TourService {
  // Retrieve all tours from the database
  async getAllTours() {
    const data = await fs.readFile(dbPath, 'utf8');
    return JSON.parse(data).tours;
  }

  // Find a specific tour by its ID
  async getTourById(id) {
    const data = await fs.readFile(dbPath, 'utf8');
    const tours = JSON.parse(data).tours;
    return tours.find(tour => tour.id === id);
  }

  // Create a new tour and save it to the database
  async createTour(tourData) {
    const data = await fs.readFile(dbPath, 'utf8');
    const { tours } = JSON.parse(data);
    
    // Generate a new tour object with metadata
    const newTour = {
      id: (tours.length + 1).toString(), // Simple ID generation
      ...tourData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    // Add the new tour and save to file
    tours.push(newTour);
    await fs.writeFile(dbPath, JSON.stringify({ tours }, null, 2));
    return newTour;
  }

  // Update an existing tour in the database
  async updateTour(id, tourData) {
    const data = await fs.readFile(dbPath, 'utf8');
    let { tours } = JSON.parse(data);
    
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
    await fs.writeFile(dbPath, JSON.stringify({ tours }, null, 2));
    return tours[index];
  }

  // Delete a tour from the database
  async deleteTour(id) {
    const data = await fs.readFile(dbPath, 'utf8');
    let { tours } = JSON.parse(data);
    
    // Filter out the tour to delete
    const filteredTours = tours.filter(tour => tour.id !== id);
    if (filteredTours.length === tours.length) return false;
    
    // Save the filtered tours array to file
    await fs.writeFile(dbPath, JSON.stringify({ tours: filteredTours }, null, 2));
    return true;
  }
}

// Export the TourService class for use in other modules
module.exports = TourService; 