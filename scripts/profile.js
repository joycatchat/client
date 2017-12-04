var app = app || {};

(function (module){
  const profile = {};

  // Edit Profile Event Handler
  $('#editprofile').on('click', function(e) {
    e.preventDefault();
    console.log('editing profile');
    window.location.href = '#updateprofile';
  });

  // Update Profile Event Handler
  $('#profileform').on('submit', function(e) {
    e.preventDefault();

    $.ajax({
      url: `${__API_URL__}/updateprofile`, //eslint-disable-line
      method: 'PUT',
      data: {'username': app.login.username}
    })
      .then(data => console.log(data))
      .catch(err => console.error(err));
  });

  // Cancel Editing Profile
  $('#cancelupdateprofile').on('click', function() {
    console.log('cancelled editing profile');
    window.location.href = '#profile';
  });

  module.profile = profile;
})(app);
