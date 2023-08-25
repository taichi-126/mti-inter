const { DynamoDBClient, PutItemCommand, GetItemCommand } = require("@aws-sdk/client-dynamodb");
const { marshall, unmarshall } = require("@aws-sdk/util-dynamodb");
const client = new DynamoDBClient({ region: "ap-northeast-1" });
const TableName = "team3_dishes";

exports.handler = async (event, context) => {
  const response = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({ message: "" }),
  };
  
  if (event.headers.authorization !== "mtiToken"){
      response.statusCode = 401;
      response.body = JSON.stringify({
          message: "認証されていません。HeaderにTokenを指定してください",
      });
      
      return response;
  }

  // TODO: リクエストボディの中身をJavaScriptオブジェクトに変換し、1つ、あるいは複数の変数に代入する
  const body = event.body ? JSON.parse(event.body) : null;
  if (!body || !body.userId || !body.dishName || !body.ingredients ) {
    response.statusCode = 400;
    response.body = JSON.stringify({
      message:
        "無効なリクエストです。request bodyに必須パラメータがセットされていません。",
    });

    return response;
  }
  
  const { userId, dishName, ingredients } = body;
  
  //ingredientsを元にnutrientsを計算.
  // 栄養情報の初期化
  let nutrients = {};
  
  // ...前の部分のコード...

  for (let ingredient of ingredients) {
    const ingredientName = ingredient.name;
    const weight = ingredient.weight;

    try {
      // ingredientsTable から原材料の栄養情報を取得
      const ingredientParams = {
        TableName: "team3_ingredients", 
        Key: marshall({
          ingredientName
        })
      };

      const ingredientCommand = new GetItemCommand(ingredientParams);
      const ingredientData = await client.send(ingredientCommand);

      // 栄養情報が存在する場合、計算を行い、合計を更新
      if (ingredientData.Item) {
        const ingredientNutrients = unmarshall(ingredientData.Item).nutrients;

        for (let nutrient in ingredientNutrients) {
          if (!nutrients[nutrient]) {
            nutrients[nutrient] = 0;
          }
          // 重さに基づいて栄養を計算
          let calculatedValue = ingredientNutrients[nutrient] * (weight / 100);
          // 小数点第3位で四捨五入
          calculatedValue = Math.round(calculatedValue * 1000) / 1000;
    
          nutrients[nutrient] += calculatedValue;
        }
      }
    } catch (error) {
      console.error(`Error fetching or processing nutrient for ingredient: ${ingredientName}`, error);
     
      return {
        statusCode: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          message: `エラーが発生しました: 原材料 ${ingredientName} の栄養情報の取得または処理中`,
          errorDetail: error.toString(),
        }),
      };
    }
  }

  const param = {
    TableName,
    "Item" : marshall({
      dishName,
      userId,
      ingredients,
      nutrients,
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
      dishName,
      userId,
      ingredients,
      nutrients,
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
