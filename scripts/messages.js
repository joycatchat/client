var app = app || {};

(function (module){
  const messages = {};

  messages.loadMessages = () => {

  }

  messages.sendPM = (messageTo) => {
    $('#modal').show();
    $('#modal-profile').hide();
    $('#modal-messages').show();
    $('#messageto').val('');
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

      let msgto = $('#messageto').val().replace(`\'`, `''`); //eslint-disable-line
      let msgtext = $('#messagetext').val().replace(`\'`, `''`); //eslint-disable-line
      let obj = {'msgfrom': app.login.username, 'msgto': msgto, 'date': new Date(Date.now()), 'message': msgtext};

      $.post(`${__API_URL__}/sendmessage`, obj) //eslint-disable-line
        .then(data => {
          console.log(data)
          if (data === 'message sent') $('#msgformvalidation').text('Thank you, your message has been sent.');
          else if (data === 'no user') $('#msgformvalidation').text('The user you are trying to message does not exist. Please try again.');

        })
        .catch(err => console.error(err));
    });
  }

  $('#sendnewmessage').off('click');
  $('#sendnewmessage').on('click', messages.sendPM);

  module.messages = messages;
})(app);
