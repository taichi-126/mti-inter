<template>
  <div>
    <div class="ui main container">
      <!-- 基本的なコンテンツはここに記載する -->

<h2>今日の食材</h2>

<!-- loop -->

 
  
  <table>
    <thead>
      <tr>
        <th>食事</th>
        <th>個数</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(name, quantity) in meals" >
        <td>
          <option v-for="dish in dishes" :value="dish">{{dish}}</option>
        </td>
        <td>
          <p>年齢</p>
        </td>
      </tr>
    </tbody>
    
  </table>
  


<select class="ui fluid search dropdown">
  <!-- tabel =>
  cssをいじる
  
  formを追加して, buttonをクリックしたら追加
  
  -->
 
  
  <template v-for="(meal, index) in meals" v-bind:key="meal.index">
    <option v-for="dish in dishes" :value="dish">{{dish}}</option>
    <button v-on:click="del(index)">削除</button>
  </template>
</select>

<button v-on:click="add">行を追加</button>


<div class="">aa</div>
  <div class="record-button">
      <button class="ui  green fluid button" @click="record">
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

const headers = {'Authorization': 'mtiToken' }

export default {
  name: "Diary",

  components: {
    // 読み込んだコンポーネント名をここに記述する
  },

  data() {
    // Vue.jsで使う変数はここに記述する
    return {
      userId: "",
      dishes: [],
      
      meals: [{ name: "", quantity: 0 }],
    }

  },

  computed: {
    // 計算した結果を変数として利用したいときはここに記述する
  },

  created: async function () {
    // Vue.jsの読み込みが完了したときに実行する処理はここに記述する
    // apiからarticleを取得する
    this.userId = window.localStorage.getItem("userId");
    
    try {
      /* global fetch */
      window.localStorage.setItem('userId', "team3")
      const res = await fetch(baseUrl + `/dishes?userId=${this.userId}`,{
        method: 'GET',
        headers
      });
      
      const text = await res.text();
      const jsonData = text ? JSON.parse(text) : {}
      
      if (!res.ok) {
        const errorMessage = jsonData.message ?? 'エラーメッセージがありません';
        throw new Error(errorMessage);
      }
      
      this.dishes = jsonData.dishes;
      console.log(this.dishes);
      
    } catch (e) {
      this.errorMsg = `Something Error occur: ${e}`
    }
  },

  methods: {
    // Vue.jsで使う関数はここで記述する
    async record() {
      
      const reqBody = {
        
      }
      
      try {
        let path = "/daily-meals";
        /* global fetch */
        const res = await fetch(baseUrl + path, {
          method: "POST",
          body: JSON.stringify(reqBody)
        });
        
        const text = await res.text();
        const jsonData = text ? JSON.parse(text) : {}

        // fetchではネットワークエラー以外のエラーはthrowされないため、明示的にthrowする
        if (!res.ok) {
          const errorMessage = jsonData.message ?? 'エラーメッセージがありません';
          throw new Error(errorMessage);
        }
        
        this.$router.push({ name: "Diary"})
      } catch(e) {
        console.error(e);
        this.errorMsg = e;
      }  
      
    },
    
    add() {
      this.meals.push({ name: "", quantity: 0 });
    },
    del(index) {
      this.meals.splice(index, 1)
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
.article-list {
  list-style: none;
  margin: 0;
  padding: 0;
  max-width: 100%;
}
.right-align {
  text-align: right;
}
</style>
