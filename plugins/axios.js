export default function ({$axios, redirect, $auth}) {

  $axios.all = function all(promises) {
    return Promise.all(promises);
  };
  // $axios.setHeader('Origin', 'http://192.168.56.1');
  $axios.spread = (callback) => {
    return function wrap(arr) {
      return callback.apply(null, arr);
    }
  };
  $axios.onError(error => {
    if (typeof error.response !== 'undefined') {
      if (error.response.status === 401 || error.response.status === 500) {
        if ($auth.loggedIn) {
          $auth.logout();
        }
        redirect('/login')
      }
    } else {
      console.log('CORS Problem!');
    }
  })
}
