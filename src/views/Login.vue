<template>

  <div>
    <div class="ui main container">
      <!-- 基本的なコンテンツはここに記載する -->
      <div class="ui center aligned grid">
    <img class="ui image" src="/logo.png">
    </div>
      <div class="ui active inverted page dimmer" v-if="isCallingApi">
        <div class="ui text loader">Loading...</div>
      </div>

      <div class="ui segment">
        <h3>ヴィーガンサイト</h3>
        <p class="ui negative message" v-if="errorMsg">
          <i class="close icon" @click="clearError"></i>
          <span class="header">エラーが発生しました！</span>
          {{ errorMsg }}
        </p>

        <!-- submitイベントを拾って、preventにて規定のアクションを中止し、submitメソッドを呼び出す。-->
        <form class="ui large form" @submit.prevent="submit" >
          <div class="field">
            <div class="ui left icon input">
              <i class="user icon"></i>
              <input v-model="user.userId" type="text" placeholder="ID"/>
            </div>
          </div>

          <div class="field">
            <div class="ui left icon input">
              <i class="lock icon"></i>
              <input v-model="user.password" type="password" placeholder="Password"/>
              
            </div>
          </div>
              <!--性別-->
              <select id="asd" name="sex" class="ui selection dropdown" v-model="user.sex">
                <option value=""><i class="venus double icon"></i>Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
          <!--     <input v-model="user.gender" type="hidden" name="user">-->
          <!--<div class="ui field selection dropdown" v-if="!isLogin">-->
          <!--    <i class="venus double icon"></i>-->
          <!--    <div class="default text">Select gender</div>-->
          <!--    <i class="dropdown icon"></i>-->
          <!--  <div class="ui right icon input">-->
            
            <!--</div>-->
          <!--</div>-->
          <!--身長-->
           <div class ="field" v-if="!isLogin">
            <div class="ui left icon input">
              <i class="child icon"></i>
              <input v-model.number="user.height" type="height" min="0" placeholder="Height(cm)"/>
            </div>
          </div>
          
          <div class ="field" v-if="!isLogin">
            <div class="ui left icon input">
              <i class="weight icon"></i>
              <input v-model.number="user.weight" type="weight" placeholder="Weight(kg)"/>
            </div>
          </div>

          <div class="field" v-if="!isLogin">
            <div class="ui left icon input">
              <i class="calendar icon"></i>
              <input v-model.number="user.age" type="number" min="0" placeholder="Age"/>
            </div>
          </div>

          <button class="ui huge green fluid button" :disabled="isButtonDisabled" type="submit">{{ submitBtnText }}</button>
        </form>
      </div>

      <button @click="toggleMode" class="ui huge yello fluid button" type="submit">{{ toggledBtnText }}</button>
    </div>
  </div>
</template>

<script>
// 必要なものはここでインポートする
// @は/srcの同じ意味です
// import something from '@/components/something.vue';
import { baseUrl } from '@/assets/config.js';

export default {
  name: 'Login',

  components: {
    // 読み込んだコンポーネント名をここに記述する
  },

  data() {
    // Vue.jsで使う変数はここに記述する
    return {
      isLogin: true,
      user: {
        userId: null,
        password: null,
        gender:null,
        height:null,
        weight:null,
        age: null
      },
      errorMsg: '', // 発展課題のエラーメッセージ用
      isCallingApi: false // 発展課題のローディング表示用
    };
  },

  computed: {
    // 計算した結果を変数として利用したいときはここに記述する

    // 発展課題のボタン活性/非活性用
    isButtonDisabled() {
      const { userId, password, sex,weight,height,age } = this.user;
      return this.isLogin
          ? !userId || !password || !sex
          : !userId || !password || !sex || !weight || !height || !age;
    },

    submitBtnText() {
      return this.isLogin ? 'ログイン':'新規登録'
    },

    toggledBtnText() {
      return this.isLogin ? '新規登録':'ログイン'
    }
  },


  methods: {
    // Vue.jsで使う関数はここで記述する
    
    
    clearError() {
      this.errorMsg = ''
    },

    toggleMode() {
      this.isLogin = !this.isLogin;
    },

    async submit() {
      if (this.isCallingApi) {
        return;
      }
      console.log(this.gender);
      this.isCallingApi = true;

      const path = this.isLogin? '/user/login' : '/user/signup';
      const { userId, password, sex,weight,height,age } = this.user;
      const reqBody = this.isLogin
        ? { userId, password }
        : { userId, password, sex,weight,height,age };

      try {
        /* global fetch */
        const res = await fetch(baseUrl + path,
        {
          method: 'POST',
          body: JSON.stringify(reqBody)
        });

        const text = await res.text();
        const jsonData = text ? JSON.parse(text) : {}

        // fetchではネットワークエラー以外のエラーはthrowされないため、明示的にthrowする
        if (!res.ok) {
          const errorMessage = jsonData.message ?? 'エラーメッセージがありません';
          throw new Error(errorMessage);
        }
        let currentDate = new Date()
        window.localStorage.setItem("date", currentDate)
        window.localStorage.setItem('token', jsonData.token);
        window.localStorage.setItem('userId', this.user.userId);

        this.$router.push({ name: 'Diary' });
      } catch (e) {
        console.error(e);
        this.errorMsg = e;
      } finally {
        this.isCallingApi = false;
      }
    }
  },
  mounted:function(){
    /*global $*/
  $('#sex').dropdown();
  $('#asd').dropdown();
  }
}
</script>

<style scoped>
/* このコンポーネントだけに適用するCSSはここに記述する */
</style>
