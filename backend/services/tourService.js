const sql = require('mssql');
require('dotenv').config();

// SQL Server configuration
const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: 'LAPTOP-M2SB9VN2',
    database: 'TourManagement',
    options: {
        encrypt: false,
        trustServerCertificate: true,
        enableArithAbort: true
    }
};

// TourService class for managing tour data operations
class TourService {
  // Retrieve all tours from the database
  async getAllTours() {
    try {
      await sql.connect(config);
      
      // First get all tours
      const tours = await sql.query`
        SELECT * FROM Tours
        ORDER BY created_at DESC
      `;

      // For each tour, get its itinerary and highlights
      const result = await Promise.all(tours.recordset.map(async (tour) => {
        const itinerary = await sql.query`
          SELECT day, title, description
          FROM Itinerary
          WHERE tour_id = ${tour.id}
          ORDER BY day
        `;

        // Get highlights for each day
        const highlights = await sql.query`
          SELECT day, highlight
          FROM Highlights
          WHERE tour_id = ${tour.id}
          ORDER BY day
        `;

        // Group highlights by day
        const highlightsByDay = highlights.recordset.reduce((acc, curr) => {
          if (!acc[curr.day]) {
            acc[curr.day] = [];
          }
          acc[curr.day].push(curr.highlight);
          return acc;
        }, {});

        // Combine itinerary with highlights
        const fullItinerary = itinerary.recordset.map(day => ({
          ...day,
          highlights: highlightsByDay[day.day] || []
        }));

        return {
          ...tour,
          itinerary: fullItinerary
        };
      }));

      return result;
    } catch (err) {
      console.error('Database error:', err);
      throw new Error('Failed to fetch tours');
    } finally {
      await sql.close();
    }
  }

  // Find a specific tour by its ID
  async getTourById(id) {
    try {
      await sql.connect(config);
      
      // Get the tour
      const tourResult = await sql.query`
        SELECT * FROM Tours WHERE id = ${id}
      `;

      if (tourResult.recordset.length === 0) {
        return null;
      }

      const tour = tourResult.recordset[0];

      // Get the itinerary
      const itinerary = await sql.query`
        SELECT day, title, description
        FROM Itinerary
        WHERE tour_id = ${id}
        ORDER BY day
      `;

      // Get highlights
      const highlights = await sql.query`
        SELECT day, highlight
        FROM Highlights
        WHERE tour_id = ${id}
        ORDER BY day
      `;

      // Group highlights by day
      const highlightsByDay = highlights.recordset.reduce((acc, curr) => {
        if (!acc[curr.day]) {
          acc[curr.day] = [];
        }
        acc[curr.day].push(curr.highlight);
        return acc;
      }, {});

      // Combine tour with full itinerary
      return {
        ...tour,
        itinerary: itinerary.recordset.map(day => ({
          ...day,
          highlights: highlightsByDay[day.day] || []
        }))
      };
    } catch (err) {
      console.error('Database error:', err);
      throw new Error('Failed to fetch tour');
    } finally {
      await sql.close();
    }
  }

  // Create a new tour
  async createTour(tourData) {
    try {
      await sql.connect(config);
      
      // Start a transaction
      const transaction = new sql.Transaction();
      await transaction.begin();

      try {
        // Insert tour
        const now = new Date().toISOString();
        const tourResult = await sql.query`
          INSERT INTO Tours (id, title, description, price, duration, destination, created_at, updated_at)
          OUTPUT INSERTED.*
          VALUES (
            ${tourData.id || String(Date.now())},
            ${tourData.title},
            ${tourData.description},
            ${tourData.price},
            ${tourData.duration},
            ${tourData.destination},
            ${now},
            ${now}
          )
        `;

        const newTour = tourResult.recordset[0];

        // Insert itinerary and highlights
        if (tourData.itinerary) {
          for (const day of tourData.itinerary) {
            // Insert itinerary day
            await sql.query`
              INSERT INTO Itinerary (tour_id, day, title, description)
              VALUES (${newTour.id}, ${day.day}, ${day.title}, ${day.description})
            `;

            // Insert highlights
            for (const highlight of day.highlights || []) {
              await sql.query`
                INSERT INTO Highlights (tour_id, day, highlight)
                VALUES (${newTour.id}, ${day.day}, ${highlight})
              `;
            }
          }
        }

        await transaction.commit();
        return await this.getTourById(newTour.id);
      } catch (err) {
        await transaction.rollback();
        throw err;
      }
    } catch (err) {
      console.error('Database error:', err);
      throw new Error('Failed to create tour');
    } finally {
      await sql.close();
    }
  }

  // Update an existing tour
  async updateTour(id, tourData) {
    try {
      await sql.connect(config);
      
      // Start a transaction
      const transaction = new sql.Transaction();
      await transaction.begin();

      try {
        // Update tour
        const now = new Date().toISOString();
        await sql.query`
          UPDATE Tours
          SET title = ${tourData.title},
            description = ${tourData.description},
            price = ${tourData.price},
            duration = ${tourData.duration},
            destination = ${tourData.destination},
            updated_at = ${now}
          WHERE id = ${id}
        `;

        // Update itinerary and highlights
        if (tourData.itinerary) {
          // Delete existing itinerary and highlights
          await sql.query`DELETE FROM Highlights WHERE tour_id = ${id}`;
          await sql.query`DELETE FROM Itinerary WHERE tour_id = ${id}`;

          // Insert new itinerary and highlights
          for (const day of tourData.itinerary) {
            await sql.query`
              INSERT INTO Itinerary (tour_id, day, title, description)
              VALUES (${id}, ${day.day}, ${day.title}, ${day.description})
            `;

            for (const highlight of day.highlights || []) {
              await sql.query`
                INSERT INTO Highlights (tour_id, day, highlight)
                VALUES (${id}, ${day.day}, ${highlight})
              `;
            }
          }
        }

        await transaction.commit();
        return await this.getTourById(id);
      } catch (err) {
        await transaction.rollback();
        throw err;
      }
    } catch (err) {
      console.error('Database error:', err);
      throw new Error('Failed to update tour');
    } finally {
      await sql.close();
    }
  }

  // Delete a tour
  async deleteTour(id) {
    try {
      await sql.connect(config);
      
      // Start a transaction
      const transaction = new sql.Transaction();
      await transaction.begin();

      try {
        // Delete highlights and itinerary first (due to foreign key constraints)
        await sql.query`DELETE FROM Highlights WHERE tour_id = ${id}`;
        await sql.query`DELETE FROM Itinerary WHERE tour_id = ${id}`;
        
        // Delete the tour
        const result = await sql.query`DELETE FROM Tours WHERE id = ${id}`;
        
        await transaction.commit();
        return result.rowsAffected[0] > 0;
      } catch (err) {
        await transaction.rollback();
        throw err;
      }
    } catch (err) {
      console.error('Database error:', err);
      throw new Error('Failed to delete tour');
    } finally {
      await sql.close();
    }
  }
}

// Export the TourService class for use in other modules
module.exports = TourService; 