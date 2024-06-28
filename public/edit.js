// Handling flight edit form submission
document.getElementById('editForm').addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent default form submission
    
    // Get form values
    const flightNumber = document.getElementById('flightNumber').value;
    const origin = document.getElementById('origin').value;
    const destination = document.getElementById('destination').value;
    const arrival = document.getElementById('arrival').value;
    const departure = document.getElementById('departure').value;
    const gate = document.getElementById('gate').value;
    const status = document.getElementById('status').value;

    // Create flight data object
    const flightData = {
        flightNumber,
        origin,
        destination,
        arrival,
        departure,
        gate,
        status
    };

    try {
        // Send PUT request to update flight
        const response = await fetch('/api/flights', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(flightData)
        });

        // Handle response
        if (response.ok) {
            alert('Flight updated successfully');
            window.location.href = '/admin.html'; // Redirect to admin page
        } else {
            console.error('Error updating flight:', response.statusText);
            alert('Error updating flight');
        }
    } catch (error) {
        console.error('Error updating flight:', error);
        alert('Error updating flight');
    }
});

// Fetch flight details by flight number
async function fetchFlightDetails() {
    const flightNumber = document.getElementById('flightNumber').value; // Get flight number
    try {
        const response = await fetch('/api/flights'); // Send GET request to fetch flights
        if (response.ok) {
            const flights = await response.json(); // Parse JSON response
            const flight = flights.find(f => f.Flight_Number === flightNumber); // Find flight by number
            if (flight) {
                // Populate form fields with flight details
                document.getElementById('origin').value = flight.Origin;
                document.getElementById('destination').value = flight.Destination;
                document.getElementById('arrival').value = flight.Arrival;
                document.getElementById('departure').value = flight.Departure;
                document.getElementById('gate').value = flight.Gate;
                document.getElementById('status').value = flight.Status;
            } else {
                alert('Flight not found');
            }
        } else {
            console.error('Error fetching flights:', response.statusText);
            alert('Error fetching flights');
        }
    } catch (error) {
        console.error('Error fetching flights:', error);
        alert('Error fetching flights');
    }
}

// Handling airplane edit form submission
document.getElementById('editAirplaneForm').addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent default form submission
    
    // Get form values
    const airplaneID = document.getElementById('airplaneID').value;
    const flightNumber = document.getElementById('flightNumberAirplane').value; // Updated ID
    const companyName = document.getElementById('companyName').value;
    const type = document.getElementById('type').value;
    const capacity = document.getElementById('capacity').value;

    // Create airplane data object
    const airplaneData = {
        airplaneID, 
        flightNumber, 
        companyName,
        type,
        capacity
    };

    try {
        // Send PUT request to update airplane
        const response = await fetch(`/api/airplanes/${airplaneID}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(airplaneData)
        });

        // Handle response
        if (response.ok) {
            alert('Airplane updated successfully');
            window.location.href = '/admin.html'; // Redirect to admin page
        } else {
            console.error('Error updating airplane:', response.statusText);
            alert('Error updating airplane');
        }
    } catch (error) {
        console.error('Error updating airplane:', error);
        alert('Error updating airplane');
    }
});

// Fetch airplane details by airplane ID
async function fetchAirplaneDetails() {
    const airplaneID = document.getElementById('airplaneID').value; // Get airplane ID
    try {
        const response = await fetch(`/api/airplanes`); // Send GET request to fetch airplanes
        if (response.ok) {
            const airplanes = await response.json(); // Parse JSON response
            const airplane = airplanes.find(f => f.Airplane_ID === airplaneID); // Find airplane by ID
            if (airplane) {
                // Populate form fields with airplane details
                document.getElementById('flightNumberAirplane').value = airplane.Flight_Number; // Update ID
                document.getElementById('companyName').value = airplane.Company_Name;
                document.getElementById('type').value = airplane.Type;
                document.getElementById('capacity').value = airplane.Capacity;
            } else {
                alert('Airplane not found');
            }
        } else {
            console.error('Error fetching airplanes:', response.statusText);
            alert('Error fetching airplanes');
        }
    } catch (error) {
        console.error('Error fetching airplanes:', error);
        alert('Error fetching airplanes');
    }
}

// Function to handle form submission for updating company details
document.getElementById('editCompanyForm').addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent default form submission
    
    // Get form values
    const companyId = document.getElementById('companyId').value;
    const ceo = document.getElementById('ceo').value;
    const airplanesCount = document.getElementById('airplanesCount').value;
    const employeeCount = document.getElementById('employeeCount').value;

    // Create company data object
    const companyData = {
        ceo,
        airplanesCount,
        employeeCount
    };

    try {
        // Send PUT request to update company
        const response = await fetch(`/api/companies/${companyId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(companyData)
        });

        // Handle response
        if (response.ok) {
            alert('Company updated successfully');
            window.location.href = '/admin.html'; // Redirect to admin page
        } else {
            console.error('Error updating company:', response.statusText);
            alert('Error updating company');
        }
    } catch (error) {
        console.error('Error updating company:', error);
        alert('Error updating company');
    }
});

// Fetch company details by company ID
async function fetchCompanyDetails() {
    const companyId = document.getElementById('companyId').value; // Get company ID
    try {
        const response = await fetch(`/api/companies`); // Send GET request to fetch companies
        if (response.ok) {
            const companies = await response.json(); // Parse JSON response
            const company = companies.find(f => f.Company_ID === companyId); // Find company by ID
            if (company) {        
                // Populate form fields with company details
                document.getElementById('ceo').value = company.CEO;
                document.getElementById('airplanesCount').value = company.Airplanes_Count;
                document.getElementById('employeeCount').value = company.Employee_Count;
            } else {
                alert('Company not found');
            }
        } else {
            console.error('Error fetching companies:', response.statusText);
            alert('Error fetching companies');
        }
    } catch (error) {
        console.error('Error fetching companies:', error);
        alert('Error fetching companies');
    }
}
