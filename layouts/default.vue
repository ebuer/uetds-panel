<template>
  <v-app dark>


    <v-snackbar
      v-model="showSnackBar"
      right
      top
      :timeout="3000"
      :color="snackBarType"
    >
      <v-icon mr="2" v-if="snackBarType === 'success'">mdi-checkbox-marked-circle</v-icon>
      <v-icon mr="2" v-if="snackBarType === 'error'">mdi-alert-remove</v-icon>
      <b>{{ snackBarText }}</b>
      <template v-slot:action="{ attrs }">
        <v-btn
          color="white"
          text
          v-bind="attrs"
          @click="closeSnack()"
        >
          Kapat
        </v-btn>
      </template>
    </v-snackbar>


    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="true"
      fixed
      app
    >
      <v-list>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title"/>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar
      class="app-header-bar"
      :clipped-left="true"
      fixed
      app
    >
      <!--      <v-app-bar-nav-icon @click.stop="miniVariant = !miniVariant"/>-->
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"/>
      <!--      <v-btn-->
      <!--        icon-->
      <!--        @click.stop="miniVariant = !miniVariant"-->
      <!--      >-->
      <!--        <v-icon>mdi-{{ `chevron-${miniVariant ? 'right' : 'left'}` }}</v-icon>-->
      <!--      </v-btn>-->
      <v-toolbar-title v-text="title"/>
      <v-spacer/>
      <v-btn icon>
        <v-icon>mdi-magnify</v-icon>
      </v-btn>

      <v-btn icon>
        <v-icon>mdi-heart</v-icon>
      </v-btn>

      <!--    Notification Menu Start  -->
      <v-menu
        left
        bottom
        class="ml-2 mr-2"
        :offset-y="true"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            icon
            v-bind="attrs"
            v-on="on"
          >
            <v-badge
              class="ml-2 mr-2"
              :content="messages"
              :value="messages"
              color="green"
              overlap
            >
              <v-icon large>
                mdi-bell
              </v-icon>
            </v-badge>
          </v-btn>
        </template>

        <v-card
          class="mx-auto"
          width="400"
          tile
        >
          <v-list three-line style="padding-bottom: 0;">

            <v-subheader>Notification</v-subheader>
            <template v-for="(item, index) in notifications">

              <!--              item start   -->
              <v-list-item :key="index">
                <v-list-item-avatar>
                  <v-badge dot v-if="item.status === 1" color="amber lighten-1"></v-badge>
                  <v-badge dot v-if="item.status === 2" color="light-green darken-3"></v-badge>
                  <v-badge dot v-if="item.status === 3" color="red accent-4"></v-badge>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title>{{item.title}}</v-list-item-title>
                  <v-list-item-subtitle>{{item.text}}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>


              <v-divider></v-divider>

              <!--              item end  -->

            </template>

          </v-list>


        </v-card>
      </v-menu>

      <!--    Notification Menu End  -->


      <!--      Profile Menu Start -->
      <v-menu
        left
        bottom
        class="ml-2 mr-2"
        :offset-y="true"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            icon
            v-bind="attrs"
            v-on="on"
          >
            <v-avatar size="30" class="ml-2 mr-2">
              <img
                alt="user"
                src="https://cdn.pixabay.com/photo/2020/06/24/19/12/cabbage-5337431_1280.jpg"
              >
            </v-avatar>
          </v-btn>
        </template>

        <v-card
          class="mx-auto"
          width="230"
          tile
        >
          <v-list>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title class="text-h6">
                  {{userInfo.name}}
                </v-list-item-title>
                <v-list-item-subtitle>{{userInfo.email}}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
          <v-divider></v-divider>
          <v-list
            nav
            dense
          >
            <v-list-item-group
              color="primary"
            >
              <v-list-item to="/profile">
                <v-list-item-icon>
                  <v-icon>mdi-account</v-icon>
                </v-list-item-icon>
                <v-list-item-content v-text="'Profilim'"></v-list-item-content>
              </v-list-item>
            </v-list-item-group>
            <v-btn
              style="width: 100%; margin-top: 10px;"
              outlined
              @click="logout()"
              color="indigo">
              Çıkış
            </v-btn>
          </v-list>
        </v-card>
      </v-menu>
      <!--      Profile Menu End -->
    </v-app-bar>
    <v-main>
      <v-container>
        <Nuxt/>
      </v-container>
    </v-main>
    <v-footer
      :absolute="!fixed"
      app
    >
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
  export default {
    data() {
      return {
        userInfo: {
          name: '',
          email: ''
        },
        notifications: [
          {
            status: 1,
            title: 'Şöföre uetds bildirimi yapıldı',
            text: '25 Nolu sefer bildirimi gerçekleşti',
          },
          {
            status: 1,
            title: 'Şöföre uetds bildirimi yapıldı',
            text: '25 Nolu sefer bildirimi gerçekleşti',
          },
          {
            status: 2,
            title: 'Şöföre uetds bildirimi yapıldı',
            text: '25 Nolu sefer bildirimi gerçekleşti',
          },
          {
            status: 1,
            title: 'Şöföre uetds bildirimi yapıldı',
            text: '25 Nolu sefer bildirimi gerçekleşti',
          },
          {
            status: 3,
            title: 'Şöföre uetds bildirimi yapıldı',
            text: '25 Nolu sefer bildirimi gerçekleşti',
          }
        ],
        messages: 1,
        drawer: true,
        fixed: false,
        items: [
          {
            icon: 'mdi-apps',
            title: 'Anasayfa',
            to: '/'
          },
          {
            icon: 'mdi-account-group',
            title: 'Müşteriler',
            to: '/customers'
          },
          {
            icon: 'mdi-truck',
            title: 'Araçlar',
            to: '/cars'
          },
          {
            icon: 'mdi-card-account-details',
            title: 'Dorseler',
            to: '/trailers'
          },
          {
            icon: 'mdi-card-account-details',
            title: 'Sürücüler',
            to: '/drivers'
          },
          {
            icon: 'mdi-card-account-details',
            title: 'Yük Temin Noktası',
            to: '/senders'
          }
        ],
        miniVariant: false,
        right: true,
        rightDrawer: false,
        title: 'Logistic'
      }
    },
    computed: {
      mainLoader() {
        return this.$store.state.mainLoader
      },
      snackBarText() {
        return this.$store.state.snackbar.text
      },
      snackBarType() {
        return this.$store.state.snackbar.type
      },
      showSnackBar: {
        get() {
          return this.$store.state.snackbar.open
        },
        set(v) {
          this.$store.commit('SET_SNACKBAR', v)
        }
      },
    },
    mounted() {
      console.log('logged in',)

      const info = this.$userInfo()

      if (info !== undefined) {
        this.userInfo = {
          email: info.email,
          name: info.name
        }
      }
    },
    methods: {
      async logout() {
        await this.$auth.logout();
        await this.$router.push('/login')
      },
      closeSnack() {
        this.$store.dispatch('closeSnackBar')
      }
    }
  }
</script>

<style lang="scss">
  .app-header-bar {
    padding-right: 15px;
    padding-left: 15px;
  }
</style>

<style>
  .app-table tbody tr {
    cursor: pointer !important;
  }
</style>
