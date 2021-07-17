<template>
  <div class="app-sub-inner">
    <v-container>
      <v-card tile>
        <div class="app-sub-title">
          <v-card-title class="card-title">
            <div class="card-inner">
              <span>{{title}}</span>
              <v-breadcrumbs
                class="card-breadcrumbs"
                :items="breadcrumbs"
              >
                <template v-slot:divider>
                  <v-icon>mdi-chevron-right</v-icon>
                </template>
              </v-breadcrumbs>
            </div>

          </v-card-title>


        </div>
        <div class="app-sub-content">
          <v-card-text>
            <slot/>
          </v-card-text>
        </div>
      </v-card>
    </v-container>
  </div>
</template>

<script>
  export default {
    name: 'sub-page',
    props: {
      title: {
        default: ''
      },
      fluid: {
        default: false
      }
    },
    data() {
      return {
        breadcrumbs: []
      }
    },
    created() {
      const self = this;
      self.breadcrumbs = []
      // self.$route.matched.forEach(val => {
      //   const obj = {}
      //   obj.text = val.meta.title
      //   obj.href = val.path
      //   obj.disable = val.name === self.$route.name
      //
      //   self.breadcrumbs.push(obj)
      // })

    }
  }
</script>

<style lang="scss" scoped>
  .app-sub-inner {
    position: relative;

    /*&:before {*/
    /*  content: '';*/
    /*  position: absolute;*/
    /*  top: 0;*/
    /*  left: 0;*/
    /*  width: 100%;*/
    /*  height: 100vh;*/
    /*  background-color: #039e95;*/
    /*}*/
  }

  .app-sub-title {
    margin-top: 10px;

    .card-title {
      width: 100%;
      height: 65px;
      background-color: #948f8f;
      color: #ffff;

      .card-inner {
        display: flex;
        width: 100%;
        height: 100%;
        justify-content: space-between;
        align-items: center;
      }
    }
  }
</style>
<style>
  .card-breadcrumbs a {
    color: #ffffff !important;
  }
</style>
