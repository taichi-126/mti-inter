<template>
    <div class="ui main container">
      <!-- 基本的なコンテンツはここに記載する -->
      <div class="dairy-content">   
        <div class="ui massive menu">
        <!-- 基本的なコンテンツはここに記載する -->
        <p class="right item">{{ month }}月</p>
        <router-link class="right item" to="/calendar">
            <i class="calendar icon"></i>
          </router-link>
        </div>
      
      
      <p>------------------</p>
      
      <div class="ui grid">
    <div class="eight column row">
      <template v-for="(day, index) in days" :key="index">
          <div class="column"><center>
            <a href="/" @click="setDate(day)">{{ day.format("D") }}</a>
            </center></div>
      </template>
    </div>
    </div>
      
        <div>
          <p>aaa</p>
        </div>
      
        <div class="record-button">
            <button class="ui  green fluid button" @click="submit">
              <i class="plus icon"></i>
            </button>
        </div>
      </div>

  
  </div>
</template>

<script>
// 必要なものはここでインポートする
// @は/srcと同じ意味です
// import something from '@/components/something.vue';
import { baseUrl } from "@/assets/config.js";
import moment from 'moment';

export default {
  name: "Diary",

  components: {
    // 読み込んだコンポーネント名をここに記述する
  },

  data() {
    // Vue.jsで使う変数はここに記述する
    return {
      date: "",
      month: "",
      day: "",
      days: [],
    }

  },

  computed: {
    // 計算した結果を変数として利用したいときはここに記述する
  },

  created: async function () {
    // Vue.jsの読み込みが完了したときに実行する処理はここに記述する
    // apiからarticleを取得する
    
    let date = window.localStorage.getItem("date")
    this.date = date;
      this.month = moment(this.date).format("M");
      this.day = moment(this.date).format("D");
      this.days = [
        moment(this.date).add('days', -4),
        moment(this.date).add('days', -3),
        moment(this.date).add('days', -2),
        moment(this.date).add('days', -1),
        moment(this.date),
        moment(this.date).add('days', 1),
        moment(this.date).add('days', 2),
        moment(this.date).add('days', 3)
        ]
    
    
  },

  methods: {
    // Vue.jsで使う関数はここで記述する
    async submit() {
      this.$router.push({ name: "Record" });
    },
    
    setDate(date) {
      window.localStorage.setItem("date", date)
    }

  },
  

  mounted: function(){
  
        /* global $ */
  
        $('.ui.dropdown').dropdown({
  
          allowAdditions:true
  
        });
  
      },
      
};
</script>

<style scoped>
/* このコンポーネントだけに適用するCSSはここに記述する */
.right-align {
  text-align: right;
}
.menu-container {
  display: flex;
  justify-content: center;
}
.column {
  align: center;  
}
</style>
