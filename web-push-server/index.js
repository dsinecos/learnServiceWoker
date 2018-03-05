console.log("Index.js loaded");

/*
*
*  Push Notifications codelab
*  Copyright 2015 Google Inc. All rights reserved.
*
*  Licensed under the Apache License, Version 2.0 (the "License");
*  you may not use this file except in compliance with the License.
*  You may obtain a copy of the License at
*
*      https://www.apache.org/licenses/LICENSE-2.0
*
*  Unless required by applicable law or agreed to in writing, software
*  distributed under the License is distributed on an "AS IS" BASIS,
*  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
*  See the License for the specific language governing permissions and
*  limitations under the License
*
*/

/* eslint-env browser, es6 */

'use strict';

const applicationServerPublicKey = 'BOeUa0nA3wGgRmBPaoIU7HFyFMq1fS-mrnN8dfU9MP4a9klwSklGu0jwh7Sfj70knFBbjSwiMcna4j23I_aVawQ';

const pushButton = document.querySelector('.js-push-btn');

let isSubscribed = false;
let swRegistration = null;

// console.log("Understanding the navigator object");
// console.log(navigator.onLine);

function urlB64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

if ('serviceWorker' in navigator && 'PushManager' in window) {
    console.log('Service worker and Push is supported');

    console.log(navigator);
    console.log(window);

    navigator.serviceWorker.register('service-worker.js')
        .then(function (swReg) {

            console.log("Service worker is registered ", swReg);

            swRegistration = swReg;
            initializeUI();
        })
        .catch(function (error) {
            console.log("Service worker error ", error);

        })
} else {
    console.warn("Push messsaging is not supported");
    pushButton.textContent = 'Push Button not supported';
}

function initializeUI() {

    pushButton.addEventListener('click', function () {
        pushButton.disabled = true;

        if (isSubscribed) {
            // Unsubscribe user
        } else {
            subscribeUser();
        }
    })

    swRegistration.pushManager.getSubscription()
        .then(function (subscription) {
            isSubscribed = !(subscription === null);

            if (isSubscribed) {
                console.log("User is subscribed");
            } else {
                console.log("User is not subscribed");
            }

            updateBtn();

        })
}

function updateBtn() {
    if (Notification.permission === 'denied') {
        pushButton.textContent = 'Push Messaging Blocked.';
        pushButton.disabled = true;
        updateSubscriptionOnServer(null);
        return;
    }

    if (isSubscribed) {
        pushButton.textContent = 'Disable Push Messaging';
    } else {
        pushButton.textContent = 'Enable Push Messaging';
    }

    pushButton.disabled = false;
}

function subscribeUser() {
    const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);

    swRegistration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: applicationServerKey
    })
        .then(function (subscription) {
            console.log("User is subscribed");

            updateSubscriptionOnServer(subscription);

            isSubscribed = true;

            updateBtn();
        })
        .catch(function (error) {
            console.log("Failed to subscribe the user ", error);
            updateBtn();
        });
}

function updateSubscriptionOnServer(subscription) {

    // const subscriptionJson = document.querySelector('.js-subscription-json');
    // const subscriptionDetails = document.querySelector('.js-subscription-details');

    // if (subscription) {
    //     subscriptionJson.textContent = JSON.stringify(subscription);
    //     subscriptionDetails.classList.remove('is-invisible');
    // } else {
    //     subscriptionDetails.classList.add('is-invisible');
    // }

    console.log(JSON.stringify(subscription, null, "  "));

    return fetch('/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        // body: {
        //     pushSubscription: JSON.stringify(subscription)
        // },
        body: JSON.stringify(subscription)
    })
        .then(function (response) {
            console.log(response);
            console.log(response.status);
            // console.log(response.body);
        })

}


