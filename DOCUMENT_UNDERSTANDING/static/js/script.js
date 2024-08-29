$(document).ready(function() {
    bsCustomFileInput.init();
    var spiner = document.getElementById('spin');
    var spiner2 = document.getElementById('spin2');
    var dropArea = document.getElementById('dropArea');
    var fileInput = document.getElementById('pdfFile');
    var uploadForm = $('#uploadForm');

    // Function to handle file selection and upload
    function handleFileUpload(file) {
        var formData = new FormData();
        formData.append('pdfFile', file);

        spiner.style.display = 'flex';
        $.ajax({
            url: '/pdfprocess',
            type: 'POST',
            data: formData,
            contentType: false,
            processData: false,
            success: function(response) {
                spiner.style.display = 'none';
                $('#result').html('<div class="alert alert-success">File uploaded successfully!</div>');
                if (response.images && response.images.length > 0) {
                    var imagesHtml = '';
                    response.images.forEach(function(imageUrl, index) {
                        imagesHtml += `
                            <div class="col-md-4">
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" value="${imageUrl}" id="imageCheck${index}">
                                    <label class="form-check-label" for="imageCheck${index}" style="cursor: pointer;">
                                        <img src="/static/images_converted_by_screen/${imageUrl}" class="img-fluid" />
                                    </label>
                                </div>
                            </div>`;
                    });
                    $('#imagesContainer').html(imagesHtml);
                    $('#selectForm').show();
                }
            },
            error: function() {
                $('#result').html('<div class="alert alert-danger">Failed to upload file.</div>');
                spiner.style.display = 'none';
            }
        });
    }

    // Update drop area with file name and PDF icon
    function updateDropArea(fileName) {
        dropArea.innerHTML = `
            <i class="fa fa-file-pdf" aria-hidden="true"></i><p>${fileName}</p>
        `;
        dropArea.classList.add('bg-light');
    }

    // Handle file input change event
    fileInput.addEventListener('change', function(e) {
        var file = e.target.files[0];
        if (file) {
            updateDropArea(file.name);
            handleFileUpload(file);
        }
    });

    // Handle drag and drop events
    dropArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        e.stopPropagation();
        dropArea.classList.add('bg-light');
    });

    dropArea.addEventListener('dragleave', function(e) {
        e.preventDefault();
        e.stopPropagation();
        dropArea.classList.remove('bg-light');
    });

    dropArea.addEventListener('drop', function(e) {
        e.preventDefault();
        e.stopPropagation();
        dropArea.classList.remove('bg-light');

        var file = e.dataTransfer.files[0];
        if (file) {
            updateDropArea(file.name);
            handleFileUpload(file);
        }
    });

    // Handle form submission
    uploadForm.on('submit', function(e) {
        e.preventDefault();
        var formData = new FormData(this);

        spiner.style.display = 'flex';
        $.ajax({
            url: '/pdfprocess',
            type: 'POST',
            data: formData,
            contentType: false,
            processData: false,
            success: function(response) {
                spiner.style.display = 'none';
                $('#result').html('<div class="alert alert-success">File uploaded successfully!</div>');
                if (response.images && response.images.length > 0) {
                    var imagesHtml = '';
                    response.images.forEach(function(imageUrl, index) {
                        imagesHtml += `
                            <div class="col-md-4">
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" value="${imageUrl}" id="imageCheck${index}">
                                    <label class="form-check-label" for="imageCheck${index}" style="cursor: pointer;">
                                        <img src="/static/images_converted_by_screen/${imageUrl}" class="img-fluid" />
                                    </label>
                                </div>
                            </div>`;
                    });
                    $('#imagesContainer').html(imagesHtml);
                    $('#selectForm').show();
                }
            },
            error: function() {
                $('#result').html('<div class="alert alert-danger">Failed to upload file.</div>');
                spiner.style.display = 'none';
            }
        });
    });

    $('#selectForm').on('submit', function(e) {
        e.preventDefault();
        var selectedImages = [];
        $('#imagesContainer input:checked').each(function() {
            selectedImages.push($(this).val());
        });
        
        spiner2.style.display = 'flex';
        tooltip();

        $.ajax({
            url: '/selectedpages',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                images: selectedImages,
                dropdownValue: selectedDropdownValue,
                modelName: selectedDropdownValue2
            }),
            success: function(response) {
                spiner2.style.display = 'none';
                $('#result').html('<div class="alert alert-success">Selected pages extracted successfully!</div>');
                var responseHtml = '';
                if (response.invoicedate) {
                    responseHtml += `
                        <div class="card-2 mt-3">
                            <div class="card-body">
                                <h5 class="card-title" style="text-decoration: underline;">Invoice Details</h5>
                                <p><strong>Invoice Date:</strong> ${response.invoicedate || ''}</p>
                                <p><strong>Invoice No:</strong> ${response.invoiceno || ''}</p>
                                <p><strong>Origin:</strong> ${response.origin || ''}</p>
                                <p><strong>PO Date:</strong> ${response.poDate || ''}</p>
                                <p><strong>PO Number:</strong> ${response.poNumber || ''}</p>
                                <p><strong>Shipment Term:</strong> ${response.shipmentterm || ''}</p>
                                <p><strong>Shipper:</strong> ${response.shipper || ''}</p>
                                <p><strong>Shipper Address:</strong> ${response.shipperaddress || ''}</p>
                                <p><strong>Consignee:</strong> ${response.consignee || ''}</p>
                                <p><strong>Consignee Address:</strong> ${response.consigneeaddress || ''}</p>
                                <p><strong>Currency:</strong> ${response.currency || ''}</p>
                                <p><strong>Destination:</strong> ${response.destination || ''}</p>
                                <p><strong>Discharge:</strong> ${response.discharge || ''}</p>
                            </div>
                        </div>
                        <h5 class="mt-4" style="text-decoration: underline;">Invoice Items</h5>
                        <table class="table table-bordered mt-2">
                            <thead>
                                <tr>
                                    <th>Sl. No.</th>
                                    <th>Description</th>
                                    <th>HS Code</th>
                                    <th>Net Weight</th>
                                    <th>Quantity</th>
                                    <th>Rate</th>
                                    <th>Total Amount</th>
                                </tr>
                            </thead>
                            <tbody>`;
                    
                    response.invoiceItemParserVOs.forEach(function(item) {
                        responseHtml += `
                            <tr>
                                <td>${item.slno || ''}</td>
                                <td>${item.desc || ''}</td>
                                <td>${item.hscode || ''}</td>
                                <td>${item.netweight || ''}</td>
                                <td>${item.quantity} ${item.quantityUnitCode || ''}</td>
                                <td>${item.rate}</td>
                                <td>${item.totalamount || ''}</td>
                            </tr>`;
                    });
                } else if (response['SHIPPER_NAME']) {
                    responseHtml += `
                        <div class="card-2 mt-3">
                            <div class="card-body">
                                <h5 class="card-title" style="text-decoration: underline;">AWB Details</h5>
                                <p><strong>MAWB Number:</strong> ${response['MAWB_NUMBER'] || ''}</p>
                                <p><strong>HAWB Number:</strong> ${response['HAWB_NUMBER'] || ''}</p>
                                <p><strong>Shipper Name:</strong> ${response['SHIPPER_NAME'] || ''}</p>
                                <p><strong>Shipper Address:</strong> ${response['SHIPPER_ADDRESS'] || ''}</p>
                                <p><strong>Consignee Name:</strong> ${response['CONSIGNEE_NAME'] || ''}</p>
                                <p><strong>Consignee Address:</strong> ${response['CONSIGNEE_ADDRESS'] || ''}</p>
                                <p><strong>Airport of Departure:</strong> ${response['AIRPORT_OF_DEPARTURE'] || ''}</p>
                                <p><strong>Airport of Destination:</strong> ${response['AIRPORT_OF_DESTINATION'] || ''}</p>
                                <p><strong>Requested Flight Date:</strong> ${response['REQUESTED_FLIGHT_DATE'] || ''}</p>
                                <p><strong>Requested Flight Number:</strong> ${response['REQUESTED_FLIGHT_NUMBER'] || ''}</p>
                                <p><strong>Accounting Information:</strong> ${response['ACCOUNTING_INFORMATION'] || ''}</p>
                                <p><strong>Handling Information:</strong> ${response['HANDLING_INFORMATION'] || ''}</p>
                                <p><strong>Declared Value for Carriage:</strong> ${response['DECLARED_VALUE_FOR_CARRIAGE'] || ''}</p>
                                <p><strong>Declared Value for Customs:</strong> ${response['DECLARED_VALUE_FOR_CUSTOMS'] || ''}</p>
                                <p><strong>Amount of Insurance:</strong> ${response['AMOUNT_OF_INSURANCE'] || ''}</p>
                                <p><strong>Issued By:</strong> ${response['ISSUED_BY'] || ''}</p>
                                <p><strong>Issuing Carrier Agent Name:</strong> ${response['ISSUING_CARRIER_AGENT_NAME'] || ''}</p>
                                <p><strong>Issuing Carrier Agent City:</strong> ${response['ISSUING_CARRIER_AGENT_CITY'] || ''}</p>
                                <p><strong>Executed On Date:</strong> ${response['EXECUTED_ON_DATE'] || ''}</p>
                                <p><strong>Signature of Issuing Carrier or Its Agent:</strong> ${response['SIGNATURE_OF_ISSUING_CARRIER_OR_ITS_AGENT'] || ''}</p>
                                <p><strong>Signature of Shipper or His Agent:</strong> ${response['SIGNATURE_OF_SHIPPER_OR_HIS_AGENT'] || ''}</p>
                            </div>
                        </div>
                        <h5 class="mt-4" style="text-decoration: underline;">Invoice Items</h5>
                        <table class="table table-bordered mt-2">
                            <thead>
                                <tr>
                                    <th>Sl. No.</th>
                                    <th>Gross Weight</th>
                                    <th>Chargeable Weight</th>
                                    <th>No of Pieces (RCP)</th>
                                    <th>Rate Class</th>
                                    <th>Rate/Charge</th>
                                    <th>Nature and Quantity of Goods</th>
                                    <th>Total</th>
                                </tr>
                            </thead>
                            <tbody>`;
                    
                    response.ITEMS.forEach(function(item) {
                        responseHtml += `
                            <tr>
                                <td>${item.itemNo || ''}</td>
                                <td>${item.grossWeight || ''}</td>
                                <td>${item.chargeableWeight || ''}</td>
                                <td>${item.noOfPeicesRCP || ''}</td>
                                <td>${item.rateClass || ''}</td>
                                <td>${item['rate/charge'] || ''}</td>
                                <td>${item.natureAndQuantityOfGoods || ''}</td>
                                <td>${item.total || ''}</td>
                            </tr>`;
                    });
                } else if (response.gaindeDeclarationDate) {
                    responseHtml += `
                        <div class="card-2 mt-3">
                            <div class="card-body">
                                <h5 class="card-title" style="text-decoration: underline;">DOCS Details</h5>
                                <p><strong>Manifeste No:</strong> ${response.avmanifesteNo || ''}</p>
                                <p><strong>No of articles:</strong> ${response.avnoOfArticles || ''}</p>
                                <p><strong>Declaration No:</strong> ${response.gaindeDeclarationNo || ''}</p>
                                <p><strong>Declaration Date:</strong> ${response.gaindeDeclarationDate || ''}</p>
                                <p><strong>PPM No:</strong> ${response.ppm || ''}</p>
                            </div>
                        </div>`;
                } else {
                    responseHtml += `
                        <div class="card-2 mt-3">
                            <div class="card-body">
                                <h5 class="card-title" style="text-decoration: underline;">DPI Details</h5>
                                <p><strong>DPI No:</strong> ${response.dpiNo || ''}</p>
                                <p><strong>DPI Reception:</strong> ${response.dpiReception || ''}</p>
                                <p><strong>DPI Registration:</strong> ${response.dpiRegistration || ''}</p>
                                <p><strong>Exporter Name:</strong> ${response.exporterName || ''}</p>
                                <p><strong>Exporter Address:</strong> ${response.exporterAddress || ''}</p>
                                <p><strong>Importer Name:</strong> ${response.importerName || ''}</p>
                                <p><strong>Importer Address:</strong> ${response.importerAddress || ''}</p>
                                <p><strong>Currency:</strong> ${response.currency || ''}</p>
                                <p><strong>Incoterm:</strong> ${response.incoterm || ''}</p>
                                <p><strong>Mode of Transport:</strong> ${response.modeOfTransport || ''}</p>
                                <p><strong>Proforma Date:</strong> ${response.proformaDate || ''}</p>
                                <p><strong>Proforma No:</strong> ${response.proformaNo || ''}</p>
                                <p><strong>Place of Embarkation:</strong> ${response.placeofEmbarkation || ''}</p>
                                <p><strong>Shipping Method:</strong> ${response.shippingMethod || ''}</p>
                                <p><strong>Fret:</strong> ${response.fret}</p>
                                <p><strong>Insurance:</strong> ${response.insuarance}</p>
                                <p><strong>Invoice Amount:</strong> ${response.invoiceAmt || ''}</p>
                                <p><strong>Mode of Payment:</strong> ${response.modeOfPayment || ''}</p>
                                <p><strong>Observation:</strong> ${response.observation || ''}</p>
                                <p><strong>Other Charges:</strong> ${response.otherCharges}</p>
                                <p><strong>Value FOB:</strong> ${response.valueFob || ''}</p>
                                <p><strong>Payment Terms:</strong> ${response.PaymentTerms || ''}</p>
                                <p><strong>Provenance:</strong> ${response.provenance || ''}</p>
                                <p><strong>Transhipment Location:</strong> ${response.transhipmentLocation || ''}</p>
                                <p><strong>Transmitter Av Ara:</strong> ${response.transmitterAvAra || ''}</p>
                                <p><strong>PPM:</strong> ${response.ppm || ''}</p>
                                <p><strong>NINEA:</strong> ${response.ninea || ''}</p>
                                <p><strong>Bank Name:</strong> ${response.bankName || ''}</p>
                                <p><strong>Bank Contact:</strong> ${response.bankContact || ''}</p>
                                <p><strong>Bank Fax:</strong> ${response.bankFax || ''}</p>
                                <p><strong>Bank Ph:</strong> ${response.bankPhoneno || ''}</p>
                            </div>
                        </div>
                        <h5 class="mt-4" style="text-decoration: underline;">DPI Items</h5>
                        <table class="table table-bordered mt-2">
                            <thead>
                                <tr>
                                    <th>Sl. No.</th>
                                    <th>Description</th>
                                    <th>Origin</th>
                                    <th>HS Code</th>
                                    <th>Quantity</th>
                                    <th>Unit</th>
                                    <th>Value Fact</th>
                                </tr>
                            </thead>
                            <tbody>`;
                    
                        response.dpiItemVOs.forEach(function(item) {
                            responseHtml += `
                                <tr>
                                    <td>${item.itemNo || ''}</td>
                                    <td>${item.desc || ''}</td>
                                    <td>${item.origin || ''}</td>
                                    <td>${item.shCode || ''}</td>
                                    <td>${item.qty || ''}</td>
                                    <td>${item.unit || ''}</td>
                                    <td>${item.valueFact || ''}</td>
                                </tr>`;
                        });
                    }

                responseHtml += `
                        </tbody>
                    </table>`;
                
                $('#jsonResponse').html(responseHtml);
            },
            error: function() {
                $('#result').html('<div class="alert alert-danger">Failed to extract selected pages.</div>');
                spiner2.style.display = 'none';
            }
        });
    });
});

var selectedDropdownValue = '';
var selectedDropdownValue2 = '';

function setDropdownValue(value) {
    selectedDropdownValue = value;
    document.getElementById('textId').textContent = value;
    console.log('Selected:', value);
}

function setDropdownValue2(value) {
    selectedDropdownValue2 = value;
    document.getElementById('textId2').textContent = value;
    console.log('Selected:', value);
}

function tooltip() {
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl)
    })
}

tooltip();