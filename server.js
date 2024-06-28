const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const odbc = require('odbc');

const port = 3000;
const connectionString = 'Driver={Microsoft Access Driver (*.mdb, *.accdb)};Dbq=C:\\Users\\alisk\\Desktop\\Project\\AirportDB.accdb;';

// Create an HTTP server
const server = http.createServer(async (req, res) => {
    const reqUrl = url.parse(req.url, true);
    const pathname = reqUrl.pathname;

    // Serve static files
    if (pathname === '/' || pathname === '/main.html') {
        serveStaticFile(res, 'main.html');
    } else if (pathname === '/admin.html') {
        serveStaticFile(res, 'admin.html');
    } else if (pathname === '/edit.html') {
        serveStaticFile(res, 'edit.html');
    } else if (pathname === '/styles.css') {
        serveStaticFile(res, 'styles.css', 'text/css');
    } else if (pathname === '/script.js') {
        serveStaticFile(res, 'script.js', 'text/javascript');
    } else if (pathname === '/edit.js') {
        serveStaticFile(res, 'edit.js', 'text/javascript');
    } 
    // Handle admin login
    else if (pathname === '/admin' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', async () => {
            const formData = new URLSearchParams(body);
            const password = formData.get('password');
            if (password === 'ABCD') {
                res.writeHead(302, { 'Location': '/admin.html' });
                res.end();
            } else {
                res.writeHead(302, { 'Location': '/main.html?error=unauthorized' });
                res.end();
            }
        });
    } 
    // Handle API requests for flights
    else if (pathname === '/api/flights' && req.method === 'GET') {
        try {
            const flights = await getFlights();
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(flights));
        } catch (error) {
            console.error('Error fetching flights:', error);
            res.writeHead(500);
            res.end('Internal Server Error');
        }
    } else if (pathname === '/api/flights' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', async () => {
            const flightData = JSON.parse(body);
            try {
                await addFlight(flightData);
                res.writeHead(200);
                res.end('Flight added successfully');
            } catch (error) {
                console.error('Error adding flight:', error);
                res.writeHead(500);
                res.end('Internal Server Error');
            }
        });
    } else if (pathname === '/api/flights' && req.method === 'PUT') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', async () => {
            const flightData = JSON.parse(body);
            try {
                await updateFlight(flightData);
                res.writeHead(200);
                res.end('Flight updated successfully');
            } catch (error) {
                console.error('Error updating flight:', error);
                res.writeHead(500);
                res.end('Internal Server Error');
            }
        });
    } 
    // Handle API requests for airplanes
    else if (pathname.startsWith('/api/airplanes/') && req.method === 'PUT') {
        const airplaneId = pathname.split('/')[3];
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', async () => {
            const airplaneData = JSON.parse(body);
            try {
                airplaneData.airplaneID = airplaneId; // Ensure the airplane ID is set from URL
                await updateAirplane(airplaneData);
                res.writeHead(200);
                res.end(`Airplane ${airplaneId} updated successfully`);
            } catch (error) {
                console.error(`Error updating airplane ${airplaneId}:`, error);
                res.writeHead(500);
                res.end('Internal Server Error');
            }
        });
    } 
    // Handle API requests for companies
    else if (pathname.startsWith('/api/companies/') && req.method === 'PUT') {
        const companyId = pathname.split('/')[3];
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', async () => {
            const companyData = JSON.parse(body);
            try {
                companyData.companyId = companyId; // Ensure the company ID is set from URL
                await updateCompany(companyData);
                res.writeHead(200);
                res.end(`Company ${companyId} updated successfully`);
            } catch (error) {
                console.error(`Error updating company ${companyId}:`, error);
                res.writeHead(500);
                res.end('Internal Server Error');
            }
        });
    } else if (pathname === '/api/airplanes' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', async () => {
            const airplaneData = JSON.parse(body);
            try {
                await addAirplane(airplaneData);
                res.writeHead(200);
                res.end('Airplane added successfully');
            } catch (error) {
                console.error('Error adding airplane:', error);
                res.writeHead(500);
                res.end('Internal Server Error');
            }
        });
    } else if (pathname === '/api/companies' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', async () => {
            const companyData = JSON.parse(body);
            try {
                await addCompany(companyData);
                res.writeHead(200);
                res.end('Company added successfully');
            } catch (error) {
                console.error('Error adding company:', error);
                res.writeHead(500);
                res.end('Internal Server Error');
            }
        });
    } else if (pathname === '/api/airplanes' && req.method === 'GET') {
        try {
            const airplanes = await getAirplanes();
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(airplanes));
        } catch (error) {
            console.error('Error fetching airplanes:', error);
            res.writeHead(500);
            res.end('Internal Server Error');
        }
    } else if (pathname === '/api/companies' && req.method === 'GET') {
        try {
            const companies = await getCompanies();
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(companies));
        } catch (error) {
            console.error('Error fetching companies:', error);
            res.writeHead(500);
            res.end('Internal Server Error');
        }
    } 
    // Handle DELETE requests for flights
    else if (pathname.startsWith('/api/flights/') && req.method === 'DELETE') {
        const flightNumber = pathname.split('/')[3];
        try {
            await deleteFlight(flightNumber);
            res.writeHead(200);
            res.end(`Flight ${flightNumber} deleted successfully`);
        } catch (error) {
            console.error('Error deleting flight:', error);
            res.writeHead(500);
            res.end('Internal Server Error');
        }
    } 
    // Handle DELETE requests for airplanes
    else if (pathname.startsWith('/api/airplanes/') && req.method === 'DELETE') {
        const airplaneId = pathname.split('/')[3];
        try {
            await deleteAirplane(airplaneId);
            res.writeHead(200);
            res.end('Airplane deleted successfully');
        } catch (error) {
            console.error('Error deleting airplane:', error);
            res.writeHead(500);
            res.end('Internal Server Error');
        }
    } 
    // Handle DELETE requests for companies
    else if (pathname.startsWith('/api/companies/') && req.method === 'DELETE') {
        const companyId = pathname.split('/')[3];
        try {
            await deleteCompany(companyId);
            res.writeHead(200);
            res.end('Company deleted successfully');
        } catch (error) {
            console.error('Error deleting company:', error);
            res.writeHead(500);
            res.end('Internal Server Error');
        }
    } else {
        res.writeHead(404);
        res.end('Not Found');
    }
});

// Function to serve static files
function serveStaticFile(res, fileName, contentType = 'text/html') {
    const filePath = path.join(__dirname, 'public', fileName);
    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(500);
            res.end(`Error loading ${fileName}`);
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(data);
        }
    });
}

// Function to fetch flights data from the database
async function getFlights() {
    const connection = await odbc.connect(connectionString);
    const result = await connection.query('SELECT * FROM Flight');
    await connection.close();
    return result;
}

// Function to add a new flight to the database
async function addFlight(flightData) {
    const connection = await odbc.connect(connectionString);
    const query = `
        INSERT INTO Flight (Flight_Number, Origin, Destination, Arrival, Departure, Gate, Status)
        VALUES (
            '${flightData.flightNumber || ''}', 
            '${flightData.origin || ''}', 
            '${flightData.destination || ''}', 
            '${flightData.arrival || ''}', 
            '${flightData.departure || ''}', 
            '${flightData.gate || ''}', 
            '${flightData.status || ''}'
        )
    `;
    const result = await connection.query(query);
    await connection.close();
    return result;
}

// Function to fetch airplanes data from the database
async function getAirplanes() {
    const connection = await odbc.connect(connectionString);
    const result = await connection.query('SELECT * FROM Airplane');
    await connection.close();
    return result;
}

// Function to add a new airplane to the database
async function addAirplane(airplaneData) {
    const connection = await odbc.connect(connectionString);
    const query = `
        INSERT INTO Airplane (Airplane_ID, Flight_Number, Company_Name, Type, Capacity)
        VALUES (
            '${airplaneData.airplaneID || ''}', 
            '${airplaneData.flightNumber || ''}', 
            '${airplaneData.companyName || ''}', 
            '${airplaneData.type || ''}', 
            '${airplaneData.capacity || ''}'
        )
    `;
    const result = await connection.query(query);
    await connection.close();
    return result;
}

// Function to fetch companies data from the database
async function getCompanies() {
    const connection = await odbc.connect(connectionString);
    const result = await connection.query('SELECT * FROM Company');
    await connection.close();
    return result;
}

// Function to add a new company to the database
async function addCompany(companyData) {
    const connection = await odbc.connect(connectionString);
    const query = `
        INSERT INTO Company (Company_ID, Company_Name, CEO, Airplanes_Count, Employee_Count)
        VALUES (
            '${companyData.companyId || ''}',
            '${companyData.companyName || ''}', 
            '${companyData.ceo || ''}', 
            '${companyData.airplanesCount || ''}', 
            '${companyData.employeeCount || ''}'
        )
    `;
    const result = await connection.query(query);
    await connection.close();
    return result;
}

// Function to update flight data in the database
async function updateFlight(flightData) {
    const connection = await odbc.connect(connectionString);
    const query = `
        UPDATE Flight
        SET 
            Origin = '${flightData.origin || ''}',
            Destination = '${flightData.destination || ''}',
            Arrival = '${flightData.arrival || ''}',
            Departure = '${flightData.departure || ''}',
            Gate = '${flightData.gate || ''}',
            Status = '${flightData.status || ''}'
        WHERE Flight_Number = '${flightData.flightNumber}'
    `;
    const result = await connection.query(query);
    await connection.close();
    return result;
}

// Function to update airplane data in the database
async function updateAirplane(airplaneData) {
    const connection = await odbc.connect(connectionString);
    const query = `
        UPDATE Airplane
        SET 
            Flight_Number = '${airplaneData.flightNumber || ''}',
            Company_Name = '${airplaneData.companyName || ''}',
            Type = '${airplaneData.type || ''}',
            Capacity = '${airplaneData.capacity || ''}'
        WHERE Airplane_ID = '${airplaneData.airplaneID}'
    `;
    const result = await connection.query(query);
    await connection.close();
    return result;
}

// Function to update company data in the database
async function updateCompany(companyData) {
    const connection = await odbc.connect(connectionString);
    const query = `
        UPDATE Company
        SET  
            CEO = '${companyData.ceo || ''}',
            Airplanes_Count = '${companyData.airplanesCount || ''}',
            Employee_Count = '${companyData.employeeCount || ''}'
        WHERE Company_ID = '${companyData.companyId}'
    `;
    const result = await connection.query(query);
    await connection.close();
    return result;
}

// Function to delete a flight from the database
async function deleteFlight(flightNumber) {
    const connection = await odbc.connect(connectionString);
    const query = `DELETE FROM Flight WHERE Flight_Number = '${flightNumber}'`;
    const result = await connection.query(query);
    await connection.close();
    return result;
}

// Function to delete an airplane from the database
async function deleteAirplane(airplaneId) {
    const connection = await odbc.connect(connectionString);
    const query = `DELETE FROM Airplane WHERE Airplane_ID = '${airplaneId}'`;
    const result = await connection.query(query);
    await connection.close();
    return result;
}

// Function to delete a company from the database
async function deleteCompany(companyId) {
    const connection = await odbc.connect(connectionString);
    const query = `DELETE FROM Company WHERE Company_ID = '${companyId}'`;
    const result = await connection.query(query);
    await connection.close();
    return result;
}

// Start the server
server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
