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
      
      
    <div class="content">
      
    </div>
      
      <div class="ui grid">
    <div class="eight column row">
      <template v-for="(day, index) in days" :key="index">
          <div class="column"><center>
            <a href="/" @click="setDate(day)">{{ day.format("D") }}</a>
            </center></div>
      </template>
    </div>
    </div>
    
      
    <div class="content">
    </div>
    
    <div class="chart-seqment">
      
         <div>
          <h1>栄養素表示</h1>
          <div class="ui main container">
            <div class="progress-bar-container">
              <div v-for="(nutrient, index) in nutrients" :key="index" class="progress-bar-wrapper">
                <div class="nutrient-label"><h3>{{ nutrients_ja[index] }}</h3></div>
                 <div name="progress" class="ui green progress" 
                   :data-percent="progressBarWidths(nutrient)"
                   >
                  <div class="bar"></div>
              </div>
                <div class="tag1">{{progressBarWidths(nutrient)}}% 達成中</div>
                <p></p><div class="remaining-amount">残り{{ remainingAmount(nutrient) }} g摂取することを目指しましょう！</div>
                
              </div>
            </div>
          </div>
        </div>
              <div class="ui segment"></div>
      
      
      </div>
      
        <div class="record-button">
            <button class="ui  green fluid button" @click="submit">
              <i class="plus icon"></i>
              <p>食事を記録する</p>
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
      date: "",
      month: "",
      days: [],
      
      // user data
      userId: window.localStorage.getItem("userId"),
      height: 0,
      sex: "",
      weight: 0,
      age: 0,
      dailyNutrientGoals: {},
      
      //data fo chart
      nutrients: [
        'protein',
        'vitaminD',
        'vitaminB12',
        'iron',
        'dha',
        'epa',
        'calcium',
        'zinc',
      ],
      
      
      totalNutrients: {
        'protein': 84,
        'vitaminD': 8.5,
        'vitaminB12': 2.4,
        'iron': 5,
        'dha': 11,
        'epa': 2,
        'calcium': 700,
        'zinc': 9,
      },
      
      nutrients_ja: [
        'タンパク質',
        'ビタミンD',
        'ビタミンD12',
        '鉄分',
        'DHA',
        'EPA',
        'カルシウム',
        '亜鉛',
      ],
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
    
    console.log(this.date);
    
    // Get nutorition
    try {
      /* global fetch */
      const res = await fetch(baseUrl + `/user?userId=${this.userId}`,{
        method: 'GET',
        headers
      });
      
      const text = await res.text();
      const jsonData = text ? JSON.parse(text) : {}
      
      if (!res.ok) {
        const errorMessage = jsonData.message ?? 'エラーメッセージがありません';
        throw new Error(errorMessage);
      }
      
      this.height = jsonData.height;
      this.sex = jsonData.sex;
      this.weight = jsonData.weight;
      this.age = jsonData.age;
      this.dailyNutrientGoals = jsonData.dailyNutrientGoals;
      console.log(`height ${this.height}`)
      console.log(`this.sex ${this.sex}`)
      console.log(`weight ${this.weight}`)
      console.log(`age ${this.age}`)
      console.log(`dailyNutrientGoals ${this.dailyNutrientGoals}`)
    } catch (e) {
      this.errorMsg = `Something Error occur: ${e}`
    }
  },

  methods: {
    // Vue.jsで使う関数はここで記述する
    
    async submit() {
      this.$router.push({ name: "Record" });
    },
    
    setDate(date) {
      window.localStorage.setItem("date", date)
    },
    
    progressBarWidths(nutrient) {
      const progressBarWidths = {};
      for (const nutrient of this.nutrients) {
        const intake = this.totalNutrients[nutrient];
        const goal = this.dailyNutrientGoals[nutrient]
        const percentage = (intake / goal) * 100;
        progressBarWidths[nutrient] = Math.min(percentage, 100);
      }
        return progressBarWidths[nutrient];
    },
    
    remainingAmount(nutrient) {
      const intake = this.totalNutrients[nutrient];
      const goal = this.dailyNutrientGoals[nutrient]
      const remaining = Math.max(goal - intake, 0);
      return remaining.toFixed(2); // 小数点2桁まで表示
    },
  },
  
  mounted: function(){
        /* global $ */
        $('.ui.dropdown').dropdown({
          allowAdditions:true
        });
        
        $('div[name="progress"]').each((i, e)=> $(e).progress());
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
.content {
  height: 100px;
}
.ui.green.progress .bar {
  background-color: #21ba45; /*進捗バーの色*/ 
}

.ui.green.progress {
  background-color: #A9A9A9; /*プログレスバー全体の背景色*/
}
.tag1{
  text-align:center;
  font-weight: bold;
}
.remaining-amount{
  display: flex;
  justify-content: flex-end; /* 右端に配置 */
  font-weight: bold;
  /*background-color: lightblue; */
  padding: 10px; 
}
</style>
