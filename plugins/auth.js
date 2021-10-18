const allowedDriverPaths = ['/drivers/expeditions'];

export default function ({$auth, app, redirect}) {
  app.router.afterEach((to, from) => {

    if ($auth.loggedIn) {

      if (to.path === '/') redirect('/');

      if ($auth.$state.user[0].user_type !== 'admin' && !allowedDriverPaths.includes(to.path)) setTimeout(() => redirect('/'));

    }
    // if (to.path === '/' && $auth.loggedIn) {
    //   redirect('/')
    // }
  })
  $auth.onError((error, name, endpoint) => {
    if (typeof error.response !== 'undefined') {
      console.error('error', name, error)
    } else {
      console.log('CORS Problem!');
    }
  })
}
