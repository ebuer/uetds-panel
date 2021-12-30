<template>
  <div class="app-page">
    <app-page :title="moduleInfo.title">

      <!--      <v-toolbar flat color="white">-->
      <!--        <v-spacer></v-spacer>-->

      <!--      </v-toolbar>-->

      <div class="app-list">
        <v-card style="box-shadow: none; padding: 0">
          <v-card-title>

            <v-btn color="primary" dark class="mb-2 add-button" @click="$router.push(moduleInfo.createRoute)">
              {{ moduleInfo.createText }}

              <v-icon
                right
                dark
              >
                mdi-plus
              </v-icon>
            </v-btn>

            <v-spacer></v-spacer>

            <v-text-field
              v-model="table.search"
              append-icon="mdi-magnify"
              label="Arama"
              single-line
              hide-details
            ></v-text-field>

          </v-card-title>
          <v-data-table
            :loading="table.loader"
            :headers="table.headers"
            :items="table.items"
            :search="table.search"
            :footer-props="{
              'items-per-page-options': [10, 20, 50, 100]
            }"
            :page.sync="table.pagination.current"
            :items-per-page="table.pagination.itemsPerPage"
            @page-count="table.pagination.pagLength = $event"
            @click:row="clickRow"
            class="app-table"
          >


            <template v-slot:item.sendTypeStatus="{ item }">
              <span v-if="item.expedition_service.isSendService === '0'">
                <span v-if="item.expedition_service.sendTypeStatus === '1'">Sürücü Onayı Bekleniyor</span>
                <span v-else>Bildirilmedi</span>
              </span>
              <span v-else-if="item.expedition_service.isSendService === '1'">Bildirildi</span>
            </template>

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
                      color="red"
                      @click.stop="deleteRow(item)"
                    >
                      <v-icon dark>
                        mdi-delete
                      </v-icon>
                    </v-btn>

                  </template>
                  <span>Sil</span>
                </v-tooltip>

                <v-tooltip top>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      v-bind="attrs"
                      v-on="on"
                      class="mx-2"
                      fab
                      dark
                      x-small
                      color="primary"
                      @click.stop="editRow(item)"
                    >
                      <v-icon dark>
                        mdi-pencil
                      </v-icon>
                    </v-btn>

                  </template>
                  <span>Düzenle</span>
                </v-tooltip>

                <v-tooltip top v-if="item.expedition_service.isSendService === '1'">
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      v-bind="attrs"
                      v-on="on"
                      class="mx-2"
                      fab
                      dark
                      x-small
                      color="gray"
                      :href="pdfBase + item.expedition_service.pdf_name"
                      target="_blank"
                    >
                      <v-icon dark>
                        mdi-file-pdf-box
                      </v-icon>
                    </v-btn>

                  </template>
                  <span>PDF Görüntüle</span>
                </v-tooltip>

              </div>
            </template>

          </v-data-table>

          <div class="text-center pt-3">
            <v-pagination
              v-model="table.pagination.current"
              :length="table.pagination.pagLength"
            ></v-pagination>
          </div>
        </v-card>
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
                <td v-if="item.callback !== undefined">{{ item.callback(detailDialog.item) }}</td>
                <td v-else>{{ detailDialog.item[item.value] }}</td>
              </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions v-if="detailDialog.item !== null">
          <v-btn
            color="red"
            text
            @click="deleteRow(detailDialog.item)"
          >
            Sil
          </v-btn>

          <v-btn
            color="primary"
            text
            @click="editRow(detailDialog.item)"
          >
            Düzenle
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
            @click="deleteData(deleteDialog.deleteItem)"
          >
            Sil
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

  </div>
</template>

<script>
export default {
  name: 'drivers',
  data() {
    return {
      pdfBase: process.env.PDF_BASE,
      moduleInfo: {
        title: 'Sevkiyat',
        createRoute: '/expeditions/add',
        editRoute: '/expeditions/',
        createText: 'Sevkiyat Oluştur'
      },
      deleteDialog: {
        open: false,
        deleteItem: null,
        loader: false,
        options: {
          endpoint: 'expeditions/delete',
          endpointVal: 'id',
          title: 'Silme İşlemi',
          text: '{id} Nolu Sevkiyat Silmek istediğinize emin misiniz?',
          showText: '',
          successText: '{id} Nolu Sevkiyat Silinmiştir',
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
            // value: 'driver_1',
            callback: (item => item.driver_1.name_surname)
          },
          {
            title: '2.Sürücü',
            // value: 'driver_2',
            callback: (item => item.driver_2.name_surname !== undefined ? item.driver_2.name_surname : '')
          },
          {
            title: 'Sevkiyat Başlangıç Tarihi',
            // value: 'expedition_start_date',
            callback: (item => item.expedition_service.expedition_start_date)
          },
          {
            title: 'Sevkiyat Başlangıç Saati',
            // value: 'expedition_start_time',
            callback: (item => item.expedition_service.expedition_start_time)
          },
          {
            title: 'Sevkiyat Bitiş Tarihi',
            // value: 'expedition_end_date',
            callback: (item => item.expedition_service.expedition_end_date)
          },
          {
            title: 'Sevkiyat Bitiş Saati',
            // value: 'expedition_service.expedition_end_time',
            callback: (item => item.expedition_service.expedition_end_time)
          },
        ],
        item: null
      },
      table: {
        endpoint: 'expeditions',
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
          {text: 'Durum', value: 'sendTypeStatus'},
          {text: 'Sürücü', value: 'driver_1.name_surname'},
          {text: 'Plaka', value: 'car.plaque'},
          {text: 'Sevkiyat Bitiş', value: 'expedition_service.expedition_end_date'},
        ],
        items: []
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

      self.table.loader = true

      self.$axios.get(self.table.endpoint)
        .then(res => {

          self.table.items = res.data.data;

          setTimeout(() => {
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
  }
}
</script>
