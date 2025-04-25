const sql = require('mssql');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();

// SQL Server configuration
const config = {
    user: process.env.DB_USER,  // Using tour_admin account
    password: process.env.DB_PASSWORD,  // Use the password set in .env
    server: 'LAPTOP-M2SB9VN2',
    database: 'TourManagement',
    options: {
        encrypt: false,
        trustServerCertificate: true,
        enableArithAbort: true
    }
};

async function migrateData() {
    try {
        // Log the connection config (excluding password)
        console.log('Attempting to connect with config:', {
            user: config.user,
            server: config.server,
            database: config.database,
            options: config.options
        });

        // Connect to SQL Server
        await sql.connect(config);
        console.log('Connected to SQL Server');

        // Clear existing data
        console.log('Clearing existing data...');
        await sql.query`DELETE FROM Highlights`;
        await sql.query`DELETE FROM Itinerary`;
        await sql.query`DELETE FROM Tours`;
        console.log('Existing data cleared');

        // Read and parse the JSON file
        const jsonPath = path.join(__dirname, '../data/db.json');
        const jsonData = await fs.readFile(jsonPath, 'utf8');
        const { tours } = JSON.parse(jsonData);

        // Insert data into SQL Server
        for (const tour of tours) {
            // Insert into Tours table
            const tourResult = await sql.query`
                INSERT INTO Tours (id, title, description, price, duration, destination, created_at, updated_at)
                VALUES (${tour.id}, ${tour.title}, ${tour.description}, ${tour.price}, ${tour.duration}, ${tour.destination}, ${tour.created_at}, ${tour.updated_at})
            `;
            console.log(`Inserted tour: ${tour.title}`);

            // Insert into Itinerary table
            for (const day of tour.itinerary) {
                await sql.query`
                    INSERT INTO Itinerary (tour_id, day, title, description)
                    VALUES (${tour.id}, ${day.day}, ${day.title}, ${day.description})
                `;

                // Insert highlights for this day
                for (const highlight of day.highlights) {
                    await sql.query`
                        INSERT INTO Highlights (tour_id, day, highlight)
                        VALUES (${tour.id}, ${day.day}, ${highlight})
                    `;
                }
            }
        }

        console.log('Migration completed successfully!');
    } catch (err) {
        console.error('Error during migration:', err);
        if (err.originalError) {
            console.error('Original SQL Error:', {
                message: err.originalError.message,
                code: err.originalError.code,
                state: err.originalError.state
            });
        }
    } finally {
        // Close the SQL Server connection
        await sql.close();
        console.log('SQL Server connection closed');
    }
}

// Run the migration
migrateData(); 