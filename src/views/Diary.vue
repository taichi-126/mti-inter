<template>
    <div class="ui main container">
      <!-- 基本的なコンテンツはここに記載する -->
      <div class="dairy-content">   
        <div class="ui massive menu">
        <!-- 基本的なコンテンツはここに記載する -->
        <div class="left menu">
          <a @click="logout" class="item">Logout</a>
        </div>
        <p class="right item">{{ month }}月</p>
        <router-link class="right item" to="/">
            <i class="calendar icon"></i>
          </router-link>  
        </div>
      
      
      <div class="ui grid">
    <div class="eight column row">
      <template v-for="(day, index) in days" :key="index">
          <div class="column">
            <div class="active-tag" v-if="index==4">
              <center>
                <a href="/" @click="setDate(day)" class="active-atag">{{ day.format("D") }}</a>
              </center>              
            </div>
            
            <div class="tag" v-if="index!==4">
              <center>
                <a href="/" @click="setDate(day)" class="atag">{{ day.format("D") }}</a>
              </center>              
            </div>
            
            </div>
      </template>
    </div>
    </div>
    
      
      
    <div class="content">
    </div>
    
    <div class="advice-seg">
      !!&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;健康への一言&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;！！<br>
      タンパク質が不足しています！！😢<br>
      あなたは、豆腐ハンバーグを食べよう！！！
      <br>
      
    </div>
    
    <div class="chart-seqment">
         <div>
          <h1>栄養素表示</h1>
          <div class="ui main container">
            <div class="progress-bar-container">
              <div v-for="(nutrient, index) in nutrients" :key="index" class="progress-bar-wrapper">
                <div class="nutrient-label"><h3>{{ nutrients_ja[index] }}</h3></div>
                 <div name="progress" class="ui green progress" :data-percent="progressBarWidthsFunc(nutrient)">
                  <div class="bar"></div>
                </div>
                <div class="tag1">{{progressBarWidthsFunc(nutrient)}}% 達成中</div>
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

      
      progressBarWidths: {},
      // // data fo chart
      
      // nutrients: [
      //   'protein',
      //   'vitaminD',
      //   'vitaminB12',
      //   'iron',
      //   'dha',
      //   'epa',
      //   'calcium',
      //   'zinc',
      // ],
      
      
      // totalNutrients: {
      //   'protein': 84,
      //   'vitaminD': 8.5,
      //   'vitaminB12': 2.4,
      //   'iron': 5,
      //   'dha': 11,
      //   'epa': 2,
      //   'calcium': 700,
      //   'zinc': 9,
      // },
      
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
      
        nutrients: [
        'タンパク質',
        'ビタミンD',
        'ビタミンD12',
        '鉄分',
        'DHA',
        'EPA',
        'カルシウム',
        '亜鉛',
      ],
      maxValues: {
        'タンパク質': 100,
        'ビタミンD': 50,
        'ビタミンD12': 150,
        '鉄分': 130,
        'DHA': 180,
        'EPA': 70,
        'カルシウム': 100,
        '亜鉛': 100,
      },
      totalNutrients: {
        'タンパク質': 12,
        'ビタミンD': 34,
        'ビタミンD12': 68,
        '鉄分': 54,
        'DHA': 70,
        'EPA': 78,
        'カルシウム': 70,
        '亜鉛': 70,
      },
      totalNutrientsAPI: {
        
      }
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

    } catch (e) {
      this.errorMsg = `Something Error occur: ${e}`
    }
    
    
    // Get daily nutrition
    try {
      /* global fetch */
      // ${Date.parse(this.date)}
      const res = await fetch(baseUrl + `/daily-meals/total?userId=${this.userId}&date=20230823`,{
        method: 'GET',
        headers
      });
      
      const text = await res.text();
      const jsonData = text ? JSON.parse(text) : {}
      
      if (!res.ok) {
        const errorMessage = jsonData.message ?? 'エラーメッセージがありません';
        throw new Error(errorMessage);
      }
      
      
      this.totalNutrientsAPI = jsonData.totalNutrients;
      console.log(this.totalNutrientsAPI)
      
    } catch (e) {
      if(e.message == "指定されたuserIdを持つ食事記録は見つかりません") {
        this.totalNutrientsAPI = {
        'タンパク質': 0,
        'ビタミンD': 0,
        'ビタミンD12': 0,
        '鉄分': 0,
        'DHA': 0,
        'EPA': 0,
        'カルシウム': 0,
        '亜鉛': 0,
        }
      }
      
      
      this.errorMsg = `Something Error occur: ${e}`
    }
    
  },

  methods: {
    // Vue.jsで使う関数はここで記述する
    
    logout() {
      window.localStorage.clear();
      this.$router.push({ name : "Login" })
    },
    
    async submit() {
      this.$router.push({ name: "Record" });
    },
    
    setDate(date) {
      window.localStorage.setItem("date", date)
      this.$router.push({ name: "/"})
    },
    
    progressBarWidthsFunc(nutrient) {
      const progressBarWidths = {};
      
        // const intake = this.totalNutrients[nutrient];
        // const goal = this.dailyNutrientGoals[nutrient];
        // const percentage = (intake / goal) * 100;
        
        // progressBarWidths[nutrient] = Math.min(percentage, 100).toFixed(0);
        // console.log(` ${nutrient} ${progressBarWidths[nutrient]}`)
        const intake = this.totalNutrients[nutrient];
        const maxValue = this.maxValues[nutrient];
        const percentage = (intake / maxValue) * 100;
        progressBarWidths[nutrient] = Math.min(percentage, 100);
        return progressBarWidths[nutrient].toFixed(1);
    },
    
    remainingAmount(nutrient) {
      // const intake = this.totalNutrients[nutrient];
      // const goal = Number(this.dailyNutrientGoals[nutrient])
      // const remaining = Math.max(goal - intake, 0);
      const intake = this.totalNutrients[nutrient];
      const maxValue = this.maxValues[nutrient];
      const remaining = Math.max(maxValue - intake, 0);
      return remaining.toFixed(1); // 小数点2桁まで表示
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
.tag {
  background: grey;
  height: 30px;
}
.atag {
  color: black;
}
.active-atag {
  color: white;
}

.active-tag {
  background: lightgreen;
  height: 30px;
}
.menu-container {
  display: flex;
  justify-content: center;
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
.advice-seg{
 text-align:center;
 background-color: lightgreen;
 margin-bottom: 50px;
}
</style>
