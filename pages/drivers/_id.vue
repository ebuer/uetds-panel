<template>
  <div class="app-page create">
    <app-page :title="moduleInfo.title">
      <div class="app-create">

        <v-skeleton-loader
          v-if="getLoader"
          type="card"
        ></v-skeleton-loader>


        <v-form v-else class="app-form" v-model="validForm" ref="pageForm">

          <div class="app-form-group">
            <v-text-field
              class="app-form-item"
              outlined
              v-model="form.tc_no"
              :rules="rules.tc_no"
              label="TC No"
              required
              v-on:keyup.enter="submit()"
              v-mask="'###########'"
            ></v-text-field>

          </div>


          <div class="app-form-group">
            <v-text-field
              class="app-form-item"
              outlined
              v-model="form.name_surname"
              :rules="rules.required"
              label="İsim Soyisim"
              required
              v-on:keyup.enter="submit()"
            ></v-text-field>
          </div>

          <div class="app-form-group">
            <v-text-field
              class="app-form-item"
              append-icon="mdi-map-marker"
              @click:append="generatePassword()"
              hint="Sürücünün siteme giriş yapabilmesi için şifre girin"
              persistent-hint
              outlined
              v-model="form.password"
              :rules="rules.password"
              label="Şifre"
              required
              v-on:keyup.enter="submit()"
            ></v-text-field>
          </div>



          <div class="app-form-submit">
            <v-btn @click="submit()"
                   color="primary"
                   :disabled="loader"
                   :loading="loader">
              Güncelle
            </v-btn>
          </div>

        </v-form>


        <div class="app-error" v-if="error.length > 0">
          <div v-for="(item, index) in error" :key="index">
            <br>

            <v-alert type="error"
                     dismissible
                     dense
                     text
                     transition="fade-transition"
            > Hata! {{ item}}
            </v-alert>
          </div>
        </div>

      </div>
    </app-page>
  </div>
</template>

<script>
  export default {
    name: 'drivers-edit',
    data() {
      return {
        getLoader: true,
        submitting: false,
        error: [],
        validForm: false,
        loader: false,
        moduleInfo: {
          title: 'Sürücü Güncelleme',
          titleShowVal: 'tc_no',
          getByIdEndpoint: 'drivers',
          formEndpoint: 'drivers/update',
          routeAfterSuccess: '/drivers',
          successShowKey: 'tc_no',
          successShowText: ' Tc Nolu Sürücü Güncellendi'
        },
        form: {
          tc_no: '',
          name_surname: '',
          password: '',
        },
        rules: {
          required: [
            v => !!v.trim() || 'Alan Zorunludur',
          ],
          tc_no: [
            v => !!v.trim() || 'Alan Zorunludur',
            v => v.length === 11 || '11 Haneli Alan giriniz',
          ],
          password: [
            v => !!v.trim() || 'Alan Zorunludur',
            v => v.length > 5 || 'En az 6 karakter giriniz',
          ]
        }
      }
    },
    created() {
      const self = this;

      if (self.$route.params.id === undefined) {
        self.$router.push('/')
      } else {
        self.$axios.get(self.moduleInfo.getByIdEndpoint + '/' + self.$route.params.id)
          .then(res => {
            const data = res.data.data[0];

            self.moduleInfo.title = self.moduleInfo.title + ' - ' + data[self.moduleInfo.titleShowVal]
            self.form = data
            self.getLoader = false

          })
      }
    },
    methods: {
      generatePassword() {
        var length = 6,
          charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
          retVal = "";
        for (var i = 0, n = charset.length; i < length; ++i) {
          retVal += charset.charAt(Math.floor(Math.random() * n));
        }
        this.form.password =  retVal;
      },
      resetError() {
        const self = this;
        self.error = [];
      },
      submit() {
        const self = this;

        if (!self.submitting) {

          self.resetError()


          const valid = this.$refs.pageForm.validate();

          if (valid) {
            self.submitting = true;
            self.loader = true;

            self.$axios.put(self.moduleInfo.formEndpoint + '/' + self.form.id, self.form)
              .then(res => {

                const errors = res.data.error
                if (errors !== undefined) {
                  Object.keys(errors).forEach(item => {
                    self.error.push(errors[item][0])
                  })
                } else {

                  if (res.data.updatedId !== undefined) {

                    self.$store.dispatch('openSnackbar', {
                      text: self.form[self.moduleInfo.successShowKey] + self.moduleInfo.successShowText
                    });

                    setTimeout(() => {
                      self.$router.push(self.moduleInfo.routeAfterSuccess)
                    })
                  } else {
                    self.error.push('Bilgileriniz kontrol edin.')
                    self.loader = false;
                  }

                }

                self.loader = false;
                setTimeout(() => self.submitting = false, 500)

              })
              .catch(err => {
                self.error.push('Bilgileriniz kontrol edin.')
                self.loader = false;
                self.submitting = false
              })

          }

        }

      }
    }
  }
</script>
