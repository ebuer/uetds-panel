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
        <div v-else class="app-create-content">
          <div v-if="userInfoStatus !== null && (userInfoStatus === 0)">
            <v-alert
              style="margin: 10px 0"
              dense
              type="error"
            >
              UETDS bildirimini yapabilmek için <strong>E-Devlet</strong> bilgilerinizi
              <NuxtLink to="/profile" style="color: white">buradan</NuxtLink>
              güncellemeniz gerekiyor,
            </v-alert>
          </div>
          <v-form v-if="userInfoStatus !== null && (userInfoStatus === 1)" class="app-form" v-model="validForm"
                  ref="pageForm">

            <div class="app-form-group">
              <v-autocomplete
                class="app-form-item"
                outlined
                v-model="form.car_id"
                :items="selectItems.cars"
                item-value="id"
                item-text="plaque"
                label="Araba Seç"
                :rules="rules.requiredByNumb"
              >
              </v-autocomplete>
            </div>

            <div class="app-form-group">
              <v-autocomplete
                class="app-form-item"
                outlined
                v-model="form.trailer_id"
                :items="selectItems.trailers"
                item-value="id"
                item-text="plaque"
                label="Dorse Seç"
              >
              </v-autocomplete>
            </div>

            <div class="app-form-group">
              <v-autocomplete
                class="app-form-item"
                outlined
                v-model="form.driver_id_1"
                :items="selectItems.drivers"
                item-value="id"
                item-text="name_surname"
                label="Sürücü Seç"
                :rules="rules.requiredByNumb"
              >
              </v-autocomplete>
            </div>

            <div class="app-form-group">
              <v-autocomplete
                class="app-form-item"
                outlined
                v-model="form.driver_id_2"
                :items="selectItems.drivers"
                item-value="id"
                item-text="name_surname"
                label="2.Sürücü Seç"
              >
              </v-autocomplete>
            </div>


            <!--          <div class="app-form-group">-->
            <!--            <v-btn @click="openPicker()">expedition_start_date Seç</v-btn>-->
            <!--            <app-date-picker ref="picker"></app-date-picker>-->
            <!--          </div>-->


            <div class="app-form-group">
              <v-autocomplete
                class="app-form-item"
                outlined
                v-model="form.transport_type_code_id"
                :items="selectItems.transportTypes"
                item-value="id"
                item-text="description"
                label="Taşıma Türü"
                :rules="rules.requiredByNumb"
              >
              </v-autocomplete>
            </div>

            <div class="app-form-group" v-if="form.transport_type_code_id === 1">
              <v-autocomplete
                class="app-form-item"
                outlined
                v-model="form.dangerous_goods_transport_type_id"
                :items="selectItems.dangerousGoodsTransportTypes"
                item-value="code"
                item-text="description"
                label="Tehlikeli Madde Taşıma Şekli"
                :rules="form.transport_type_code_id === 1 ? rules.required : []"
              >
              </v-autocomplete>
            </div>

            <div class="app-form-group">
              <v-autocomplete
                class="app-form-item"
                outlined
                v-model="form.sender_id"
                :items="selectItems.senders"
                item-value="id"
                item-text="title"
                label="Yük Temin Noktası"
                :rules="rules.requiredByNumb"
              >
              </v-autocomplete>
            </div>

            <div class="app-form-group">
              <v-autocomplete
                class="app-form-item"
                outlined
                v-model="form.customer_id"
                :items="selectItems.customers"
                item-value="id"
                item-text="title"
                label="Müşteri"
                :rules="rules.requiredByNumb"
              >
              </v-autocomplete>
            </div>

            <div class="app-form-group">
              <v-autocomplete
                class="app-form-item"
                outlined
                v-model="form.load_type_id"
                :items="selectItems.loadTypes"
                item-value="load_type_id"
                item-text="name"
                label="Yük Cinsi"
                :rules="rules.requiredByNumb"
              >
              </v-autocomplete>
            </div>


            <div class="app-form-group">
              <v-autocomplete
                class="app-form-item"
                outlined
                v-model="form.load_quantity_unit"
                :items="selectItems.loadQuantityUnits"
                item-value="code"
                item-text="description"
                label="Yük Miktarı Birimi"
                :rules="rules.requiredByNumb"
              >

              </v-autocomplete>
            </div>

            <div class="app-form-group" v-if="form.transport_type_code_id !== 2">
              <v-autocomplete
                class="app-form-item"
                outlined
                v-model="form.unId"
                :items="selectItems.unNumbers"
                item-value="code"
                :item-text="item => item.code +' - '+ item.title"
                label="Un Kodu"
                :rules="form.transport_type_code_id !== 2 ? rules.requiredByNumb : []"
              >
              </v-autocomplete>
            </div>

            <div class="app-form-group">
              <p>Gönderim Tipi</p>
              <v-radio-group
                v-model="form.sendTypeStatus"
                row
              >
                <v-radio
                  label="Uetds bildirim"
                  value="2"
                ></v-radio>
                <v-radio
                  label="Sürücü Onay"
                  value="1"
                ></v-radio>
              </v-radio-group>
            </div>


            <v-alert
              type="info"
              elevation="2"
            >
              Sürücüye Onay gönderildiğinde eksik bilgileir sürücü tarafından tamamalanması gerekir.
            </v-alert>


            <div class="mt-10">
<!--              <v-row>-->
<!--                <v-col>-->
<!--                  <div class="app-form-group">-->
<!--                    <v-text-field-->
<!--                      class="app-form-item"-->
<!--                      outlined-->
<!--                      v-model="form.filling_start_date"-->
<!--                      :rules="form.sendTypeStatus === '2' ? rules.required : []"-->
<!--                      label="Dolum Başlangıç Tarihi"-->
<!--                      type="date"-->
<!--                      required-->
<!--                    ></v-text-field>-->
<!--                  </div>-->
<!--                </v-col>-->
<!--                <v-col>-->
<!--                  <div class="app-form-group">-->
<!--                    <v-text-field-->
<!--                      class="app-form-item"-->
<!--                      outlined-->
<!--                      v-model="form.filling_start_time"-->
<!--                      :rules="form.sendTypeStatus === '2' ? rules.required : []"-->
<!--                      label="Dolum Başlangıç Saati"-->
<!--                      type="time"-->
<!--                      required-->
<!--                    ></v-text-field>-->
<!--                  </div>-->
<!--                </v-col>-->
<!--              </v-row>-->


              <v-row>
                <v-col>
                  <div class="app-form-group">
                    <v-text-field
                      class="app-form-item"
                      outlined
                      v-model="form.expedition_start_date"
                      :rules="form.sendTypeStatus === '2' ? rules.required : []"
                      label="Sevkiyat Başlangıç Tarihi"
                      type="date"
                      required
                    ></v-text-field>
                  </div>
                </v-col>
                <v-col>
                  <div class="app-form-group">
                    <v-text-field
                      class="app-form-item"
                      outlined
                      v-model="form.expedition_start_time"
                      :rules="form.sendTypeStatus === '2' ? rules.required : []"
                      label="Sevkiyat Başlangıç Saati"
                      type="time"
                      required
                    ></v-text-field>
                  </div>
                </v-col>
              </v-row>


              <v-row>
                <v-col>
                  <div class="app-form-group">
                    <v-text-field
                      class="app-form-item"
                      outlined
                      v-model="form.expedition_end_date"
                      :rules="form.sendTypeStatus === '2' ? rules.required : []"
                      label="Sevkiyat Bitiş Tarihi"
                      type="date"
                      required
                    ></v-text-field>
                  </div>
                </v-col>
                <v-col>
                  <div class="app-form-group">
                    <v-text-field
                      class="app-form-item"
                      outlined
                      v-model="form.expedition_end_time"
                      :rules="form.sendTypeStatus === '2' ? rules.required : []"
                      label="Sevkiyat Bitiş Saati"
                      type="time"
                      required
                    ></v-text-field>
                  </div>
                </v-col>
              </v-row>


              <div class="app-form-group">
                <v-text-field
                  class="app-form-item"
                  outlined
                  v-model="form.load_quantity"
                  :rules="form.sendTypeStatus === '2' ? rules.required : []"
                  :label="'Yük Miktarı ' + getUnitText(form.load_quantity_unit)"
                  type="number"
                ></v-text-field>
              </div>

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
        </div>

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
    name: 'expeditions-add',
    data() {
      return {
        userInfoStatus: null,
        ready: false,
        submitting: false,
        error: [],
        validForm: false,
        loader: false,
        moduleInfo: {
          title: 'Sevkiyat Ekle',
          formEndpoint: 'expeditions/create',
          routeAfterSuccess: '/expeditions',
          successShowKey: 'car_id',
          successShowText: '  numaralı kayıt eklenmiştir'
        },
        form: {
          car_id: '', // required
          trailer_id: '', // nullable
          driver_id_1: '', // required
          driver_id_2: '', // nullable
          // filling_start_date: '', // required - format: dd/mm/yyyy
          // filling_start_time: '', // required - format: HH/mm
          expedition_start_date: '', // required - format: dd/mm/yyyy
          expedition_start_time: '', // required - format: HH/mm
          expedition_end_date: '', // required - format: dd/mm/yyyy
          expedition_end_time: '', // required - format: HH/mm
          transport_type_code_id: '', // required
          sender_id: '', // required
          customer_id: '', // required
          load_type_id: '', // required
          load_quantity_unit: '', // required
          load_quantity: '', // required
          dangerous_goods_transport_type_id: '',
          unId: '120300', // required
          sendTypeStatus: '2',
        },
        rules: {
          required: [
            v => !!v.trim() || 'Alan Zorunludur',
          ],
          requiredByNumb: [
            v => !!v || 'Alan Zorunludur',
          ],
        },
        selectItems: {
          cars: [],
          drivers: [],
          trailers: [],
          transportTypes: [],
          senders: [],
          customers: [],
          loadTypes: [],
          dangerousGoodsTransportTypes: [],
          unNumbers: [],
          loadQuantityUnits: [],
          districtLoader: false
        },
      }
    },
    created() {
      const self = this;

      // TODO base_url/get-all-data => GET

      self.$axios.post('check-user-information')
        .then(statusRes => {

          // Eksiksiz ise status : 1 -> form doldurabilir
          // Eksik ise status : 0 -> formU dolduramaz

          const statusData = statusRes.data.status;

          this.userInfoStatus = statusData

          if (statusData === 0) {
            setTimeout(() => self.ready = true)
          } else {

            self.$axios.all([
              self.$axios.get('cars'),
              self.$axios.get('trailers'),
              self.$axios.get('drivers'),
              self.$axios.post('transport-types'),
              self.$axios.get('senders'),
              self.$axios.get('customers'),
              self.$axios.post('load-types'),
              self.$axios.post('dangerous-goods-transport-types'),
              self.$axios.post('un-numbers'),
              self.$axios.post('load-unit-types'),
            ]).then(res => {
              // console.log('all', res)
              self.selectItems.cars = res[0].data.data;
              self.selectItems.trailers = res[1].data.data;
              self.selectItems.drivers = res[2].data.data;
              self.selectItems.transportTypes = res[3].data.data;
              self.selectItems.senders = res[4].data.data;
              self.selectItems.customers = res[5].data.data;
              self.selectItems.loadTypes = res[6].data.data;
              self.selectItems.dangerousGoodsTransportTypes = res[7].data.data;
              self.selectItems.unNumbers = res[8].data.data;
              self.selectItems.loadQuantityUnits = res[9].data.data;

              setTimeout(() => self.ready = true)
            })


          }


        })


      // districts/{provinceID} - POST // İlçeler

    },
    methods: {
      getUnitText(val) {
        const self = this;

        const findItem = self.selectItems.loadQuantityUnits.find(x => x.code === val);

        return findItem ? '(' + findItem['description'] + ')' : ''
      },
      openPicker() {
        this.$refs['picker'].initPicker()
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


            const finalObj = {};

            Object.keys(self.form).forEach(itemKey => {

              // if(itemKey === 'unId' ||
              //   itemKey === 'load_quantity' ||
              //   itemKey === 'dangerous_goods_transport_type_id' ||
              //   itemKey === 'sendTypeStatus' ||
              // itemKey === 'load_type_id') self.form[itemKey] = parseInt(self.form[itemKey])

              let status = true;

              if (itemKey === 'dangerous_goods_transport_type_id' && (self.form.transport_type_code_id !== 1)) status = false;

              if (itemKey === 'driver_id_2' && (self.form.driver_id_2 === '')) status = false;

              if (status) finalObj[itemKey] = self.form[itemKey];
            })

            // transport_type_code_id

            self.$axios.post(self.moduleInfo.formEndpoint, finalObj)
              .then(res => {

                const errors = res.data.error
                if (errors !== undefined) {
                  Object.keys(errors).forEach(item => {
                    self.error.push(errors[item][0])
                  })
                } else {

                  if (res.data.createdId !== undefined) {

                    self.$store.dispatch('openSnackbar', {
                      text: res.data.createdId + self.moduleInfo.successShowText
                    });

                    setTimeout(() => {
                      self.$router.push(self.moduleInfo.routeAfterSuccess)
                    })
                  } else {
                    try {
                      if(res.data.result !== undefined) {
                        if(typeof res.data.result === "string") {
                          self.error.push(res.data.result)
                        }else {
                          self.error.push(res.data.result.message)
                        }

                      }else {
                        self.error.push('Bilgileriniz kontrol edin.')
                      }
                    }catch (e) {
                      self.error.push('Bilgileriniz kontrol edin.')
                    }

                    self.loader = false;
                  }

                }

                self.loader = false;
                setTimeout(() => self.submitting = false, 500)

              })
              .catch(err => {
                if (err.response !== undefined) {
                  const errors = err.response.data.errors
                  if (errors !== undefined) {
                    Object.keys(errors).forEach(item => {
                      self.error.push(errors[item][0])
                    })
                  }
                } else {
                  self.error.push('Bilgileriniz kontrol edin.')
                }
                self.loader = false;
                self.submitting = false
              })

          }

        }

      }
    }
  }
</script>
