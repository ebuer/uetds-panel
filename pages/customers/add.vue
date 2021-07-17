<template>
  <div class="app-page create">
    <app-page :title="moduleInfo.title">
      <div class="app-create">

        <v-form class="app-form" v-model="validForm" ref="pageForm">

          <div class="app-form-group">
            <v-text-field
              class="app-form-item"
              outlined
              v-model="form.title"
              :rules="rules.required"
              label="Ünvan"
              required
              v-on:keyup.enter="submit()"
            ></v-text-field>
          </div>


          <div class="app-form-group">
            <v-text-field
              class="app-form-item"
              outlined
              v-model="form.tax_id_no"
              :rules="rules.required"
              label="Vergi Numarası"
              required
              v-on:keyup.enter="submit()"
            ></v-text-field>
          </div>


          <!--          <v-autocomplete-->
          <!--            v-model="formItem.value"-->
          <!--            :items="formItem.selectOptions.selectItems"-->
          <!--            :item-value="formItem.selectOptions.itemValue"-->
          <!--            :rules="formItem.rules"-->
          <!--            :label="formItem.label"-->
          <!--            :required="formItem.required"-->
          <!--            :value="formItem.value"-->
          <!--            :disabled="formItem.disabled"-->
          <!--            :loading="formItem.loader"-->
          <!--            :ref="formItem.name"-->
          <!--            clearable-->
          <!--            outlined-->
          <!--            dense-->
          <!--            @change="onSelectChange(formItem.callback, formItem)"-->
          <!--            :filter="autocompleteFilter.bind(this, formItem)">-->
          <!--            <template slot="no-data">-->
          <!--              <div style="text-align: center;">Veri Bulunamadı</div>-->
          <!--            </template>-->
          <!--            <template slot='selection' slot-scope='{ item }'>-->
          <!--              {{ setItemText(item, formItem) }}-->
          <!--            </template>-->
          <!--            <template slot='item' slot-scope='{ item }'>-->
          <!--              {{ setItemText(item, formItem) }}-->
          <!--            </template>-->
          <!--          </v-autocomplete>-->


          <!--          <v-autocomplete-->
          <!--            :disabled="!isEditing"-->
          <!--            :items="states"-->
          <!--            :filter="customFilter"-->
          <!--            color="white"-->
          <!--            item-text="name"-->
          <!--            label="State"-->
          <!--          ></v-autocomplete>-->

          <div class="app-form-group">
            <v-autocomplete
              class="app-form-item"
              outlined
              v-model="form.province_code"
              :items="selectItems.provinces"
              item-value="code"
              item-text="name"
              label="İl Seç"
              :rules="rules.required"
              @change="setDistrict"
            >
            </v-autocomplete>

          </div>

          <div class="app-form-group">
            <v-autocomplete
              class="app-form-item"
              outlined
              no-data-text="Önce İl Seçiniz"
              :loading="selectItems.districtLoader"
              :disabled="selectItems.districtLoader"
              v-model="form.district_code"
              :items="selectItems.districts"
              item-value="code"
              item-text="name"
              label="İlçe Seç"
              :rules="rules.required"
            >
            </v-autocomplete>

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
    name: 'customer-add',
    data() {
      return {
        submitting: false,
        error: [],
        validForm: false,
        loader: false,
        moduleInfo: {
          title: 'Müşteri Ekle',
          formEndpoint: 'customers/create',
          routeAfterSuccess: '/customers',
          successShowKey: 'title',
          successShowText: ' Ünvanı olan kayıt eklenmiştir'
        },
        form: {
          title: '',
          tax_id_no: '',
          province_code: '',
          district_code: '',
        },
        rules: {
          required: [
            v => !!v.trim() || 'Alan Zorunludur',
          ],
        },
        selectItems: {
          provinces: [],
          districts: [],
          districtLoader: false
        },
      }
    },
    created() {
      const self = this;
      self.$axios.post('province')
        .then(res => {
          self.selectItems.provinces = res.data.data
        })
    },
    methods: {
      setDistrict(value) {
        const self = this;
        self.selectItems.districtLoader = true
        self.$axios.post('district/' + value)
          .then(res => {
            self.selectItems.districtLoader = false
            self.selectItems.districts = res.data.data
          })
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
