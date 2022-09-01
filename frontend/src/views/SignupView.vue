<template>
  <div>
    <title>DDAOM_joinform</title>
    <div class="totalContainer">
      <span id="logo"><img src="../assets/logo.png" /></span>
      <table class="signupContainer">
        <p></p>
        <tr>
          <td style="color: grey">
            * 표시된 항목은 필수 항목입니다. 반드시 입력해주세요.
          </td>
        </tr>
        <p></p>
        <tr>
          <td>
            * 이름 :
            <input
              type="text"
              name="name"
              id="signup_name"
              style="margin-left: 8px"
              v-model="signupinf.signup.name"
            />
          </td>
        </tr>
        <p></p>
        <tr>
          <td>
            * 아이디 :
            <input
              type="text"
              id="signup_id"
              name="id"
              check_result="fail"
              style="margin-left: 8px"
              required
              v-model="signupinf.signup.id"
            />
          </td>
        </tr>
        <p></p>
        <tr>
          <span>
            <td>
              <p id="duplicate">ID중복 여부를 확인해주세요.</p>
            </td>
            <button id="duplicate_button" @click="checkID()">
              &nbsp;ID 중복 검사&nbsp;
            </button>
          </span>
        </tr>
        <tr>
          <td>
            * 비밀번호 :&nbsp;
            <input
              v-model="signupinf.signup.password"
              type="password"
              id="signup_password"
              maxlength="16"
              @blur="passwordValid"
            />
            <div v-if="!passwordValidFlag">유효하지 않은 비밀번호 입니다.</div>
          </td>
        </tr>
        <p></p>
        <tr>
          <td>
            <p style="color: red">
              8자 이상 영문 대소문자와 숫자로만 입력해주세요.
            </p>
          </td>
        </tr>
        <tr>
          <td>
            * 비밀번호 확인 :&nbsp;
            <input
              v-model="passwordCheck"
              type="password"
              id="signup_check"
              maxlength="16"
              @blur="passwordCheckValid"
            />
            <div v-if="!passwordCheckFlag">비밀번호가 동일하지 않습니다.</div>
          </td>
        </tr>
        <p></p>
        <tr>
          <td>
            * 비밀번호 힌트/답변 :&nbsp;
            <select size="1" class="select_hint">
              <option value="">&nbsp; 질문을 선택해주세요.</option>
              <option
                v-for="(item, index) in pwhintList"
                :key="index"
                :value="item.value"
              >
                {{ item.text }}
              </option>
            </select>
          </td>
        </tr>
        <p></p>
        <tr></tr>
        <tr>
          <td>
            * 답변 :&nbsp;
            <input type="text" v-model="signupinf.signup.pwhint" />
          </td>
        </tr>
        <p></p>
        <tr>
          <td>
            <button id="signupButton" type="submit" @click="MoveLogin()">
              가입하기
            </button>
          </td>
          <td>
            <button id="backButton" @click="MoveBack()">
              <img
                id="back"
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrlVgUyXzl9ndi6xTSIQHZPsEB_N8E6w6fjg&usqp=CAU"
              />
            </button>
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { reactive } from 'vue'

export default {
  components: {},
  data() {
    return {
      passwordCheck: '',
      passwordCheckFlag: true,
      passwordValidFlag: true,
      pwhintList: [
        { text: ' 키우는 애완동물의 이름은? ', val: '0' },
        { text: ' 가장 인상깊게 본 영화는? ', val: '1' },
        { text: ' 기억에 남는 추억의 장소는? ', val: '2' }
      ]
    }
  },
  setup() {
    const signupinf = reactive({
      signup: {
        name: '',
        id: '',
        password: '',
        pwhint: ''
      }
    })

    axios.get('/api/signup').then((res) => {})
    axios.get('/api/checkid').then((res) => {
      signupinf.signup.id = res.data
    })

    return { signupinf }
  },
  created() {},
  mounted() {},
  unmounted() {},
  methods: {
    MoveLogin() {
      const content = this.signupinf.signup
      axios.post('/api/signup', { content }).then((res) => {})

      const nameSignup = document.getElementById('signup_name').value
      const idSignup = document.getElementById('signup_id').value
      const passwordSignup = document.getElementById('signup_password').value
      const checkSignup = document.getElementById('signup_check').value

      if (
        (nameSignup === '') &
        (idSignup === '') &
        (passwordSignup === '') &
        (checkSignup === '')
      ) {
        alert('필수항목이 입력되지 않았습니다. 다시 입력해 주세요.')
      } else if (nameSignup === '') {
        alert('이름을 입력해주세요.')
      } else if (idSignup === '') {
        alert('ID를 입력해주세요.')
      } else if ((passwordSignup === '') & (this.passwordCheck === '')) {
        alert('비밀번호를 입력해주세요.')
      } else if (checkSignup === '') {
        alert('비밀번호 확인을 입력해주세요.')
      } else {
        if (confirm('가입하시겠습니까?')) {
          alert('회원가입 성공!')
          this.$router.push('/')
        }
      }
    },
    MoveBack() {
      this.$router.push('/')
    },
    passwordValid() {
      if (
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,16}$/.test(
          this.signupinf.signup.password
        )
      ) {
        this.passwordValidFlag = true
      } else {
        this.passwordValidFlag = false
      }
    },
    passwordCheckValid() {
      if (this.signupinf.signup.password === this.passwordCheck) {
        this.passwordCheckFlag = true
      } else {
        this.passwordCheckFlag = false
      }
    },
    checkID() {
      const content = this.signupinf.signup.id
      axios.post('/api/checkid', { content }).then((res) => {
        if (res.data === '사용불가능') {
          alert('이미 존재하는 아이디입니다.')
        } else if (res.data === '사용가능') {
          alert('사용가능한 아이디입니다.')
        }
      })
    }
  }
}
</script>

<style scoped>
body {
  font-family: Arial, Helvetica, sans-serif;
}
/* container */
.totalContainer {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.signupContainer {
  margin-top: 15px;
  padding-top: 15px;
  border-top: solid rgb(53, 99, 16);
}
/*input box*/
input[type='text'] {
  background-color: rgb(238, 235, 235);
  border: 1px solid rgb(172, 171, 171);
}
input[type='password'] {
  background-color: rgb(238, 235, 235);
  border: 1px solid rgb(172, 171, 171);
}
/*button*/
#signupButton {
  background-color: #fcc820;
  color: white;
  padding: 14px 0;
  border: none;
  cursor: pointer;
  width: 50vw;
}
#overlapButton {
  float: right;
}
#backButton {
  float: right;
}
/*button hover*/
button:hover {
  opacity: 0.3;
}
/*img*/
#back {
  margin-left: 1vw;
  height: 100%;
  width: 2vw;
}
#logo {
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translate(-50%, -100%);
  display: block;
  margin: 0px auto;
}
/* 중복여부 */
#duplicate {
  color: red;
}
#duplicate_button {
  background-color: rgb(238, 235, 235);
  border: 1px solid rgb(172, 171, 171);
  float: right;
}
/* hint_option */
.select_hint {
  border: 1px solid rgb(172, 171, 171);
}
</style>
