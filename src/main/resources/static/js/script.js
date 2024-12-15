let currentPage = 0;
let totalPages = 1;
let selectedCarId = null;

// Initialization
document.addEventListener('DOMContentLoaded', function() {
    loadCars();
    setupEventHandlers();
});

function setupEventHandlers() {
    // Add car button
    document.getElementById('addBtn').onclick = () => {
        resetCarForm();
        openCarDialog();
    };

    // Sort select
    document.getElementById('sortSelect').onchange = () => {
        currentPage = 0;
        loadCars();
    };

    // Filter buttons
    document.getElementById('applyFiltersBtn').onclick = () => {
        currentPage = 0;
        loadCars();
    };

    document.getElementById('clearFiltersBtn').onclick = () => {
        document.getElementById('vinFilter').value = '';
        document.getElementById('brandFilter').value = '';
        document.getElementById('modelFilter').value = '';
        currentPage = 0;
        loadCars();
    };

    // Navigation buttons
    document.getElementById('prevBtn').onclick = () => {
        if (currentPage > 0) {
            currentPage--;
            loadCars();
        }
    };

    document.getElementById('nextBtn').onclick = () => {
        if (currentPage < totalPages - 1) {
            currentPage++;
            loadCars();
        }
    };

    // Car form
    document.getElementById('carForm').onsubmit = async function(e) {
        e.preventDefault();
        if (!validateCarForm()) {
            return;
        }

        const carData = {
            vin: document.getElementById('vin').value.toUpperCase(),
            brand: document.getElementById('brand').value,
            model: document.getElementById('model').value,
            year: parseInt(document.getElementById('year').value),
            price: parseFloat(document.getElementById('price').value),
            type: document.getElementById('type').value
        };

        try {
            if (selectedCarId) {
                await updateCar(selectedCarId, carData);
                showMessage('Car updated successfully');
            } else {
                await createCar(carData);
                showMessage('Car added successfully');
            }
            closeCarDialog();
            loadCars();
        } catch (error) {
            showError('Error saving car: ' + error.message);
        }
    };

    // Cancel button
    document.getElementById('cancelBtn').onclick = closeCarDialog;

    // Close modal on Escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeCarDialog();
            closeDetailsDialog();
        }
    });
}

async function loadCars() {
    try {
        const params = new URLSearchParams({
            page: currentPage,
            size: 10,
            sort: document.getElementById('sortSelect').value
        });

        // Add filters
        const vinFilter = document.getElementById('vinFilter').value;
        const brandFilter = document.getElementById('brandFilter').value;
        const modelFilter = document.getElementById('modelFilter').value;

        if (vinFilter) params.append('vin', vinFilter);
        if (brandFilter) params.append('brand', brandFilter);
        if (modelFilter) params.append('model', modelFilter);

        const response = await fetch(`/api/cars?${params}`);
        const data = await response.json();

        if (response.ok) {
            updateTable(data.content);
            totalPages = data.totalPages;
            updatePagination();
        } else {
            showError(data.message);
        }
    } catch (error) {
        showError('Error loading cars: ' + error.message);
    }
}

function updateTable(cars) {
    const tbody = document.querySelector('#carTable tbody');
    tbody.innerHTML = '';

    cars.forEach((car, index) => {
        const row = document.createElement('tr');
        row.ondblclick = () => showCarDetails(car.id);

        const numberCell = document.createElement('td');
        numberCell.textContent = (currentPage * 10 + index + 1).toString();
        numberCell.className = 'row-number';
        row.appendChild(numberCell);

        ['vin', 'brand', 'model'].forEach(field => {
            const cell = document.createElement('td');
            cell.textContent = car[field];
            row.appendChild(cell);
        });

        // Actions cell
        const actionsCell = document.createElement('td');

        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.onclick = () => editCar(car.id);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.style.backgroundColor = '#f44336';
        deleteButton.onclick = () => deleteCar(car.id);

        actionsCell.appendChild(editButton);
        actionsCell.appendChild(deleteButton);
        row.appendChild(actionsCell);

        tbody.appendChild(row);
    });
}

function updatePagination() {
    document.getElementById('pageInfo').textContent = `Page: ${currentPage + 1}/${totalPages}`;
    document.getElementById('prevBtn').disabled = currentPage <= 0;
    document.getElementById('nextBtn').disabled = currentPage >= totalPages - 1;
}

async function showCarDetails(carId) {
    try {
        const response = await fetch(`/api/cars/${carId}`);
        const car = await response.json();

        if (response.ok) {
            const details = document.getElementById('carDetails');
            details.innerHTML = `
                <table class="details-table">
                    <tr>
                        <td class="label-cell">ID:</td>
                        <td class="value-cell">${car.id}</td>
                    </tr>
                    <tr>
                        <td class="label-cell">VIN:</td>
                        <td class="value-cell">${car.vin}</td>
                    </tr>
                    <tr>
                        <td class="label-cell">Brand:</td>
                        <td class="value-cell">${car.brand}</td>
                    </tr>
                    <tr>
                        <td class="label-cell">Model:</td>
                        <td class="value-cell">${car.model}</td>
                    </tr>
                    <tr>
                        <td class="label-cell">Year:</td>
                        <td class="value-cell">${car.year}</td>
                    </tr>
                    <tr>
                        <td class="label-cell">Price:</td>
                        <td class="value-cell">$${car.price.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td class="label-cell">Type:</td>
                        <td class="value-cell">${car.type}</td>
                    </tr>
                </table>
            `;
            openDetailsDialog();
        } else {
            showError(car.message);
        }
    } catch (error) {
        showError('Error loading car details: ' + error.message);
    }
}

async function editCar(carId) {
    try {
        const response = await fetch(`/api/cars/${carId}`);
        const car = await response.json();

        if (response.ok) {
            selectedCarId = car.id;
            document.getElementById('vin').value = car.vin;
            document.getElementById('brand').value = car.brand;
            document.getElementById('model').value = car.model;
            document.getElementById('year').value = car.year;
            document.getElementById('price').value = car.price;
            document.getElementById('type').value = car.type;

            document.getElementById('dialogTitle').textContent = 'Edit Car';
            openCarDialog();
        } else {
            showError(car.message);
        }
    } catch (error) {
        showError('Error loading car details: ' + error.message);
    }
}

async function createCar(carData) {
    const response = await fetch('/api/cars', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(carData)
    });

    if (!response.ok) {
        const data = await response.json();
        throw new Error(Object.values(data).join(', '));
    }
}

async function updateCar(id, carData) {
    const response = await fetch(`/api/cars/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(carData)
    });

    if (!response.ok) {
        const data = await response.json();
        throw new Error(Object.values(data).join(', '));
    }
}

async function deleteCar(carId) {
    if (!confirm('Are you sure you want to delete this car?')) {
        return;
    }

    try {
        const response = await fetch(`/api/cars/${carId}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            showMessage('Car deleted successfully');
            loadCars();
        } else {
            const data = await response.json();
            showError(data.message);
        }
    } catch (error) {
        showError('Error deleting car: ' + error.message);
    }
}

function validateCarForm() {
    clearValidationErrors();
    let isValid = true;

    // VIN validation
    const vin = document.getElementById('vin').value;
    if (!/^[A-Z0-9]{17}$/.test(vin.toUpperCase())) {
        showValidationError('vin', 'VIN must be exactly 17 characters (letters and numbers)');
        isValid = false;
    }

    // Year validation
    const year = parseInt(document.getElementById('year').value);
    const currentYear = new Date().getFullYear();
    if (isNaN(year) || year < 1886 || year > currentYear) {
        showValidationError('year', `Year must be between 1886 and ${currentYear}`);
        isValid = false;
    }

    // Price validation
    const price = parseFloat(document.getElementById('price').value);
    if (isNaN(price) || price <= 0) {
        showValidationError('price', 'Price must be greater than 0');
        isValid = false;
    }

    return isValid;
}

function showValidationError(inputId, message) {
    const input = document.getElementById(inputId);
    input.classList.add('validation-error');

    const errorMessage = document.createElement('div');
    errorMessage.className = 'error-message';
    errorMessage.textContent = message;

    input.parentElement.appendChild(errorMessage);
}

function clearValidationErrors() {
    const inputs = document.querySelectorAll('#carForm input');
    inputs.forEach(input => {
        input.classList.remove('validation-error');
        const errorMessage = input.parentElement.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.remove();
        }
    });
}

function resetCarForm() {
    selectedCarId = null;
    document.getElementById('carForm').reset();
    document.getElementById('dialogTitle').textContent = 'Add New Car';
    clearValidationErrors();
}

function openCarDialog() {
    document.getElementById('carDialog').style.display = 'block';
}

function closeCarDialog() {
    document.getElementById('carDialog').style.display = 'none';
}

function openDetailsDialog() {
    document.getElementById('carDetailsDialog').style.display = 'block';
}

function closeDetailsDialog() {
    document.getElementById('carDetailsDialog').style.display = 'none';
}

function showMessage(message) {
    alert('Success: ' + message);
}

function showError(message) {
    alert('Error: ' + message);
}