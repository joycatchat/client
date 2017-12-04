'use strict';

var app = app || {};
// const __API_URL__ = 'https://joycatchat.herokuapp.com';
const __API_URL__ = 'http://localhost:3000';

(function (module){
  const login = {};

  // Login Event Handler & Loads Profile
  $('#loginform').on('submit', function(e) {
    e.preventDefault();
    login.username = $('#username').val().toLowerCase();
    login.password = $('#password').val();

    $.get(`${__API_URL__}/login`, {'username': login.username, 'password': login.password})
      .then(data => {
        console.log('logged in');
        let usernameWithCase = data.username.slice(0, 1).toUpperCase() + data.username.slice(1);
        $('#validationmsg').text(`Welcome, ${usernameWithCase}!`);

        $('#profile-username').text(data.username);
        $('#profile-name').text(data.name);
        $('#profile-birthdate').text(data.birthdate);
        $('#profile-description').text(data.description);
      })
      .catch(err => console.error(err));
  });

  // Register Event Handler
  $('#registerbutton').on('click', function() {
    login.username = $('#username').val().toLowerCase();
    login.password = $('#password').val();

    $.post(`${__API_URL__}/register`, {'username': login.username, 'password': login.password})
      .then(data => {
        if (data === 'registered') {
          $('#validationmsg').text('Your account has been registered!');
          $('#profile-username').text(login.username);
        }
        else if (data === 'userexists') $('#validationmsg').text('That username already exists. Please try again.');
      })
      .catch(err => console.error(err));
  });

  module.login = login;
})(app);
