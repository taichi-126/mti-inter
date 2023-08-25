const { DynamoDBClient, QueryCommand, ScanCommand } = require("@aws-sdk/client-dynamodb");
const { marshall, unmarshall } = require("@aws-sdk/util-dynamodb");
const client = new DynamoDBClient({ region: "ap-northeast-1" });
const TableName = "team3_article";

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
  
  let command;
  if (event.queryStringParameters && event.queryStringParameters.userId) {
      const { userId, start, end, category } = event.queryStringParameters;
      
      let expressionArray = ["userId = :userId"];
      let expressionValues = {
          ":userId": userId
      };
      
      expressionArray.push("#ts BETWEEN :start AND :end");
      expressionValues[":start"] = Number.isNaN(parseInt(start)) ? 0 : parseInt(start);
      expressionValues[":end"] = Number.isNaN(parseInt(end)) ? Date.now() : parseInt(end);
      
      const param = {
          TableName,
          KeyConditionExpression: expressionArray.join(" AND "),
          ExpressionAttributeValues: expressionValues,
          ExpressionAttributeNames: { "#ts": "timestamp" },
          Limit: 100,
      }
      
      if(category) {
          param.FilterExpression = "category = :category";
          param.ExpressionAttributeValues[":category"] = category;
      }
      
      param.ExpressionAttributeValues = marshall(param.ExpressionAttributeValues);
      
      command = new QueryCommand(param);
  } else {
      command = new ScanCommand({ TableName, Limit: 100 });
  }
 
  try {
    // client.send()で全件取得するコマンドを実行
    const articles = (await client.send(command)).Items;
    if (articles.length == 0) {
      response.body = JSON.stringify({ articles: [] });
    } else {
      const unmarshallArticles = articles.map((item) => unmarshall(item));
      unmarshallArticles.sort((a, b) => b.timestamp - a.timestamp);
      response.body = JSON.stringify({ articles: unmarshallArticles });
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
