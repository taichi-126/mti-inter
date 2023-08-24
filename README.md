# ヴィーガン向け体調管理アプリ

## 設計

### テーブル図

```mermaid
classDiagram
    User -- DailyMealsTable : 1 - n (ユーザーは多数の食事記録を持つ)
    User -- Dishes : 1 - n (ユーザーは多数の料理を持つ)
    Ingredients -- Dishes : 1 - n (1つの原材料は多数の料理に使われる)
    DailyMealsTable -- Dishes : 1 - n (1つの食事記録は多数の料理から成る)

    class User {
        +userId (PK)
        password
        age
        sex
        height
　　　　　　　　　　　　　　　　weight
    }

    class Dishes {
        +dishName (PK)
        +userId (SK)
        ingredients
        nutrients
    }

    class DailyMealsTable {
        +UserId (PK)
        +Date (SK)
        mealType
        dishes
        totalNutrients
    }

    class Ingredients {
        +ingredientName (PK)
        nutrients
    }

```

#### Userテーブル

| カラム名  | 説明       |
|---------|-----------|
| userId  | ユーザーID (パーティションキー) |
| password | パスワード   |
| age     | 年齢       |
| sex | 性別 |
| height     | 身長 |
| weight     | 体重 |

---

#### Dishesテーブル
ユーザーが入力orデフォルトである料理を保存. ユーザーが新たな料理を追加したりすることが可能. 

| カラム名       | 説明                                               |
|--------------|--------------------------------------------------|
| dishName       | 料理の名前 (パーティションキー)                               |
| userId       | ユーザーID (ソートキー)                                   |
| ingredients  | 原材料をマップ形式で重量と保存. [{"name": "tomato", "weight":100}, ]                          |
| nutrients    | 原材料から計算された栄養成分情報 {"vitamine":100, "protein": 200}                             |

---

#### DailyMealsTable
各ユーザーがその日に何を食べたのか、そしてその日の合計栄養摂取量を保存

| カラム名     | 説明                               |
|------------|----------------------------------|
| userId     | ユーザーのID (パーティションキー)          |
| date   | 食事の日 (ソートキー)                  |
| mealType   | 朝食、昼食、夕食など                        |
| dishes     | 選択された料理のリスト(料理IDや名前、量など) |
| totalNutrients| その日の全ての栄養素の合計                      |

---

#### Ingredientsテーブル
原材料の栄養を保存. dishesの料理の栄養計算に利用される. 

| カラム名        | 説明                               |
|---------------|----------------------------------|
| ingredientName| 原材料の名前(パーティションキー)                 　|
| nutrients     | 原材料の栄養成分情報                          |

---


### Web REST API 設計

### DishesテーブルのAPI

| 操作   | Method | 処理の内容 | Endpoint           | リクエストパラメータ                            | レスポンス内容                  |
|--------|----|----|--------------------|-----------------------------------------------|------------------------------|
| 登録   | POST   | 新しい料理を追加. | `/dishes`          | userId, dishName, ingredients                 | success/error, dishName        |
| 取得   | GET    | ユーザーがすでに登録した料理の一覧を表示. | `/dishes？userId` | userId                                             | List<dishName> |
| 削除   | DELETE | ユーザーがすでに登録した料理を削除. | `/dishes?dishName&userId` | dishName, userId                                             | success/error                  |

### DailyMealsTableのAPI

| 操作   | Method | 処理の内容 | Endpoint                      | リクエストパラメータ               | レスポンス内容              |
|--------|-------|--|-------------------------------|----------------------------------|--------------------------|
| 登録   | POST   |  朝・昼・夜の食事を料理から選択し投稿. | `/daily-meals`                | UserId, Date, MealType, Dishes   | success/error, TotalNutrients |
| 変更   | PUT   |  一度,保存した食事内容を変更. | `/daily-meals`                | UserId, Date, MealType, Dishes   | success/error, TotalNutrients |
| 取得   | GET   |  その日の合計栄養値を取得. | `/daily-meals?userId&date`                | userId, date  | success/error, TotalNutrients |

### IngredientsTableのAPI

| 操作   | Method | 処理の内容 | Endpoint                      | リクエストパラメータ               | レスポンス内容              |
|--------|------|--|-------------------------------|----------------------------------|--------------------------|
| 登録   | GET   | 料理新規追加時に一覧を表示 |  `/ingredients`                |   | success/error, list<ingredientName> |


### 例
#### POST `/dishes`
```
// リクエストボディ
{
    "dishName": "塩オニオン",
    "userId": "team3",
    "ingredients": [
        { "name":"onion", "weight":10 },
        { "name":"salt", "weight":5 }
    ]
}
```
```
// レスポンスボディ
{
    "dishName": "塩オニオン",
    "userId": "team3",
    "ingredients": [
        {
            "name": "onion",
            "weight": 10
        },
        {
            "name": "salt",
            "weight": 5
        }
    ],
    "nutrients": {
        "vitamineC": 5,
        "calcium": 12,
        "vitamineD": 5
    }
}
```

