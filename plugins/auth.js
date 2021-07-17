export default function ({$auth, app, redirect}) {
  app.router.afterEach((to, from) => {
    if (to.path === '/' && $auth.loggedIn) {
      redirect('/')
    }
  })
  $auth.onError((error, name, endpoint) => {
    if (typeof error.response !== 'undefined') {
      console.error('error', name, error)
    } else {
      console.log('CORS Problem!');
    }
  })
}
