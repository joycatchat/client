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
    login.password = $('#password').val().toLowerCase();

    $.get(`${__API_URL__}/login`, {'username': login.username, 'password': login.password})
      .then(data => {console.log(data)})
      .catch(err => console.error(err));
  });

  module.login = login;
})(app);
