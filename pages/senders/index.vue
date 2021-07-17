<template>
  <div class="app-page">
    <app-page :title="moduleInfo.title">

      <!--      <v-toolbar flat color="white">-->
      <!--        <v-spacer></v-spacer>-->

      <!--      </v-toolbar>-->


      <div class="app-list">
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
            <v-btn color="primary" dark class="mb-2" @click="$router.push(moduleInfo.createRoute)">
              {{moduleInfo.createText}}

              <v-icon
                right
                dark
              >
                mdi-plus
              </v-icon>
            </v-btn>
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
                <td>{{ detailDialog.item[item.value] }}</td>
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
          <div class="text-center" style="width: 100%">{{deleteDialog.options.title}}</div>
        </v-card-title>

        <v-card-text>

          <div class="delete-icon text-center">
            <v-icon style="font-size: 70px" color="red">mdi-close-circle-outline</v-icon>
          </div>
          <div class="text-center pt-3">
            <b>{{deleteDialog.options.showText}}</b>
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
    name: 'senders',
    data() {
      return {
        moduleInfo: {
          title: 'Yük Temin Noktası',
          createRoute: '/senders/add',
          editRoute: '/senders/',
          createText: 'Yük Temin Noktası Ekle'
        },
        deleteDialog: {
          open: false,
          deleteItem: null,
          loader: false,
          options: {
            endpoint: 'senders/delete',
            endpointVal: 'id',
            title: 'Silme İşlemi',
            text: '{title} İsimli Temin Noktasını Silmek istediğinize emin misiniz?',
            showText: '',
            successText: '{title} İsimli Temin Noktası Silinmiştir',
          }
        },
        detailDialog: {
          open: false,
          options: [
            {
              title: 'Ünvan',
              value: 'title'
            },
            {
              title: 'Vergi Numarası',
              value: 'tax_id_no'
            },
            {
              title: 'İl',
              value: 'district'
            },
            {
              title: 'İlçe',
              value: 'province'
            }
          ],
          item: null
        },
        table: {
          endpoint: 'senders',
          pagination: {
            current: 1,
            pagLength: 0,
            itemsPerPage: 10,
          },
          search: '',
          loader: true,
          headers: [
            {text: 'Aksiyon', value: 'action', width: '15%'},
            {text: 'Ünvan', value: 'title'},
            {text: 'Vergi Numarası', value: 'tax_id_no'},
            {text: 'İl', value: 'district'},
            {text: 'İlçe', value: 'province'},
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
