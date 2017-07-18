//Defensive coding to ensure the code only loads after DOMContent has loaded
$(this).on('DOMContentLoaded', () => {

    //When the page loads, give focus to the first text field
    //$('[type="text"]').first().focus();
    $('#name').focus();

    //Set maximum length for credit card input
    $('#cc-num').attr('maxLength', '16');

    //Set maximum length for zip input
    $('#zip').attr('maxLength', '5');

    //Set maximum length for cvv input
    $('#cvv').attr('maxLength', '3');

    //Select and hide the Your Job Role text field
    const $otherTitle = $('#other-title');
    $otherTitle.hide();

    //Label element that will be displayed when user does not pick a shirt
    const $shirtAlert = $("<label id='shirt-info-error' class='shirt-error'>Don't forget to pick a T-Shirt</label>");
    $shirtAlert.css({ 'font-weight': 'bold', 'color': 'darkred', 'margin-bottom': '1.5em' });


    //Label element that will be displayed when user does not select a payment method
    const $payInfoAlert = $("<label id='pay-info-error' class='pay-error'>Please select a payment method</label>");
    $payInfoAlert.css({ 'font-weight': 'bold', 'color': 'darkred', 'margin-bottom': '1.5em' });

    //Variable that holds all check boxes in the activities fieldset
    const $activityCheckBoxes = $(".activities label input");
    //Variable that holds the total price display element
    const $activitiesTotalPrice = $('<label id="total-price-value">0.00</label>');
    const $activityError = $("<label id='activity-error' class='activity-error'>Please register for at least one activity</label>");
    $activityError.css({ 'font-weight': 'bold', 'color': 'darkred', 'margin-bottom': '1.5em' });
    //Variable that holds the calculated total price for all selected activities
    let totalPrice = 0;

    //When error is encountered then errorClass is added to the form element
    const addErrorClass = (errorClass) => {
        const test = document.getElementsByClassName(errorClass);
        //Ensure the class does not exist so that we add it only once
        if (!test) {
            $('form').addClass(errorClass);
        }
    }

    //When error is cleared for particular input errorClass is removed
    //from form element
    const removeErrorClass = (errorClass) => {
        $('form').removeClass(errorClass);
    }

    //Function to set the styles of the input and label when an error is raised
    //$input is the element receiving input to be validated
    //$label is the label element that will be used to show the error message
    //errorMessage is the text that we want to display to indicate the error
    const showError = ($input, $label, errorMessage) => {
        if ($input) {
            //Add a class form-error that will be looked for 
            //when the user clicks the submit button
            $input.addClass('form-error');
            //Set the style of the input element if the input element is not null
            $input.css({ 'border-color': 'darkred', 'background': 'lightpink' });
        }
        if ($label) {
            //Set the style of the label element 
            $label.css({ 'color': 'darkred', 'font-weight': 'bold' });
            //Set the text of the label element
            if (errorMessage.length > 0) $label.text(errorMessage);
        }
    }

    //Function to reset the styles of the input and label when error is cleared
    //$input is the element whose error we want to clear
    //$label is the label element that was used to display the error message
    //labelText is the text that we want to display on the label
    const clearError = ($input, $label, labelText) => {
        if ($input) {
            //Remove the form-error class for this element
            $input.removeClass('form-error');
            //Reset the style of the input element if the input element is not null
            //by removing the style attribute set by jQuery css() function
            $input.removeAttr('style');
        }
        if ($label) {
            //Reset the style of the label element 
            $label.removeAttr('style');
            //Set the text of the label element
            if (labelText.length > 0) $label.text(labelText);
        }
    }

    //Show or hide the payment option elements by order of the way they 
    //are entered into the function. The first element will be shown
    //the rest will be hidden
    const togglePaymentOptions = ($show, $hide1, $hide2) => {
        $show.show();
        $hide1.hide();
        $hide2.hide();
    }

    //Hides all payment options
    const hidePaymentOptions = () => {
        $('#credit-card').hide();
        $("p:contains('Paypal')").hide();
        $("p:contains('Bitcoin')").hide();
    }

    //Validates input to check whether it fits a pattern for a valid email address
    //Returns false if it fails and true if it passes the test
    const isValidEmailAddress = (emailAddress) => {
        var pattern = /^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
        return pattern.test(emailAddress);
    };

    //Checks if name field is filled. If its empty it will show an error
    //If it is filled it will clear the error message
    const validateName = () => {
        const nameText = $('#name').val();
        if (nameText.length > 0) {
            addErrorClass('name-error');
            clearError($('#name'), $("label[for='name']"), 'Name:');
        } else {
            removeErrorClass('name-error');
            showError($('#name'), $("label[for='name']"), 'Name: (please provide your name)');
        }
    }

    //Using the isValidEmailAddress function it will check the input 
    //if it fails it will show an error message. If it clears the error message
    const validateEmail = () => {
        const addressText = $('#mail').val();
        if (isValidEmailAddress(addressText)) {
            addErrorClass('mail-error');
            clearError($('#mail'), $("label[for='mail']"), 'Email:');
        } else {
            removeErrorClass('mail-error');
            showError($('#mail'), $("label[for='mail']"), 'Email: (please provide a valid email address)');
        }
    }

    //Show an error message if credit card details are not valid
    const showCreditCardError = () => {
        //Check if there the pay-info-error is on display
        let payInfoErrorLabel = document.getElementById('pay-info-error');
        if (!payInfoErrorLabel) {
            addErrorClass('pay-error');
            $payInfoAlert.text('Please enter correct credit card information');
            $payInfoAlert.insertAfter($($('#payment').parent().children(':first-child')));
        } else {
            $('#pay-info-error').text('Please enter correct credit card information');
        }
    }

    //Hides credit card error message if no errors are present
    const hideCreditCardError = () => {
        const ccNumberError = document.querySelector('.cc-num-error');
        const zipError = document.querySelector('.zip-error');
        const cvvError = document.querySelector('.cvv-error');
        if (!ccNumberError && !zipError && !cvvError) {
            $('#pay-info-error').remove();
        }
    }

    //Validates the input on the credit card  number text box
    //Credit card field should only accept a number between 13 and 16 digits 
    //if the test fails an error will display
    const validateCCNumber = () => {
        const ccNumber = $('#cc-num').val();
        let hasError = false;
        if (ccNumber.length >= 13 && ccNumber.length <= 16) {
            removeErrorClass('cc-num-error');
            clearError($('#cc-num'), $("label[for='cc-num']"), 'Card Number:');
        } else if (ccNumber.length === 0) {
            hasError = true;
            addErrorClass('cc-num-error');
            showError($('#cc-num'), $("label[for='cc-num']"), 'Please enter a credit card number');
        } else if (ccNumber.length > 0 && ccNumber.length < 13) {
            hasError = true;
            addErrorClass('cc-num-error');
            showError($('#cc-num'), $("label[for='cc-num']"), 'Card number is between 13 and 16 digits');
        }
        if (hasError) {
            showCreditCardError();
        } else {
            hideCreditCardError();
        }
    }

    //Validates the input on the zip code text box
    //The zip code field should accept a 5-digit number
    //if the test fails an error will display
    const validateZip = () => {
        const zip = $('#zip').val();
        let hasError = false;
        if (zip.length === 0) {
            hasError = true;
            addErrorClass('zip-error');
            showError($('#zip'), $("label[for='zip']"), 'Enter zip code');
        } else if (zip.length > 0 && zip.length < 5) {
            hasError = true;
            addErrorClass('zip-error');
            showError($('#zip'), $("label[for='zip']"), 'Zip is 5 digits');
        } else if (zip.length === 5) {
            removeErrorClass('zip-error');
            clearError($('#zip'), $("label[for='zip']"), 'Zip Code:');
        }
        if (hasError) {
            showCreditCardError();
        } else {
            hideCreditCardError();
        }
    }

    //Validates the input on the CVV text box
    //The CVV should only accept a number that is exactly 3 digits long
    //if the test fails an error will display
    const validateCVV = () => {
        const zip = $('#cvv').val();
        let hasError = false;
        if (zip.length > 0 && zip.length < 3) {
            hasError = true;
            addErrorClass('cvv-error');
            showError($('#cvv'), $("label[for='cvv']"), 'CVV is 3 digits');
        } else if (zip.length === 0) {
            hasError = true;
            addErrorClass('cvv-error');
            showError($('#cvv'), $("label[for='cvv']"), 'Enter CVV');
        } else if (zip.length === 3) {
            removeErrorClass('cvv-error');
            clearError($('#cvv'), $("label[for='cvv']"), 'CVV:');
        }
        if (hasError) {
            showCreditCardError();
        } else {
            hideCreditCardError();
        }
    }

    //Runs validation test based on the id of the target input
    const validateInfo = (event) => {
        const targetId = event.target['id'];
        if (targetId === 'name') {
            validateName();
        } else if (targetId === 'mail') {
            validateEmail();
        } else if (targetId === 'cc-num') {
            validateCCNumber();
        } else if (targetId === 'zip') {
            validateZip();
        } else if (targetId === 'cvv') {
            validateCVV();
        }
    }

    //A text field will be revealed 
    //when the "Other" option is selected from the "Job Role" drop down menu.
    const toggleOtherJobRole = () => {
        //If the selected option is 'Other' show the Your Job Role text input
        //else hide it
        if ($('#title option:selected').text() === 'Other') {
            // const $parent = $(event.target).parent();
            // $parent.append($otherTitle);
            $otherTitle.show();
        } else {
            $('#other-title').hide();
        }
    }

    //Hide the color options
    const hideColorOptions = () => {
        $('#color').hide();
        $("label[for='color']").hide();
    }

    //Show the color options
    const showColorOptions = () => {
        $('#color').show();
        $("label[for='color']").show();
    }

    //Remind user to select a shirt
    const toggleShirtAlert = () => {
        //Try and select all elements with the shirt-selected class
        //If none is found and the alert after the legend element
        //If it is found then remove the alert 
        const $shirtSelected = $('.shirt-selected');
        if ($shirtSelected.length === 0) {
            addErrorClass('shirt-error');
            $shirtAlert.insertAfter('.shirt legend');
        } else {
            removeErrorClass('cc-num-error');
            $shirtAlert.remove();
        }
    }

    //When the user selects shirt design the color option will
    //filter colors available for that design
    const toggleShirtDesign = () => {
        showColorOptions();
        //Get the value attribute of the selected Design option
        const selectedDesign = $('#design option:selected').attr('value');
        //Hide all the Color options. They will be shown only 
        //for the selected design option
        $('#color option').hide();
        //For the JS Puns design select the first three option elements
        //that are children of the color select  and show them.
        //Then scroll to the first option for the js puns design which is on index 0
        if (selectedDesign === 'js puns') {
            $('#color option:nth-child(-n+3)').toggle();
            $('#color').prop('selectedIndex', 0);
            $('#design').addClass('shirt-selected');
        }
        //For the Heart JS design select the last three option elements
        //that are children of the color select and show them.
        //Then scroll to the first option for the heart js design which is on index 3
        else if (selectedDesign === 'heart js') {
            $('#color option:nth-last-child(-n+3)').toggle();
            $('#color').prop('selectedIndex', 3);
            $('#design').addClass('shirt-selected');
        } else {
            hideColorOptions();
            $('#design').removeClass('shirt-selected');
        }
        toggleShirtAlert();
    }

    //Check if user has registered for at least one activity by checking
    //the totalPrice variable. If it is 0 then an alert will warn the user that no
    //activity has been selected
    const toggleActivityAlert = () => {
        //Remove the total price display
        $('#total-price-value').remove();
        $('#activity-error').remove();
        const $parent = $('.activities');
        if (totalPrice > 0) {
            removeErrorClass('activity-error');
            $parent.append($activitiesTotalPrice);
            $('#total-price-value').text('Total Price: $' + totalPrice.toString());
        } else {
            addErrorClass('activity-error');
            const $legend = $('.activities legend');
            $activityError.insertAfter('.activities legend');
        }
    }

    //Display to the user that they need to select a payment method
    const togglePayInfoAlert = () => {
        //Select all elements that have the class payment-selected
        const $selectedMethod = $('.payment-selected');
        //Remove the alert message if its there
        $payInfoAlert.remove();

        removeErrorClass('pay-error');
        //If the are no such elements it means the user has not selected the payment method
        //Add the error message
        if ($selectedMethod.length === 0) {
            addErrorClass('pay-error');
            $payInfoAlert.text('Please select a payment method');
            $payInfoAlert.insertAfter($($('#payment').parent().children(':first-child')));
        }
    }

    //Function that runs all validations when user submits the form
    const validateSubmit = () => {
        validateName();
        validateEmail();
        toggleShirtAlert();
        togglePayInfoAlert();
        toggleActivityAlert();
        if ($('#payment option:selected').text() === 'Credit Card') {
            validateCCNumber();
            validateZip();
            validateCVV();
        }
    }

    //Function to handle selection of activities
    const selectActivities = (event) => {
        //Get the target element
        const checkbox = event.target;
        //Variable to store the boolean value of the checkbox
        const checked = checkbox.checked;
        //Get the checkbox parent node which is its label
        const parent = checkbox.parentNode;
        //Variable to hold the time part of the activity
        let boxTimeComponent = '';
        //variable to hold the price part of the activity (float)
        let boxPriceComponent = 0;
        //Array to hold the time and price components
        //Derived from splitting the label text into two using the character '—' 
        //then the result we select the last portion using the pop() function
        //We then split the result into two again using the ',' character
        //This will result in an array having the time and price descriptions of the activity
        //The label text has a pattern: "Activity name — activity time, price" 
        //e.g. Express Workshop — Tuesday 9am-12pm, $100
        const boxComponents = parent.textContent.split('—').pop().split(',');

        //If the result has both time and price components load the values into the variables
        if (boxComponents.length === 2) {
            boxTimeComponent = boxComponents[0];
            boxPriceComponent = parseFloat(boxComponents[1].split('$').pop());
        }
        //If the result has only one value it must be the price value as we see
        //Main Conference — $200 has only price component
        else if (boxComponents.length === 1) {
            boxPriceComponent = parseFloat(boxComponents[0].split('$').pop());
        }
        //Depending on whether or not we are checking to select the activity
        //the price is added when we select, and subtracted when we unselect the activity
        totalPrice = checked ? totalPrice + boxPriceComponent : totalPrice - boxPriceComponent;
        //Ensure that at least one activity is selected. If not alert the user to choose one
        toggleActivityAlert();
        //Loop through all the check boxes
        for (let i = 0; i < $activityCheckBoxes.length; i++) {
            //Skip the current checkbox by comparing their name attribute
            if ($activityCheckBoxes[i]['name'] != checkbox['name']) {
                //Get the parent label element of the checkbox
                const labelContent = $activityCheckBoxes[i].parentNode.textContent;
                //Get the time and price components
                const components = labelContent.split('—').pop().split(',');
                let timeComponent = '';
                let priceComponent = 0;
                if (components.length === 2) {
                    timeComponent = components[0];
                    priceComponent = parseFloat(components[1].split('$').pop());
                } else if (components.length === 1) {
                    priceComponent = parseFloat(components[0].split('$').pop());
                }
                //If the time components of the current checkbox is the same as another
                //and the current (target) is checked
                //then we shall disable it by setting the disable property to true and
                //setting its parent label class to 'disabled' 
                if (boxTimeComponent === timeComponent) {
                    if (checked) {
                        $activityCheckBoxes[i].disabled = true;
                        $activityCheckBoxes[i].parentNode.className = 'disabled';
                    }
                    //if the target is being unchecked then we will set all activities
                    //with matching time components to be enabled
                    else {
                        $activityCheckBoxes[i].disabled = false;
                        $activityCheckBoxes[i].parentNode.className = '';
                    }
                }
            }
        }
    }

    //Show and hide payment information based on the payment option the user selects
    //using the togglePaymentOptions function
    const selectPaymentOption = () => {
        const selectedOption = $('#payment option:selected').text();
        $('#payment').addClass('payment-selected');
        if (selectedOption === 'Credit Card') {
            togglePaymentOptions($('#credit-card'), $("p:contains('Paypal')"), $("p:contains('Bitcoin')"));
        } else if (selectedOption === 'PayPal') {
            togglePaymentOptions($("p:contains('Paypal')"), $('#credit-card'), $("p:contains('Bitcoin')"));
        } else if (selectedOption === 'Bitcoin') {
            togglePaymentOptions($("p:contains('Bitcoin')"), $('#credit-card'), $("p:contains('Paypal')"));
        } else {
            hidePaymentOptions();
            $('#payment').removeClass('payment-selected');
        }
        togglePayInfoAlert();
    }

    //Hide payment information and wait for user to select the payment option he/she wants
    hidePaymentOptions();

    //Hide the T-shirt color options and wait for the user to select the design
    hideColorOptions();

    //Attach onblur event handler to input elements
    //Cannot attach this to document or form because blur does not bubble
    //onblur is triggered when user leaves a text input
    $("#name, #mail, #cc-num, #zip, #cvv").on('blur', (event) => {
        validateInfo(event);
    });

    //Attach input event handle to handle the action of the user
    //typing into or changing input.
    //Useful to handle the event while the input still has focus(real-time)
    $('form').on('input', (event) => {
        validateInfo(event);
    });

    //Attach the change event handler triggered when user selects an item from a select element
    //or when user checks or un-checks a check-box
    $('form').on('change', (event) => {
        const targetId = event.target['id'];
        const targetType = event.target['type'];
        if (targetType != 'checkbox') {
            if (targetId === 'title') {
                toggleOtherJobRole();
            } else if (targetId === 'design') {
                toggleShirtDesign();
            } else if (targetId === 'payment') {
                selectPaymentOption();
            }
        } else {
            selectActivities(event);
        }
    });

    //Attach the submit event triggered when the user presses the Enter key or
    //clicks on the submit button
    $('form').on('submit', (event) => {
        validateSubmit();
        //Double check before showing success method
        //Check for the class form-error that is added to any input element
        //that has an error
        const formErrors = document.querySelector('.form-error');
        //Check if the activity-error label is being displayed
        const activityError = document.getElementById('activity-error');
        //Check if the shirt-info-error is being displayed
        const shirtError = document.getElementById('shirt-info-error');
        //Check if the pay-info-error is being displayed
        const payError = document.getElementById('pay-info-error');
        //Only allow submit to continue if no errors are found
        if (!formErrors && !activityError && !shirtError && !payError) {
            alert('Your details were successfully submitted.');
        } else {
            event.preventDefault();
        }
    });

});