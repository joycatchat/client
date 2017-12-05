'use strict';

var app = app || {};
// const __API_URL__ = 'https://joycatchat.herokuapp.com';
const __API_URL__ = 'http://localhost:3000';

(function (module){
  const login = {};

  // Login Event Handler
  $('#loginform').on('submit', function(e) {
    e.preventDefault();
    login.username = $('#username').val().toLowerCase();
    login.password = $('#password').val();

    $.get(`${__API_URL__}/login`, {'username': login.username, 'password': login.password})
      .then(data => {
        if (data === 'usererror') {
          console.log('login: username already exists');
          $('#validationmsg').text('Username does not exist. Please register.');
        }
        else if (data === 'passworderror') {
          console.log('login: password does not match')
          $('#validationmsg').text('Password does not match username. Please try again.');
        }
        else {
          console.log('logged in');
          let usernameWithCase = data.username.slice(0, 1).toUpperCase() + data.username.slice(1);
          app.profile.loadProfile();
          $('#validationmsg').text(`Welcome back, ${usernameWithCase}!`);
          $('#login').hide();
          $('#chat').show();
        }
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
          app.profile.loadProfile();
          $('#validationmsg').text('Welcome! Your account has been registered.');
          $('#login').hide();
          $('#chat').show();
        }
        else if (data === 'userexists') $('#validationmsg').text('That username already exists. Please try again.');
      })
      .catch(err => console.error(err));
  });

  module.login = login;
})(app);
