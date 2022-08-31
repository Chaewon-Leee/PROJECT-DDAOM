<template>
  <div id="bigbody">
    <Frame @checkValue="catchCheck" />
    <div id="heightt">
      <div id="app">
        <v-app id="inspire">
          <v-row class="fill-height">
            <v-col>
              <!-- 캘린더 상단바 -->
              <v-sheet height="64">
                <v-toolbar flat>
                  <v-btn outlined class="mr-4 navbutton" @click="setToday">
                    Today
                  </v-btn>
                  <v-btn fab text small color="grey darken-2" @click="prev">
                    <v-icon small> mdi-chevron-left </v-icon>
                  </v-btn>
                  <v-btn fab text small color="grey darken-2" @click="next">
                    <v-icon small> mdi-chevron-right </v-icon>
                  </v-btn>
                  <v-toolbar-title v-if="$refs.calendar">
                    {{ $refs.calendar.title }}
                  </v-toolbar-title>
                  <v-spacer></v-spacer>

                  <!-- 드롭다운 (month, day, week) -->
                  <v-menu bottom right>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        outlined
                        v-bind="attrs"
                        v-on="on"
                        class="navbutton"
                      >
                        <span>{{ typeToLabel[type] }}</span>
                        <v-icon right> mdi-menu-down </v-icon>
                      </v-btn>
                    </template>
                    <v-list>
                      <v-list-item @click="type = 'day'">
                        <v-list-item-title>Day</v-list-item-title>
                      </v-list-item>
                      <v-list-item @click="type = 'week'">
                        <v-list-item-title>Week</v-list-item-title>
                      </v-list-item>
                      <v-list-item @click="type = 'month'">
                        <v-list-item-title>Month</v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </v-toolbar>
              </v-sheet>

              <!-- 메인 캘린더 -->
              <v-sheet height="calc(100vh - 119px)">
                <v-calendar
                  ref="calendar"
                  v-model="focus"
                  color="primary"
                  :events="events"
                  :event-color="getEventColor"
                  :type="type"
                  @click:event="showEvent"
                  @click:more="viewDay"
                  @click:date="viewDay"
                  @change="updateRange"
                ></v-calendar>
                <v-menu
                  v-model="selectedOpen"
                  :close-on-content-click="false"
                  :activator="selectedElement"
                  offset-x
                >
                  <!-- 레이어 -->
                  <v-card
                    color="grey lighten-4"
                    min-width="350px"
                    flat
                    id="cardwidth"
                  >
                    <!-- 레이어 상단 -->
                    <v-toolbar :color="selectedEvent.color" dark>
                      <v-toolbar-title
                        v-html="selectedEvent.name"
                      ></v-toolbar-title>
                      <v-spacer></v-spacer>
                      <v-btn icon @click="editDesc()">
                        <v-icon>mdi-pencil</v-icon>
                      </v-btn>
                      <v-btn icon @click="saveDesc()">
                        <v-icon>mdi-content-save</v-icon>
                      </v-btn>
                      <v-btn icon @click="removeDesc()">
                        <v-icon>mdi-trash-can</v-icon>
                      </v-btn>
                    </v-toolbar>

                    <!-- 레이어 내용 -->
                    <v-card-text style="height: 120px">
                      <span v-html="selectedEvent.dateDetails"></span>
                      <div>
                        내용 :
                        <textarea
                          id="selectText"
                          readonly
                          :value="selectedEvent.descDetails"
                          style="resize: none"
                          rows="3"
                        >
                        </textarea>
                      </div>
                    </v-card-text>
                    <v-card-actions>
                      <v-btn
                        text
                        color="secondary"
                        @click="selectedOpen = false"
                        id="cancelbutton"
                      >
                        Cancel
                      </v-btn>
                      <div id="finish">
                        <p style="margin-top: 18px" id="finishcheck">FINISH</p>
                        <v-checkbox text color="secondary"> </v-checkbox>
                      </div>
                    </v-card-actions>
                  </v-card>
                </v-menu>
              </v-sheet>
            </v-col>
          </v-row>
        </v-app>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { reactive } from 'vue'
import Frame from '@/components/Frame.vue'

export default {
  components: {
    Frame
  },
  data: () => ({
    focus: '',
    type: 'month',

    typeToLabel: {
      // 드롭다운 메뉴
      month: 'Month',
      week: 'Week',
      day: 'Day'
    },

    selectedEvent: {}, // 선택한 일정 양방향 바인딩
    selectedElement: null, // 사용자가 클릭한 일정 타겟
    selectedOpen: false, // 레이어 오픈 여부 확인
    events: []
  }),

  setup() {
    const logininf = reactive({
      loginaccount: {
        // 사용자 계정
        id: null,
        name: null
      }
    })

    axios.get('/api/login').then((res) => {
      // 사용자 계정 쿠키로 받아옴
      logininf.loginaccount = res.data
    })

    const state = reactive({
      Project: {},
      Project_User: {},
      Schedule: {}
    })

    axios.post('/api/main/Project').then((res) => {
      // 프로젝트 이름
      state.Project = res.data
    })

    axios.post('/api/main/Project_User').then((res) => {
      // 색상과 체크 여부 보유
      state.Project_User = res.data
    })

    axios.post('/api/main/Schedule').then((res) => {
      // 색상과 체크 여부 보유
      state.Schedule = res.data
    })

    return { state, logininf }
  },
  created() {},
  mounted() {
    this.$refs.calendar.checkChange()
  },
  unmounted() {},
  methods: {
    editDesc() {
      const text = document.getElementById('selectText')
      text.readOnly = false
    },
    saveDesc() {
      const text = document.getElementById('selectText')
      text.readOnly = true
      this.selectedEvent.descDetails = text.value

      // 데이터베이스에서 저장
      const textValue = []
      textValue[0] = this.selectedEvent.id
      textValue[1] = text.value

      const content = textValue
      axios.post('/api/main/Schedule/edit', { content }).then((res) => {})
    },
    removeDesc() {
      if (confirm('삭제하시겠습니까?')) {
        // 데이터베이스에 저장
        const removeValue = this.selectedEvent.id
        alert(removeValue)

        const content = removeValue
        axios.post('/api/main/Schedule/remove', { content }).then((res) => {})
      }
    },
    viewDay({ date }) {
      this.focus = date
      this.type = 'day'
    },
    getEventColor(event) {
      return event.color
    },
    setToday() {
      this.focus = ''
      this.checktest()
    },
    prev() {
      this.$refs.calendar.prev()
    },
    next() {
      this.$refs.calendar.next()
    },
    showEvent({ nativeEvent, event }) {
      const open = () => {
        this.selectedEvent = event
        this.selectedElement = nativeEvent.target
        requestAnimationFrame(() =>
          requestAnimationFrame(() => (this.selectedOpen = true))
        )
      }

      if (this.selectedOpen) {
        this.selectedOpen = false
        requestAnimationFrame(() => requestAnimationFrame(() => open()))
      } else {
        open()
      }

      nativeEvent.stopPropagation()
    },
    catchCheck(checkValue) {
      this.updateRange(checkValue)
    },
    addCalendar(checkValue, schedule) {
      const events = this.events
      const eventsId = []

      for (const i in events) {
        eventsId.push(events[i].id)
      }

      if (checkValue[1] === true) {
        const check = eventsId.some((item) => item === schedule.id)
        if (check === false) {
          const first = new Date(schedule.start_date)
          const second = new Date(schedule.end_date)
          const firstmon = first.getMonth() + 1
          const secondmon = second.getMonth() + 1
          events.push({
            id: schedule.id,
            name: schedule.title,
            start: first,
            end: second,
            color: checkValue[2],
            dateDetails:
              '기간 : ' +
              first.getFullYear() +
              '년 ' +
              firstmon +
              '월 ' +
              first.getDate() +
              '일' +
              ' ~ ' +
              second.getFullYear() +
              '년 ' +
              secondmon +
              '월 ' +
              second.getDate() +
              '일',
            descDetails: schedule.description
          })
        } else {
          for (const i in events) {
            if (events[i].id === schedule.id) {
              events[i].color = checkValue[2]
            }
          }
        }
      } else if (checkValue[1] === false) {
        for (let i in events) {
          if (events[i].id === schedule.id) {
            events.splice(i, 1)
            i--
          }
        }
      }
      this.events = events
    },
    updateRange(checkValue) {
      for (const i in this.state.Project_User) {
        const projectUser = this.state.Project_User[i]

        if (projectUser.id === checkValue[0]) {
          for (const j in this.state.Schedule) {
            const schedule = this.state.Schedule[j]

            if (projectUser.project_id === null) {
              // 개인일정
              if (
                schedule.user_id === this.logininf.loginaccount.id &&
                schedule.project_id === null
              ) {
                this.addCalendar(checkValue, schedule)
              }
            } else {
              if (schedule.project_id === projectUser.project_id) {
                this.addCalendar(checkValue, schedule)
              }
            }
          }
        }
      }
    }
  }
}
</script>

<style scoped>
#finishcheck {
  float: left;
  margin-right: 5px;
}
.v-card__actions {
  justify-content: space-between;
}
#heightt {
  margin: 0;
  height: calc(100vh - 55px);
  overflow: hidden;
}
.navbutton {
  background-color: white;
  border: 1px solid rgb(84, 84, 84);
  border-radius: 10px;
}

#selectInput {
  width: 100%;
}

#selectText {
  width: 100%;
  height: 100%;
}
#cancelbutton {
  float: left;
}
#finish {
  float: right;
}
</style>
