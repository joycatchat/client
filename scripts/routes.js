if (window.location.pathname !== '/') {
  console.log('gh pages detected')
  page.base('/client')
}

page('/', ctx => app.login.initIndexPage(ctx));
page('/profile', ctx => app.login.initProfilePage(ctx))

page();
