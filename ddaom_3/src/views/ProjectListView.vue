<template>
  <div id="bigbody">
    <Frame />
    <section>
      <select style="float: right">
        <option value="doing" selected>ongoing</option>
        <option value="theEnd">complete</option>
      </select>
      <table id="projectlisttb">
        <tr>
          <td id="projecttitle">
            <p>project_1</p>
            <img
              src="https://i.pinimg.com/736x/c9/96/94/c996943a4a38652099e4189fc57f76ce.jpg"
              alt="대표이미지"
            />
          </td>
          <td>
            <p>함께하는 사람:이채원, 정혜리, 최진선, 이종훈</p>
            <p>일정:</p>
            <div class="progress">
              <div
                class="progress-bar"
                role="progressbar"
                style="width: 25%"
                aria-valuenow="25"
                aria-valuemin="0"
                aria-valuemax="100"
              >
                25%
              </div>
            </div>
            <p></p>
            <button
              type="button"
              class="btn btn-secondary btn-sm"
              style="float: right"
              @click="openClose()"
            >
              view more
            </button>
          </td>
        </tr>
        <tr id="more">
          <td></td>
          <td>
            <p>
              세부사항 : Lorem ipsum dolor sit amet consectetur, adipisicing
              elit. Ducimus tempore iure voluptate nam optio fugit ratione
              laborum. Officia sapiente, consectetur adipisci deleniti deserunt
              repellendus minus? Aspernatur minima dolorum recusandae beatae.
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ducimus
              tempore iure voluptate nam optio fugit ratione laborum. Officia
              sapiente, consectetur adipisci deleniti deserunt repellendus
              minus? Aspernatur minima dolorum recusandae beatae.
            </p>
            <p>관련 링크 :</p>
            <div class="progress">
              <div
                class="progress-bar"
                role="progressbar"
                style="width: 25%"
                aria-valuenow="25"
                aria-valuemin="0"
                aria-valuemax="100"
              >
                25%
              </div>
            </div>
          </td>
        </tr>

        <tr>
          <td>
            <p>project_2</p>
            <img
              src="https://i.pinimg.com/736x/c9/96/94/c996943a4a38652099e4189fc57f76ce.jpg"
              alt="대표이미지"
            />
          </td>
          <td>
            <p>함께하는 사람:이채원, 정혜리, 최진선, 이종훈</p>
            <p>일정:</p>
            <div class="progress">
              <div
                class="progress-bar"
                role="progressbar"
                style="width: 25%"
                aria-valuenow="25"
                aria-valuemin="0"
                aria-valuemax="100"
              >
                25%
              </div>
            </div>
            <p></p>
            <button
              type="button"
              class="btn btn-secondary btn-sm"
              style="float: right"
            >
              view more
            </button>
          </td>
        </tr>
        <tr>
          <td>
            <p>project_3</p>
            <img
              src="https://i.pinimg.com/736x/c9/96/94/c996943a4a38652099e4189fc57f76ce.jpg"
              alt="대표이미지"
            />
          </td>
          <td>
            <p>함께하는 사람:이채원, 정혜리, 최진선, 이종훈</p>
            <p>일정:</p>
            <div class="progress">
              <div
                class="progress-bar"
                role="progressbar"
                style="width: 25%"
                aria-valuenow="25"
                aria-valuemin="0"
                aria-valuemax="100"
              >
                25%
              </div>
            </div>
            <p></p>
            <button
              type="button"
              class="btn btn-secondary btn-sm"
              style="float: right"
            >
              view more
            </button>
          </td>
        </tr>
        <tr>
          <td>
            <p>project_3</p>
            <img
              src="https://i.pinimg.com/736x/c9/96/94/c996943a4a38652099e4189fc57f76ce.jpg"
              alt="대표이미지"
            />
          </td>
          <td>
            <p>함께하는 사람:이채원, 정혜리, 최진선, 이종훈</p>
            <p>일정:</p>
            <div class="progress">
              <div
                class="progress-bar"
                role="progressbar"
                style="width: 25%"
                aria-valuenow="25"
                aria-valuemin="0"
                aria-valuemax="100"
              >
                25%
              </div>
            </div>
            <p></p>
            <button
              type="button"
              class="btn btn-secondary btn-sm"
              style="float: right"
            >
              view more
            </button>
          </td>
        </tr>
      </table>
    </section>
  </div>
</template>

<script>
// @ is an alias to /src
import Frame from '@/components/Frame.vue'

export default {
  name: '',
  components: {
    Frame
  },
  methods: {
    openClose() {
      if (document.getElementById('more').style.display === 'inline-block') {
        document.getElementById('more').style.display = 'none'
        // document.getElementById('toc-toggle').textContent = '보이기'
      } else {
        document.getElementById('more').style.display = 'inline-block'
        // document.getElementById('toc-toggle').textContent = '숨기기'
      }
    }
  }
}
</script>

<style scoped>
/* < -- table --> */
#bigbody {
  width: 100vw;
  height: 100vh;
}
select {
  margin-top: 50px;
}
section {
  margin: 0px;
  overflow-y: scroll;
  min-width: calc(100% - 250px);
  height: calc(100% - 55px);
  background-color: antiquewhite;
  display: flex;
  position: relative;
  flex-direction: column;
  align-items: center;
}

img {
  height: 10rem;
  width: 10rem;
}

@import url('https://fonts.googleapis.com/icon?family=Material+Icons');

.dropdown {
  position: relative;
  display: inline-block;
}

.dropbtn_icon {
  font-family: 'Material Icons';
}
.dropbtn {
  border: 1px solid rgb(37, 37, 37);
  border-radius: 4px;
  background-color: #f5f5f5;
  font-weight: 400;
  color: rgb(37, 37, 37);
  padding: 12px;
  width: 200px;
  text-align: left;
  cursor: pointer;
  font-size: 12px;
}
.dropdown-content {
  display: none;
  position: absolute;
  z-index: 1; /*다른 요소들보다 앞에 배치*/
  font-weight: 400;
  background-color: #f9f9f9;
  min-width: 200px;
}

.dropdown-content a {
  display: block;
  text-decoration: none;
  color: rgb(37, 37, 37);
  font-size: 12px;
  padding: 12px 20px;
}

.dropdown-content a:hover {
  background-color: #ececec;
}

.dropdown:hover .dropdown-content {
  display: block;
}
#projecttitle {
  width: 300px;
}
#projectlisttb {
  width: 65vw;
}
/*< -- table -->*/
</style>
