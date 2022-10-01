$(document).ready(function () {
    $('#loginform').submit(function (event) {
        var mobile = $('#mobile').val()
        var number = $.isNumeric(mobile)
        if (mobile == '' || mobile == null) {
            $('#mobile-error').text('This filed required')
            $('#mobile-error').show()
            event.preventDefault();
        } else if (number == false) {
            $('#mobile-error').text('Please enter Numbers')
            $('#mobile-error').show()
            event.preventDefault();
        } else if (mobile.length < 10) {
            $('#mobile-error').text('Enter minimum 10 Characters')
            $('#mobile-error').show()
            event.preventDefault();
        } else {
            $('#mobile-error').hide()
        }
        var password = $('#password').val()
        if (password == '' || password == null) {
            $('#password-error').text('This filed is requied')
            $('#password-error').show()
            event.preventDefault();
        } else if (password.length < 8) {
            $('#password-error').text('Please Enter atlest 8 characters')
            $('#password-error').show()
            event.preventDefault();
        } else {
            $('#passwrod-error').hide()
        };
    })
    $('#signupform').submit(function (event) {
        var smoible = $('#mobile').val()
        var firstname = $('#firstname').val()
        var lastname = $('#lastname').val()
        var email = $('#email').val()
        var password = $('#password').val()
        var conformpassword = $('#conformpassword').val()
        var mobilenumber = $.isNumeric(smoible)
        var firstnamenumber = $.isNumeric(firstname)
        var lastnamenumber = $.isNumeric(lastname)
        var emailfilter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.) +([a-zA-Z0-9]{2,4})+$/;
        if (smoible == '' || smoible == null) {
            $('#mobile-error').text('This filed is required')
            $('#mobile-error').show()
            event.preventDefault();
        } else if (mobilenumber == false) {
            $('#mobile-error').text('Please enter Numbres')
            $('#mobile-error').show()
            event.preventDefault();
        } else if (smoible.length < 10) {
            $('#mobile-error').text('Please enter atleast 10 numbers')
            $('#mobile-error').show()
            event.preventDefault();
        } else {
            $('#mobile-error').hide()
        }
        if (firstname == '' || firstname == null) {
            $('#firstname-error').text('This filed is required')
            $('#firstname-error').show()
            event.preventDefault();
        } else if (firstnamenumber) {
            $('#firstname-error').text('Please enter charactes')
            $('#firstname-error').show()
            event.preventDefault();
        } else if (firstname.length < 6) {
            $('#firstname-error').text('First name atleast 6 charactrs need')
            $('#firstname-error').show()
            event.preventDefault();
        } else {
            $('#firstname-error').hide()
        }
        if (lastname == '' || lastname == null) {
            $('#lastname-error').text('Please Enter Last Name')
            $('#lastname-error').show()
            event.preventDefault();
        } else if (lastnamenumber) {
            $('#lastname-error').text('Please enter charactes')
            $('#lastname-error').show()
            event.preventDefault();
        }  else if (lastname.length < 6) {
            $('#lastname-error').text('Enter atleast 6 charecters')
            $('#lastname-error').show()
            event.preventDefault();
        } else {
            $('#lastname-error').hide()
        }
        if (email == '' || email == null) {
            $('#email-error').text('Please Enter Email')
            $('#email-error').show()
            event.preventDefault();
        } else if (validateEmailAddress(email) === -1) {
            $('#email-error').text('Please Enter a Valide Email')
            $('#email-error').show()
            event.preventDefault();
        } else {
            $('#email-error').hide()
        }
        if (password == '' || password == null) {
            $('#password-error').text('This Filed is required')
            $('#password-error').show()
            event.preventDefault();
        } else if (password.length < 8) {
            $('#password-error').text('please Enter atleast 8 Characters')
            $('#password-error').show()
            event.preventDefault();
        } else {
            $('#password-error').hide()
        }
        if (conformpassword == '' || conformpassword == null) {
            $('#conformpassword-error').text('Please Retype Your Password')
            $('#conformpassword-error').show()
            event.preventDefault();
        } else if (password != conformpassword) {
            $('#conformpassword-error').text('Please Enter Same Password')
            $('#conformpassword-error').show()
            event.preventDefault();
        } else {
            $('#conformpassword-error').hide()
        }

    })

    function validateEmailAddress(input) {
        var regex = /[^\s@]+@[^\s@]+\.[^\s@]+/;
        if (regex.test(input)) {
            return 1;
        } else {
            return -1;
        }
    }
    $("body").on('click', '.toggle-password', function () {
        $(this).toggleClass("fa fa-eye-slash");
        var input = $("#password");
        if (input.attr("type") === "password") {
            input.attr("type", "text");
        } else {
            input.attr("type", "password");
        }

    });
})