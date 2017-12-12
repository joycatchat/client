var app = app || {};

(function (module){
  const messages = {};

  // messages.showmsg = (id) => id.toggle();

  messages.loadMessages = () => {
    $.get(`${__API_URL__}/loadreceivedmessages`, {'username': app.login.username}) //eslint-disable-line
      .then(data => {
        console.log('received messages loaded');
        if (data[0]) {
          $('#yourreceivedmessages').remove();
          $('.receivedmessagestablemessages').remove();
          for (let i = 0; i < data.length; i++) {
            $('#receivedmessagestableheader').after(`<tr class="receivedmessagestablemessages" onclick="$('#receivedmsg${i}').toggle()"><td>${data[i].msgfrom}</td><td>${data[i].msgto}</td><td>${data[i].title}</td><td>${data[i].date}</td></tr><tr class="receivedmessagestablemessages" id="receivedmsg${i}"><td colspan="4">${data[i].message}</td></tr>`);
          }
        }
      })
      .catch(err => console.error(err));

    $.get(`${__API_URL__}/loadsentmessages`, {'username': app.login.username}) //eslint-disable-line
      .then(data => {
        console.log('sent messages loaded');
        if (data[0]) {
          $('#yoursentmessages').remove();
          $('.sentmessagestablemessages').remove();
          for (let i = 0; i < data.length; i++) {
            $('#sentmessagestableheader').after(`<tr class="sentmessagestablemessages" onclick="$('#sentmsg${i}').toggle()"><td>${data[i].msgfrom}</td><td>${data[i].msgto}</td><td>${data[i].title}</td><td>${data[i].date}</td></tr><tr class="sentmessagestablemessages" id="sentmsg${i}"><td colspan="4">${data[i].message}</td></tr>`);
          }
        }
      })
      .catch(err => console.error(err));
  }

  messages.sendPM = (messageTo) => {
    $('#modal').show();
    $('#modal-profile').hide();
    $('#modal-messages').show();
    $('#messageto').val('');
    $('#messagetitle').val('');
    $('#messagetext').val('');
    $('#messageform').show();
    $('#msgformvalidation').empty();

    $('#close-messages').off('click');
    $('#close-messages').on('click', () => $('#modal').hide())

    if (typeof messageTo !== 'object') $('#messageto').val(messageTo);

    $('#messageform').off('submit');
    $('#messageform').on('submit', (e) => {
      e.preventDefault();
      $('#messageform').hide();

      let msgto = $('#messageto').val().toLowerCase().replace(`\'`, `''`); //eslint-disable-line
      let msgtitle = $('#messagetitle').val().replace(`\'`, `''`); //eslint-disable-line
      let msgtext = $('#messagetext').val().replace(`\'`, `''`); //eslint-disable-line
      let msgdate = new Date(Date.now()).toLocaleDateString() + ' ' + new Date(Date.now()).toLocaleTimeString();

      let obj = {'msgfrom': app.login.username.toLowerCase(), 'msgto': msgto, 'date': msgdate, 'title': msgtitle, 'message': msgtext};

      $.post(`${__API_URL__}/sendmessage`, obj) //eslint-disable-line
        .then(data => {
          console.log(data)
          if (data === 'message sent') {
            $('#msgformvalidation').text('Thank you, your message has been sent.');
            messages.loadMessages();
          }
          else if (data === 'no user') $('#msgformvalidation').text('The user you are trying to message does not exist. Please try again.');
        })
        .catch(err => console.error(err));
    });
  }

  $('#sendnewmessage').off('click');
  $('#sendnewmessage').on('click', messages.sendPM);

  module.messages = messages;
})(app);
