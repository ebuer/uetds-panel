<template>
  <div class="app-login">
    <div class="login-content">
      <div class="left" :style="'background-image: url('+image+')'">
        <div class="overlay"></div>
        <div class="top">
          <h1 class="title">Logistic Panel</h1>
          <h3 class="subtitle">İşini kolaylaştır</h3>
        </div>
        <div class="bottom">

        </div>
      </div>
      <div class="right">
        <v-icon color="blue" class="truck">mdi-truck-fast-outline</v-icon>
        <div>
          <v-toolbar>
            <v-tabs
              dark
              background-color="primary"
              grow
              v-model="tab"
            >
              <v-tab>
                Giriş

              </v-tab>

              <v-tab>
                Kayıt Ol

              </v-tab>

            </v-tabs>
          </v-toolbar>
          <v-tabs-items v-model="tab">
            <v-tab-item>
              <v-card
                class="mx-auto"
                width="400"
                style="padding: 15px; position: relative; z-index: 2">
                <div class="card-title text-center pt-3 pb-3">
                  <h3>Giriş</h3>
                </div>

                <v-form v-model="valid" ref="loginForm" @submit="submit()" onSubmit="return false;">
                  <div>

                    <v-text-field
                      outlined
                      v-model="loginForm.email"
                      :rules="emailRules"
                      append-icon="mdi-account"
                      label="E-posta veya TC"
                      required
                      v-on:keyup.enter="submit()"
                    ></v-text-field>
                  </div>

                  <div>
                    <v-text-field
                      outlined
                      v-model="loginForm.password"
                      :rules="passwordRules"
                      label="Şifre"
                      append-icon="mdi-key"
                      required
                      type="password"
                      v-on:keyup.enter="submit()"
                    ></v-text-field>
                  </div>

                  <v-btn
                    @click="submit()"
                    color="primary"
                    :disabled="buttonLoader"
                    :loading="buttonLoader">
                    Giriş Yap
                  </v-btn>

                </v-form>

                <div class="app-error" v-if="error.login.length > 0">
                  <div v-for="(item, index) in error.login" :key="index">
                    <br>

                    <v-alert type="error"
                             dismissible
                             dense
                             text
                             transition="fade-transition"
                    > Hata! {{ item }}
                    </v-alert>
                  </div>
                </div>

              </v-card>

            </v-tab-item>
            <v-tab-item>
              <v-card
                class="mx-auto"
                width="400"
                style="padding: 15px; position: relative; z-index: 2">
                <div class="card-title text-center pt-3 pb-3">
                  <h3>Kayıt Ol</h3>
                </div>

                <v-form v-model="valid" ref="registerForm" @submit="register()" onSubmit="return false;">
                  <div>

                    <v-text-field
                      outlined
                      v-model="registerForm.name"
                      :rules="nameRules"
                      append-icon="mdi-account"
                      label="İsim Soyisim"
                      required
                      v-on:keyup.enter="register()"
                    ></v-text-field>
                  </div>

                  <div>

                    <v-text-field
                      outlined
                      v-model="registerForm.email"
                      :rules="emailRules"
                      append-icon="mdi-email"
                      label="E-posta"
                      required
                      v-on:keyup.enter="register()"
                    ></v-text-field>
                  </div>

                  <div>
                    <v-text-field
                      outlined
                      v-model="registerForm.password"
                      :rules="passwordRules"
                      label="Şifre"
                      append-icon="mdi-key"
                      required
                      type="password"
                      v-on:keyup.enter="register()"
                    ></v-text-field>
                  </div>

                  <v-btn @click="register()"
                         color="primary"
                         :disabled="buttonLoader"
                         :loading="buttonLoader">
                    Kayıt Ol
                  </v-btn>

                </v-form>


                <div class="app-error" v-if="error.register.length > 0">
                  <div v-for="(item, index) in error.register" :key="index">
                    <br>

                    <v-alert type="error"
                             dismissible
                             dense
                             text
                             transition="fade-transition"
                    > Hata! {{ item }}
                    </v-alert>
                  </div>
                </div>


              </v-card>

            </v-tab-item>
          </v-tabs-items>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
export default {
  layout: "empty",
  name: 'login',
  data() {
    return {
      buttonLoader: false,
      tab: 'login',
      error: {
        login: [],
        register: []
      },
      image: require(`~/assets/images/way.jpg`),
      valid: false,
      nameRules: [
        v => !!v.trim() || 'İsim Zorunludur',
      ],
      passwordRules: [
        v => !!v.trim() || 'Şifre Zorunludur',
      ],
      emailRules: [
        v => !!v.trim() || 'E-posta veya TC Zorunludur',
        // v => /.+@.+/.test(v) || 'Geçerli E-posta giriniz',
      ],
      loginForm: {
        email: '',
        password: '',
      },
      registerForm: {
        email: '',
        password: '',
        name: '',
      },
      loginSubmitting: false,
      registerSubmitting: false,
    }
  },
  methods: {
    submit() {
      const self = this;
      if (!self.loginSubmitting) {
        self.resetError()
        const valid = this.$refs.loginForm.validate();
        if (valid) {
          self.loginSubmitting = true
          self.buttonLoader = true;
          this.$auth.loginWith('local', {data: this.loginForm})
            .then((res) => {
              self.buttonLoader = false
              setTimeout(() => self.loginSubmitting = false, 500)
              self.$router.push('/')
            })
            .catch(err => {
              self.error.login.push('Bilgileriniz uyuşmuyor.')
              self.buttonLoader = false
              self.loginSubmitting = false
            })
        }
      }
    },
    register() {
      const self = this;

      if (!self.registerSubmitting) {
        self.resetError()

        const valid = this.$refs.registerForm.validate();

        if (valid) {
          self.buttonLoader = true;
          self.registerSubmitting = true
          self.$axios.post('register', self.registerForm)
            .then(res => {
              const errors = res.data.error
              if (errors !== undefined) {
                Object.keys(errors).forEach(item => {
                  self.error.register.push(errors[item][0])
                })
              } else {
                this.$auth.loginWith('local', {
                  data: {
                    email: self.registerForm.email,
                    password: self.registerForm.password,
                  }
                }).then(res => {
                  self.$router.push('/')
                })
              }

              self.buttonLoader = false;
              setTimeout(() => self.registerSubmitting = false, 500)

            })
            .catch(err => {
              if (err.response !== undefined) {
                const errors = err.response.data.errors
                if (errors !== undefined) {
                  Object.keys(errors).forEach(item => {
                    self.error.register.push(errors[item][0])
                  })
                }
              } else {
                this.error.register.push('Bilgileriniz kontrol edin.')
              }

              self.buttonLoader = false;
              this.error.register.show = true
              self.registerSubmitting = false
            })
        }
      }

    },
    resetError() {
      this.error.login = [];
      this.error.register = [];
    }
  }
}
</script>

<style lang="scss" scoped>

.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}

.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */
{
  opacity: 0;
}

.app-login {
  .login-content {
    display: flex;
    background-color: #f2f5f8;
    min-height: 100vh;

    .left {
      position: relative;
      width: 30%;
      background-color: #ffffff;
      border-color: #ffffff;
      box-shadow: 0 0 0 0 rgb(85 85 85 / 8%), 0 0 0 0 rgb(85 85 85 / 6%), 0 0 0 0 rgb(85 85 85 / 3%);
      padding: 20px;
      background-size: cover;
      background-position: bottom;
      background-repeat: no-repeat;

      .overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 1;
        background-color: rgba(0, 0, 0, 0.5);
      }


      .top {
        position: relative;
        z-index: 2;

        .title {
          font-size: 3rem !important;
          font-weight: 600 !important;
          color: #f89854;
          line-height: 4rem;
        }

        .subtitle {
          padding-top: 15px;
        }
      }
    }

    .right {
      width: 70%;
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
      overflow: hidden;

      .truck {
        opacity: 0.09;
        font-size: 400px;
        position: absolute;
        bottom: -100px;
        left: -100px;
      }
    }

  }

  @media only screen and (max-width: 700px) {
     .login-content {
      display: block;
       .left {
         position: absolute;
         z-index: 1;
         left: 0;
         right: 0;
         bottom: 0;
         top: 0;
         width: 100%;
       }

       .right {
         width: 100%;
         display: block;
         position: relative;
         z-index: 2;
        padding: 200px 10px 0 10px;
       }
    }
  }
}
</style>
