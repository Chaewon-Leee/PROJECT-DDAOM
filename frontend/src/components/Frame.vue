<template>
  <div id="body">
    <header>
      <button @click="Isnone()" id="asideBarButton">
        <v-icon>mdi-menu</v-icon>
      </button>
      <div id="mainLogo">
        <router-link to="/main" id="logo">DDAOM</router-link>
      </div>
      <div id="rightItem">
        <div id="userNameBox">
          {{ logininf.loginaccount.name }}님 환영합니다.
        </div>
        <div style="display: flex; flex-direction: row; align-content: center">
          <button class="navbutton" id="listButton" @click="MoveLogin()">
            Log Out
          </button>
          <button id="infoButton" @click="MoveManual()">
            <v-icon large> mdi-comment-question-outline</v-icon>
          </button>
        </div>
      </div>
    </header>

    <nav :class="{ navv: this.isnone }">
      <div>
        <button class="navbutton" @click="MoveMakeProject()">
          Make Project
        </button>
        <button class="navbutton" @click="MoveMakePlan()">Make Plan</button>
        <button class="navbutton" @click="MoveProjectList()">
          Project List
        </button>
      </div>
      <div id="filter">
        <p>필터</p>
        <ul>
          <li>
            <!-- 개인 일정 필터 -->
            <div class="filterList">
              <input
                type="checkbox"
                :id="state.Project_User[0].id"
                @change="checkChange(-1)"
              />
              {{ logininf.loginaccount.name }}
              <!-- 개인 일정 색상 = value값 & 현재의 username = id -->
              <input type="color" class="color" @change="checkChange(-1)" />
            </div>
          </li>
          <li>
            <hr style="width: 80%; border-top: 1px dashed black" />
          </li>
          <!-- 프로젝트 일정 필터 -->
          <li :key="i" v-for="(project, i) in state.Project">
            <div class="filterList">
              <input
                type="checkbox"
                :id="state.Project_User[i + 1].id"
                @change="checkChange(i)"
              />
              {{ project.name }}
              <!-- 색상 = value값 & 현재의 project name = id -->
              <input type="color" class="color" @change="checkChange(i)" />
            </div>
          </li>
        </ul>
      </div>
    </nav>

    <router-view />
  </div>
</template>

<script>
import axios from 'axios'
import { reactive } from 'vue'

export default {
  conponents: {},
  data() {
    return {
      isnone: false
    }
  },
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
      Project_User: {}
    })

    axios.post('/api/frame/color').then((res) => {
      // 색상과 체크 여부 보유
      state.Project_User = res.data
    })

    axios.post('/api/frame/project_name').then((res) => {
      // 프로젝트 이름
      state.Project = res.data
    })

    return { state, logininf }
  },
  created() {},
  mounted() {},
  methods: {
    checkChange(i) {
      const checkValue = []
      checkValue[0] = this.state.Project_User[i + 1].id // 프로젝트
      const a = document.getElementById(this.state.Project_User[i + 1].id)
      checkValue[1] = a.checked // 프로젝트의 변수 chedcked
      checkValue[2] = a.nextElementSibling.value

      this.$emit('checkValue', checkValue) // 전자의 이름으로 후자의 변수를 넘겨줌
    },
    Isnone() {
      this.isnone = !this.isnone
    },
    MoveMakeProject() {
      this.$router.push('/makeproject')
    },
    MoveMakePlan() {
      this.$router.push('/makeplan')
    },
    MoveLogin() {
      axios.delete('/api/login').then((res) => {
        alert('로그아웃하였습니다.')
      })

      this.$router.push('/')
    },
    MoveProjectList() {
      this.$router.push('/project')
    },
    MoveManual() {
      this.$router.push('/manual')
    }
  }
}
</script>

<style scoped>
* {
  list-style: none;
}

/* tmplate */
template {
  height: 100vh;
  width: 100vw;
  margin: 0;
}

/* header */
header {
  height: 55px;
  width: 100%;
  background-color: #fcc820;

  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}

#rightItem {
  display: flex;
  flex-direction: row;
  align-items: center;
}

#asideBarButton {
  margin-left: 15px;
  width: 50px;
}

#mainLogo {
  display: flex;
  align-self: center;
}

#logo {
  color: #c96440;
  text-decoration: none;

  font-size: 30px;
  font-weight: bold;
  position: absolute;
  left: 45%;
  top: 5px;
}

#userNameBox {
  height: 55px;
  margin-right: 15px;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;
}

#listButton {
  margin: 0px 15px 0px 0px;
  height: 30px;
  width: 90px;
  border: none;
}

#infoButton {
  margin: 0px 20px 0px 0px;
  height: 30px;
  width: 30px;
  border: none;
}

/* nav */
nav {
  background-color: rgb(235, 235, 235);
  height: calc(100vh - 55px);
  width: 250px;
  padding-top: 15px;
  padding-bottom: 25px;
  margin: 0;

  float: left;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.navv {
  display: none;
}
/* nav 버튼들 */
.navbutton {
  width: 200px;
  height: 50px;
  margin: 15px 25px 0px 25px;

  background-color: white;
  border: 1px solid rgb(84, 84, 84);
  border-radius: 10px;
}

.navbutton:hover {
  color: white;
  background-color: rgb(53, 99, 16);
}

#filter p {
  margin-left: 20px;
}

#filter {
  margin-left: 20px;
}

.filterList {
  display: flex;
  justify-content: space-between;
}

.color {
  width: 25px;
  height: 25px;
  margin-right: 20px;
}

input[type='checkbox'] {
  margin-right: 20px;
}
</style>
