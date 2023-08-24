<template>
  <div>
    <div class="ui main container">
      <!-- 基本的なコンテンツはここに記載する -->

<h2>今日の食材</h2>

 
  
  <table>
    <thead>
      <tr>
        <th>食事</th>
        <th>個数</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(key, index) in tableCol" :key="index">
        <td>
          <select class="ui fluid search dropdown" v-on:change="selectDish">
            <option v-for="dish in dishes" :value="dish">{{dish}}</option>
          </select>
        </td>
        <td>
          <div v-if="quantityFlags[index]">
            <input  v-model.number="quantitys[index]"  type="number" min="1" placeholder="Age" v-on:change="selectQuantity(index)" />
          </div>
        </td>
      </tr>
    </tbody>
    
  </table>
  


<button v-on:click="add">行を追加</button>
<button v-on:click="del">削除</button>

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
      date: "",
      
      quantity: 1,
      
      tableCol: [{key: ""}],
      meals: [],
      quantitys: [0,0,],
      quantityFlags: [],
      index: 1,
      
    }

  },

  computed: {
    // 計算した結果を変数として利用したいときはここに記述する
  },

  created: async function () {
    // Vue.jsの読み込みが完了したときに実行する処理はここに記述する
    // apiからarticleを取得する
    this.userId = window.localStorage.getItem("userId");
    this.date = window.localStorage.getItem("date");
    try {
      /* global fetch */
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
 
      const userId = this.userId;
      // const date = this.date
      //dateの変換
      const date = 20230824
      const dishes = this.meals;
      // ページ遷移で持ってくる
      const mealType = "dinner"
      console.log(this.meals)
      
      const reqBody = {
        userId, date, dishes, mealType
      }
      console.log(reqBody)
      
      try {
        let path = "/daily-meals";
        /* global fetch */
        const res = await fetch(baseUrl + path, {
          method: "POST",
          headers: headers,
          body: JSON.stringify(reqBody),
          
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
      this.index += 1
      this.tableCol.push({ name: "", quantity: 0 });
      if (this.quantitys.length < this.index+1) {
        this.quantitys.push(0)
      };
    },
    del() {
      this.tableCol.pop()
    },
    
    selectDish(dish) {
      this.meals.push({ dishName: dish.target.value, quantity: 1 });
      this.quantityFlags.push(true);
    },
    
    selectQuantity(index) {
      this.meals[index]["quantity"] = this.quantitys[index]
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
