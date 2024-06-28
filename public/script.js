// Add event listener to DOMContentLoaded event to ensure the DOM is fully loaded before executing the code
document.addEventListener("DOMContentLoaded", function() {
    // Fetch initial data when the page loads
    fetchFlights();
    fetchAirplanes();
    fetchCompanies();

    // Event listener for the "Add Flight" form submission
    document.getElementById('add-flight-form').addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent default form submission

        // Create a FormData object from the form
        const formData = new FormData(this);
        const flightData = {};
        formData.forEach((value, key) => {
            flightData[key] = value; // Convert FormData to a plain object
        });

        // Send POST request to add a new flight
        fetch('/api/flights', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(flightData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to add flight');
            }
            fetchFlights(); // Refresh flights table after adding a new flight
            this.reset(); // Reset the form after successful submission
        })
        .catch(error => console.error('Error adding flight:', error));
    });

    // Event listener for the "Add Airplane" form submission
    document.getElementById('add-airplane-form').addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent default form submission

        // Create a FormData object from the form
        const formData = new FormData(this);
        const airplaneData = {};
        formData.forEach((value, key) => {
            airplaneData[key] = value; // Convert FormData to a plain object
        });

        // Send POST request to add a new airplane
        fetch('/api/airplanes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(airplaneData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to add airplane');
            }
            fetchAirplanes(); // Refresh airplanes table after adding a new airplane
            this.reset(); // Reset the form after successful submission
        })
        .catch(error => console.error('Error adding airplane:', error));
    });

    // Event listener for the "Add Company" form submission
    document.getElementById('add-company-form').addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent default form submission

        // Create a FormData object from the form
        const formData = new FormData(this);
        const companyData = {};
        formData.forEach((value, key) => {
            companyData[key] = value; // Convert FormData to a plain object
        });

        // Send POST request to add a new company
        fetch('/api/companies', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(companyData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to add company');
            }
            fetchCompanies(); // Refresh companies table after adding a new company
            this.reset(); // Reset the form after successful submission
        })
        .catch(error => console.error('Error adding company:', error));
    });

    // Event delegation for delete buttons
    document.body.addEventListener('click', function(event) {
        if (event.target.matches('.delete-flight-btn')) {
            const flightNumber = event.target.dataset.flightNumber;
            if (confirm(`Are you sure you want to delete flight ${flightNumber}?`)) {
                deleteFlight(flightNumber); // Delete flight if confirmed
            }
        } else if (event.target.matches('.delete-airplane-btn')) {
            const airplaneID = event.target.dataset.airplaneId;
            if (confirm(`Are you sure you want to delete airplane ${airplaneID}?`)) {
                deleteAirplane(airplaneID); // Delete airplane if confirmed
            }
        } else if (event.target.matches('.delete-company-btn')) {
            const companyID = event.target.dataset.companyId;
            if (confirm(`Are you sure you want to delete company ${companyID}?`)) {
                deleteCompany(companyID); // Delete company if confirmed
            }
        }
    });
});

// Function to fetch flights data
function fetchFlights() {
    fetch('/api/flights')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json(); // Parse JSON response
        })
        .then(data => {
            const flightsTable = document.getElementById('flights-body');
            flightsTable.innerHTML = ''; // Clear existing data
            data.forEach(flight => {
                const row = createFlightRow(flight); // Create a new row for each flight
                flightsTable.appendChild(row);
            });
        })
        .catch(error => console.error('Error fetching flights:', error));
}

// Function to create a row for flight table
function createFlightRow(flight) {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${flight.Flight_Number}</td>
        <td>${flight.Origin}</td>
        <td>${flight.Destination}</td>
        <td>${flight.Arrival}</td>
        <td>${flight.Departure}</td>
        <td>${flight.Gate}</td>
        <td>${flight.Status}</td>
        <td><button class="delete-flight-btn" data-flight-number="${flight.Flight_Number}">Delete</button></td>
    `;
    return row; // Return the created row
}

// Function to delete a flight
function deleteFlight(flightNumber) {
    fetch(`/api/flights/${flightNumber}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to delete flight');
        }
        fetchFlights(); // Refresh flights table after deletion
    })
    .catch(error => console.error('Error deleting flight:', error));
}

// Function to fetch airplanes data
function fetchAirplanes() {
    fetch('/api/airplanes')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json(); // Parse JSON response
        })
        .then(data => {
            const airplanesTable = document.getElementById('airplanes-body');
            airplanesTable.innerHTML = ''; // Clear existing data
            data.forEach(airplane => {
                const row = createAirplaneRow(airplane); // Create a new row for each airplane
                airplanesTable.appendChild(row);
            });
        })
        .catch(error => console.error('Error fetching airplanes:', error));
}

// Function to create a row for airplane table
function createAirplaneRow(airplane) {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${airplane.Airplane_ID}</td>
        <td>${airplane.Flight_Number}</td>
        <td>${airplane.Company_Name}</td>
        <td>${airplane.Type}</td>
        <td>${airplane.Capacity}</td>
        <td><button class="delete-airplane-btn" data-airplane-id="${airplane.Airplane_ID}">Delete</button></td>
    `;
    return row; // Return the created row
}

// Function to delete an airplane
function deleteAirplane(airplaneID) {
    fetch(`/api/airplanes/${airplaneID}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to delete airplane');
        }
        fetchAirplanes(); // Refresh airplanes table after deletion
    })
    .catch(error => console.error('Error deleting airplane:', error));
}

// Function to fetch companies data
function fetchCompanies() {
    fetch('/api/companies')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json(); // Parse JSON response
        })
        .then(data => {
            const companiesTable = document.getElementById('companies-body');
            companiesTable.innerHTML = ''; // Clear existing data
            data.forEach(company => {
                const row = createCompanyRow(company); // Create a new row for each company
                companiesTable.appendChild(row);
            });
        })
        .catch(error => console.error('Error fetching companies:', error));
}

// Function to create a row for company table
function createCompanyRow(company) {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${company.Company_ID}</td>
        <td>${company.Company_Name}</td>
        <td>${company.CEO}</td>
        <td>${company.Airplanes_Count}</td>
        <td>${company.Employee_Count}</td>
        <td><button class="delete-company-btn" data-company-id="${company.Company_ID}">Delete</button></td>
    `;
    return row; // Return the created row
}

// Function to delete a company
function deleteCompany(companyID) {
    fetch(`/api/companies/${companyID}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to delete company');
        }
        fetchCompanies(); // Refresh companies table after deletion
    })
    .catch(error => console.error('Error deleting company:', error));
}
