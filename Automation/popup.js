document.addEventListener('DOMContentLoaded', function() {
    const dropdownToggle = document.getElementById('dropdown-toggle');
    const submitButton = document.getElementById('submit-button');

    document.querySelectorAll('.dropdown-item').forEach(item => {
        item.addEventListener('click', function() {
            const selectedText = this.textContent.trim();
            dropdownToggle.querySelector('span').textContent = selectedText;
            submitButton.click();
        });
    });

    submitButton.addEventListener('click', function() {
        const selectedValue = dropdownToggle.querySelector('span').textContent.trim();

        if (selectedValue === 'eSANCHIT UPLOAD FILE') {
            chrome.runtime.sendMessage({ action: 'uploadFile' });
        } else if (selectedValue === 'SHIPPING BILL') {
            openShippingBillTable();
        } else if (selectedValue === 'eSANCHIT NOTIFICATION') {
            chrome.runtime.sendMessage({ action: 'notificaton' });
        }
    });
});

function openShippingBillTable() {
    fetch('http://127.0.0.1:9605/api/shipping-bills')
        .then(response => response.json())
        .then(data => {
            const buttons = document.querySelectorAll('.btn-group');
            buttons.forEach(button => {
                button.style.width = '500px';
            });
            const tableContainer = document.getElementById('table-container');
            let tableHTML = `
                <input type="text" id="search-bar" placeholder="Search...">
                <table class="table-container">
                    <thead>
                        <tr>
            `;

            const headerMappings = {
                'id': 'ID',
                'location': 'LOCATION',
                'sbDate': 'SB DATE',
                'sbNumber': 'SB NUMBER',
            };

            let sortOrder = 'asc'; 
            let currentKey = 'id'; 

            const renderRows = (sortedData) => {
                let rowsHTML = '';
                sortedData.forEach(row => {
                    rowsHTML += '<tr class="clickable-row">';
                    Object.values(row).forEach(value => {
                        rowsHTML += `<td>${value}</td>`;
                    });
                    rowsHTML += '</tr>';
                });
                return rowsHTML;
            };

            if (data.length > 0) {
                Object.keys(data[0]).forEach(key => {
                    const displayName = headerMappings[key] || key;
                    tableHTML += `
                        <th data-key="${key}" class="${key === 'id' ? 'sortable' : ''}">
                            ${displayName}${key === 'id' ? ' <i class="fas fa-sort sort-arrow"></i>' : ''}
                        </th>
                    `;
                });
                tableHTML += '</tr></thead><tbody>';

                tableHTML += renderRows(data);

                tableHTML += '</tbody></table>';
            } else {
                tableHTML = '<p>No data available.</p>';
            }

            tableContainer.innerHTML = `<div class="table-container-wrapper">${tableHTML}</div>`;
            
            const sortArrow = document.querySelector('.sort-arrow');

            document.querySelectorAll('.sortable').forEach(header => {
                header.addEventListener('click', function () {
                    const key = this.getAttribute('data-key');
                    if (currentKey === key) {
                        sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
                    } else {
                        currentKey = key;
                        sortOrder = 'asc';
                    }

                    const sortedData = [...data].sort((a, b) => {
                        if (a[currentKey] > b[currentKey]) return sortOrder === 'asc' ? 1 : -1;
                        if (a[currentKey] < b[currentKey]) return sortOrder === 'asc' ? -1 : 1;
                        return 0;
                    });

                    const tbody = document.querySelector('tbody');
                    tbody.innerHTML = renderRows(sortedData);

                    sortArrow.className = sortOrder === 'asc' ? 'fas fa-sort-asc sort-arrow' : 'fas fa-sort-desc sort-arrow';
                });
            });

            document.querySelector('#table-container').addEventListener('click', function(event) {
                const row = event.target.closest('.clickable-row');
                if (row) {
                    const rowData = Array.from(row.children).map(cell => cell.textContent.trim());
            
                    chrome.runtime.sendMessage({
                        action: 'shippingBillSubmit',
                        data: rowData
                    });
                }
            });

            const searchInput = document.getElementById('search-bar');
            searchInput.focus();
            searchInput.addEventListener('input', function() {
                const query = this.value.toLowerCase();
                const rows = document.querySelectorAll('tbody tr');
                
                rows.forEach(row => {
                    const cells = row.querySelectorAll('td');
                    const matches = Array.from(cells).some(cell => cell.textContent.toLowerCase().includes(query));
                    row.style.display = matches ? '' : 'none';
                });
            });
        })
        .catch(error => {
            alert('Error fetching shipping bills:', error);
        });
}
