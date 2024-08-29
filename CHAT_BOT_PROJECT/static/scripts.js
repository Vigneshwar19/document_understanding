document.getElementById('user-input').addEventListener('keypress', function(event) {
    if (event.shiftKey && event.keyCode === 13) {
        event.preventDefault();
        this.value += '\n';
    }
});

let isImageSelected = false;

var clk = document.getElementById('img-click')

function imgQuestions() {
    var tagsDiv = document.getElementById('patterns');
        if (tagsDiv) {
            tagsDiv.parentNode.removeChild(tagsDiv);
        }
        var responseHTML = `Please upload the <b>PDF / Image</b> that you want to be analyzed.`
        var typingSpeed = 1e-15;
        var botMessageHTML = `<div class="message-container"><div class="bot-avatar"><div id="dp" data-bs-toggle="modal" data-bs-target="#modalPopup">
            <img id="thumbnail" src="https://betatest.ezeeshipping.in/assets/img/EZ_New_LogoAboveText.png" alt="EzeeBot Logo" style="width: 90%; height: 90%; margin-top: 1.2px; margin-left: 0.8px; object-fit: contain; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); clip-path: inset(0 0 8px 0);">
        </div></div><div class="bot-message-chat typing10" style="line-height: 1.5;"><div class="bot-message-img">`;
        chatContainer.innerHTML += botMessageHTML;
        var currentTime = new Date().toLocaleTimeString();
        var botTimeHTML = '<div class="bot-time">' + 'EZEEBOT , ' + currentTime + '</div>';

        function typeWriter() {
            var botMessageElement = chatContainer.querySelector('.bot-message-chat.typing10');
            botMessageElement.innerHTML = responseHTML.substring(0, index);
            index++;
            
            if (index <= responseHTML.length) {
                setTimeout(typeWriter, typingSpeed * 1000);
                scrollToBottom();
            } else {
                botMessageElement.classList.remove('typing10');
                chatContainer.innerHTML += botTimeHTML;
                scrollToBottom();
                handleUserInput(formData);
            }
        }
            
        var index = 0;
            
        typeWriter();
    var imageUploadElement = document.getElementById('image-upload');
    imageUploadElement.click();
    imageUploadElement.addEventListener('change', function() {
    const file = event.target.files[0];
    if (file) {
            console.log('yessss');
            isImageSelected = true;
            const formData = new FormData();
            formData.append('image', file);

            var tagsDiv = document.getElementById('tags');
            if (tagsDiv) {
                tagsDiv.parentNode.removeChild(tagsDiv);
            }
            var randomDiv = document.getElementById('random-questions');
            if (randomDiv) {
                randomDiv.parentNode.removeChild(randomDiv);
            }
            var reader = '';
            reader = new FileReader();
            reader.onload = function(event) {
                var mesCon = document.getElementsByClassName("message-container-start");
                if (mesCon.length > 0) {
                    console.log("is here");
                    for (var i = mesCon.length - 1; i >= 0; i--) {
                        mesCon[i].parentNode.removeChild(mesCon[i]);
                    }
                } else {
                    console.log("is not here");
                }
                var mesCon2 = document.getElementsByClassName("bot-message-chat-top");
                if (mesCon2.length > 0) {
                    console.log("is here");
                    for (var i = mesCon2.length - 1; i >= 0; i--) {
                        mesCon2[i].parentNode.removeChild(mesCon2[i]);
                    }
                } else {
                    console.log("is not here");
                }
                if (file.type.startsWith('image/')) {
                    userMessageHTML = `
                        <div class="message-container">
                            <div class="user-message-img">
                                <img src="${event.target.result}" alt="User Image" style="width: 200px; height: auto; cursor: pointer;" onclick="openModalimg('${event.target.result}')">
                            </div>
                        </div>
                    `;
                } else if (file.type === 'application/pdf') {
                    userMessageHTML = `
                        <div class="message-container">
                            <div class="user-message-pdf" style="background-color: #007bff; padding: 5px; border-radius: 5px;">
                                <i class="fas fa-file-pdf" style="padding-right: 5px; font-size: 34px;"></i>
                                <a href="${event.target.result}" target="_blank" style="color: white; text-decoration: none; font-weight: bold;">
                                    ${file.name}<br>
                                    <span style="font-size: 10px; bottom: 30px; ">(${formatFileSize(file.size)})</span>
                                </a>
                            </div>
                        </div>
                    `;
                }
                chatContainer.innerHTML += userMessageHTML;
                scrollToBottom();
                if (file.type.startsWith('image/')) {
                   var fileName = "image";
                } else if (file.type.startsWith('application/pdf')) {
                    var fileName = "pdf";
                 }
                 const fileName2 = file.name.replace(/\.(pdf|jpg|png|jpeg)$/i, '');
                var responseHTML = `Ask me anything about the <b>${fileName}</b>(${fileName2}), I'll use my AI to answer them.`
                    var typingSpeed = 1e-15;
                    var botMessageHTML = `<div class="message-container"><div class="bot-avatar"><div id="dp" data-bs-toggle="modal" data-bs-target="#modalPopup">
                        <img id="thumbnail" src="https://betatest.ezeeshipping.in/assets/img/EZ_New_LogoAboveText.png" alt="EzeeBot Logo" style="width: 90%; height: 90%; margin-top: 1.2px; margin-left: 0.8px; object-fit: contain; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); clip-path: inset(0 0 8px 0);">
                    </div></div><div class="bot-message-chat typing10" style="line-height: 1.5;"><div class="bot-message-img">`;
                    chatContainer.innerHTML += botMessageHTML;
                    var currentTime = new Date().toLocaleTimeString();
                    var botTimeHTML = '<div class="bot-time">' + 'EZEEBOT , ' + currentTime + '</div>';

                    function typeWriter() {
                        var botMessageElement = chatContainer.querySelector('.bot-message-chat.typing10');
                        botMessageElement.innerHTML = responseHTML.substring(0, index);
                        index++;
                        
                        if (index <= responseHTML.length) {
                            setTimeout(typeWriter, typingSpeed * 1000);
                            scrollToBottom();
                        } else {
                            botMessageElement.classList.remove('typing10');
                            chatContainer.innerHTML += botTimeHTML;
                            scrollToBottom();
                            handleUserInput(formData);
                        }
                    }
                        
                    var index = 0;
                        
                    typeWriter();     
            };
            reader.onerror = function(event) {
                console.error("FileReader error:", event.target.error);
            };
            reader.readAsDataURL(file);
            scrollToBottom();
        }
    });
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function openModalimg(imageUrl) {
    console.log('opened');
    var modalContainer = document.createElement('div');
    modalContainer.classList.add('modal');

    var modalContent = document.createElement('div');
    modalContent.classList.add('modal-content');

    var image = document.createElement('img');
    image.src = imageUrl;
    image.alt = 'User Image';

    modalContent.appendChild(image);

    modalContainer.appendChild(modalContent);

    document.body.appendChild(modalContainer);

    modalContainer.addEventListener('click', function(event) {
        if (event.target === modalContainer) {
            closeModalimg(modalContainer);
        }
    });

    image.addEventListener('click', function() {
        closeModalimg(modalContainer);
    });
}

function closeModalimg(modal) {
    document.body.removeChild(modal);
}

function handleUserInput(formData) {
    const userInputElement = document.getElementById('user-input');
    userInputElement.focus();

    userInputElement.addEventListener('change', function onChange(event) {
        var userInput = userInputElement.value.trim();
        sendUserMessageBooking(userInput);
        if (userInput) {
            console.log('user: ',userInput);
            formData.append('userText', userInput);
            console.log(formData);
            typingMessage();
            setTimeout(() => {
                extractingMessage();
                closeType();
            }, 500);
            const uri = '/img';

            fetch(uri, {
                method: 'POST',
                body: formData
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log('Success:', data);
                if (data.generated_content) {
                    var responseMarkdown = data.generated_content;
                    var converter = new showdown.Converter();
                    var responseHTML = converter.makeHtml(responseMarkdown);
                    var typingSpeed = 1e-15;
                    var botMessageHTML = `<div class="message-container"><div class="bot-avatar"><div id="dp" data-bs-toggle="modal" data-bs-target="#modalPopup">
                        <img id="thumbnail" src="https://betatest.ezeeshipping.in/assets/img/EZ_New_LogoAboveText.png" alt="EzeeBot Logo" style="width: 90%; height: 90%; margin-top: 1.2px; margin-left: 0.8px; object-fit: contain; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); clip-path: inset(0 0 8px 0);">
                    </div></div><div class="bot-message-chat-3 typing2" style="line-height: 1.5;"><div class="bot-message-img">`;
                    chatContainer.innerHTML += botMessageHTML;
                    var currentTime = new Date().toLocaleTimeString();
                    var botTimeHTML = '<div class="bot-time">' + 'EZEEBOT , ' + currentTime + '</div>';

                    function typeWriter() {
                        var botMessageElement = chatContainer.querySelector('.bot-message-chat-3.typing2');
                        var words = responseHTML.split(' ');
                        var currentText = words.slice(0, index).join(' ');
                        botMessageElement.innerHTML = currentText;
                        index++;  
                        
                        if (index <= words.length) {
                            setTimeout(typeWriter, typingSpeed * 1000);
                            scrollToBottom();
                        } else {
                            botMessageElement.classList.remove('typing2');
                            scrollToBottom();
                            chatContainer.innerHTML += botTimeHTML;
                            // Ask for user input again
                            formData.delete('userText');
                            userInput = '';
                            userInputElement.removeEventListener('change', onChange);
                            handleUserInput(formData); // Focus on input field
                        }
                    }
                        
                    var index = 0;
                        
                    typeWriter();
                } else {
                    var errorMessageHTML = `
                        <div class="message-container">
                            <div class="bot-message">City not found. Please check the spelling and try again.</div>
                        </div>
                    `;
                    chatContainer.innerHTML += errorMessageHTML;
                    scrollToBottom();
                }
                closeType();
            })
            .catch(error => {
                console.error('Error:', error);
                var errorMessageHTML = `
                    <div class="message-container">
                        <div class="bot-message">An error occurred while processing your request. Please try again later.</div>
                    </div>
                `;
                chatContainer.innerHTML += errorMessageHTML;
                closeType();
                scrollToBottom();
            });
        } else {
            console.log('User input is empty');
        }
    });
}

function handleRegularInput(userInput) {
    console.log('Handling regular input:', userInput);
    sendUserMessage(userInput);
}

function scrollToBottomIfNeeded() {
    var chatContainer = document.getElementById("chat-container");
    var isAtBottom = chatContainer.scrollHeight - chatContainer.clientHeight <= chatContainer.scrollTop + 100;

    var downButton = document.getElementById('mydownButton');
    if (!isAtBottom) {
        downButton.style.display = "block";
    } else {
        downButton.style.display = "none";
    }
}

function customButtonClick2() {
    console.log('clicked');
    scrollToBottom();
}

document.addEventListener("DOMContentLoaded", function() {
    var downButton = document.getElementById('mydownButton');

    setInterval(scrollToBottomIfNeeded, 100);

    downButton.addEventListener("click", function() {
        customButtonClick2();
    });
});

document.addEventListener('keydown', function(event) {
    if ((event.ctrlKey || event.metaKey) && event.key === 'q') {
        var button = document.getElementById('customButton');
        button.click();
    }
});

function customButtonClick() {
    fetch('/chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            user_input: {
                'general': "refresh",
                'current_date': formattedDate,
                'tenantid': tenantid,
                'officeid': officeid,
                'userid': userid
            }
        }),
    })
    var chatContainer = document.getElementById("chat-container");
    var h1 = document.querySelector('.container-fluid.p-2.d-flex.align-items-center');

    if (chatContainer) {
        chatContainer.style.display = 'None';
        h1.classList.add('show-after');
        location.reload();
    } else {
        location.reload();
    }
}        

document.getElementById("customButton").addEventListener("click", customButtonClick);

function refreshScreen() {
    var inputForm = document.getElementById("user-input");
    inputForm.style.display = 'block';
    var userInputElement = document.getElementById('user-input');
    if (userInputElement._listener) {
        userInputElement.removeEventListener('keypress', userInputElement._listener);
    }
}
var chatContainer = document.getElementById('chat-container');

var tenantid = inputData.tenantid;
var environment = inputData.environment;
var ffrid = inputData.ffrid;
var userid2 = inputData.userid2;
var trpid = inputData.trpid;
var chaid = inputData.chaid;
var officeid = inputData.officeid;
var userid = inputData.userid;
var now = new Date();
var year = now.getFullYear();
var month = ('0' + (now.getMonth() + 1)).slice(-2);
var day = ('0' + now.getDate()).slice(-2);
var hours = ('0' + now.getHours()).slice(-2);
var minutes = ('0' + now.getMinutes()).slice(-2);

var formattedDate = year + '-' + month + '-' + day + ' ' + hours + ':' + minutes;
document.getElementById('main-container').style.display = 'block';

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}  

function setHelpMessage2() {
    var userInput = document.getElementById('user-input');
    userInput.focus();
    scrollToBottom();
    console.log("Setting help message");
    var responseHTML = `Hi,&nbsp;${(userid ? "<b>" + capitalizeFirstLetter(userid) + "</b>" : "")}&nbsp;How can I assist you today?`;
    var botMessageHTML = `
        <div class="message-container-start">
            <div class="bot-avatar-start" data-bs-toggle="modal" data-bs-target="#modalPopup">
                <div id="dp" data-bs-toggle="tooltip" data-bs-placement="top" title="EzeeBot" style="width: calc(78px + 0.1vw); cursor: pointer; height: calc(78px + 0.1vw); border-radius: 50%; border: 1px solid #e5e4e2; background-color: white; padding: 2px; position: relative; overflow: hidden; margin-bottom: 10px;">
                    <img id="thumbnail" src="https://betatest.ezeeshipping.in/assets/img/EZ_New_LogoAboveText.png" alt="EzeeBot Logo" style="width: 90%; height: 90%; margin-top: 3px; margin-left: 1px; object-fit: contain; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); clip-path: inset(0 0 17px 0);">
                </div>
            </div>
        </div>
        <div class="bot-message-chat-top" style="opacity: 0;">${responseHTML}</div>
    `;
    chatContainer.innerHTML += botMessageHTML;

    var botMessageElement = chatContainer.querySelector('.bot-message-chat-top');
    setTimeout(function () {
        botMessageElement.style.opacity = 1;
    }, 20000);

    var currentTime = new Date().toLocaleTimeString();
    var botTimeHTML = '<div class="bot-time">' + 'EZEEBOT , ' + currentTime + '</div>';
    var iconClasses = {
        'Sales': 'fas fa-dollar-sign',
        'Documentation / Operation': 'fas fa-calendar-check',
        'Accounts': 'fas fa-chart-line',
        'Search Engine': 'fas fa-search',
        'AI - Powered Pdf / Image processing': 'fas fa-file-pdf'
    };
    
    var tagsHTML = tags.map(function (tag) {
        var trimmedTag = tag.trim();
        var normalizedTag = trimmedTag.toLowerCase();
        var buttonClass = normalizedTag === 'primary' ? 'button-primary' : 'button-secondary';

        var iconClass = iconClasses[Object.keys(iconClasses).find(key => key.toLowerCase() === normalizedTag)] || 'fas fa-question';
        
        return `<button class="button ${buttonClass}" onclick="selectTag('${trimmedTag}')">
            <span class="button-text">
                <i class="${iconClass}"></i>&nbsp;${trimmedTag}
            </span>
        </button>`;
    }).join('');
    
    var randomQsHTML = randomQs.map(function(question) {
        return `<button class="button button-secondary" onclick="sendUserMessage('${question}')">
            <span class="button-text">
                ${capitalizeFirstLetter(question)}
            </span>
            </button>`;
    }).join('');
    
    chatContainer.innerHTML += '<div id="tags">' + tagsHTML + '</div>';
    chatContainer.innerHTML += '<div id="random-questions">' + randomQsHTML + '</div>';
    scrollToBottom();
}                

setHelpMessage2();

function label(message) {
    var enquiryLabel = document.getElementById("enquirylabel");
    enquiryLabel.textContent = "ENTER THE " + message;

    var enqnumberContainer = document.getElementById("enqnumberContainer");
    enqnumberContainer.innerHTML = "";

    console.log(message);

    if (message.toLowerCase() === "shipment type") {
        createSelect("select", ["EXP_SEA_FCL", "EXP_SEA_LCL", "EXP_AIR", "IMP_SEA_FCL", "IMP_SEA_LCL", "IMP_AIR"]);
    } else if (message.toLowerCase() === "enquiry prospect") {
        createSelect("select", ["HOT", "WARM", "COLD"]);
    } else if (message.toLowerCase() === "shipment term") {
        createSelect("select", ["FOB", "CIF", "CI", "EXW", "FCA", "FAS", "CFR", "CPT", "CIP", "DAT", "DAP", "DDP"]);
    } else if (message.toLowerCase() === "status") {
        createSelect("select", ["BOOKING CREATED", "CANCELED", "OPEN"]);
    } else if (message.toLowerCase() === "quotation sent") {
        createSelect("select", ["ALL", "YES", "NO"]);
    } else if (message.toLowerCase() === "financial year") {
        createSelect("select", ["2017-18", "2018-19", "2019-20", "2020-21", "2021-22", "2022-23", "2023-24"]);
    } else if (message.toLowerCase() === "template") {
        createSelect("select", ["ENQTEST"]);
    } else if (message.toLowerCase() === "from date") {
        createInput("datetime-local");
    } else if (message.toLowerCase() === "to date") {
        createInput("datetime-local");
    } else if (message.toLowerCase() === "domestic/overseas") {
        createSelect("select", ["BOTH", "OVERSEAS", "DOMESTIC"]);
    } else if (message.toLowerCase() === "lead source") {
        createSelect("select", ["CUSTOMER", "INTER", "LS"]);
    } else if (message.toLowerCase() === "country") {
        createSelect("select", [
        "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria",
        "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan",
        "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia",
        "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo, Democratic Republic of the", "Congo, Republic of the",
        "Costa Rica", "Cote d'Ivoire", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic",
        "East Timor (Timor-Leste)", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji",
        "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala",
        "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran",
        "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati",
        "Korea, North", "Korea, South", "Kosovo", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia",
        "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta",
        "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco",
        "Mozambique", "Myanmar (Burma)", "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria",
        "North Macedonia", "Norway", "Oman", "Pakistan", "Palau", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines",
        "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa",
        "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia",
        "Solomon Islands", "Somalia", "South Africa", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland",
        "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey",
        "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu",
        "Vatican City", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
    ]);
    } else if (message.toLowerCase() === "prospect") {
        createSelect("select", ["HOT", "WARM", "COLD"]);
    } else {
        console.log("Setting input type to text");
        createInput("text");
    }
}

function createSelect(type, options) {
    var selectElement = document.createElement(type);
    var enqnumberContainer = document.getElementById("enqnumberContainer");
    enqnumberContainer.appendChild(selectElement);

    if (type.toLowerCase() === "select") {
        var defaultOption = document.createElement("option");
        defaultOption.text = "---SELECT---";
        defaultOption.disabled = true;
        defaultOption.selected = true;

        selectElement.appendChild(defaultOption);

        if (options && options.length > 0) {
            options.forEach(function(option) {
                var optionElement = document.createElement("option");
                optionElement.text = option;
                selectElement.appendChild(optionElement);
            });
        }
    }
}     

function createInput(type) {
    var inputElement = document.createElement("input");
    inputElement.type = type;
    inputElement.addEventListener("input", function() {
        console.log("Input entered:", inputElement.value);
    });

    var enqnumberContainer = document.getElementById("enqnumberContainer");
    enqnumberContainer.appendChild(inputElement);
}     

function selectTag(tag) {
    if (tag.toLowerCase() === 'search engine') {
        var tagsDiv = document.getElementById('tags');
        if (tagsDiv) {
            tagsDiv.parentNode.removeChild(tagsDiv);
        }
        var randomDiv = document.getElementById('random-questions');
        if (randomDiv) {
            randomDiv.parentNode.removeChild(randomDiv);
        }
        sendUserMessageBooking(tag);
        sendPattern2(tag);
    } else if (tag.toLowerCase() === 'ai - powered pdf / image processing') {
        var tagsDiv = document.getElementById('tags');
        if (tagsDiv) {
            tagsDiv.parentNode.removeChild(tagsDiv);
        }
        var randomDiv = document.getElementById('random-questions');
        if (randomDiv) {
            randomDiv.parentNode.removeChild(randomDiv);
        }
        sendUserMessageBooking(tag);
        var responseHTML = `How do you want your <b>PDF / Image</b> to be processed?`;
        var typingSpeed = 1e-15;
        var botMessageHTML = `<div class="message-container"><div class="bot-avatar"><div id="dp" data-bs-toggle="modal" data-bs-target="#modalPopup">
            <img id="thumbnail" src="https://betatest.ezeeshipping.in/assets/img/EZ_New_LogoAboveText.png" alt="EzeeBot Logo" style="width: 90%; height: 90%; margin-top: 1.2px; margin-left: 0.8px; object-fit: contain; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); clip-path: inset(0 0 8px 0);">
        </div></div><div class="bot-message-chat typingimgq">`;
        chatContainer.innerHTML += botMessageHTML;
        var currentTime = new Date().toLocaleTimeString();
        var botTimeHTML = '<div class="bot-time">' + 'EZEEBOT , ' + currentTime + '</div>';

        function typeWriter() {
            var botMessageElement = chatContainer.querySelector('.bot-message-chat.typingimgq');
            botMessageElement.innerHTML = responseHTML.substring(0, index);
            index++;
                                
            if (index <= responseHTML.length) {
                setTimeout(typeWriter, typingSpeed * 1000);
                scrollToBottom();
            } else {
                botMessageElement.classList.remove('typingimgq');
                scrollToBottom();
                chatContainer.innerHTML += botTimeHTML;
                var imgButton = `<div id="patterns">
                <button onclick="sendUserMessageBooking(\'OCR Reading\'); frightAirWayBillextract()">OCR Reading</button>
                <button onclick="sendUserMessageBooking(\'AI document analysis\'); imgQuestions()">AI document analysis</button>
                <button onclick="sendUserMessageBooking(\'AWB Extraction\'); openUrlInModal('http://127.0.0.1:9601/')">AWB Extraction</button>
                <button onclick="sendUserMessageBooking(\'Invoice Extraction\'); awbBooking(\'INVOICE\')">Invoice Extraction</button>
                </div>`
                chatContainer.innerHTML += imgButton;
            }
        }
                                
        var index = 0;
                                
        typeWriter();
        //frightAirWayBillextract();
    } else {
        var mesCon = document.getElementsByClassName("message-container-start");
        if (mesCon.length > 0) {
            console.log("is here");
            for (var i = mesCon.length - 1; i >= 0; i--) {
                mesCon[i].parentNode.removeChild(mesCon[i]);
            }
        } else {
            console.log("is not here");
        }
        var mesCon2 = document.getElementsByClassName("bot-message-chat-top");
        if (mesCon2.length > 0) {
            console.log("is here");
            for (var i = mesCon2.length - 1; i >= 0; i--) {
                mesCon2[i].parentNode.removeChild(mesCon2[i]);
            }
        } else {
            console.log("is not here");
        }
        var userMessageHTML = '<div class="message-container"><div class="user-message">' + tag + '</div></div>';
    chatContainer.innerHTML += userMessageHTML;
    scrollToBottom();

    var patterns = patternsByTag[tag];
    var patternsHTML = patterns.map(function(pattern) {
        var buttonClass = tag === 'primary' ? 'button-primary' : 'button-secondary';
        return '<button class="button ' + buttonClass + '" onclick="sendUserMessage(\'' + pattern + '\')">' + pattern + '</button>';
    }).join('');
    
    //var botMessageHTML = '<div class="message-container"><div class="bot-avatar" data-bs-toggle="modal" data-bs-target="#modalPopup"><img src="https://betatest.ezeeshipping.in/assets/img/EZ_New_LogoAboveText.png" alt="EzeeBot Logo" style="width: 30px; height: auto;"></div><div class="bot-message">How can I assist you with ' + "<b>" + tag.toLowerCase() + "</b>" +'?</div></div>';
    var responseHTML = `How can I assist you with <b> ${tag.toLowerCase()}</b>?`;
    var typingSpeed = 1e-15;
    var botMessageHTML = `<div class="message-container"><div class="bot-avatar"><div id="dp" data-bs-toggle="modal" data-bs-target="#modalPopup">
        <img id="thumbnail" src="https://betatest.ezeeshipping.in/assets/img/EZ_New_LogoAboveText.png" alt="EzeeBot Logo" style="width: 90%; height: 90%; margin-top: 1.2px; margin-left: 0.8px; object-fit: contain; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); clip-path: inset(0 0 8px 0);">
    </div></div><div class="bot-message-chat typing3">`;
    chatContainer.innerHTML += botMessageHTML;
    var currentTime = new Date().toLocaleTimeString();
    var botTimeHTML = '<div class="bot-time">' + 'EZEEBOT , ' + currentTime + '</div>';

    function typeWriter() {
        var botMessageElement = chatContainer.querySelector('.bot-message-chat.typing3');
        botMessageElement.innerHTML = responseHTML.substring(0, index);
        index++;
                            
        if (index <= responseHTML.length) {
            setTimeout(typeWriter, typingSpeed * 1000);
            scrollToBottom();
        } else {
            botMessageElement.classList.remove('typing');
            scrollToBottom();
            chatContainer.innerHTML += botTimeHTML;
            chatContainer.innerHTML += '<div id="patterns">' + patternsHTML + '</div>';
        }
    }
                            
    var index = 0;
                            
    typeWriter();

    var tagsDiv = document.getElementById('tags');
    if (tagsDiv) {
        tagsDiv.parentNode.removeChild(tagsDiv);
    }
    var randomDiv = document.getElementById('random-questions');
    if (randomDiv) {
        randomDiv.parentNode.removeChild(randomDiv);
    }

    scrollToBottom();
    }
}      

function sendUserMessage(message) {
    var mesCon = document.getElementsByClassName("message-container-start");
        if (mesCon.length > 0) {
            console.log("is here");
            for (var i = mesCon.length - 1; i >= 0; i--) {
                mesCon[i].parentNode.removeChild(mesCon[i]);
            }
        } else {
            console.log("is not here");
        }
        var mesCon2 = document.getElementsByClassName("bot-message-chat-top");
        if (mesCon2.length > 0) {
            console.log("is here");
            for (var i = mesCon2.length - 1; i >= 0; i--) {
                mesCon2[i].parentNode.removeChild(mesCon2[i]);
            }
        } else {
            console.log("is not here");
        }
    if (message.toLowerCase() === "lead" || message.toLowerCase() === "enquiry" || message.toLowerCase() === "quotation" || message.toLowerCase() === "buying" || message.toLowerCase() === "selling" || message.toLowerCase() === "payments" || message.toLowerCase() === "receipts"){
        sendUserMessageBooking(message);
        var responseHTML = `In what method you want to continue in <b>${message.toLowerCase()}</b>?`;
        var typingSpeed = 1e-15;
        var botMessageHTML = `<div class="message-container"><div class="bot-avatar"><div id="dp" data-bs-toggle="modal" data-bs-target="#modalPopup">
            <img id="thumbnail" src="https://betatest.ezeeshipping.in/assets/img/EZ_New_LogoAboveText.png" alt="EzeeBot Logo" style="width: 90%; height: 90%; margin-top: 1.2px; margin-left: 0.8px; object-fit: contain; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); clip-path: inset(0 0 8px 0);">
        </div></div><div class="bot-message-chat typingimgq">`;
        chatContainer.innerHTML += botMessageHTML;
        var currentTime = new Date().toLocaleTimeString();
        var botTimeHTML = '<div class="bot-time">' + 'EZEEBOT , ' + currentTime + '</div>';

        function typeWriter() {
            var botMessageElement = chatContainer.querySelector('.bot-message-chat.typingimgq');
            botMessageElement.innerHTML = responseHTML.substring(0, index);
            index++;
                                
            if (index <= responseHTML.length) {
                setTimeout(typeWriter, typingSpeed * 1000);
                scrollToBottom();
            } else {
                botMessageElement.classList.remove('typingimgq');
                scrollToBottom();
                chatContainer.innerHTML += botTimeHTML;
                var imgButton = `<div id="patterns">
                    <button onclick="sendUserMessageBooking('Questions about ${message.toLowerCase()}'); send_inputs2('${message.toLowerCase()}')">Questions about ${message.toLowerCase()}</button>
                    <button onclick="sendUserMessageBooking('Select from ${message.toLowerCase()} input choices'); sendPattern('${message.toLowerCase()}')">Select from ${message.toLowerCase()} input choices</button>
                </div>`;        
                chatContainer.innerHTML += imgButton;
                scrollToBottom();
            }
        }
                                
        var index = 0;
                                
        typeWriter();
    } else {
        const userInputElement = document.getElementById('user-input');
        userInputElement.value = "";
        var userMessageHTML = '<div class="message-container"><div class="user-message">' + capitalizeFirstLetter(message) + '</div></div>';
        chatContainer.innerHTML += userMessageHTML;
        var tagsDiv = document.getElementById('tags');
            if (tagsDiv) {
                tagsDiv.parentNode.removeChild(tagsDiv);
            }
        var patternsDiv = document.getElementById('patterns');
        if (patternsDiv) {
            patternsDiv.parentNode.removeChild(patternsDiv);
        }
        var randomDiv = document.getElementById('random-questions');
        if (randomDiv) {
            randomDiv.parentNode.removeChild(randomDiv);
        }
        scrollToBottom();
        sendPattern(message);
    }
}

function sendUserMessage2(message) {
    var mesCon = document.getElementsByClassName("message-container-start");
        if (mesCon.length > 0) {
            console.log("is here");
            for (var i = mesCon.length - 1; i >= 0; i--) {
                mesCon[i].parentNode.removeChild(mesCon[i]);
            }
        } else {
            console.log("is not here");
        }
        var mesCon2 = document.getElementsByClassName("bot-message-chat-top");
        if (mesCon2.length > 0) {
            console.log("is here");
            for (var i = mesCon2.length - 1; i >= 0; i--) {
                mesCon2[i].parentNode.removeChild(mesCon2[i]);
            }
        } else {
            console.log("is not here");
        }
    if (message.toLowerCase() === "ffrbooking" || message.toLowerCase() === "billoflad" || message.toLowerCase() === "awb" || message.toLowerCase() === "custombooking" || message.toLowerCase() === "trpbooking"){
        if (message.toLowerCase() === "ffrbooking") {
            sendUserMessageBooking('bookings');
            var responseHTML = `In what method you want to continue in <b>bookings</b>?`;
        }
        else if (message.toLowerCase() === "billoflad") {
            sendUserMessageBooking('bill of lading');
            var responseHTML = `In what method you want to continue in <b>bill of lading</b>?`;
        }
        else if (message.toLowerCase() === "awb") {
            sendUserMessageBooking('air way bills');
            var responseHTML = `In what method you want to continue in <b>air way bills</b>?`;
        }
        else if (message.toLowerCase() === "custombooking") {
            sendUserMessageBooking('bookings');
            var responseHTML = `In what method you want to continue in <b>bookings</b>?`;
        }
        else if (message.toLowerCase() === "trpbooking") {
            sendUserMessageBooking('bookings');
            var responseHTML = `In what method you want to continue in <b>bookings</b>?`;
        }
        var typingSpeed = 1e-15;
        var botMessageHTML = `<div class="message-container"><div class="bot-avatar"><div id="dp" data-bs-toggle="modal" data-bs-target="#modalPopup">
            <img id="thumbnail" src="https://betatest.ezeeshipping.in/assets/img/EZ_New_LogoAboveText.png" alt="EzeeBot Logo" style="width: 90%; height: 90%; margin-top: 1.2px; margin-left: 0.8px; object-fit: contain; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); clip-path: inset(0 0 8px 0);">
        </div></div><div class="bot-message-chat typingimgq">`;
        chatContainer.innerHTML += botMessageHTML;
        var currentTime = new Date().toLocaleTimeString();
        var botTimeHTML = '<div class="bot-time">' + 'EZEEBOT , ' + currentTime + '</div>';

        function typeWriter() {
            var botMessageElement = chatContainer.querySelector('.bot-message-chat.typingimgq');
            botMessageElement.innerHTML = responseHTML.substring(0, index);
            index++;
                                
            if (index <= responseHTML.length) {
                setTimeout(typeWriter, typingSpeed * 1000);
                scrollToBottom();
            } else {
                botMessageElement.classList.remove('typingimgq');
                scrollToBottom();
                chatContainer.innerHTML += botTimeHTML;
                if (message.toLowerCase() === "ffrbooking") {
                    var imgButton = `<div id="patterns">
                        <button onclick="sendUserMessageBooking('Questions about bookings'); send_inputs2('${message.toLowerCase()}')">Questions about bookings</button>
                        <button onclick="sendUserMessageBooking('Select from bookings input choices'); frightBooking('${message.toLowerCase()}')">Select bookings input choices</button>
                    </div>`;     
                }
                else if (message.toLowerCase() === "billoflad") {
                    var imgButton = `<div id="patterns">
                        <button onclick="sendUserMessageBooking('Questions about bill of lading'); send_inputs2('${message.toLowerCase()}')">Questions about bill of lading</button>
                        <button onclick="sendUserMessageBooking('Select from bill of lading input choices'); frightBillOfLading('${message.toLowerCase()}')">Select bill of lading input choices</button>
                    </div>`;     
                }
                else if (message.toLowerCase() === "awb") {
                    var imgButton = `<div id="patterns">
                        <button onclick="sendUserMessageBooking('Questions about air way bills'); send_inputs2('${message.toLowerCase()}')">Questions about air way bills</button>
                        <button onclick="sendUserMessageBooking('Select from air way bills input choices'); frightAirWayBill('${message.toLowerCase()}')">Select air way bills input choices</button>
                    </div>`;     
                }
                else if (message.toLowerCase() === "custombooking") {
                    var imgButton = `<div id="patterns">
                        <button onclick="sendUserMessageBooking('Questions about bookings'); send_inputs2('${message.toLowerCase()}')">Questions about bookings</button>
                        <button onclick="sendUserMessageBooking('Select from bookings input choices'); customBooking('${message.toLowerCase()}')">Select bookings input choices</button>
                    </div>`;     
                }
                else if (message.toLowerCase() === "trpbooking") {
                    var imgButton = `<div id="patterns">
                        
                        <button onclick="sendUserMessageBooking('Select from bookings input choices'); trpBooking('${message.toLowerCase()}')">Select bookings input choices</button>
                    </div>`; 
                    //<button onclick="sendUserMessageBooking('Questions about bookings'); send_inputs2('${message.toLowerCase()}')">Questions about bookings</button>    
                } 
                chatContainer.innerHTML += imgButton;
                scrollToBottom();
            }
        }
                                
        var index = 0;
                                
        typeWriter();
    } else {
        const userInputElement = document.getElementById('user-input');
        userInputElement.value = "";
        var userMessageHTML = '<div class="message-container"><div class="user-message">' + capitalizeFirstLetter(message) + '</div></div>';
        chatContainer.innerHTML += userMessageHTML;
        var tagsDiv = document.getElementById('tags');
            if (tagsDiv) {
                tagsDiv.parentNode.removeChild(tagsDiv);
            }
        var patternsDiv = document.getElementById('patterns');
        if (patternsDiv) {
            patternsDiv.parentNode.removeChild(patternsDiv);
        }
        var randomDiv = document.getElementById('random-questions');
        if (randomDiv) {
            randomDiv.parentNode.removeChild(randomDiv);
        }
        scrollToBottom();
        sendPattern(message);
    }
}

function typingMessage() {
    // var botMessageHTML = `
    // <div class="message-container">
    //     <div class="bot-avatar" data-bs-toggle="modal" data-bs-target="#modalPopup">
    //         <div class="loading-circle"></div>
    //         <div id="dp" class="avatar-container">
    //             <img id="thumbnail" src="https://betatest.ezeeshipping.in/assets/img/EZ_New_LogoAboveText.png" alt="EzeeBot Logo">
    //         </div>
    //     </div>
    //     <div class="bot-message-chat">
    //         <span class="dot-pulse"></span><span class="dot-pulse"></span><span class="dot-pulse"></span>
    //     </div>
    // </div>`;

    var botMessageHTML = `
        <div class="message-container">
            <div class="bot-avatar">
                <div id="dp" data-bs-toggle="modal" data-bs-target="#modalPopup">
                    <img id="thumbnail" src="https://betatest.ezeeshipping.in/assets/img/EZ_New_LogoAboveText.png" alt="EzeeBot Logo" style="width: 90%; height: 90%; margin-top: 1.2px; margin-left: 0.8px; object-fit: contain; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); clip-path: inset(0 0 8px 0);">
                </div>
            </div>
            <div class="bot-message-chat">
                <span class="dot-pulse"></span><span class="dot-pulse"></span><span class="dot-pulse"></span>
            </div>
        </div>`;

    chatContainer.innerHTML += botMessageHTML;
    scrollToBottom();
    return botMessageHTML;
}        

function extractingMessage() {
    var botMessageHTML = `
        <div class="message-container">
            <div class="bot-avatar">
                <div id="dp" data-bs-toggle="modal" data-bs-target="#modalPopup">
                    <img id="thumbnail" src="https://betatest.ezeeshipping.in/assets/img/EZ_New_LogoAboveText.png" alt="EzeeBot Logo" style="width: 90%; height: 90%; margin-top: 1.2px; margin-left: 0.8px; object-fit: contain; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); clip-path: inset(0 0 8px 0);">
                </div>
            </div>
            <div class="bot-message-chat">
                <span class="extracting-text" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Reading your document">Reading</span>
            </div>
        </div>`;

    chatContainer.innerHTML += botMessageHTML;
    tooltip();
    scrollToBottom();
    return botMessageHTML;
} 

function closeType() {
    var elements = document.getElementsByClassName("message-container");
    if (elements.length > 0) {
        elements[elements.length - 2].remove();
    }
}               

function sendUserMessageBooking(message) {
    var mesCon = document.getElementsByClassName("message-container-start");
        if (mesCon.length > 0) {
            console.log("is here");
            for (var i = mesCon.length - 1; i >= 0; i--) {
                mesCon[i].parentNode.removeChild(mesCon[i]);
            }
        } else {
            console.log("is not here");
        }
        var mesCon2 = document.getElementsByClassName("bot-message-chat-top");
        if (mesCon2.length > 0) {
            console.log("is here");
            for (var i = mesCon2.length - 1; i >= 0; i--) {
                mesCon2[i].parentNode.removeChild(mesCon2[i]);
            }
        } else {
            console.log("is not here");
        }
    const userInputElement = document.getElementById('user-input');
    userInputElement.value = "";
    var userMessageHTML = '<div class="message-container"><div class="user-message">' + capitalizeFirstLetter(message) + '</div></div>';
    chatContainer.innerHTML += userMessageHTML;
    var tagsDiv = document.getElementById('patterns');
        if (tagsDiv) {
            tagsDiv.parentNode.removeChild(tagsDiv);
        }
    var randomDiv = document.getElementById('random-questions');
    if (randomDiv) {
        randomDiv.parentNode.removeChild(randomDiv);
    }
    console.log(message)
}

document.getElementById('input-form').addEventListener('submit', function(event) {
    event.preventDefault(); 
    var userInput = document.getElementById('user-input').value;
    document.getElementById('user-input').value = '';
    //sendUserMessage(userInput); 
    if (!isImageSelected) {
        handleRegularInput(userInput);
    }
})

function sendCheckboxValueslead() {

    selectedPatterns = [];

    var checkboxes = document.querySelectorAll('.checkbox-group input[type="checkbox"]');

    checkboxes.forEach(function(checkbox) {
        if (checkbox.checked) {
            var labelText = document.querySelector('label[for="' + checkbox.id + '"]').textContent.trim();
            selectedPatterns.push(labelText);
        }
    });

    console.log(selectedPatterns);
    simpleUserMessage3(selectedPatterns);
    lead(selectedPatterns);

    checkboxes.forEach(function(checkbox) {
        checkbox.checked = false;
    });
    var botMessageCheck = document.querySelector('.bot-message-check-lead');
    if (botMessageCheck) {
        botMessageCheck.remove();
    }
}

function sendCheckboxValuesfright() {

    selectedPatterns = [];

    var checkboxes = document.querySelectorAll('.checkbox-group input[type="checkbox"]');

    checkboxes.forEach(function(checkbox) {
        if (checkbox.checked) {
            var labelText = document.querySelector('label[for="' + checkbox.id + '"]').textContent.trim();
            selectedPatterns.push(labelText);
        }
    });

    console.log(selectedPatterns);
    simpleUserMessage3(selectedPatterns);
    askBookingNumberfright(selectedPatterns);

    checkboxes.forEach(function(checkbox) {
        checkbox.checked = false;
    });
    var botMessageCheck = document.querySelector('.bot-message-check-fright');
    if (botMessageCheck) {
        botMessageCheck.remove();
    }
}

function sendCheckboxValuesfrightBillOfLading() {

    selectedPatterns = [];

    var checkboxes = document.querySelectorAll('.checkbox-group input[type="checkbox"]');

    checkboxes.forEach(function(checkbox) {
        if (checkbox.checked) {
            var labelText = document.querySelector('label[for="' + checkbox.id + '"]').textContent.trim();
            selectedPatterns.push(labelText);
        }
    });

    console.log(selectedPatterns);
    simpleUserMessage3(selectedPatterns);
    askBookingNumberfrightBillOfLading(selectedPatterns);

    checkboxes.forEach(function(checkbox) {
        checkbox.checked = false;
    });
    var botMessageCheck = document.querySelector('.bot-message-check-frightBillOfLading');
    if (botMessageCheck) {
        botMessageCheck.remove();
    }
}

function sendCheckboxValuesfrightawb() {

    selectedPatterns = [];

    var checkboxes = document.querySelectorAll('.checkbox-group input[type="checkbox"]');

    checkboxes.forEach(function(checkbox) {
        if (checkbox.checked) {
            var labelText = document.querySelector('label[for="' + checkbox.id + '"]').textContent.trim();
            selectedPatterns.push(labelText);
        }
    });

    console.log(selectedPatterns);
    simpleUserMessage3(selectedPatterns);
    askBookingNumberfrightawb(selectedPatterns);

    checkboxes.forEach(function(checkbox) {
        checkbox.checked = false;
    });
    var botMessageCheck = document.querySelector('.bot-message-check-frightawb');
    if (botMessageCheck) {
        botMessageCheck.remove();
    }
}

function sendCheckboxValuesselling() {

    selectedPatterns = [];

    var checkboxes = document.querySelectorAll('.checkbox-group input[type="checkbox"]');

    checkboxes.forEach(function(checkbox) {
        if (checkbox.checked) {
            var labelText = document.querySelector('label[for="' + checkbox.id + '"]').textContent.trim();
            selectedPatterns.push(labelText);
        }
    });

    console.log(selectedPatterns);
    simpleUserMessage3(selectedPatterns);
    askBookingNumberselling(selectedPatterns);

    checkboxes.forEach(function(checkbox) {
        checkbox.checked = false;
    });
    var botMessageCheck = document.querySelector('.bot-message-check-buy');
    if (botMessageCheck) {
        botMessageCheck.remove();
    }
}

function sendCheckboxValuesbuying() {

    selectedPatterns = [];

    var checkboxes = document.querySelectorAll('.checkbox-group input[type="checkbox"]');

    checkboxes.forEach(function(checkbox) {
        if (checkbox.checked) {
            var labelText = document.querySelector('label[for="' + checkbox.id + '"]').textContent.trim();
            selectedPatterns.push(labelText);
        }
    });

    console.log(selectedPatterns);
    simpleUserMessage3(selectedPatterns);
    askBookingNumberbuying(selectedPatterns);

    checkboxes.forEach(function(checkbox) {
        checkbox.checked = false;
    });
    var botMessageCheck = document.querySelector('.bot-message-check-selling');
    if (botMessageCheck) {
        botMessageCheck.remove();
    }
}

function sendCheckboxValuesreceipts() {

    selectedPatterns = [];

    var checkboxes = document.querySelectorAll('.checkbox-group input[type="checkbox"]');

    checkboxes.forEach(function(checkbox) {
        if (checkbox.checked) {
            var labelText = document.querySelector('label[for="' + checkbox.id + '"]').textContent.trim();
            selectedPatterns.push(labelText);
        }
    });

    console.log(selectedPatterns);
    simpleUserMessage3(selectedPatterns);
    askBookingNumberreceipts(selectedPatterns);

    checkboxes.forEach(function(checkbox) {
        checkbox.checked = false;
    });
    var botMessageCheck = document.querySelector('.bot-message-check-receipts');
    if (botMessageCheck) {
        botMessageCheck.remove();
    }
}

function sendCheckboxValuespay() {

    selectedPatterns = [];

    var checkboxes = document.querySelectorAll('.checkbox-group input[type="checkbox"]');

    checkboxes.forEach(function(checkbox) {
        if (checkbox.checked) {
            var labelText = document.querySelector('label[for="' + checkbox.id + '"]').textContent.trim();
            selectedPatterns.push(labelText);
        }
    });

    console.log(selectedPatterns);
    simpleUserMessage3(selectedPatterns);
    askBookingNumberpay(selectedPatterns);

    checkboxes.forEach(function(checkbox) {
        checkbox.checked = false;
    });
    var botMessageCheck = document.querySelector('.bot-message-check-pay');
    if (botMessageCheck) {
        botMessageCheck.remove();
    }
}

function sendCheckboxValuescustom() {

    selectedPatterns = [];

    var checkboxes = document.querySelectorAll('.checkbox-group input[type="checkbox"]');

    checkboxes.forEach(function(checkbox) {
        if (checkbox.checked) {
            var labelText = document.querySelector('label[for="' + checkbox.id + '"]').textContent.trim();
            selectedPatterns.push(labelText);
        }
    });

    console.log(selectedPatterns);
    simpleUserMessage3(selectedPatterns);
    askBookingNumbercustom(selectedPatterns);

    checkboxes.forEach(function(checkbox) {
        checkbox.checked = false;
    });
    var botMessageCheck = document.querySelector('.bot-message-check-custom');
    if (botMessageCheck) {
        botMessageCheck.remove();
    }
}

function sendCheckboxValuestrp() {

    selectedPatterns = [];

    var checkboxes = document.querySelectorAll('.checkbox-group input[type="checkbox"]');

    checkboxes.forEach(function(checkbox) {
        if (checkbox.checked) {
            var labelText = document.querySelector('label[for="' + checkbox.id + '"]').textContent.trim();
            selectedPatterns.push(labelText);
        }
    });

    console.log(selectedPatterns);
    simpleUserMessage3(selectedPatterns);
    askBookingNumbertrp(selectedPatterns);

    checkboxes.forEach(function(checkbox) {
        checkbox.checked = false;
    });
    var botMessageCheck = document.querySelector('.bot-message-check-trp');
    if (botMessageCheck) {
        botMessageCheck.remove();
    }
}

function sendCheckboxValuescustomSB() {

    selectedPatterns = [];

    var checkboxes = document.querySelectorAll('.checkbox-group input[type="checkbox"]');

    checkboxes.forEach(function(checkbox) {
        if (checkbox.checked) {
            var labelText = document.querySelector('label[for="' + checkbox.id + '"]').textContent.trim();
            selectedPatterns.push(labelText);
        }
    });

    console.log(selectedPatterns);
    simpleUserMessage3(selectedPatterns);
    askBookingNumbercustomSB(selectedPatterns);

    checkboxes.forEach(function(checkbox) {
        checkbox.checked = false;
    });
    var botMessageCheck = document.querySelector('.bot-message-check-customSB');
    if (botMessageCheck) {
        botMessageCheck.remove();
    }
}

function sendCheckboxValuescustomBE() {

    selectedPatterns = [];

    var checkboxes = document.querySelectorAll('.checkbox-group input[type="checkbox"]');

    checkboxes.forEach(function(checkbox) {
        if (checkbox.checked) {
            var labelText = document.querySelector('label[for="' + checkbox.id + '"]').textContent.trim();
            selectedPatterns.push(labelText);
        }
    });

    console.log(selectedPatterns);
    simpleUserMessage3(selectedPatterns);
    askBookingNumbercustomBE(selectedPatterns);

    checkboxes.forEach(function(checkbox) {
        checkbox.checked = false;
    });
    var botMessageCheck = document.querySelector('.bot-message-check-customBE');
    if (botMessageCheck) {
        botMessageCheck.remove();
    }
}

function sendCheckboxValuesenquiry() {

    selectedPatterns = [];

    var checkboxes = document.querySelectorAll('.checkbox-group input[type="checkbox"]');

    checkboxes.forEach(function(checkbox) {
        if (checkbox.checked) {
            var labelText = document.querySelector('label[for="' + checkbox.id + '"]').textContent.trim();
            selectedPatterns.push(labelText);
        }
    });

    console.log(selectedPatterns);
    simpleUserMessage3(selectedPatterns);
    enquiry(selectedPatterns);

    checkboxes.forEach(function(checkbox) {
        checkbox.checked = false;
    });
    var botMessageCheck = document.querySelector('.bot-message-check-enquiry');
    if (botMessageCheck) {
        botMessageCheck.remove();
    }
}

function sendCheckboxValuesquotation() {

    selectedPatterns = [];

    var checkboxes = document.querySelectorAll('.checkbox-group input[type="checkbox"]');

    checkboxes.forEach(function(checkbox) {
        if (checkbox.checked) {
            var labelText = document.querySelector('label[for="' + checkbox.id + '"]').textContent.trim();
            selectedPatterns.push(labelText);
        }
    });

    console.log(selectedPatterns);
    simpleUserMessage3(selectedPatterns);
    quotation(selectedPatterns);

    checkboxes.forEach(function(checkbox) {
        checkbox.checked = false;
    });
    var botMessageCheck = document.querySelector('.bot-message-check-quotation');
    if (botMessageCheck) {
        botMessageCheck.remove();
    }
}

function fromDateToDateCheck() {
    var fromDateCheckbox = document.getElementById("fromDateCheckbox");
    var toDateCheckbox = document.getElementById("toDateCheckbox");

    fromDateCheckbox.addEventListener("change", function() {
        if (fromDateCheckbox.checked) {
            toDateCheckbox.checked = true;
        } else {
            toDateCheckbox.checked = false;
        }
    });

    toDateCheckbox.addEventListener("change", function() {
        if (toDateCheckbox.checked) {
            fromDateCheckbox.checked = true;
        } else {
            fromDateCheckbox.checked = false;
        }
    });
}

function fromDateToDateCheck2() {
    var fromDateCheckbox = document.getElementById("bkfromDateCheckbox");
    var toDateCheckbox = document.getElementById("bktoDateCheckbox");

    fromDateCheckbox.addEventListener("change", function() {
        if (fromDateCheckbox.checked) {
            toDateCheckbox.checked = true;
        } else {
            toDateCheckbox.checked = false;
        }
    });

    toDateCheckbox.addEventListener("change", function() {
        if (toDateCheckbox.checked) {
            fromDateCheckbox.checked = true;
        } else {
            fromDateCheckbox.checked = false;
        }
    });
}

function directIndirect() {
    var indirectCheckbox = document.getElementById("indirectCheckbox");
    var directCheckbox = document.getElementById("directCheckbox");

    indirectCheckbox.addEventListener("change", function() {
        if (indirectCheckbox.checked) {
            directCheckbox.checked = false;
        } else {
            directCheckbox.checked = true;
        }
    });

    directCheckbox.addEventListener("change", function() {
        if (directCheckbox.checked) {
            indirectCheckbox.checked = false;
        } else {
            indirectCheckbox.checked = true;
        }
    });
}

function sendPattern(pattern) {
    if (pattern.toLowerCase() === 'lead') {
        var responseHTML = `What specific criteria are you looking to use in your <b>lead</b> search?`;
        var typingSpeed = 1e-15;
        var botMessageHTML = `<div class="message-container"><div class="bot-avatar"><div id="dp" data-bs-toggle="modal" data-bs-target="#modalPopup">
            <img id="thumbnail" src="https://betatest.ezeeshipping.in/assets/img/EZ_New_LogoAboveText.png" alt="EzeeBot Logo" style="width: 90%; height: 90%; margin-top: 1.2px; margin-left: 0.8px; object-fit: contain; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); clip-path: inset(0 0 8px 0);">
        </div></div><div class="bot-message-chat typinglead">`;
        chatContainer.innerHTML += botMessageHTML;
        var currentTime = new Date().toLocaleTimeString();
        var botTimeHTML = '<div class="bot-time">' + 'EZEEBOT , ' + currentTime + '</div>';

        function typeWriter() {
            var botMessageElement = chatContainer.querySelector('.bot-message-chat.typinglead');
            botMessageElement.innerHTML = responseHTML.substring(0, index);
            index++;
                                
            if (index <= responseHTML.length) {
                setTimeout(typeWriter, typingSpeed * 1000);
                scrollToBottom();
            } else {
                botMessageElement.classList.remove('typing');
                scrollToBottom();
                chatContainer.innerHTML += botTimeHTML;
                chatContainer.innerHTML += '<div class="bot-message-check-lead">'+
                        '<div>' +
                            '<div class="checkbox-group row">' +
                                '<div class="column col-3">' +
                                    '<label for="leadcompanyCheckbox" class="form-check">' +
                                        '<input type="checkbox" id="leadcompanyCheckbox" class="form-check-input">' +
                                        '<span class="form-check-label">Company Name</span>' +
                                    '</label>' +
                                    '<label for="leadsalesCheckbox" class="form-check">' +
                                        '<input type="checkbox" id="leadsalesCheckbox" class="form-check-input">' +
                                        '<span class="form-check-label">Sales Executive</span>' +
                                    '</label>' +
                                '</div>' +
                                '<div class="column col-3">' +
                                    '<label for="fromDateCheckbox" class="form-check">' +
                                        '<input type="checkbox" id="fromDateCheckbox" class="form-check-input">' +
                                        '<span class="form-check-label">From Date</span>' +
                                    '</label>' +
                                    '<label for="toDateCheckbox" class="form-check">' +
                                        '<input type="checkbox" id="toDateCheckbox" class="form-check-input">' +
                                        '<span class="form-check-label">To Date</span>' +
                                    '</label>' +
                                '</div>' +
                            '</div>' +
                            '<button onclick="sendCheckboxValueslead()" class="sub-butn">Confirm</button>' +
                        '</div>'+
                    '</div>';
                scrollToBottom();
                fromDateToDateCheck();
            }
        }
                                
        var index = 0;
                                
        typeWriter();                                                               
    } else if (pattern.toLowerCase() === 'enquiry') {
        var responseHTML = `What specific criteria are you looking to use in your <b>enquiry</b> search?`;
        var typingSpeed = 1e-15;
        var botMessageHTML = `<div class="message-container"><div class="bot-avatar"><div id="dp" data-bs-toggle="modal" data-bs-target="#modalPopup">
            <img id="thumbnail" src="https://betatest.ezeeshipping.in/assets/img/EZ_New_LogoAboveText.png" alt="EzeeBot Logo" style="width: 90%; height: 90%; margin-top: 1.2px; margin-left: 0.8px; object-fit: contain; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); clip-path: inset(0 0 8px 0);">
        </div></div><div class="bot-message-chat typingenq">`;
        chatContainer.innerHTML += botMessageHTML;
        var currentTime = new Date().toLocaleTimeString();
        var botTimeHTML = '<div class="bot-time">' + 'EZEEBOT , ' + currentTime + '</div>';

        function typeWriter() {
            var botMessageElement = chatContainer.querySelector('.bot-message-chat.typingenq');
            botMessageElement.innerHTML = responseHTML.substring(0, index);
            index++;
                                
            if (index <= responseHTML.length) {
                setTimeout(typeWriter, typingSpeed * 1000);
                scrollToBottom();
            } else {
                botMessageElement.classList.remove('typing');
                scrollToBottom();
                chatContainer.innerHTML += botTimeHTML;
                chatContainer.innerHTML += '<div class="bot-message-check-enquiry">'+
                        '<div>' +
                            '<div class="checkbox-group row">' +
                                '<div class="column col-3">' +
                                    '<div class="form-check">' +
                                        '<input class="form-check-input" type="checkbox" id="enquiryenqnoCheckbox">' +
                                        '<label class="form-check-label" for="enquiryenqnoCheckbox">Enquiry Number</label>' +
                                    '</div>' +
                                    '<div class="form-check">' +
                                        '<input class="form-check-input" type="checkbox" id="enquirycontactnameCheckbox">' +
                                        '<label class="form-check-label" for="enquirycontactnameCheckbox">Contact Name</label>' +
                                    '</div>' +
                                '</div>' +
                                '<div class="column col-3">' +
                                    '<div class="form-check">' +
                                        '<input class="form-check-input" type="checkbox" id="fromDateCheckbox">' +
                                        '<label class="form-check-label" for="fromDateCheckbox">From Date</label>' +
                                    '</div>' +
                                    '<div class="form-check">' +
                                        '<input class="form-check-input" type="checkbox" id="toDateCheckbox">' +
                                        '<label class="form-check-label" for="toDateCheckbox">To Date</label>' +
                                    '</div>' +
                                '</div>' +
                                '<div class="column col-3">' +
                                    '<div class="form-check">' +
                                        '<input class="form-check-input" type="checkbox" id="enquirycompanyCheckbox">' +
                                        '<label class="form-check-label" for="enquirycompanyCheckbox">Company</label>' +
                                    '</div>' +
                                '</div>' +
                            '</div>' +
                            '<button class="sub-butn" onclick="sendCheckboxValuesenquiry()">Confirm</button>' +
                        '</div>'+
                    '</div>';
                scrollToBottom();
                fromDateToDateCheck();
            }
        }
                                
        var index = 0;
                                
        typeWriter();                                
    } else if (pattern.toLowerCase() === 'quotation') {
        var responseHTML = `What specific criteria are you looking to use in your <b>quotation</b> search?`;
        var typingSpeed = 1e-15;
        var botMessageHTML = `<div class="message-container"><div class="bot-avatar"><div id="dp" data-bs-toggle="modal" data-bs-target="#modalPopup">
            <img id="thumbnail" src="https://betatest.ezeeshipping.in/assets/img/EZ_New_LogoAboveText.png" alt="EzeeBot Logo" style="width: 90%; height: 90%; margin-top: 1.2px; margin-left: 0.8px; object-fit: contain; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); clip-path: inset(0 0 8px 0);">
        </div></div><div class="bot-message-chat typingquo">`;
        chatContainer.innerHTML += botMessageHTML;
        var currentTime = new Date().toLocaleTimeString();
        var botTimeHTML = '<div class="bot-time">' + 'EZEEBOT , ' + currentTime + '</div>';

        function typeWriter() {
            var botMessageElement = chatContainer.querySelector('.bot-message-chat.typingquo');
            botMessageElement.innerHTML = responseHTML.substring(0, index);
            index++;
                                
            if (index <= responseHTML.length) {
                setTimeout(typeWriter, typingSpeed * 1000);
                scrollToBottom();
            } else {
                botMessageElement.classList.remove('typing');
                scrollToBottom();
                chatContainer.innerHTML += botTimeHTML;
                chatContainer.innerHTML += '<div class="bot-message-check-quotation">'+
                        '<div>' +
                            '<div class="checkbox-group row">' +
                                '<div class="column col-3">' +
                                    '<div class="form-check">' +
                                        '<input class="form-check-input" type="checkbox" id="quotationquonoCheckbox">' +
                                        '<label class="form-check-label" for="quotationquonoCheckbox">Quotation Number</label>' +
                                    '</div>' +
                                    '<div class="form-check">' +
                                        '<input class="form-check-input" type="checkbox" id="quotationquorefnoCheckbox">' +
                                        '<label class="form-check-label" for="quotationquorefnoCheckbox">Quotation Ref</label>' +
                                    '</div>' +
                                '</div>' +
                                '<div class="column col-3">' +
                                    '<div class="form-check">' +
                                        '<input class="form-check-input" type="checkbox" id="quotationcontactnameCheckbox">' +
                                        '<label class="form-check-label" for="quotationcontactnameCheckbox">Contact Name</label>' +
                                    '</div>' +
                                    '<div class="form-check">' +
                                        '<input class="form-check-input" type="checkbox" id="quotationcompanyCheckbox">' +
                                        '<label class="form-check-label" for="quotationcompanyCheckbox">Company</label>' +
                                    '</div>' +
                                '</div>' +
                                '<div class="column col-3">' +
                                    '<div class="form-check">' +
                                        '<input class="form-check-input" type="checkbox" id="fromDateCheckbox">' +
                                        '<label class="form-check-label" for="fromDateCheckbox">From Date</label>' +
                                    '</div>' +
                                    '<div class="form-check">' +
                                        '<input class="form-check-input" type="checkbox" id="toDateCheckbox">' +
                                        '<label class="form-check-label" for="toDateCheckbox">To Date</label>' +
                                    '</div>' +
                                '</div>' +
                            '</div>' +
                            '<button class="sub-butn" onclick="sendCheckboxValuesquotation()">Confirm</button>' +
                        '</div>'+
                    '</div>'; 
                scrollToBottom();
                fromDateToDateCheck();
            }
        }
                                
        var index = 0;
                                
        typeWriter();                         
    } else if (pattern.toLowerCase() === 'payments') {
        var responseHTML = `What specific criteria are you looking to use in your <b>payments</b> search?`;
        var typingSpeed = 1e-15;
        var botMessageHTML = `<div class="message-container"><div class="bot-avatar"><div id="dp" data-bs-toggle="modal" data-bs-target="#modalPopup">
            <img id="thumbnail" src="https://betatest.ezeeshipping.in/assets/img/EZ_New_LogoAboveText.png" alt="EzeeBot Logo" style="width: 90%; height: 90%; margin-top: 1.2px; margin-left: 0.8px; object-fit: contain; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); clip-path: inset(0 0 8px 0);">
        </div></div><div class="bot-message-chat typingpay">`;
        chatContainer.innerHTML += botMessageHTML;
        var currentTime = new Date().toLocaleTimeString();
        var botTimeHTML = '<div class="bot-time">' + 'EZEEBOT , ' + currentTime + '</div>';

        function typeWriter() {
            var botMessageElement = chatContainer.querySelector('.bot-message-chat.typingpay');
            botMessageElement.innerHTML = responseHTML.substring(0, index);
            index++;
                                
            if (index <= responseHTML.length) {
                setTimeout(typeWriter, typingSpeed * 1000);
                scrollToBottom();
            } else {
                botMessageElement.classList.remove('typing');
                scrollToBottom();
                chatContainer.innerHTML += botTimeHTML;
                chatContainer.innerHTML += '<div class="bot-message-check-pay">'+
                        '<div>' +
                            '<div class="checkbox-group row">' +
                                '<div class="column col-3">' +
                                    '<div class="form-check">' +
                                        '<input class="form-check-input" type="checkbox" id="payamountCheckbox">' +
                                        '<label class="form-check-label" for="payamountCheckbox">Amount</label>' +
                                    '</div>' +
                                    '<div class="form-check">' +
                                        '<input class="form-check-input" type="checkbox" id="paychequeCheckbox">' +
                                        '<label class="form-check-label" for="paychequeCheckbox">Cheque Number</label>' +
                                    '</div>' +
                                    '<div class="form-check">' +
                                        '<input class="form-check-input" type="checkbox" id="paynameCheckbox">' +
                                        '<label class="form-check-label" for="paynameCheckbox">Payable To</label>' +
                                    '</div>' +
                                '</div>' +
                                '<div class="column col-3">' +
                                    '<div class="form-check">' +
                                        '<input class="form-check-input" type="checkbox" id="fromDateCheckbox">' +
                                        '<label class="form-check-label" for="fromDateCheckbox">From Date</label>' +
                                    '</div>' +
                                    '<div class="form-check">' +
                                        '<input class="form-check-input" type="checkbox" id="toDateCheckbox">' +
                                        '<label class="form-check-label" for="toDateCheckbox">To Date</label>' +
                                    '</div>' +
                                '</div>' +
                                '<div class="column col-3">' +
                                    '<div class="form-check">' +
                                        '<input class="form-check-input" type="checkbox" id="paybookingCheckbox">' +
                                        '<label class="form-check-label" for="paybookingCheckbox">Booking Number</label>' +
                                    '</div>' +
                                    '<div class="form-check">' +
                                        '<input class="form-check-input" type="checkbox" id="paybillCheckbox">' +
                                        '<label class="form-check-label" for="paybillCheckbox">Bill Number</label>' +
                                    '</div>' +
                                '</div>' +
                            '</div>' +
                            '<button class="sub-butn" onclick="sendCheckboxValuespay()">Confirm</button>' +
                        '</div>'+
                    '</div>';
                scrollToBottom();
                fromDateToDateCheck(); 
            }
        }
                                
        var index = 0;
                                
        typeWriter();                          
    } else if (pattern.toLowerCase() === 'receipts') {
        var responseHTML = `What specific criteria are you looking to use in your <b>receipts</b> search?`;
        var typingSpeed = 1e-15;
        var botMessageHTML = `<div class="message-container"><div class="bot-avatar"><div id="dp" data-bs-toggle="modal" data-bs-target="#modalPopup">
            <img id="thumbnail" src="https://betatest.ezeeshipping.in/assets/img/EZ_New_LogoAboveText.png" alt="EzeeBot Logo" style="width: 90%; height: 90%; margin-top: 1.2px; margin-left: 0.8px; object-fit: contain; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); clip-path: inset(0 0 8px 0);">
        </div></div><div class="bot-message-chat typingres">`;
        chatContainer.innerHTML += botMessageHTML;
        var currentTime = new Date().toLocaleTimeString();
        var botTimeHTML = '<div class="bot-time">' + 'EZEEBOT , ' + currentTime + '</div>';

        function typeWriter() {
            var botMessageElement = chatContainer.querySelector('.bot-message-chat.typingres');
            botMessageElement.innerHTML = responseHTML.substring(0, index);
            index++;
                                
            if (index <= responseHTML.length) {
                setTimeout(typeWriter, typingSpeed * 1000);
                scrollToBottom();
            } else {
                botMessageElement.classList.remove('typing');
                scrollToBottom();
                chatContainer.innerHTML += botTimeHTML;
                chatContainer.innerHTML += '<div class="bot-message-check-receipts">'+
                        '<div>' +
                            '<div class="checkbox-group row">' +
                                '<div class="column col-3">' +
                                    '<div class="form-check">' +
                                        '<input class="form-check-input" type="checkbox" id="recieptsamountCheckbox">' +
                                        '<label class="form-check-label" for="recieptsamountCheckbox">Amount</label>' +
                                    '</div>' +
                                    '<div class="form-check">' +
                                        '<input class="form-check-input" type="checkbox" id="receiptfromCheckbox">' +
                                        '<label class="form-check-label" for="receiptfromCheckbox">Receipt From</label>' +
                                    '</div>' +
                                '</div>'+
                                '<div class="column col-3">' +
                                    '<div class="form-check">' +
                                        '<input class="form-check-input" type="checkbox" id="fromDateCheckbox">' +
                                        '<label class="form-check-label" for="fromDateCheckbox">From Date</label>' +
                                    '</div>' +
                                    '<div class="form-check">' +
                                        '<input class="form-check-input" type="checkbox" id="toDateCheckbox">' +
                                        '<label class="form-check-label" for="toDateCheckbox">To Date</label>' +
                                    '</div>' +
                                '</div>' +
                                '<div class="column col-3">' +
                                    '<div class="form-check">' +
                                        '<input class="form-check-input" type="checkbox" id="recieptsbookingnoCheckbox">' +
                                        '<label class="form-check-label" for="recieptsbookingnoCheckbox">Booking Number</label>' +
                                    '</div>' +
                                    '<div class="form-check">' +
                                        '<input class="form-check-input" type="checkbox" id="recieptsbillnoCheckbox">' +
                                        '<label class="form-check-label" for="recieptsbillnoCheckbox">Bill Number</label>' +
                                    '</div>' +
                                '</div>' +
                            '</div>' +
                            '<button class="sub-butn" onclick="sendCheckboxValuesreceipts()">Confirm</button>' +
                        '</div>'+
                    '</div>';
                scrollToBottom();
                fromDateToDateCheck();
            }
        }
                                
        var index = 0;
                                
        typeWriter();                          
    } else if (pattern.toLowerCase() === 'buying') {
        var responseHTML = `What specific criteria are you looking to use in your <b>buying</b> search?`;
        var typingSpeed = 1e-15;
        var botMessageHTML = `<div class="message-container"><div class="bot-avatar"><div id="dp" data-bs-toggle="modal" data-bs-target="#modalPopup">
            <img id="thumbnail" src="https://betatest.ezeeshipping.in/assets/img/EZ_New_LogoAboveText.png" alt="EzeeBot Logo" style="width: 90%; height: 90%; margin-top: 1.2px; margin-left: 0.8px; object-fit: contain; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); clip-path: inset(0 0 8px 0);">
        </div></div><div class="bot-message-chat typingbuy">`;
        chatContainer.innerHTML += botMessageHTML;
        var currentTime = new Date().toLocaleTimeString();
        var botTimeHTML = '<div class="bot-time">' + 'EZEEBOT , ' + currentTime + '</div>';

        function typeWriter() {
            var botMessageElement = chatContainer.querySelector('.bot-message-chat.typingbuy');
            botMessageElement.innerHTML = responseHTML.substring(0, index);
            index++;
                                
            if (index <= responseHTML.length) {
                setTimeout(typeWriter, typingSpeed * 1000);
                scrollToBottom();
            } else {
                botMessageElement.classList.remove('typing');
                scrollToBottom();
                chatContainer.innerHTML += botTimeHTML;
                chatContainer.innerHTML += '<div class="bot-message-check-buy">'+
                        '<div>' +
                            '<div class="checkbox-group row">' +
                                '<div class="column col-3">' +
                                    '<div class="form-check">' +
                                        '<input class="form-check-input" type="checkbox" id="indirectCheckbox">' +
                                        '<label class="form-check-label" for="indirectCheckbox">Indirect Purchase</label>' +
                                    '</div>' +
                                    '<div class="form-check">' +
                                        '<input class="form-check-input" type="checkbox" id="directCheckbox" checked>' +
                                        '<label class="form-check-label" for="directCheckbox">Direct Purchase</label>' +
                                    '</div>' +
                                '</div>' +
                                '<div class="column col-3">' +
                                    '<div class="form-check">' +
                                        '<input class="form-check-input" type="checkbox" id="fromDateCheckbox">' +
                                        '<label class="form-check-label" for="fromDateCheckbox">From Date</label>' +
                                    '</div>' +
                                    '<div class="form-check">' +
                                        '<input class="form-check-input" type="checkbox" id="toDateCheckbox">' +
                                        '<label class="form-check-label" for="toDateCheckbox">To Date</label>' +
                                    '</div>' +
                                '</div>' +
                                '<div class="column col-3">' +
                                    '<div class="form-check">' +
                                        '<input class="form-check-input" type="checkbox" id="buyingcompanyCheckbox">' +
                                        '<label class="form-check-label" for="buyingcompanyCheckbox">Company</label>' +
                                    '</div>' +
                                '</div>' +
                            '</div>' +
                            '<button class="sub-butn" onclick="sendCheckboxValuesselling()">Confirm</button>' +
                        '</div>'+
                    '</div>'; 
                scrollToBottom();
                fromDateToDateCheck();
                directIndirect();
            }
        }
                                
        var index = 0;
                                
        typeWriter();                          
    } else if (pattern.toLowerCase() === 'selling') {
        var responseHTML = `What specific criteria are you looking to use in your <b>selling</b> search?`;
        var typingSpeed = 1e-15;
        var botMessageHTML = `<div class="message-container"><div class="bot-avatar"><div id="dp" data-bs-toggle="modal" data-bs-target="#modalPopup">
            <img id="thumbnail" src="https://betatest.ezeeshipping.in/assets/img/EZ_New_LogoAboveText.png" alt="EzeeBot Logo" style="width: 90%; height: 90%; margin-top: 1.2px; margin-left: 0.8px; object-fit: contain; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); clip-path: inset(0 0 8px 0);">
        </div></div><div class="bot-message-chat typingsell">`;
        chatContainer.innerHTML += botMessageHTML;
        var currentTime = new Date().toLocaleTimeString();
        var botTimeHTML = '<div class="bot-time">' + 'EZEEBOT , ' + currentTime + '</div>';

        function typeWriter() {
            var botMessageElement = chatContainer.querySelector('.bot-message-chat.typingsell');
            botMessageElement.innerHTML = responseHTML.substring(0, index);
            index++;
                                
            if (index <= responseHTML.length) {
                setTimeout(typeWriter, typingSpeed * 1000);
                scrollToBottom();
            } else {
                botMessageElement.classList.remove('typing');
                scrollToBottom();
                chatContainer.innerHTML += botTimeHTML;
                chatContainer.innerHTML += '<div class="bot-message-check-selling">'+
                        '<div>' +
                            '<div class="checkbox-group row">' +
                                '<div class="column col-2">' +
                                    '<div class="form-check">' +
                                        '<input class="form-check-input" type="checkbox" id="billnoCheckbox">' +
                                        '<label class="form-check-label" for="billnoCheckbox">Bill Number</label>' +
                                    '</div>' +
                                    '<div class="form-check">' +
                                        '<input class="form-check-input" type="checkbox" id="bookingnoCheckbox">' +
                                        '<label class="form-check-label" for="bookingnoCheckbox">Booking Number</label>' +
                                    '</div>' +
                                    '<div class="form-check">' +
                                        '<input class="form-check-input" type="checkbox" id="bookingrefCheckbox">' +
                                        '<label class="form-check-label" for="bookingrefCheckbox">Booking Ref</label>' +
                                    '</div>' +
                                    '<div class="form-check">' +
                                        '<input class="form-check-input" type="checkbox" id="invoicenoCheckbox">' +
                                        '<label class="form-check-label" for="invoicenoCheckbox">Invoice Number</label>' +
                                    '</div>' +
                                '</div>' +
                                '<div class="column col-2">' +
                                    '<div class="form-check">' +
                                        '<input class="form-check-input" type="checkbox" id="companynameCheckbox">' +
                                        '<label class="form-check-label" for="companynameCheckbox">Company Name</label>' +
                                    '</div>' +
                                    '<div class="form-check">' +
                                        '<input class="form-check-input" type="checkbox" id="fromDateCheckbox">' +
                                        '<label class="form-check-label" for="fromDateCheckbox">From Date</label>' +
                                    '</div>' +
                                    '<div class="form-check">' +
                                        '<input class="form-check-input" type="checkbox" id="toDateCheckbox">' +
                                        '<label class="form-check-label" for="toDateCheckbox">To Date</label>' +
                                    '</div>' +
                                    '<div class="form-check">' +
                                        '<input class="form-check-input" type="checkbox" id="containernoCheckbox">' +
                                        '<label class="form-check-label" for="containernoCheckbox">Container Number</label>' +
                                    '</div>' +
                                '</div>' +
                                '<div class="column col-2">' +
                                    '<div class="form-check">' +
                                        '<input class="form-check-input" type="checkbox" id="sbnoCheckbox">' +
                                        '<label class="form-check-label" for="sbnoCheckbox">SB Number</label>' +
                                    '</div>' +
                                    '<div class="form-check">' +
                                        '<input class="form-check-input" type="checkbox" id="benoCheckbox">' +
                                        '<label class="form-check-label" for="benoCheckbox">BE Number</label>' +
                                    '</div>' +
                                    '<div class="form-check">' +
                                        '<input class="form-check-input" type="checkbox" id="hblnoCheckbox">' +
                                        '<label class="form-check-label" for="hblnoCheckbox">HBL Number</label>' +
                                    '</div>' +
                                    '<div class="form-check">' +
                                        '<input class="form-check-input" type="checkbox" id="mblnoCheckbox">' +
                                        '<label class="form-check-label" for="mblnoCheckbox">MBL Number</label>' +
                                    '</div>' +
                                '</div>' +
                                '<div class="column col-2">' +
                                    '<div class="form-check">' +
                                        '<input class="form-check-input" type="checkbox" id="hawbnoCheckbox">' +
                                        '<label class="form-check-label" for="hawbnoCheckbox">HAWB Number</label>' +
                                    '</div>' +
                                    '<div class="form-check">' +
                                        '<input class="form-check-input" type="checkbox" id="mawbnoCheckbox">' +
                                        '<label class="form-check-label" for="mawbnoCheckbox">MAWB Number</label>' +
                                    '</div>' +
                                '</div>' +
                            '</div>' +
                            '<button class="sub-butn" onclick="sendCheckboxValuesbuying()">Confirm</button>' +
                        '</div>'+
                    '</div>'; 
                scrollToBottom();
                fromDateToDateCheck();
            }
        }
                                
        var index = 0;
                                
        typeWriter();
    } else if (pattern.toLowerCase() === 'freight forwarding') {
        var responseHTML = `What specific criteria are you looking to use in your <b>freight forwarding</b> search?`;
        var typingSpeed = 1e-15;
        var buttonsHTML = `
            <div id="patterns">
                <button onclick="sendUserMessage2(\'ffrbooking\');">bookings</button>
                <button onclick="sendUserMessage2(\'billoflad\');">bill of lading</button>
                <button onclick="sendUserMessage2(\'awb\');">airway bills</button>
            </div>
        `;
        var botMessageHTML = `<div class="message-container"><div class="bot-avatar"><div id="dp" data-bs-toggle="modal" data-bs-target="#modalPopup">
            <img id="thumbnail" src="https://betatest.ezeeshipping.in/assets/img/EZ_New_LogoAboveText.png" alt="EzeeBot Logo" style="width: 90%; height: 90%; margin-top: 1.2px; margin-left: 0.8px; object-fit: contain; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); clip-path: inset(0 0 8px 0);">
        </div></div><div class="bot-message-chat typingffr">`;
        chatContainer.innerHTML += botMessageHTML;
        var currentTime = new Date().toLocaleTimeString();
        var botTimeHTML = '<div class="bot-time">' + 'EZEEBOT , ' + currentTime + '</div>';

        function typeWriter() {
            var botMessageElement = chatContainer.querySelector('.bot-message-chat.typingffr');
            botMessageElement.innerHTML = responseHTML.substring(0, index);
            index++;
                                
            if (index <= responseHTML.length) {
                setTimeout(typeWriter, typingSpeed * 1000);
                scrollToBottom();
            } else {
                botMessageElement.classList.remove('typing');
                scrollToBottom();
                chatContainer.innerHTML += botTimeHTML;
                chatContainer.innerHTML += buttonsHTML; 
                scrollToBottom();
            }
        }
                                
        var index = 0;
                                
        typeWriter();
    } else if (pattern.toLowerCase() === 'customs broker') {
        var responseHTML = `What specific criteria are you looking to use in your <b>customs broker</b> search?`;
        var typingSpeed = 1e-15;
        var buttonsHTML = `
            <div id="patterns">
                <button onclick="sendUserMessage2(\'custombooking\');">bookings</button>
                <button onclick="sendUserMessageBooking(\'shipping bills\'); customShippingBills()">shipping bills</button>
                <button onclick="sendUserMessageBooking(\'bills of entry\'); customBillOfEntry()">bills of entry</button>
            </div>
        `;
        var botMessageHTML = `<div class="message-container"><div class="bot-avatar"><div id="dp" data-bs-toggle="modal" data-bs-target="#modalPopup">
            <img id="thumbnail" src="https://betatest.ezeeshipping.in/assets/img/EZ_New_LogoAboveText.png" alt="EzeeBot Logo" style="width: 90%; height: 90%; margin-top: 1.2px; margin-left: 0.8px; object-fit: contain; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); clip-path: inset(0 0 8px 0);">
        </div></div><div class="bot-message-chat typingchai">`;
        chatContainer.innerHTML += botMessageHTML;
        var currentTime = new Date().toLocaleTimeString();
        var botTimeHTML = '<div class="bot-time">' + 'EZEEBOT , ' + currentTime + '</div>';

        function typeWriter() {
            var botMessageElement = chatContainer.querySelector('.bot-message-chat.typingchai');
            botMessageElement.innerHTML = responseHTML.substring(0, index);
            index++;
                                
            if (index <= responseHTML.length) {
                setTimeout(typeWriter, typingSpeed * 1000);
                scrollToBottom();
            } else {
                botMessageElement.classList.remove('typing');
                scrollToBottom();
                chatContainer.innerHTML += botTimeHTML;
                chatContainer.innerHTML += buttonsHTML; 
                scrollToBottom();
            }
        }
                                
        var index = 0;
                                
        typeWriter();
    } else if (pattern.toLowerCase() === 'transport') {
        var responseHTML = `What specific criteria are you looking to use in your <b>transport</b> search?`;
        var typingSpeed = 1e-15;
        var buttonsHTML = `
            <div id="patterns">
                <button onclick="sendUserMessage2(\'trpbooking\');">bookings</button>
            </div>
        `;
        var botMessageHTML = `<div class="message-container"><div class="bot-avatar"><div id="dp" data-bs-toggle="modal" data-bs-target="#modalPopup">
            <img id="thumbnail" src="https://betatest.ezeeshipping.in/assets/img/EZ_New_LogoAboveText.png" alt="EzeeBot Logo" style="width: 90%; height: 90%; margin-top: 1.2px; margin-left: 0.8px; object-fit: contain; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); clip-path: inset(0 0 8px 0);">
        </div></div><div class="bot-message-chat typingchai">`;
        chatContainer.innerHTML += botMessageHTML;
        var currentTime = new Date().toLocaleTimeString();
        var botTimeHTML = '<div class="bot-time">' + 'EZEEBOT , ' + currentTime + '</div>';

        function typeWriter() {
            var botMessageElement = chatContainer.querySelector('.bot-message-chat.typingchai');
            botMessageElement.innerHTML = responseHTML.substring(0, index);
            index++;
                                
            if (index <= responseHTML.length) {
                setTimeout(typeWriter, typingSpeed * 1000);
                scrollToBottom();
            } else {
                botMessageElement.classList.remove('typing');
                scrollToBottom();
                chatContainer.innerHTML += botTimeHTML;
                chatContainer.innerHTML += buttonsHTML; 
                scrollToBottom();
            }
        }
                                
        var index = 0;
                                
        typeWriter();
    } else {
                    typingMessage();
                    fetch('/chat', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            user_input: {
                                'general': pattern,
                                'current_date': formattedDate,
                                'tenantid': tenantid,
                                'officeid': officeid,
                                'userid': userid
                            }
                        }),
                    })
                    .then(response => response.json())
                    .then(data => {
                        if (typeof showdown !== 'undefined') {
                        } else {
                            console.error("Showdown library is not loaded!");
                        }
                        if (data.response) {
                            var responseMarkdown = data.response;
                            var converter = new showdown.Converter();
                            var responseHTML = converter.makeHtml(responseMarkdown);
                            var typingSpeed = 0.01;
                            var botMessageHTML = `<div class="message-container"><div class="bot-avatar"><div id="dp" data-bs-toggle="modal" data-bs-target="#modalPopup">
                                <img id="thumbnail" src="https://betatest.ezeeshipping.in/assets/img/EZ_New_LogoAboveText.png" alt="EzeeBot Logo" style="width: 90%; height: 90%; margin-top: 1.2px; margin-left: 0.8px; object-fit: contain; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); clip-path: inset(0 0 8px 0);">
                            </div></div><div class="bot-message-chat-2 typing" style="line-height: 1.5;"></div></div>`;
                            chatContainer.innerHTML += botMessageHTML;
                            var currentTime = new Date().toLocaleTimeString();
                            var botTimeHTML = '<div class="bot-time">' + 'EZEEBOT , ' + currentTime + '</div>';

                            function typeWriter() {
                                var botMessageElement = chatContainer.querySelector('.bot-message-chat-2.typing');
                                var words = responseHTML.split(' ');
                                var currentText = words.slice(0, index).join(' ');
                                botMessageElement.innerHTML = currentText;
                                index++;  
                                
                                if (index <= words.length) {
                                    setTimeout(typeWriter, typingSpeed * 1000);
                                    scrollToBottom();
                                } else {
                                    botMessageElement.classList.remove('typing');
                                    scrollToBottom();
                                    chatContainer.innerHTML += botTimeHTML;
                                    scrollToBottom();
                                }
                            }
                        
                            var index = 0;
                        
                            typeWriter();
                            closeType();
                        } else{
                        var botMessageHTML = '<div class="message-container"><div class="bot-message">City not found, Check the spelling and try again.</div></div>';
                        chatContainer.innerHTML += botMessageHTML;
                        var currentTime = new Date().toLocaleTimeString();
                        var botTimeHTML = '<div class="bot-time">'+ 'EZEEBOT , ' + currentTime + '</div>';
                        chatContainer.innerHTML += botTimeHTML;
                        closeType();
                        scrollToBottom();
                    }
                    })
                    .catch(error => {
                        console.error('Error:', error);
                    });
                }
}

function customBooking(){
        var responseHTML = `In customs broker, What specific criteria are you looking to use in your <b>booking</b> search?`;
        var typingSpeed = 1e-15;
        var botMessageHTML = `<div class="message-container"><div class="bot-avatar"><div id="dp" data-bs-toggle="modal" data-bs-target="#modalPopup">
            <img id="thumbnail" src="https://betatest.ezeeshipping.in/assets/img/EZ_New_LogoAboveText.png" alt="EzeeBot Logo" style="width: 90%; height: 90%; margin-top: 1.2px; margin-left: 0.8px; object-fit: contain; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); clip-path: inset(0 0 8px 0);">
        </div></div><div class="bot-message-chat typingbook">`;
        chatContainer.innerHTML += botMessageHTML;
        var currentTime = new Date().toLocaleTimeString();
        var botTimeHTML = '<div class="bot-time">' + 'EZEEBOT , ' + currentTime + '</div>';

        function typeWriter() {
            var botMessageElement = chatContainer.querySelector('.bot-message-chat.typingbook');
            botMessageElement.innerHTML = responseHTML.substring(0, index);
            index++;
                                
            if (index <= responseHTML.length) {
                setTimeout(typeWriter, typingSpeed * 1000);
                scrollToBottom();
            } else {
                botMessageElement.classList.remove('typing');
                scrollToBottom();
                chatContainer.innerHTML += botTimeHTML;
                chatContainer.innerHTML += '<div class="bot-message-check-custom">'+
                        '<div>' +
                            '<div class="checkbox-group row">' +
                                '<div class="column col-2">' +
                                    '<div class="form-check">' +
                                        '<input class="form-check-input" type="checkbox" id="custombookingnoCheckbox">' +
                                        '<label class="form-check-label" for="custombookingnoCheckbox">Booking Number</label>' +
                                    '</div>' +
                                    '<div class="form-check">' +
                                        '<input class="form-check-input" type="checkbox" id="custombookingrefCheckbox">' +
                                        '<label class="form-check-label" for="custombookingrefCheckbox">Booking Ref</label>' +
                                    '</div>' +
                                    '<div class="form-check">' +
                                        '<input class="form-check-input" type="checkbox" id="custominvoicenoCheckbox">' +
                                        '<label class="form-check-label" for="custominvoicenoCheckbox">Invoice Number</label>' +
                                    '</div>' +
                                    '<div class="form-check">' +
                                        '<input class="form-check-input" type="checkbox" id="customlinerbkCheckbox">' +
                                        '<label class="form-check-label" for="customlinerbkCheckbox">Liner BK Number</label>' +
                                    '</div>' +
                                '</div>' +
                                '<div class="column col-2">' +
                                    '<div class="form-check">' +
                                        '<input class="form-check-input" type="checkbox" id="customcntrCheckbox">' +
                                        '<label class="form-check-label" for="customcntrCheckbox">CNTR Number</label>' +
                                    '</div>' +
                                    '<div class="form-check">' +
                                        '<input class="form-check-input" type="checkbox" id="customindentCheckbox">' +
                                        '<label class="form-check-label" for="customindentCheckbox">Indent Number</label>' +
                                    '</div>' +
                                    '<div class="form-check">' +
                                        '<input class="form-check-input" type="checkbox" id="customshipperrefCheckbox">' +
                                        '<label class="form-check-label" for="customshipperrefCheckbox">Shipper Ref</label>' +
                                    '</div>' +
                                    '<div class="form-check">' +
                                        '<input class="form-check-input" type="checkbox" id="customconsigneerefCheckbox">' +
                                        '<label class="form-check-label" for="customconsigneerefCheckbox">Consignee Ref</label>' +
                                    '</div>' +
                                '</div>' +
                                '<div class="column col-2">' +
                                    '<div class="form-check">' +
                                        '<input class="form-check-input" type="checkbox" id="fromDateCheckbox">' +
                                        '<label class="form-check-label" for="fromDateCheckbox">From Date</label>' +
                                    '</div>' +
                                    '<div class="form-check">' +
                                        '<input class="form-check-input" type="checkbox" id="toDateCheckbox">' +
                                        '<label class="form-check-label" for="toDateCheckbox">To Date</label>' +
                                    '</div>' +
                                    '<div class="form-check">' +
                                        '<input class="form-check-input" type="checkbox" id="customsbnoCheckbox">' +
                                        '<label class="form-check-label" for="customsbnoCheckbox">SB Number</label>' +
                                    '</div>' +
                                    '<div class="form-check">' +
                                        '<input class="form-check-input" type="checkbox" id="custombenoCheckbox">' +
                                        '<label class="form-check-label" for="custombenoCheckbox">BE Number</label>' +
                                    '</div>' +
                                '</div>' +
                                '<div class="column col-2">' +
                                    '<div class="form-check">' +
                                        '<input class="form-check-input" type="checkbox" id="customhblnoCheckbox">' +
                                        '<label class="form-check-label" for="customhblnoCheckbox">HBL/HAWB Number</label>' +
                                    '</div>' +
                                    '<div class="form-check">' +
                                        '<input class="form-check-input" type="checkbox" id="custommblnoCheckbox">' +
                                        '<label class="form-check-label" for="custommblnoCheckbox">MBL/MAWB Number</label>' +
                                    '</div>' +
                                    '<div class="form-check">' +
                                        '<input class="form-check-input" type="checkbox" id="customplrecipCheckbox">' +
                                        '<label class="form-check-label" for="customplrecipCheckbox">Place of Receipt</label>' +
                                    '</div>' +
                                    '<div class="form-check">' +
                                        '<input class="form-check-input" type="checkbox" id="custompldelCheckbox">' +
                                        '<label class="form-check-label" for="custompldelCheckbox">Place of Delivery</label>' +
                                    '</div>' +
                                '</div>' +
                            '</div>' +
                            '<button class="sub-butn" onclick="sendCheckboxValuescustom()">Confirm</button>' +
                        '</div>'+
                    '</div>'; 
                scrollToBottom();
                fromDateToDateCheck();
            }
        }
                                
        var index = 0;
                                
        typeWriter();
}

function trpBooking(){
    var responseHTML = `In transport, What specific criteria are you looking to use in your <b>booking</b> search?`;
    var typingSpeed = 1e-15;
    var botMessageHTML = `<div class="message-container"><div class="bot-avatar"><div id="dp" data-bs-toggle="modal" data-bs-target="#modalPopup">
        <img id="thumbnail" src="https://betatest.ezeeshipping.in/assets/img/EZ_New_LogoAboveText.png" alt="EzeeBot Logo" style="width: 90%; height: 90%; margin-top: 1.2px; margin-left: 0.8px; object-fit: contain; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); clip-path: inset(0 0 8px 0);">
    </div></div><div class="bot-message-chat typingbook">`;
    chatContainer.innerHTML += botMessageHTML;
    var currentTime = new Date().toLocaleTimeString();
    var botTimeHTML = '<div class="bot-time">' + 'EZEEBOT , ' + currentTime + '</div>';

    function typeWriter() {
        var botMessageElement = chatContainer.querySelector('.bot-message-chat.typingbook');
        botMessageElement.innerHTML = responseHTML.substring(0, index);
        index++;
                            
        if (index <= responseHTML.length) {
            setTimeout(typeWriter, typingSpeed * 1000);
            scrollToBottom();
        } else {
            botMessageElement.classList.remove('typing');
            scrollToBottom();
            chatContainer.innerHTML += botTimeHTML;
            chatContainer.innerHTML += '<div class="bot-message-check-trp">'+
                        '<div>' +
                            '<div class="checkbox-group row">' +
                                '<div class="column col-3">' +
                                    '<div class="form-check">' +
                                        '<input class="form-check-input" type="checkbox" id="custombookingnoCheckbox">' +
                                        '<label class="form-check-label" for="custombookingnoCheckbox">Booking Number</label>' +
                                    '</div>' +
                                    '<div class="form-check">' +
                                        '<input class="form-check-input" type="checkbox" id="custombookingrefCheckbox">' +
                                        '<label class="form-check-label" for="custombookingrefCheckbox">Booking Ref</label>' +
                                    '</div>' +
                                '</div>' +
                                '<div class="column col-3">' +
                                    '<div class="form-check">' +
                                        '<input class="form-check-input" type="checkbox" id="fromDateCheckbox">' +
                                        '<label class="form-check-label" for="fromDateCheckbox">From Date</label>' +
                                    '</div>' +
                                    '<div class="form-check">' +
                                        '<input class="form-check-input" type="checkbox" id="toDateCheckbox">' +
                                        '<label class="form-check-label" for="toDateCheckbox">To Date</label>' +
                                    '</div>' +
                                '</div>' +
                                '<div class="column col-3">' +
                                    '<div class="form-check">' +
                                        '<input class="form-check-input" type="checkbox" id="customcustnameCheckbox">' +
                                        '<label class="form-check-label" for="customcustnameCheckbox">Customer Name</label>' +
                                    '</div>' +
                                '</div>' +
                            '</div>' +
                            '<button class="sub-butn" onclick="sendCheckboxValuestrp()">Confirm</button>' +
                        '</div>'+
                    '</div>'; 
            scrollToBottom();
            fromDateToDateCheck();
        }
    }
                            
    var index = 0;
                            
    typeWriter();
}

function customShippingBills(){
    var responseHTML = `WIn customs broker, What specific criteria are you looking to use in your <b>shipping bills</b> search?`;
        var typingSpeed = 1e-15;
        var botMessageHTML = `<div class="message-container"><div class="bot-avatar"><div id="dp" data-bs-toggle="modal" data-bs-target="#modalPopup">
            <img id="thumbnail" src="https://betatest.ezeeshipping.in/assets/img/EZ_New_LogoAboveText.png" alt="EzeeBot Logo" style="width: 90%; height: 90%; margin-top: 1.2px; margin-left: 0.8px; object-fit: contain; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); clip-path: inset(0 0 8px 0);">
        </div></div><div class="bot-message-chat typingsb">`;
        chatContainer.innerHTML += botMessageHTML;
        var currentTime = new Date().toLocaleTimeString();
        var botTimeHTML = '<div class="bot-time">' + 'EZEEBOT , ' + currentTime + '</div>';

        function typeWriter() {
            var botMessageElement = chatContainer.querySelector('.bot-message-chat.typingsb');
            botMessageElement.innerHTML = responseHTML.substring(0, index);
            index++;
                                
            if (index <= responseHTML.length) {
                setTimeout(typeWriter, typingSpeed * 1000);
                scrollToBottom();
            } else {
                botMessageElement.classList.remove('typing');
                chatContainer.innerHTML += botTimeHTML;
                chatContainer.innerHTML += '<div class="bot-message-check-customSB">'+
                    '<div>' +
                        '<div class="checkbox-group row">' +
                            '<div class="column col-3">' +
                                '<div class="form-check">' +
                                    '<input class="form-check-input" type="checkbox" id="customSBbookingnoCheckbox">' +
                                    '<label class="form-check-label" for="customSBbookingnoCheckbox">Booking Number</label>' +
                                '</div>' +
                                '<div class="form-check">' +
                                    '<input class="form-check-input" type="checkbox" id="customSBbookingrefCheckbox">' +
                                    '<label class="form-check-label" for="customSBbookingrefCheckbox">Booking Ref</label>' +
                                '</div>' +
                                '<div class="form-check">' +
                                    '<input class="form-check-input" type="checkbox" id="customSBjobnoCheckbox">' +
                                    '<label class="form-check-label" for="customSBjobnoCheckbox">Job Number</label>' +
                                '</div>' +
                            '</div>' +
                            '<div class="column col-3">' +
                                '<div class="form-check">' +
                                    '<input class="form-check-input" type="checkbox" id="customSBSBnoCheckbox">' +
                                    '<label class="form-check-label" for="customSBSBnoCheckbox">SB Number</label>' +
                                '</div>' +
                                '<div class="form-check">' +
                                    '<input class="form-check-input" type="checkbox" id="customSBlicenserefCheckbox">' +
                                    '<label class="form-check-label" for="customSBlicenserefCheckbox">License reg Number</label>' +
                                '</div>' +
                                '<div class="form-check">' +
                                    '<input class="form-check-input" type="checkbox" id="customSBinvoicenoCheckbox">' +
                                    '<label class="form-check-label" for="customSBinvoicenoCheckbox">Invoice Number</label>' +
                                '</div>' +
                            '</div>' +
                            '<div class="column col-3">' +
                                '<div class="form-check">' +
                                    '<input class="form-check-input" type="checkbox" id="fromDateCheckbox">' +
                                    '<label class="form-check-label" for="fromDateCheckbox">SB From Date</label>' +
                                '</div>' +
                                '<div class="form-check">' +
                                    '<input class="form-check-input" type="checkbox" id="toDateCheckbox">' +
                                    '<label class="form-check-label" for="toDateCheckbox">SB To Date</label>' +
                                '</div>' +
                                '<div class="form-check">' +
                                    '<input class="form-check-input" type="checkbox" id="customSBhscodeCheckbox">' +
                                    '<label class="form-check-label" for="customSBhscodeCheckbox">HSCODE</label>' +
                                '</div>' +
                            '</div>' +
                        '</div>' +
                        '<button class="sub-butn" onclick="sendCheckboxValuescustomSB()">Confirm</button>' +
                    '</div>'+
                '</div>';
                scrollToBottom();
                fromDateToDateCheck();
            }
        }
                                
        var index = 0;
                                
        typeWriter();
}

function customBillOfEntry(){
    var responseHTML = `In customs broker, What specific criteria are you looking to use in your <b>bill of entry</b> search?`;
        var typingSpeed = 1e-15;
        var botMessageHTML = `<div class="message-container"><div class="bot-avatar"><div id="dp" data-bs-toggle="modal" data-bs-target="#modalPopup">
            <img id="thumbnail" src="https://betatest.ezeeshipping.in/assets/img/EZ_New_LogoAboveText.png" alt="EzeeBot Logo" style="width: 90%; height: 90%; margin-top: 1.2px; margin-left: 0.8px; object-fit: contain; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); clip-path: inset(0 0 8px 0);">
        </div></div><div class="bot-message-chat typingbe">`;
        chatContainer.innerHTML += botMessageHTML;
        var currentTime = new Date().toLocaleTimeString();
        var botTimeHTML = '<div class="bot-time">' + 'EZEEBOT , ' + currentTime + '</div>';

        function typeWriter() {
            var botMessageElement = chatContainer.querySelector('.bot-message-chat.typingbe');
            botMessageElement.innerHTML = responseHTML.substring(0, index);
            index++;
                                
            if (index <= responseHTML.length) {
                setTimeout(typeWriter, typingSpeed * 1000);
                scrollToBottom();
            } else {
                botMessageElement.classList.remove('typing');
                scrollToBottom();
                chatContainer.innerHTML += botTimeHTML;
                chatContainer.innerHTML += '<div class="bot-message-check-customBE">'+
                        '<div>' +
                            '<div class="checkbox-group row">' +
                                '<div class="column col-2">' +
                                    '<div class="form-check">' +
                                        '<input class="form-check-input" type="checkbox" id="customBEbookingnoCheckbox">' +
                                        '<label class="form-check-label" for="customBEbookingnoCheckbox">Booking Number</label>' +
                                    '</div>' +
                                    '<div class="form-check">' +
                                        '<input class="form-check-input" type="checkbox" id="customBEbookingrefCheckbox">' +
                                        '<label class="form-check-label" for="customBEbookingrefCheckbox">Booking Ref</label>' +
                                    '</div>' +
                                    '<div class="form-check">' +
                                        '<input class="form-check-input" type="checkbox" id="customBEinvoicenoCheckbox">' +
                                        '<label class="form-check-label" for="customBEinvoicenoCheckbox">Invoice Number</label>' +
                                    '</div>' +
                                    '<div class="form-check">' +
                                        '<input class="form-check-input" type="checkbox" id="customBEhscodeCheckbox">' +
                                        '<label class="form-check-label" for="customBEhscodeCheckbox">HSCODE</label>' +
                                    '</div>' +
                                '</div>' +
                                '<div class="column col-2">' +
                                    '<div class="form-check">' +
                                        '<input class="form-check-input" type="checkbox" id="customBEjobnoCheckbox">' +
                                        '<label class="form-check-label" for="customBEjobnoCheckbox">Job Number</label>' +
                                    '</div>' +
                                    '<div class="form-check">' +
                                        '<input class="form-check-input" type="checkbox" id="customBElicenseregCheckbox">' +
                                        '<label class="form-check-label" for="customBElicenseregCheckbox">License reg Number</label>' +
                                    '</div>' +
                                    '<div class="form-check">' +
                                        '<input class="form-check-input" type="checkbox" id="customBEBEnoCheckbox">' +
                                        '<label class="form-check-label" for="customBEBEnoCheckbox">BE Number</label>' +
                                    '</div>' +
                                    '<div class="form-check">' +
                                        '<input class="form-check-input" type="checkbox" id="customBEIECCheckbox">' +
                                        '<label class="form-check-label" for="customBEIECCheckbox">IEC Code</label>' +
                                    '</div>' +
                                '</div>' +
                                '<div class="column col-2">' +
                                    '<div class="form-check">' +
                                        '<input class="form-check-input" type="checkbox" id="customBEIGMCheckbox">' +
                                        '<label class="form-check-label" for="customBEIGMCheckbox">IGM Number</label>' +
                                    '</div>' +
                                    '<div class="form-check">' +
                                        '<input class="form-check-input" type="checkbox" id="fromDateCheckbox">' +
                                        '<label class="form-check-label" for="fromDateCheckbox">BE From Date</label>' +
                                    '</div>' +
                                    '<div class="form-check">' +
                                        '<input class="form-check-input" type="checkbox" id="toDateCheckbox">' +
                                        '<label class="form-check-label" for="toDateCheckbox">BE To Date</label>' +
                                    '</div>' +
                                '</div>' +
                                '<div class="column col-2">' +
                                    '<div class="form-check">' +
                                        '<input class="form-check-input" type="checkbox" id="customBEHAWBCheckbox">' +
                                        '<label class="form-check-label" for="customBEHAWBCheckbox">HAWB/HBL Number</label>' +
                                    '</div>' +
                                    '<div class="form-check">' +
                                        '<input class="form-check-input" type="checkbox" id="customBEMAWBCheckbox">' +
                                        '<label class="form-check-label" for="customBEMAWBCheckbox">MAWB/MBL Number</label>' +
                                    '</div>' +
                                '</div>' +
                            '</div>' +
                            '<button class="sub-butn" onclick="sendCheckboxValuescustomBE()">Confirm</button>' +
                        '</div>'+
                    '</div>'; 
                scrollToBottom();
                fromDateToDateCheck();
            }
        }
                                
        var index = 0;
                                
        typeWriter();
}

function frightBooking(){
        var responseHTML = `In freight forwarding, What specific criteria are you looking to use in your <b>booking</b> search?`;
        var typingSpeed = 1e-15;
        var botMessageHTML = `<div class="message-container"><div class="bot-avatar"><div id="dp" data-bs-toggle="modal" data-bs-target="#modalPopup">
            <img id="thumbnail" src="https://betatest.ezeeshipping.in/assets/img/EZ_New_LogoAboveText.png" alt="EzeeBot Logo" style="width: 90%; height: 90%; margin-top: 1.2px; margin-left: 0.8px; object-fit: contain; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); clip-path: inset(0 0 8px 0);">
        </div></div><div class="bot-message-chat typingffrbk">`;
        chatContainer.innerHTML += botMessageHTML;
        var currentTime = new Date().toLocaleTimeString();
        var botTimeHTML = '<div class="bot-time">' + 'EZEEBOT , ' + currentTime + '</div>';

        function typeWriter() {
            var botMessageElement = chatContainer.querySelector('.bot-message-chat.typingffrbk');
            botMessageElement.innerHTML = responseHTML.substring(0, index);
            index++;
                                
            if (index <= responseHTML.length) {
                setTimeout(typeWriter, typingSpeed * 1000);
                scrollToBottom();
            } else {
                botMessageElement.classList.remove('typing');
                chatContainer.innerHTML += botTimeHTML;
                chatContainer.innerHTML += '<div class="bot-message-check-fright">'+
                        '<div>' +
                            '<div class="checkbox-group row">' +
                                '<div class="column col-2">' +
                                    '<div class="form-check">' +
                                        '<input class="form-check-input" type="checkbox" id="frightbookingnoCheckbox">' +
                                        '<label class="form-check-label" for="frightbookingnoCheckbox">Booking Number</label>' +
                                    '</div>' +
                                    '<div class="form-check">' +
                                        '<input class="form-check-input" type="checkbox" id="frightbookingrefCheckbox">' +
                                        '<label class="form-check-label" for="frightbookingrefCheckbox">Booking Ref</label>' +
                                    '</div>' +
                                    '<div class="form-check">' +
                                        '<input class="form-check-input" type="checkbox" id="frightinvoicenoCheckbox">' +
                                        '<label class="form-check-label" for="frightinvoicenoCheckbox">Invoice Number</label>' +
                                    '</div>' +
                                    '<div class="form-check">' +
                                        '<input class="form-check-input" type="checkbox" id="frightlinerbkCheckbox">' +
                                        '<label class="form-check-label" for="frightlinerbkCheckbox">Liner BK Number</label>' +
                                    '</div>' +
                                '</div>' +
                                '<div class="column col-2">' +
                                    '<div class="form-check">' +
                                        '<input class="form-check-input" type="checkbox" id="frightcntrCheckbox">' +
                                        '<label class="form-check-label" for="frightcntrCheckbox">CNTR Number</label>' +
                                    '</div>' +
                                    '<div class="form-check">' +
                                        '<input class="form-check-input" type="checkbox" id="frightindentCheckbox">' +
                                        '<label class="form-check-label" for="frightindentCheckbox">Indent Number</label>' +
                                    '</div>' +
                                    '<div class="form-check">' +
                                        '<input class="form-check-input" type="checkbox" id="frightshipperrefCheckbox">' +
                                        '<label class="form-check-label" for="frightshipperrefCheckbox">Shipper Ref</label>' +
                                    '</div>' +
                                    '<div class="form-check">' +
                                        '<input class="form-check-input" type="checkbox" id="frightconsigneerefCheckbox">' +
                                        '<label class="form-check-label" for="frightconsigneerefCheckbox">Consignee Ref</label>' +
                                    '</div>' +
                                '</div>' +
                                '<div class="column col-2">' +
                                    '<div class="form-check">' +
                                        '<input class="form-check-input" type="checkbox" id="fromDateCheckbox">' +
                                        '<label class="form-check-label" for="fromDateCheckbox">From Date</label>' +
                                    '</div>' +
                                    '<div class="form-check">' +
                                        '<input class="form-check-input" type="checkbox" id="toDateCheckbox">' +
                                        '<label class="form-check-label" for="toDateCheckbox">To Date</label>' +
                                    '</div>' +
                                    '<div class="form-check">' +
                                        '<input class="form-check-input" type="checkbox" id="frightsbnoCheckbox">' +
                                        '<label class="form-check-label" for="frightsbnoCheckbox">SB Number</label>' +
                                    '</div>' +
                                    '<div class="form-check">' +
                                        '<input class="form-check-input" type="checkbox" id="frightbenoCheckbox">' +
                                        '<label class="form-check-label" for="frightbenoCheckbox">BE Number</label>' +
                                    '</div>' +
                                '</div>' +
                                '<div class="column col-2">' +
                                    '<div class="form-check">' +
                                        '<input class="form-check-input" type="checkbox" id="frighthblnoCheckbox">' +
                                        '<label class="form-check-label" for="frighthblnoCheckbox">HBL/HAWB Number</label>' +
                                    '</div>' +
                                    '<div class="form-check">' +
                                        '<input class="form-check-input" type="checkbox" id="frightmblnoCheckbox">' +
                                        '<label class="form-check-label" for="frightmblnoCheckbox">MBL/MAWB Number</label>' +
                                    '</div>' +
                                    '<div class="form-check">' +
                                        '<input class="form-check-input" type="checkbox" id="frightplrecipCheckbox">' +
                                        '<label class="form-check-label" for="frightplrecipCheckbox">Place of Receipt</label>' +
                                    '</div>' +
                                    '<div class="form-check">' +
                                        '<input class="form-check-input" type="checkbox" id="frightpldelCheckbox">' +
                                        '<label class="form-check-label" for="frightpldelCheckbox">Place of Delivery</label>' +
                                    '</div>' +
                                '</div>' +
                            '</div>' +
                            '<button class="sub-butn" onclick="sendCheckboxValuesfright()">Confirm</button>' +
                        '</div>'+
                    '</div>'; 
                scrollToBottom();
                fromDateToDateCheck();
            }
        }
                                
        var index = 0;
                                
        typeWriter();
}

function frightBillOfLading(){
    var responseHTML = `In freight forwarding, What specific criteria are you looking to use in your <b>bill of lading</b> search?`;
        var typingSpeed = 1e-15;
        var botMessageHTML = `<div class="message-container"><div class="bot-avatar"><div id="dp" data-bs-toggle="modal" data-bs-target="#modalPopup">
            <img id="thumbnail" src="https://betatest.ezeeshipping.in/assets/img/EZ_New_LogoAboveText.png" alt="EzeeBot Logo" style="width: 90%; height: 90%; margin-top: 1.2px; margin-left: 0.8px; object-fit: contain; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); clip-path: inset(0 0 8px 0);">
        </div></div><div class="bot-message-chat typingbol">`;
        chatContainer.innerHTML += botMessageHTML;
        var currentTime = new Date().toLocaleTimeString();
        var botTimeHTML = '<div class="bot-time">' + 'EZEEBOT , ' + currentTime + '</div>';

        function typeWriter() {
            var botMessageElement = chatContainer.querySelector('.bot-message-chat.typingbol');
            botMessageElement.innerHTML = responseHTML.substring(0, index);
            index++;
                                
            if (index <= responseHTML.length) {
                setTimeout(typeWriter, typingSpeed * 1000);
                scrollToBottom();
            } else {
                botMessageElement.classList.remove('typing');
                chatContainer.innerHTML += botTimeHTML;
                chatContainer.innerHTML += '<div class="bot-message-check-frightBillOfLading">'+
                        '<div>' +
                            '<div class="checkbox-group row">' +
                                '<div class="column col-3">' +
                                    '<div class="form-check">' +
                                        '<input class="form-check-input" type="checkbox" id="frightBillOfLadingbookingnoCheckbox">' +
                                        '<label class="form-check-label" for="frightBillOfLadingbookingnoCheckbox">BL Number</label>' +
                                    '</div>' +
                                    '<div class="form-check">' +
                                        '<input class="form-check-input" type="checkbox" id="frightBillOfLadinginvoicenoCheckbox">' +
                                        '<label class="form-check-label" for="frightBillOfLadinginvoicenoCheckbox">Booking Number</label>' +
                                    '</div>' +
                                    '<div class="form-check">' +
                                        '<input class="form-check-input" type="checkbox" id="frightBillOfLadingbookingrefCheckbox">' +
                                        '<label class="form-check-label" for="frightBillOfLadingbookingrefCheckbox">Booking Ref</label>' +
                                    '</div>' +
                                '</div>' +
                                '<div class="column col-3">' +
                                    '<div class="form-check">' +
                                        '<input class="form-check-input" type="checkbox" id="frightBillOfLadingblrefCheckbox">' +
                                        '<label class="form-check-label" for="frightBillOfLadingblrefCheckbox">BL Ref</label>' +
                                    '</div>' +
                                    '<div class="form-check">' +
                                        '<input class="form-check-input" type="checkbox" id="frightBillOfLadingcontainernoCheckbox">' +
                                        '<label class="form-check-label" for="frightBillOfLadingcontainernoCheckbox">Container Number</label>' +
                                    '</div>' +
                                    '<div class="form-check">' +
                                        '<input class="form-check-input" type="checkbox" id="bkfromDateCheckbox">' +
                                        '<label class="form-check-label" for="bkfromDateCheckbox">BK From Date</label>' +
                                    '</div>' +
                                '</div>' +
                                '<div class="column col-3">' +
                                    '<div class="form-check">' +
                                        '<input class="form-check-input" type="checkbox" id="bktoDateCheckbox">' +
                                        '<label class="form-check-label" for="bktoDateCheckbox">BK To Date</label>' +
                                    '</div>' +
                                    '<div class="form-check">' +
                                        '<input class="form-check-input" type="checkbox" id="fromDateCheckbox">' +
                                        '<label class="form-check-label" for="fromDateCheckbox">From Date</label>' +
                                    '</div>' +
                                    '<div class="form-check">' +
                                        '<input class="form-check-input" type="checkbox" id="toDateCheckbox">' +
                                        '<label class="form-check-label" for="toDateCheckbox">To Date</label>' +
                                    '</div>' +
                                '</div>' +
                            '</div>' +
                            '<button class="sub-butn" onclick="sendCheckboxValuesfrightBillOfLading()">Confirm</button>' +
                        '</div>'+
                    '</div>'; 
                scrollToBottom();
                fromDateToDateCheck();
                fromDateToDateCheck2();
            }
        }
                                
        var index = 0;
                                
        typeWriter();
}

function frightAirWayBill(){
    var responseHTML = `In freight forwarding, What specific criteria are you looking to use in your <b>air way bill</b> search?`;
        var typingSpeed = 1e-15;
        var botMessageHTML = `<div class="message-container"><div class="bot-avatar"><div id="dp" data-bs-toggle="modal" data-bs-target="#modalPopup">
            <img id="thumbnail" src="https://betatest.ezeeshipping.in/assets/img/EZ_New_LogoAboveText.png" alt="EzeeBot Logo" style="width: 90%; height: 90%; margin-top: 1.2px; margin-left: 0.8px; object-fit: contain; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); clip-path: inset(0 0 8px 0);">
        </div></div><div class="bot-message-chat typingawb">`;
        chatContainer.innerHTML += botMessageHTML;
        var currentTime = new Date().toLocaleTimeString();
        var botTimeHTML = '<div class="bot-time">' + 'EZEEBOT , ' + currentTime + '</div>';

        function typeWriter() {
            var botMessageElement = chatContainer.querySelector('.bot-message-chat.typingawb');
            botMessageElement.innerHTML = responseHTML.substring(0, index);
            index++;
                                
            if (index <= responseHTML.length) {
                setTimeout(typeWriter, typingSpeed * 1000);
                scrollToBottom();
            } else {
                botMessageElement.classList.remove('typing');
                chatContainer.innerHTML += botTimeHTML;
                chatContainer.innerHTML += '<div class="bot-message-check-frightawb">'+
                        '<div>' +
                            '<div class="checkbox-group row">' +
                                '<div class="column col-3">' +
                                    '<div class="form-check">' +
                                        '<input class="form-check-input" type="checkbox" id="frightawbawbnoCheckbox">' +
                                        '<label class="form-check-label" for="frightawbawbnoCheckbox">AWB Number</label>' +
                                    '</div>' +
                                    '<div class="form-check">' +
                                        '<input class="form-check-input" type="checkbox" id="frightawbbookingnoCheckbox">' +
                                        '<label class="form-check-label" for="frightawbbookingnoCheckbox">Booking Number</label>' +
                                    '</div>' +
                                    '<div class="form-check">' +
                                        '<input class="form-check-input" type="checkbox" id="bkfromDateCheckbox">' +
                                        '<label class="form-check-label" for="bkfromDateCheckbox">BK From Date</label>' +
                                    '</div>' +
                                '</div>' +
                                '<div class="column col-3">' +
                                    '<div class="form-check">' +
                                        '<input class="form-check-input" type="checkbox" id="bktoDateCheckbox">' +
                                        '<label class="form-check-label" for="bktoDateCheckbox">BK To Date</label>' +
                                    '</div>' +
                                    '<div class="form-check">' +
                                        '<input class="form-check-input" type="checkbox" id="frightawbbookingrefCheckbox">' +
                                        '<label class="form-check-label" for="frightawbbookingrefCheckbox">Booking Ref</label>' +
                                    '</div>' +
                                    '<div class="form-check">' +
                                        '<input class="form-check-input" type="checkbox" id="frightawbawbrefCheckbox">' +
                                        '<label class="form-check-label" for="frightawbawbrefCheckbox">AWB Ref</label>' +
                                    '</div>' +
                                '</div>' +
                                '<div class="column col-3">' +
                                    '<div class="form-check">' +
                                        '<input class="form-check-input" type="checkbox" id="fromDateCheckbox">' +
                                        '<label class="form-check-label" for="fromDateCheckbox">From Date</label>' +
                                    '</div>' +
                                    '<div class="form-check">' +
                                        '<input class="form-check-input" type="checkbox" id="toDateCheckbox">' +
                                        '<label class="form-check-label" for="toDateCheckbox">To Date</label>' +
                                    '</div>' +
                                '</div>' +
                            '</div>' +
                            '<button class="sub-butn" onclick="sendCheckboxValuesfrightawb()">Confirm</button>' +
                        '</div>' +
                    '</div>'; 
                scrollToBottom();
                fromDateToDateCheck();
                fromDateToDateCheck2();
            }
        }
                                
        var index = 0;
                                
        typeWriter();
}

function refreshScreen2() {
    var refreshButton = document.getElementById('customButton');
    refreshButton.click();
}

function openUrlInModal(url) {
    document.getElementById('modalIframe').src = url;
    var modal = new bootstrap.Modal(document.getElementById('urlModal'));
    modal.show();
}

function awbBooking(type) {
    var tagsDiv = document.getElementById('patterns');
    if (tagsDiv) {
        tagsDiv.parentNode.removeChild(tagsDiv);
    }
    var responseHTML = `Please upload the <b>document</b>.`;
    var typingSpeed = 1e-15;
    var botMessageHTML = `<div class="message-container"><div class="bot-avatar"><div id="dp" data-bs-toggle="modal" data-bs-target="#modalPopup">
        <img id="thumbnail" src="https://betatest.ezeeshipping.in/assets/img/EZ_New_LogoAboveText.png" alt="EzeeBot Logo" style="width: 90%; height: 90%; margin-top: 1.2px; margin-left: 0.8px; object-fit: contain; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); clip-path: inset(0 0 8px 0);">
    </div></div><div class="bot-message-chat typingawbex">`;
    chatContainer.innerHTML += botMessageHTML;
    var currentTime = new Date().toLocaleTimeString();
    var botTimeHTML = '<div class="bot-time">' + 'EZEEBOT , ' + currentTime + '</div>';

    function typeWriter() {
        var botMessageElement = chatContainer.querySelector('.bot-message-chat.typingawbex');
        botMessageElement.innerHTML = responseHTML.substring(0, index);
        index++;

        if (index <= responseHTML.length) {
            setTimeout(typeWriter, typingSpeed * 1000);
            scrollToBottom();
        } else {
            botMessageElement.classList.remove('typing');
            chatContainer.innerHTML += botTimeHTML;
            scrollToBottom();
        }
    }

    var index = 0;

    typeWriter();

    var imageUploadElement = document.getElementById('image-upload');
    if (imageUploadElement) {
        imageUploadElement.click();
        imageUploadElement.addEventListener('change', function() {
            var file = imageUploadElement.files[0];
            if (file) {
                var formData = new FormData();
                formData.append('image', file);
                var reader = new FileReader();
                reader.onload = function(event) {
                    var userMessageHTML = '';

                    if (file.type.startsWith('image/')) {
                        userMessageHTML = `
                            <div class="message-container">
                                <div class="user-message-img">
                                    <img src="${event.target.result}" alt="User Image" style="width: 200px; height: auto; cursor: pointer;" onclick="openModalimg('${event.target.result}')">
                                </div>
                            </div>
                        `;
                    } else if (file.type === 'application/pdf') {
                        userMessageHTML = `
                            <div class="message-container">
                                <div class="user-message-pdf" style="background-color: #007bff; padding: 5px; border-radius: 5px;">
                                    <i class="fas fa-file-pdf" style="padding-right: 5px; font-size: 34px;"></i>
                                    <a href="${event.target.result}" target="_blank" style="color: white; text-decoration: none; font-weight: bold;">
                                        ${file.name}<br>
                                        <span style="font-size: 10px; bottom: 30px; ">(${formatFileSize(file.size)})</span>
                                    </a>
                                </div>
                            </div>
                        `;
                    }

                    chatContainer.innerHTML += userMessageHTML;
                    extractingMessage();
                    scrollToBottom();
                };
                reader.onerror = function(event) {
                    console.error("FileReader error:", event.target.error);
                };
                reader.readAsDataURL(file);

                var invoice = type;
                formData.append('docType', invoice);

                fetch('/bkcreate', {
                    method: 'POST',
                    body: formData
                })
                .then(response => response.json())
                .then(data => {
                    console.log('Success:', data);
                    if (data.generated_content) {
                        if (invoice == 'INVOICE') {
                            var resType = 'invoice';
                        }
                        else if (invoice == 'AWB') {
                            var resType = 'airway bill';
                        }
                        var responseMarkdown = "The details extracted by the <b>AI</b> from the "+ resType +" you uploaded.<br>" + data.generated_content;
                        var converter = new showdown.Converter();
                        var responseHTML = converter.makeHtml(responseMarkdown);
                        var typingSpeed = 1e-15;
                        var botMessageHTML = `<div class="message-container"><div class="bot-avatar"><div id="dp" data-bs-toggle="modal" data-bs-target="#modalPopup">
                            <img id="thumbnail" src="https://betatest.ezeeshipping.in/assets/img/EZ_New_LogoAboveText.png" alt="EzeeBot Logo" style="width: 90%; height: 90%; margin-top: 1.2px; margin-left: 0.8px; object-fit: contain; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); clip-path: inset(0 0 8px 0);">
                        </div></div><div class="bot-message-chat-2 typingimg" style="line-height: 1.5;"><div class="bot-message-img">`;
                        chatContainer.innerHTML += botMessageHTML;
                        var currentTime = new Date().toLocaleTimeString();
                        var botTimeHTML = '<div class="bot-time">' + 'EZEEBOT , ' + currentTime + '</div>';

                        function typeWriter() {
                            var botMessageElement = chatContainer.querySelector('.bot-message-chat-2.typingimg');
                            var words = responseHTML.split(' ');
                            var currentText = words.slice(0, index).join(' ');
                            botMessageElement.innerHTML = currentText;
                            index++;  

                            if (index <= words.length) {
                                setTimeout(typeWriter, typingSpeed * 1000);
                                scrollToBottom();
                                scrollToBottombottable();
                                scrollToBottom()
                            } else {
                                botMessageElement.classList.remove('typing');
                                chatContainer.innerHTML += botTimeHTML;
                                scrollToBottom();
                            }
                        }

                        var index = 0;
                        closeType();
                        typeWriter();
                    } else {
                        var errorMessageHTML = `
                            <div class="message-container">
                                <div class="bot-message">City not found. Please check the spelling and try again.</div>
                            </div>
                        `;
                        chatContainer.innerHTML += errorMessageHTML;
                    }
                    closeType();
                    scrollToBottom();
                })
                .catch(error => {
                    console.error('Error sending image:', error);
                });
            }
        }, { once: true });
    }  
    scrollToBottom();
}

function openPDFInNewWindow(src) {
    window.open(src, '_blank');
}                                  

function frightAirWayBillextract() {
    var tagsDiv = document.getElementById('patterns');
        if (tagsDiv) {
            tagsDiv.parentNode.removeChild(tagsDiv);
        }
    var responseHTML = `Please upload the <b>document</b>.`;
        var typingSpeed = 1e-15;
        var botMessageHTML = `<div class="message-container"><div class="bot-avatar"><div id="dp" data-bs-toggle="modal" data-bs-target="#modalPopup">
            <img id="thumbnail" src="https://betatest.ezeeshipping.in/assets/img/EZ_New_LogoAboveText.png" alt="EzeeBot Logo" style="width: 90%; height: 90%; margin-top: 1.2px; margin-left: 0.8px; object-fit: contain; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); clip-path: inset(0 0 8px 0);">
        </div></div><div class="bot-message-chat typingawbex">`;
        chatContainer.innerHTML += botMessageHTML;
        var currentTime = new Date().toLocaleTimeString();
        var botTimeHTML = '<div class="bot-time">' + 'EZEEBOT , ' + currentTime + '</div>';

        function typeWriter() {
            var botMessageElement = chatContainer.querySelector('.bot-message-chat.typingawbex');
            botMessageElement.innerHTML = responseHTML.substring(0, index);
            index++;
                                
            if (index <= responseHTML.length) {
                setTimeout(typeWriter, typingSpeed * 1000);
                scrollToBottom();
            } else {
                botMessageElement.classList.remove('typing');
                chatContainer.innerHTML += botTimeHTML; 
                scrollToBottom();
            }
        }
                                
        var index = 0;
                                
        typeWriter();

    var imageUploadElement = document.getElementById('image-upload');
    if (imageUploadElement) {
        imageUploadElement.click();
        imageUploadElement.addEventListener('change', function() {
            var file = imageUploadElement.files[0];
            if (file) {
                var formData = new FormData();
                formData.append('image', file);
                var reader = new FileReader();
                reader.onload = function(event) {
                    var userMessageHTML = '';

                    if (file.type.startsWith('image/')) {
                        userMessageHTML = `
                            <div class="message-container">
                                <div class="user-message-img">
                                    <img src="${event.target.result}" alt="User Image" style="width: 200px; height: auto; cursor: pointer;" onclick="openModalimg('${event.target.result}')">
                                </div>
                            </div>
                        `;
                    } else if (file.type === 'application/pdf') {
                        userMessageHTML = `
                            <div class="message-container">
                                <div class="user-message-pdf" style="background-color: #007bff; padding: 5px; border-radius: 5px;">
                                    <i class="fas fa-file-pdf" style="padding-right: 5px; font-size: 34px;"></i>
                                    <a href="${event.target.result}" target="_blank" style="color: white; text-decoration: none; font-weight: bold;">
                                        ${file.name}<br>
                                        <span style="font-size: 10px; bottom: 30px; ">(${formatFileSize(file.size)})</span>
                                    </a>
                                </div>
                            </div>
                        `;
                    }

                    chatContainer.innerHTML += userMessageHTML;
                    typingMessage();
                    setTimeout(() => {
                        extractingMessage();
                        closeType();
                    }, 600);
                    scrollToBottom();
                };
                reader.onerror = function(event) {
                    console.error("FileReader error:", event.target.error);
                };
                reader.readAsDataURL(file);

                fetch('/awb', {
                    method: 'POST',
                    body: formData
                })
                .then(response => response.json())
                .then(data => {
                    console.log('Success:', data);
                    if (data.generated_content) {
                        var responseMarkdown = data.generated_content;
                        var converter = new showdown.Converter();
                        var responseHTML = converter.makeHtml(responseMarkdown);
                        var typingSpeed = 1e-15;
                        var botMessageHTML = `<div class="message-container"><div class="bot-avatar"><div id="dp" data-bs-toggle="modal" data-bs-target="#modalPopup">
                            <img id="thumbnail" src="https://betatest.ezeeshipping.in/assets/img/EZ_New_LogoAboveText.png" alt="EzeeBot Logo" style="width: 90%; height: 90%; margin-top: 1.2px; margin-left: 0.8px; object-fit: contain; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); clip-path: inset(0 0 8px 0);">
                        </div></div><div class="bot-message-chat-2 typingimg" style="line-height: 1.5;"><div class="bot-message-img">`;
                        chatContainer.innerHTML += botMessageHTML;
                        var currentTime = new Date().toLocaleTimeString();
                        var botTimeHTML = '<div class="bot-time">' + 'EZEEBOT , ' + currentTime + '</div>';

                        function typeWriter() {
                            var botMessageElement = chatContainer.querySelector('.bot-message-chat-2.typingimg');
                            var words = responseHTML.split(' ');
                            var currentText = words.slice(0, index).join(' ');
                            botMessageElement.innerHTML = currentText;
                            index++;  
                            
                            if (index <= words.length) {
                                setTimeout(typeWriter, typingSpeed * 1000);
                                scrollToBottom();
                            } else {
                                botMessageElement.classList.remove('typing');
                                chatContainer.innerHTML += botTimeHTML;
                                scrollToBottom();
                            }
                        }
                            
                        var index = 0;
                            
                        typeWriter();
                    } else {
                        var errorMessageHTML = `
                            <div class="message-container">
                                <div class="bot-message">City not found. Please check the spelling and try again.</div>
                            </div>
                        `;
                        chatContainer.innerHTML += errorMessageHTML;
                    }
                    closeType();
                    scrollToBottom();
                })
                .catch(error => {
                    console.error('Error sending image:', error);
                });
            }
        }, { once: true });
    }  
    scrollToBottom();
}

var userInputHistory = [];

function value_search(pattern){
    var userInputElement = document.getElementById('user-input');
    var userInput = document.getElementById('user-input');
                        userInput.focus();
                        if (userInputElement._listener) {
                            userInputElement.removeEventListener('keypress', userInputElement._listener);
                        }
                        userInputElement._listener = function(event) {
                            if (event.key === 'Enter') {
                                event.preventDefault();
                                var userInput = this.value.trim();
                                simpleUserMessage(userInput);
                                var weather = this.value.trim();
                                this.value = '';
                                if (weather !== '') {
                                    typingMessage();
                                    fetch('/chat_input', {
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/json',
                                        },
                                        body: JSON.stringify({
                                            user_input: {
                                                'section': pattern,
                                                'value_to_search': weather,
                                                'time_period': 'Last Month',
                                                'environment': environment,
                                                'current_date': formattedDate,
                                                'tenantid': tenantid,
                                                'officeid': officeid,
                                                'userid': userid
                                            }
                                        }),
                                    })
                                    .then(response => response.json())
                                    .then(data => {
                                        var responseMarkdown = data.response;
                                        var converter = new showdown.Converter();
                                        var responseHTML = converter.makeHtml(responseMarkdown);
                                        var typingSpeed = 1e-15;
                                        var botMessageHTML = `<div class="message-container"><div class="bot-avatar"><div id="dp" data-bs-toggle="modal" data-bs-target="#modalPopup">
                                            <img id="thumbnail" src="https://betatest.ezeeshipping.in/assets/img/EZ_New_LogoAboveText.png" alt="EzeeBot Logo" style="width: 90%; height: 90%; margin-top: 1.2px; margin-left: 0.8px; object-fit: contain; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); clip-path: inset(0 0 8px 0);">
                                        </div></div><div class="bot-message-chat-2 typing11" style="line-height: 1.5;"></div></div>`;
                                        chatContainer.innerHTML += botMessageHTML;
                                        var currentTime = new Date().toLocaleTimeString();
                                        var botTimeHTML = '<div class="bot-time">' + 'EZEEBOT , ' + currentTime + '</div>';

                                        function typeWriter() {
                                            var botMessageElement = chatContainer.querySelector('.bot-message-chat-2.typing11');
                                            botMessageElement.innerHTML = responseHTML.substring(0, index);
                                            index++;  
                                        
                                            if (index <= responseHTML.length) {
                                                setTimeout(typeWriter, typingSpeed * 1000);
                                                scrollToBottom();
                                            } else {
                                                botMessageElement.classList.remove('typing11');
                                                scrollToBottom();
                                                chatContainer.innerHTML += botTimeHTML;
                                                scrollToBottom();
                                                setTimeout(function() {
                                                    value_search(pattern);
                                                }, 0);
                                                userInputElement.removeEventListener('keypress', userInputElement._listener);
                                            }
                                        }
                                        
                                        var index = 0;
                                        closeType();
                                        typeWriter();
                                    })
                                    .catch(error => {
                                        console.error('Error:', error);
                                    });
                                } else {
                                    alert('Please provide a valid booking number');
                                }
                            }
                        };
                        userInputElement.addEventListener('keypress', userInputElement._listener);
}

function populateInput(item) {
    document.getElementById('user-input').value = item;
    var userInput = document.getElementById('user-input');
    userInput.focus();
    var event = new KeyboardEvent('keypress', {
        key: 'Enter',
        keyCode: 13,
        bubbles: true,
        cancelable: true,
    });
    userInput.dispatchEvent(event);
    var patternsDivs = document.querySelectorAll('#patterns');
    patternsDivs.forEach(function(patternsDiv) {
        patternsDiv.parentNode.removeChild(patternsDiv);
    });
}

function send_inputs2(pattern) {
    typingMessage();
    var qsButtonsHTML = "";
    var responseMarkdown;

    if (pattern.toLowerCase() === "ffrbooking") {
        responseMarkdown = '> Ask me anything about **bookings**?';
    } else if (pattern.toLowerCase() === "billoflad") {
        responseMarkdown = '> Ask me anything about **bill of lading**?';
    } else if (pattern.toLowerCase() === "awb") {
        responseMarkdown = '> Ask me anything about **air way bills**?';
    } else if (pattern.toLowerCase() === "custombooking") {
        responseMarkdown = '> Ask me anything about **bookings**?';
    } else if (pattern.toLowerCase() === "lead" || pattern.toLowerCase() === "enquiry" || pattern.toLowerCase() === "quotation") {
        responseMarkdown = `> Ask me anything about **${pattern}**?`;
        console.log('yes');

        var uri = '/randomQs';
        var requestBody = {
            'module': pattern.toLowerCase(),
            'tenantid': tenantid,
            'officeid': officeid
        };

        fetch(uri, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            data.forEach(item => {
                qsButtonsHTML += `
                    <div id="patterns">
                        <button onclick="populateInput('${item}')">
                            ${item}
                        </button>
                    </div>
                `;
            });
            appendResponse();
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            appendResponse();
        });

        return;
    } else {
        responseMarkdown = `> Ask me anything about **${pattern}**?`;
    }

    function appendResponse() {
        var converter = new showdown.Converter();
        var responseHTML = converter.makeHtml(responseMarkdown);
        var typingSpeed = 1e-15;
        var botMessageHTML = `
            <div class="message-container">
                <div class="bot-avatar" data-bs-toggle="modal" data-bs-target="#modalPopup">
                    <div id="dp">
                        <img id="thumbnail" src="https://betatest.ezeeshipping.in/assets/img/EZ_New_LogoAboveText.png" alt="EzeeBot Logo" style="width: 90%; height: 90%; margin-top: 1.2px; margin-left: 0.8px; object-fit: contain; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); clip-path: inset(0 0 8px 0);">
                    </div>
                </div>
                <div class="bot-message-chat-2 typing13"></div>
            </div>
        `;
        chatContainer.innerHTML += botMessageHTML;
        var currentTime = new Date().toLocaleTimeString();
        var botTimeHTML = '<div class="bot-time">' + 'EZEEBOT , ' + currentTime + '</div>';

        function typeWriter() {
            var botMessageElement = chatContainer.querySelector('.bot-message-chat-2.typing13');
            botMessageElement.innerHTML = responseHTML.substring(0, index);
            index++;

            if (index <= responseHTML.length) {
                setTimeout(typeWriter, typingSpeed * 1000);
                scrollToBottom();
            } else {
                botMessageElement.classList.remove('typing13');
                scrollToBottom();
                if (qsButtonsHTML) {
                    chatContainer.innerHTML += botTimeHTML + qsButtonsHTML;
                } else {
                    chatContainer.innerHTML += botTimeHTML;
                }
                scrollToBottom();
                send_inputs(pattern);
            }
        }

        var index = 0;
        closeType();
        typeWriter();
    }

    appendResponse();
}        

function send_inputs(pattern) {
    var userInput = document.getElementById('user-input');
    userInput.focus();

    var userInputElement = document.getElementById('user-input');

    if (userInputElement._listener) {
        userInputElement.removeEventListener('keypress', userInputElement._listener);
    }

    userInputElement._listener = function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            var botMessageCheck = document.querySelector('.bot-message-check-'+ pattern.toLowerCase() +'');
            if (botMessageCheck) {
                botMessageCheck.remove();
            }
            var patternsDivs = document.querySelectorAll('#patterns');
            patternsDivs.forEach(function(patternsDiv) {
                patternsDiv.parentNode.removeChild(patternsDiv);
            });

            var userInput = this.value.trim();

            userInputHistory = [];
            userInputHistory.push(userInput);

            simpleUserMessage(userInput);

            this.value = '';

            if (userInput !== '') {
                typingMessage();

                fetch('/chat_input', {
                    method: 'POST',
                  
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        user_input: {
                            'section': pattern,
                            'input_text': userInput,
                            'environment': environment,
                            'current_date': formattedDate,
                            'tenantid': tenantid,
                            'officeid': officeid,
                            'userid': userid,
                            'ffrid': ffrid,
                            'chaid': chaid,
                        }
                    }),
                })
                .then(response => response.json())
                .then(data => {
                    if (data.response === 'The gross total for last month is last_month_gross_total.') {
                        var ntype = 'gross';
                        var botMessageHTML = `<div class="message-container"><div class="bot-avatar"><div id="dp" data-bs-toggle="modal" data-bs-target="#modalPopup">
                            <img id="thumbnail" src="https://betatest.ezeeshipping.in/assets/img/EZ_New_LogoAboveText.png" alt="EzeeBot Logo" style="width: 90%; height: 90%; margin-top: 1.2px; margin-left: 0.8px; object-fit: contain; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); clip-path: inset(0 0 8px 0);">
                        </div></div><div class="bot-message-chat">Select a time frame</div></div>`;
                        var currentTime = new Date().toLocaleTimeString();
                        var botTimeHTML = '<div class="bot-time">' + 'EZEEBOT , ' + currentTime + '</div>';
                        var buttonContainerHTML = '<div id="patterns" class="button-container">' +
                            '<button onclick="handleButtonClick(\'today\', \'1\', \'' + pattern + '\', \'' + userInputHistory + '\', \'' + ntype + '\')">Today</button>' +
                            '<button onclick="handleButtonClick(\'Last Week\', \'7\', \'' + pattern + '\', \'' + userInputHistory + '\', \'' + ntype + '\')">Last Week</button>' +
                            '<button onclick="handleButtonClick(\'Last Month\', \'30\', \'' + pattern + '\', \'' + userInputHistory + '\', \'' + ntype + '\')">Last Month</button>' +
                            '<button onclick="handleButtonClick(\'Six Month\', \'180\', \'' + pattern + '\', \'' + userInputHistory + '\', \'' + ntype + '\')">Six Month</button>' +
                            '<button onclick="handleButtonClick(\'One Year\', \'365\', \'' + pattern + '\', \'' + userInputHistory + '\', \'' + ntype + '\')">One Year</button>' +
                            '</div>';
                        chatContainer.innerHTML += botMessageHTML + botTimeHTML + buttonContainerHTML;
                        closeType();
                        scrollToBottom();
                    } else if (data.response === 'Sure, what are you looking for?') {
                        var responseMarkdown = '> Sure, What are you looking to search for?';
                        var converter = new showdown.Converter();
                        var responseHTML = converter.makeHtml(responseMarkdown);
                        var typingSpeed = 1e-15;
                        var botMessageHTML = `<div class="message-container"><div class="bot-avatar"><div id="dp" data-bs-toggle="modal" data-bs-target="#modalPopup">
                            <img id="thumbnail" src="https://betatest.ezeeshipping.in/assets/img/EZ_New_LogoAboveText.png" alt="EzeeBot Logo" style="width: 90%; height: 90%; margin-top: 1.2px; margin-left: 0.8px; object-fit: contain; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); clip-path: inset(0 0 8px 0);">
                        </div></div><div class="bot-message-chat-2 typing13" style="line-height: 1.5;"></div></div>`;
                        chatContainer.innerHTML += botMessageHTML;
                        var currentTime = new Date().toLocaleTimeString();
                        var botTimeHTML = '<div class="bot-time">' + 'EZEEBOT , ' + currentTime + '</div>';

                        function typeWriter() {
                            var botMessageElement = chatContainer.querySelector('.bot-message-chat-2.typing13');
                            botMessageElement.innerHTML = responseHTML.substring(0, index);
                            index++;  
                                        
                            if (index <= responseHTML.length) {
                                setTimeout(typeWriter, typingSpeed * 1000);
                                scrollToBottom();
                            } else {
                                botMessageElement.classList.remove('typing13');
                                scrollToBottom();
                                chatContainer.innerHTML += botTimeHTML;
                                scrollToBottom();
                            }
                        }
                                        
                        var index = 0;
                        closeType();
                        typeWriter();
                        var userInput = document.getElementById('user-input');
                        userInput.focus();
                        if (userInputElement._listener) {
                            userInputElement.removeEventListener('keypress', userInputElement._listener);
                        }
                        userInputElement._listener = function(event) {
                            if (event.key === 'Enter') {
                                event.preventDefault();
                                var userInput = this.value.trim();
                                simpleUserMessage(userInput);
                                var weather = this.value.trim();
                                this.value = '';
                                if (weather !== '') {
                                    typingMessage();
                                    fetch('/chat_input', {
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/json',
                                        },
                                        body: JSON.stringify({
                                            user_input: {
                                                'section': pattern,
                                                'value_to_search': weather,
                                                'time_period': 'Last Month',
                                                'environment': environment,
                                                'current_date': formattedDate,
                                                'tenantid': tenantid,
                                                'officeid': officeid,
                                                'userid': userid
                                            }
                                        }),
                                    })
                                    .then(response => response.json())
                                    .then(data => {
                                        var responseMarkdown = data.response;
                                        var converter = new showdown.Converter();
                                        var responseHTML = converter.makeHtml(responseMarkdown);
                                        var typingSpeed = 1e-15;
                                        var botMessageHTML = `<div class="message-container"><div class="bot-avatar"><div id="dp" data-bs-toggle="modal" data-bs-target="#modalPopup">
                                            <img id="thumbnail" src="https://betatest.ezeeshipping.in/assets/img/EZ_New_LogoAboveText.png" alt="EzeeBot Logo" style="width: 90%; height: 90%; margin-top: 1.2px; margin-left: 0.8px; object-fit: contain; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); clip-path: inset(0 0 8px 0);">
                                        </div></div><div class="bot-message-chat-2 typing11" style="line-height: 1.5;"></div></div>`;
                                        chatContainer.innerHTML += botMessageHTML;
                                        var currentTime = new Date().toLocaleTimeString();
                                        var botTimeHTML = '<div class="bot-time">' + 'EZEEBOT , ' + currentTime + '</div>';

                                        function typeWriter() {
                                            var botMessageElement = chatContainer.querySelector('.bot-message-chat-2.typing11');
                                            botMessageElement.innerHTML = responseHTML.substring(0, index);
                                            index++;  
                                        
                                            if (index <= responseHTML.length) {
                                                setTimeout(typeWriter, typingSpeed * 1000);
                                                scrollToBottom();
                                            } else {
                                                botMessageElement.classList.remove('typing11');
                                                scrollToBottom();
                                                var buttonContainerHTML = '<div id="patterns" class="button-container">' +
                                                    '<button onclick="handleButtonClick(\'today\', \'1\', \'' + pattern + '\', \'' + userInputHistory + '\', \'' + ntype + '\')">Today</button>' +
                                                    '<button onclick="handleButtonClick(\'last week\', \'7\', \'' + pattern + '\', \'' + userInputHistory + '\', \'' + ntype + '\')">Last Week</button>'+
                                                    '<button onclick="handleButtonClick(\'last month\', \'30\', \'' + pattern + '\', \'' + userInputHistory + '\', \'' + ntype + '\')">Last Month</button>' +
                                                    '<button onclick="handleButtonClick(\'six month\', \'180\', \'' + pattern + '\', \'' + userInputHistory + '\', \'' + ntype + '\')">Six Month</button>' +
                                                    '<button onclick="handleButtonClick(\'one year\', \'365\', \'' + pattern + '\', \'' + userInputHistory + '\', \'' + ntype + '\')">One Year</button>' +
                                                    '</div>';
                                                chatContainer.innerHTML += botTimeHTML;
                                                scrollToBottom();
                                                setTimeout(function() {
                                                    value_search(pattern);
                                                }, 0);
                                                userInputElement.removeEventListener('keypress', userInputElement._listener);
                                            }
                                        }
                                        
                                        var index = 0;
                                        closeType();
                                        typeWriter();
                                    })
                                    .catch(error => {
                                        console.error('Error:', error);
                                    });
                                } else {
                                    alert('Please provide a valid booking number');
                                }
                            }
                        };
                        userInputElement.addEventListener('keypress', userInputElement._listener);
                    } else if (data.response2 === 'The number of quotations from name is namequotation.' || data.response2 === 'The number of buyings from name is namebuying.' || data.response2 === 'The number of enquirys from name is nameenquiry.' || data.response2 === 'The number of leads from name is namelead.' || data.response2 === 'The number of sellings from name is nameselling.' || data.response2 === 'The number of payments from name is namepayment.' || data.response2 === 'The number of receipts from name is namereceipt.' || data.response2 === 'The number of ffrBookings from name is nameffrBooking.' || data.response2 === 'The number of billoflads from name is namebilloflad.' || data.response2 === 'The number of awbs from name is nameawb.' || data.response2 === 'The number of custombookings from name is namecustombooking.' || data.response2 === 'The number of for last month with name is leadquery.' || data.response2 === 'The number of for last month with name is enquiryquery.' || data.response2 === 'The number of for last month with name is quotationquery.') {
                        var ntype = 'non_gross'
                        var responseMarkdown = data.response + 'Select the time frame if you want to know the same details in that time frame.';
                        var converter = new showdown.Converter();
                        var responseHTML = converter.makeHtml(responseMarkdown);
                        
                        var typingSpeed = 1e-15;
                        
                        var botMessageHTML = `<div class="message-container"><div class="bot-avatar"><div id="dp" data-bs-toggle="modal" data-bs-target="#modalPopup">
                            <img id="thumbnail" src="https://betatest.ezeeshipping.in/assets/img/EZ_New_LogoAboveText.png" alt="EzeeBot Logo" style="width: 90%; height: 90%; margin-top: 1.2px; margin-left: 0.8px; object-fit: contain; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); clip-path: inset(0 0 8px 0);">
                        </div></div><div class="bot-message-chat-res typingmon" style="line-height: 1.5;"></div></div>`;
                        
                        chatContainer.innerHTML += botMessageHTML;
                        console.log(responseMarkdown);
                        
                        var currentTime = new Date().toLocaleTimeString();
                        var botTimeHTML = '<div class="bot-time">' + 'EZEEBOT , ' + currentTime + '</div>';
                        
                        function typeWriter() {
                            var botMessageElement = chatContainer.querySelector('.bot-message-chat-res.typingmon');
                            var words = responseHTML.split(' ');
                            var currentText = words.slice(0, index).join(' ');
                            botMessageElement.innerHTML = currentText;
                            index++;  
                            
                            if (index <= words.length) {
                                setTimeout(typeWriter, typingSpeed * 1000);
                                scrollToBottom();
                                scrollToBottombottable();
                                scrollToBottom();
                            } else {
                                botMessageElement.classList.remove('typingmon');
                                
                                var buttonContainerHTML = '<div id="patterns" class="button-container">' +
                                    '<button onclick="handleButtonClick(\'today\', \'1\', \'' + pattern + '\', \'' + userInputHistory + '\', \'' + ntype + '\')">Today</button>' +
                                    '<button onclick="handleButtonClick(\'last week\', \'7\', \'' + pattern + '\', \'' + userInputHistory + '\', \'' + ntype + '\')">Last Week</button>' +
                                    '<button onclick="handleButtonClick(\'last month\', \'30\', \'' + pattern + '\', \'' + userInputHistory + '\', \'' + ntype + '\')">Last Month</button>' +
                                    '<button onclick="handleButtonClick(\'six month\', \'180\', \'' + pattern + '\', \'' + userInputHistory + '\', \'' + ntype + '\')">Six Month</button>' +
                                    '<button onclick="handleButtonClick(\'one year\', \'365\', \'' + pattern + '\', \'' + userInputHistory + '\', \'' + ntype + '\')">One Year</button>' +
                                    '</div>';

                                chatContainer.innerHTML += botTimeHTML + buttonContainerHTML;
                                scrollToBottom();
                                tooltip();
                                
                                setTimeout(function() {
                                    send_inputs(pattern);
                                }, 0);
                                
                                userInputElement.removeEventListener('keypress', userInputElement._listener);
                            }
                        }                                
                        
                        var index = 0;
                        closeType();
                        typeWriter();                                
                        
                    } else {
                        var responseMarkdown = data.response;
                        var converter = new showdown.Converter();
                        var responseHTML = converter.makeHtml(responseMarkdown);
                        var typingSpeed = 1e-15;
                        var botMessageHTML = `<div class="message-container"><div class="bot-avatar"><div id="dp" data-bs-toggle="modal" data-bs-target="#modalPopup">
                            <img id="thumbnail" src="https://betatest.ezeeshipping.in/assets/img/EZ_New_LogoAboveText.png" alt="EzeeBot Logo" style="width: 90%; height: 90%; margin-top: 1.2px; margin-left: 0.8px; object-fit: contain; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); clip-path: inset(0 0 8px 0);">
                        </div></div><div class="bot-message-chat-2 typingmon" style="line-height: 1.5;"></div></div>`;
                        chatContainer.innerHTML += botMessageHTML;
                        var currentTime = new Date().toLocaleTimeString();
                        var botTimeHTML = '<div class="bot-time">' + 'EZEEBOT , ' + currentTime + '</div>';

                        function typeWriter() {
                            var botMessageElement = chatContainer.querySelector('.bot-message-chat-2.typingmon');
                            botMessageElement.innerHTML = responseHTML.substring(0, index);
                            index++;  
                        
                            if (index <= responseHTML.length) {
                                setTimeout(typeWriter, typingSpeed * 1000);
                                scrollToBottom();
                            } else {
                                botMessageElement.classList.remove('typingmon');
                                scrollToBottom();
                                chatContainer.innerHTML += botTimeHTML;
                                scrollToBottom();
                                setTimeout(function() {
                                    send_inputs(pattern);
                                }, 0);
                                userInputElement.removeEventListener('keypress', userInputElement._listener);
                            }
                        }
                        
                        var index = 0;
                        closeType();
                        typeWriter();
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                });
            } else {
                alert('Please provide a valid input');
            } 
        }
    };

    userInputElement.addEventListener('keypress', userInputElement._listener);
}        

function handleButtonClick(message, month, pattern, userInputHistory, ntype) {
    simpleUserMessage(message);
    months_input(month, pattern, message, userInputHistory, ntype);
}   

function months_input(month, pattern, message, userInputHistory, ntype){
    typingMessage();
                    fetch('/chat_input', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            user_input: {
                                'month': month,
                                'user_text': userInputHistory,
                                'field': ntype,
                                'section': pattern,
                                'time_period': message,
                                'environment': environment,
                                'current_date': formattedDate,
                                'tenantid': tenantid,
                                'officeid': officeid,
                                'userid': userid,
                                'ffrid': ffrid,
                                'chaid': chaid
                            }
                        }),
                    })
                    .then(response => response.json())
                    .then(data => {
                        if (data.response){
                            var responseMarkdown = data.response  + 'Select the time frame if you want to know the same details in that time frame.';
                            var converter = new showdown.Converter();
                            var responseHTML = converter.makeHtml(responseMarkdown);
                            var typingSpeed = 1e-15;
                            var botMessageHTML = `<div class="message-container"><div class="bot-avatar"><div id="dp" data-bs-toggle="modal" data-bs-target="#modalPopup">
                                <img id="thumbnail" src="https://betatest.ezeeshipping.in/assets/img/EZ_New_LogoAboveText.png" alt="EzeeBot Logo" style="width: 90%; height: 90%; margin-top: 1.2px; margin-left: 0.8px; object-fit: contain; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); clip-path: inset(0 0 8px 0);">
                            </div></div><div class="bot-message-chat-res typingmon" style="line-height: 1.5;"></div></div>`;
                            chatContainer.innerHTML += botMessageHTML;
                            var currentTime = new Date().toLocaleTimeString();
                            var botTimeHTML = '<div class="bot-time">' + 'EZEEBOT , ' + currentTime + '</div>';

                            function typeWriter() {
                                var botMessageElement = chatContainer.querySelector('.bot-message-chat-res.typingmon');
                                var words = responseHTML.split(' ');
                                var currentText = words.slice(0, index).join(' ');
                                botMessageElement.innerHTML = currentText;
                                index++;  
                                
                                if (index <= words.length) {
                                    setTimeout(typeWriter, typingSpeed * 1000);
                                    scrollToBottom();
                                    scrollToBottombottable();
                                    scrollToBottom();
                                } else {
                                    botMessageElement.classList.remove('typingmon');
                                    
                                    var buttonContainerHTML = '<div id="patterns" class="button-container">' +
                                        '<button onclick="handleButtonClick(\'today\', \'1\', \'' + pattern + '\', \'' + userInputHistory + '\', \'' + ntype + '\')">Today</button>' +
                                        '<button onclick="handleButtonClick(\'last week\', \'7\', \'' + pattern + '\', \'' + userInputHistory + '\', \'' + ntype + '\')">Last Week</button>' +
                                        '<button onclick="handleButtonClick(\'last month\', \'30\', \'' + pattern + '\', \'' + userInputHistory + '\', \'' + ntype + '\')">Last Month</button>' +
                                        '<button onclick="handleButtonClick(\'six month\', \'180\', \'' + pattern + '\', \'' + userInputHistory + '\', \'' + ntype + '\')">Six Month</button>' +
                                        '<button onclick="handleButtonClick(\'one year\', \'365\', \'' + pattern + '\', \'' + userInputHistory + '\', \'' + ntype + '\')">One Year</button>' +
                                        '</div>';

                                    chatContainer.innerHTML += botTimeHTML + buttonContainerHTML;
                                    scrollToBottom();
                                    
                                    setTimeout(function() {
                                        send_inputs(pattern);
                                    }, 0);
                                    
                                    userInputElement.removeEventListener('keypress', userInputElement._listener);
                                }
                            }
                        
                            var index = 0;
                            closeType();
                            typeWriter();
                        }
                    })
                    .catch(error => {
                        console.error('Error:', error);
                    });
                }
function sendPattern2(tag){
    var botMessageHTML = `<div class="message-container"><div class="bot-avatar"><div id="dp" data-bs-toggle="modal" data-bs-target="#modalPopup">
        <img id="thumbnail" src="https://betatest.ezeeshipping.in/assets/img/EZ_New_LogoAboveText.png" alt="EzeeBot Logo" style="width: 90%; height: 90%; margin-top: 1.2px; margin-left: 0.8px; object-fit: contain; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); clip-path: inset(0 0 8px 0);">
    </div></div><div class="bot-message-chat">Please type in to Search...</b></div></div>`;
    //var botMessageHTML = '<div class="message-container"><div class="bot-avatar" data-bs-toggle="modal" data-bs-target="#modalPopup"><img src="https://betatest.ezeeshipping.in/assets/img/EZ_New_LogoAboveText.png" alt="EzeeBot Logo" style="width: 30px; height: auto;"></div><div class="bot-message">Please type in to Search...</div></div>';
    chatContainer.innerHTML += botMessageHTML;
    scrollToBottom();
    sendPattern3(tag);
}  

function loadIframe(linkElement, link) {
    if (confirm("Do you want to open this link here? Click 'OK' to open in iframe or 'Cancel' to open in a new tab.")) {
        var formattedLink = link.startsWith("http") ? link : "https://" + link;
    var iframeHTML = `
        <div class="iframe-container">
            <iframe class="news-iframe" src="${formattedLink}" frameborder="0"></iframe>
            <button class="close-button">Close</button>
        </div>
    `;
    var iframeContainer = document.createElement('div');
    iframeContainer.innerHTML = iframeHTML;

    linkElement.parentElement.innerHTML = iframeContainer.innerHTML;

    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('close-button')) {
            var linkHTML = `<a class="news-link" href="#" onclick="loadIframe(this, '${link}')">${link}</a>`;
            var iframeContainer = event.target.closest('.iframe-container');
            if (iframeContainer) {
                iframeContainer.innerHTML = linkHTML;
            }
        }
    });
    } else {
        window.open(link, '_blank');
    }
}                                                             

function sendPattern3(tag){
    var userInput = document.getElementById('user-input');
    userInput.focus();

    var userInputElement = document.getElementById('user-input');

    if (userInputElement._listener) {
        userInputElement.removeEventListener('keypress', userInputElement._listener);
    }

    userInputElement._listener = function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            var botMessageCheck = document.querySelector('.bot-message-check-'+ tag.toLowerCase() +'');
            if (botMessageCheck) {
                botMessageCheck.remove();
            }

            var userInput = this.value.trim();

            userInputHistory = [];
            userInputHistory.push(userInput);

            simpleUserMessage(userInput);

            this.value = '';

            if (userInput !== '') {
                typingMessage();

                fetch('/chat', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        user_input: {
                            'tag': tag,
                            'input': userInput,
                            'environment': environment,
                            'current_date': formattedDate,
                            'tenantid': tenantid,
                            'officeid': officeid,
                            'userid': userid
                        }
                    }),
                })
                .then(response => response.json())
                .then(data => {
                    console.log(data.response);
                    if (Array.isArray(data.response)) {
                        var newsItems = data.response;
                        var newsResultsHTML = '';
                
                        newsItems.forEach(newsItem => {
                            newsResultsHTML += `
                                <div class="news-item">
                                    <h2 class="news-title">${newsItem.title}</h2>
                                    <p><a class="news-link" href="#" onclick="loadIframe(this, '${newsItem.link}')">${newsItem.link}</a></p>
                                    <p class="news-snippet">${newsItem.snippet}</p>
                                </div>
                            `;
                        });
                        var responseHTML = newsResultsHTML + '<div style="margin-top: 20px;">These are the go-to websites relevant to your search.</div>';
                        var typingSpeed = 1e-15;
                        var botMessageHTML = `<div class="message-container"><div class="bot-avatar"><div id="dp" data-bs-toggle="modal" data-bs-target="#modalPopup">
                            <img id="thumbnail" src="https://betatest.ezeeshipping.in/assets/img/EZ_New_LogoAboveText.png" alt="EzeeBot Logo" style="width: 90%; height: 90%; margin-top: 1.2px; margin-left: 0.8px; object-fit: contain; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); clip-path: inset(0 0 8px 0);">
                        </div></div><div class="bot-message-chat typingcse">`;
                        chatContainer.innerHTML += botMessageHTML;
                        var currentTime = new Date().toLocaleTimeString();
                        var botTimeHTML = '<div class="bot-time">' + 'EZEEBOT , ' + currentTime + '</div>';

                        function typeWriter() {
                            var botMessageElement = chatContainer.querySelector('.bot-message-chat.typingcse');
                            var words = responseHTML.split(' ');
                            var currentText = words.slice(0, index).join(' ');
                            botMessageElement.innerHTML = currentText;
                            index++;
                                                
                            if (index <= words.length) {
                                setTimeout(typeWriter, typingSpeed * 1000);
                                scrollToBottom();
                            } else {
                                botMessageElement.classList.remove('typingcse');
                                chatContainer.innerHTML += botTimeHTML;   
                                scrollToBottom();
                            }
                        }
                                                
                        var index = 0;               
                        typeWriter();
                        
                    } else {
                        var botMessageHTML = `<div class="message-container"><div class="bot-avatar"><div id="dp" data-bs-toggle="modal" data-bs-target="#modalPopup">
                            <img id="thumbnail" src="https://betatest.ezeeshipping.in/assets/img/EZ_New_LogoAboveText.png" alt="EzeeBot Logo" style="width: 90%; height: 90%; margin-top: 1.2px; margin-left: 0.8px; object-fit: contain; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); clip-path: inset(0 0 8px 0);">
                        </div></div><div class="bot-message-chat">${data.response}</b></div></div>`;
                
                        var currentTime = new Date().toLocaleTimeString();
                        var botTimeHTML = `<div class="bot-time">EZEEBOT, ${currentTime}</div>`;
                
                        chatContainer.innerHTML += botMessageHTML + botTimeHTML;
                    }
                
                    closeType();
                    scrollToBottom();
                    setTimeout(function() {
                        sendPattern3(tag);
                    }, 0);
                    userInputElement.removeEventListener('keypress', userInputElement._listener);
                })                                                
                .catch(error => {
                    console.error('Error:', error);
                });
            } else {
                alert('Please provide a valid input');
            } 
        }
    };

    userInputElement.addEventListener('keypress', userInputElement._listener);
}

function simpleUserMessage(message){
    var userMessageHTML = '<div class="message-container"><div class="user-message">' + capitalizeFirstLetter(message) + '</div></div>';
    chatContainer.innerHTML += userMessageHTML;
    var tagsDiv = document.getElementById('patterns');
        if (tagsDiv) {
            tagsDiv.parentNode.removeChild(tagsDiv);
        }
}

function simpleUserMessage3(message) {
    var formattedMessage = message;
    if (Array.isArray(message)) {
        formattedMessage = message.join(', ');
    }

    formattedMessage = formattedMessage.replace(/(?:^|, )(\w+)/g, function(match) {
        return match.charAt(0).toUpperCase() + match.slice(1);
    });

    var userMessageHTML = '<div class="message-container"><div class="user-message">' + formattedMessage + '</div></div>';
    chatContainer.innerHTML += userMessageHTML;

    var tagsDiv = document.getElementById('patterns');
    if (tagsDiv) {
        tagsDiv.parentNode.removeChild(tagsDiv);
    }
}                

function simpleUserMessage2(message){
    var userMessageHTML = '<div class="message-container"><div class="user-message">' + message + '</div></div>';
    chatContainer.innerHTML += userMessageHTML;
    askBookingNumber2(message);
    var tagsDiv = document.getElementById('patterns');
        if (tagsDiv) {
            tagsDiv.parentNode.removeChild(tagsDiv);
        }
}

function quotation(messages){
    var inputValues = {};
    var currentIndex = 0;
    var userInputElement = document.getElementById('user-input');

    function displayPrompt() {
        var message = messages[currentIndex];
        var botMessageHTML = `<div class="message-container"><div class="bot-avatar"><div id="dp" data-bs-toggle="modal" data-bs-target="#modalPopup">
            <img id="thumbnail" src="https://betatest.ezeeshipping.in/assets/img/EZ_New_LogoAboveText.png" alt="EzeeBot Logo" style="width: 90%; height: 90%; margin-top: 1.2px; margin-left: 0.8px; object-fit: contain; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); clip-path: inset(0 0 8px 0);">
        </div></div><div class="bot-message-chat">`;
        //var botMessageHTML = '<div class="message-container"><div class="bot-avatar" data-bs-toggle="modal" data-bs-target="#modalPopup"><img src="https://betatest.ezeeshipping.in/assets/img/EZ_New_LogoAboveText.png" alt="EzeeBot Logo" style="width: 30px; height: auto;"></div><div class="bot-message">';
        var botMessageHTML2 = '<div class="message-container"><div class="bot-message-time">';

            if (message.toLowerCase() === "from date") {
                botMessageHTML += 'Please enter the "<b>' + message + '</b>"';
                chatContainer.innerHTML += botMessageHTML;
                var currentTime = new Date().toLocaleTimeString();
                var botTimeHTML = '<div class="bot-time">' + 'EZEEBOT , ' + currentTime + '</div>';
                chatContainer.innerHTML += botTimeHTML;
                var currentDate = new Date();
                currentDate.setMonth(currentDate.getMonth() - 1);

                var year = currentDate.getFullYear();
                var month = String(currentDate.getMonth() + 1).padStart(2, '0');
                var day = String(currentDate.getDate()).padStart(2, '0');
                var hours = String(currentDate.getHours()).padStart(2, '0');
                var minutes = String(currentDate.getMinutes()).padStart(2, '0');
                var defaultDate = year + '-' + month + '-' + day + 'T' + hours + ':' + minutes;

                botMessageHTML2 += '<input type="datetime-local" id="datetime-input" value="' + defaultDate + '">';
                chatContainer.innerHTML += botMessageHTML2;
                setTimeout(function() {
                    var datetimeInput = document.getElementById('datetime-input');
                    datetimeInput.focus();
                }, 0);
                scrollToBottom();
        
                var datetimeInput = document.getElementById('datetime-input');

                userInputElement.style.display = 'none';
        
                datetimeInput.addEventListener('blur', function(event) {
                    var userInput = this.value.trim().split("T")[0];
                    simpleUserMessage(userInput);
        
                    inputValues["quo" + message.toLowerCase().replace(/\s+/g, '_')] = userInput;

                    var botMessageCheck = document.querySelector('.bot-message-time');
                    if (botMessageCheck) {
                        botMessageCheck.remove();
                    }

                    userInputElement.style.display = 'block';
        
                    currentIndex++;
                    if (currentIndex < messages.length) {
                        displayPrompt();
                    } else {
                        sendAllInputs();
                    }
                });
            } else if (message.toLowerCase() === "to date") {
                botMessageHTML += 'Please enter the "<b>' + message + '</b>"';
                chatContainer.innerHTML += botMessageHTML;
                var currentTime = new Date().toLocaleTimeString();
                var botTimeHTML = '<div class="bot-time">' + 'EZEEBOT , ' + currentTime + '</div>';
                chatContainer.innerHTML += botTimeHTML;
                var defaultDate = new Date().toISOString().slice(0, 16);
                botMessageHTML2 += '<input type="datetime-local" id="datetime-input" value="' + defaultDate + '">';
                chatContainer.innerHTML += botMessageHTML2;
                setTimeout(function() {
                    var datetimeInput = document.getElementById('datetime-input');
                    datetimeInput.focus();
                }, 0);
                scrollToBottom();
        
                var datetimeInput = document.getElementById('datetime-input');

                userInputElement.style.display = 'none';
        
                datetimeInput.addEventListener('blur', function(event) {
                    var userInput = this.value.trim().split("T")[0];
                    simpleUserMessage(userInput);
        
                    inputValues["quo" + message.toLowerCase().replace(/\s+/g, '_')] = userInput;

                    var botMessageCheck = document.querySelector('.bot-message-time');
                    if (botMessageCheck) {
                        botMessageCheck.remove();
                    }

                    userInputElement.style.display = 'block';
        
                    currentIndex++;
                    if (currentIndex < messages.length) {
                        displayPrompt();
                    } else {
                        sendAllInputs();
                    }
                });
            } else {
            botMessageHTML += 'Please type in the "<b>' + message + '</b>"';
            chatContainer.innerHTML += botMessageHTML;
            var currentTime = new Date().toLocaleTimeString();
            var botTimeHTML = '<div class="bot-time">' + 'EZEEBOT , ' + currentTime + '</div>';
            chatContainer.innerHTML += botTimeHTML;
            scrollToBottom();
    
            userInputElement.focus();
    
            if (userInputElement._listener) {
                userInputElement.removeEventListener('keypress', userInputElement._listener);
            }
    
            userInputElement._listener = function (event) {
                if (event.key === 'Enter') {
                    event.preventDefault();
                    var userInput = this.value.trim();
                    simpleUserMessage(userInput);
    
                    inputValues["quo" + message.toLowerCase().replace(/\s+/g, '_')] = userInput;
    
                    this.value = '';
    
                    currentIndex++;
                    if (currentIndex < messages.length) {
                        displayPrompt();
                    } else {
                        sendAllInputs();
                    }
                }
            };
    
            userInputElement.addEventListener('keypress', userInputElement._listener);
        }
    }

    function sendAllInputs() {
        typingMessage();
        fetch('/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_input: {
                    ...inputValues,
                    'current_date': formattedDate,
                    'tenantid': tenantid,
                    'officeid': officeid,
                    'userid': userid,
                    'userid2': userid2,
                    'environment': environment,
                    'userid2': userid2
                }
            }),
        })
        .then(response => response.json())
        .then(data => {
            var inputSummary = '<b>[ </b>' + Object.keys(inputValues).map(function(key, index, array) {
                var displayKey = key.replace(/^quo/, '').replace(/_/g, ' ');
                var comma = (index !== array.length - 1) ? ', ' : '';
                return '<b>' + displayKey + ':</b> ' + inputValues[key] + comma;
            }).join('') + '<b> ]</b>';        
            
            var botMessageHTML = `<div class="message-container"><div class="bot-avatar"><div id="dp" data-bs-toggle="modal" data-bs-target="#modalPopup">
                <img id="thumbnail" src="https://betatest.ezeeshipping.in/assets/img/EZ_New_LogoAboveText.png" alt="EzeeBot Logo" style="width: 90%; height: 90%; margin-top: 1.2px; margin-left: 0.8px; object-fit: contain; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); clip-path: inset(0 0 8px 0);">
            </div></div><div class="bot-message-booking"><b>Quotation search result based on your criteria </b>${formatKeyValueList(inputSummary)}`;
            
            //var botMessageHTML = '<div class="message-container"><div class="bot-avatar" data-bs-toggle="modal" data-bs-target="#modalPopup"><img src="https://betatest.ezeeshipping.in/assets/img/EZ_New_LogoAboveText.png" alt="EzeeBot Logo" style="width: 30px; height: auto;"></div><div class="bot-message-booking"><b>Quotation search result based on your criteria <br><br></b>' + '<span style="font-size:14px;">' + formatKeyValueList(inputSummary) + '</span><br><br>';

                var bookingSets = data.response.split('},');

                if (bookingSets.length > 1) {
                    botMessageHTML += '<b>Multiple entries found. Please pick one to view more details</b><br><br>';
                    var counter = 1;
                    var buttonHTML = '';
                
                    bookingSets.forEach((bookingSet, index) => {
                        var cleanedBookingSet = bookingSet.replace(/[\[\]{}"]/g, '');
                
                        if (cleanedBookingSet.trim() !== '') {
                            cleanedBookingSet = cleanedBookingSet.trim();
                
                            var keyValuePairs = cleanedBookingSet.split(',');
                
                            var bookingNumber = '';
                            var statusCode = '';
                            var det = '';
                            var bookingHTML = '<table class="booking-details">';
                            keyValuePairs.forEach(pair => {
                                var parts = pair.split(':');
                                var key = parts[0].trim();
                                var value = parts.slice(1).join(':').trim();
                
                                if (key.toUpperCase() === 'QUOTATION NUMBER') {
                                    if (value === 'null') {
                                        bookingNumber = null;
                                    } else {
                                        bookingNumber = value;
                                    }
                                } else if (key.toUpperCase() === 'SEARCH COMPANY') {
                                    if (value === 'null') {
                                        searchcompany = null;
                                    } else {
                                        searchcompany = value;
                                    }
                                } else if (key.toUpperCase() === 'STATUS' && !bookingNumber) {
                                    statusCode = value;
                                } else if (key.toUpperCase() === 'SHIPMENT TYPE') {
                                    det += value;
                                } else if (key.toUpperCase() === 'CONTACT NAME') {
                                    det += value;
                                } else if (key.toUpperCase() === 'SHIPMENT TERM') {
                                    det += value;
                                } else if (key.toUpperCase() === 'ORIGIN') {
                                    det += value;
                                } else if (key.toUpperCase() === 'DESTINATION') {
                                    det += value;
                                } else if (key.toUpperCase() === 'STATUS') {
                                    det += value;
                                } else if (key.toUpperCase() === 'QUOTATION DATE') {
                                    quodate = value;
                                }
                
                                bookingHTML += '<tr><td><span class="key">' + key + '</span></td><td><span class="value">' + value + '</span></td></tr>\n';
                            });
                            bookingHTML += '</table>';
                
                            if (!bookingNumber) {
                                buttonHTML += '<button class="booking-button" onclick="showBookingDetails(\'' + bookingNumber + '\', ' + counter + ')"><div style="float: left; width: 33%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: left; border-right: 2px solid #f2f2f2;">' + searchcompany + '<span color: transparent;' + det +'</span></div><div style="display: inline-block; text-align: center; width: 33%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: center;">' + quodate + '</div><div style="float: right; width: 33%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: right; border-left: 2px solid #f2f2f2;">' + statusCode + '</div></button><br>';
                            } else {
                                buttonHTML += '<button class="booking-button" onclick="showBookingDetails(\'' + bookingNumber + '\', ' + counter + ')"><div style="float: left; width: 33%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: left; border-right: 2px solid #f2f2f2;">' + searchcompany + '<span color: transparent;' + det +'</span></div><div style="display: inline-block; text-align: center; width: 33%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: center;">' + quodate + '</div><div style="float: right; width: 33%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: right; border-left: 2px solid #f2f2f2;">' + bookingNumber + '</div></button><br>';
                            }

                            buttonHTML += '<div id="' + counter + 'bookingDetails_' + bookingNumber + '" style="display: none;">' + bookingHTML + '</div><br>';
                            counter++;
                        }
                    });

                    var botDiv = `<div style="border: 1px solid transparent; padding-top: 10px; padding-left: 2px; padding-right: 2px; padding-bottom: 3px; border-radius: 10px; margin-top: 10px; background-color: #c0c0c0;">`;
                    botDiv += '<input type="text" id="search-input" style="width: 100%;" placeholder="Global Search...">';
                    var botDiv2 = `<div style="border-left: 1px solid transparent; background-color: #e5e4e2; padding: 4px; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;">`;
                    botDiv2 += '<div id="num" style="font-size: 14px; display: flex; padding: 5px; align-items: left; justify-content: left;"></div>';
                    botDiv2 += '<div><table style="border-collapse: collapse; width: 100%; margin-bottom: 5px;"><thead style="background-color: #002147; color: white;"><tr><th style="border: 1px solid #dddddd; text-align: left; padding: 8px; width: 33.17%;">COMPANY</th><th style="border: 1px solid #dddddd; text-align: center; padding: 8px; width: 33.16%;">QUOTATION DATE</th><th style="border: 1px solid #dddddd; text-align: right; padding: 8px; width: 33.66%;">QUOTATION NO</th></tr></thead></table></div>';
                    botDiv2 +=  '<div id="bot-message-scroll" style="max-height: 250px; overflow-y: auto; overflow-x: hidden;">' + buttonHTML +'</div>';
                    botDiv2 += `</div>`;
                    botDiv += botDiv2;
                    botDiv += `</div>`;
                    botMessageHTML += botDiv;
                    botMessageHTML += '<div style="margin-top: 20px;"><b>If you have any questions or concerns about the results, please verify them using our application or contact our support team.</b></div>';
                }
                 else {
                    bookingSets.forEach(bookingSet => {
                        var cleanedBookingSet = bookingSet.replace(/[\[\]{}"]/g, '');
                
                        if (cleanedBookingSet.trim() !== '') {
                            cleanedBookingSet = cleanedBookingSet.trim();
                
                            var keyValuePairs = cleanedBookingSet.split(',');
                
                            var bookingHTML = '<table class="booking-details">';
                            keyValuePairs.forEach(pair => {
                                var parts = pair.split(':');
                                var key = parts[0].trim();
                                var value = parts.slice(1).join(':').trim();
                
                                bookingHTML += '<tr><td><span class="key">' + key + '</span></td><td><span class="value">' + value + '</span></td></tr>\n';
                            });
                            bookingHTML += '</table><br>';
                            botMessageHTML += bookingHTML;
                        }
                    });
                }
                
                botMessageHTML += '</div></div>';
                chatContainer.innerHTML += botMessageHTML;
                var currentTime = new Date().toLocaleTimeString();
                var botTimeHTML = '<div class="bot-time">'+ 'EZEEBOT , ' + currentTime + '</div>';
                chatContainer.innerHTML += botTimeHTML;
                document.addEventListener('input', function (event) {
                    if (event.target.id === 'search-input') {
                        var searchValue = event.target.value.toLowerCase();
                        var botMessageScroll = document.getElementById('bot-message-scroll');
                        var buttons = botMessageScroll.getElementsByClassName('booking-button');
                        var moduleName = 'quotations';

                        filterButtons(searchValue, buttons, moduleName);
                    }
                });
                closeType(); 
                scrollToBottom();
        
            userInputElement.removeEventListener('keypress', userInputElement._listener);
        })
        .catch(error => {
            console.error('Error:', error);
        });                

    }
    displayPrompt();
} 

function filterButtons(searchValue, buttons, moduleName) {
    console.log('enter');
    var botMessageScroll = document.getElementById('bot-message-scroll');
    var existingNoRecordsMessage = botMessageScroll.querySelector('.no-records-message');

    for (var i = 0; i < buttons.length; i++) {
        buttons[i].style.display = 'none';
    }

    var buttonsFound = false;
    var filteredCount = 0;

    function debounce(func) {
        var timeoutId;
        return function () {
            var context = this;
            var args = arguments;
            clearTimeout(timeoutId);
            timeoutId = setTimeout(function () {
                func.apply(context, args);
            });
        };
    }

    var debouncedFilter = debounce(function () {
        for (var i = 0; i < buttons.length; i++) {
            var button = buttons[i];
            var buttonHTML = button.outerHTML.toLowerCase();
            if (buttonHTML.includes(searchValue.toLowerCase())) {
                button.style.display = 'block';
                button.style.marginBottom = '20px';
                botMessageScroll.prepend(button);
                buttonsFound = true;
                filteredCount++;
            }
        }

        if (!buttonsFound && !existingNoRecordsMessage) {
            var noRecordsMessage = document.createElement('div');
            noRecordsMessage.className = 'no-records-message';
            noRecordsMessage.innerText = 'No records found';
            botMessageScroll.prepend(noRecordsMessage);
        }

        if (buttonsFound && existingNoRecordsMessage) {
            existingNoRecordsMessage.remove();
        }

        console.log('Filtered Button Count:', filteredCount);
        
        var filterCountDiv = document.getElementById('num');
        if (filterCountDiv) {
            if (searchValue.toLowerCase() === '') {
                filterCountDiv.innerHTML = '<b>Total number of&nbsp;' + moduleName + '&nbsp;are&nbsp<span style="color: red">' + filteredCount + '</span></b>';
            }else{
                filterCountDiv.innerHTML = "<b>Number of&nbsp;" + moduleName + "&nbsp;for your search&nbsp;'" + searchValue.toUpperCase() + "'&nbsp;is&nbsp;<span style='color: red'>" + filteredCount + "</span></b>";
            }
        }
        
        botMessageScroll.scrollTop = 0;
    });

    debouncedFilter();
}                                            

function showBookingDetails(bookingNumber, counter) {
    var sanitizedBookingNumber = bookingNumber.replace(/\s+/g, '_');

    var bookingDetailsDivs = document.querySelectorAll('[id^="' + counter + 'bookingDetails_"]');

    for (var bookingDetailsDiv of bookingDetailsDivs) {
        var actualBookingNumber = bookingDetailsDiv.id.split('_')[1];

        if (actualBookingNumber === bookingNumber) {
            var detailsDiv = document.createElement('div');
            detailsDiv.className = 'booking-details';

            var clonedDetails = bookingDetailsDiv.cloneNode(true);
            clonedDetails.style.display = 'block';
            clonedDetails.style.overflowY = 'auto';

            detailsDiv.style.height = '300px';
            detailsDiv.style.overflowY = 'auto';
            detailsDiv.appendChild(clonedDetails);

            var tabId = 'tab_' + sanitizedBookingNumber + '_' + new Date().getTime();
            var tabPaneId = 'tabPane_' + sanitizedBookingNumber + '_' + new Date().getTime();

            var newTabLink = document.createElement('a');
            newTabLink.className = 'nav-link';
            newTabLink.id = tabId;
            newTabLink.href = '#' + tabPaneId;
            newTabLink.role = 'tab';
            newTabLink.setAttribute('data-bs-toggle', 'tab');

            var tabTitle = document.createElement('span');
            tabTitle.textContent = bookingNumber;
            newTabLink.appendChild(tabTitle);

            var closeButton = document.createElement('button');
            closeButton.className = 'btn-close close-tab';
            closeButton.setAttribute('type', 'button');
            closeButton.setAttribute('aria-label', 'Close');
            closeButton.onclick = function() {
                var tabPane = document.getElementById(tabPaneId);
                if (tabPane) {
                    tabPane.parentNode.removeChild(tabPane);
                }

                var tab = document.getElementById(tabId);
                if (tab) {
                    tab.parentNode.removeChild(tab);
                }

                var firstTab = bookingDetailsTabs.querySelector('.nav-link');
                if (firstTab) {
                    var tabTrigger = new bootstrap.Tab(firstTab);
                    tabTrigger.show();
                }
            };

            newTabLink.appendChild(closeButton);

            var bookingDetailsTabs = document.getElementById('bookingDetailsTabs');
            bookingDetailsTabs.appendChild(newTabLink);

            var newTabPane = document.createElement('div');
            newTabPane.className = 'tab-pane fade';
            newTabPane.id = tabPaneId;
            newTabPane.role = 'tabpanel';
            newTabPane.appendChild(detailsDiv);

            var bookingDetailsTabContent = document.getElementById('bookingDetailsTabContent');
            bookingDetailsTabContent.appendChild(newTabPane);

            var tabTrigger = new bootstrap.Tab(newTabLink);
            tabTrigger.show();

            var bookingModalLabel = document.getElementById('bookingModalLabel');
            bookingModalLabel.textContent = 'DETAILS';

            var bookingModal = new bootstrap.Modal(document.getElementById('bookingModal'));
            bookingModal.show();

            break;
        }
    }
}    

function botScroll() {
    var botScroll = document.getElementById('bot-message-scroll');
    botScroll.scrollTop = 0;
}

function lead(messages) {
    var inputValues = {};
    var currentIndex = 0;
    var userInputElement = document.getElementById('user-input');

    function displayPrompt() {
        var message = messages[currentIndex];
        var botMessageHTML = `<div class="message-container"><div class="bot-avatar"><div id="dp" data-bs-toggle="modal" data-bs-target="#modalPopup">
            <img id="thumbnail" src="https://betatest.ezeeshipping.in/assets/img/EZ_New_LogoAboveText.png" alt="EzeeBot Logo" style="width: 90%; height: 90%; margin-top: 1.2px; margin-left: 0.8px; object-fit: contain; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); clip-path: inset(0 0 8px 0);">
        </div></div><div class="bot-message-chat">`;
        //var botMessageHTML = '<div class="message-container"><div class="bot-avatar" data-bs-toggle="modal" data-bs-target="#modalPopup"><img src="https://betatest.ezeeshipping.in/assets/img/EZ_New_LogoAboveText.png" alt="EzeeBot Logo" style="width: 30px; height: auto;"></div><div class="bot-message">';
        var botMessageHTML2 = '<div class="message-container"><div class="bot-message-time">';

            if (message.toLowerCase() === "from date") {
                botMessageHTML += 'Please enter the "<b>' + message + '</b>"';
                chatContainer.innerHTML += botMessageHTML;
                var currentTime = new Date().toLocaleTimeString();
                var botTimeHTML = '<div class="bot-time">' + 'EZEEBOT , ' + currentTime + '</div>';
                chatContainer.innerHTML += botTimeHTML;
                var currentDate = new Date();
                currentDate.setMonth(currentDate.getMonth() - 1);

                var year = currentDate.getFullYear();
                var month = String(currentDate.getMonth() + 1).padStart(2, '0');
                var day = String(currentDate.getDate()).padStart(2, '0');
                var hours = String(currentDate.getHours()).padStart(2, '0');
                var minutes = String(currentDate.getMinutes()).padStart(2, '0');
                var defaultDate = year + '-' + month + '-' + day + 'T' + hours + ':' + minutes;

                botMessageHTML2 += '<input type="datetime-local" id="datetime-input" value="' + defaultDate + '">';
                chatContainer.innerHTML += botMessageHTML2;
                setTimeout(function() {
                    var datetimeInput = document.getElementById('datetime-input');
                    datetimeInput.focus();
                }, 0);
                scrollToBottom();
        
                var datetimeInput = document.getElementById('datetime-input');

                userInputElement.style.display = 'none';
        
                datetimeInput.addEventListener('blur', function(event) {
                    var userInput = this.value.trim().split("T")[0];
                    simpleUserMessage(userInput);
        
                    inputValues["lead" + message.toLowerCase().replace(/\s+/g, '_')] = userInput;

                    var botMessageCheck = document.querySelector('.bot-message-time');
                    if (botMessageCheck) {
                        botMessageCheck.remove();
                    }

                    userInputElement.style.display = 'block';
        
                    currentIndex++;
                    if (currentIndex < messages.length) {
                        displayPrompt();
                    } else {
                        sendAllInputs();
                    }
                });
            } else if (message.toLowerCase() === "to date") {
                botMessageHTML += 'Please enter the "<b>' + message + '</b>"';
                chatContainer.innerHTML += botMessageHTML;
                var currentTime = new Date().toLocaleTimeString();
                var botTimeHTML = '<div class="bot-time">' + 'EZEEBOT , ' + currentTime + '</div>';
                chatContainer.innerHTML += botTimeHTML;
                var defaultDate = new Date().toISOString().slice(0, 16);
                botMessageHTML2 += '<input type="datetime-local" id="datetime-input" value="' + defaultDate + '">';
                chatContainer.innerHTML += botMessageHTML2;
                setTimeout(function() {
                    var datetimeInput = document.getElementById('datetime-input');
                    datetimeInput.focus();
                }, 0);
                scrollToBottom();
        
                var datetimeInput = document.getElementById('datetime-input');

                userInputElement.style.display = 'none';
        
                datetimeInput.addEventListener('blur', function(event) {
                    var userInput = this.value.trim().split("T")[0];
                    simpleUserMessage(userInput);
        
                    inputValues["lead" + message.toLowerCase().replace(/\s+/g, '_')] = userInput;

                    var botMessageCheck = document.querySelector('.bot-message-time');
                    if (botMessageCheck) {
                        botMessageCheck.remove();
                    }

                    userInputElement.style.display = 'block';
        
                    currentIndex++;
                    if (currentIndex < messages.length) {
                        displayPrompt();
                    } else {
                        sendAllInputs();
                    }
                });
            } else {
            botMessageHTML += 'Please type in the "<b>' + message + '</b>"';
            chatContainer.innerHTML += botMessageHTML;
            var currentTime = new Date().toLocaleTimeString();
            var botTimeHTML = '<div class="bot-time">' + 'EZEEBOT , ' + currentTime + '</div>';
            chatContainer.innerHTML += botTimeHTML;
            scrollToBottom();
    
            userInputElement.focus();
    
            if (userInputElement._listener) {
                userInputElement.removeEventListener('keypress', userInputElement._listener);
            }
    
            userInputElement._listener = function (event) {
                if (event.key === 'Enter') {
                    event.preventDefault();
                    var userInput = this.value.trim();
                    simpleUserMessage(userInput);
    
                    inputValues["lead" + message.toLowerCase().replace(/\s+/g, '_')] = userInput;
    
                    this.value = '';
    
                    currentIndex++;
                    if (currentIndex < messages.length) {
                        displayPrompt();
                    } else {
                        sendAllInputs();
                    }
                }
            };
    
            userInputElement.addEventListener('keypress', userInputElement._listener);
        }
    }            

    function sendAllInputs() {
        typingMessage();
        fetch('/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_input: {
                    ...inputValues,
                    'current_date': formattedDate,
                    'tenantid': tenantid,
                    'officeid': officeid,
                    'userid': userid,
                    'userid2': userid2,
                    'environment': environment,
                    'userid2': userid2
                }
            }),
        })
        .then(response => response.json())
        .then(data => {
            var inputSummary = '<b>[ </b>' + Object.keys(inputValues).map(function(key, index, array) {
                var displayKey = key.replace(/^lead/, '').replace(/_/g, ' ');
                var comma = (index !== array.length - 1) ? ', ' : '';
                return '<b>' + displayKey + ':</b> ' + inputValues[key] + comma;
            }).join('') + '<b> ]</b>';                                                            
            
            var botMessageHTML = `<div class="message-container"><div class="bot-avatar"><div id="dp" data-bs-toggle="modal" data-bs-target="#modalPopup">
                <img id="thumbnail" src="https://betatest.ezeeshipping.in/assets/img/EZ_New_LogoAboveText.png" alt="EzeeBot Logo" style="width: 90%; height: 90%; margin-top: 1.2px; margin-left: 0.8px; object-fit: contain; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); clip-path: inset(0 0 8px 0);">
            </div></div><div class="bot-message-booking"><b>Lead search result based on your criteria </b>${formatKeyValueList(inputSummary)}`;
            //var botMessageHTML = '<div class="message-container"><div class="bot-avatar" data-bs-toggle="modal" data-bs-target="#modalPopup"><img src="https://betatest.ezeeshipping.in/assets/img/EZ_New_LogoAboveText.png" alt="EzeeBot Logo" style="width: 30px; height: auto;"></div><div class="bot-message-booking"><b>Lead search result based on your criteria <br><br></b>' + '<span style="font-size:14px;">' + formatKeyValueList(inputSummary) + '</span><br><br>';

                var bookingSets = data.response.split('},');

                if (bookingSets.length > 1) {
                    botMessageHTML += '<b>Multiple entries found. Please pick one to view more details</b><br><br>';
                    var counter = 1;
                    var buttonHTML = '';
                
                    bookingSets.forEach((bookingSet, index) => {
                        var cleanedBookingSet = bookingSet.replace(/[\[\]{}"]/g, '');
                
                        if (cleanedBookingSet.trim() !== '') {
                            cleanedBookingSet = cleanedBookingSet.trim();
                
                            var keyValuePairs = cleanedBookingSet.split(',');
                
                            var bookingNumber = '';
                            var statusCode = '';
                            var det = '';
                            var bookingHTML = '<table class="booking-details">';
                            keyValuePairs.forEach(pair => {
                                var parts = pair.split(':');
                                var key = parts[0].trim();
                                var value = parts.slice(1).join(':').trim();
                
                                if (key.toUpperCase() === 'NAME') {
                                    if (value === 'null') {
                                        bookingNumber = null;
                                    } else {
                                        bookingNumber = value;
                                    }
                                } else if (key.toUpperCase() === 'STATUS' && !bookingNumber) {
                                    statusCode = value;
                                } else if (key.toUpperCase() === 'CREATED DATE') {
                                    createddate = value;
                                }
                                
                                det += value + ',';
                                bookingHTML += '<tr><td><span class="key">' + key + '</span></td><td><span class="value">' + value + '</span></td></tr>\n';
                            });
                            bookingHTML += '</table>';
                
                            if (!bookingNumber) {
                                buttonHTML += '<button class="booking-button" onclick="showBookingDetails(\'' + bookingNumber + '\', ' + counter + ')"><div style="float: left; width: 50%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: left; border-right: 2px solid #f2f2f2;">' + statusCode + '<span color: transparent;' + det +'</span></div><div style="float: right; width: 40%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: right;">' + createddate + '</div></button><br>';
                            } else {
                                buttonHTML += '<button class="booking-button" onclick="showBookingDetails(\'' + bookingNumber + '\', ' + counter + ')"><div style="float: left; width: 50%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: left; border-right: 2px solid #f2f2f2;">' + bookingNumber + '<span color: transparent;' + det +'</span></div><div style="float: right; width: 40%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: right;">' + createddate + '</div></button><br>';
                            }
                
                            buttonHTML += '<div id="' + counter + 'bookingDetails_' + bookingNumber + '" style="display: none;">' + bookingHTML + '</div><br>';
                            counter++;
                        }
                    });
                        var botDiv = `<div style="border: 1px solid transparent; padding-top: 10px; padding-left: 2px; padding-right: 2px; padding-bottom: 3px; border-radius: 10px; margin-top: 10px; background-color: #c0c0c0;">`;
                        botDiv += '<input type="text" id="search-input" style="width: 100%;" placeholder="Global Search...">';
                        var botDiv2 = `<div style="border-left: 1px solid transparent; background-color: #e5e4e2; padding: 4px; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;">`;
                        botDiv2 += '<div id="num" style="font-size: 14px; display: flex; padding: 5px; align-items: left; justify-content: left;"></div>';
                        botDiv2 += '<div><table style="border-collapse: collapse; margin-left: -1px; width: 100%; margin-bottom: 5px;"><thead style="background-color: #002147; color: white;"><tr><th style="border: 1px solid #dddddd; text-align: left; padding: 8px; width: 50%;">NAME</th><th style="border: 1px solid #dddddd; text-align: right; padding: 8px; width: 50%;">CREATED DATE</th></tr></thead></table></div>';
                        botDiv2 += '<div id="bot-message-scroll" style="max-height: 250px; overflow-y: auto; overflow-x: hidden;">'+ buttonHTML +'</div>'; 
                        botDiv2 += `</div>`;
                        botDiv += botDiv2;
                        botDiv += `</div>`;
                        botMessageHTML += botDiv;     
                        botMessageHTML += '<div style="margin-top: 20px;"><b>If you have any questions or concerns about the results, please verify them using our application or contact our support team.</b></div>'; 
                }
                 else {
                    bookingSets.forEach(bookingSet => {
                        var cleanedBookingSet = bookingSet.replace(/[\[\]{}"]/g, '');
                
                        if (cleanedBookingSet.trim() !== '') {
                            cleanedBookingSet = cleanedBookingSet.trim();
                
                            var keyValuePairs = cleanedBookingSet.split(',');
                
                            var bookingHTML = '<table class="booking-details">';
                            keyValuePairs.forEach(pair => {
                                var parts = pair.split(':');
                                var key = parts[0].trim();
                                var value = parts.slice(1).join(':').trim();
                
                                bookingHTML += '<tr><td><span class="key">' + key + '</span></td><td><span class="value">' + value + '</span></td></tr>\n';
                            });
                            bookingHTML += '</table><br>';
                            botMessageHTML += bookingHTML;
                        }
                    });
                }
                
                botMessageHTML += '</div></div>';
                chatContainer.innerHTML += botMessageHTML;
                var currentTime = new Date().toLocaleTimeString();
                var botTimeHTML = '<div class="bot-time">'+ 'EZEEBOT , ' + currentTime + '</div>';
                chatContainer.innerHTML += botTimeHTML;
                document.addEventListener('input', function (event) {
                    if (event.target.id === 'search-input') {
                        var searchValue = event.target.value.toLowerCase();
                        var botMessageScroll = document.getElementById('bot-message-scroll');
                        var buttons = botMessageScroll.getElementsByClassName('booking-button');
                        var moduleName = 'leads';

                        filterButtons(searchValue, buttons, moduleName);
                    }
                });
                closeType();
                scrollToBottom();
        
            userInputElement.removeEventListener('keypress', userInputElement._listener);
        })
        .catch(error => {
            console.error('Error:', error);
        });                

    }
    displayPrompt();
}       

function enquiry(messages){
    var inputValues = {};
    var currentIndex = 0;
    var userInputElement = document.getElementById('user-input');

    function displayPrompt() {
        var message = messages[currentIndex];
        var botMessageHTML = `<div class="message-container"><div class="bot-avatar"><div id="dp" data-bs-toggle="modal" data-bs-target="#modalPopup">
            <img id="thumbnail" src="https://betatest.ezeeshipping.in/assets/img/EZ_New_LogoAboveText.png" alt="EzeeBot Logo" style="width: 90%; height: 90%; margin-top: 1.2px; margin-left: 0.8px; object-fit: contain; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); clip-path: inset(0 0 8px 0);">
        </div></div><div class="bot-message-chat">`;
        //var botMessageHTML = '<div class="message-container"><div class="bot-avatar" data-bs-toggle="modal" data-bs-target="#modalPopup"><img src="https://betatest.ezeeshipping.in/assets/img/EZ_New_LogoAboveText.png" alt="EzeeBot Logo" style="width: 30px; height: auto;"></div><div class="bot-message">';
        var botMessageHTML2 = '<div class="message-container"><div class="bot-message-time">';

            if (message.toLowerCase() === "from date") {
                botMessageHTML += 'Please enter the "<b>' + message + '</b>"';
                chatContainer.innerHTML += botMessageHTML;
                var currentTime = new Date().toLocaleTimeString();
                var botTimeHTML = '<div class="bot-time">' + 'EZEEBOT , ' + currentTime + '</div>';
                chatContainer.innerHTML += botTimeHTML;
                var currentDate = new Date();
                currentDate.setMonth(currentDate.getMonth() - 1);

                var year = currentDate.getFullYear();
                var month = String(currentDate.getMonth() + 1).padStart(2, '0');
                var day = String(currentDate.getDate()).padStart(2, '0');
                var hours = String(currentDate.getHours()).padStart(2, '0');
                var minutes = String(currentDate.getMinutes()).padStart(2, '0');
                var defaultDate = year + '-' + month + '-' + day + 'T' + hours + ':' + minutes;

                botMessageHTML2 += '<input type="datetime-local" id="datetime-input" value="' + defaultDate + '">';
                chatContainer.innerHTML += botMessageHTML2;
                setTimeout(function() {
                    var datetimeInput = document.getElementById('datetime-input');
                    datetimeInput.focus();
                }, 0);
                scrollToBottom();
        
                var datetimeInput = document.getElementById('datetime-input');

                userInputElement.style.display = 'none';
        
                datetimeInput.addEventListener('blur', function(event) {
                    var userInput = this.value.trim().split("T")[0];
                    simpleUserMessage(userInput);
        
                    inputValues["enq" + message.toLowerCase().replace(/\s+/g, '_')] = userInput;

                    var botMessageCheck = document.querySelector('.bot-message-time');
                    if (botMessageCheck) {
                        botMessageCheck.remove();
                    }

                    userInputElement.style.display = 'block';
        
                    currentIndex++;
                    if (currentIndex < messages.length) {
                        displayPrompt();
                    } else {
                        sendAllInputs();
                    }
                });
            } else if (message.toLowerCase() === "to date") {
                botMessageHTML += 'Please enter the "<b>' + message + '</b>"';
                chatContainer.innerHTML += botMessageHTML;
                var currentTime = new Date().toLocaleTimeString();
                var botTimeHTML = '<div class="bot-time">' + 'EZEEBOT , ' + currentTime + '</div>';
                chatContainer.innerHTML += botTimeHTML;
                var defaultDate = new Date().toISOString().slice(0, 16);
                botMessageHTML2 += '<input type="datetime-local" id="datetime-input" value="' + defaultDate + '">';
                chatContainer.innerHTML += botMessageHTML2;
                setTimeout(function() {
                    var datetimeInput = document.getElementById('datetime-input');
                    datetimeInput.focus();
                }, 0);
                scrollToBottom();
        
                var datetimeInput = document.getElementById('datetime-input');

                userInputElement.style.display = 'none';
        
                datetimeInput.addEventListener('blur', function(event) {
                    var userInput = this.value.trim().split("T")[0];
                    simpleUserMessage(userInput);
        
                    inputValues["enq" + message.toLowerCase().replace(/\s+/g, '_')] = userInput;

                    var botMessageCheck = document.querySelector('.bot-message-time');
                    if (botMessageCheck) {
                        botMessageCheck.remove();
                    }

                    userInputElement.style.display = 'block';
        
                    currentIndex++;
                    if (currentIndex < messages.length) {
                        displayPrompt();
                    } else {
                        sendAllInputs();
                    }
                });
            } else {
            botMessageHTML += 'Please type in the "<b>' + message + '</b>"';
            chatContainer.innerHTML += botMessageHTML;
            var currentTime = new Date().toLocaleTimeString();
            var botTimeHTML = '<div class="bot-time">' + 'EZEEBOT , ' + currentTime + '</div>';
            chatContainer.innerHTML += botTimeHTML;
            scrollToBottom();
    
            userInputElement.focus();
    
            if (userInputElement._listener) {
                userInputElement.removeEventListener('keypress', userInputElement._listener);
            }
    
            userInputElement._listener = function (event) {
                if (event.key === 'Enter') {
                    event.preventDefault();
                    var userInput = this.value.trim();
                    simpleUserMessage(userInput);
    
                    inputValues["enq" + message.toLowerCase().replace(/\s+/g, '_')] = userInput;
    
                    this.value = '';
    
                    currentIndex++;
                    if (currentIndex < messages.length) {
                        displayPrompt();
                    } else {
                        sendAllInputs();
                    }
                }
            };
    
            userInputElement.addEventListener('keypress', userInputElement._listener);
        }
    }

    function sendAllInputs() {
        typingMessage();
        fetch('/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_input: {
                    ...inputValues,
                    'current_date': formattedDate,
                    'tenantid': tenantid,
                    'officeid': officeid,
                    'userid': userid,
                    'userid2': userid2,
                    'environment': environment,
                    'userid2': userid2
                }
            }),
        })
        .then(response => response.json())
        .then(data => {
            var inputSummary = '<b>[ </b>' + Object.keys(inputValues).map(function(key, index, array) {
                var displayKey = key.replace(/^enq/, '').replace(/_/g, ' ');
                var comma = (index !== array.length - 1) ? ', ' : '';
                return '<b>' + displayKey + ':</b> ' + inputValues[key] + comma;
            }).join('') + '<b> ]</b>';       

            var botMessageHTML = `<div class="message-container"><div class="bot-avatar"><div id="dp" data-bs-toggle="modal" data-bs-target="#modalPopup">
                <img id="thumbnail" src="https://betatest.ezeeshipping.in/assets/img/EZ_New_LogoAboveText.png" alt="EzeeBot Logo" style="width: 90%; height: 90%; margin-top: 1.2px; margin-left: 0.8px; object-fit: contain; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); clip-path: inset(0 0 8px 0);">
            </div></div><div class="bot-message-booking"><b>Enquiry search result based on your criteria </b>${formatKeyValueList(inputSummary)}`;
            //var botMessageHTML = '<div class="message-container"><div class="bot-avatar" data-bs-toggle="modal" data-bs-target="#modalPopup"><img src="https://betatest.ezeeshipping.in/assets/img/EZ_New_LogoAboveText.png" alt="EzeeBot Logo" style="width: 30px; height: auto;"></div><div class="bot-message-booking"><b>Enquiry search result based on your criteria <br><br></b>' + '<span style="font-size:14px;">' + formatKeyValueList(inputSummary) + '</span><br><br>';

                var bookingSets = data.response.split('},');

                if (bookingSets.length > 1) {
                    botMessageHTML += '<b>Multiple entries found. Please pick one to view more details</b><br><br>';
                    var counter = 1;
                    var buttonHTML = '';
                
                    bookingSets.forEach((bookingSet, index) => {
                        var cleanedBookingSet = bookingSet.replace(/[\[\]{}"]/g, '');
                
                        if (cleanedBookingSet.trim() !== '') {
                            cleanedBookingSet = cleanedBookingSet.trim();
                
                            var keyValuePairs = cleanedBookingSet.split(',');
                            var bookingNumber = '';
                            var statusCode = '';
                            var det = '';
                            var bookingHTML = '';
                            bookingHTML += '<table class="booking-details">';
                            keyValuePairs.forEach(pair => {
                                var parts = pair.split(':');
                                var key = parts[0].trim();
                                var value = parts.slice(1).join(':').trim();
                
                                if (key.toUpperCase() === 'ENQUIRY NUMBER') {
                                    if (value === 'null') {
                                        bookingNumber = null;
                                    } else {
                                        bookingNumber = value;
                                    }
                                } else if (key.toUpperCase() === 'COMPANY') {
                                    if (value === 'null') {
                                        customername = null;
                                    } else {
                                        customername = value;
                                    }
                                } else if (key.toUpperCase() === 'STATUS' && !bookingNumber) {
                                    statusCode = value;
                                } else if (key.toUpperCase() === 'CREATED DATE') {
                                    createddate = value;
                                }
                                
                                det += value + ',';
                                bookingHTML += '<tr><td><span class="key">' + key + '</span></td><td><span class="value">' + value + '</span></td></tr>\n';
                            });
                            bookingHTML += '</table>';
                            
                            var botMessageHTM = '';
                            if (!bookingNumber) {
                                buttonHTML += '<button class="booking-button" onclick="showBookingDetails(\'' + bookingNumber + '\', ' + counter + ')"><div style="float: left; width: 33%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: left; border-right: 2px solid #f2f2f2;">' + customername + '<span color: transparent;' + det +'</span></div><div style="display: inline-block; text-align: center; width: 33%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: center;">' + createddate + '</div><div style="float: right; width: 33%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: right; border-left: 2px solid #f2f2f2;">' + statusCode + '</div></button><br>';
                            } else {
                                buttonHTML += '<button class="booking-button" onclick="showBookingDetails(\'' + bookingNumber + '\', ' + counter + ')"><div style="float: left; width: 33%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: left; border-right: 2px solid #f2f2f2;">' + customername + '<span color: transparent;' + det +'</span></div><div style="display: inline-block; text-align: center; width: 33%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: center;">' + createddate + '</div><div style="float: right; width: 33%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: right; border-left: 2px solid #f2f2f2;">' + bookingNumber + '</div></button><br>';
                            }

                            buttonHTML += '<div id="' + counter + 'bookingDetails_' + bookingNumber + '" style="display: none;">' + bookingHTML + '</div><br>';
                            counter++;
                        }
                    });

                    var botDiv = `<div style="border: 1px solid transparent; padding-top: 10px; padding-left: 2px; padding-right: 2px; padding-bottom: 3px; border-radius: 10px; margin-top: 10px; background-color: #c0c0c0;">`;
                    botDiv += '<input type="text" id="search-input" style="width: 100%;" placeholder="Global Search...">';
                    var botDiv2 = `<div style="border-left: 1px solid transparent; background-color: #e5e4e2; padding: 4px; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;">`;
                    botDiv2 += '<div id="num" style="font-size: 14px; display: flex; padding: 5px; align-items: left; justify-content: left;"></div>';
                    botDiv2 += '<div><table style="border-collapse: collapse; width: 100%; margin-bottom: 5px;"><thead style="background-color: #002147; color: white;"><tr><th style="border: 1px solid #dddddd; text-align: left; padding: 8px; width: 33.17%;">COMPANY</th><th style="border: 1px solid #dddddd; text-align: center; padding: 8px; width: 33.16%;">CREATED DATE</th><th style="border: 1px solid #dddddd; text-align: right; padding: 8px; width: 33.66%;">ENQUIRY NO</th></tr></thead></table></div>';
                    botDiv2 += '<div id="bot-message-scroll" style="max-height: 250px; overflow-y: auto; overflow-x: hidden;">'+ buttonHTML +'</div>';  
                    botDiv2 += `</div>`;
                    botDiv += botDiv2;
                    botDiv += `</div>`;  
                    botMessageHTML += botDiv; 
                    botMessageHTML += '<div style="margin-top: 20px;"><b>If you have any questions or concerns about the results, please verify them using our application or contact our support team.</b></div>';                      
                }
                 else {
                    bookingSets.forEach(bookingSet => {
                        var cleanedBookingSet = bookingSet.replace(/[\[\]{}"]/g, '');
                
                        if (cleanedBookingSet.trim() !== '') {
                            cleanedBookingSet = cleanedBookingSet.trim();
                
                            var keyValuePairs = cleanedBookingSet.split(',');
                
                            var bookingHTML = '<table class="booking-details">';
                            keyValuePairs.forEach(pair => {
                                var parts = pair.split(':');
                                var key = parts[0].trim();
                                var value = parts.slice(1).join(':').trim();
                
                                bookingHTML += '<tr><td><span class="key">' + key + '</span></td><td><span class="value">' + value + '</span></td></tr>\n';
                            });
                            bookingHTML += '</table><br>';
                            botMessageHTML += bookingHTML;
                        }
                    });
                }
                
                botMessageHTML += '</div></div>';
                chatContainer.innerHTML += botMessageHTML;
                var currentTime = new Date().toLocaleTimeString();
                var botTimeHTML = '<div class="bot-time">'+ 'EZEEBOT , ' + currentTime + '</div>';
                chatContainer.innerHTML += botTimeHTML;
                document.addEventListener('input', function (event) {
                    if (event.target.id === 'search-input') {
                        var searchValue = event.target.value.toLowerCase();
                        var botMessageScroll = document.getElementById('bot-message-scroll');
                        var buttons = botMessageScroll.getElementsByClassName('booking-button');
                        var moduleName = 'enquiries';

                        filterButtons(searchValue, buttons, moduleName);
                    }
                });
                closeType();
                scrollToBottom();
        
            userInputElement.removeEventListener('keypress', userInputElement._listener);
        })
        .catch(error => {
            console.error('Error:', error);
        });                

    }
    displayPrompt();
}     

function askBookingNumberfright(messages) {
    var inputValues = {};
    var currentIndex = 0;
    var userInputElement = document.getElementById('user-input');

    function displayPrompt() {
        var message = messages[currentIndex];
        var botMessageHTML = `<div class="message-container"><div class="bot-avatar"><div id="dp" data-bs-toggle="modal" data-bs-target="#modalPopup">
            <img id="thumbnail" src="https://betatest.ezeeshipping.in/assets/img/EZ_New_LogoAboveText.png" alt="EzeeBot Logo" style="width: 90%; height: 90%; margin-top: 1.2px; margin-left: 0.8px; object-fit: contain; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); clip-path: inset(0 0 8px 0);">
        </div></div><div class="bot-message-chat">`;
        //var botMessageHTML = '<div class="message-container"><div class="bot-avatar" data-bs-toggle="modal" data-bs-target="#modalPopup"><img src="https://betatest.ezeeshipping.in/assets/img/EZ_New_LogoAboveText.png" alt="EzeeBot Logo" style="width: 30px; height: auto;"></div><div class="bot-message">';
        var botMessageHTML2 = '<div class="message-container"><div class="bot-message-time">';

            if (message.toLowerCase() === "from date") {
                botMessageHTML += 'Please enter the "<b>' + message + '</b>"';
                chatContainer.innerHTML += botMessageHTML;
                var currentTime = new Date().toLocaleTimeString();
                var botTimeHTML = '<div class="bot-time">' + 'EZEEBOT , ' + currentTime + '</div>';
                chatContainer.innerHTML += botTimeHTML;
                var currentDate = new Date();
                currentDate.setMonth(currentDate.getMonth() - 1);

                var year = currentDate.getFullYear();
                var month = String(currentDate.getMonth() + 1).padStart(2, '0');
                var day = String(currentDate.getDate()).padStart(2, '0');
                var hours = String(currentDate.getHours()).padStart(2, '0');
                var minutes = String(currentDate.getMinutes()).padStart(2, '0');
                var defaultDate = year + '-' + month + '-' + day + 'T' + hours + ':' + minutes;

                botMessageHTML2 += '<input type="datetime-local" id="datetime-input" value="' + defaultDate + '">';
                chatContainer.innerHTML += botMessageHTML2;
                setTimeout(function() {
                    var datetimeInput = document.getElementById('datetime-input');
                    datetimeInput.focus();
                }, 0);
                scrollToBottom();
        
                var datetimeInput = document.getElementById('datetime-input');

                userInputElement.style.display = 'none';
        
                datetimeInput.addEventListener('blur', function(event) {
                    var userInput = this.value.trim().split("T")[0];
                    simpleUserMessage(userInput);
        
                    inputValues["booking" + message.toLowerCase().replace(/\s+/g, '_')] = userInput;

                    var botMessageCheck = document.querySelector('.bot-message-time');
                    if (botMessageCheck) {
                        botMessageCheck.remove();
                    }

                    userInputElement.style.display = 'block';
        
                    currentIndex++;
                    if (currentIndex < messages.length) {
                        displayPrompt();
                    } else {
                        sendAllInputs();
                    }
                });
            } else if (message.toLowerCase() === "to date") {
                botMessageHTML += 'Please enter the "<b>' + message + '</b>"';
                chatContainer.innerHTML += botMessageHTML;
                var currentTime = new Date().toLocaleTimeString();
                var botTimeHTML = '<div class="bot-time">' + 'EZEEBOT , ' + currentTime + '</div>';
                chatContainer.innerHTML += botTimeHTML;
                var defaultDate = new Date().toISOString().slice(0, 16);
                botMessageHTML2 += '<input type="datetime-local" id="datetime-input" value="' + defaultDate + '">';
                chatContainer.innerHTML += botMessageHTML2;
                setTimeout(function() {
                    var datetimeInput = document.getElementById('datetime-input');
                    datetimeInput.focus();
                }, 0);
                scrollToBottom();
        
                var datetimeInput = document.getElementById('datetime-input');

                userInputElement.style.display = 'none';
        
                datetimeInput.addEventListener('blur', function(event) {
                    var userInput = this.value.trim().split("T")[0];
                    simpleUserMessage(userInput);
        
                    inputValues["booking" + message.toLowerCase().replace(/\s+/g, '_')] = userInput;

                    var botMessageCheck = document.querySelector('.bot-message-time');
                    if (botMessageCheck) {
                        botMessageCheck.remove();
                    }

                    userInputElement.style.display = 'block';
        
                    currentIndex++;
                    if (currentIndex < messages.length) {
                        displayPrompt();
                    } else {
                        sendAllInputs();
                    }
                });
            } else {
            botMessageHTML += 'Please type in the "<b>' + message + '</b>"';
            chatContainer.innerHTML += botMessageHTML;
            var currentTime = new Date().toLocaleTimeString();
            var botTimeHTML = '<div class="bot-time">' + 'EZEEBOT , ' + currentTime + '</div>';
            chatContainer.innerHTML += botTimeHTML;
            scrollToBottom();
    
            userInputElement.focus();
    
            if (userInputElement._listener) {
                userInputElement.removeEventListener('keypress', userInputElement._listener);
            }
    
            userInputElement._listener = function (event) {
                if (event.key === 'Enter') {
                    event.preventDefault();
                    var userInput = this.value.trim();
                    simpleUserMessage(userInput);
    
                    inputValues["booking" + message.toLowerCase().replace(/\s+/g, '_')] = userInput;
    
                    this.value = '';
    
                    currentIndex++;
                    if (currentIndex < messages.length) {
                        displayPrompt();
                    } else {
                        sendAllInputs();
                    }
                }
            };
    
            userInputElement.addEventListener('keypress', userInputElement._listener);
        }
    }

    function sendAllInputs() {
        typingMessage();
        fetch('/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_input: {
                    ...inputValues,
                    'current_date': formattedDate,
                    'tenantid': tenantid,
                    'officeid': officeid,
                    'userid': userid,
                    'userid2': userid2,
                    'environment': environment,
                    'userid2': userid2,
                    'ffrid': ffrid
                }
            }),
        })
        .then(response => response.json())
        .then(data => {
            var inputSummary = '<b>[ </b>' + Object.keys(inputValues).map(function(key, index, array) {
                var displayKey = key.replace(/^booking/, '').replace(/_/g, ' ');
                var comma = (index !== array.length - 1) ? ', ' : '';
                return '<b>' + displayKey + ':</b> ' + inputValues[key] + comma;
            }).join('') + '<b> ]</b>';   
            
            var botMessageHTML = `<div class="message-container"><div class="bot-avatar"><div id="dp" data-bs-toggle="modal" data-bs-target="#modalPopup">
                <img id="thumbnail" src="https://betatest.ezeeshipping.in/assets/img/EZ_New_LogoAboveText.png" alt="EzeeBot Logo" style="width: 90%; height: 90%; margin-top: 1.2px; margin-left: 0.8px; object-fit: contain; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); clip-path: inset(0 0 8px 0);">
            </div></div><div class="bot-message-booking"><b>Fright forwarding booking search result based on your criteria </b>${formatKeyValueList(inputSummary)}`;
            
            //var botMessageHTML = '<div class="message-container"><div class="bot-avatar" data-bs-toggle="modal" data-bs-target="#modalPopup"><img src="https://betatest.ezeeshipping.in/assets/img/EZ_New_LogoAboveText.png" alt="EzeeBot Logo" style="width: 30px; height: auto;"></div><div class="bot-message-booking"><b>Fright forwarding booking search result based on your criteria <br><br></b>' + '<span style="font-size:14px;">' + formatKeyValueList(inputSummary) + '</span><br><br>';

                var bookingSets = data.response.split('},');

                if (bookingSets.length > 1) {
                    botMessageHTML += '<b>Multiple entries found. Please pick one to view more details</b><br><br>';
                    var counter = 1;
                    var buttonHTML = '';
                
                    bookingSets.forEach((bookingSet, index) => {
                        var cleanedBookingSet = bookingSet.replace(/[\[\]{}"]/g, '');
                
                        if (cleanedBookingSet.trim() !== '') {
                            cleanedBookingSet = cleanedBookingSet.trim();
                
                            var keyValuePairs = cleanedBookingSet.split(',');
                
                            var bookingNumber = '';
                            var statusCode = '';
                            var det = '';
                            var bookingHTML = '<table class="booking-details">';
                            keyValuePairs.forEach(pair => {
                                var parts = pair.split(':');
                                var key = parts[0].trim();
                                var value = parts.slice(1).join(':').trim();
                
                                if (key.toUpperCase() === 'BOOKING NUMBER') {
                                    if (value === 'null') {
                                        bookingNumber = null;
                                    } else {
                                        bookingNumber = value;
                                    }
                                } else if (key.toUpperCase() === 'STATUS' && !bookingNumber) {
                                    statusCode = value;
                                } else if (key.toUpperCase() === 'BOOKING DATE') {
                                    bookingdate = value;
                                } else if (key.toUpperCase() === 'BOOKING PARTY') {
                                    bookingparty = value;
                                }
                                
                                det += value + ',';
                                bookingHTML += '<tr><td><span class="key">' + key + '</span></td><td><span class="value">' + value + '</span></td></tr>\n';
                            });
                            bookingHTML += '</table>';
                
                            if (!bookingNumber) {
                                buttonHTML += '<button class="booking-button" onclick="showBookingDetails(\'' + bookingNumber + '\', ' + counter + ')"><div style="float: left; width: 33%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: left; border-right: 2px solid #f2f2f2;">' + bookingparty +'<span color: transparent;' + det +'</span></div><div style="display: inline-block; text-align: center; width: 33%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: center;">' + bookingdate + '</div><div style="float: right; width: 33%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: right; border-left: 2px solid #f2f2f2;">' + statusCode + '</div></button><br>';
                            } else {
                                buttonHTML += '<button class="booking-button" onclick="showBookingDetails(\'' + bookingNumber + '\', ' + counter + ')"><div style="float: left; width: 33%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: left; border-right: 2px solid #f2f2f2;">' + bookingparty +'<span color: transparent;' + det +'</span></div><div style="display: inline-block; text-align: center; width: 33%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: center;">' + bookingdate + '</div><div style="float: right; width: 33%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: right; border-left: 2px solid #f2f2f2;">' + bookingNumber + '</div></button><br>';
                            }
                
                            buttonHTML += '<div id="' + counter + 'bookingDetails_' + bookingNumber + '" style="display: none;">' + bookingHTML + '</div><br>';
                            counter++;
                        }
                    });

                    var botDiv = `<div style="border: 1px solid transparent; padding-top: 10px; padding-left: 2px; padding-right: 2px; padding-bottom: 3px; border-radius: 10px; margin-top: 10px; background-color: #c0c0c0;">`;
                    botDiv += '<input type="text" id="search-input" style="width: 100%;" placeholder="Global Search...">';
                    var botDiv2 = `<div style="border-left: 1px solid transparent; background-color: #e5e4e2; padding: 4px; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;">`;
                    botDiv2 += '<div id="num" style="font-size: 14px; display: flex; padding: 5px; align-items: left; justify-content: left;"></div>';
                    botDiv2 += '<div><table style="border-collapse: collapse; width: 100%; margin-bottom: 5px;"><thead style="background-color: #002147; color: white;"><tr><th style="border: 1px solid #dddddd; text-align: left; padding: 8px; width: 33.17%;">BOOKING PARTY</th><th style="border: 1px solid #dddddd; text-align: center; padding: 8px; width: 33.16%;">BOOKING DATE</th><th style="border: 1px solid #dddddd; text-align: right; padding: 8px; width: 33.66%;">BOOKING NO</th></tr></thead></table></div>';
                    botDiv2 +=  '<div id="bot-message-scroll" style="max-height: 250px; overflow-y: auto; overflow-x: hidden;">' + buttonHTML +'</div>';
                    botDiv2 += `</div>`;
                    botDiv += botDiv2;
                    botDiv += `</div>`;
                    botMessageHTML += botDiv;
                    botMessageHTML += '<div style="margin-top: 20px;"><b>If you have any questions or concerns about the results, please verify them using our application or contact our support team.</b></div>';
                }
                 else {
                    bookingSets.forEach(bookingSet => {
                        var cleanedBookingSet = bookingSet.replace(/[\[\]{}"]/g, '');
                
                        if (cleanedBookingSet.trim() !== '') {
                            cleanedBookingSet = cleanedBookingSet.trim();
                
                            var keyValuePairs = cleanedBookingSet.split(',');
                
                            var bookingHTML = '<table class="booking-details">';
                            keyValuePairs.forEach(pair => {
                                var parts = pair.split(':');
                                var key = parts[0].trim();
                                var value = parts.slice(1).join(':').trim();
                
                                bookingHTML += '<tr><td><span class="key">' + key + '</span></td><td><span class="value">' + value + '</span></td></tr>\n';
                            });
                            bookingHTML += '</table><br>';
                            botMessageHTML += bookingHTML;
                        }
                    });
                }
                
                botMessageHTML += '</div></div>';
                chatContainer.innerHTML += botMessageHTML;
                var currentTime = new Date().toLocaleTimeString();
                var botTimeHTML = '<div class="bot-time">'+ 'EZEEBOT , ' + currentTime + '</div>';
                chatContainer.innerHTML += botTimeHTML;
                document.addEventListener('input', function (event) {
                    if (event.target.id === 'search-input') {
                        var searchValue = event.target.value.toLowerCase();
                        var botMessageScroll = document.getElementById('bot-message-scroll');
                        var buttons = botMessageScroll.getElementsByClassName('booking-button');
                        var moduleName = 'fright bookings';

                        filterButtons(searchValue, buttons, moduleName);
                    }
                });
                closeType();
                scrollToBottom();
        
            userInputElement.removeEventListener('keypress', userInputElement._listener);
        })
        .catch(error => {
            console.error('Error:', error);
        });                

    }
    displayPrompt();
}

function askBookingNumberfrightawb(messages) {
    var inputValues = {};
    var currentIndex = 0;
    var userInputElement = document.getElementById('user-input');

    function displayPrompt() {
        var message = messages[currentIndex];
        var botMessageHTML = `<div class="message-container"><div class="bot-avatar"><div id="dp" data-bs-toggle="modal" data-bs-target="#modalPopup">
            <img id="thumbnail" src="https://betatest.ezeeshipping.in/assets/img/EZ_New_LogoAboveText.png" alt="EzeeBot Logo" style="width: 90%; height: 90%; margin-top: 1.2px; margin-left: 0.8px; object-fit: contain; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); clip-path: inset(0 0 8px 0);">
        </div></div><div class="bot-message-chat">`;
        //var botMessageHTML = '<div class="message-container"><div class="bot-avatar" data-bs-toggle="modal" data-bs-target="#modalPopup"><img src="https://betatest.ezeeshipping.in/assets/img/EZ_New_LogoAboveText.png" alt="EzeeBot Logo" style="width: 30px; height: auto;"></div><div class="bot-message">';
        var botMessageHTML2 = '<div class="message-container"><div class="bot-message-time">';

            if (message.toLowerCase() === "from date" || message.toLowerCase() === "bk from date") {
                botMessageHTML += 'Please enter the "<b>' + message + '</b>"';
                chatContainer.innerHTML += botMessageHTML;
                var currentTime = new Date().toLocaleTimeString();
                var botTimeHTML = '<div class="bot-time">' + 'EZEEBOT , ' + currentTime + '</div>';
                chatContainer.innerHTML += botTimeHTML;
                var currentDate = new Date();
                currentDate.setMonth(currentDate.getMonth() - 1);

                var year = currentDate.getFullYear();
                var month = String(currentDate.getMonth() + 1).padStart(2, '0');
                var day = String(currentDate.getDate()).padStart(2, '0');
                var hours = String(currentDate.getHours()).padStart(2, '0');
                var minutes = String(currentDate.getMinutes()).padStart(2, '0');
                var defaultDate = year + '-' + month + '-' + day + 'T' + hours + ':' + minutes;

                botMessageHTML2 += '<input type="datetime-local" id="datetime-input" value="' + defaultDate + '">';
                chatContainer.innerHTML += botMessageHTML2;
                setTimeout(function() {
                    var datetimeInput = document.getElementById('datetime-input');
                    datetimeInput.focus();
                }, 0);
                scrollToBottom();
        
                var datetimeInput = document.getElementById('datetime-input');

                userInputElement.style.display = 'none';
        
                datetimeInput.addEventListener('blur', function(event) {
                    var userInput = this.value.trim().split("T")[0];
                    simpleUserMessage(userInput);
        
                    inputValues["awb" + message.toLowerCase().replace(/\s+/g, '_')] = userInput;

                    var botMessageCheck = document.querySelector('.bot-message-time');
                    if (botMessageCheck) {
                        botMessageCheck.remove();
                    }

                    userInputElement.style.display = 'block';
        
                    currentIndex++;
                    if (currentIndex < messages.length) {
                        displayPrompt();
                    } else {
                        sendAllInputs();
                    }
                });
            } else if (message.toLowerCase() === "to date" || message.toLowerCase() === "bk to date") {
                botMessageHTML += 'Please enter the "<b>' + message + '</b>"';
                chatContainer.innerHTML += botMessageHTML;
                var currentTime = new Date().toLocaleTimeString();
                var botTimeHTML = '<div class="bot-time">' + 'EZEEBOT , ' + currentTime + '</div>';
                chatContainer.innerHTML += botTimeHTML;
                var defaultDate = new Date().toISOString().slice(0, 16);
                botMessageHTML2 += '<input type="datetime-local" id="datetime-input" value="' + defaultDate + '">';
                chatContainer.innerHTML += botMessageHTML2;
                setTimeout(function() {
                    var datetimeInput = document.getElementById('datetime-input');
                    datetimeInput.focus();
                }, 0);
                scrollToBottom();
        
                var datetimeInput = document.getElementById('datetime-input');

                userInputElement.style.display = 'none';
        
                datetimeInput.addEventListener('blur', function(event) {
                    var userInput = this.value.trim().split("T")[0];
                    simpleUserMessage(userInput);
        
                    inputValues["awb" + message.toLowerCase().replace(/\s+/g, '_')] = userInput;

                    var botMessageCheck = document.querySelector('.bot-message-time');
                    if (botMessageCheck) {
                        botMessageCheck.remove();
                    }

                    userInputElement.style.display = 'block';
        
                    currentIndex++;
                    if (currentIndex < messages.length) {
                        displayPrompt();
                    } else {
                        sendAllInputs();
                    }
                });
            } else {
            botMessageHTML += 'Please type in the "<b>' + message + '</b>"';
            chatContainer.innerHTML += botMessageHTML;
            var currentTime = new Date().toLocaleTimeString();
            var botTimeHTML = '<div class="bot-time">' + 'EZEEBOT , ' + currentTime + '</div>';
            chatContainer.innerHTML += botTimeHTML;
            scrollToBottom();
    
            userInputElement.focus();
    
            if (userInputElement._listener) {
                userInputElement.removeEventListener('keypress', userInputElement._listener);
            }
    
            userInputElement._listener = function (event) {
                if (event.key === 'Enter') {
                    event.preventDefault();
                    var userInput = this.value.trim();
                    simpleUserMessage(userInput);
    
                    inputValues["awb" + message.toLowerCase().replace(/\s+/g, '_')] = userInput;
    
                    this.value = '';
    
                    currentIndex++;
                    if (currentIndex < messages.length) {
                        displayPrompt();
                    } else {
                        sendAllInputs();
                    }
                }
            };
    
            userInputElement.addEventListener('keypress', userInputElement._listener);
        }
    }

    function sendAllInputs() {
        typingMessage();
        fetch('/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_input: {
                    ...inputValues,
                    'current_date': formattedDate,
                    'tenantid': tenantid,
                    'officeid': officeid,
                    'userid': userid,
                    'userid2': userid2,
                    'environment': environment,
                    'userid2': userid2,
                    'ffrid': ffrid
                }
            }),
        })
        .then(response => response.json())
        .then(data => {
            var inputSummary = '<b>[ </b>' + Object.keys(inputValues).map(function(key, index, array) {
                var displayKey = key.replace(/^awb/, '').replace(/_/g, ' ');
                var comma = (index !== array.length - 1) ? ', ' : '';
                return '<b>' + displayKey + ':</b> ' + inputValues[key] + comma;
            }).join('') + '<b> ]</b>';   
            
            var botMessageHTML = `<div class="message-container"><div class="bot-avatar"><div id="dp" data-bs-toggle="modal" data-bs-target="#modalPopup">
                <img id="thumbnail" src="https://betatest.ezeeshipping.in/assets/img/EZ_New_LogoAboveText.png" alt="EzeeBot Logo" style="width: 90%; height: 90%; margin-top: 1.2px; margin-left: 0.8px; object-fit: contain; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); clip-path: inset(0 0 8px 0);">
            </div></div><div class="bot-message-booking"><b>Air way bill search result based on your criteria </b>${formatKeyValueList(inputSummary)}`;
            
            //var botMessageHTML = '<div class="message-container"><div class="bot-avatar" data-bs-toggle="modal" data-bs-target="#modalPopup"><img src="https://betatest.ezeeshipping.in/assets/img/EZ_New_LogoAboveText.png" alt="EzeeBot Logo" style="width: 30px; height: auto;"></div><div class="bot-message-booking"><b>Air way bill search result based on your criteria <br><br></b>' + '<span style="font-size:14px;">' + formatKeyValueList(inputSummary) + '</span><br><br>';

                var bookingSets = data.response.split('},');

                if (bookingSets.length > 1) {
                    botMessageHTML += '<b>Multiple entries found. Please pick one to view more details</b><br><br>';
                    var counter = 1;
                    var buttonHTML = '';
                
                    bookingSets.forEach((bookingSet, index) => {
                        var cleanedBookingSet = bookingSet.replace(/[\[\]{}"]/g, '');
                
                        if (cleanedBookingSet.trim() !== '') {
                            cleanedBookingSet = cleanedBookingSet.trim();
                
                            var keyValuePairs = cleanedBookingSet.split(',');
                
                            var bookingNumber = '';
                            var statusCode = '';
                            var det = '';
                            var bookingHTML = '<table class="booking-details">';
                            keyValuePairs.forEach(pair => {
                                var parts = pair.split(':');
                                var key = parts[0].trim();
                                var value = parts.slice(1).join(':').trim();
                
                                if (key.toUpperCase() === 'BOOKING NUMBER') {
                                    if (value === 'null') {
                                        bookingNumber = null;
                                    } else {
                                        bookingNumber = value;
                                    }
                                } else if (key.toUpperCase() === 'STATUS' && !bookingNumber) {
                                    statusCode = value;
                                } else if (key.toUpperCase() === 'BOOKING DATE') {
                                    bookingdate = value;
                                } else if (key.toUpperCase() === 'SHIPPER') {
                                    bookingparty = value;
                                }
                                
                                det += value + ',';
                                bookingHTML += '<tr><td><span class="key">' + key + '</span></td><td><span class="value">' + value + '</span></td></tr>\n';
                            });
                            bookingHTML += '</table>';
                
                            if (!bookingNumber) {
                                buttonHTML += '<button class="booking-button" onclick="showBookingDetails(\'' + bookingNumber + '\', ' + counter + ')"><div style="float: left; width: 33%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: left; border-right: 2px solid #f2f2f2;">' + bookingparty +'<span color: transparent;' + det +'</span></div><div style="display: inline-block; text-align: center; width: 33%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: center;">' + bookingdate + '</div><div style="float: right; width: 33%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: right; border-left: 2px solid #f2f2f2;">' + statusCode + '</div></button><br>';
                            } else {
                                buttonHTML += '<button class="booking-button" onclick="showBookingDetails(\'' + bookingNumber + '\', ' + counter + ')"><div style="float: left; width: 33%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: left; border-right: 2px solid #f2f2f2;">' + bookingparty +'<span color: transparent;' + det +'</span></div><div style="display: inline-block; text-align: center; width: 33%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: center;">' + bookingdate + '</div><div style="float: right; width: 33%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: right; border-left: 2px solid #f2f2f2;">' + bookingNumber + '</div></button><br>';
                            }
                
                            buttonHTML += '<div id="' + counter + 'bookingDetails_' + bookingNumber + '" style="display: none;">' + bookingHTML + '</div><br>';
                            counter++;
                        }
                    });
                        
                    var botDiv = `<div style="border: 1px solid transparent; padding-top: 10px; padding-left: 2px; padding-right: 2px; padding-bottom: 3px; border-radius: 10px; margin-top: 10px; background-color: #c0c0c0;">`;
                    botDiv += '<input type="text" id="search-input" style="width: 100%;" placeholder="Global Search...">';
                    var botDiv2 = `<div style="border-left: 1px solid transparent; background-color: #e5e4e2; padding: 4px; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;">`;
                    botDiv2 += '<div id="num" style="font-size: 14px; display: flex; padding: 5px; align-items: left; justify-content: left;"></div>';
                    botDiv2 += '<div><table style="border-collapse: collapse; width: 100%; margin-bottom: 5px;"><thead style="background-color: #002147; color: white;"><tr><th style="border: 1px solid #dddddd; text-align: left; padding: 8px; width: 33.17%;">SHIPPER</th><th style="border: 1px solid #dddddd; text-align: center; padding: 8px; width: 33.16%;">BOOKING DATE</th><th style="border: 1px solid #dddddd; text-align: right; padding: 8px; width: 33.66%;">BOOKING NO</th></tr></thead></table></div>';
                    botDiv2 +=  '<div id="bot-message-scroll" style="max-height: 250px; overflow-y: auto; overflow-x: hidden;">' + buttonHTML +'</div>';
                    botDiv2 += `</div>`;
                    botDiv += botDiv2;
                    botDiv += `</div>`;
                    botMessageHTML += botDiv;
                    botMessageHTML += '<div style="margin-top: 20px;"><b>If you have any questions or concerns about the results, please verify them using our application or contact our support team.</b></div>';
                }
                 else {
                    bookingSets.forEach(bookingSet => {
                        var cleanedBookingSet = bookingSet.replace(/[\[\]{}"]/g, '');
                
                        if (cleanedBookingSet.trim() !== '') {
                            cleanedBookingSet = cleanedBookingSet.trim();
                
                            var keyValuePairs = cleanedBookingSet.split(',');
                
                            var bookingHTML = '<table class="booking-details">';
                            keyValuePairs.forEach(pair => {
                                var parts = pair.split(':');
                                var key = parts[0].trim();
                                var value = parts.slice(1).join(':').trim();
                
                                bookingHTML += '<tr><td><span class="key">' + key + '</span></td><td><span class="value">' + value + '</span></td></tr>\n';
                            });
                            bookingHTML += '</table><br>';
                            botMessageHTML += bookingHTML;
                        }
                    });
                }
                
                botMessageHTML += '</div></div>';
                chatContainer.innerHTML += botMessageHTML;
                var currentTime = new Date().toLocaleTimeString();
                var botTimeHTML = '<div class="bot-time">'+ 'EZEEBOT , ' + currentTime + '</div>';
                chatContainer.innerHTML += botTimeHTML;
                document.addEventListener('input', function (event) {
                    if (event.target.id === 'search-input') {
                        var searchValue = event.target.value.toLowerCase();
                        var botMessageScroll = document.getElementById('bot-message-scroll');
                        var buttons = botMessageScroll.getElementsByClassName('booking-button');
                        var moduleName = 'air way bills';

                        filterButtons(searchValue, buttons, moduleName);
                    }
                });
                closeType();
                scrollToBottom();
        
            userInputElement.removeEventListener('keypress', userInputElement._listener);
        })
        .catch(error => {
            console.error('Error:', error);
        });                

    }
    displayPrompt();
}

function askBookingNumberfrightBillOfLading(messages) {
    var inputValues = {};
    var currentIndex = 0;
    var userInputElement = document.getElementById('user-input');

    function displayPrompt() {
        var message = messages[currentIndex];
        var botMessageHTML = `<div class="message-container"><div class="bot-avatar"><div id="dp" data-bs-toggle="modal" data-bs-target="#modalPopup">
            <img id="thumbnail" src="https://betatest.ezeeshipping.in/assets/img/EZ_New_LogoAboveText.png" alt="EzeeBot Logo" style="width: 90%; height: 90%; margin-top: 1.2px; margin-left: 0.8px; object-fit: contain; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); clip-path: inset(0 0 8px 0);">
        </div></div><div class="bot-message-chat">`;
        //var botMessageHTML = '<div class="message-container"><div class="bot-avatar" data-bs-toggle="modal" data-bs-target="#modalPopup"><img src="https://betatest.ezeeshipping.in/assets/img/EZ_New_LogoAboveText.png" alt="EzeeBot Logo" style="width: 30px; height: auto;"></div><div class="bot-message">';
        var botMessageHTML2 = '<div class="message-container"><div class="bot-message-time">';

            if (message.toLowerCase() === "from date" || message.toLowerCase() === "bk from date") {
                botMessageHTML += 'Please enter the "<b>' + message + '</b>"';
                chatContainer.innerHTML += botMessageHTML;
                var currentTime = new Date().toLocaleTimeString();
                var botTimeHTML = '<div class="bot-time">' + 'EZEEBOT , ' + currentTime + '</div>';
                chatContainer.innerHTML += botTimeHTML;
                var currentDate = new Date();
                currentDate.setMonth(currentDate.getMonth() - 1);

                var year = currentDate.getFullYear();
                var month = String(currentDate.getMonth() + 1).padStart(2, '0');
                var day = String(currentDate.getDate()).padStart(2, '0');
                var hours = String(currentDate.getHours()).padStart(2, '0');
                var minutes = String(currentDate.getMinutes()).padStart(2, '0');
                var defaultDate = year + '-' + month + '-' + day + 'T' + hours + ':' + minutes;

                botMessageHTML2 += '<input type="datetime-local" id="datetime-input" value="' + defaultDate + '">';
                chatContainer.innerHTML += botMessageHTML2;
                setTimeout(function() {
                    var datetimeInput = document.getElementById('datetime-input');
                    datetimeInput.focus();
                }, 0);
                scrollToBottom();
        
                var datetimeInput = document.getElementById('datetime-input');

                userInputElement.style.display = 'none';
        
                datetimeInput.addEventListener('blur', function(event) {
                    var userInput = this.value.trim().split("T")[0];
                    simpleUserMessage(userInput);
        
                    inputValues["bol" + message.toLowerCase().replace(/\s+/g, '_')] = userInput;

                    var botMessageCheck = document.querySelector('.bot-message-time');
                    if (botMessageCheck) {
                        botMessageCheck.remove();
                    }

                    userInputElement.style.display = 'block';
        
                    currentIndex++;
                    if (currentIndex < messages.length) {
                        displayPrompt();
                    } else {
                        sendAllInputs();
                    }
                });
            } else if (message.toLowerCase() === "to date" || message.toLowerCase() === "bk to date") {
                botMessageHTML += 'Please enter the "<b>' + message + '</b>"';
                chatContainer.innerHTML += botMessageHTML;
                var currentTime = new Date().toLocaleTimeString();
                var botTimeHTML = '<div class="bot-time">' + 'EZEEBOT , ' + currentTime + '</div>';
                chatContainer.innerHTML += botTimeHTML;
                var defaultDate = new Date().toISOString().slice(0, 16);
                botMessageHTML2 += '<input type="datetime-local" id="datetime-input" value="' + defaultDate + '">';
                chatContainer.innerHTML += botMessageHTML2;
                setTimeout(function() {
                    var datetimeInput = document.getElementById('datetime-input');
                    datetimeInput.focus();
                }, 0);
                scrollToBottom();
        
                var datetimeInput = document.getElementById('datetime-input');

                userInputElement.style.display = 'none';
        
                datetimeInput.addEventListener('blur', function(event) {
                    var userInput = this.value.trim().split("T")[0];
                    simpleUserMessage(userInput);
        
                    inputValues["bol" + message.toLowerCase().replace(/\s+/g, '_')] = userInput;

                    var botMessageCheck = document.querySelector('.bot-message-time');
                    if (botMessageCheck) {
                        botMessageCheck.remove();
                    }

                    userInputElement.style.display = 'block';
        
                    currentIndex++;
                    if (currentIndex < messages.length) {
                        displayPrompt();
                    } else {
                        sendAllInputs();
                    }
                });
            } else {
            botMessageHTML += 'Please type in the "<b>' + message + '</b>"';
            chatContainer.innerHTML += botMessageHTML;
            var currentTime = new Date().toLocaleTimeString();
            var botTimeHTML = '<div class="bot-time">' + 'EZEEBOT , ' + currentTime + '</div>';
            chatContainer.innerHTML += botTimeHTML;
            scrollToBottom();
    
            userInputElement.focus();
    
            if (userInputElement._listener) {
                userInputElement.removeEventListener('keypress', userInputElement._listener);
            }
    
            userInputElement._listener = function (event) {
                if (event.key === 'Enter') {
                    event.preventDefault();
                    var userInput = this.value.trim();
                    simpleUserMessage(userInput);
    
                    inputValues["bol" + message.toLowerCase().replace(/\s+/g, '_')] = userInput;
    
                    this.value = '';
    
                    currentIndex++;
                    if (currentIndex < messages.length) {
                        displayPrompt();
                    } else {
                        sendAllInputs();
                    }
                }
            };
    
            userInputElement.addEventListener('keypress', userInputElement._listener);
        }
    }

    function sendAllInputs() {
        typingMessage();
        fetch('/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_input: {
                    ...inputValues,
                    'current_date': formattedDate,
                    'tenantid': tenantid,
                    'officeid': officeid,
                    'userid': userid,
                    'userid2': userid2,
                    'environment': environment,
                    'userid2': userid2,
                    'ffrid': ffrid
                }
            }),
        })
        .then(response => response.json())
        .then(data => {
            var inputSummary = '<b>[ </b>' + Object.keys(inputValues).map(function(key, index, array) {
                var displayKey = key.replace(/^bol/, '').replace(/_/g, ' ');
                var comma = (index !== array.length - 1) ? ', ' : '';
                return '<b>' + displayKey + ':</b> ' + inputValues[key] + comma;
            }).join('') + '<b> ]</b>';     
            
            var botMessageHTML = `<div class="message-container"><div class="bot-avatar"><div id="dp" data-bs-toggle="modal" data-bs-target="#modalPopup">
                <img id="thumbnail" src="https://betatest.ezeeshipping.in/assets/img/EZ_New_LogoAboveText.png" alt="EzeeBot Logo" style="width: 90%; height: 90%; margin-top: 1.2px; margin-left: 0.8px; object-fit: contain; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); clip-path: inset(0 0 8px 0);">
            </div></div><div class="bot-message-booking"><b>Bill of lading search result based on your criteria </b>${formatKeyValueList(inputSummary)}`;
            
            //var botMessageHTML = '<div class="message-container"><div class="bot-avatar" data-bs-toggle="modal" data-bs-target="#modalPopup"><img src="https://betatest.ezeeshipping.in/assets/img/EZ_New_LogoAboveText.png" alt="EzeeBot Logo" style="width: 30px; height: auto;"></div><div class="bot-message-booking"><b>Bill of lading search result based on your criteria <br><br></b>' + '<span style="font-size:14px;">' + formatKeyValueList(inputSummary) + '</span><br><br>';

                var bookingSets = data.response.split('},');

                if (bookingSets.length > 1) {
                    botMessageHTML += '<b>Multiple entries found. Please pick one to view more details</b><br><br>';
                    var counter = 1;
                    var buttonHTML = '';
                
                    bookingSets.forEach((bookingSet, index) => {
                        var cleanedBookingSet = bookingSet.replace(/[\[\]{}"]/g, '');
                
                        if (cleanedBookingSet.trim() !== '') {
                            cleanedBookingSet = cleanedBookingSet.trim();
                
                            var keyValuePairs = cleanedBookingSet.split(',');
                
                            var bookingNumber = '';
                            var statusCode = '';
                            var det = '';
                            var bookingHTML = '<table class="booking-details">';
                            keyValuePairs.forEach(pair => {
                                var parts = pair.split(':');
                                var key = parts[0].trim();
                                var value = parts.slice(1).join(':').trim();
                
                                if (key.toUpperCase() === 'BOOKING NUMBER') {
                                    if (value === 'null') {
                                        bookingNumber = null;
                                    } else {
                                        bookingNumber = value;
                                    }
                                } else if (key.toUpperCase() === 'STATUS' && !bookingNumber) {
                                    statusCode = value;
                                } else if (key.toUpperCase() === 'BOOKING DATE') {
                                    bookingdate = value;
                                } else if (key.toUpperCase() === 'SHIPPER') {
                                    bookingparty = value;
                                }
                                
                                det += value + ',';
                                bookingHTML += '<tr><td><span class="key">' + key + '</span></td><td><span class="value">' + value + '</span></td></tr>\n';
                            });
                            bookingHTML += '</table>';
                
                            if (!bookingNumber) {
                                buttonHTML += '<button class="booking-button" onclick="showBookingDetails(\'' + bookingNumber + '\', ' + counter + ')"><div style="float: left; width: 33%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: left; border-right: 2px solid #f2f2f2;">' + bookingparty +'<span color: transparent;' + det +'</span></div><div style="display: inline-block; text-align: center; width: 33%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: center;">' + bookingdate + '</div><div style="float: right; width: 33%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: right; border-left: 2px solid #f2f2f2;">' + statusCode + '</div></button><br>';
                            } else {
                                buttonHTML += '<button class="booking-button" onclick="showBookingDetails(\'' + bookingNumber + '\', ' + counter + ')"><div style="float: left; width: 33%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: left; border-right: 2px solid #f2f2f2;">' + bookingparty +'<span color: transparent;' + det +'</span></div><div style="display: inline-block; text-align: center; width: 33%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: center;">' + bookingdate + '</div><div style="float: right; width: 33%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: right; border-left: 2px solid #f2f2f2;">' + bookingNumber + '</div></button><br>';
                            }
                
                            buttonHTML += '<div id="' + counter + 'bookingDetails_' + bookingNumber + '" style="display: none;">' + bookingHTML + '</div><br>';
                            counter++;
                        }
                    });
                    
                    var botDiv = `<div style="border: 1px solid transparent; padding-top: 10px; padding-left: 2px; padding-right: 2px; padding-bottom: 3px; border-radius: 10px; margin-top: 10px; background-color: #c0c0c0;">`;
                    botDiv += '<input type="text" id="search-input" style="width: 100%;" placeholder="Global Search...">';
                    var botDiv2 = `<div style="border-left: 1px solid transparent; background-color: #e5e4e2; padding: 4px; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;">`;
                    botDiv2 += '<div id="num" style="font-size: 14px; display: flex; padding: 5px; align-items: left; justify-content: left;"></div>';
                    botDiv2 += '<div><table style="border-collapse: collapse; width: 100%; margin-bottom: 5px;"><thead style="background-color: #002147; color: white;"><tr><th style="border: 1px solid #dddddd; text-align: left; padding: 8px; width: 33.17%;">SHIPPER</th><th style="border: 1px solid #dddddd; text-align: center; padding: 8px; width: 33.16%;">BOOKING DATE</th><th style="border: 1px solid #dddddd; text-align: right; padding: 8px; width: 33.66%;">BOOKING NO</th></tr></thead></table></div>';
                    botDiv2 +=  '<div id="bot-message-scroll" style="max-height: 250px; overflow-y: auto; overflow-x: hidden;">' + buttonHTML +'</div>';
                    botDiv2 += `</div>`;
                    botDiv += botDiv2;
                    botDiv += `</div>`;
                    botMessageHTML += botDiv;
                    botMessageHTML += '<div style="margin-top: 20px;"><b>If you have any questions or concerns about the results, please verify them using our application or contact our support team.</b></div>';
                }
                 else {
                    bookingSets.forEach(bookingSet => {
                        var cleanedBookingSet = bookingSet.replace(/[\[\]{}"]/g, '');
                
                        if (cleanedBookingSet.trim() !== '') {
                            cleanedBookingSet = cleanedBookingSet.trim();
                
                            var keyValuePairs = cleanedBookingSet.split(',');
                
                            var bookingHTML = '<table class="booking-details">';
                            keyValuePairs.forEach(pair => {
                                var parts = pair.split(':');
                                var key = parts[0].trim();
                                var value = parts.slice(1).join(':').trim();
                
                                bookingHTML += '<tr><td><span class="key">' + key + '</span></td><td><span class="value">' + value + '</span></td></tr>\n';
                            });
                            bookingHTML += '</table><br>';
                            botMessageHTML += bookingHTML;
                        }
                    });
                }
                
                botMessageHTML += '</div></div>';
                chatContainer.innerHTML += botMessageHTML;
                var currentTime = new Date().toLocaleTimeString();
                var botTimeHTML = '<div class="bot-time">'+ 'EZEEBOT , ' + currentTime + '</div>';
                chatContainer.innerHTML += botTimeHTML;
                document.addEventListener('input', function (event) {
                    if (event.target.id === 'search-input') {
                        var searchValue = event.target.value.toLowerCase();
                        var botMessageScroll = document.getElementById('bot-message-scroll');
                        var buttons = botMessageScroll.getElementsByClassName('booking-button');
                        var moduleName = 'bill of lading';

                        filterButtons(searchValue, buttons, moduleName);
                    }
                });
                closeType();
                scrollToBottom();
        
            userInputElement.removeEventListener('keypress', userInputElement._listener);
        })
        .catch(error => {
            console.error('Error:', error);
        });                

    }
    displayPrompt();
}

function askBookingNumbercustom(messages) {
    var inputValues = {};
    var currentIndex = 0;
    var userInputElement = document.getElementById('user-input');

    function displayPrompt() {
        var message = messages[currentIndex];
        var botMessageHTML = `<div class="message-container"><div class="bot-avatar"><div id="dp" data-bs-toggle="modal" data-bs-target="#modalPopup">
            <img id="thumbnail" src="https://betatest.ezeeshipping.in/assets/img/EZ_New_LogoAboveText.png" alt="EzeeBot Logo" style="width: 90%; height: 90%; margin-top: 1.2px; margin-left: 0.8px; object-fit: contain; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); clip-path: inset(0 0 8px 0);">
        </div></div><div class="bot-message-chat">`;

        //var botMessageHTML = '<div class="message-container"><div class="bot-avatar" data-bs-toggle="modal" data-bs-target="#modalPopup"><img src="https://betatest.ezeeshipping.in/assets/img/EZ_New_LogoAboveText.png" alt="EzeeBot Logo" style="width: 30px; height: auto;"></div><div class="bot-message">';
        var botMessageHTML2 = '<div class="message-container"><div class="bot-message-time">';

            if (message.toLowerCase() === "from date") {
                botMessageHTML += 'Please enter the "<b>' + message + '</b>"';
                chatContainer.innerHTML += botMessageHTML;
                var currentTime = new Date().toLocaleTimeString();
                var botTimeHTML = '<div class="bot-time">' + 'EZEEBOT , ' + currentTime + '</div>';
                chatContainer.innerHTML += botTimeHTML;
                var currentDate = new Date();
                currentDate.setMonth(currentDate.getMonth() - 1);

                var year = currentDate.getFullYear();
                var month = String(currentDate.getMonth() + 1).padStart(2, '0');
                var day = String(currentDate.getDate()).padStart(2, '0');
                var hours = String(currentDate.getHours()).padStart(2, '0');
                var minutes = String(currentDate.getMinutes()).padStart(2, '0');
                var defaultDate = year + '-' + month + '-' + day + 'T' + hours + ':' + minutes;

                botMessageHTML2 += '<input type="datetime-local" id="datetime-input" value="' + defaultDate + '">';
                chatContainer.innerHTML += botMessageHTML2;
                setTimeout(function() {
                    var datetimeInput = document.getElementById('datetime-input');
                    datetimeInput.focus();
                }, 0);
                scrollToBottom();
        
                var datetimeInput = document.getElementById('datetime-input');

                userInputElement.style.display = 'none';
        
                datetimeInput.addEventListener('blur', function(event) {
                    var userInput = this.value.trim().split("T")[0];
                    simpleUserMessage(userInput);
        
                    inputValues["booking" + message.toLowerCase().replace(/\s+/g, '_')] = userInput;

                    var botMessageCheck = document.querySelector('.bot-message-time');
                    if (botMessageCheck) {
                        botMessageCheck.remove();
                    }

                    userInputElement.style.display = 'block';
        
                    currentIndex++;
                    if (currentIndex < messages.length) {
                        displayPrompt();
                    } else {
                        sendAllInputs();
                    }
                });
            } else if (message.toLowerCase() === "to date") {
                botMessageHTML += 'Please enter the "<b>' + message + '</b>"';
                chatContainer.innerHTML += botMessageHTML;
                var currentTime = new Date().toLocaleTimeString();
                var botTimeHTML = '<div class="bot-time">' + 'EZEEBOT , ' + currentTime + '</div>';
                chatContainer.innerHTML += botTimeHTML;
                var defaultDate = new Date().toISOString().slice(0, 16);
                botMessageHTML2 += '<input type="datetime-local" id="datetime-input" value="' + defaultDate + '">';
                chatContainer.innerHTML += botMessageHTML2;
                setTimeout(function() {
                    var datetimeInput = document.getElementById('datetime-input');
                    datetimeInput.focus();
                }, 0);
                scrollToBottom();
        
                var datetimeInput = document.getElementById('datetime-input');

                userInputElement.style.display = 'none';
        
                datetimeInput.addEventListener('blur', function(event) {
                    var userInput = this.value.trim().split("T")[0];
                    simpleUserMessage(userInput);
        
                    inputValues["booking" + message.toLowerCase().replace(/\s+/g, '_')] = userInput;

                    var botMessageCheck = document.querySelector('.bot-message-time');
                    if (botMessageCheck) {
                        botMessageCheck.remove();
                    }

                    userInputElement.style.display = 'block';
        
                    currentIndex++;
                    if (currentIndex < messages.length) {
                        displayPrompt();
                    } else {
                        sendAllInputs();
                    }
                });
            } else {
            botMessageHTML += 'Please type in the "<b>' + message + '</b>"';
            chatContainer.innerHTML += botMessageHTML;
            var currentTime = new Date().toLocaleTimeString();
            var botTimeHTML = '<div class="bot-time">' + 'EZEEBOT , ' + currentTime + '</div>';
            chatContainer.innerHTML += botTimeHTML;
            scrollToBottom();
    
            userInputElement.focus();
    
            if (userInputElement._listener) {
                userInputElement.removeEventListener('keypress', userInputElement._listener);
            }
    
            userInputElement._listener = function (event) {
                if (event.key === 'Enter') {
                    event.preventDefault();
                    var userInput = this.value.trim();
                    simpleUserMessage(userInput);
    
                    inputValues["booking" + message.toLowerCase().replace(/\s+/g, '_')] = userInput;
    
                    this.value = '';
    
                    currentIndex++;
                    if (currentIndex < messages.length) {
                        displayPrompt();
                    } else {
                        sendAllInputs();
                    }
                }
            };
    
            userInputElement.addEventListener('keypress', userInputElement._listener);
        }
    }

    function sendAllInputs() {
        typingMessage();
        fetch('/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_input: {
                    ...inputValues,
                    'current_date': formattedDate,
                    'tenantid': tenantid,
                    'officeid': officeid,
                    'userid': userid,
                    'userid2': userid2,
                    'environment': environment,
                    'userid2': userid2,
                    'chaid': chaid
                }
            }),
        })
        .then(response => response.json())
        .then(data => {
            var inputSummary = '<b>[ </b>' + Object.keys(inputValues).map(function(key, index, array) {
                var displayKey = key.replace(/^booking/, '').replace(/_/g, ' ');
                var comma = (index !== array.length - 1) ? ', ' : '';
                return '<b>' + displayKey + ':</b> ' + inputValues[key] + comma;
            }).join('') + '<b> ]</b>';    
            
            var botMessageHTML = `<div class="message-container"><div class="bot-avatar"><div id="dp" data-bs-toggle="modal" data-bs-target="#modalPopup">
                <img id="thumbnail" src="https://betatest.ezeeshipping.in/assets/img/EZ_New_LogoAboveText.png" alt="EzeeBot Logo" style="width: 90%; height: 90%; margin-top: 1.2px; margin-left: 0.8px; object-fit: contain; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); clip-path: inset(0 0 8px 0);">
            </div></div><div class="bot-message-booking"><b>Custom broker booking search result based on your criteria </b>${formatKeyValueList(inputSummary)}`;
            
            //var botMessageHTML = '<div class="message-container"><div class="bot-avatar" data-bs-toggle="modal" data-bs-target="#modalPopup"><img src="https://betatest.ezeeshipping.in/assets/img/EZ_New_LogoAboveText.png" alt="EzeeBot Logo" style="width: 30px; height: auto;"></div><div class="bot-message-booking"><b>Custom broker booking search result based on your criteria <br><br></b>' + '<span style="font-size:14px;">' + formatKeyValueList(inputSummary) + '</span><br><br>';

                var bookingSets = data.response.split('},');

                if (bookingSets.length > 1) {
                    botMessageHTML += '<b>Multiple result found. Please select and view the details</b><br><br>';
                    var counter = 1;
                    var buttonHTML = '';
                
                    bookingSets.forEach((bookingSet, index) => {
                        var cleanedBookingSet = bookingSet.replace(/[\[\]{}"]/g, '');
                
                        if (cleanedBookingSet.trim() !== '') {
                            cleanedBookingSet = cleanedBookingSet.trim();
                
                            var keyValuePairs = cleanedBookingSet.split(',');
                
                            var bookingNumber = '';
                            var statusCode = '';
                            var det = '';
                            var bookingHTML = '<table class="booking-details">';
                            keyValuePairs.forEach(pair => {
                                var parts = pair.split(':');
                                var key = parts[0].trim();
                                var value = parts.slice(1).join(':').trim();
                
                                if (key.toUpperCase() === 'BOOKING NUMBER') {
                                    if (value === 'null') {
                                        bookingNumber = null;
                                    } else {
                                        bookingNumber = value;
                                    }
                                } else if (key.toUpperCase() === 'STATUS' && !bookingNumber) {
                                    statusCode = value;
                                } else if (key.toUpperCase() === 'BOOKING DATE') {
                                    bookingdate = value;
                                } else if (key.toUpperCase() === 'BOOKING PARTY') {
                                    bookingparty = value;
                                }
                                
                                det += value + ',';
                                console.log(det);
                                bookingHTML += '<tr><td><span class="key">' + key + '</span></td><td><span class="value">' + value + '</span></td></tr>\n';
                            });
                            bookingHTML += '</table>';
    
                            if (!bookingNumber) {
                                buttonHTML += '<button class="booking-button" onclick="showBookingDetails(\'' + bookingNumber + '\', ' + counter + ')"><div style="float: left; width: 33%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: left; border-right: 2px solid #f2f2f2;">' + bookingparty +'<span color: transparent;' + det +'</span></div><div style="display: inline-block; text-align: center; width: 33%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: center;">' + bookingdate + '</div><div style="float: right; width: 33%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: right; border-left: 2px solid #f2f2f2;">' + statusCode + '</div></button><br>';
                            } else {
                                buttonHTML += '<button class="booking-button" onclick="showBookingDetails(\'' + bookingNumber + '\', ' + counter + ')"><div style="float: left; width: 33%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: left; border-right: 2px solid #f2f2f2;">' + bookingparty +'<span color: transparent;' + det +'</span></div><div style="display: inline-block; text-align: center; width: 33%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: center;">' + bookingdate + '</div><div style="float: right; width: 33%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: right; border-left: 2px solid #f2f2f2;">' + bookingNumber + '</div></button><br>';
                            }

                            buttonHTML += '<div id="' + counter + 'bookingDetails_' + bookingNumber + '" style="display: none;">' + bookingHTML + '</div><br>';
                            counter++;
                        }
                    });

                    var botDiv = `<div style="border: 1px solid transparent; padding-top: 10px; padding-left: 2px; padding-right: 2px; padding-bottom: 3px; border-radius: 10px; margin-top: 10px; background-color: #c0c0c0;">`;    
                    botDiv += '<input type="text" id="search-input" style="width: 100%;" placeholder="Global Search...">';
                    var botDiv2 = `<div style="border-left: 1px solid transparent; background-color: #e5e4e2; padding: 4px; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;">`;
                    botDiv2 += '<div id="num" style="font-size: 14px; display: flex; padding: 5px; align-items: left; justify-content: left;"></div>';
                    botDiv2 += '<div><table style="border-collapse: collapse; width: 100%; margin-bottom: 5px;"><thead style="background-color: #002147; color: white;"><tr><th style="border: 1px solid #dddddd; text-align: left; padding: 8px; width: 33.17%;">BOOKING PARTY</th><th style="border: 1px solid #dddddd; text-align: center; padding: 8px; width: 33.16%;">BOOKING DATE</th><th style="border: 1px solid #dddddd; text-align: right; padding: 8px; width: 33.66%;">BOOKING NO</th></tr></thead></table></div>';
                    botDiv2 +=  '<div id="bot-message-scroll" style="max-height: 250px; overflow-y: auto; overflow-x: hidden;">' + buttonHTML +'</div>';
                    botDiv2 += `</div>`;
                    botDiv += botDiv2;
                    botDiv += `</div>`;
                    botMessageHTML += botDiv;
                    botMessageHTML += '<div style="margin-top: 20px;"><b>If you have any questions or concerns about the results, please verify them using our application or contact our support team.</b></div>';
                }
                 else {
                    bookingSets.forEach(bookingSet => {
                        var cleanedBookingSet = bookingSet.replace(/[\[\]{}"]/g, '');
                
                        if (cleanedBookingSet.trim() !== '') {
                            cleanedBookingSet = cleanedBookingSet.trim();
                
                            var keyValuePairs = cleanedBookingSet.split(',');
                
                            var bookingHTML = '<table class="booking-details">';
                            keyValuePairs.forEach(pair => {
                                var parts = pair.split(':');
                                var key = parts[0].trim();
                                var value = parts.slice(1).join(':').trim();
                
                                bookingHTML += '<tr><td><span class="key">' + key + '</span></td><td><span class="value">' + value + '</span></td></tr>\n';
                            });
                            bookingHTML += '</table><br>';
                            botMessageHTML += bookingHTML;
                        }
                    });
                }
                
                botMessageHTML += '</div></div>';
                chatContainer.innerHTML += botMessageHTML;
                var currentTime = new Date().toLocaleTimeString();
                var botTimeHTML = '<div class="bot-time">'+ 'EZEEBOT , ' + currentTime + '</div>';
                chatContainer.innerHTML += botTimeHTML;
                document.addEventListener('input', function (event) {
                    if (event.target.id === 'search-input') {
                        var searchValue = event.target.value.toLowerCase();
                        var botMessageScroll = document.getElementById('bot-message-scroll');
                        var buttons = botMessageScroll.getElementsByClassName('booking-button');
                        var moduleName = 'custom bookings';

                        filterButtons(searchValue, buttons, moduleName);
                    }
                });
                closeType();
                scrollToBottom();
        
            userInputElement.removeEventListener('keypress', userInputElement._listener);
        })
        .catch(error => {
            console.error('Error:', error);
        });                

    }
    displayPrompt();
}

function askBookingNumbertrp(messages) {
    var inputValues = {};
    var currentIndex = 0;
    var userInputElement = document.getElementById('user-input');

    function displayPrompt() {
        var message = messages[currentIndex];
        var botMessageHTML = `<div class="message-container"><div class="bot-avatar"><div id="dp" data-bs-toggle="modal" data-bs-target="#modalPopup">
            <img id="thumbnail" src="https://betatest.ezeeshipping.in/assets/img/EZ_New_LogoAboveText.png" alt="EzeeBot Logo" style="width: 90%; height: 90%; margin-top: 1.2px; margin-left: 0.8px; object-fit: contain; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); clip-path: inset(0 0 8px 0);">
        </div></div><div class="bot-message-chat">`;

        //var botMessageHTML = '<div class="message-container"><div class="bot-avatar" data-bs-toggle="modal" data-bs-target="#modalPopup"><img src="https://betatest.ezeeshipping.in/assets/img/EZ_New_LogoAboveText.png" alt="EzeeBot Logo" style="width: 30px; height: auto;"></div><div class="bot-message">';
        var botMessageHTML2 = '<div class="message-container"><div class="bot-message-time">';

            if (message.toLowerCase() === "from date") {
                botMessageHTML += 'Please enter the "<b>' + message + '</b>"';
                chatContainer.innerHTML += botMessageHTML;
                var currentTime = new Date().toLocaleTimeString();
                var botTimeHTML = '<div class="bot-time">' + 'EZEEBOT , ' + currentTime + '</div>';
                chatContainer.innerHTML += botTimeHTML;
                var currentDate = new Date();
                currentDate.setMonth(currentDate.getMonth() - 1);

                var year = currentDate.getFullYear();
                var month = String(currentDate.getMonth() + 1).padStart(2, '0');
                var day = String(currentDate.getDate()).padStart(2, '0');
                var hours = String(currentDate.getHours()).padStart(2, '0');
                var minutes = String(currentDate.getMinutes()).padStart(2, '0');
                var defaultDate = year + '-' + month + '-' + day + 'T' + hours + ':' + minutes;

                botMessageHTML2 += '<input type="datetime-local" id="datetime-input" value="' + defaultDate + '">';
                chatContainer.innerHTML += botMessageHTML2;
                setTimeout(function() {
                    var datetimeInput = document.getElementById('datetime-input');
                    datetimeInput.focus();
                }, 0);
                scrollToBottom();
        
                var datetimeInput = document.getElementById('datetime-input');

                userInputElement.style.display = 'none';
        
                datetimeInput.addEventListener('blur', function(event) {
                    var userInput = this.value.trim().split("T")[0];
                    simpleUserMessage(userInput);
        
                    inputValues["booking" + message.toLowerCase().replace(/\s+/g, '_')] = userInput;

                    var botMessageCheck = document.querySelector('.bot-message-time');
                    if (botMessageCheck) {
                        botMessageCheck.remove();
                    }

                    userInputElement.style.display = 'block';
        
                    currentIndex++;
                    if (currentIndex < messages.length) {
                        displayPrompt();
                    } else {
                        sendAllInputs();
                    }
                });
            } else if (message.toLowerCase() === "to date") {
                botMessageHTML += 'Please enter the "<b>' + message + '</b>"';
                chatContainer.innerHTML += botMessageHTML;
                var currentTime = new Date().toLocaleTimeString();
                var botTimeHTML = '<div class="bot-time">' + 'EZEEBOT , ' + currentTime + '</div>';
                chatContainer.innerHTML += botTimeHTML;
                var defaultDate = new Date().toISOString().slice(0, 16);
                botMessageHTML2 += '<input type="datetime-local" id="datetime-input" value="' + defaultDate + '">';
                chatContainer.innerHTML += botMessageHTML2;
                setTimeout(function() {
                    var datetimeInput = document.getElementById('datetime-input');
                    datetimeInput.focus();
                }, 0);
                scrollToBottom();
        
                var datetimeInput = document.getElementById('datetime-input');

                userInputElement.style.display = 'none';
        
                datetimeInput.addEventListener('blur', function(event) {
                    var userInput = this.value.trim().split("T")[0];
                    simpleUserMessage(userInput);
        
                    inputValues["booking" + message.toLowerCase().replace(/\s+/g, '_')] = userInput;

                    var botMessageCheck = document.querySelector('.bot-message-time');
                    if (botMessageCheck) {
                        botMessageCheck.remove();
                    }

                    userInputElement.style.display = 'block';
        
                    currentIndex++;
                    if (currentIndex < messages.length) {
                        displayPrompt();
                    } else {
                        sendAllInputs();
                    }
                });
            } else {
            botMessageHTML += 'Please type in the "<b>' + message + '</b>"';
            chatContainer.innerHTML += botMessageHTML;
            var currentTime = new Date().toLocaleTimeString();
            var botTimeHTML = '<div class="bot-time">' + 'EZEEBOT , ' + currentTime + '</div>';
            chatContainer.innerHTML += botTimeHTML;
            scrollToBottom();
    
            userInputElement.focus();
    
            if (userInputElement._listener) {
                userInputElement.removeEventListener('keypress', userInputElement._listener);
            }
    
            userInputElement._listener = function (event) {
                if (event.key === 'Enter') {
                    event.preventDefault();
                    var userInput = this.value.trim();
                    simpleUserMessage(userInput);
    
                    inputValues["booking" + message.toLowerCase().replace(/\s+/g, '_')] = userInput;
    
                    this.value = '';
    
                    currentIndex++;
                    if (currentIndex < messages.length) {
                        displayPrompt();
                    } else {
                        sendAllInputs();
                    }
                }
            };
    
            userInputElement.addEventListener('keypress', userInputElement._listener);
        }
    }

    function sendAllInputs() {
        typingMessage();
        fetch('/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_input: {
                    ...inputValues,
                    'current_date': formattedDate,
                    'tenantid': tenantid,
                    'officeid': officeid,
                    'userid': userid,
                    'userid2': userid2,
                    'environment': environment,
                    'userid2': userid2,
                    'trpid': trpid
                }
            }),
        })
        .then(response => response.json())
        .then(data => {
            var inputSummary = '<b>[ </b>' + Object.keys(inputValues).map(function(key, index, array) {
                var displayKey = key.replace(/^booking/, '').replace(/_/g, ' ');
                var comma = (index !== array.length - 1) ? ', ' : '';
                return '<b>' + displayKey + ':</b> ' + inputValues[key] + comma;
            }).join('') + '<b> ]</b>';    
            
            var botMessageHTML = `<div class="message-container"><div class="bot-avatar"><div id="dp" data-bs-toggle="modal" data-bs-target="#modalPopup">
                <img id="thumbnail" src="https://betatest.ezeeshipping.in/assets/img/EZ_New_LogoAboveText.png" alt="EzeeBot Logo" style="width: 90%; height: 90%; margin-top: 1.2px; margin-left: 0.8px; object-fit: contain; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); clip-path: inset(0 0 8px 0);">
            </div></div><div class="bot-message-booking"><b>Transport booking search result based on your criteria </b>${formatKeyValueList(inputSummary)}`;
            
            //var botMessageHTML = '<div class="message-container"><div class="bot-avatar" data-bs-toggle="modal" data-bs-target="#modalPopup"><img src="https://betatest.ezeeshipping.in/assets/img/EZ_New_LogoAboveText.png" alt="EzeeBot Logo" style="width: 30px; height: auto;"></div><div class="bot-message-booking"><b>Custom broker booking search result based on your criteria <br><br></b>' + '<span style="font-size:14px;">' + formatKeyValueList(inputSummary) + '</span><br><br>';

                var bookingSets = data.response.split('},');

                if (bookingSets.length > 1) {
                    botMessageHTML += '<b>Multiple result found. Please select and view the details</b><br><br>';
                    var counter = 1;
                    var buttonHTML = '';
                
                    bookingSets.forEach((bookingSet, index) => {
                        var cleanedBookingSet = bookingSet.replace(/[\[\]{}"]/g, '');
                
                        if (cleanedBookingSet.trim() !== '') {
                            cleanedBookingSet = cleanedBookingSet.trim();
                
                            var keyValuePairs = cleanedBookingSet.split(',');
                
                            var bookingNumber = '';
                            var statusCode = '';
                            var det = '';
                            var bookingHTML = '<table class="booking-details">';
                            keyValuePairs.forEach(pair => {
                                var parts = pair.split(':');
                                var key = parts[0].trim();
                                var value = parts.slice(1).join(':').trim();
                
                                if (key.toUpperCase() === 'BOOKING NUMBER') {
                                    if (value === 'null') {
                                        bookingNumber = null;
                                    } else {
                                        bookingNumber = value;
                                    }
                                } else if (key.toUpperCase() === 'STATUS' && !bookingNumber) {
                                    statusCode = value;
                                } else if (key.toUpperCase() === 'BOOKING DATE') {
                                    bookingdate = value;
                                } else if (key.toUpperCase() === 'BOOKING PARTY') {
                                    bookingparty = value;
                                }
                                
                                det += value + ',';
                                console.log(det);
                                bookingHTML += '<tr><td><span class="key">' + key + '</span></td><td><span class="value">' + value + '</span></td></tr>\n';
                            });
                            bookingHTML += '</table>';
    
                            if (!bookingNumber) {
                                buttonHTML += '<button class="booking-button" onclick="showBookingDetails(\'' + bookingNumber + '\', ' + counter + ')"><div style="float: left; width: 33%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: left; border-right: 2px solid #f2f2f2;">' + bookingparty +'<span color: transparent;' + det +'</span></div><div style="display: inline-block; text-align: center; width: 33%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: center;">' + bookingdate + '</div><div style="float: right; width: 33%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: right; border-left: 2px solid #f2f2f2;">' + statusCode + '</div></button><br>';
                            } else {
                                buttonHTML += '<button class="booking-button" onclick="showBookingDetails(\'' + bookingNumber + '\', ' + counter + ')"><div style="float: left; width: 33%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: left; border-right: 2px solid #f2f2f2;">' + bookingparty +'<span color: transparent;' + det +'</span></div><div style="display: inline-block; text-align: center; width: 33%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: center;">' + bookingdate + '</div><div style="float: right; width: 33%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: right; border-left: 2px solid #f2f2f2;">' + bookingNumber + '</div></button><br>';
                            }

                            buttonHTML += '<div id="' + counter + 'bookingDetails_' + bookingNumber + '" style="display: none;">' + bookingHTML + '</div><br>';
                            counter++;
                        }
                    });

                    var botDiv = `<div style="border: 1px solid transparent; padding-top: 10px; padding-left: 2px; padding-right: 2px; padding-bottom: 3px; border-radius: 10px; margin-top: 10px; background-color: #c0c0c0;">`;    
                    botDiv += '<input type="text" id="search-input" style="width: 100%;" placeholder="Global Search...">';
                    var botDiv2 = `<div style="border-left: 1px solid transparent; background-color: #e5e4e2; padding: 4px; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;">`;
                    botDiv2 += '<div id="num" style="font-size: 14px; display: flex; padding: 5px; align-items: left; justify-content: left;"></div>';
                    botDiv2 += '<div><table style="border-collapse: collapse; width: 100%; margin-bottom: 5px;"><thead style="background-color: #002147; color: white;"><tr><th style="border: 1px solid #dddddd; text-align: left; padding: 8px; width: 33.17%;">BOOKING PARTY</th><th style="border: 1px solid #dddddd; text-align: center; padding: 8px; width: 33.16%;">BOOKING DATE</th><th style="border: 1px solid #dddddd; text-align: right; padding: 8px; width: 33.66%;">BOOKING NO</th></tr></thead></table></div>';
                    botDiv2 +=  '<div id="bot-message-scroll" style="max-height: 250px; overflow-y: auto; overflow-x: hidden;">' + buttonHTML +'</div>';
                    botDiv2 += `</div>`;
                    botDiv += botDiv2;
                    botDiv += `</div>`;
                    botMessageHTML += botDiv;
                    botMessageHTML += '<div style="margin-top: 20px;"><b>If you have any questions or concerns about the results, please verify them using our application or contact our support team.</b></div>';
                }
                 else {
                    bookingSets.forEach(bookingSet => {
                        var cleanedBookingSet = bookingSet.replace(/[\[\]{}"]/g, '');
                
                        if (cleanedBookingSet.trim() !== '') {
                            cleanedBookingSet = cleanedBookingSet.trim();
                
                            var keyValuePairs = cleanedBookingSet.split(',');
                
                            var bookingHTML = '<table class="booking-details">';
                            keyValuePairs.forEach(pair => {
                                var parts = pair.split(':');
                                var key = parts[0].trim();
                                var value = parts.slice(1).join(':').trim();
                
                                bookingHTML += '<tr><td><span class="key">' + key + '</span></td><td><span class="value">' + value + '</span></td></tr>\n';
                            });
                            bookingHTML += '</table><br>';
                            botMessageHTML += bookingHTML;
                        }
                    });
                }
                
                botMessageHTML += '</div></div>';
                chatContainer.innerHTML += botMessageHTML;
                var currentTime = new Date().toLocaleTimeString();
                var botTimeHTML = '<div class="bot-time">'+ 'EZEEBOT , ' + currentTime + '</div>';
                chatContainer.innerHTML += botTimeHTML;
                document.addEventListener('input', function (event) {
                    if (event.target.id === 'search-input') {
                        var searchValue = event.target.value.toLowerCase();
                        var botMessageScroll = document.getElementById('bot-message-scroll');
                        var buttons = botMessageScroll.getElementsByClassName('booking-button');
                        var moduleName = 'transport bookings';

                        filterButtons(searchValue, buttons, moduleName);
                    }
                });
                closeType();
                scrollToBottom();
        
            userInputElement.removeEventListener('keypress', userInputElement._listener);
        })
        .catch(error => {
            console.error('Error:', error);
        });                

    }
    displayPrompt();
}

function askBookingNumbercustomSB(messages) {
    var inputValues = {};
    var currentIndex = 0;
    var userInputElement = document.getElementById('user-input');

    function displayPrompt() {
        var message = messages[currentIndex];
        var botMessageHTML = `<div class="message-container"><div class="bot-avatar"><div id="dp" data-bs-toggle="modal" data-bs-target="#modalPopup">
            <img id="thumbnail" src="https://betatest.ezeeshipping.in/assets/img/EZ_New_LogoAboveText.png" alt="EzeeBot Logo" style="width: 90%; height: 90%; margin-top: 1.2px; margin-left: 0.8px; object-fit: contain; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); clip-path: inset(0 0 8px 0);">
        </div></div><div class="bot-message-chat">`;

        //var botMessageHTML = '<div class="message-container"><div class="bot-avatar" data-bs-toggle="modal" data-bs-target="#modalPopup"><img src="https://betatest.ezeeshipping.in/assets/img/EZ_New_LogoAboveText.png" alt="EzeeBot Logo" style="width: 30px; height: auto;"></div><div class="bot-message">';
        var botMessageHTML2 = '<div class="message-container"><div class="bot-message-time">';

            if (message.toLowerCase() === "sb from date") {
                botMessageHTML += 'Please enter the "<b>' + message + '</b>"';
                chatContainer.innerHTML += botMessageHTML;
                var currentTime = new Date().toLocaleTimeString();
                var botTimeHTML = '<div class="bot-time">' + 'EZEEBOT , ' + currentTime + '</div>';
                chatContainer.innerHTML += botTimeHTML;
                var currentDate = new Date();
                currentDate.setMonth(currentDate.getMonth() - 1);

                var year = currentDate.getFullYear();
                var month = String(currentDate.getMonth() + 1).padStart(2, '0');
                var day = String(currentDate.getDate()).padStart(2, '0');
                var hours = String(currentDate.getHours()).padStart(2, '0');
                var minutes = String(currentDate.getMinutes()).padStart(2, '0');
                var defaultDate = year + '-' + month + '-' + day + 'T' + hours + ':' + minutes;

                botMessageHTML2 += '<input type="datetime-local" id="datetime-input" value="' + defaultDate + '">';
                chatContainer.innerHTML += botMessageHTML2;
                setTimeout(function() {
                    var datetimeInput = document.getElementById('datetime-input');
                    datetimeInput.focus();
                }, 0);
                scrollToBottom();
        
                var datetimeInput = document.getElementById('datetime-input');

                userInputElement.style.display = 'none';
        
                datetimeInput.addEventListener('blur', function(event) {
                    var userInput = this.value.trim().split("T")[0];
                    simpleUserMessage(userInput);
        
                    inputValues["customSB" + message.toLowerCase().replace(/\s+/g, '_')] = userInput;

                    var botMessageCheck = document.querySelector('.bot-message-time');
                    if (botMessageCheck) {
                        botMessageCheck.remove();
                    }

                    userInputElement.style.display = 'block';
        
                    currentIndex++;
                    if (currentIndex < messages.length) {
                        displayPrompt();
                    } else {
                        sendAllInputs();
                    }
                });
            } else if (message.toLowerCase() === "sb to date") {
                botMessageHTML += 'Please enter the "<b>' + message + '</b>"';
                chatContainer.innerHTML += botMessageHTML;
                var currentTime = new Date().toLocaleTimeString();
                var botTimeHTML = '<div class="bot-time">' + 'EZEEBOT , ' + currentTime + '</div>';
                chatContainer.innerHTML += botTimeHTML;
                var defaultDate = new Date().toISOString().slice(0, 16);
                botMessageHTML2 += '<input type="datetime-local" id="datetime-input" value="' + defaultDate + '">';
                chatContainer.innerHTML += botMessageHTML2;
                setTimeout(function() {
                    var datetimeInput = document.getElementById('datetime-input');
                    datetimeInput.focus();
                }, 0);
                scrollToBottom();
        
                var datetimeInput = document.getElementById('datetime-input');

                userInputElement.style.display = 'none';
        
                datetimeInput.addEventListener('blur', function(event) {
                    var userInput = this.value.trim().split("T")[0];
                    simpleUserMessage(userInput);
        
                    inputValues["customSB" + message.toLowerCase().replace(/\s+/g, '_')] = userInput;

                    var botMessageCheck = document.querySelector('.bot-message-time');
                    if (botMessageCheck) {
                        botMessageCheck.remove();
                    }

                    userInputElement.style.display = 'block';
        
                    currentIndex++;
                    if (currentIndex < messages.length) {
                        displayPrompt();
                    } else {
                        sendAllInputs();
                    }
                });
            } else {
            botMessageHTML += 'Please type in the "<b>' + message + '</b>"';
            chatContainer.innerHTML += botMessageHTML;
            var currentTime = new Date().toLocaleTimeString();
            var botTimeHTML = '<div class="bot-time">' + 'EZEEBOT , ' + currentTime + '</div>';
            chatContainer.innerHTML += botTimeHTML;
            scrollToBottom();
    
            userInputElement.focus();
    
            if (userInputElement._listener) {
                userInputElement.removeEventListener('keypress', userInputElement._listener);
            }
    
            userInputElement._listener = function (event) {
                if (event.key === 'Enter') {
                    event.preventDefault();
                    var userInput = this.value.trim();
                    simpleUserMessage(userInput);
    
                    inputValues["customSB" + message.toLowerCase().replace(/\s+/g, '_')] = userInput;
    
                    this.value = '';
    
                    currentIndex++;
                    if (currentIndex < messages.length) {
                        displayPrompt();
                    } else {
                        sendAllInputs();
                    }
                }
            };
    
            userInputElement.addEventListener('keypress', userInputElement._listener);
        }
    }

    function sendAllInputs() {
        typingMessage();
        fetch('/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_input: {
                    ...inputValues,
                    'current_date': formattedDate,
                    'tenantid': tenantid,
                    'officeid': officeid,
                    'userid': userid,
                    'userid2': userid2,
                    'environment': environment,
                    'userid2': userid2,
                    'chaid': chaid
                }
            }),
        })
        .then(response => response.json())
        .then(data => {
            var inputSummary = '<b>[ </b>' + Object.keys(inputValues).map(function(key, index, array) {
                var displayKey = key.replace(/^customSB/, '').replace(/_/g, ' ');
                var comma = (index !== array.length - 1) ? ', ' : '';
                return '<b>' + displayKey + ':</b> ' + inputValues[key] + comma;
            }).join('') + '<b> ]</b>';   
            
            var botMessageHTML = `<div class="message-container"><div class="bot-avatar"><div id="dp" data-bs-toggle="modal" data-bs-target="#modalPopup">
                <img id="thumbnail" src="https://betatest.ezeeshipping.in/assets/img/EZ_New_LogoAboveText.png" alt="EzeeBot Logo" style="width: 90%; height: 90%; margin-top: 1.2px; margin-left: 0.8px; object-fit: contain; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); clip-path: inset(0 0 8px 0);">
            </div></div><div class="bot-message-booking"><b>Shipping bills search result based on your criteria </b>${formatKeyValueList(inputSummary)}`;
            
            //var botMessageHTML = '<div class="message-container"><div class="bot-avatar" data-bs-toggle="modal" data-bs-target="#modalPopup"><img src="https://betatest.ezeeshipping.in/assets/img/EZ_New_LogoAboveText.png" alt="EzeeBot Logo" style="width: 30px; height: auto;"></div><div class="bot-message-booking"><b>Shipping bills search result based on your criteria <br><br></b>' + '<span style="font-size:14px;">' + formatKeyValueList(inputSummary) + '</span><br><br>';

                var bookingSets = data.response.split('},');

                if (bookingSets.length > 1) {
                    botMessageHTML += '<b>Multiple entries found. Please pick one to view more details</b><br><br>';
                    var counter = 1;
                    var buttonHTML = '';
                
                    bookingSets.forEach((bookingSet, index) => {
                        var cleanedBookingSet = bookingSet.replace(/[\[\]{}"]/g, '');
                
                        if (cleanedBookingSet.trim() !== '') {
                            cleanedBookingSet = cleanedBookingSet.trim();
                
                            var keyValuePairs = cleanedBookingSet.split(',');
                
                            var bookingNumber = '';
                            var statusCode = '';
                            var det = '';
                            var bookingHTML = '<table class="booking-details">';
                            keyValuePairs.forEach(pair => {
                                var parts = pair.split(':');
                                var key = parts[0].trim();
                                var value = parts.slice(1).join(':').trim();
                
                                if (key.toUpperCase() === 'JOB NUMBER') {
                                    if (value === 'null') {
                                        bookingNumber = null;
                                    } else {
                                        bookingNumber = value;
                                    }
                                } else if (key.toUpperCase() === 'STATUS' && !bookingNumber) {
                                    statusCode = value;
                                } else if (key.toUpperCase() === 'JOB DATE') {
                                    bookingdate = value;
                                } else if (key.toUpperCase() === 'CONSIGNEE') {
                                    bookingparty = value;
                                }
                                
                                det += value + ',';
                                bookingHTML += '<tr><td><span class="key">' + key + '</span></td><td><span class="value">' + value + '</span></td></tr>\n';
                            });
                            bookingHTML += '</table>';
    
                            if (!bookingNumber) {
                                buttonHTML += '<button class="booking-button" onclick="showBookingDetails(\'' + bookingNumber + '\', ' + counter + ')"><div style="float: left; width: 33%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: left; border-right: 2px solid #f2f2f2;">' + bookingparty + '<span color: transparent;' + det +'</span></div><div style="display: inline-block; text-align: center; width: 33%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: center;">' + bookingdate + '</div><div style="float: right; width: 33%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: right; border-left: 2px solid #f2f2f2;">' + statusCode + '</div></button><br>';
                            } else {
                                buttonHTML += '<button class="booking-button" onclick="showBookingDetails(\'' + bookingNumber + '\', ' + counter + ')"><div style="float: left; width: 33%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: left; border-right: 2px solid #f2f2f2;">' + bookingparty + '<span color: transparent;' + det +'</span></div><div style="display: inline-block; text-align: center; width: 33%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: center;">' + bookingdate + '</div><div style="float: right; width: 33%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: right; border-left: 2px solid #f2f2f2;">' + bookingNumber + '</div></button><br>';
                            }

                            buttonHTML += '<div id="' + counter + 'bookingDetails_' + bookingNumber + '" style="display: none;">' + bookingHTML + '</div><br>';
                            counter++;
                        }
                    });

                    var botDiv = `<div style="border: 1px solid transparent; padding-top: 10px; padding-left: 2px; padding-right: 2px; padding-bottom: 3px; border-radius: 10px; margin-top: 10px; background-color: #c0c0c0;">`;    
                    botDiv += '<input type="text" id="search-input" style="width: 100%;" placeholder="Global Search...">';
                    var botDiv2 = `<div style="border-left: 1px solid transparent; background-color: #e5e4e2; padding: 4px; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;">`;
                    botDiv2 += '<div id="num" style="font-size: 14px; display: flex; padding: 5px; align-items: left; justify-content: left;"></div>';
                    botDiv2 += '<div><table style="border-collapse: collapse; width: 100%; margin-bottom: 5px;"><thead style="background-color: #002147; color: white;"><tr><th style="border: 1px solid #dddddd; text-align: left; padding: 8px; width: 33.17%;">CONSIGNEE</th><th style="border: 1px solid #dddddd; text-align: center; padding: 8px; width: 33.16%;">JOB DATE</th><th style="border: 1px solid #dddddd; text-align: right; padding: 8px; width: 33.66%;">JOB NO</th></tr></thead></table></div>';
                    botDiv2 +=  '<div id="bot-message-scroll" style="max-height: 250px; overflow-y: auto; overflow-x: hidden;">' + buttonHTML +'</div>';
                    botDiv2 += `</div>`;
                    botDiv += botDiv2;
                    botDiv += `</div>`;
                    botMessageHTML += botDiv;
                    botMessageHTML += '<div style="margin-top: 20px;"><b>If you have any questions or concerns about the results, please verify them using our application or contact our support team.</b></div>';
                }
                 else {
                    bookingSets.forEach(bookingSet => {
                        var cleanedBookingSet = bookingSet.replace(/[\[\]{}"]/g, '');
                
                        if (cleanedBookingSet.trim() !== '') {
                            cleanedBookingSet = cleanedBookingSet.trim();
                
                            var keyValuePairs = cleanedBookingSet.split(',');
                
                            var bookingHTML = '<table class="booking-details">';
                            keyValuePairs.forEach(pair => {
                                var parts = pair.split(':');
                                var key = parts[0].trim();
                                var value = parts.slice(1).join(':').trim();
                
                                bookingHTML += '<tr><td><span class="key">' + key + '</span></td><td><span class="value">' + value + '</span></td></tr>\n';
                            });
                            bookingHTML += '</table><br>';
                            botMessageHTML += bookingHTML;
                        }
                    });
                }
                
                botMessageHTML += '</div></div>';
                chatContainer.innerHTML += botMessageHTML;
                var currentTime = new Date().toLocaleTimeString();
                var botTimeHTML = '<div class="bot-time">'+ 'EZEEBOT , ' + currentTime + '</div>';
                chatContainer.innerHTML += botTimeHTML;
                document.addEventListener('input', function (event) {
                    if (event.target.id === 'search-input') {
                        var searchValue = event.target.value.toLowerCase();
                        var botMessageScroll = document.getElementById('bot-message-scroll');
                        var buttons = botMessageScroll.getElementsByClassName('booking-button');
                        var moduleName = 'shipping bills';

                        filterButtons(searchValue, buttons, moduleName);
                    }
                });
                closeType();
                scrollToBottom();
        
            userInputElement.removeEventListener('keypress', userInputElement._listener);
        })
        .catch(error => {
            console.error('Error:', error);
        });                

    }
    displayPrompt();
}

function askBookingNumbercustomBE(messages) {
    var inputValues = {};
    var currentIndex = 0;
    var userInputElement = document.getElementById('user-input');

    function displayPrompt() {
        var message = messages[currentIndex];
        var botMessageHTML = `<div class="message-container"><div class="bot-avatar"><div id="dp" data-bs-toggle="modal" data-bs-target="#modalPopup">
            <img id="thumbnail" src="https://betatest.ezeeshipping.in/assets/img/EZ_New_LogoAboveText.png" alt="EzeeBot Logo" style="width: 90%; height: 90%; margin-top: 1.2px; margin-left: 0.8px; object-fit: contain; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); clip-path: inset(0 0 8px 0);">
        </div></div><div class="bot-message-chat">`;

        //var botMessageHTML = '<div class="message-container"><div class="bot-avatar" data-bs-toggle="modal" data-bs-target="#modalPopup"><img src="https://betatest.ezeeshipping.in/assets/img/EZ_New_LogoAboveText.png" alt="EzeeBot Logo" style="width: 30px; height: auto;"></div><div class="bot-message">';
        var botMessageHTML2 = '<div class="message-container"><div class="bot-message-time">';

            if (message.toLowerCase() === "be from date") {
                botMessageHTML += 'Please enter the "<b>' + message + '</b>"';
                chatContainer.innerHTML += botMessageHTML;
                var currentTime = new Date().toLocaleTimeString();
                var botTimeHTML = '<div class="bot-time">' + 'EZEEBOT , ' + currentTime + '</div>';
                chatContainer.innerHTML += botTimeHTML;
                var currentDate = new Date();
                currentDate.setMonth(currentDate.getMonth() - 1);

                var year = currentDate.getFullYear();
                var month = String(currentDate.getMonth() + 1).padStart(2, '0');
                var day = String(currentDate.getDate()).padStart(2, '0');
                var hours = String(currentDate.getHours()).padStart(2, '0');
                var minutes = String(currentDate.getMinutes()).padStart(2, '0');
                var defaultDate = year + '-' + month + '-' + day + 'T' + hours + ':' + minutes;

                botMessageHTML2 += '<input type="datetime-local" id="datetime-input" value="' + defaultDate + '">';
                chatContainer.innerHTML += botMessageHTML2;
                setTimeout(function() {
                    var datetimeInput = document.getElementById('datetime-input');
                    datetimeInput.focus();
                }, 0);
                scrollToBottom();
        
                var datetimeInput = document.getElementById('datetime-input');

                userInputElement.style.display = 'none';
        
                datetimeInput.addEventListener('blur', function(event) {
                    var userInput = this.value.trim().split("T")[0];
                    simpleUserMessage(userInput);
        
                    inputValues["customBE" + message.toLowerCase().replace(/\s+/g, '_')] = userInput;

                    var botMessageCheck = document.querySelector('.bot-message-time');
                    if (botMessageCheck) {
                        botMessageCheck.remove();
                    }

                    userInputElement.style.display = 'block';
        
                    currentIndex++;
                    if (currentIndex < messages.length) {
                        displayPrompt();
                    } else {
                        sendAllInputs();
                    }
                });
            } else if (message.toLowerCase() === "be to date") {
                botMessageHTML += 'Please enter the "<b>' + message + '</b>"';
                chatContainer.innerHTML += botMessageHTML;
                var currentTime = new Date().toLocaleTimeString();
                var botTimeHTML = '<div class="bot-time">' + 'EZEEBOT , ' + currentTime + '</div>';
                chatContainer.innerHTML += botTimeHTML;
                var defaultDate = new Date().toISOString().slice(0, 16);
                botMessageHTML2 += '<input type="datetime-local" id="datetime-input" value="' + defaultDate + '">';
                chatContainer.innerHTML += botMessageHTML2;
                setTimeout(function() {
                    var datetimeInput = document.getElementById('datetime-input');
                    datetimeInput.focus();
                }, 0);
                scrollToBottom();
        
                var datetimeInput = document.getElementById('datetime-input');

                userInputElement.style.display = 'none';
        
                datetimeInput.addEventListener('blur', function(event) {
                    var userInput = this.value.trim().split("T")[0];
                    simpleUserMessage(userInput);
        
                    inputValues["customBE" + message.toLowerCase().replace(/\s+/g, '_')] = userInput;

                    var botMessageCheck = document.querySelector('.bot-message-time');
                    if (botMessageCheck) {
                        botMessageCheck.remove();
                    }

                    userInputElement.style.display = 'block';
        
                    currentIndex++;
                    if (currentIndex < messages.length) {
                        displayPrompt();
                    } else {
                        sendAllInputs();
                    }
                });
            } else {
            botMessageHTML += 'Please type in the "<b>' + message + '</b>"';
            chatContainer.innerHTML += botMessageHTML;
            var currentTime = new Date().toLocaleTimeString();
            var botTimeHTML = '<div class="bot-time">' + 'EZEEBOT , ' + currentTime + '</div>';
            chatContainer.innerHTML += botTimeHTML;
            scrollToBottom();
    
            userInputElement.focus();
    
            if (userInputElement._listener) {
                userInputElement.removeEventListener('keypress', userInputElement._listener);
            }
    
            userInputElement._listener = function (event) {
                if (event.key === 'Enter') {
                    event.preventDefault();
                    var userInput = this.value.trim();
                    simpleUserMessage(userInput);
    
                    inputValues["customBE" + message.toLowerCase().replace(/\s+/g, '_')] = userInput;
    
                    this.value = '';
    
                    currentIndex++;
                    if (currentIndex < messages.length) {
                        displayPrompt();
                    } else {
                        sendAllInputs();
                    }
                }
            };
    
            userInputElement.addEventListener('keypress', userInputElement._listener);
        }
    }

    function sendAllInputs() {
        typingMessage();
        fetch('/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_input: {
                    ...inputValues,
                    'current_date': formattedDate,
                    'tenantid': tenantid,
                    'officeid': officeid,
                    'userid': userid,
                    'userid2': userid2,
                    'environment': environment,
                    'userid2': userid2,
                    'chaid': chaid
                }
            }),
        })
        .then(response => response.json())
        .then(data => {
            var inputSummary = '<b>[ </b>' + Object.keys(inputValues).map(function(key, index, array) {
                var displayKey = key.replace(/^customBE/, '').replace(/_/g, ' ');
                var comma = (index !== array.length - 1) ? ', ' : '';
                return '<b>' + displayKey + ':</b> ' + inputValues[key] + comma;
            }).join('') + '<b> ]</b>';   
            
            var botMessageHTML = `<div class="message-container"><div class="bot-avatar"><div id="dp" data-bs-toggle="modal" data-bs-target="#modalPopup">
                <img id="thumbnail" src="https://betatest.ezeeshipping.in/assets/img/EZ_New_LogoAboveText.png" alt="EzeeBot Logo" style="width: 90%; height: 90%; margin-top: 1.2px; margin-left: 0.8px; object-fit: contain; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); clip-path: inset(0 0 8px 0);">
            </div></div><div class="bot-message-booking"><b>Bill of entry search result based on your criteria </b>${formatKeyValueList(inputSummary)}`;
            
            //var botMessageHTML = '<div class="message-container"><div class="bot-avatar" data-bs-toggle="modal" data-bs-target="#modalPopup"><img src="https://betatest.ezeeshipping.in/assets/img/EZ_New_LogoAboveText.png" alt="EzeeBot Logo" style="width: 30px; height: auto;"></div><div class="bot-message-booking"><b>Bill of entry search result based on your criteria <br><br></b>' + '<span style="font-size:14px;">' + formatKeyValueList(inputSummary) + '</span><br><br>';

                var bookingSets = data.response.split('},');

                if (bookingSets.length > 1) {
                    botMessageHTML += '<b>Multiple entries found. Please pick one to view more details</b><br><br>';
                    var counter = 1;
                    var buttonHTML = '';
                
                    bookingSets.forEach((bookingSet, index) => {
                        var cleanedBookingSet = bookingSet.replace(/[\[\]{}"]/g, '');
                
                        if (cleanedBookingSet.trim() !== '') {
                            cleanedBookingSet = cleanedBookingSet.trim();
                
                            var keyValuePairs = cleanedBookingSet.split(',');
                
                            var bookingNumber = '';
                            var statusCode = '';
                            var det = '';
                            var bookingHTML = '<table class="booking-details">';
                            keyValuePairs.forEach(pair => {
                                var parts = pair.split(':');
                                var key = parts[0].trim();
                                var value = parts.slice(1).join(':').trim();
                
                                if (key.toUpperCase() === 'JOB NUMBER') {
                                    if (value === 'null') {
                                        bookingNumber = null;
                                    } else {
                                        bookingNumber = value;
                                    }
                                } else if (key.toUpperCase() === 'STATUS' && !bookingNumber) {
                                    statusCode = value;
                                } else if (key.toUpperCase() === 'JOB DATE') {
                                    bookingdate = value;
                                } else if (key.toUpperCase() === 'SHIPPER') {
                                    bookingparty = value;
                                }
                                
                                det += value + ',';
                                bookingHTML += '<tr><td><span class="key">' + key + '</span></td><td><span class="value">' + value + '</span></td></tr>\n';
                            });
                            bookingHTML += '</table>';
    
                            if (!bookingNumber) {
                                buttonHTML += '<button class="booking-button" onclick="showBookingDetails(\'' + bookingNumber + '\', ' + counter + ')"><div style="float: left; width: 33%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: left; border-right: 2px solid #f2f2f2;">' + bookingparty + '<span color: transparent;' + det +'</span></div><div style="display: inline-block; text-align: center; width: 33%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: center;">' + bookingdate + '</div><div style="float: right; width: 33%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: right; border-left: 2px solid #f2f2f2;">' + statusCode + '</div></button><br>';
                            } else {
                                buttonHTML += '<button class="booking-button" onclick="showBookingDetails(\'' + bookingNumber + '\', ' + counter + ')"><div style="float: left; width: 33%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: left; border-right: 2px solid #f2f2f2;">' + bookingparty + '<span color: transparent;' + det +'</span></div><div style="display: inline-block; text-align: center; width: 33%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: center;">' + bookingdate + '</div><div style="float: right; width: 33%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: right; border-left: 2px solid #f2f2f2;">' + bookingNumber + '</div></button><br>';
                            }

                            buttonHTML += '<div id="' + counter + 'bookingDetails_' + bookingNumber + '" style="display: none;">' + bookingHTML + '</div><br>';
                            counter++;
                        }
                    });

                    var botDiv = `<div style="border: 1px solid transparent; padding-top: 10px; padding-left: 2px; padding-right: 2px; padding-bottom: 3px; border-radius: 10px; margin-top: 10px; background-color: #c0c0c0;">`;    
                    botDiv += '<input type="text" id="search-input" style="width: 100%;" placeholder="Global Search...">';
                    var botDiv2 = `<div style="border-left: 1px solid transparent; background-color: #e5e4e2; padding: 4px; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;">`;
                    botDiv2 += '<div id="num" style="font-size: 14px; display: flex; padding: 5px; align-items: left; justify-content: left;"></div>';
                    botDiv2 += '<div><table style="border-collapse: collapse; width: 100%; margin-bottom: 5px;"><thead style="background-color: #002147; color: white;"><tr><th style="border: 1px solid #dddddd; text-align: left; padding: 8px; width: 33.17%;">SHIPPER</th><th style="border: 1px solid #dddddd; text-align: center; padding: 8px; width: 33.16%;">JOB DATE</th><th style="border: 1px solid #dddddd; text-align: right; padding: 8px; width: 33.66%;">JOB NO</th></tr></thead></table></div>';
                    botDiv2 +=  '<div id="bot-message-scroll" style="max-height: 250px; overflow-y: auto; overflow-x: hidden;">' + buttonHTML +'</div>';
                    botDiv2 += `</div>`;
                    botDiv += botDiv2;
                    botDiv += `</div>`;
                    botMessageHTML += botDiv;
                    botMessageHTML += '<div style="margin-top: 20px;"><b>If you have any questions or concerns about the results, please verify them using our application or contact our support team.</b></div>';
                }
                 else {
                    bookingSets.forEach(bookingSet => {
                        var cleanedBookingSet = bookingSet.replace(/[\[\]{}"]/g, '');
                
                        if (cleanedBookingSet.trim() !== '') {
                            cleanedBookingSet = cleanedBookingSet.trim();
                
                            var keyValuePairs = cleanedBookingSet.split(',');
                
                            var bookingHTML = '<table class="booking-details">';
                            keyValuePairs.forEach(pair => {
                                var parts = pair.split(':');
                                var key = parts[0].trim();
                                var value = parts.slice(1).join(':').trim();
                
                                bookingHTML += '<tr><td><span class="key">' + key + '</span></td><td><span class="value">' + value + '</span></td></tr>\n';
                            });
                            bookingHTML += '</table><br>';
                            botMessageHTML += bookingHTML;
                        }
                    });
                }
                
                botMessageHTML += '</div></div>';
                chatContainer.innerHTML += botMessageHTML;
                var currentTime = new Date().toLocaleTimeString();
                var botTimeHTML = '<div class="bot-time">'+ 'EZEEBOT , ' + currentTime + '</div>';
                chatContainer.innerHTML += botTimeHTML;
                document.addEventListener('input', function (event) {
                    if (event.target.id === 'search-input') {
                        var searchValue = event.target.value.toLowerCase();
                        var botMessageScroll = document.getElementById('bot-message-scroll');
                        var buttons = botMessageScroll.getElementsByClassName('booking-button');
                        var moduleName = 'bill of entries';

                        filterButtons(searchValue, buttons);
                    }
                });
                closeType();
                scrollToBottom();
        
            userInputElement.removeEventListener('keypress', userInputElement._listener);
        })
        .catch(error => {
            console.error('Error:', error);
        });                

    }
    displayPrompt();
}

function askBookingNumberbuying(messages) {
    var inputValues = {};
    var currentIndex = 0;
    var userInputElement = document.getElementById('user-input');

    function displayPrompt() {
        var message = messages[currentIndex];
        var botMessageHTML = `<div class="message-container"><div class="bot-avatar"><div id="dp" data-bs-toggle="modal" data-bs-target="#modalPopup">
            <img id="thumbnail" src="https://betatest.ezeeshipping.in/assets/img/EZ_New_LogoAboveText.png" alt="EzeeBot Logo" style="width: 90%; height: 90%; margin-top: 1.2px; margin-left: 0.8px; object-fit: contain; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); clip-path: inset(0 0 8px 0);">
        </div></div><div class="bot-message-chat">`;

        //var botMessageHTML = '<div class="message-container"><div class="bot-avatar" data-bs-toggle="modal" data-bs-target="#modalPopup"><img src="https://betatest.ezeeshipping.in/assets/img/EZ_New_LogoAboveText.png" alt="EzeeBot Logo" style="width: 30px; height: auto;"></div><div class="bot-message">';
        var botMessageHTML2 = '<div class="message-container"><div class="bot-message-time">';

            if (message.toLowerCase() === "from date") {
                botMessageHTML += 'Please enter the "<b>' + message + '</b>"';
                chatContainer.innerHTML += botMessageHTML;
                var currentTime = new Date().toLocaleTimeString();
                var botTimeHTML = '<div class="bot-time">' + 'EZEEBOT , ' + currentTime + '</div>';
                chatContainer.innerHTML += botTimeHTML;
                var currentDate = new Date();
                currentDate.setMonth(currentDate.getMonth() - 1);

                var year = currentDate.getFullYear();
                var month = String(currentDate.getMonth() + 1).padStart(2, '0');
                var day = String(currentDate.getDate()).padStart(2, '0');
                var hours = String(currentDate.getHours()).padStart(2, '0');
                var minutes = String(currentDate.getMinutes()).padStart(2, '0');
                var defaultDate = year + '-' + month + '-' + day + 'T' + hours + ':' + minutes;

                botMessageHTML2 += '<input type="datetime-local" id="datetime-input" value="' + defaultDate + '">';
                chatContainer.innerHTML += botMessageHTML2;
                setTimeout(function() {
                    var datetimeInput = document.getElementById('datetime-input');
                    datetimeInput.focus();
                }, 0);
                scrollToBottom();
        
                var datetimeInput = document.getElementById('datetime-input');

                userInputElement.style.display = 'none';
        
                datetimeInput.addEventListener('blur', function(event) {
                    var userInput = this.value.trim().split("T")[0];
                    simpleUserMessage(userInput);
        
                    inputValues["buy" + message.toLowerCase().replace(/\s+/g, '_')] = userInput;

                    var botMessageCheck = document.querySelector('.bot-message-time');
                    if (botMessageCheck) {
                        botMessageCheck.remove();
                    }

                    userInputElement.style.display = 'block';
        
                    currentIndex++;
                    if (currentIndex < messages.length) {
                        displayPrompt();
                    } else {
                        sendAllInputs();
                    }
                });
            } else if (message.toLowerCase() === "to date") {
                botMessageHTML += 'Please enter the "<b>' + message + '</b>"';
                chatContainer.innerHTML += botMessageHTML;
                var currentTime = new Date().toLocaleTimeString();
                var botTimeHTML = '<div class="bot-time">' + 'EZEEBOT , ' + currentTime + '</div>';
                chatContainer.innerHTML += botTimeHTML;
                var defaultDate = new Date().toISOString().slice(0, 16);
                botMessageHTML2 += '<input type="datetime-local" id="datetime-input" value="' + defaultDate + '">';
                chatContainer.innerHTML += botMessageHTML2;
                setTimeout(function() {
                    var datetimeInput = document.getElementById('datetime-input');
                    datetimeInput.focus();
                }, 0);
                scrollToBottom();
        
                var datetimeInput = document.getElementById('datetime-input');

                userInputElement.style.display = 'none';
        
                datetimeInput.addEventListener('blur', function(event) {
                    var userInput = this.value.trim().split("T")[0];
                    simpleUserMessage(userInput);
        
                    inputValues["buy" + message.toLowerCase().replace(/\s+/g, '_')] = userInput;

                    var botMessageCheck = document.querySelector('.bot-message-time');
                    if (botMessageCheck) {
                        botMessageCheck.remove();
                    }

                    userInputElement.style.display = 'block';
        
                    currentIndex++;
                    if (currentIndex < messages.length) {
                        displayPrompt();
                    } else {
                        sendAllInputs();
                    }
                });
            } else {
            botMessageHTML += 'Please type in the "<b>' + message + '</b>"';
            chatContainer.innerHTML += botMessageHTML;
            var currentTime = new Date().toLocaleTimeString();
            var botTimeHTML = '<div class="bot-time">' + 'EZEEBOT , ' + currentTime + '</div>';
            chatContainer.innerHTML += botTimeHTML;
            scrollToBottom();
    
            userInputElement.focus();
    
            if (userInputElement._listener) {
                userInputElement.removeEventListener('keypress', userInputElement._listener);
            }
    
            userInputElement._listener = function (event) {
                if (event.key === 'Enter') {
                    event.preventDefault();
                    var userInput = this.value.trim();
                    simpleUserMessage(userInput);
    
                    inputValues["buy" + message.toLowerCase().replace(/\s+/g, '_')] = userInput;
    
                    this.value = '';
    
                    currentIndex++;
                    if (currentIndex < messages.length) {
                        displayPrompt();
                    } else {
                        sendAllInputs();
                    }
                }
            };
    
            userInputElement.addEventListener('keypress', userInputElement._listener);
        }
    }

    function sendAllInputs() {
        typingMessage();
        fetch('/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_input: {
                    ...inputValues,
                    'current_date': formattedDate,
                    'tenantid': tenantid,
                    'officeid': officeid,
                    'userid': userid,
                    'userid2': userid2,
                    'environment': environment,
                }
            }),
        })
        .then(response => response.json())
        .then(data => {
            var inputSummary = '<b>[ </b>' + Object.keys(inputValues).map(function(key, index, array) {
                var displayKey = key.replace(/^buy/, '').replace(/_/g, ' ');
                var comma = (index !== array.length - 1) ? ', ' : '';
                return '<b>' + displayKey + ':</b> ' + inputValues[key] + comma;
            }).join('') + '<b> ]</b>';  
            
            var botMessageHTML = `<div class="message-container"><div class="bot-avatar"><div id="dp" data-bs-toggle="modal" data-bs-target="#modalPopup">
                <img id="thumbnail" src="https://betatest.ezeeshipping.in/assets/img/EZ_New_LogoAboveText.png" alt="EzeeBot Logo" style="width: 90%; height: 90%; margin-top: 1.2px; margin-left: 0.8px; object-fit: contain; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); clip-path: inset(0 0 8px 0);">
            </div></div><div class="bot-message-booking"><b>Selling search result based on your criteria </b>${formatKeyValueList(inputSummary)}`;
            
            //var botMessageHTML = '<div class="message-container"><div class="bot-avatar" data-bs-toggle="modal" data-bs-target="#modalPopup"><img src="https://betatest.ezeeshipping.in/assets/img/EZ_New_LogoAboveText.png" alt="EzeeBot Logo" style="width: 30px; height: auto;"></div><div class="bot-message-booking"><b>Selling search result based on your criteria <br><br></b>' + '<span style="font-size:14px;">' + formatKeyValueList(inputSummary) + '</span><br><br>';

                var bookingSets = data.response.split('},');

                if (bookingSets.length > 1) {
                    botMessageHTML += '<b>Multiple entries found. Please pick one to view more details</b><br><br>';
                    var counter = 1;
                    var buttonHTML = '';
                
                    bookingSets.forEach((bookingSet, index) => {
                        var cleanedBookingSet = bookingSet.replace(/[\[\]{}"]/g, '');
                
                        if (cleanedBookingSet.trim() !== '') {
                            cleanedBookingSet = cleanedBookingSet.trim();
                
                            var keyValuePairs = cleanedBookingSet.split(',');
                
                            var bookingNumber = '';
                            var statusCode = '';
                            var det = '';
                            var bookingHTML = '<table class="booking-details">';
                            keyValuePairs.forEach(pair => {
                                var parts = pair.split(':');
                                var key = parts[0].trim();
                                var value = parts.slice(1).join(':').trim();
                
                                if (key.toUpperCase() === 'BILL NUMBER') {
                                    if (value === 'null') {
                                        bookingNumber = null;
                                    } else {
                                        bookingNumber = value;
                                    }
                                } else if (key.toUpperCase() === 'BILL STATUS' && !bookingNumber) {
                                    statusCode = value;
                                } else if (key.toUpperCase() === 'BILL DATE' ) {
                                    billdate = value;
                                } else if (key.toUpperCase() === 'BILL TO' ) {
                                    billto = value;
                                }

                                det += value + ' ';
                
                                bookingHTML += '<tr><td><span class="key">' + key + '</span></td><td><span class="value">' + value + '</span></td></tr>\n';
                            });
                            bookingHTML += '</table>';

                            if (!bookingNumber) {
                                buttonHTML += '<button class="booking-button" onclick="showBookingDetails(\'' + bookingNumber + '\', ' + counter + ')"><div style="float: left; width: 33%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: left; border-right: 2px solid #f2f2f2;">' + billto + '<span color: transparent;' + det +'</span></div><div style="display: inline-block; text-align: center; width: 33%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: center;">' + billdate + '</div><div style="float: right; width: 33%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: right; border-left: 2px solid #f2f2f2;">' + statusCode + '</div></button><br>';
                            } else {
                                buttonHTML += '<button class="booking-button" onclick="showBookingDetails(\'' + bookingNumber + '\', ' + counter + ')"><div style="float: left; width: 33%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: left; border-right: 2px solid #f2f2f2;">' + billto + '<span color: transparent;' + det +'</span></div><div style="display: inline-block; text-align: center; width: 33%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: center;">' + billdate + '</div><div style="float: right; width: 33%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: right; border-left: 2px solid #f2f2f2;">' + bookingNumber + '</div></button><br>';
                            }

                            buttonHTML += '<div id="'+ counter +'bookingDetails_' + bookingNumber + '" style="display: none;">' + bookingHTML + '</div><br>';
                            counter++;
                        }
                    });

                    var botDiv = `<div style="border: 1px solid transparent; padding-top: 10px; padding-left: 2px; padding-right: 2px; padding-bottom: 3px; border-radius: 10px; margin-top: 10px; background-color: #c0c0c0;">`;    
                    botDiv += '<input type="text" id="search-input" style="width: 100%;" placeholder="Global Search...">';
                    var botDiv2 = `<div style="border-left: 1px solid transparent; background-color: #e5e4e2; padding: 4px; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;">`;
                    botDiv2 += '<div id="num" style="font-size: 14px; display: flex; padding: 5px; align-items: left; justify-content: left;"></div>';
                    botDiv2 += '<div><table style="border-collapse: collapse; width: 100%; margin-bottom: 5px;"><thead style="background-color: #002147; color: white;"><tr><th style="border: 1px solid #dddddd; text-align: left; padding: 8px; width: 33.17%;">BILL TO</th><th style="border: 1px solid #dddddd; text-align: center; padding: 8px; width: 33.16%;">BILL DATE</th><th style="border: 1px solid #dddddd; text-align: right; padding: 8px; width: 33.66%;">BILL NO</th></tr></thead></table></div>';
                    botDiv2 +=  '<div id="bot-message-scroll" style="max-height: 250px; overflow-y: auto; overflow-x: hidden;">' + buttonHTML +'</div>';
                    botDiv2 += `</div>`;
                    botDiv += botDiv2;
                    botDiv += `</div>`;
                    botMessageHTML += botDiv;
                    botMessageHTML += '<div style="margin-top: 20px;"><b>If you have any questions or concerns about the results, please verify them using our application or contact our support team.</b></div>';
                }
                 else {
                    bookingSets.forEach(bookingSet => {
                        var cleanedBookingSet = bookingSet.replace(/[\[\]{}"]/g, '');
                
                        if (cleanedBookingSet.trim() !== '') {
                            cleanedBookingSet = cleanedBookingSet.trim();
                
                            var keyValuePairs = cleanedBookingSet.split(',');
                
                            var bookingHTML = '<table class="booking-details">';
                            keyValuePairs.forEach(pair => {
                                var parts = pair.split(':');
                                var key = parts[0].trim();
                                var value = parts.slice(1).join(':').trim();
                
                                bookingHTML += '<tr><td><span class="key">' + key + '</span></td><td><span class="value">' + value + '</span></td></tr>\n';
                            });
                            bookingHTML += '</table><br>';
                            botMessageHTML += bookingHTML;
                        }
                    });
                }
                
                botMessageHTML += '</div></div>';
                chatContainer.innerHTML += botMessageHTML;
                var currentTime = new Date().toLocaleTimeString();
                var botTimeHTML = '<div class="bot-time">'+ 'EZEEBOT , ' + currentTime + '</div>';
                chatContainer.innerHTML += botTimeHTML;
                document.addEventListener('input', function (event) {
                    if (event.target.id === 'search-input') {
                        var searchValue = event.target.value.toLowerCase();
                        var botMessageScroll = document.getElementById('bot-message-scroll');
                        var buttons = botMessageScroll.getElementsByClassName('booking-button');
                        var moduleName = 'sellings';

                        filterButtons(searchValue, buttons, moduleName, moduleName);
                    }
                });
                closeType();
                scrollToBottom();
        
            userInputElement.removeEventListener('keypress', userInputElement._listener);
        })
        .catch(error => {
            console.error('Error:', error);
        });                

    }
    displayPrompt();
}

function askBookingNumberpay(messages) {
    var inputValues = {};
    var currentIndex = 0;
    var userInputElement = document.getElementById('user-input');

    function displayPrompt() {
        var message = messages[currentIndex];

        var botMessageHTML = `<div class="message-container"><div class="bot-avatar"><div id="dp" data-bs-toggle="modal" data-bs-target="#modalPopup">
            <img id="thumbnail" src="https://betatest.ezeeshipping.in/assets/img/EZ_New_LogoAboveText.png" alt="EzeeBot Logo" style="width: 90%; height: 90%; margin-top: 1.2px; margin-left: 0.8px; object-fit: contain; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); clip-path: inset(0 0 8px 0);">
        </div></div><div class="bot-message-chat">`;

        //var botMessageHTML = '<div class="message-container"><div class="bot-avatar" data-bs-toggle="modal" data-bs-target="#modalPopup"><img src="https://betatest.ezeeshipping.in/assets/img/EZ_New_LogoAboveText.png" alt="EzeeBot Logo" style="width: 30px; height: auto;"></div><div class="bot-message">';
        var botMessageHTML2 = '<div class="message-container"><div class="bot-message-time">';

            if (message.toLowerCase() === "from date") {
                botMessageHTML += 'Please enter the "<b>' + message + '</b>"';
                chatContainer.innerHTML += botMessageHTML;
                var currentTime = new Date().toLocaleTimeString();
                var botTimeHTML = '<div class="bot-time">' + 'EZEEBOT , ' + currentTime + '</div>';
                chatContainer.innerHTML += botTimeHTML;
                var currentDate = new Date();
                currentDate.setMonth(currentDate.getMonth() - 1);

                var year = currentDate.getFullYear();
                var month = String(currentDate.getMonth() + 1).padStart(2, '0');
                var day = String(currentDate.getDate()).padStart(2, '0');
                var hours = String(currentDate.getHours()).padStart(2, '0');
                var minutes = String(currentDate.getMinutes()).padStart(2, '0');
                var defaultDate = year + '-' + month + '-' + day + 'T' + hours + ':' + minutes;

                botMessageHTML2 += '<input type="datetime-local" id="datetime-input" value="' + defaultDate + '">';
                chatContainer.innerHTML += botMessageHTML2;
                setTimeout(function() {
                    var datetimeInput = document.getElementById('datetime-input');
                    datetimeInput.focus();
                }, 0);
                scrollToBottom();
        
                var datetimeInput = document.getElementById('datetime-input');

                userInputElement.style.display = 'none';
        
                datetimeInput.addEventListener('blur', function(event) {
                    var userInput = this.value.trim().split("T")[0];
                    simpleUserMessage(userInput);
        
                    inputValues["pay" + message.toLowerCase().replace(/\s+/g, '_')] = userInput;

                    var botMessageCheck = document.querySelector('.bot-message-time');
                    if (botMessageCheck) {
                        botMessageCheck.remove();
                    }

                    userInputElement.style.display = 'block';
        
                    currentIndex++;
                    if (currentIndex < messages.length) {
                        displayPrompt();
                    } else {
                        sendAllInputs();
                    }
                });
            } else if (message.toLowerCase() === "to date") {
                botMessageHTML += 'Please enter the "<b>' + message + '</b>"';
                chatContainer.innerHTML += botMessageHTML;
                var currentTime = new Date().toLocaleTimeString();
                var botTimeHTML = '<div class="bot-time">' + 'EZEEBOT , ' + currentTime + '</div>';
                chatContainer.innerHTML += botTimeHTML;
                var defaultDate = new Date().toISOString().slice(0, 16);
                botMessageHTML2 += '<input type="datetime-local" id="datetime-input" value="' + defaultDate + '">';
                chatContainer.innerHTML += botMessageHTML2;
                setTimeout(function() {
                    var datetimeInput = document.getElementById('datetime-input');
                    datetimeInput.focus();
                }, 0);
                scrollToBottom();
        
                var datetimeInput = document.getElementById('datetime-input');

                userInputElement.style.display = 'none';
        
                datetimeInput.addEventListener('blur', function(event) {
                    var userInput = this.value.trim().split("T")[0];
                    simpleUserMessage(userInput);
        
                    inputValues["pay" + message.toLowerCase().replace(/\s+/g, '_')] = userInput;

                    var botMessageCheck = document.querySelector('.bot-message-time');
                    if (botMessageCheck) {
                        botMessageCheck.remove();
                    }

                    userInputElement.style.display = 'block';
        
                    currentIndex++;
                    if (currentIndex < messages.length) {
                        displayPrompt();
                    } else {
                        sendAllInputs();
                    }
                });
            } else {
            botMessageHTML += 'Please type in the "<b>' + message + '</b>"';
            chatContainer.innerHTML += botMessageHTML;
            var currentTime = new Date().toLocaleTimeString();
            var botTimeHTML = '<div class="bot-time">' + 'EZEEBOT , ' + currentTime + '</div>';
            chatContainer.innerHTML += botTimeHTML;
            scrollToBottom();
    
            userInputElement.focus();
    
            if (userInputElement._listener) {
                userInputElement.removeEventListener('keypress', userInputElement._listener);
            }
    
            userInputElement._listener = function (event) {
                if (event.key === 'Enter') {
                    event.preventDefault();
                    var userInput = this.value.trim();
                    simpleUserMessage(userInput);
    
                    inputValues["pay" + message.toLowerCase().replace(/\s+/g, '_')] = userInput;
    
                    this.value = '';
    
                    currentIndex++;
                    if (currentIndex < messages.length) {
                        displayPrompt();
                    } else {
                        sendAllInputs();
                    }
                }
            };
    
            userInputElement.addEventListener('keypress', userInputElement._listener);
        }
    }

    function sendAllInputs() {
        typingMessage();
        fetch('/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_input: {
                    ...inputValues,
                    'current_date': formattedDate,
                    'tenantid': tenantid,
                    'officeid': officeid,
                    'userid': userid,
                    'userid2': userid2,
                    'environment': environment,
                }
            }),
        })
        .then(response => response.json())
        .then(data => {
            var inputSummary = '<b>[ </b>' + Object.keys(inputValues).map(function(key, index, array) {
                var displayKey = key.replace(/^pay/, '').replace(/_/g, ' ');
                var comma = (index !== array.length - 1) ? ', ' : '';
                return '<b>' + displayKey + ':</b> ' + inputValues[key] + comma;
            }).join('') + '<b> ]</b>';   
            
            var botMessageHTML = `<div class="message-container"><div class="bot-avatar"><div id="dp" data-bs-toggle="modal" data-bs-target="#modalPopup">
                <img id="thumbnail" src="https://betatest.ezeeshipping.in/assets/img/EZ_New_LogoAboveText.png" alt="EzeeBot Logo" style="width: 90%; height: 90%; margin-top: 1.2px; margin-left: 0.8px; object-fit: contain; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); clip-path: inset(0 0 8px 0);">
            </div></div><div class="bot-message-booking"><b>Payments search result based on your criteria </b>${formatKeyValueList(inputSummary)}`;
            
            //var botMessageHTML = '<div class="message-container"><div class="bot-avatar" data-bs-toggle="modal" data-bs-target="#modalPopup"><img src="https://betatest.ezeeshipping.in/assets/img/EZ_New_LogoAboveText.png" alt="EzeeBot Logo" style="width: 30px; height: auto;"></div><div class="bot-message-booking"><b>Payments search result based on your criteria <br><br></b>' + '<span style="font-size:14px;">' + formatKeyValueList(inputSummary) + '</span><br><br>';

                var bookingSets = data.response.split('},');

                if (bookingSets.length > 1) {
                    botMessageHTML += '<b>Multiple entries found. Please pick one to view more details</b><br><br>';
                    var counter = 1;
                    var buttonHTML = '';
                
                    bookingSets.forEach((bookingSet, index) => {
                        var cleanedBookingSet = bookingSet.replace(/[\[\]{}"]/g, '');
                
                        if (cleanedBookingSet.trim() !== '') {
                            cleanedBookingSet = cleanedBookingSet.trim();
                
                            var keyValuePairs = cleanedBookingSet.split(',');
                
                            var bookingNumber = '';
                            var statusCode = '';
                            var det = '';
                            var bookingHTML = '<table class="booking-details">';
                            keyValuePairs.forEach(pair => {
                                var parts = pair.split(':');
                                var key = parts[0].trim();
                                var value = parts.slice(1).join(':').trim();
                
                                if (key.toUpperCase() === 'PAYMENT NUMBER') {
                                    if (value === 'null') {
                                        bookingNumber = null;
                                    } else {
                                        bookingNumber = value;
                                    }
                                } else if (key.toUpperCase() === 'CHEQUE NUMBER' && !bookingNumber) {
                                    statusCode = value;
                                } else if (key.toUpperCase() === 'PAYMENT DATE' ) {
                                    billdate = value;
                                } else if (key.toUpperCase() === 'PAYMENT TO' ) {
                                    billto = value;
                                } else if (key.toUpperCase() === 'PAYMENT MODE' ) {
                                    det += value;
                                } else if (key.toUpperCase() === 'CHEQUE NUMBER' ) {
                                    det += value;
                                } else if (key.toUpperCase() === 'CHEQUE DATE' ) {
                                    det += value;
                                } else if (key.toUpperCase() === 'UTR NUMBER' ) {
                                    det += value;
                                } else if (key.toUpperCase() === 'UTR DATE' ) {
                                    det += value;
                                } else if (key.toUpperCase() === 'REMARK' ) {
                                    det += value;
                                } else if (key.toUpperCase() === 'TOTAL AMOUNT' ) {
                                    det += value;
                                } else if (key.toUpperCase() === 'UNADJUSTED AMOUNT' ) {
                                    det += value;
                                } else if (key.toUpperCase() === 'CREATED BY' ) {
                                    det += value;
                                } else if (key.toUpperCase() === 'CREATED DATE' ) {
                                    det += value;
                                } else if (key.toUpperCase() === 'CONFIRMED BY' ) {
                                    det += value;
                                } else if (key.toUpperCase() === 'CONFIRMED DATE' ) {
                                    det += value;
                                }
                
                                bookingHTML += '<tr><td><span class="key">' + key + '</span></td><td><span class="value">' + value + '</span></td></tr>\n';
                            });
                            bookingHTML += '</table>';

                            if (!bookingNumber) {
                                buttonHTML += '<button class="booking-button" onclick="showBookingDetails(\'' + bookingNumber + '\', ' + counter + ')"><div style="float: left; width: 33%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: left; border-right: 2px solid #f2f2f2;">' + billto + '<span color: transparent;' + det +'</span></div><div style="display: inline-block; text-align: center; width: 33%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: center;">' + billdate + '</div><div style="float: right; width: 33%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: right; border-left: 2px solid #f2f2f2;">' + statusCode + '</div></button><br>';
                            } else {
                                buttonHTML += '<button class="booking-button" onclick="showBookingDetails(\'' + bookingNumber + '\', ' + counter + ')"><div style="float: left; width: 33%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: left; border-right: 2px solid #f2f2f2;">' + billto + '<span color: transparent;' + det +'</span></div><div style="display: inline-block; text-align: center; width: 33%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: center;">' + billdate + '</div><div style="float: right; width: 33%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: right; border-left: 2px solid #f2f2f2;">' + bookingNumber + '</div></button><br>';
                            }

                            buttonHTML += '<div id="'+ counter +'bookingDetails_' + bookingNumber + '" style="display: none;">' + bookingHTML + '</div><br>';
                            counter++;
                        }
                    });

                    var botDiv = `<div style="border: 1px solid transparent; padding-top: 10px; padding-left: 2px; padding-right: 2px; padding-bottom: 3px; border-radius: 10px; margin-top: 10px; background-color: #c0c0c0;">`;    
                    botDiv += '<input type="text" id="search-input" style="width: 100%;" placeholder="Global Search...">';
                    var botDiv2 = `<div style="border-left: 1px solid transparent; background-color: #e5e4e2; padding: 4px; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;">`;
                    botDiv2 += '<div id="num" style="font-size: 14px; display: flex; padding: 5px; align-items: left; justify-content: left;"></div>';
                    botDiv2 += '<div><table style="border-collapse: collapse; width: 100%; margin-bottom: 5px;"><thead style="background-color: #002147; color: white;"><tr><th style="border: 1px solid #dddddd; text-align: left; padding: 8px; width: 33.17%;">PAYMENT TO</th><th style="border: 1px solid #dddddd; text-align: center; padding: 8px; width: 33.16%;">PAYMENT DATE</th><th style="border: 1px solid #dddddd; text-align: right; padding: 8px; width: 33.66%;">PAYMENT NO</th></tr></thead></table></div>';
                    botDiv2 +=  '<div id="bot-message-scroll" style="max-height: 250px; overflow-y: auto; overflow-x: hidden;">' + buttonHTML +'</div>';
                    botDiv2 += `</div>`;
                    botDiv += botDiv2;
                    botDiv += `</div>`;
                    botMessageHTML += botDiv;
                    botMessageHTML += '<div style="margin-top: 20px;"><b>If you have any questions or concerns about the results, please verify them using our application or contact our support team.</b></div>';
                }
                 else {
                    bookingSets.forEach(bookingSet => {
                        var cleanedBookingSet = bookingSet.replace(/[\[\]{}"]/g, '');
                
                        if (cleanedBookingSet.trim() !== '') {
                            cleanedBookingSet = cleanedBookingSet.trim();
                
                            var keyValuePairs = cleanedBookingSet.split(',');
                
                            var bookingHTML = '<table class="booking-details">';
                            keyValuePairs.forEach(pair => {
                                var parts = pair.split(':');
                                var key = parts[0].trim();
                                var value = parts.slice(1).join(':').trim();
                
                                bookingHTML += '<tr><td><span class="key">' + key + '</span></td><td><span class="value">' + value + '</span></td></tr>\n';
                            });
                            bookingHTML += '</table><br>';
                            botMessageHTML += bookingHTML;
                        }
                    });
                }
                
                botMessageHTML += '</div></div>';
                chatContainer.innerHTML += botMessageHTML;
                var currentTime = new Date().toLocaleTimeString();
                var botTimeHTML = '<div class="bot-time">'+ 'EZEEBOT , ' + currentTime + '</div>';
                chatContainer.innerHTML += botTimeHTML;
                document.addEventListener('input', function (event) {
                    if (event.target.id === 'search-input') {
                        var searchValue = event.target.value.toLowerCase();
                        var botMessageScroll = document.getElementById('bot-message-scroll');
                        var buttons = botMessageScroll.getElementsByClassName('booking-button');
                        var moduleName = 'payments';

                        filterButtons(searchValue, buttons, moduleName);
                    }
                });
                closeType();
                scrollToBottom();
        
            userInputElement.removeEventListener('keypress', userInputElement._listener);
        })
        .catch(error => {
            console.error('Error:', error);
        });                

    }
    displayPrompt();
}

function askBookingNumberreceipts(messages) {
    var inputValues = {};
    var currentIndex = 0;
    var userInputElement = document.getElementById('user-input');

    function displayPrompt() {
        var message = messages[currentIndex];
        var botMessageHTML = `<div class="message-container"><div class="bot-avatar"><div id="dp" data-bs-toggle="modal" data-bs-target="#modalPopup">
            <img id="thumbnail" src="https://betatest.ezeeshipping.in/assets/img/EZ_New_LogoAboveText.png" alt="EzeeBot Logo" style="width: 90%; height: 90%; margin-top: 1.2px; margin-left: 0.8px; object-fit: contain; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); clip-path: inset(0 0 8px 0);">
        </div></div><div class="bot-message-chat">`;

        //var botMessageHTML = '<div class="message-container"><div class="bot-avatar" data-bs-toggle="modal" data-bs-target="#modalPopup"><img src="https://betatest.ezeeshipping.in/assets/img/EZ_New_LogoAboveText.png" alt="EzeeBot Logo" style="width: 30px; height: auto;"></div><div class="bot-message">';
        var botMessageHTML2 = '<div class="message-container"><div class="bot-message-time">';

            if (message.toLowerCase() === "from date") {
                botMessageHTML += 'Please enter the "<b>' + message + '</b>"';
                chatContainer.innerHTML += botMessageHTML;
                var currentTime = new Date().toLocaleTimeString();
                var botTimeHTML = '<div class="bot-time">' + 'EZEEBOT , ' + currentTime + '</div>';
                chatContainer.innerHTML += botTimeHTML;
                var currentDate = new Date();
                currentDate.setMonth(currentDate.getMonth() - 1);

                var year = currentDate.getFullYear();
                var month = String(currentDate.getMonth() + 1).padStart(2, '0');
                var day = String(currentDate.getDate()).padStart(2, '0');
                var hours = String(currentDate.getHours()).padStart(2, '0');
                var minutes = String(currentDate.getMinutes()).padStart(2, '0');
                var defaultDate = year + '-' + month + '-' + day + 'T' + hours + ':' + minutes;

                botMessageHTML2 += '<input type="datetime-local" id="datetime-input" value="' + defaultDate + '">';
                chatContainer.innerHTML += botMessageHTML2;
                setTimeout(function() {
                    var datetimeInput = document.getElementById('datetime-input');
                    datetimeInput.focus();
                }, 0);
                scrollToBottom();
        
                var datetimeInput = document.getElementById('datetime-input');

                userInputElement.style.display = 'none';
        
                datetimeInput.addEventListener('blur', function(event) {
                    var userInput = this.value.trim().split("T")[0];
                    simpleUserMessage(userInput);
        
                    inputValues["receipts" + message.toLowerCase().replace(/\s+/g, '_')] = userInput;

                    var botMessageCheck = document.querySelector('.bot-message-time');
                    if (botMessageCheck) {
                        botMessageCheck.remove();
                    }

                    userInputElement.style.display = 'block';
        
                    currentIndex++;
                    if (currentIndex < messages.length) {
                        displayPrompt();
                    } else {
                        sendAllInputs();
                    }
                });
            } else if (message.toLowerCase() === "to date") {
                botMessageHTML += 'Please enter the "<b>' + message + '</b>"';
                chatContainer.innerHTML += botMessageHTML;
                var currentTime = new Date().toLocaleTimeString();
                var botTimeHTML = '<div class="bot-time">' + 'EZEEBOT , ' + currentTime + '</div>';
                chatContainer.innerHTML += botTimeHTML;
                var defaultDate = new Date().toISOString().slice(0, 16);
                botMessageHTML2 += '<input type="datetime-local" id="datetime-input" value="' + defaultDate + '">';
                chatContainer.innerHTML += botMessageHTML2;
                setTimeout(function() {
                    var datetimeInput = document.getElementById('datetime-input');
                    datetimeInput.focus();
                }, 0);
                scrollToBottom();
        
                var datetimeInput = document.getElementById('datetime-input');

                userInputElement.style.display = 'none';
        
                datetimeInput.addEventListener('blur', function(event) {
                    var userInput = this.value.trim().split("T")[0];
                    simpleUserMessage(userInput);
        
                    inputValues["receipts" + message.toLowerCase().replace(/\s+/g, '_')] = userInput;

                    var botMessageCheck = document.querySelector('.bot-message-time');
                    if (botMessageCheck) {
                        botMessageCheck.remove();
                    }

                    userInputElement.style.display = 'block';
        
                    currentIndex++;
                    if (currentIndex < messages.length) {
                        displayPrompt();
                    } else {
                        sendAllInputs();
                    }
                });
            } else {
            botMessageHTML += 'Please type in the "<b>' + message + '</b>"';
            chatContainer.innerHTML += botMessageHTML;
            var currentTime = new Date().toLocaleTimeString();
            var botTimeHTML = '<div class="bot-time">' + 'EZEEBOT , ' + currentTime + '</div>';
            chatContainer.innerHTML += botTimeHTML;
            scrollToBottom();
    
            userInputElement.focus();
    
            if (userInputElement._listener) {
                userInputElement.removeEventListener('keypress', userInputElement._listener);
            }
    
            userInputElement._listener = function (event) {
                if (event.key === 'Enter') {
                    event.preventDefault();
                    var userInput = this.value.trim();
                    simpleUserMessage(userInput);
    
                    inputValues["receipts" + message.toLowerCase().replace(/\s+/g, '_')] = userInput;
    
                    this.value = '';
    
                    currentIndex++;
                    if (currentIndex < messages.length) {
                        displayPrompt();
                    } else {
                        sendAllInputs();
                    }
                }
            };
    
            userInputElement.addEventListener('keypress', userInputElement._listener);
        }
    }

    function sendAllInputs() {
        typingMessage();
        fetch('/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_input: {
                    ...inputValues,
                    'current_date': formattedDate,
                    'tenantid': tenantid,
                    'officeid': officeid,
                    'userid': userid,
                    'userid2': userid2,
                    'environment': environment,
                }
            }),
        })
        .then(response => response.json())
        .then(data => {
            var inputSummary = '<b>[ </b>' + Object.keys(inputValues).map(function(key, index, array) {
                var displayKey = key.replace(/^receipts/, '').replace(/_/g, ' ');
                var comma = (index !== array.length - 1) ? ', ' : '';
                return '<b>' + displayKey + ':</b> ' + inputValues[key] + comma;
            }).join('') + '<b> ]</b>';       
            
            var botMessageHTML = `<div class="message-container"><div class="bot-avatar"><div id="dp" data-bs-toggle="modal" data-bs-target="#modalPopup">
                <img id="thumbnail" src="https://betatest.ezeeshipping.in/assets/img/EZ_New_LogoAboveText.png" alt="EzeeBot Logo" style="width: 90%; height: 90%; margin-top: 1.2px; margin-left: 0.8px; object-fit: contain; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); clip-path: inset(0 0 8px 0);">
            </div></div><div class="bot-message-booking"><b>Receipts search result based on your criteria </b>${formatKeyValueList(inputSummary)}`;
            
            //var botMessageHTML = '<div class="message-container"><div class="bot-avatar" data-bs-toggle="modal" data-bs-target="#modalPopup"><img src="https://betatest.ezeeshipping.in/assets/img/EZ_New_LogoAboveText.png" alt="EzeeBot Logo" style="width: 30px; height: auto;"></div><div class="bot-message-booking"><b>Receipts search result based on your criteria <br><br></b>' + '<span style="font-size:14px;">' + formatKeyValueList(inputSummary) + '</span><br><br>';

                var bookingSets = data.response.split('},');

                if (bookingSets.length > 1) {
                    botMessageHTML += '<b>Multiple entries found. Please pick one to view more details</b><br><br>';
                    var counter = 1;
                    var buttonHTML = '';
                
                    bookingSets.forEach((bookingSet, index) => {
                        var cleanedBookingSet = bookingSet.replace(/[\[\]{}"]/g, '');
                
                        if (cleanedBookingSet.trim() !== '') {
                            cleanedBookingSet = cleanedBookingSet.trim();
                
                            var keyValuePairs = cleanedBookingSet.split(',');
                
                            var bookingNumber = '';
                            var statusCode = '';
                            var det = '';
                            var bookingHTML = '<table class="booking-details">';
                            keyValuePairs.forEach(pair => {
                                var parts = pair.split(':');
                                var key = parts[0].trim();
                                var value = parts.slice(1).join(':').trim();
                
                                if (key.toUpperCase() === 'RECEIPT NUMBER') {
                                    if (value === 'null') {
                                        bookingNumber = null;
                                    } else {
                                        bookingNumber = value;
                                    }
                                } else if (key.toUpperCase() === 'CHEQUE NUMBER' && !bookingNumber) {
                                    statusCode = value;
                                } else if (key.toUpperCase() === 'RECEIPT DATE' ) {
                                    billdate = value;
                                } else if (key.toUpperCase() === 'RECEIPT FROM' ) {
                                    billto = value;
                                } else if (key.toUpperCase() === 'CONFIRMED DATE' ) {
                                    det += value;
                                } else if (key.toUpperCase() === 'RECEIPT MODE' ) {
                                    det += value;
                                } else if (key.toUpperCase() === 'CHEQUE NUMBER' ) {
                                    det += value;
                                } else if (key.toUpperCase() === 'CHEQUE DATE' ) {
                                    det += value;
                                } else if (key.toUpperCase() === 'UTR NUMBER' ) {
                                    det += value;
                                } else if (key.toUpperCase() === 'UTR DATE' ) {
                                    det += value;
                                } else if (key.toUpperCase() === 'REMARK' ) {
                                    det += value;
                                } else if (key.toUpperCase() === 'TOTAL AMOUNT' ) {
                                    det += value;
                                } else if (key.toUpperCase() === 'CREATED BY' ) {
                                    det += value;
                                } else if (key.toUpperCase() === 'CONFIRMED BY' ) {
                                    det += value;
                                } else if (key.toUpperCase() === 'CREATED DATE' ) {
                                    det += value;
                                }
                
                                bookingHTML += '<tr><td><span class="key">' + key + '</span></td><td><span class="value">' + value + '</span></td></tr>\n';
                            });
                            bookingHTML += '</table>';

                            if (!bookingNumber) {
                                buttonHTML += '<button class="booking-button" onclick="showBookingDetails(\'' + bookingNumber + '\', ' + counter + ')"><div style="float: left; width: 33%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: left; border-right: 2px solid #f2f2f2;">' + billto + '<span color: transparent;' + det +'</span></div><div style="display: inline-block; text-align: center; width: 33%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: center;">' + billdate + '</div><div style="float: right; width: 33%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: right; border-left: 2px solid #f2f2f2;">' + statusCode + '</div></button><br>';
                            } else {
                                buttonHTML += '<button class="booking-button" onclick="showBookingDetails(\'' + bookingNumber + '\', ' + counter + ')"><div style="float: left; width: 33%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: left; border-right: 2px solid #f2f2f2;">' + billto + '<span color: transparent;' + det +'</span></div><div style="display: inline-block; text-align: center; width: 33%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: center;">' + billdate + '</div><div style="float: right; width: 33%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: right; border-left: 2px solid #f2f2f2;">' + bookingNumber + '</div></button><br>';
                            }

                            buttonHTML += '<div id="'+ counter +'bookingDetails_' + bookingNumber + '" style="display: none;">' + bookingHTML + '</div><br>';
                            counter++;
                        }
                    });
                    var botDiv = `<div style="border: 1px solid transparent; padding-top: 10px; padding-left: 2px; padding-right: 2px; padding-bottom: 3px; border-radius: 10px; margin-top: 10px; background-color: #c0c0c0;">`;
                    botDiv += '<input type="text" id="search-input" style="width: 100%;" placeholder="Global Search...">';
                    var botDiv2 = `<div style="border-left: 1px solid transparent; background-color: #e5e4e2; padding: 4px; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;">`;
                    botDiv2 += '<div id="num" style="font-size: 14px; display: flex; padding: 5px; align-items: left; justify-content: left;"></div>';
                    botDiv2 += '<div><table style="border-collapse: collapse; width: 100%; margin-bottom: 5px;"><thead style="background-color: #002147; color: white;"><tr><th style="border-right: 1px solid transparent; text-align: left; padding: 8px; width: 33.17%;">RECEIPT FROM</th><th style="border-left: 2px solid #f2f2f2; text-align: center; padding: 8px; width: 33.16%;">RECEIPT DATE</th><th style="border-left: 2px solid #f2f2f2; text-align: right; padding: 8px; width: 33.66%;">RECEIPT NO</th></tr></thead></table></div>';
                    botDiv2 +=  '<div id="bot-message-scroll" style="max-height: 250px; overflow-y: auto; overflow-x: hidden;">' + buttonHTML +'</div>';
                    botDiv2 += `</div>`;
                    botDiv += botDiv2;
                    botDiv += `</div>`;
                    botMessageHTML += botDiv;
                    botMessageHTML += '<div style="margin-top: 20px;"><b>If you have any questions or concerns about the results, please verify them using our application or contact our support team.</b></div>';
                }
                 else {
                    bookingSets.forEach(bookingSet => {
                        var cleanedBookingSet = bookingSet.replace(/[\[\]{}"]/g, '');
                
                        if (cleanedBookingSet.trim() !== '') {
                            cleanedBookingSet = cleanedBookingSet.trim();
                
                            var keyValuePairs = cleanedBookingSet.split(',');
                
                            var bookingHTML = '<table class="booking-details">';
                            keyValuePairs.forEach(pair => {
                                var parts = pair.split(':');
                                var key = parts[0].trim();
                                var value = parts.slice(1).join(':').trim();
                
                                bookingHTML += '<tr><td><span class="key">' + key + '</span></td><td><span class="value">' + value + '</span></td></tr>\n';
                            });
                            bookingHTML += '</table><br>';
                            botMessageHTML += bookingHTML;
                        }
                    });
                }
                
                botMessageHTML += '</div></div>';
                chatContainer.innerHTML += botMessageHTML;
                var currentTime = new Date().toLocaleTimeString();
                var botTimeHTML = '<div class="bot-time">'+ 'EZEEBOT , ' + currentTime + '</div>';
                chatContainer.innerHTML += botTimeHTML;
                document.addEventListener('input', function (event) {
                    if (event.target.id === 'search-input') {
                        var searchValue = event.target.value.toLowerCase();
                        var botMessageScroll = document.getElementById('bot-message-scroll');
                        var buttons = botMessageScroll.getElementsByClassName('booking-button');
                        var moduleName = 'receipts';

                        filterButtons(searchValue, buttons, moduleName);
                    }
                });
                closeType();
                scrollToBottom();
        
            userInputElement.removeEventListener('keypress', userInputElement._listener);
        })
        .catch(error => {
            console.error('Error:', error);
        });                

    }
    displayPrompt();
}

function askBookingNumberselling(messages) {
    var inputValues = {};
    var currentIndex = 0;
    var userInputElement = document.getElementById('user-input');

    function displayPrompt() {
        var message = messages[currentIndex];
        var botMessageHTML = `<div class="message-container"><div class="bot-avatar"><div id="dp" data-bs-toggle="modal" data-bs-target="#modalPopup">
            <img id="thumbnail" src="https://betatest.ezeeshipping.in/assets/img/EZ_New_LogoAboveText.png" alt="EzeeBot Logo" style="width: 90%; height: 90%; margin-top: 1.2px; margin-left: 0.8px; object-fit: contain; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); clip-path: inset(0 0 8px 0);">
        </div></div><div class="bot-message-chat">`;

        //var botMessageHTML = '<div class="message-container"><div class="bot-avatar" data-bs-toggle="modal" data-bs-target="#modalPopup"><img src="https://betatest.ezeeshipping.in/assets/img/EZ_New_LogoAboveText.png" alt="EzeeBot Logo" style="width: 30px; height: auto;"></div><div class="bot-message">';
        var botMessageHTML2 = '<div class="message-container"><div class="bot-message-time">';

        if (message.toLowerCase() === "from date") {
            botMessageHTML += 'Please enter the "<b>' + message + '</b>"';
            chatContainer.innerHTML += botMessageHTML;
            var currentTime = new Date().toLocaleTimeString();
            var botTimeHTML = '<div class="bot-time">' + 'EZEEBOT , ' + currentTime + '</div>';
            chatContainer.innerHTML += botTimeHTML;
            var currentDate = new Date();
            currentDate.setMonth(currentDate.getMonth() - 1);

            var year = currentDate.getFullYear();
            var month = String(currentDate.getMonth() + 1).padStart(2, '0');
            var day = String(currentDate.getDate()).padStart(2, '0');
            var hours = String(currentDate.getHours()).padStart(2, '0');
            var minutes = String(currentDate.getMinutes()).padStart(2, '0');
            var defaultDate = year + '-' + month + '-' + day + 'T' + hours + ':' + minutes;

            botMessageHTML2 += '<input type="datetime-local" id="datetime-input" value="' + defaultDate + '">';
            chatContainer.innerHTML += botMessageHTML2;
            setTimeout(function() {
                var datetimeInput = document.getElementById('datetime-input');
                datetimeInput.focus();
            }, 0);
            scrollToBottom();
    
            var datetimeInput = document.getElementById('datetime-input');

            userInputElement.style.display = 'none';
    
            datetimeInput.addEventListener('blur', function(event) {
                var userInput = this.value.trim().split("T")[0];
                simpleUserMessage(userInput);
    
                inputValues["sell" + message.toLowerCase().replace(/\s+/g, '_')] = userInput;

                var botMessageCheck = document.querySelector('.bot-message-time');
                if (botMessageCheck) {
                    botMessageCheck.remove();
                }

                userInputElement.style.display = 'block';
    
                currentIndex++;
                if (currentIndex < messages.length) {
                    displayPrompt();
                } else {
                    sendAllInputs();
                }
            });
        } else if (message.toLowerCase() === "to date") {
            botMessageHTML += 'Please enter the "<b>' + message + '</b>"';
            chatContainer.innerHTML += botMessageHTML;
            var currentTime = new Date().toLocaleTimeString();
            var botTimeHTML = '<div class="bot-time">' + 'EZEEBOT , ' + currentTime + '</div>';
            chatContainer.innerHTML += botTimeHTML;
            var defaultDate = new Date().toISOString().slice(0, 16);
            botMessageHTML2 += '<input type="datetime-local" id="datetime-input" value="' + defaultDate + '">';
            chatContainer.innerHTML += botMessageHTML2;
            setTimeout(function() {
                var datetimeInput = document.getElementById('datetime-input');
                datetimeInput.focus();
            }, 0);
            scrollToBottom();
    
            var datetimeInput = document.getElementById('datetime-input');

            userInputElement.style.display = 'none';
    
            datetimeInput.addEventListener('blur', function(event) {
                var userInput = this.value.trim().split("T")[0];
                simpleUserMessage(userInput);
    
                inputValues["sell" + message.toLowerCase().replace(/\s+/g, '_')] = userInput;

                var botMessageCheck = document.querySelector('.bot-message-time');
                if (botMessageCheck) {
                    botMessageCheck.remove();
                }

                userInputElement.style.display = 'block';
    
                currentIndex++;
                if (currentIndex < messages.length) {
                    displayPrompt();
                } else {
                    sendAllInputs();
                }
            });
        } else if (message.toLowerCase() === "direct purchase") {
                    event.preventDefault();
                    var userInput = "D";
    
                    inputValues["sell" + message.toLowerCase().replace(/\s+/g, '_')] = userInput;
    
                    this.value = '';
    
                    currentIndex++;
                    if (currentIndex < messages.length) {
                        displayPrompt();
                    } else {
                        sendAllInputs();
                    }

        } else if (message.toLowerCase() === "indirect purchase") {
            event.preventDefault();
            var userInput = "I";

            inputValues["sell" + message.toLowerCase().replace(/\s+/g, '_')] = userInput;

            this.value = '';

            currentIndex++;
            if (currentIndex < messages.length) {
                displayPrompt();
            } else {
                sendAllInputs();
            }

        } else {
            botMessageHTML += 'Please type in the "<b>' + message + '</b>"';
            chatContainer.innerHTML += botMessageHTML;
            var currentTime = new Date().toLocaleTimeString();
            var botTimeHTML = '<div class="bot-time">' + 'EZEEBOT , ' + currentTime + '</div>';
            chatContainer.innerHTML += botTimeHTML;
            scrollToBottom();
    
            userInputElement.focus();
    
            if (userInputElement._listener) {
                userInputElement.removeEventListener('keypress', userInputElement._listener);
            }
    
            userInputElement._listener = function (event) {
                if (event.key === 'Enter') {
                    event.preventDefault();
                    var userInput = this.value.trim();
                    simpleUserMessage(userInput);
    
                    inputValues["sell" + message.toLowerCase().replace(/\s+/g, '_')] = userInput;
    
                    this.value = '';
    
                    currentIndex++;
                    if (currentIndex < messages.length) {
                        displayPrompt();
                    } else {
                        sendAllInputs();
                    }
                }
            };
    
            userInputElement.addEventListener('keypress', userInputElement._listener);
        }
    }

    function sendAllInputs() {
        typingMessage();
        fetch('/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_input: {
                    ...inputValues,
                    'current_date': formattedDate,
                    'tenantid': tenantid,
                    'officeid': officeid,
                    'userid': userid,
                    'userid2': userid2,
                    'environment': environment,
                }
            }),
        })
        .then(response => response.json())
        .then(data => {
            var inputSummary = '<b>[ </b>' + Object.keys(inputValues).map(function(key, index, array) {
                var displayKey = key.replace(/^sell/, '').replace(/_/g, ' ');
                var displayValue = inputValues[key];
                var comma = (index !== array.length - 1) ? ', ' : '';
            
                if (displayKey.toLowerCase() === 'direct purchase' && displayValue.toLowerCase() === 'd') {
                    return '<b>Direct purchase</b>' + comma;
                } else if (displayKey.toLowerCase() === 'indirect purchase' && displayValue.toLowerCase() === 'i') {
                    return '<b>indirect purchase</b>' + comma;
                }
            
                return '<b>' + displayKey + ':</b> ' + displayValue + comma;
            }).join('') + '<b> ]</b>';        
            
            var botMessageHTML = `<div class="message-container"><div class="bot-avatar"><div id="dp" data-bs-toggle="modal" data-bs-target="#modalPopup">
                <img id="thumbnail" src="https://betatest.ezeeshipping.in/assets/img/EZ_New_LogoAboveText.png" alt="EzeeBot Logo" style="width: 90%; height: 90%; margin-top: 1.2px; margin-left: 0.8px; object-fit: contain; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); clip-path: inset(0 0 8px 0);">
            </div></div><div class="bot-message-booking"><b>Buying search result based on your criteria </b>${formatKeyValueList(inputSummary)}`;
            
            //var botMessageHTML = '<div class="message-container"><div class="bot-avatar" data-bs-toggle="modal" data-bs-target="#modalPopup"><img src="https://betatest.ezeeshipping.in/assets/img/EZ_New_LogoAboveText.png" alt="EzeeBot Logo" style="width: 30px; height: auto;"></div><div class="bot-message-booking"><b>Buying search result based on your criteria <br><br></b>' + '<span style="font-size:14px;">' + '<span style="font-size:14px;">' + formatKeyValueList(inputSummary) + '</span></span><br><br>';

                var bookingSets = data.response.split('},');

                if (bookingSets.length > 1) {
                    botMessageHTML += '<b>Multiple entries found. Please pick one to view more details</b><br><br>';
                    var counter = 1;
                    var buttonHTML = '';
                
                    bookingSets.forEach((bookingSet, index) => {
                        var cleanedBookingSet = bookingSet.replace(/[\[\]{}"]/g, '');
                
                        if (cleanedBookingSet.trim() !== '') {
                            cleanedBookingSet = cleanedBookingSet.trim();
                        
                            var keyValuePairs = cleanedBookingSet.split(',');
                        
                            var bookingNumber = '';
                            var statusCode = '';
                            var det = '';
                            var bookingHTML = '<table class="booking-details">';
                            
                            keyValuePairs.forEach(pair => {
                                var parts = pair.split(':');
                                var key = parts[0].trim();
                                var value = parts.slice(1).join(':').trim();
                        
                                if (key.toUpperCase() === 'BILL NUMBER') {
                                    if (value === 'null') {
                                        bookingNumber = null;
                                    } else {
                                        bookingNumber = value;
                                    }
                                } else if (key.toUpperCase() === 'STATUS' && !bookingNumber) {
                                    statusCode = value;
                                } else if (key.toUpperCase() === 'BILL DATE') {
                                    billdate = value;
                                } else if (key.toUpperCase() === 'COMPANY') {
                                    company = value;
                                }
                                
                                det += value + ',';
                                console.log(det);
                                bookingHTML += '<tr><td><span class="key">' + key + '</span></td><td><span class="value">' + value + '</span></td></tr>\n';
                                
                            });
                            console.log(counter);
                            
                            bookingHTML += '</table>';
                        
                            if (!bookingNumber) {
                                buttonHTML += '<button class="booking-button" onclick="showBookingDetails(\'' + bookingNumber + '\', ' + counter + ')"><div style="float: left; width: 33%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: left; border-right: 2px solid #f2f2f2;">' + company + '<span color: transparent;' + det +'</span></div><div style="display: inline-block; text-align: center; width: 33%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: center;">' + billdate + '</div><div style="float: right; width: 33%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: right; border-left: 2px solid #f2f2f2;">' + statusCode + '</div></button><br>';
                            } else {
                                buttonHTML += '<button class="booking-button" onclick="showBookingDetails(\'' + bookingNumber + '\', ' + counter + ')"><div style="float: left; width: 33%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: left; border-right: 2px solid #f2f2f2;">' + company + '<span color: transparent;' + det +'</span></div><div style="display: inline-block; text-align: center; width: 33%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: center;">' + billdate + '</div><div style="float: right; width: 33%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: right; border-left: 2px solid #f2f2f2;">' + bookingNumber + '</div></button><br>';
                            }

                            buttonHTML += '<div id="' + counter + 'bookingDetails_' + bookingNumber + '" style="display: none;">' + bookingHTML + '</div><br>';
                            counter++;
                        }                                
                    });

                    var botDiv = `<div style="border: 1px solid transparent; padding-top: 10px; padding-left: 2px; padding-right: 2px; padding-bottom: 3px; border-radius: 10px; margin-top: 10px; background-color: #c0c0c0;">`;    
                    botDiv += '<input type="text" id="search-input" style="width: 100%;" placeholder="Global Search...">';
                    var botDiv2 = `<div style="border-left: 1px solid transparent; background-color: #e5e4e2; padding: 4px; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;">`;
                    botDiv2 += '<div id="num" style="font-size: 14px; display: flex; padding: 5px; align-items: left; justify-content: left;"></div>';
                    botDiv2 += '<div><table style="border-collapse: collapse; width: 100%; margin-bottom: 5px;"><thead style="background-color: #002147; color: white;"><tr><th style="border: 1px solid #dddddd; text-align: left; padding: 8px; width: 33.17%;">COMPANY</th><th style="border: 1px solid #dddddd; text-align: center; padding: 8px; width: 33.16%;">BILL DATE</th><th style="border: 1px solid #dddddd; text-align: right; padding: 8px; width: 33.66%;">BILL NO</th></tr></thead></table></div>';
                    botDiv2 +=  '<div id="bot-message-scroll" style="max-height: 250px; overflow-y: auto; overflow-x: hidden;">' + buttonHTML +'</div>';
                    botDiv2 += `</div>`;
                    botDiv += botDiv2;
                    botDiv += `</div>`;
                    botMessageHTML += botDiv;
                    botMessageHTML += '<div style="margin-top: 20px;"><b>If you have any questions or concerns about the results, please verify them using our application or contact our support team.</b></div>';
                }
                 else {
                    bookingSets.forEach(bookingSet => {
                        var cleanedBookingSet = bookingSet.replace(/[\[\]{}"]/g, '');
                
                        if (cleanedBookingSet.trim() !== '') {
                            cleanedBookingSet = cleanedBookingSet.trim();
                
                            var keyValuePairs = cleanedBookingSet.split(',');
                
                            var bookingHTML = '<table class="booking-details">';
                            keyValuePairs.forEach(pair => {
                                var parts = pair.split(':');
                                var key = parts[0].trim();
                                var value = parts.slice(1).join(':').trim();
                
                                bookingHTML += '<tr><td><span class="key">' + key + '</span></td><td><span class="value">' + value + '</span></td></tr>\n';
                            });
                            bookingHTML += '</table><br>';
                            botMessageHTML += bookingHTML;
                        }
                    });
                }
                
                botMessageHTML += '</div></div>';
                chatContainer.innerHTML += botMessageHTML;
                var currentTime = new Date().toLocaleTimeString();
                var botTimeHTML = '<div class="bot-time">'+ 'EZEEBOT , ' + currentTime + '</div>';
                chatContainer.innerHTML += botTimeHTML;
                document.addEventListener('input', function (event) {
                    if (event.target.id === 'search-input') {
                        var searchValue = event.target.value.toLowerCase();
                        var botMessageScroll = document.getElementById('bot-message-scroll');
                        var buttons = botMessageScroll.getElementsByClassName('booking-button');
                        var moduleName = 'buyings';

                        filterButtons(searchValue, buttons, moduleName);
                    }
                });
                closeType();
                scrollToBottom();
        
            userInputElement.removeEventListener('keypress', userInputElement._listener);
        })
        .catch(error => {
            console.error('Error:', error);
        });                

    }
    displayPrompt();
}  

function formatKeyValueList(input) {
    let formattedString = '<div style="display: table; margin-top: 10px; margin-bottom: 10px; font-size: calc(9px + 0.5vw);">';

    if (typeof input === 'string') {
        let cleanInput = input.replace(/\[|\]/g, '').trim();

        let pairs = cleanInput.split(',').map(pair => pair.trim());

        pairs.forEach((pair, index) => {
            let [key, value] = pair.split(':').map(part => part.trim());

            let formattedKey = key.toUpperCase();
            let formattedValue = value.toUpperCase();;

            formattedString += `<div style="display: table-row;">`;

            if (index === 0) {
                formattedString += `<div style="display: table-cell;">${formattedKey}</div>`;
                formattedString += `<div style="display: table-cell; color: #007bff; padding-left: 10px;">${formattedValue}</div>`;
            } else {
                formattedString += `<div style="display: table-cell;">${formattedKey}</div>`;
                formattedString += `<div style="display: table-cell;color: #007bff; padding-left: 10px;">${formattedValue}</div>`;
            }

            formattedString += `</div>`;
        });
    } else {
        console.error('Invalid input:', input);
        return 'Invalid input';
    }
    formattedString += '</div>';

    return formattedString;
}

function scrollToBottom() {
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

function scrollToBottombottable() {
    var tables = document.querySelectorAll('table.striped-table tbody');
    var latestTable = tables[tables.length - 1];
    latestTable.scrollTop = latestTable.scrollHeight;
}

function tooltip() {
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl)
    })
}

tooltip();

let chartType, period, displayText, displayText2;

function setChartType3(unwanted, type, text) {
    chartType = type;
    displayText = text;
    graphper(chartType, displayText, displayText2);
}

function setChartType(type, value, text) {
    if (type === 'chartType') {
        chartType = value;
        displayText = text;
        document.getElementById('textIdPast').textContent = text;
    } else if (type === 'period') {
        period = parseInt(value, 10);
        displayText2 = text;
        document.getElementById('textIdPast2').textContent = text;
    }
    graph(chartType, displayText, period, displayText2);
}

$('#graphCollapsePast').on('shown.bs.collapse', function () {
    chartType = 'line';
    displayText = 'Line Chart';
    period = 6;
    displayText2 = 'Six Month'
    graph(chartType, displayText, period, displayText2);
});

let profit, revenue, expense, monthName;

function graph(chartType, displayText, period, displayText2) {
    document.getElementById('spinner2').style.display = 'flex';
    document.getElementById('dot').style.display = 'block';
    document.getElementById('profitChartPast').style.display = 'none';

    fetch('/graph', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            user_input: {
                'tenantid': tenantid,
                'officeid': officeid,
                'environment': environment,
                'period': period
            }
        }),
    })
    .then(response => response.json())
    .then(data => {
        var { net_profits, revenue: rev, expense: exp, month_name } = data;

        console.log('Net Profits:', net_profits);
        console.log('Revenue:', rev);
        console.log('Expense:', exp);
        console.log(month_name);

        profit = net_profits;
        revenue = rev;
        expense = exp;
        monthName = month_name

        document.getElementById('dot').style.display = 'none';
        document.getElementById('spinner2').style.display = 'none';
        document.getElementById('profitChartPast').style.display = 'block';

        graphper(chartType, displayText, displayText2);
        
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function graph2(chartType, displayText) {
    document.getElementById('textIdFuture').textContent = displayText;
    var predictedData = {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        series: [
            { name: 'Predicted Profit', data: [9129960, 8010148, 10125936, 11586253, 17226463, 15606799] }
        ],
        colors: ['#002147'],
    };

    var type;
    switch (chartType) {
        case 'line':
            type = 'line';
            break;
        case 'bar':
            type = 'bar';
            break;
        case 'column':
            type = 'column';
            break;
        default:
            type = 'column';
            break;
    }

    var dataLabelsConfig = {
        enabled: (type !== 'line'),
        formatter: function() {
            var y = this.y;
            if (y >= 1000000) {
                return (y / 1000000).toFixed(1) + 'M';
            } else if (y >= 1000) {
                return (y / 1000).toFixed(1) + 'K';
            } else {
                return y;
            }
        },
        style: {
            fontSize: '10px',
            color: '#000',
            textOutline: 'none'
        },
        borderColor: null,
        borderWidth: 0
    };

    var options = {
        chart: {
            type: type,
            height: 270,
        },
        series: predictedData.series,
        title: {
            text: 'Predicted Profit (Next 6 months)',
            style: {
                fontSize: '14px'
            }
        },
        xAxis: {
            categories: predictedData.categories,
            labels: {
                style: {
                    fontSize: '12px',
                }
            }
        },
        yAxis: {
            title: {
                text: null,
                style: {
                    fontSize: '14px',
                    color: '#000'
                }
            },
            labels: {
                style: {
                    fontSize: '12px'
                }
            },
             tickInterval: 5 * 1000000,
        },
        plotOptions: {
            series: {
                marker: {
                    enabled: true,
                    radius: 4
                },
                dataLabels: dataLabelsConfig
            }
        },
        colors: predictedData.colors,
        tooltip: {
            backgroundColor: 'rgba(255, 255, 255, 0.85)',
            borderWidth: null,
            borderColor: null,
            borderRadius: 5,
            shadow: true,
            style: {
                color: '#333',
                fontSize: '12px',
                padding: '8px'
            },
            formatter: function () {
                var month = this.x;
                return '<b>' + month + '</b><br>' +
                    '<span>' + this.series.name + '</span> <span style="color:' + this.series.color + '"><b>' + this.y + '</b></span><br/>';
            },
            shared: true
        },
        credits: {
            enabled: false
        },
        accessibility: {
            enabled: false
        },
        exporting: {
            enabled: true,
            buttons: {
                contextButton: {
                    menuItems: [
                        'printChart',
                        'separator',
                        'downloadPNG',
                        'downloadJPEG',
                        'downloadPDF',
                        'downloadSVG',
                        'viewFullscreen'
                    ]
                }
            }
        }
    };

    Highcharts.chart('profitChartFuture', options);
}

function graphper(chartType, displayText, displayText2) {
    console.log(chartType, displayText);
    document.getElementById('textIdPast').textContent = displayText;
    document.getElementById('textIdPast2').textContent = displayText2;

    var categories = monthName;

    var data = [
        { name: 'Profit', data: profit, color: '#002147' },
        { name: 'Expense', data: expense, color: '#FF0000' },
        { name: 'Revenue', data: revenue, color: '#00FF00' }
    ];

    var type;
    switch (chartType) {
        case 'line':
            type = 'line';
            break;
        case 'bar':
            type = 'bar';
            break;
        case 'column':
            type = 'column';
            break;
        default:
            type = 'column';
            break;
    }

    var options = {
        chart: {
            type: type,
            height: 270,
        },
        series: data,
        title: {
            text: 'Financial Overview',
            style: {
                fontSize: '14px'
            }
        },
        xAxis: {
            categories: categories,
            labels: {
                style: {
                    fontSize: '12px',
                }
            }
        },
        yAxis: {
            title: {
                text: null,
                style: {
                    fontSize: '14px',
                    color: '#000'
                }
            },
            labels: {
                style: {
                    fontSize: '12px'
                }
            },
            tickInterval: 5 * 1000000,
        },
        plotOptions: {
            series: {
                marker: {
                    enabled: true,
                    symbol: 'circle',
                    radius: 4
                }
            }
        },
        colors: ['#002147', '#FF0000', '#00FF00'],
        tooltip: {
            backgroundColor: 'rgba(255, 255, 255, 0.85)',
            borderWidth: null,
            borderColor: null,
            borderRadius: 5,
            shadow: true,
            style: {
                color: '#333',
                fontSize: '12px',
                padding: '8px'
            },
            shared: true,
            formatter: function() {
                var points = this.points;
                var tooltipText = '<b>' + this.x + '</b><br/>';
                
                points.forEach(function(point) {
                    tooltipText += '<span style="color:' + point.series.color + '">\u25CF</span> ' + point.series.name + ': <b>' + Highcharts.numberFormat(point.y, 0, ',', ',') + '</b><br/>';
                });

                return tooltipText;
            }
        },
        credits: {
            enabled: false
        },
        accessibility: {
            enabled: false
        },
        exporting: {
            enabled: true,
            buttons: {
                contextButton: {
                    menuItems: [
                        'printChart',
                        'separator',
                        'downloadPNG',
                        'downloadJPEG',
                        'downloadPDF',
                        'downloadSVG',
                        'viewFullscreen'
                    ]
                }
            }
        }
    };

    Highcharts.chart('profitChartPast', options);
}

function setChartType2(chartType, displayText) {
    graph2(chartType, displayText);
}

$('#graphCollapseFuture').on('shown.bs.collapse', function () {
    graph2('column', 'Column Chart');
});

var productLinks = document.querySelectorAll('.product-link');

productLinks.forEach(function (link) {
    link.addEventListener('click', function () {
        var productName = this.getAttribute('data-product');
        document.getElementById('productDetails').textContent = 'Details for ' + productName;
    });
});

var productsCollapse = document.getElementById('productsCollapse');
var graphCollapse = document.getElementById('graphCollapsePast');
var graphCollapse2 = document.getElementById('graphCollapseFuture');

var arrowIcon1 = document.querySelector('.arrow-icon-1 i');
var arrowIcon2 = document.querySelector('.arrow-icon-2 i');
var arrowIcon3 = document.querySelector('.arrow-icon-3 i');

if (productsCollapse) {
    productsCollapse.addEventListener('shown.bs.collapse', function () {
        arrowIcon1.classList.remove('bi-chevron-down');
        arrowIcon1.classList.add('bi-chevron-up');
    });

    productsCollapse.addEventListener('hidden.bs.collapse', function () {
        arrowIcon1.classList.remove('bi-chevron-up');
        arrowIcon1.classList.add('bi-chevron-down');
    });
}

if (graphCollapse) {
    graphCollapse.addEventListener('shown.bs.collapse', function () {
        arrowIcon2.classList.remove('bi-chevron-down');
        arrowIcon2.classList.add('bi-chevron-up');
    });

    graphCollapse.addEventListener('hidden.bs.collapse', function () {
        arrowIcon2.classList.remove('bi-chevron-up');
        arrowIcon2.classList.add('bi-chevron-down');
    });
}

if (graphCollapse2) {
    graphCollapse2.addEventListener('shown.bs.collapse', function () {
        arrowIcon3.classList.remove('bi-chevron-down');
        arrowIcon3.classList.add('bi-chevron-up');
    });

    graphCollapse2.addEventListener('hidden.bs.collapse', function () {
        arrowIcon3.classList.remove('bi-chevron-up');
        arrowIcon3.classList.add('bi-chevron-down');
    });
}

var graphCollapse = document.getElementById('graphCollapsePast');
graphCollapse.addEventListener('shown.bs.collapse', function () {
    var graphTitle = document.getElementById('graphTitle');
    graphTitle.classList.add('graph-collapse-open');
});

graphCollapse.addEventListener('hidden.bs.collapse', function () {
    var graphTitle = document.getElementById('graphTitle');
    graphTitle.classList.remove('graph-collapse-open');
});

var graphCollapse2 = document.getElementById('graphCollapseFuture');
graphCollapse2.addEventListener('shown.bs.collapse', function () {
    var graphTitle2 = document.getElementById('graphTitle2');
    graphTitle2.classList.add('graph-collapse-open');
});

graphCollapse2.addEventListener('hidden.bs.collapse', function () {
    var graphTitle2 = document.getElementById('graphTitle2');
    graphTitle2.classList.remove('graph-collapse-open');
});

var productsCollapse = document.getElementById('productsCollapse');
productsCollapse.addEventListener('shown.bs.collapse', function () {
    var productTitle = document.getElementById('productTitle');
    productTitle.classList.add('products-collapse-open');
});

productsCollapse.addEventListener('hidden.bs.collapse', function () {
    var productTitle = document.getElementById('productTitle');
    productTitle.classList.remove('products-collapse-open');
});

const socket = io('http://127.0.0.1:9604');

const tenantId = tenantid;
socket.emit('join_tenant_room', { tenantid: tenantId });

socket.on('database_change', (data) => {
    console.log('Database change detected:', data);

    var notificationsDiv = document.getElementById('notifications');
    var message = document.createElement('div');
    message.className = 'notification';

    var input = document.createElement('span');
    input.innerHTML = data.name + data.input;

    message.appendChild(input);
    notificationsDiv.appendChild(message);

    setTimeout(() => {
    message.remove();
    }, 5000);
});