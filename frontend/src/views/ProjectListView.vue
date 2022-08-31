<template>
  <div id="bigbody">
    <Frame />
    <section>
      <div id="togggle">
        <div class="toggle_box">
          <input type="checkbox" id="custom_input" @change="toggle()" />
          <label for="custom_input" class="toggle_btn_label">
            <span></span>
          </label>
        </div>
      </div>

      <ul :key="i" v-for="(project, i) in projectstatus.status" id="ulborder">
        <li class="projectname" style="margin-top: 20px">
          <div>
            <input type="text" :value="project.name" readonly class="title" />
          </div>
        </li>
        <li class="projectlist">
          <div>
            <img
              v-if="project.image_path === null || project.image_path === ''"
              class="mainphoto"
              src="../assets/cat.jpg"
            />
            <img v-else class="mainphoto" :src="project.image_path" />
            <span style="display: none">
              <button type="button" class="btnSubmit" @click="readOnlyFalse(i)">
                &nbsp;수정&nbsp;
              </button>
              <button type="button" class="btnSubmit" @click="readOnlyTrue(i)">
                &nbsp;완료&nbsp;
              </button>
              <button type="button" class="btnSubmit" @click="projectDelete(i)">
                &nbsp;삭제&nbsp;
              </button>
            </span>
          </div>
          <div class="projectinf">
            <div id="peers">
              <p>함께하는 사람: &nbsp;&nbsp;</p>
              <span :key="t" v-for="(peer, t) in peerlist.Peer">
                <p class="with" v-if="project.id === peer.project_id">
                  {{ peer.user_name }}&nbsp;,&nbsp;&nbsp;
                </p>
              </span>
            </div>
            <p>
              일정: &nbsp;&nbsp;{{ dateFormat(project.start_date) }} ~
              {{ dateFormat(project.end_date) }}
            </p>

            <!-- 진행률 -->
            <div class="progress">
              <div
                class="progress-bar"
                role="progressbar"
                :style="{
                  width: viewProgress(project.start_date, project.end_date)
                }"
              >
                {{ viewProgress(project.start_date, project.end_date) }}
              </div>
            </div>

            <br />
            <div :id="project.id" style="display: none">
              <textarea
                class="with"
                :value="project.description"
                readonly
                style="resize: none; width: 50vw"
                rows="5"
              ></textarea>
              관련 링크 :
              <span
                :key="j"
                v-for="(link, j) in linklist.Link"
                class="linkSpan"
              >
                <a :href="link.url" v-if="project.id === link.project_id">{{
                  link.title
                }}</a>
                <div
                  :class="project.name"
                  style="display: none"
                  v-if="project.id === link.project_id"
                >
                  <input type="text" :value="link.title" style="width: 50vw" />
                  <input type="text" :value="link.url" style="width: 50vw" />
                </div>
              </span>

              <div :key="i" v-for="(schedule, i) in proschedule.schedule">
                <div
                  v-if="project.id === schedule.project_id"
                  class="detailedProject"
                >
                  <v-icon small> mdi-check-bold </v-icon>&nbsp;
                  {{ schedule.title }}, &nbsp;{{
                    dateFormat(schedule.start_date)
                  }}
                  ~
                  {{ dateFormat(schedule.end_date) }}
                </div>
              </div>
            </div>
            <button
              type="button"
              class="btn btn-secondary btn-sm"
              style="float: right; margin-bottom: 30px"
              @click="openClose(i)"
            >
              view more
            </button>
          </div>
        </li>
      </ul>
    </section>
  </div>
</template>

<script>
import Frame from '@/components/Frame.vue'
import axios from 'axios'
import { reactive } from 'vue'

export default {
  name: '',
  components: {
    Frame
  },
  data() {
    return {}
  },
  setup() {
    const logininf = reactive({
      loginaccount: {
        id: null,
        name: null
      }
    })

    axios.get('/api/login').then((res) => {
      logininf.loginaccount = res.data
    })

    const project = reactive({
      projectList: []
    })

    const projectstatus = reactive({
      status: []
    })

    const linklist = reactive({
      Link: []
    })

    const peerlist = reactive({
      Peer: []
    })

    const proschedule = reactive({
      schedule: []
    })

    axios.get('/api/link').then((res) => {
      linklist.Link = res.data
    })

    axios.get('/api/schedule').then((res) => {
      proschedule.schedule = res.data
    })

    axios.get('/api/peer').then((res) => {
      peerlist.Peer = res.data
    })

    axios.get('/api/list').then((res) => {
      project.projectList = res.data
      projectstatus.status = res.data
    })

    const toggle = () => {
      projectstatus.status = []
      const projectstatusValue = projectstatus.status
      const togglebutton = document.getElementById('custom_input')
      const today = new Date()
      for (const i in project.projectList) {
        const projectdata = project.projectList[i]
        const dateformat = new Date(projectdata.end_date)
        if (togglebutton.checked === false) {
          // 진행중일때 ongoing
          if (dateformat > today) {
            projectstatusValue.push(projectdata)
            projectstatus.status = projectstatusValue
          }
        } else {
          // 완료된거
          if (dateformat < today) {
            projectstatusValue.push(projectdata)
            projectstatus.status = projectstatusValue
          }
        }
      }
    }

    return {
      project,
      logininf,
      linklist,
      peerlist,
      projectstatus,
      toggle,
      proschedule
    }
  },
  methods: {
    openClose(k) {
      // 부모의 이전형제의 두번째 자식
      const projectName = document.getElementById(
        this.projectstatus.status[k].id
      )
      console.log(this.projectstatus.status[k].id)
      const buttons =
        projectName.parentElement.previousElementSibling.childNodes[1]
      if (projectName.style.display === 'block') {
        projectName.style.display = 'none'
        buttons.style.display = 'none'
      } else {
        projectName.style.display = 'block'
        buttons.style.display = 'block'
      }
    },
    readOnlyTrue(k) {
      const link = document.getElementsByClassName(
        this.projectstatus.status[k].name
      )
      const projectName = document.getElementById(
        this.projectstatus.status[k].id
      )
      projectName.parentElement.parentElement.previousElementSibling.childNodes[0].childNodes[0].readOnly = true
      projectName.childNodes[0].readOnly = true
      for (let i = 0; i < link.length; i++) {
        link[i].style.display = 'none'
        link[i].previousElementSibling.style.display = 'inline'
      }
      this.fixedLink(k)
      this.fixedData(k)
    },
    readOnlyFalse(k) {
      const project = this.projectstatus.status[k]
      const link = document.getElementsByClassName(project.name)
      const projectName = document.getElementById(
        this.projectstatus.status[k].id
      )
      projectName.parentElement.parentElement.previousElementSibling.childNodes[0].childNodes[0].readOnly = false // 프로젝트 제목

      projectName.childNodes[0].readOnly = false // 상세설명

      for (let i = 0; i < link.length; i++) {
        link[i].style.display = 'block'
        link[i].previousElementSibling.style.display = 'none'
      }
    },
    viewProgress(s, d) {
      const today = new Date()
      const start = new Date(s)
      const deadline = new Date(d)

      today.setHours(0, 0, 0, 0)
      start.setHours(0, 0, 0, 0)
      deadline.setHours(0, 0, 0, 0)

      const entirePeriod = deadline - start
      const pastPeriod = today - start
      const progress = Math.abs((pastPeriod / entirePeriod) * 100)

      if (today > deadline) {
        return '100%'
      } else if (today <= start) {
        return '0%'
      } else {
        return progress.toFixed(1) + '%'
      }
    },
    fixedData(k) {
      const projectName = document.getElementById(
        this.projectstatus.status[k].id
      )
      const nameid = this.projectstatus.status[k].id
      const fixedProjectName =
        projectName.parentElement.parentElement.previousElementSibling
          .childNodes[0].childNodes[0].value
      const fixedDesc = projectName.childNodes[0].value
      const fixed = [fixedProjectName, fixedDesc]
      axios.put('/api/fix/' + nameid, { fixed }).then((res) => {
        this.project.projectList = res.data
      })
      alert('저장되었습니다.')
    },
    fixedLink(k) {
      const link = document.getElementsByClassName(
        this.project.projectList[k].name
      )
      let fixlink = []
      let linkid = ''
      for (let i = 0; i < link.length; i++) {
        // 링크 개수만큼
        const fixlinkname = link[i].childNodes[0].value
        const fixlinkurl = link[i].childNodes[1].value
        fixlink = [fixlinkname, fixlinkurl]
        linkid = link[i].previousSibling.innerText

        axios.put('/api/fixlink/' + linkid, { fixlink }).then((res) => {
          this.linklist.Link = res.data
        })
      }
    },
    dateFormat(date) {
      const projectDate = new Date(date) // 해줘야 날짜형식으로 적용됨
      const dateformat =
        projectDate.getFullYear() +
        '년 ' +
        projectDate.getMonth() +
        '월 ' +
        projectDate.getDate() +
        '일'
      return dateformat
    },
    projectDelete(k) {
      const projectid = this.project.projectList[k].id

      if (confirm('삭제하시겠습니까?')) {
        axios.delete('/api/list/delete/' + projectid).then((res) => {})
      }
    }
  }
}
</script>

<style scoped>
/*button*/
.btnSubmit {
  border: 1px rgb(255, 255, 255) solid;
  border-radius: 20%;
  background-color: rgb(214, 214, 214);

  margin-top: 20px;
  margin-right: 10px;
}

/*button*/
/* < -- table --> */
* {
  list-style: none;
}
template {
  width: 100%;
}
section {
  margin: 0px;
  height: calc(100vh - 55px);
  background-color: white;
  display: flex;
  position: relative;
  flex-direction: column;
  align-items: center;
  overflow-y: scroll;
}
/* project */
.mainphoto {
  height: 10rem;
  width: 10rem;
  margin-right: 100px;
}
#viewmore {
  display: none;
}
.projectinf {
  width: 50vw;
}
/* 프로젝트명 li */
.projectname {
  margin-bottom: 20px;
}
/* 프로젝트 리스트 li */
.projectlist {
  display: flex;
  overflow: hidden;
}

#peers {
  display: flex;
}
#ulborder {
  border: 5px solid rgb(218, 216, 216);
  border-radius: 15px;
}

/* 진행률 */
.progress {
  width: 400px;
  height: 20px;
}
/* 링크 */
.linkSpan {
  margin-left: 8px;
}

/* 일정 */
.detailedProject {
  margin-top: 10px;
}
/*< -- table -->*/
/*< -- toggle -->*/
#togggle {
  width: 70vw;
}
.toggle_box {
  float: right;
  margin-top: 20px;
}
#custom_input {
  display: none;
}
#custom_input + label.toggle_btn_label {
  position: relative;
  width: 12rem;
  height: 2.5rem;
}
#custom_input + label.toggle_btn_label > span {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 40px;
  background-color: #ccc;
  transition: all 0.4s;
}
#custom_input + label.toggle_btn_label > span:before {
  display: flex;
  position: absolute;
  height: 2rem;
  width: fit-content;
  padding: 0 1rem;
  left: 0.25rem;
  bottom: 0.25rem;
  border-radius: 20px;
  background-color: #fff;
  content: 'ongoing';
  align-items: center;
  font-weight: bold;
  color: rgb(29, 29, 29);
  -webkit-transition: all 0.4s;
  transition: all 0.4s;
}
#custom_input:checked + label.toggle_btn_label > span {
  background-color: rgb(59, 119, 10);
}
#custom_input:checked + label.toggle_btn_label > span:before {
  -webkit-transform: translateX(calc(11.5rem - 100%));
  -ms-transform: translateX(calc(11.5rem - 100%));
  transform: translateX(calc(11.5rem - 100%));
  right: 0.25rem;
  bottom: 0.25rem;
  content: 'complete';
}
#custom_input:disabled + label.toggle_btn_label {
  display: none;
}

/*< -- toggle -->*/

.title {
  font-size: 40px;
  font-weight: bold;
}
</style>
