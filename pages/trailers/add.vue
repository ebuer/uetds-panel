<template>
  <div class="app-page create">
    <app-page :title="moduleInfo.title">
      <div class="app-create">

        <v-form class="app-form" v-model="validForm" ref="pageForm" v-on:submit.prevent="submit()">

          <div class="app-form-group">
            <v-text-field
              class="app-form-item"
              outlined
              v-model="form.plaque"
              :rules="rules.required"
              label="Plaka"
              placeholder="00 TR 0000"
              required
              v-mask="'## AA ####'"
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
    name: 'cars-add',
    data() {
      return {
        submitting: false,
        moduleInfo: {
          title: 'Dorse Ekle',
          formEndpoint: 'trailers/create',
          routeAfterSuccess: '/trailers'
        },
        validForm: false,
        loader: false,
        error: [],
        form: {
          plaque: '',
        },
        rules: {
          required: [
            v => !!v.trim() || 'Plaka Zorunludur',
          ],
        }
      }
    },
    methods: {
      resetError() {
        const self = this;
        self.error = [];
      },
      submit() {
        const self = this;

        if(!self.submitting) {

          self.resetError()

          const valid = this.$refs.pageForm.validate();

          if (valid) {
            self.submitting = true;
            self.loader = true;

            self.$axios.post(self.moduleInfo.formEndpoint, self.form)
              .then(res => {

                const errors = res.data.error
                if (errors !== undefined) {
                  Object.keys(errors).forEach(item => {
                    self.error.push(errors[item][0])
                  })
                } else {

                  if (res.data.createdId !== undefined) {

                    self.$store.dispatch('openSnackbar', {
                      text: self.form.plaque + ' Plakalı Dorse Eklenmiştir'
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
