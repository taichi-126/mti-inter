const { DynamoDBClient, QueryCommand } = require("@aws-sdk/client-dynamodb");
const { marshall, unmarshall } = require("@aws-sdk/util-dynamodb");
const crypto = require('crypto');
const client = new DynamoDBClient({ region: "ap-northeast-1" });
const TableName = "team3_user";

exports.handler = async (event, context) => {
  const response = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({ message: "" }),
  };

  const body = event.body ? JSON.parse(event.body) : null;
  if (!body || !body.userId || !body.password) {
    response.statusCode = 400;
    response.body = JSON.stringify({
      message:
        "無効なリクエストです。request bodyに必須パラメータがセットされていません。",
    });

    return response;
  }

  const param = {
    TableName,
    //キー、インデックスによる検索の定義
    KeyConditionExpression: "userId = :uid",
    //検索値のプレースホルダの定義
    ExpressionAttributeValues: marshall({
      ":uid": body.userId,
    }),
  };

  const command = new QueryCommand(param);
  try {
    const data = await client.send(command);
    if (data.Count == 0) {
      throw new Error("userIdまたはpasswordが一致しません");
    }
    
    const user = unmarshall(data.Items[0]);
    const hash = crypto.pbkdf2Sync(body.password, user.salt, 1000, 64, 'sha512').toString('hex');
    
    if (user.password !== hash){
      throw new Error("userIdまたはpasswordが一致しません")
    } 
    
    response.body = JSON.stringify({ token: "mtiToken" });
  } catch (e) {
    if (e.message == "userIdまたはpasswordが一致しません") {
      response.statusCode = 401;
      response.body = JSON.stringify({ message: e.message });
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