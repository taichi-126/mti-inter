<template>
  <div>
    <div class="ui main container">

      <!-- 発展課題のローディング表示用 -->
      <div class="ui active inverted page dimmer" v-if="isCallingApi">
        <div class="ui text loader">Loading</div>
      </div>

      <div class="ui segment">
        <!-- 発展課題のエラーメッセージ用-->
        <p class="ui negative message" v-if="errorMsg">
          <i class="close icon" @click="clearMsg('error')"></i>
          <span class="header">エラーが発生しました！</span>
          {{ errorMsg }}
        </p>

        <!-- 発展課題の成功メッセージ用-->
        <p class="ui positive message" v-if="successMsg">
          <i class="close icon" @click="clearMsg"></i>
          <span class="header">完了しました！</span>
          {{ successMsg }}
        </p>

        <!-- 更新情報入力用フォーム -->
        <form class="ui large form" >
          <div class="field">
            <v-col align="center">
              <h2>食材の手入力</h2> 
            </v-col>
          </div>
          
          <div class="field">
            <div class="ui segment calender-bg">
              <v-col align="center">
                  <h2>日付</h2>
              </v-col>
            </div>
          </div>
          
        <div class="field">
          <div class="ui fluid search selection dropdown">
              <input type="hidden" name="country">
              <i class="dropdown icon"></i>
              <div class="default text">Select Country</div>
              <div class="menu">
              <div class="item" data-value="af"><i class="af flag"></i>Afghanistan</div>
              <div class="item" data-value="ax"><i class="ax flag"></i>Aland Islands</div>
              <div class="item" data-value="al"><i class="al flag"></i>Albania</div>
              <div class="item" data-value="kp"><i class="kp flag"></i>North Korea</div>
              <div class="item" data-value="mp"><i class="mp flag"></i>Northern Mariana Islands</div>
              <div class="item" data-value="no"><i class="no flag"></i>Norway</div>
              <div class="item" data-value="om"><i class="om flag"></i>Oman</div>
              <div class="item" data-value="pk"><i class="pk flag"></i>Pakistan</div>
              <div class="item" data-value="pw"><i class="pw flag"></i>Palau</div>
              <div class="item" data-value="ps"><i class="ps flag"></i>Palestine</div>
              <div class="item" data-value="pa"><i class="pa flag"></i>Panama</div>
              <div class="item" data-value="py"><i class="py flag"></i>Paraguay</div>
              <div class="item" data-value="pe"><i class="pe flag"></i>Peru</div>
              <div class="item" data-value="ph"><i class="ph flag"></i>Philippines</div>
              <div class="item" data-value="pn"><i class="pn flag"></i>Pitcairn Islands</div>
              <div class="item" data-value="pl"><i class="pl flag"></i>Poland</div>
              <div class="item" data-value="pt"><i class="pt flag"></i>Portugal</div>
              <div class="item" data-value="pr"><i class="pr flag"></i>Puerto Rico</div>
              <div class="item" data-value="qa"><i class="qa flag"></i>Qatar</div>
              <div class="item" data-value="re"><i class="re flag"></i>Reunion</div>
              <div class="item" data-value="ro"><i class="ro flag"></i>Romania</div>
              <div class="item" data-value="ru"><i class="ru flag"></i>Russia</div>
              <div class="item" data-value="rw"><i class="rw flag"></i>Rwanda</div>
              <div class="item" data-value="sh"><i class="sh flag"></i>Saint Helena</div>
              <div class="item" data-value="kn"><i class="kn flag"></i>Saint Kitts and Nevis</div>
              <div class="item" data-value="lc"><i class="lc flag"></i>Saint Lucia</div>
              <div class="item" data-value="pm"><i class="pm flag"></i>Saint Pierre</div>
              <div class="item" data-value="vc"><i class="vc flag"></i>Saint Vincent</div>
              <div class="item" data-value="ws"><i class="ws flag"></i>Samoa</div>
              <div class="item" data-value="sm"><i class="sm flag"></i>San Marino</div>
              <div class="item" data-value="gs"><i class="gs flag"></i>Sandwich Islands</div>
              <div class="item" data-value="st"><i class="st flag"></i>Sao Tome</div>
              <div class="item" data-value="sa"><i class="sa flag"></i>Saudi Arabia</div>
              <div class="item" data-value="sn"><i class="sn flag"></i>Senegal</div>
              <div class="item" data-value="cs"><i class="cs flag"></i>Serbia</div>
              <div class="item" data-value="rs"><i class="rs flag"></i>Serbia</div>
              <div class="item" data-value="sc"><i class="sc flag"></i>Seychelles</div>
              <div class="item" data-value="sl"><i class="sl flag"></i>Sierra Leone</div>
              <div class="item" data-value="sg"><i class="sg flag"></i>Singapore</div>
              <div class="item" data-value="sk"><i class="sk flag"></i>Slovakia</div>
              <div class="item" data-value="si"><i class="si flag"></i>Slovenia</div>
              <div class="item" data-value="sb"><i class="sb flag"></i>Solomon Islands</div>
              <div class="item" data-value="so"><i class="so flag"></i>Somalia</div>
              <div class="item" data-value="za"><i class="za flag"></i>South Africa</div>
              <div class="item" data-value="kr"><i class="kr flag"></i>South Korea</div>
              <div class="item" data-value="es"><i class="es flag"></i>Spain</div>
              <div class="item" data-value="lk"><i class="lk flag"></i>Sri Lanka</div>
              <div class="item" data-value="sd"><i class="sd flag"></i>Sudan</div>
              <div class="item" data-value="sr"><i class="sr flag"></i>Suriname</div>
              <div class="item" data-value="sj"><i class="sj flag"></i>Svalbard</div>
              <div class="item" data-value="sz"><i class="sz flag"></i>Swaziland</div>
              <div class="item" data-value="se"><i class="se flag"></i>Sweden</div>
              <div class="item" data-value="ch"><i class="ch flag"></i>Switzerland</div>
              <div class="item" data-value="sy"><i class="sy flag"></i>Syria</div>
              <div class="item" data-value="tw"><i class="tw flag"></i>Taiwan</div>
              <div class="item" data-value="tj"><i class="tj flag"></i>Tajikistan</div>
              <div class="item" data-value="tz"><i class="tz flag"></i>Tanzania</div>
              <div class="item" data-value="th"><i class="th flag"></i>Thailand</div>
              <div class="item" data-value="tl"><i class="tl flag"></i>Timorleste</div>
              <div class="item" data-value="tg"><i class="tg flag"></i>Togo</div>
              <div class="item" data-value="tk"><i class="tk flag"></i>Tokelau</div>
              <div class="item" data-value="to"><i class="to flag"></i>Tonga</div>
              <div class="item" data-value="tt"><i class="tt flag"></i>Trinidad</div>
              <div class="item" data-value="tn"><i class="tn flag"></i>Tunisia</div>
              <div class="item" data-value="tr"><i class="tr flag"></i>Turkey</div>
              <div class="item" data-value="tm"><i class="tm flag"></i>Turkmenistan</div>
              <div class="item" data-value="tv"><i class="tv flag"></i>Tuvalu</div>
              <div class="item" data-value="ug"><i class="ug flag"></i>Uganda</div>
              <div class="item" data-value="ua"><i class="ua flag"></i>Ukraine</div>
              <div class="item" data-value="ae"><i class="ae flag"></i>United Arab Emirates</div>
              <div class="item" data-value="us"><i class="us flag"></i>United States</div>
              <div class="item" data-value="uy"><i class="uy flag"></i>Uruguay</div>
              <div class="item" data-value="um"><i class="um flag"></i>Us Minor Islands</div>
              <div class="item" data-value="vi"><i class="vi flag"></i>Us Virgin Islands</div>
              <div class="item" data-value="uz"><i class="uz flag"></i>Uzbekistan</div>
              <div class="item" data-value="vu"><i class="vu flag"></i>Vanuatu</div>
              <div class="item" data-value="va"><i class="va flag"></i>Vatican City</div>
              <div class="item" data-value="ve"><i class="ve flag"></i>Venezuela</div>
              <div class="item" data-value="vn"><i class="vn flag"></i>Vietnam</div>
              <div class="item" data-value="wf"><i class="wf flag"></i>Wallis and Futuna</div>
              <div class="item" data-value="eh"><i class="eh flag"></i>Western Sahara</div>
              <div class="item" data-value="ye"><i class="ye flag"></i>Yemen</div>
              <div class="item" data-value="zm"><i class="zm flag"></i>Zambia</div>
              <div class="item" data-value="zw"><i class="zw flag"></i>Zimbabwe</div>
            </div>
         </div>  
        </div>
        
        <div class="field">
        <select class="ui fluid search dropdown" multiple="">
  <option value="">State</option>
  <option value="AL">Alabama</option>
  <option value="AK">Alaska</option>
  <option value="AZ">Arizona</option>
  <option value="AR">Arkansas</option>
  <option value="CA">California</option>
  <option value="CO">Colorado</option>
  <option value="CT">Connecticut</option>
  <option value="DE">Delaware</option>
  <option value="DC">District Of Columbia</option>
  <option value="FL">Florida</option>
  <option value="GA">Georgia</option>
  <option value="HI">Hawaii</option>
  <option value="ID">Idaho</option>
  <option value="IL">Illinois</option>
  <option value="IN">Indiana</option>
  <option value="IA">Iowa</option>
  <option value="KS">Kansas</option>
  <option value="KY">Kentucky</option>
  <option value="LA">Louisiana</option>
  <option value="ME">Maine</option>
  <option value="MD">Maryland</option>
  <option value="MA">Massachusetts</option>
  <option value="MI">Michigan</option>
  <option value="MN">Minnesota</option>
  <option value="MS">Mississippi</option>
  <option value="MO">Missouri</option>
  <option value="MT">Montana</option>
  <option value="NE">Nebraska</option>
  <option value="NV">Nevada</option>
  <option value="NH">New Hampshire</option>
  <option value="NJ">New Jersey</option>
  <option value="NM">New Mexico</option>
  <option value="NY">New York</option>
  <option value="NC">North Carolina</option>
  <option value="ND">North Dakota</option>
  <option value="OH">Ohio</option>
  <option value="OK">Oklahoma</option>
  <option value="OR">Oregon</option>
  <option value="PA">Pennsylvania</option>
  <option value="RI">Rhode Island</option>
  <option value="SC">South Carolina</option>
  <option value="SD">South Dakota</option>
  <option value="TN">Tennessee</option>
  <option value="TX">Texas</option>
  <option value="UT">Utah</option>
  <option value="VT">Vermont</option>
  <option value="VA">Virginia</option>
  <option value="WA">Washington</option>
  <option value="WV">West Virginia</option>
  <option value="WI">Wisconsin</option>
  <option value="WY">Wyoming</option>
</select>  
        </div>
        
          <div class="field">
            <button class="ui huge green fluid button" v-bind:disabled="isButtonDisabled" type="submit">追加</button>
          </div>

          
        </form>
      </div>
    </div>
  </div>
</template>

<script>
// 必要なものはここでインポートする
// @は/srcの同じ意味です
// import something from '@/components/something.vue';
import { baseUrl } from '@/assets/config.js';

const headers = {'Authorization': 'mtiToken'};

export default {
  name: 'Profile',

  components: {
    // 読み込んだコンポーネント名をここに記述する
  },

  data() {
    // Vue.jsで使う変数はここに記述する
    return {
      user: {
        userId: window.localStorage.userId,
        password: null,
        nickname: null,
        age: null
      },
      errorMsg: '', // 発展課題のエラーメッセージ用
      successMsg: '', //発展課題の成功メッセージ用
      isCallingApi: false // 発展課題のローディング表示用
    };
  },

  computed: {
    // 計算した結果を変数として利用したいときはここに記述する
  },

  methods: {
    // Vue.jsで使う関数はここで記述する
    // 発展課題のエラー・成功メッセージ用
    clearMsg(target) {
      if (target === 'error') {
        this.errorMsg = '';
      } else {
        this.successMsg = '';
      }
    },
  },

  created: async function() {

  }
}
</script>

<style scoped>
/* このコンポーネントだけに適用するCSSはここに記述する */
.calender-bg {
  background-color: rgba(128, 128, 128, 0.3); /* 任意の色を指定 */
}
</style>
