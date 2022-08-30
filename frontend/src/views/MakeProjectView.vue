<template>
  <div>
    <Frame />
    <section>
      <div id="sectionBox">
        <div class="sectionDiv" style="color: grey">
          * 표시된 항목은 필수 항목입니다. 반드시 입력해주세요.
        </div>
        <div class="sectionDiv" id="getProjectNameDiv">
          <span class="sectionText">* 프로젝트 명 :</span>
          <input
            type="text"
            id="getProjectName"
            class="inputBoxes"
            placeholder="프로젝트 명을 입력해주세요."
            autofocus
            v-model="makeProjectinf.makeProject.name"
          />
        </div>
        <div class="sectionDiv" id="addMembersDiv">
          <span class="sectionText">팀원 추가 :</span>
          <input
            type="text"
            id="addMembers"
            class="inputBoxes"
            placeholder="팀원의 ID를 입력해주세요."
            style="width: 650px"
            @keydown.enter="addMemberbyEnter('keydown')"
          />
          <input
            type="button"
            id="submitButton"
            value="추가"
            style="width: 50px; margin-left: 15px"
            v-on:click="addMember()"
          />
        </div>
        <div class="sectionDiv" id="memberListBox">
          <div style="width: 110px"></div>
          <div style="width: 720px" id="memberList">
            <div id="noMembers">
              추가된 팀원이 없습니다. 팀원을 추가해주세요.
            </div>
          </div>
        </div>
        <div class="sectionDiv" id="startDateDiv">
          <span class="sectionText">* 시작 일자 :</span>
          <input
            type="date"
            id="startDate"
            class="inputBoxes"
            style="margin-right: 15px"
            v-model="makeProjectinf.makeProject.start_date"
            @change="sameDatePlan()"
          />
          <div id="TodayDiv">
            <span style="margin-right: 15px">당일</span>
            <input type="checkbox" id="todayCheckBox" @change="todayPlan()" />
          </div>
        </div>
        <div class="sectionDiv" id="deadlineDateDiv">
          <span class="sectionText">* 마감 일자 :</span>
          <input
            type="date"
            id="deadlineDate"
            class="inputBoxes"
            @change="sameDatePlan()"
            v-model="makeProjectinf.makeProject.end_date"
          />
        </div>
        <div class="sectionDiv" id="projectDetailDiv">
          <span class="sectionText">상세 설명 :</span>
          <textarea
            id="projectDetail"
            class="inputBoxes"
            placeholder="상세 설명을 입력해주세요."
            @input="
              makeProjectinf.makeProject.description = $event.target.value
            "
          ></textarea>
        </div>
        <div id="linkDiv">
          <div class="sectionDiv" id="addLinkDiv">
            <span class="sectionText" id="linkText">링크 :</span>
            <input
              type="text"
              id="addLinkName"
              class="inputLinkBoxes"
              placeholder="링크명을 입력해주세요."
            />
            <input
              type="url"
              id="addLinkURL"
              class="inputLinkBoxes"
              placeholder="URL을 입력해주세요."
            />
            <button class="addNewLinkButton" v-on:click="createNewLinkDiv()">
              +
            </button>
          </div>
        </div>
        <div class="sectionDiv" id="addReoresehtativePictureDiv">
          <span class="sectionText">대표사진 :</span>
          <input
            type="file"
            id="addReoresehtativePicture"
            @change="onImageChange"
          />
        </div>
        <div class="sectionDiv" id="addFileDiv">
          <span class="sectionText">파일 첨부 :</span>
          <input type="file" id="addFile" @change="onFileChange" />
        </div>
        <div class="sectionDiv" id="saveOrCancleDiv">
          <input
            type="submit"
            class="bottomButton"
            id="save"
            v-on:click="saveCheck()"
          />
          <button class="bottomButton" id="cancle" v-on:click="cancleCheck()">
            취소
          </button>
        </div>
        <div class="sectionDiv">
          <button style="height: 15px; width: 15px"></button>
        </div>
      </div>
    </section>
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
  data() {
    return {}
  },
  setup() {
    const makeProjectinf = reactive({
      // 프로젝트 정보들
      makeProject: {
        id: '',
        name: '',
        start_date: '',
        end_date: '',
        description: '',
        image_path: '',
        file_path: '',
        linkName: [],
        linkurl: []
      },

      // 함꼐하는 사용자
      projectPeer: {
        user_id: [],
        user_name: []
      },

      // 현재 테이블에 존재하는 id를 모두 가져옴
      projectId: {},

      // user table에서 아이디, 이름을 가져옴
      user: {}
    })

    return { makeProjectinf }
  },
  mounted: function () {
    this.randomNumber()
  },
  methods: {
    saveCheck() {
      this.saveLink()

      const content = this.makeProjectinf.makeProject
      const projectName = document.getElementById('getProjectName').value
      const start = document.getElementById('startDate').value
      const deadline = document.getElementById('deadlineDate').value

      if ((projectName === '') & (start === '' || deadline === '')) {
        alert('필수 항목이 입력되지 않았습니다. 다시 입력해 주세요.')
      } else if (projectName === '') {
        alert('프로젝트 제목을 입력해주세요.')
      } else if (start === '' || deadline === '') {
        alert('기간을 입력해주세요.')
      } else if (start > deadline) {
        alert('잘못된 기간입니다. 다시 입력해주세요.')
      } else {
        if (confirm('제출하시겠습니까?')) {
          this.randomNumber()

          axios.post('/api/makeProject', { content }).then((res) => {})

          // 함꼐하는 사용자의 아이디와 이름 content로 추가
          for (const i in this.makeProjectinf.projectPeer.user_id) {
            content.user_id = this.makeProjectinf.projectPeer.user_id[i]
            content.user_name = this.makeProjectinf.projectPeer.user_name[i]

            axios
              .post('/api/makeProject/project_user', { content })
              .then((res) => {})
          }

          axios
            .post('/api/makeProject/project_user/personal', { content })
            .then((res) => {})

          this.$router.push('/project')
        }
      }
    },

    randomNumber() {
      const number = Math.random() * 1000000000
      let id = ''

      axios.post('/api/makeProject/id').then((res) => {
        // 현재 존재하는 id 모두 가져옴
        this.makeProjectinf.projectId = res.data
      })

      // 테이블에 아이디가 존재하지 않을 경우,
      if (this.makeProjectinf.projectId.length === 0) {
        id = number
      } else {
        for (const i in this.makeProjectinf.projectId) {
          const list = this.makeProjectinf.projectId[i]
          const data = Object.values(list)
          // id 값이 새로 존재할 경우
          if (data === number) {
            // 새로운 아이디 추출
            this.randomNumber()
          } else {
            id = number
          }
        }
      }

      // id 값 부여
      this.makeProjectinf.makeProject.id = id
    },

    addMember() {
      const memberID = document.getElementById('addMembers').value
      const memberList = document.getElementById('memberList')

      const addedMember = document.createElement('button')
      addedMember.className = 'inputBoxes'
      addedMember.setAttribute('id', 'addedMember')

      const memberMent = document.getElementById('noMembers')
      const removeIDButton = document.createElement('button')
      removeIDButton.setAttribute('id', 'removeIDbutton')
      removeIDButton.innerText = 'X'

      // user table에 아이디, 네임 추출하여 존재하는지 확인
      axios.post('/api/makeProject/user').then((res) => {
        this.makeProjectinf.user = res.data
      })

      // // 가져온 id와 name의 length 확인
      const IDlength = this.makeProjectinf.projectPeer.user_id.length
      const nameLength = this.makeProjectinf.projectPeer.user_name.length

      let count = 0
      if (memberID === '') {
        alert('팀원의 아이디를 입력해주세요.')
      } else {
        // 팀원의 아이디를 입력했을 때
        for (const i in this.makeProjectinf.user) {
          const list = this.makeProjectinf.user[i]
          const userID = list.id
          const userName = list.name

          // 입력한 팀원의 아이디가 존재할 경우
          if (memberID === userID) {
            memberMent.setAttribute('style', 'display:none;')
            memberList.appendChild(addedMember)
            addedMember.innerText = userName
            addedMember.appendChild(removeIDButton)
            document.getElementById('addMembers').value = ''

            this.makeProjectinf.projectPeer.user_id[IDlength] = userID
            this.makeProjectinf.projectPeer.user_name[nameLength] = userName
            break
          } else {
            // 존재하지 않을 경우, count +1
            count = count + 1
          }
        }
        const length = this.makeProjectinf.user.length
        if (count === length) {
          alert('팀원의 아이디를 다시 확인해주세요.')
        }
      }
      removeIDButton.addEventListener('click', function () {
        const parentID = this.parentElement
        const ID = parentID.innerText.slice(0, -1)
        if (confirm(ID + '님을 삭제하시겠습니까?')) {
          parentID.remove()
          for (const i in this.makeProjectinf.projectPeer.user_id) {
            if (ID === this.makeProjectinf.projectPeer.user_id[i]) {
              this.makeProjectinf.projectPeer.user_id.splice(i, 1)
              this.makeProjectinf.projectPeer.user_name.splice(i, 1)
            }
          }
        }
        const number = document.querySelectorAll('#addedMember').length
        if (number === 0) {
          memberMent.setAttribute('style', 'display:contents')
        }
      })
    },
    addMemberbyEnter(val) {
      this.addMember()
    },
    createNewLinkDiv() {
      const addNewLinkDiv = document.createElement('div')
      addNewLinkDiv.className = 'linkSectionDiv'
      addNewLinkDiv.setAttribute('id', 'addNewLinkDiv')
      const addLinkName = document.createElement('input')
      addLinkName.type = 'text'
      addLinkName.className = 'inputLinkBoxes'
      addLinkName.setAttribute('id', 'addLinkName')
      addLinkName.setAttribute('placeholder', '링크명을 입력해주세요.')
      const addLinkURL = document.createElement('input')
      addLinkURL.type = 'text'
      addLinkURL.className = 'inputLinkBoxes'
      addLinkURL.setAttribute('id', 'addLinkURL')
      addLinkURL.setAttribute('placeholder', 'URL을 입력해주세요.')
      const removeLinkButton = document.createElement('button')
      removeLinkButton.className = 'addNewLinkButton'
      removeLinkButton.innerText = 'x'
      removeLinkButton.addEventListener('click', function () {
        const parentlink = this.parentElement
        parentlink.remove()
      })
      const linkDiv = document.getElementById('linkDiv')
      linkDiv.appendChild(addNewLinkDiv)
      addNewLinkDiv.appendChild(addLinkName)
      addNewLinkDiv.appendChild(addLinkURL)
      addNewLinkDiv.appendChild(removeLinkButton)
    },
    sameDatePlan() {
      const startDate = document.getElementById('startDate').value
      const deadlineDate = document.getElementById('deadlineDate').value
      const todayCheckBox = document.getElementById('todayCheckBox')
      if (deadlineDate === startDate) {
        if (startDate === '') {
          todayCheckBox.checked = false
        } else {
          todayCheckBox.checked = true
        }
      } else {
        todayCheckBox.checked = false
      }
    },
    todayPlan() {
      const todayCheckBox = document.getElementById('todayCheckBox')
      if (todayCheckBox.checked) {
        document.getElementById('deadlineDate').value =
          document.getElementById('startDate').value
        this.makeProjectinf.makeProject.end_date =
          this.makeProjectinf.makeProject.start_date
      }
    },
    onImageChange(e) {
      const imageFile = e.target.files[0]
      const url = URL.createObjectURL(imageFile)
      this.makeProjectinf.makeProject.image_path = url
      URL.revokeObjectURL(url)
    },
    onFileChange(e) {
      const File = e.target.files
      const url = URL.createObjectURL(File[0])
      this.makeProjectinf.makeProject.file_path = url
      URL.revokeObjectURL(url)
    },
    cancleCheck() {
      if (confirm('취소하시겠습니까?')) {
        this.$router.push('/project')
      }
    },
    saveLink() {
      const linkDiv = document.getElementsByClassName('inputLinkBoxes')
      const linkname = []
      const linkurl = []

      for (const i in linkDiv) {
        if (i === 0) {
          linkname.push(linkDiv[i].value)
        } else if (i % 2 === 0) {
          // name인 경우
          linkname.push(linkDiv[i].value)
        } else if (i % 2 === 1) {
          // url인 경우
          linkurl.push(linkDiv[i].value)
        }
      }

      for (let j = 0; j < linkname.length; j++) {
        this.makeProjectinf.makeProject.linkName[j] = linkname[j]
        this.makeProjectinf.makeProject.linkurl[j] = linkurl[j]
      }
    }
  }
}
</script>

<style>
template {
  width: 100%;
}

section {
  margin: 0;
  padding: 0 5% 0 5%;
  height: calc(100vh - 55px);
  background-color: white;
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
  align-items: center;
}
#sectionBox {
  max-width: 100%;
  max-height: 100%;
  display: flex;
  flex-direction: column;
}
.inputBoxes {
  background-color: white;
  border: 1px solid rgb(84, 84, 84);
  border-radius: 5px;
  padding: 5px;
}
.inputLinkBoxes {
  background-color: white;
  border: 1px solid rgb(84, 84, 84);
  border-radius: 5px;
  padding: 5px;
}
.sectionDiv {
  margin-top: 40px;
  display: flex;
}
.linkSectionDiv {
  margin-top: 10px;
}
.sectionText {
  margin-right: 10px;
  min-width: 100px;
  font-size: 15px;
  font-weight: bold;
}
#getProjectName,
#addMembers {
  width: 720px;
}
#noMembers {
  display: contents;
  width: 100%;
}
#addedMember {
  min-width: 70px;
  width: max-content;
  margin-right: 10px;
  margin-bottom: 10px;
  padding: 0 5px 0 5px;
}
#removeIDbutton {
  width: 9px;
  font-size: 10px;
  margin-left: 15px;
  color: gray;
}
#projectDetail {
  resize: none;
  width: 720px;
  height: 250px;
}
#addNewLinkDiv {
  padding-left: 110px;
}
#addLinkName {
  width: 150px;
  margin-right: 10px;
  font-size: 13px;
}
#addLinkURL {
  width: 510px;
  margin-right: 10px;
  font-size: 13px;
}
.addNewLinkButton {
  width: 30px;
  text-align: center;
}
#saveOrCancleDiv {
  display: flex;
  justify-content: center;
  align-items: center;
}
.bottomButton {
  width: 70px;
  height: 25px;
  margin-right: 15px;
  text-align: center;
  border: 1px solid rgb(84, 84, 84);
  border-radius: 5px;
}
.bottomButton:hover {
  background-color: rgb(53, 99, 16);
  color: white;
}
</style>
