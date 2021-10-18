<template>
  <div class="app-page create">
    <app-page :title="moduleInfo.title">

      <div class="app-create">

        <div v-if="!ready" class="text-center">
          <v-progress-circular
            :size="50"
            color="primary"
            indeterminate
          ></v-progress-circular>
        </div>

        <v-form v-else class="app-form" v-model="validForm" ref="pageForm" v-on:submit.prevent="submit()">


          <div class="app-form-group">
            <v-text-field
              class="app-form-item"
              outlined
              v-model="form.email"
              label="E-posta"
              readonly
              disabled
            ></v-text-field>
          </div>


          <div class="app-form-group">
            <v-text-field
              class="app-form-item"
              outlined
              v-model="user_type_string"
              label="Kullanıcı Tipi"
              readonly
              disabled
            ></v-text-field>
          </div>

          <div class="app-form-group">
            <v-text-field
              class="app-form-item"
              outlined
              v-model="form.name"
              :rules="rules.required"
              label="İsim Soyisim"
            ></v-text-field>
          </div>

          <div class="app-form-group">
            <v-text-field
              class="app-form-item"
              outlined
              v-model="form.title"
              label="Şirket İsim"
            ></v-text-field>
          </div>


          <div class="app-form-group">
            <v-text-field
              class="app-form-item"
              outlined
              v-model="form.address"
              label="Adres"
            ></v-text-field>
          </div>

          <div class="app-form-group">
            <v-alert
              style="margin: 0 0 15px 0;"
              dense
              outlined
              type="info"
            >
              E devlet bilgileri
            </v-alert>
          </div>

          <div class="app-form-group">
            <v-text-field
              class="app-form-item"
              outlined
              v-model="form.tax_administration"
              :rules="rules.required"
              label="Vergi Dairesi"
            ></v-text-field>
          </div>


          <div class="app-form-group">
            <v-text-field
              class="app-form-item"
              outlined
              v-model="form.tax_number"
              :rules="rules.required"
              label="Vergi Numarası"
            ></v-text-field>
          </div>

          <div class="app-form-group">
            <v-text-field
              class="app-form-item"
              outlined
              v-model="form.ws_user_name"
              :rules="rules.required"
              label="Entegrasyon Kullanıcı Adı"
            ></v-text-field>
          </div>


          <div class="app-form-group">
            <v-text-field
              class="app-form-item"
              outlined
              v-model="form.ws_password"
              :rules="rules.required"
              label="Entegrasyon Şifresi"
            ></v-text-field>
          </div>


          <div class="app-form-submit">
            <v-btn @click="submit()"
                   color="primary"
                   :disabled="loader"
                   :loading="loader">
              Kaydet
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
    name: 'profile',
    data() {
      return {
        ready: false,
        submitting: false,
        moduleInfo: {
          title: 'Profil Bilgilerim',
          formEndpoint: 'update',
          routeAfterSuccess: '/'
        },
        validForm: false,
        loader: false,
        error: [],
        user_type_string: '',
        form: {
          email: '',
          user_type: '',
          name: '',
          title: '',
          address: '',
          tax_administration: '', // Vergi Dairesi
          tax_number: '', // Vergi Numarası
          ws_user_name: '', // Entegrasyon Kullanıcı Adı
          ws_password: '', // Entegrasyon Şifresi
        },
        rules: {
          required: [
            v => !!v.trim() || 'Alan Zorunludur',
          ],
        }
      }
    },
    created() {
      const self = this;
      self.$axios.get('profile')
        .then(res => {

          const data = res.data.data[0];
          Object.keys(data).forEach(itemKey => {
            self.form[itemKey] = data[itemKey] === null ? '' : data[itemKey]
          });

          self.user_type_string = self.form.user_type === 'admin' ? 'Yönetici' : 'Şöför';


          setTimeout(() => self.ready = true);

        })
    },
    methods: {
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

            self.$axios.put(self.moduleInfo.formEndpoint, self.form)
              .then(res => {

                console.log('FORM UPDATE', res)

                return

                const errors = res.data.error
                if (errors !== undefined) {
                  Object.keys(errors).forEach(item => {
                    self.error.push(errors[item][0])
                  })
                } else {

                  if (res.data.createdId !== undefined) {

                    self.$store.dispatch('openSnackbar', {
                      text: self.form.plaque + ' Plakalı Araç Eklenmiştir'
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
