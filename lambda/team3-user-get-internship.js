const { DynamoDBClient, GetItemCommand } = require("@aws-sdk/client-dynamodb");
const { marshall, unmarshall } = require("@aws-sdk/util-dynamodb");
const client = new DynamoDBClient({ region: "ap-northeast-1" });
const TableName = "team3_user";

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

  const userId = event.queryStringParameters?.userId; //見たいユーザのuserId
  if (!userId) {
    response.statusCode = 400;
    response.body = JSON.stringify({
      message: "無効なリクエスト"
    });
    return response
  }

  //TODO: 取得対象のテーブル名と検索に使うキーをparamに宣言
  const param = {
    TableName,
    "Key": marshall({
      userId
    }),
  };

  // 指定したアイテムを取得するコマンドを用意
  const command = new GetItemCommand(param);

   //GetItemCommandの実行でDBからデータを取得
  try {
    const user = (await client.send(command)).Item;
    if (!user) {
      throw new Error("指定されたuserIdを持つuserは見つかりません");
    }

    delete user.password;
    response.body = JSON.stringify(unmarshall(user));
  } catch (e) {
    if (e.message == "指定されたuserIdを持つuserは見つかりません") {
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
