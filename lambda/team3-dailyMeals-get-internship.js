const { DynamoDBClient, GetItemCommand } = require("@aws-sdk/client-dynamodb");
const { marshall, unmarshall } = require("@aws-sdk/util-dynamodb");
const client = new DynamoDBClient({ region: "ap-northeast-1" });
const TableName = "team3_dailyMeals";

exports.handler = async (event, context) => {
  //レスポンスの雛形
  const response = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({ message: "" }),
  };
  
  if (event.headers.authorization !== "mtiToken") {
    response.statusCode = 401;
    response.body = JSON.stringify({
      message: "no authorization"
    });
    return response;
  }

  const userId = event.queryStringParameters?.userId;
  const date = parseInt(event.queryStringParameters?.date); // 文字列を数値に変換 
  const mealType = event.queryStringParameters?.mealType;

  if (!userId || !date || !mealType) {
    response.statusCode = 400;
    response.body = JSON.stringify({
      message: "無効なリクエスト. クエリパラメータが不足しています."
    });
    return response
  }

  //TODO: 取得対象のテーブル名と検索に使うキーをparamに宣言
  const param = {
    TableName,
    "Key": marshall({
      userId,
      date
    }),
  };

  // 指定したアイテムを取得するコマンドを用意
  const command = new GetItemCommand(param);

   //GetItemCommandの実行でDBからデータを取得
  try {
    // DynamoDBからのレスポンスをdailyMealとして取得します。
    const dailyMeal = (await client.send(command)).Item;
    
    if (!dailyMeal) {
      throw new Error("指定されたuserIdを持つ食事記録は見つかりません");
    }
    // 指定されたmealTypeのデータを取得します。
    const unmarshalledDailyMeal = unmarshall(dailyMeal)
    const mealData = unmarshalledDailyMeal.meals[mealType];
    if (!mealData) {
      throw new Error(`指定されたmealType（${mealType}）の食事記録は見つかりません`);
    }
    // レスポンスを指定された形式で構築します。
    response.body = JSON.stringify({
      userId: unmarshalledDailyMeal.userId,
      date: unmarshalledDailyMeal.date,
      dishes: mealData.dishes,
      nutrients: mealData.nutrients
    });
  } catch (e) {
    if (e.message == "指定されたuserIdを持つ食事記録は見つかりません") {
      response.statusCode = 404;
      response.body = JSON.stringify({
        message: e.message,
      });
    } else {
      response.statusCode = 500;
      response.body = JSON.stringify({
        message: "予期せぬエラーが発生しました。",
        errorDetail: e.toString(),
      });
    }
  }

  return response;
};
