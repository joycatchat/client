var app = app || {};

(function (module){
  const profile = {};
  profile.avatars = [];
  profile.avatarsFolder = 'images/avatars/';

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
        $('#profile-avatar').attr('src', data.avatar);
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
    $('#avatar-div').hide();
    $('#selectavatar').show();
    $('#hideavatars').hide();

    $('#updateprofile-currentavatar').attr('src', profile.avatar);
    $('#updateprofile-name').attr('placeholder', profile.name);
    $('#updateprofile-birthdate').attr('placeholder', profile.birthdate);
    $('#updateprofile-description').attr('placeholder', profile.description);

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

    $.ajax({
      url: profile.avatarsFolder
    })
      .then(data => {
        $(data).find('a').attr('href', function(i, val) {
          if (val.match(/\.(jpe?g|png|gif)$/)) profile.avatars.push(val);
        });

        for (let i in profile.avatars) {
          $('#avatar-div').append(`<input type="radio" name="updateprofile-avatar" value="${profile.avatars[i]}" id="radio-avatar${i}"/><label for="${profile.avatars[i]}"><img id="avatar${i}" src="${profile.avatars[i]}" /></label>`);

          $(`#avatar${i}`).on('click', function() {
            $('#avatar-div input[type="radio"]').attr('checked', false);
            $(`#radio-avatar${i}`).attr('checked', 'checked');
            profile.avatar = $('#avatar-div [name="updateprofile-avatar"]:checked').val();
          });
        }
      })
      .catch(err => console.error(err));
  }
  selectAvatar();

  // Update Profile Event Handler
  $('#profileform').on('submit', function(e) {
    e.preventDefault();

    $('#updateprofile').hide();
    $('#profile').show();

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
    console.log('cancelled editing profile');
  });

  // Show Other Profiles
  profile.showOtherProfiles = (user) => {
    console.log(user);
    $.get(`${__API_URL__}/showotherprofile`, {'username': user}) // eslint-disable-line
      .then(data => {
        console.log('other profile loaded', data);

        $('#modal').show();
        $('#modal-username').text(data.username);
        if (data.avatar) $('#modal-avatar').attr('src', data.avatar);
        $('#modal-name').text(data.name);
        $('#modal-birthdate').text(data.birthdate);
        $('#modal-description').text(data.description);
      })

    $('#close-modal').off('click');
    $('#close-modal').on('click', () => $('#modal').hide())
      .catch(err => console.error(err));
  }

  module.profile = profile;
})(app);
