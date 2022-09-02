<template>
  <div>
    <title>DDAOM_Password</title>
    <div class="totalContainer">
      <span id="logo">? Forgot your password</span>
      <div class="passwordContainer">
        <label for="userName"><b>이름</b></label>
        <input
          type="text"
          id="pw_name"
          placeholder="Enter Username"
          name="userName"
          required
          v-model="passwordinf.password.name"
        />
        <label for="psw"><b>아이디</b></label>
        <input
          type="text"
          id="pw_id"
          placeholder="Enter ID"
          name="ID"
          required
          v-model="passwordinf.password.id"
        />
        <label for="psw"><b>비밀번호 힌트 답변</b></label>
        <div>
          <select id="question" size="1" class="select_hint">
            <option value="">질문을 선택해주세요.</option>
            <option
              v-for="(item, index) in pwhintList"
              :key="index"
              :value="item.value"
            >
              {{ item.text }}
            </option>
          </select>
        </div>
        <input
          type="text"
          id="pw_hint"
          placeholder="Enter Answer"
          name="Answer"
          required
          v-model="passwordinf.password.hint"
        />
        <table>
          <td>
            <button type="submit" @click="Searchpw()">비밀번호찾기</button>
          </td>
          <td>
            <button id="backButton" @click="MoveBack()">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrlVgUyXzl9ndi6xTSIQHZPsEB_N8E6w6fjg&usqp=CAU"
              />
            </button>
          </td>
        </table>
      </div>
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
      sampleData: '',
      pwhintList: [
        { text: ' 키우는 애완동물의 이름은? ', val: '0' },
        { text: ' 가장 인상깊게 본 영화는? ', val: '1' },
        { text: ' 기억에 남는 추억의 장소는? ', val: '2' }
      ]
    }
  },
  setup() {
    const passwordinf = reactive({
      password: {
        name: '',
        id: '',
        hint: '',
        pw: ''
      }
    })
    axios.get('/api/password').then((res) => {
      passwordinf.password.pw = res.data
    })
    return { passwordinf }
  },
  created() {},
  mounted() {},
  unmounted() {},
  methods: {
    MoveBack() {
      this.$router.push('/')
    },
    Searchpw() {
      const namePw = document.getElementById('pw_name').value
      const idPw = document.getElementById('pw_id').value
      const hintPw = document.getElementById('pw_hint').value

      if ((namePw === '') & (idPw === '') & (hintPw === '') || namePw === '') {
        alert('이름을 입력해주세요.')
      } else if (idPw === '') {
        alert('아이디를 입력해주세요.')
      } else if (hintPw === '') {
        alert('비밀번호 힌트 답변을 입력해주세요.')
      } else {
        const content = this.passwordinf.password
        axios.post('/api/password', { content }).then((res) => {
          if (res.data === '사용불가능') {
            alert('존재하지 않는 계정입니다.')
          } else if (res.data === '힌트 답변 틀림') {
            alert('비밀번호 힌트 답변이 일치하지 않습니다.')
          } else {
            alert(res.data)
          }
        })
      }
    }
  }
}
</script>

<style scoped>
body {
  font-family: Arial, Helvetica, sans-serif;
}

/* header */
#logo {
  color: black;
  font-size: 30px;
  font-weight: bold;

  display: flex;
  justify-content: center;
}

#question {
  width: 100%;
  padding: 12px 20px;
  margin: 8px 0;
  display: inline-block;
  border: 1px solid rgb(172, 171, 171);
  box-sizing: border-box;
}
/* container */
.totalContainer {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.passwordContainer {
  margin-top: 15px;
  padding-top: 15px;
  border-top: solid rgb(53, 99, 16);
}

/* input box */
input[type='text'],
input[type='password'] {
  width: 100%;
  padding: 12px 20px;
  margin: 8px 0;
  display: inline-block;
  border: 1px solid rgb(172, 171, 171);
  box-sizing: border-box;
}

/* 비밀번호찾기 button*/
button[type='submit'] {
  background-color: #fcc820;
  color: white;
  padding: 14px 20px;
  margin: 8px 0;
  border: none;
  cursor: pointer;
  width: 50vw;
}
/*button hover*/
button:hover {
  opacity: 0.3;
}
/*img*/
img {
  margin-left: 1vw;
  height: 100%;
  width: 2vw;
}
</style>
