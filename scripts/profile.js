var app = app || {};

(function (module){
  const profile = {};
  profile.avatars = ['0.png', '1.png', '2.png', '3.png', '4.png', '5.png', '6.png', '7.png', '8.png'];
  profile.avatarsFolder = 'https://joycatchat.github.io/client/images/avatars/';

  // Load Profile
  profile.loadProfile = () => { //eslint-disable-line
    $.get(`${__API_URL__}/loadprofile`, {'username': app.login.username}) // eslint-disable-line
      .then(data => {
        console.log('profile loaded');

        profile.username = data.username;
        profile.avatar = data.avatar;
        profile.name = data.name;
        profile.birthdate = data.birthdate;
        profile.description = data.description;

        $('#profile-username').text(data.username);
        if (profile.avatar) $('#profile-avatar').attr('src', data.avatar);
        $('#profile-name').text(data.name);
        $('#profile-birthdate').text(data.birthdate);
        $('#profile-description').text(data.description);
      })
      .catch(err => console.error(err));
  }

  // Edit Profile Event Handler
  $('#editprofile').on('click', function(e) {
    e.preventDefault();
    console.log('editing profile');
    $('#profile').hide();
    $('#updateprofile').show();
    $('#messages').hide();
    $('#avatar-div').hide();
    $('#selectavatar').show();
    $('#hideavatars').hide();

    $('#updateprofile-currentavatar').attr('src', profile.avatar);
    $('#updateprofile-name').val(profile.name);
    $('#updateprofile-birthdate').val(profile.birthdate);
    $('#updateprofile-description').val(profile.description);

  });

  // Update Profile Avatar Selection
  function selectAvatar() {
    $('#selectavatar').on('click', () => {
      $('#avatar-div').show();
      $('#selectavatar').hide();
      $('#hideavatars').show();
    });
    $('#hideavatars').on('click', () => {
      $('#avatar-div').hide();
      $('#selectavatar').show();
      $('#hideavatars').hide();
    });

    for (let i in profile.avatars) {
      $('#avatar-div').append(`<input type="radio" name="updateprofile-avatar" value="${profile.avatars[i]}" id="radio-avatar${i}"/><label for="${profile.avatars[i]}"><img id="avatar${i}" src="${profile.avatarsFolder}${profile.avatars[i]}" /></label>`);

      $(`#avatar${i}`).on('click', function() {
        $('#avatar-div input[type="radio"]').attr('checked', false);
        $(`#radio-avatar${i}`).attr('checked', 'checked');
        profile.avatar = $('#avatar-div [name="updateprofile-avatar"]:checked').val();
      });
    }

    // $.ajax({
    //   url: profile.avatarsFolder
    // })
    //   .then(data => {
    //     $(data).find('a').attr('href', function(i, val) {
    //       if (val.match(/\.(jpe?g|png|gif)$/)) profile.avatars.push(val);
    //     });
    //
    //     for (let i in profile.avatars) {
    //       $('#avatar-div').append(`<input type="radio" name="updateprofile-avatar" value="${profile.avatars[i]}" id="radio-avatar${i}"/><label for="${profile.avatars[i]}"><img id="avatar${i}" src="${profile.avatars[i]}" /></label>`);
    //
    //       $(`#avatar${i}`).on('click', function() {
    //         $('#avatar-div input[type="radio"]').attr('checked', false);
    //         $(`#radio-avatar${i}`).attr('checked', 'checked');
    //         profile.avatar = $('#avatar-div [name="updateprofile-avatar"]:checked').val();
    //       });
    //     }
    //   })
    // .catch(err => console.error(err));
  }
  selectAvatar();

  // Update Profile Event Handler
  $('#profileform').on('submit', function(e) {
    e.preventDefault();

    $('#updateprofile').hide();
    $('#profile').show();
    $('#messages').show();

    profile.name = $('#updateprofile-name').val().replace(`\'`, `''`); //eslint-disable-line
    profile.birthdate = $('#updateprofile-birthdate').val().replace(`\'`, `''`); //eslint-disable-line
    profile.description = $('#updateprofile-description').val().replace(`\'`, `''`); //eslint-disable-line

    let obj = {'username': app.login.username, 'avatar': profile.avatar, 'name': profile.name, 'birthdate': profile.birthdate, 'description': profile.description};

    $.ajax({
      url: `${__API_URL__}/updateprofile`, //eslint-disable-line
      method: 'PUT',
      data: obj
    })
      .then(data => {
        console.log(data);
        profile.loadProfile();
      })
      .catch(err => console.error(err));
  });

  // Cancel Editing Profile
  $('#cancelupdateprofile').on('click', function() {
    app.login.initProfilePage();
    console.log('cancelled editing profile');
  });

  // Show Other Profiles
  profile.showOtherProfiles = (user) => {
    $.get(`${__API_URL__}/showotherprofile`, {'username': user}) // eslint-disable-line
      .then(data => {
        console.log('other profile loaded', data.username);

        $('#modal').show();
        $('#modal-profile').show();
        $('#modal-messages').hide();
        $('#modal-username').text(data.username);
        if (data.avatar) $('#modal-avatar').attr('src', data.avatar);
        $('#modal-name').text(data.name);
        $('#modal-birthdate').text(data.birthdate);
        $('#modal-description').text(data.description);

        profile.messageTo = data.username;
        $('#modal-message-button').empty();
        $('#modal-message-button').html(`<button id="modal-privatemessage" onclick="app.messages.sendPM(${'app.profile.messageTo'})">Send Message</button>`);

        $('#close-profile').off('click');
        $('#close-profile').on('click', () => $('#modal').hide())
      })
      .catch(err => console.error(err));
  }

  module.profile = profile;
})(app);
