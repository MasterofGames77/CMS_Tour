const fs = require('fs').promises;
const path = require('path');

const dbPath = path.join(__dirname, '../data/db.json');

class TourService {
  async getAllTours() {
    const data = await fs.readFile(dbPath, 'utf8');
    return JSON.parse(data).tours;
  }

  async getTourById(id) {
    const data = await fs.readFile(dbPath, 'utf8');
    const tours = JSON.parse(data).tours;
    return tours.find(tour => tour.id === id);
  }

  async createTour(tourData) {
    const data = await fs.readFile(dbPath, 'utf8');
    const { tours } = JSON.parse(data);
    
    const newTour = {
      id: (tours.length + 1).toString(),
      ...tourData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    tours.push(newTour);
    await fs.writeFile(dbPath, JSON.stringify({ tours }, null, 2));
    return newTour;
  }

  async updateTour(id, tourData) {
    const data = await fs.readFile(dbPath, 'utf8');
    let { tours } = JSON.parse(data);
    
    const index = tours.findIndex(tour => tour.id === id);
    if (index === -1) return null;

    tours[index] = {
      ...tours[index],
      ...tourData,
      updated_at: new Date().toISOString()
    };

    await fs.writeFile(dbPath, JSON.stringify({ tours }, null, 2));
    return tours[index];
  }

  async deleteTour(id) {
    const data = await fs.readFile(dbPath, 'utf8');
    let { tours } = JSON.parse(data);
    
    const filteredTours = tours.filter(tour => tour.id !== id);
    if (filteredTours.length === tours.length) return false;
    
    await fs.writeFile(dbPath, JSON.stringify({ tours: filteredTours }, null, 2));
    return true;
  }
}

module.exports = TourService; 