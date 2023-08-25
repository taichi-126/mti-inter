const { DynamoDBClient, PutItemCommand, GetItemCommand } = require("@aws-sdk/client-dynamodb");
const { marshall, unmarshall } = require("@aws-sdk/util-dynamodb");
const client = new DynamoDBClient({ region: "ap-northeast-1" });
const TableName = "team3_dailyMeals";

exports.handler = async (event, context) => {
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
      message: "認証されていません。HeaderにTokenを指定してください",
    });
    return response;
  }

  const body = event.body ? JSON.parse(event.body) : null;
  if (!body || !body.userId || !body.date || !body.dishes || !body.mealType) {
    response.statusCode = 400;
    response.body = JSON.stringify({
      message: "無効なリクエストです。request bodyに必須パラメータがセットされていません。",
    });
    return response;
  }

  const { userId, date, dishes, mealType } = body;
  let mealNutrients = {};
  
  for (let dish of dishes) {
    const dishName = dish.dishName;
    const quantity = dish.quantity;

    try {
      // ingredientsTable から原材料の栄養情報を取得
      const dishParams = {
        TableName: "team3_dishes", 
        Key: marshall({
          dishName,
          userId
        })
      };

      const dishCommand = new GetItemCommand(dishParams);
      const dishData = await client.send(dishCommand);

      // 栄養情報が存在する場合、計算を行い、合計を更新
      if (dishData.Item) {
        const dishNutrients = unmarshall(dishData.Item).nutrients;

        for (let nutrient in dishNutrients) {
          if (!mealNutrients[nutrient]) {
            mealNutrients[nutrient] = 0;
          }
          // 重さに基づいて栄養を計算
          let calculatedValue = dishNutrients[nutrient] * quantity;
          // 小数点第3位で四捨五入
          calculatedValue = Math.round(calculatedValue * 1000) / 1000;
    
          mealNutrients[nutrient] += calculatedValue;
        }
      }
    } catch (error) {
      console.error(`Error fetching or processing nutrient for ingredient: ${dishName}`, error);
     
      return {
        statusCode: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          message: `エラーが発生しました: 料理 ${dishName} の栄養情報の取得または処理中`,
          errorDetail: error.toString(),
        }),
      };
    }
  }
  
  // すでに存在するデータを取得します。
  let existingDataParams = {
    TableName,
    Key: marshall({
      userId,
      date
    })
  };
  
  let existingData;
  try {
    const data = await client.send(new GetItemCommand(existingDataParams));
    if (data.Item) {
      existingData = unmarshall(data.Item);
    }
  } catch (error) {
    console.error("Error fetching existing data:", error);

    return {
      statusCode: 500,
      headers: { "Access-Control-Allow-Origin": "*",},
      body: JSON.stringify({
        message: "存在するデータの取得中にエラーが発生しました。",
        errorDetail: error.toString(),
      }),
    };
  }
  //データがすでに保存されている場合はmealsを書き換えるor mealTypeで別の食事記録を追加.
  let mealsData = existingData && existingData.meals ? existingData.meals : {};
  mealsData[mealType] = {
      dishes: dishes,
      nutrients: mealNutrients
  };

  const param = {
    TableName,
    "Item" : marshall({
      userId,
      date,
      meals: mealsData
    }),
  };
  

  const command = new PutItemCommand(param);

  try {
    await client.send(command);
    response.statusCode = 200;
    response.body = JSON.stringify({
      "nutrients": mealNutrients,
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
