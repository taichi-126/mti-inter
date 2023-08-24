<template>
  <div>
    <div class="ui main container">
      <!-- 基本的なコンテンツはここに記載する -->

      <!-- 発展課題のローディング表示用 -->
      <div class="ui active inverted page dimmer" v-if="isCallingApi">
        <div class="ui text loader">Loading</div>
      </div>

      <!-- 発展課題のエラーメッセージ用 -->
      <p class="ui negative message" v-if="errorMsg">
        <i class="close icon" @click="clearError"></i>
        <span class="header">エラーが発生しました！</span>
        {{ errorMsg }}
      </p>

      <!-- 検索ボックス -->
      <div class="ui segment">
        <form class="ui form">
          <div class="field">
            <label for="nickname">ユーザー名</label>
            <input v-model="nickname" type="text" id="nickname" name="nickname" placeholder="Nickname" />
          </div>

          <div class="field">
            <label>年齢</label>
            <div class="inline fields">
              <div class="field">
                <input v-model.number="start" type="text" id="agestart" name="agestart"/>
                <label for="agestart">歳から</label>
              </div>

              <div class="field">
                <input v-model.number="end" type="text" id="ageend" name="ageend"/>
                <label for="ageend">歳まで</label>
              </div>
            </div>
          </div>
        </form>
      </div>

      <!-- ユーザー一覧 -->
      <ul class="ui three column grid">
        <template v-for="(item, index) in filteredUsers" :key="index">
          <li class="column">
            <div class="ui card fluid" >
              <div class="content">
                <h2 class="header">
                  {{ item.nickname }}
                  <span class="ui green label">{{ item.age }}</span>
                </h2>
                <span class="meta">{{ item.userId }} </span>
              </div>
            </div>
          </li>
        </template>
      </ul>
    </div>
  </div>
</template>

<script>
// 必要なものはここでインポートする
// @は/srcの同じ意味です
// import something from '@/components/something.vue';
import { baseUrl } from '@/assets/config.js';

const headers = { 'Authorization': 'mtiToken' };

export default {
  name: 'User',

  components: {
    // 読み込んだコンポーネント名をここに記述する
  },

  data() {
    // Vue.jsで使う変数はここに記述する
    return {
      users: [],
      nickname: '',
      start: 0,
      end: 100,
      errorMsg: '', // 発展課題のエラーメッセージ用
      isCallingApi: false // 発展課題のローディング表示用
    };
  },

  computed: {
    // 計算した結果を変数として利用したいときはここに記述する
    filteredUsers() {
      return this.users.filter(e =>
        e.nickname?.match(this.nickname)
        && e.age >= this.start
        && e.age <= this.end
      );
    }
  },

  methods: {
    // Vue.jsで使う関数はここで記述する
    // 発展課題のエラーメッセージ用
    clearError() {
      this.errorMsg = ''
    },
  },

  created: async function() {
    this.isCallingApi = true;

    try {
      /* global fetch */
      const res = await fetch(baseUrl + '/users', {
        method: 'GET',
        headers
      });

      const text = await res.text();
      const jsonData = text ? JSON.parse(text) : {}

      // fetchではネットワークエラー以外のエラーはthrowされないため、明示的にthrowする
      if (!res.ok) {
        const errorMessage = jsonData.message ?? 'エラーメッセージがありません';
        throw new Error(errorMessage);
      }

      this.users = jsonData.users ?? [];
    } catch (e) {
      this.errorMsg = `ユーザーリスト取得時にエラーが発生しました: ${e}`;
    } finally {
      this.isCallingApi = false;
    }
  }
}
</script>

<style scoped>
/* このコンポーネントだけに適用するCSSはここに記述する */
</style>
