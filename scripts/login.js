'use strict';

var app = app || {};
const __API_URL__ = 'https://joycatchat.herokuapp.com';
// const __API_URL__ = 'http://localhost:3000';

(function (module){
  const login = {};
  login.loggedIn = false;

  // Init Pages
  login.initIndexPage = () => {
    $('.container').hide();
    if (login.loggedIn) {
      $('#chat').show();
      app.chat.load();
      $('.chat-username').off('click');
      $('.chat-username').on('click', (e) => {
        console.log('hello');
      });
      $('#refresh').off('click');
      $('#refresh').on('click', () => window.location.reload());
    } else {
      $('#login').show();
      clearInterval(app.chat.chatInterval);
      $('#validationmsg').text('Please log in to view the chat or your profile!');
    }
  }

  login.initProfilePage = () => {
    $('.container').hide();
    clearInterval(app.chat.chatInterval);
    if (login.loggedIn) {
      $('#profile').show();
      $('#messages').show();
      app.messages.loadMessages();
    } else {
      $('#login').show();
      $('#validationmsg').text('You need to be logged in to access your profile.');
    }
  }

  // Login Event Handler
  $('#loginbutton').on('click', function() {
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
          login.loggedIn = true;
          let usernameWithCase = data.username.slice(0, 1).toUpperCase() + data.username.slice(1);
          app.profile.loadProfile();
          $('#validationmsg').html(`Welcome back, ${usernameWithCase}! [ <a href="#" id="refresh">Log Out</a> ]`);
          login.initIndexPage();
        }
      })
      .catch(err => console.error(err));
  });

  // Register Event Handler
  $('#loginform').on('submit', function(e) {
    e.preventDefault();
    login.username = $('#username').val().toLowerCase();
    login.password = $('#password').val();

    $.post(`${__API_URL__}/register`, {'username': login.username, 'password': login.password})
      .then(data => {
        if (data === 'registered') {
          console.log('user registered: ', data);
          login.loggedIn = true;
          app.profile.loadProfile();
          $('#validationmsg').text('Welcome! Your account has been registered. [ <a href="#" id="refresh">Log Out</a> ]');
          login.initIndexPage();
        }
        else if (data === 'userexists') $('#validationmsg').text('That username already exists. Please try again.');
      })
      .catch(err => console.error(err));
  });

  module.login = login;
})(app);
