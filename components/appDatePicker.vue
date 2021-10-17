<template>
  <v-dialog
    v-model="open"
    max-width="400">
    <v-card>
      <v-toolbar>
        <v-tabs
          dark
          background-color="primary"
          grow
          v-model="tab"
        >
          <v-tab>
            Tarih
          </v-tab>

          <v-tab>
            Saat
          </v-tab>

        </v-tabs>
      </v-toolbar>
      <v-tabs-items v-model="tab">
        <v-tab-item>
          <v-date-picker
            v-model="dateValue"
            full-width
            no-title
            :min="minDate"
            @change="tab = 1"
          >
          </v-date-picker>
        </v-tab-item>
        <v-tab-item>
          <div style="max-width: 100px; margin: 0 auto">
            <v-text-field v-model="timeValue" type="time"></v-text-field>
          </div>
          <v-time-picker
            ref="timepicker"
            @change="changeTime"
            v-model="timeValue"
            format="24hr"
            full-width
            no-title
          ></v-time-picker>
        </v-tab-item>
      </v-tabs-items>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn>Kapat</v-btn>
        <v-btn @click="save()">Kaydet</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  export default {
    name: 'app-date-picker',
    data() {
      return {
        open: false,
        tab: 'date',
        dateValue: '',
        timeValue: '',
        minDate: '',
        minTime: '',
      }
    },
    created() {
    },
    methods: {
      initPicker(date, time) {
        const self = this;

        const todayDate = (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10);
        const today = new Date();

        if (date !== undefined) {
          self.dateValue = date
        } else {
          self.dateValue = todayDate
        }
        if (time !== undefined) {
          self.timeValue = time
        } else {
          self.timeValue = ('0' + today.getHours()).slice(-2) + ":" + ('0' + today.getMinutes()).slice(-2)
        }


        // self.minTime = ('0' + today.getHours()).slice(-2) + ":" + ('0' + today.getMinutes()).slice(-2)
        self.minDate = todayDate


        self.open = true
      },
      changeTime(val) {
        const self = this;
        const picker = self.$refs['timepicker'];
        if (picker.selectingMinute) picker.selectingHour = true;
      },
      save() {
        const self = this;
        console.log('dateValue', self.dateValue)
        console.log('timeValue', self.timeValue)
      }
    }
  }
</script>
