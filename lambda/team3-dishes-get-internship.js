const { DynamoDBClient, QueryCommand } = require("@aws-sdk/client-dynamodb");
const { unmarshall } = require("@aws-sdk/util-dynamodb");
const client = new DynamoDBClient({ region: "ap-northeast-1" });
const TableName = "team3_dishes";
const IndexName = "userId-index";  // GSIの名前

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
  
  const userId = event.queryStringParameters.userId;
    if (!userId) {
        response.statusCode = 400;
        response.body = JSON.stringify({
            message: "userIdクエリパラメータが必要です。",
        });
        return response;
    }

    const queryParameters = {
        TableName,
        IndexName,
        KeyConditionExpression: "userId = :userIdValue",
        ExpressionAttributeValues: {
            ":userIdValue": { S: userId }
        }
    };
    const command = new QueryCommand(queryParameters);
  
  try {
    // client.send()で全件取得するコマンドを実行
    const dishes = (await client.send(command)).Items;
    if (dishes.length == 0) {
      response.body = JSON.stringify({ dishes: [] });
    } else {
      const unmarshallDishes = dishes.map((item) => unmarshall(item).dishName); //dishNameのみ返す
      response.body = JSON.stringify({ dishes: unmarshallDishes });
    }
  } catch (e) {
    console.error("Error:", e);
    response.statusCode = 500;
    response.body = JSON.stringify({
      message: "予期せぬエラーが発生しました。",
      errorDetail: e.toString(),
    });
  }

  return response;
};
