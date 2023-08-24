<template>
  <div>
    <div class="ui main container">
      <!-- 基本的なコンテンツはここに記載する -->

      <!-- 発展課題のローディング表示用 -->
      <div class="ui active inverted page dimmer" v-if="isCallingApi">
        <div class="ui text loader">Loading</div>
      </div>

      <div class="ui segment">
        <!-- 発展課題のエラーメッセージ用-->
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

          <div class="field" v-if="!isLogin">
            <div class="ui left icon input">
              <i class="tag icon"></i>
              <input v-model="user.nickname" type="text" placeholder="Nickname"/>
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

      <button @click="toggleMode" class="ui huge grey fluid button" type="submit">{{ toggledBtnText }}</button>
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
        nickname: null,
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
      const { userId, password, nickname, age } = this.user;
      return this.isLogin
          ? !userId || !password
          : !userId || !password || !nickname || !age;
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

    // 発展課題のエラーメッセージ用
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
      this.isCallingApi = true;

      const path = this.isLogin? '/user/login' : '/user/signup';
      const { userId, password, nickname, age } = this.user;
      const reqBody = this.isLogin
        ? { userId, password }
        : { userId, password, nickname, age };

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

        window.localStorage.setItem('token', jsonData.token);
        window.localStorage.setItem('userId', this.user.userId);

        this.$router.push({ name: 'Home' });
      } catch (e) {
        console.error(e);
        this.errorMsg = e;
      } finally {
        this.isCallingApi = false;
      }
    }
  },
}
</script>

<style scoped>
/* このコンポーネントだけに適用するCSSはここに記述する */
</style>
