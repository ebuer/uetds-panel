<template>
  <div class="app-page">
    <app-page :title="moduleInfo.title">

      <!--      <v-toolbar flat color="white">-->
      <!--        <v-spacer></v-spacer>-->

      <!--      </v-toolbar>-->


      <div class="app-list">
        <v-tabs v-model="tab" grow>
          <v-tab>Onay Bekleyen</v-tab>
          <v-tab>Tümü</v-tab>
        </v-tabs>
        <v-tabs-items v-model="tab">
          <v-tab-item :key="1">
            <v-card style="box-shadow: none; padding: 0">
              <v-card-title>
                <v-text-field
                  v-model="tableSecond.search"
                  append-icon="mdi-magnify"
                  label="Arama"
                  single-line
                  hide-details
                ></v-text-field>
                <v-spacer></v-spacer>
              </v-card-title>
              <v-data-table
                :loading="table.loader"
                :headers="tableSecond.headers"
                :items="tableSecond.items"
                :search="tableSecond.search"
                :footer-props="{
                  'items-per-page-options': [10, 20, 50, 100]
                }"
                :page.sync="tableSecond.pagination.current"
                :items-per-page="tableSecond.pagination.itemsPerPage"
                @page-count="tableSecond.pagination.pagLength = $event"
                @click:row="clickRow"
                class="app-table"
              >
                <template v-slot:item.action="{ item }">
                  <div style="display: flex;">


                    <v-tooltip top>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          v-bind="attrs"
                          v-on="on"
                          class="mx-2"
                          fab
                          dark
                          x-small
                          color="waring"
                          @click.stop="openConfirmForm(item)"
                        >
                          <v-icon dark>
                            mdi-alert-circle-check
                          </v-icon>
                        </v-btn>

                      </template>
                      <span>Onayla</span>
                    </v-tooltip>

                    <!--                                <v-tooltip top>-->
                    <!--                                  <template v-slot:activator="{ on, attrs }">-->
                    <!--                                    <v-btn-->
                    <!--                                      v-bind="attrs"-->
                    <!--                                      v-on="on"-->
                    <!--                                      class="mx-2"-->
                    <!--                                      fab-->
                    <!--                                      dark-->
                    <!--                                      x-small-->
                    <!--                                      color="primary"-->
                    <!--                                      @click.stop="editRow(item)"-->
                    <!--                                    >-->
                    <!--                                      <v-icon dark>-->
                    <!--                                        mdi-pencil-->
                    <!--                                      </v-icon>-->
                    <!--                                    </v-btn>-->

                    <!--                                  </template>-->
                    <!--                                  <span>Düzenle</span>-->
                    <!--                                </v-tooltip>-->

                  </div>
                </template>
              </v-data-table>

              <div class="text-center pt-3">
                <v-pagination
                  v-model="tableSecond.pagination.current"
                  :length="tableSecond.pagination.pagLength"
                ></v-pagination>
              </div>
            </v-card>

          </v-tab-item>
          <v-tab-item :key="2">
            <v-card style="box-shadow: none; padding: 0">
              <v-card-title>
                <v-text-field
                  v-model="table.search"
                  append-icon="mdi-magnify"
                  label="Arama"
                  single-line
                  hide-details
                ></v-text-field>
                <v-spacer></v-spacer>
                <!--            <v-btn color="primary" dark class="mb-2" @click="$router.push(moduleInfo.createRoute)">-->
                <!--              {{moduleInfo.createText}}-->

                <!--              <v-icon-->
                <!--                right-->
                <!--                dark-->
                <!--              >-->
                <!--                mdi-plus-->
                <!--              </v-icon>-->
                <!--            </v-btn>-->
              </v-card-title>
              <v-data-table
                :loading="table.loader"
                :headers="table.headers"
                :items="table.items"
                :search="table.search"
                :page.sync="table.pagination.current"
                :items-per-page="table.pagination.itemsPerPage"
                @page-count="table.pagination.pagLength = $event"
                @click:row="clickRow"
                class="app-table"
              >

              </v-data-table>

              <div class="text-center pt-3">
                <v-pagination
                  v-model="table.pagination.current"
                  :length="table.pagination.pagLength"
                ></v-pagination>
              </div>
            </v-card>

          </v-tab-item>
        </v-tabs-items>
      </div>
    </app-page>


    <!--    detail dialog start-->
    <v-dialog
      v-model="detailDialog.open"
      width="500"
    >
      <v-card>
        <v-card-title class="text-h5">
          Detay
        </v-card-title>

        <v-card-text v-if="detailDialog.item !== null">
          <v-simple-table>
            <template v-slot:default>
              <tbody>
              <tr
                v-for="(item, index) in detailDialog.options"
                :key="index"
              >
                <td>{{ item.title }}</td>
                <td>{{ detailDialog.item[item.value] }}</td>
              </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions v-if="detailDialog.item !== null">
          <!--          <v-btn-->
          <!--            color="red"-->
          <!--            text-->
          <!--            @click="deleteRow(detailDialog.item)"-->
          <!--          >-->
          <!--            Sil-->
          <!--          </v-btn>-->

          <v-btn
            color="primary"
            text
            @click="openConfirmForm(detailDialog.item)"
          >
            Onayla
          </v-btn>

          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="detailDialog.open = false"
          >
            Kapat
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!--    detail dialog end-->


    <!--    delete dialog start-->
    <v-dialog
      v-model="deleteDialog.open"
      :persistent="deleteDialog.loader"
      width="500"
    >
      <v-card
        :loading="deleteDialog.loader"
        loader-height="7">
        <v-card-title class="text-h5">
          <div class="text-center" style="width: 100%">{{ deleteDialog.options.title }}</div>
        </v-card-title>

        <v-card-text>

          <div class="delete-icon text-center">
            <v-icon style="font-size: 70px" color="red">mdi-close-circle-outline</v-icon>
          </div>
          <div class="text-center pt-3">
            <b>{{ deleteDialog.options.showText }}</b>
          </div>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions v-if="deleteDialog.loader">
          <v-spacer></v-spacer>
          <v-btn text disabled>Lütfen Bekleyin...</v-btn>
        </v-card-actions>
        <v-card-actions v-else>
          <v-spacer></v-spacer>
          <v-btn
            color="red"
            text
            :disabled="deleteDialog.loader"
            @click="openConfirmForm(deleteDialog.deleteItem)"
          >
            Onayla
          </v-btn>

          <v-btn
            color="primary"
            text
            :disabled="deleteDialog.loader"
            @click="deleteDialog.open = false"
          >
            Kapat
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!--    delete dialog end-->


    <!--  confirm form dialog start  -->

    <v-dialog
      v-model="confirmDialog.open"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition">
      <v-card>
        <v-toolbar
          dark
          color="primary"
        >
          <!--          <v-btn-->
          <!--            icon-->
          <!--            dark-->
          <!--            @click="confirmDialog.open = false"-->
          <!--            :disabled="confirmDialog.loader"-->
          <!--          >-->
          <!--            <v-icon>mdi-close</v-icon>-->
          <!--          </v-btn>-->
          <v-toolbar-title>TİTLE</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn
              dark
              text
              @click="confirmDialog.open = false"
              :disabled="confirmDialog.loader"
            >
              Kapat
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-card-text>
          <div class="app-create mt-5">
            <div class="app-form mt-5">
              <!--              <v-row>-->
              <!--                <v-col>-->
              <!--                  <div class="app-form-group">-->
              <!--                    <v-text-field-->
              <!--                      class="app-form-item"-->
              <!--                      outlined-->
              <!--                      v-model="confirmDialog.form.loading_date"-->
              <!--                      :rules="rules.required"-->
              <!--                      label="Yükleme Tarihi"-->
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
              <!--                      v-model="confirmDialog.form.loading_time"-->
              <!--                      :rules="rules.required"-->
              <!--                      label="Yükleme Saati"-->
              <!--                      type="time"-->
              <!--                      required-->
              <!--                    ></v-text-field>-->
              <!--                  </div>-->
              <!--                </v-col>-->
              <!--              </v-row>-->

              <v-form class="app-form" v-model="confirmDialog.validForm"
                      ref="pageForm">
                <v-row>
                  <v-col>
                    <div class="app-form-group">
                      <v-text-field
                        class="app-form-item"
                        outlined
                        v-model="confirmDialog.form.expedition_start_date"
                        :rules="rules.required"
                        label="Sefer Başlangıç Tarihi"
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
                        v-model="confirmDialog.form.expedition_start_time"
                        :rules="rules.required"
                        label="Sefer Başlangıç Saati"
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
                        v-model="confirmDialog.form.expedition_end_date"
                        :rules="rules.required"
                        label="Sefer Bitiş Tarihi"
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
                        v-model="confirmDialog.form.expedition_end_time"
                        :rules="rules.required"
                        label="Sefer Bitiş Saati"
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
                        v-model="confirmDialog.form.load_quantity"
                        :rules="rules.required"
                        label="Yük Miktarı"
                        type="number"
                      ></v-text-field>
<!--                      TODO yük m,ktarı yanına Litre vs olacak (backend den gelecek)-->
                    </div>
                  </v-col>
                </v-row>


                <div class="mt-5">
                  <v-btn
                    color="primary"
                    style="width: 100%"
                    @click="saveConfirmForm()"
                    :disabled="confirmDialog.loader"
                    :loading="confirmDialog.loader">Kaydet
                  </v-btn>
                </div>
              </v-form>

            </div>
          </div>

        </v-card-text>
      </v-card>
    </v-dialog>

    <!--  confirm form dialog end  -->


  </div>
</template>

<script>
export default {
  name: 'drivers',
  data() {
    return {
      tab: '',
      moduleInfo: {
        title: 'Seferlerlerim',
        createRoute: '/expeditions/add',
        editRoute: '/expeditions/',
        createText: 'Sefer Oluştur'
      },
      deleteDialog: {
        open: false,
        deleteItem: null,
        loader: false,
        options: {
          endpoint: 'expeditions/delete',
          endpointVal: 'id',
          title: 'Silme İşlemi',
          text: '{id} Nolu Seferi Silmek istediğinize emin misiniz?',
          showText: '',
          successText: '{id} Nolu Sefer Silinmiştir',
        }
      },
      detailDialog: {
        open: false,
        options: [
          {
            title: 'No',
            value: 'id'
          },
          {
            title: 'Sürücü',
            value: 'driver_1'
          },
          {
            title: '2.Sürücü',
            value: 'driver_2'
          },
          {
            title: 'Sefer Başlangıç Tarihi',
            value: 'expedition_start_date'
          },
          {
            title: 'Sefer Başlangıç Saati',
            value: 'expedition_start_time'
          },
          {
            title: 'Sefer Bitiş Tarihi',
            value: 'expedition_end_date'
          },
          {
            title: 'Sefer Bitiş Saati',
            value: 'expedition_end_time'
          },
        ],
        item: null
      },
      table: {
        endpoint: 'driver/expedition', // -> sürücünü yaptığı tüm sevkiyatlar
        // endpoint: 'driver/wait-for-check-expedition', // -> sürücünü den onay yapamsı beklenen
        pagination: {
          current: 1,
          pagLength: 0,
          itemsPerPage: 10,
        },
        search: '',
        loader: true,
        headers: [
          // {text: 'Aksiyon', value: 'action', width: '15%'},
          {text: 'No', value: 'id'},
          {text: 'Sürücü', value: 'driver_1'},
          {text: 'Plaka', value: 'plaque_1'},
          {text: 'Sefer Bitiş', value: 'expedition_end_date'},
        ],
        items: []
      },
      tableSecond: {
        endpoint: 'driver/wait-for-check-expedition', // -> sürücünü den onay yapamsı beklenen
        pagination: {
          current: 1,
          pagLength: 0,
          itemsPerPage: 10,
        },
        search: '',
        loader: true,
        headers: [
          {text: 'Aksiyon', value: 'action', width: '15%'},
          {text: 'No', value: 'id'},
          {text: 'Sürücü', value: 'driver_1'},
          {text: 'Plaka', value: 'plaque_1'},
          {text: 'Sefer Bitiş', value: 'expedition_end_date'},
        ],
        items: []
      },
      confirmDialog: {
        open: false,
        validForm: false,
        selected: null,
        loader: false,
        form: {
          // loading_date: '',
          // loading_time: '', // required yükleme zamanı - format: dd/mm/yyyy
          expedition_start_date: '', // required - format: dd/mm/yyyy
          expedition_start_time: '', // required - format: HH/mm
          expedition_end_date: '', // required - format: dd/mm/yyyy
          expedition_end_time: '', // required - format: HH/mm
          load_quantity: '', // miktarı
        }
      },
      expeditionConfirm: {
        open: false,
        loader: false,
        text: ''
      },
      rules: {
        required: [
          v => !!v.trim() || 'Alan Zorunludur',
        ],
        requiredByNumb: [
          v => !!v || 'Alan Zorunludur',
        ],
      },
    }
  },
  created() {
    const self = this;
    self.fetchData()
  },
  methods: {
    fetchData() {
      const self = this;

      // self.tableSecond.items = [];
      // self.table.items = [];
      self.table.loader = true

      const waitingReq = self.$axios.$get(self.tableSecond.endpoint);
      const allReq = self.$axios.$get(self.table.endpoint);
      self.$axios.all([
        waitingReq,
        allReq
      ]).then(res => {
        self.tableSecond.items = res[0].data;
        self.table.items = res[1].data;
        self.$forceUpdate();

        setTimeout(() => {
          self.tableSecond.loader = false
          self.table.loader = false
        }, 500)
      })
    },
    clickRow(item) {
      const self = this;
      self.detailDialog.item = item
      setTimeout(() => self.detailDialog.open = true)
    },
    deleteRow(item) {
      const self = this;

      self.deleteDialog.options.showText = self.getScopedVal(item, self.deleteDialog.options.text)

      self.deleteDialog.deleteItem = item;

      setTimeout(() => {
        self.deleteDialog.open = true
      }, 200)

    },
    getScopedVal(item, text) {

      let returnText = text

      if (text.includes('{') && text.includes('}')) {
        const getkey = text.split('{')[1].split('}');
        const restText = getkey[1]
        const getVal = item[getkey[0]];
        if (getkey !== undefined) {
          returnText = getVal + restText;
        }
      }

      return returnText

    },
    deleteData(item) {
      const self = this;

      self.deleteDialog.loader = true;

      const val = item[self.deleteDialog.options.endpointVal];


      self.$axios.delete(self.deleteDialog.options.endpoint + '/' + val,)
        .then(res => {

          setTimeout(() => {

            self.deleteDialog.open = false
            self.deleteDialog.loader = false;

            // if click from detail modal
            self.detailDialog.open = false

            if (res.data.deletedId !== undefined) {
              self.fetchData();
              const succesText = self.getScopedVal(item, self.deleteDialog.options.successText)
              self.$store.dispatch('openSnackbar', {
                text: succesText
              });
            } else {
              self.$store.dispatch('openSnackbar', {
                text: 'Bir Hata oluştu',
                type: 'error'
              });
            }


          })

        })
    },
    editRow(item) {
      const self = this;
      self.$router.push(self.moduleInfo.editRoute + item.id)
    },
    openConfirmForm(item) {
      const self = this;
      console.log('ooo', self.confirmDialog.form)
      console.log('iii', item)
      self.confirmDialog.selected = item;

      Object.keys(self.confirmDialog.form).forEach(itemKey => {
        const dataItem = item.load_detail[itemKey] !== undefined ? item.load_detail[itemKey] : item[itemKey]
        if (dataItem) self.confirmDialog.form[itemKey] = dataItem;
        self.$forceUpdate();
      })

      setTimeout(() => self.confirmDialog.open = true);
    },
    saveConfirmForm() {
      const self = this;


      const valid = this.$refs.pageForm.validate();


      if(!valid) return

      const id = self.confirmDialog.selected.id

      self.confirmDialog.loader = true;
      self.$axios.$put('driver/expedition/' + id, self.confirmDialog.form)
        .then(res => {
          console.log('RRRR', res)

          if (res.status) {

            self.$store.dispatch('openSnackbar', {
              text: id + ' Nolu Sefer Onaylanmıştır'
            });
            self.fetchData();

            setTimeout(() => {
              self.confirmDialog.open = false
              self.detailDialog.open = false
            })
          } else {

            self.$store.dispatch('openSnackbar', {
              type: 'error',
              text: 'Bir hata oluştu lütfen bilgilerinizi kontrol ediniz'
            });
          }
          self.confirmDialog.loader = false;

        })
        .catch(err => {
          self.confirmDialog.loader = false;
          self.$store.dispatch('openSnackbar', {
            type: 'error',
            text: 'Bir hata oluştu lütfen bilgilerinizi kontrol ediniz'
          });
        })

    },
    resetForm() {
      const self = this;
      self.confirmDialog.selected = null;
      self.confirmDialog.loader = false;
      Object.keys(self.confirmDialog.form).forEach(itemKey => {
        self.confirmDialog.form[itemKey] = '';
        self.$forceUpdate();
      })
    }
  },
  watch: {
    'confirmDialog.open'(val) {
      if (!val) this.resetForm()
    }
  }
}
</script>
