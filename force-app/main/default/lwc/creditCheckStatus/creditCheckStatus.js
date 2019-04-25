import {
    LightningElement,
    track,
    wire
} from 'lwc';

import startCreditCheckRequest from '@salesforce/apexContinuation/CreditCheck.startCreditCheckRequest';

import CREDIT_STATUS_EVENT from '@salesforce/schema/CreditStatus__e';

import {
    subscribe,
    unsubscribe,
    onError,
    setDebugFlag,
    isEmpEnabled
} from 'lightning/empApi';

export default class CreditCheckStatus extends LightningElement {

    @track messages = [];
    replayIds = new Set([]);

    @track imperativeContinuation = {

    };

    // Imperative Call
    callContinuation() {

        this.imperativeContinuation["message"] = "Please wait...";

        startCreditCheckRequest()
            .then(result => {
                this.imperativeContinuation = JSON.parse(result);
            })
            .catch(error => {
                this.imperativeContinuation = error;
            });
    }

    get formattedImperativeResult() {
        window.console.log('Credit score results=' + this.imperativeContinuation);

        return this.imperativeContinuation;
    }

    connectedCallback() {
        window.console.log('Starting CreditCheckStatus Event Processing');

        setDebugFlag(true);

        onError(error => {
            this.log('CreditCheck Status Streaming error: ' + JSON.stringify(error));
        });

        isEmpEnabled().then(response => {
            window.console.log('CreditCheckStatus isEmpEnabled: ' + JSON.stringify(response));
        });

        subscribe('/event/CreditStatus__e', -1, event => {
                window.console.log('On Credit Status event: ' + JSON.stringify(event));
                if (!(this.replayIds.has(event.data.event.replayId))) {
                    this.replayIds.add(event.data.event.replayId);

                    this.log(event.data.payload.message__c);
                }

            })
            .then(response => {
                this.log('Subscribed for Credit Check Events ...');
            });

        window.console.log('Ending Credit Status Event Processing');
    }

    log(message) {
        this.messages.push(message);
    }

    disconnectedCallback() {
        if (this.subscription) {
            unsubscribe(this.subscription, response => {
                window.console.log('Unsubscribed from: ' + response);
                this.subscription = null;
            });
        }
    }
}