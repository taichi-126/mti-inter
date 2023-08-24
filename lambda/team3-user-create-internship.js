const { DynamoDBClient, PutItemCommand } = require("@aws-sdk/client-dynamodb");
const { marshall } = require("@aws-sdk/util-dynamodb");
const client = new DynamoDBClient({ region: "ap-northeast-1" });
const TableName = "team3_user";


function calculateDailyNutrientGoals(weight, sex, height, age) {
    let protein, vitaminD, vitaminB12, iron, dha, epa, calcium, zinc;

    // たんぱく質: 一般的に成人の場合、体重1kgあたり1.2gを目安とする
    protein = weight * 1.2;

    // ビタミンD, ビタミンB12, 鉄分, DHA, EPA, カルシウム, 亜鉛 は年齢や性別により異なる
    // ここでは簡略化のため、成人男性・女性の平均的な値を基準とする
    vitaminD = 8.5;     // μg
    vitaminB12 = 2.4;  // μg

    if (sex === 'male') {
        calcium = 800;
        iron = 8;      // mg
        dha = 11;    // g
        epa = 2;    // g
        zinc = 11;         // mg
    } else {
        calcium = 650;
        iron = 11;     // mg
        dha = 8;   // g
        epa = 1.6;   // g
        zinc = 8;         // mg
    }

    return {
        protein,
        vitaminD,
        vitaminB12,
        iron,
        dha,
        epa,
        calcium,
        zinc
    };
}


exports.handler = async (event, context) => {
  const response = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({ message: "" }),
  };

  // TODO: リクエストボディの中身をJavaScriptオブジェクトに変換し、1つ、あるいは複数の変数に代入する
  const body = event.body ? JSON.parse(event.body) : null;
  if (!body || !body.userId || !body.age || !body.password || !body.sex || !body.height || !body.weight) {
    response.statusCode = 400;
    response.body = JSON.stringify({
      message:
        "無効なリクエストです。request bodyに必須パラメータがセットされていません。",
    });

    return response;
  }
  
  const { userId, password, sex, age, height, weight } = body;
  
  //１日の目標栄養素を表示.
  let dailyNutrientGoals;
  try{
   dailyNutrientGoals = calculateDailyNutrientGoals(weight, sex, height, age); 
  } catch(e){
    response.statusCode = 500;
    response.body = JSON.stringify({
      message: "予期せぬエラーが発生しました。",
      errorDetail: e.toString(),
    });
  }

  // TODO: DBに登録するための情報をparamオブジェクトとして宣言する（中身を記述）
  const param = {
    TableName,
    "Item" : marshall({
      userId,
      password,
      sex,
      age,
      height,
      weight,
      dailyNutrientGoals
    }),
  };

  // DBにデータを登録するコマンドを用意
  const command = new PutItemCommand(param);

  try {
    // client.send()でDBにデータを登録するコマンドを実行
    await client.send(command);
    // TODO: 登録に成功した場合の処理を記載する。(status codeの設定と、response bodyの設定)
    response.statusCode = 201;
    response.body = JSON.stringify({
      userId,
      sex,
      age,
      height,
      weight,
      dailyNutrientGoals,
      token: "mtiToken",
    });
  } catch (e) {
    response.statusCode = 500;
    response.body = JSON.stringify({
      message: "予期せぬエラーが発生しました。",
      errorDetail: e.toString(),
    });
  }

  return response;
};