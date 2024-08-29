chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'uploadFile') {
        chrome.windows.create({
            url: 'https://www.icegate.gov.in/',
            type: 'normal',
            state: 'maximized'
        }, (window) => {
            if (chrome.runtime.lastError) {
                console.error('Window creation error:', chrome.runtime.lastError);
                return;
            }

            const handleTabUpdate = (tabId, changeInfo) => {
                if (changeInfo.status === 'complete') {
                    chrome.tabs.get(tabId, (tab) => {
                        if (chrome.runtime.lastError) {
                            console.error('Tab retrieval error:', chrome.runtime.lastError);
                            return;
                        }

                        if (!tab.url.startsWith('chrome://') && !tab.url.startsWith('edge://')) {
                            chrome.scripting.executeScript({
                                target: { tabId: tabId },
                                func: injectScript
                            }).catch((error) => console.error('Scripting error:', error));

                            chrome.tabs.onUpdated.removeListener(handleTabUpdate);

                            const oneTimeTabUpdate = (newTabId, newChangeInfo) => {
                                if (newChangeInfo.status === 'complete') {
                                    chrome.tabs.get(newTabId, (newTab) => {
                                        if (chrome.runtime.lastError) {
                                            console.error('Tab retrieval error for new tab:', chrome.runtime.lastError);
                                            return;
                                        }

                                        if (!newTab.url.startsWith('chrome://') && !newTab.url.startsWith('edge://')) {
                                            chrome.scripting.executeScript({
                                                target: { tabId: newTabId },
                                                func: injectScript2
                                            }).catch((error) => console.error('Scripting error for new tab:', error));

                                            chrome.tabs.onUpdated.removeListener(oneTimeTabUpdate);

                                            chrome.tabs.onCreated.addListener((createdTab) => {
                                                chrome.tabs.onUpdated.addListener(function handleNewTabUpdate(newlyCreatedTabId, newlyCreatedChangeInfo) {
                                                    if (newlyCreatedTabId === createdTab.id && newlyCreatedChangeInfo.status === 'complete') {
                                                        chrome.scripting.executeScript({
                                                            target: { tabId: newlyCreatedTabId },
                                                            func: injectScript3
                                                        }).catch((error) => console.error('Scripting error for newly created tab:', error));

                                                        chrome.tabs.onUpdated.removeListener(handleNewTabUpdate);
                                                    }
                                                });
                                            });
                                        }
                                    });
                                }
                            };

                            chrome.tabs.onUpdated.addListener(oneTimeTabUpdate);
                        }
                    });
                }
            };

            chrome.tabs.onUpdated.addListener(handleTabUpdate);
        });
    } else if (message.action === 'shippingBillSubmit') {
        let listenerAdded = false;
        chrome.storage.local.set({ rowData: message.data }, () => {
            console.log(message.data);
            chrome.windows.create({
                url: 'https://enquiry.icegate.gov.in/enquiryatices/sbTrack',
                type: 'normal',
                state: 'maximized'
            }, (window) => {
                if (chrome.runtime.lastError) {
                    console.error('Window creation error:', chrome.runtime.lastError);
                    return;
                }
    
                const handleTabUpdate = (tabId, changeInfo) => {
                    console.log('status: ', changeInfo.status);
                    if (changeInfo.status === 'complete') {
                        console.log('status2: ', changeInfo.status);
                        chrome.tabs.get(tabId, (tab) => {
                            if (chrome.runtime.lastError) {
                                console.error('Tab retrieval error:', chrome.runtime.lastError);
                                return;
                            }
                            console.log('13');
                            chrome.scripting.executeScript({
                                target: { tabId: tabId },
                                func: injectScriptsb
                            }).catch((error) => console.error('Scripting error:', error));
                        });
                    }
                };

                if (!listenerAdded) {
                    console.log(listenerAdded);
                    chrome.tabs.onUpdated.addListener(handleTabUpdate);
                    listenerAdded = true;
                }
            });
        });
    } else if (message.action === 'notificaton') {
        chrome.windows.create({
            url: 'https://www.icegate.gov.in/',
            type: 'normal',
            state: 'maximized'
        }, (window) => {
            if (chrome.runtime.lastError) {
                console.error('Window creation error:', chrome.runtime.lastError);
                return;
            }

            const handleTabUpdate = (tabId, changeInfo) => {
                if (changeInfo.status === 'complete') {
                    chrome.tabs.get(tabId, (tab) => {
                        if (chrome.runtime.lastError) {
                            console.error('Tab retrieval error:', chrome.runtime.lastError);
                            return;
                        }

                        if (!tab.url.startsWith('chrome://') && !tab.url.startsWith('edge://')) {
                            chrome.scripting.executeScript({
                                target: { tabId: tabId },
                                func: injectScript
                            }).catch((error) => console.error('Scripting error:', error));

                            chrome.tabs.onUpdated.removeListener(handleTabUpdate);

                            const oneTimeTabUpdate = (newTabId, newChangeInfo) => {
                                if (newChangeInfo.status === 'complete') {
                                    chrome.tabs.get(newTabId, (newTab) => {
                                        if (chrome.runtime.lastError) {
                                            console.error('Tab retrieval error for new tab:', chrome.runtime.lastError);
                                            return;
                                        }

                                        if (!newTab.url.startsWith('chrome://') && !newTab.url.startsWith('edge://')) {
                                            chrome.scripting.executeScript({
                                                target: { tabId: newTabId },
                                                func: injectScriptNotificaton
                                            }).catch((error) => console.error('Scripting error for new tab:', error));

                                            chrome.tabs.onUpdated.removeListener(oneTimeTabUpdate);

                                        }
                                    });
                                }
                            };

                            chrome.tabs.onUpdated.addListener(oneTimeTabUpdate);
                        }
                    });
                }
            };
            chrome.tabs.onUpdated.addListener(handleTabUpdate);
        });
    }
});

function injectScriptNotificaton() {
    const filePath = chrome.runtime.getURL('data/credentials.txt');

    fetch(filePath)
    .then(response => response.text())
    .then(text => {
        const lines = text.split('\n');
        let usernameValue = '';
        let passwordValue = '';

        lines.forEach(line => {
            if (line.startsWith('username:')) {
                usernameValue = line.split(':')[1].trim();
            } else if (line.startsWith('password:')) {
                passwordValue = line.split(':')[1].trim();
            }
        });

        const username = document.getElementById('icegateId');
        const password = document.getElementById('password');
        const loginButton = document.querySelector('.btn.login');

        if (username && password && loginButton) {
            requestAnimationFrame(() => {
                setTimeout(() => {
                    username.value = usernameValue;
                    password.value = passwordValue;

                    const event = new Event('input', { bubbles: true });
                    username.dispatchEvent(event);
                    password.dispatchEvent(event);

                    setTimeout(() => {
                        loginButton.click();
                    }, 600);
                }, 1000);
            });
        }
    })
    .catch(error => console.error('Error reading credentials file:', error));

    const checkLoginSuccess = setInterval(() => {
        const notificatonButton = document.querySelector('li[alt="toolTip"] a');

        if (notificatonButton) {
            clearInterval(checkLoginSuccess);
            notificatonButton.click();
        }
    }, 1000);

}

function injectScriptsb() {
    // alert('entered');
    chrome.storage.local.get(['rowData'], (result) => {
        if (chrome.runtime.lastError) {
            console.error('Storage retrieval error:', chrome.runtime.lastError);
            return;
        }

        const rowData = result.rowData;

        if (Array.isArray(rowData) && rowData.length >= 4) {
            const formattedDate = rowData[2] || '';
            const sbNumber = rowData[3] || ''; 
            const valueToSelect = rowData[1] || '';
            
            const selectElement = document.getElementById('location');
            const dateInput = document.getElementById('sbDATE');
            const sbNumberfield = document.getElementById('sbNO');
            const reloadImg = document.querySelector('img[alt="Reload"]');
            const submitButton = document.getElementById('SubB');

            handleCaptcha();

            if (selectElement) {
                const options = selectElement.options;
                for (let i = 0; i < options.length; i++) {
                    if (options[i].text === valueToSelect) {
                        selectElement.selectedIndex = i;
                        break;
                    }
                }

                const event = new Event('change', { bubbles: true });
                selectElement.dispatchEvent(event);
            } else {
                console.error('Select element with ID "location" not found.');
            }

            if (sbNumberfield) {
                sbNumberfield.value = sbNumber;
            } else {
                console.error('Input field with ID "sbNO" not found.');
            }

            if (dateInput) {
                dateInput.value = formattedDate;

                const event = new Event('input', { bubbles: true });
                dateInput.dispatchEvent(event);
            } else {
                console.error('Input field with ID "sbDATE" not found.');
            }

            if (reloadImg) {
                reloadImg.addEventListener('click', () => {
                    setTimeout(() => { handleCaptcha(); }, 3000);
                });
            } else {
                console.error('Image with alt "Reload" not found.');
            }

            function handleCaptcha() {
                const captchaimg = document.getElementById('capimg');
                if (captchaimg) {
                    const scaleFactor = 10;

                    const canvas = document.createElement('canvas');
                    const context = canvas.getContext('2d');

                    canvas.width = captchaimg.width * scaleFactor;
                    canvas.height = captchaimg.height * scaleFactor;

                    context.drawImage(captchaimg, 0, 0, canvas.width, canvas.height);

                    const scaledCanvas = document.createElement('canvas');
                    const scaledContext = scaledCanvas.getContext('2d');

                    scaledCanvas.width = captchaimg.width;
                    scaledCanvas.height = captchaimg.height;
                    scaledContext.drawImage(canvas, 0, 0, scaledCanvas.width, scaledCanvas.height);

                    scaledCanvas.toBlob(function(blob) {
                        const formData = new FormData();
                        formData.append('image', blob, 'captcha-screenshot.png');

                        const url = 'http://127.0.0.1:9601/captcha';

                        fetch(url, {
                            method: 'POST',
                            body: formData
                        })
                        .then(response => response.json())
                        .then(data => {
                            const captchaResponse = data.captcha.trim().replace(/^"|"$/g, '');

                            const captchaInput = document.getElementById('captchaResp');
                            if (captchaInput) {
                                captchaInput.value = captchaResponse;
                                if (submitButton) {
                                    submitButton.click();
                                } else {
                                    console.log('Submit button with ID "submitButton" not found.');
                                }
                            } else {
                                console.log('Input field with ID "captchaResp" not found.');
                            }
                        })
                        .catch(error => {
                            console.log('Error sending image: ' + error);
                        });
                    }, 'image/png');
                } else {
                    console.log('Image element with ID "capimg" not found.');
                }
            }
        } else {
            console.error('Invalid rowData format');
        }
    });
}    

function injectScript() {
    const logInButton = document.querySelector('.login');
    if (logInButton) {
        logInButton.click();
    } else {
        console.error('Login button not found');
    }
}

function injectScript2() {
    const filePath = chrome.runtime.getURL('data/credentials.txt');

    fetch(filePath)
        .then(response => response.text())
        .then(text => {
            const lines = text.split('\n');
            let usernameValue = '';
            let passwordValue = '';

            lines.forEach(line => {
                if (line.startsWith('username:')) {
                    usernameValue = line.split(':')[1].trim();
                } else if (line.startsWith('password:')) {
                    passwordValue = line.split(':')[1].trim();
                }
            });

            const username = document.getElementById('icegateId');
            const password = document.getElementById('password');
            const loginButton = document.querySelector('.btn.login');

            if (username && password && loginButton) {
                requestAnimationFrame(() => {
                    setTimeout(() => {
                        username.value = usernameValue;
                        password.value = passwordValue;

                        const event = new Event('input', { bubbles: true });
                        username.dispatchEvent(event);
                        password.dispatchEvent(event);

                        setTimeout(() => {
                            loginButton.click();
                        }, 600);
                    }, 1000);
                });
            }
        })
        .catch(error => console.error('Error reading credentials file:', error));

    const observer = new MutationObserver((mutationsList, observer) => {
        const servicesButton = document.getElementById('mat-expansion-panel-header-5');

        if (servicesButton) {
            requestAnimationFrame(() => {
                setTimeout(() => {
                    servicesButton.click();
                    console.log('Clicked services dropdown');

                    setTimeout(() => {
                        const divs = Array.from(document.querySelectorAll('div.mat-tree-node'));
                        const targetDiv = divs.find(div => div.textContent.includes('eSANCHIT'));

                        if (targetDiv) {
                            console.log("Found the target div with text 'eSANCHIT'");
                            const eSANCHITDropdown = targetDiv.querySelector('button.mat-icon-button');
                            if (eSANCHITDropdown) {
                                eSANCHITDropdown.click();
                                console.log('Clicked eSANCHIT dropdown button');

                                const eSANCHITButton = document.evaluate("//a[text()='eSANCHIT']", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                                if (eSANCHITButton) {
                                    eSANCHITButton.click();
                                    console.log("Clicked the <a> element with text 'eSANCHIT'");
                                } else {
                                    console.error("eSANCHIT button not found");
                                }
                            } else {
                                console.error("eSANCHIT dropdown button not found");
                            }
                        } else {
                            console.error("Target div with text 'eSANCHIT' not found");
                        }
                    }, 1000);
                }, 1000);
            });

            observer.disconnect();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
}

function injectScript3() {
    const uploadButton = document.getElementById('modal');
    if (uploadButton) {
        uploadButton.click();
    }
}
