<template>
  <div>
    <div class="ui main container">
      <!-- 基本的なコンテンツはここに記載する -->

<div class="main-content">
  <h2>食品名</h2>
<h2>{{ newMeal }}</h2>
  <table>
    <thead>
      <tr>
        <th>食事</th>
        <th>重さ(g)</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(key, index) in tableCol" :key="index">
        <td>
          <select class="ui fluid search dropdown" v-on:change="selectIngredient">
            <option v-for="ingredient in ingredients" :value="ingredient">{{ingredient}}</option>
          </select>
        </td>
        <td>
          <div v-if="quantityFlags[index]">
            <input  v-model.number="quantitys[index]"  type="number" min="30" placeholder="重さ" v-on:change="selectQuantity(index)" />
          </div>
        </td>
      </tr>
    </tbody>
    
  </table>
  

<div class="button-seg">
<button v-on:click="add" class="add-button">行を追加</button>
<button v-on:click="del" class="del-buton">削除</button>  
</div>
</div>


<div class="container"></div>

 
 
  <div class="record-button">
      <button class="ui  green fluid button" @click="record">
        <i class="arrow alternate circle right icon"></i>
        <p>材料を記録する</p>
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
      
      ingredients: [],
      
      tableCol: [{key: ""}],
      pointedIngredients: [],
      quantitys: [0,0,],
      quantityFlags: [],
      index: 1,
      
      newMeal: "",
      
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
    this.newMeal = window.localStorage.getItem("newMeal")
    try {
      /* global fetch */
      const res = await fetch(baseUrl + `/ingredients`,{
        method: 'GET',
        headers
      });
      
      const text = await res.text();
      const jsonData = text ? JSON.parse(text) : {}
      
      if (!res.ok) {
        const errorMessage = jsonData.message ?? 'エラーメッセージがありません';
        throw new Error(errorMessage);
      }
      
      this.ingredients = jsonData.ingredients;
      console.log(this.ingredients);
      
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
    
      const ingredients = this.pointedIngredients;
      // ページ遷移で持ってくる
      const dishName = this.newMeal;
      const reqBody = {
        dishName, userId,  ingredients, 
      }
      console.log(reqBody)
      
      try {
        let path = "/dishes";
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
        
        console.log(jsonData.ingredients)
        console.log(jsonData.nutrients)
        this.$router.push({ name: "Record"})
      } catch(e) {
        console.error(e);
        this.errorMsg = e;
      }  
      
    },
    
    add() {
      this.index += 1
      this.tableCol.push({ key: "",});
      if (this.quantitys.length < this.index+1) {
        this.quantitys.push(0)
      };
    },
    del() {
      this.tableCol.pop()
    },
    
    selectIngredient(ingredient) {
      this.pointedIngredients.push({ name: ingredient.target.value, weight: 1 });
      this.quantityFlags.push(true);
    },
    
    selectQuantity(index) {
      this.pointedIngredients[index]["weight"] = this.quantitys[index]
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
.container {
  height: 100px;
}
.main-content {
  background-color: rgba(127,255,0, 0.4);
  text-align:center;
}
table {
    margin-left: auto;
    margin-right: auto;
}
.sub-content {
  background-color: rgba(	192,192,192, 0.5);
}
.record-button {
  margin-top: 30px;
}
.add-button {
  margin-right: 40px;
  margin-bottom: 40px;
  width: 100px;
}
.del-button {
  width: 100px;
  margin-bottom: 40px;
}
.button-seg {
  margin-top: 30px;
  
}
h2 {
  padding-top: 30px;  
}
</style>
