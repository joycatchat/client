var app = app || {};

(function (module){
  const chat = {};
  chat.all = [];

  $('#chatform').on('submit', (e) => {
    e.preventDefault();
    if (chat.all.length >= 50) chat.all.shift();

    let message = `<span class="chat-username" title="${new Date(Date.now())}" onclick="app.profile.showOtherProfiles($(this).text())">${app.login.username}</span>: <span class="chat-text">${$('#chat-input').val()}</span><br />`;
    chat.all.push(message);
    chat.update();
  });

  chat.update = () => {
    $.ajax({
      url: `${__API_URL__}/updatechat`, //eslint-disable-line
      method: 'PUT',
      data: {messages: JSON.stringify(chat.all)}
    })
      .then(data => {
        console.log('updated: ', data);
        chat.load();
      })
      .catch(err => console.error(err));
  }

  chat.load = () => {
    console.log('chat loaded');
    clearInterval(chat.chatInterval);
    chat.chatInterval = setInterval(chat.load, 5000);
    $.get(`${__API_URL__}/loadchat`) //eslint-disable-line
      .then(data => {
        if (data[0].messages) {
          $('#chatwindow').empty();
          data = JSON.parse(JSON.parse(data[0].messages));
          chat.all = data;
          data.forEach(el => $('#chatwindow').append(el));
          let scrollTo = document.getElementById('chatwindow');
          scrollTo.scrollTop = scrollTo.scrollHeight;

        }
      })
      .catch(err => console.error(err));
  }

  module.chat = chat;
})(app);
