<template>
  <div class="app-page index">
    <v-row justify="center" align="center">

      <v-col
        v-for="(item, i) in items"
        :key="i"
        cols="4"
      >
        <v-card
          :color="item.color"
          dark
        >
          <div class="d-flex flex-no-wrap justify-space-between">
            <div>
              <v-card-title
                class="text-h5"
                v-text="item.title"
              ></v-card-title>

              <v-card-subtitle v-text="item.count" style="font-size: 20px; padding-top: 2px"></v-card-subtitle>

              <v-card-actions>
                <v-btn
                  class="ml-2 mt-5"
                  outlined
                  rounded
                  small
                  :to="item.toList"
                >
                  Liste
                </v-btn>
                <v-btn
                  class="ml-5 mt-5"
                  outlined
                  rounded
                  small
                  :to="item.toAdd"
                >
                  Ekle
                  <v-icon small>mdi-plus</v-icon>
                </v-btn>
              </v-card-actions>
            </div>

            <v-avatar
              class="ma-3"
              size="125"
              tile
            >
              <!--            <v-img :src="item.src"></v-img>-->
              <v-icon style="font-size: 90px">{{item.icon}}</v-icon>
            </v-avatar>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <br><br><br>

    <v-row justify="center" align="center">

      <v-col cols="4">
        <v-card class="add-big-icon-btn" @click="goTo('/cars')">
          <div class="text-center">
            <div>
              <v-icon style="font-size: 120px">mdi-plus</v-icon>
            </div>
            <h3 class="pb-4">UETDS Bildirimi Yap</h3>
          </div>
        </v-card>
      </v-col>


    </v-row>

  </div>
</template>

<script>
  export default {
    data() {
      return {
        items: [
          {
            color: '#1F7087',
            src: 'https://cdn.vuetifyjs.com/images/cards/foster.jpg',
            title: 'Araçlar',
            icon: 'mdi-truck-fast',
            count: '14',
            toList: '/cars',
            toAdd: '/cars/add'
          },
          {
            color: '#952175',
            src: 'https://cdn.vuetifyjs.com/images/cards/halcyon.png',
            icon: 'mdi-account-supervisor-outline',
            title: 'Müşteriler',
            count: '10',
            toList: '/customers',
            toAdd: '/customers/add'
          },
          {
            color: '#1d29cc',
            src: 'https://cdn.vuetifyjs.com/images/cards/halcyon.png',
            icon: 'mdi-account-circle',
            title: 'Sürücüler',
            count: '22',
            toList: '/drivers',
            toAdd: '/drivers/add'
          },
        ],
      }
    },
    created() {
      this.$axios.get('http://test.gold-trace.com/profile')
    },
    methods: {
      goTo(path) {
        this.$router.push(path)
      }
    }
  }
</script>

<style lang="scss">
  .add-big-icon-btn {
    cursor: pointer;
    transition: 300ms;

    &:hover {
      background: whitesmoke;
    }
  }
</style>
