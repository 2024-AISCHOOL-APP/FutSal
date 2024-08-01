from flask import Flask, request, jsonify
import joblib
import MySQLdb
import numpy as np
import pandas as pd
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
# CORS(app, resources={r"/*":{"origins":"http://localhost:3000"}})



# CORS_ORIGINS = ['http://localhost:3000']
# CORS_METHODS = ['POST']
# CORS_HEADERS = ['Content-Type']

# @app.after_request

# def after_request(response):
#     response.headers.add('Access-Control-Allow-Origin', ','.join(CORS_ORIGINS))
#     response.headers.add('Access-Control-Allow-Methods', ','.join(CORS_METHODS))
#     response.headers.add('Access-Control-Allow-Headers',','.join(CORS_HEADERS))
#     return response


db = MySQLdb.connect(host='project-db-stu3.smhrd.com',
                     user = 'Insa5_App_hacksim_2',
                     passwd = 'aischool2',
                     db='Insa5_App_hacksim_2',
                     port=3307)

cursor = db.cursor()


model_at = joblib.load('./models/saved_at_model.pkl')
model_df = joblib.load('./models/saved_df_model.pkl')
# model_winrate = joblib.load(os.path('./models/'))


# 모델 학습 순서 age  height_cm  weight_kg  pace  shooting  passing  dribbling  defending


@app.route('/Attacker', methods=['POST'])

def Attacker():
    data = request.get_json()
    print('received data :', data)
    print('Headers:', request.headers)

    if data is None:
        return jsonify({'error': 'Invalid input format'}), 400
    
    required_fields = ['userAge','userHeight','userWeight','userSpeed','userShooting','userPassing','userDribbling','userDefending']
    rename_fields = ['age', 'height_cm', 'weight_kg', 'pace', 'shooting', 'passing', 'dribbling', 'defending']
    missing_fields = [field for field in required_fields if field not in data]

    if missing_fields:
        return jsonify({'error': f'Missing required fields : {",".join(missing_fields)}'}), 400
    
    try:
        input_data = [data[field] for field in required_fields]
        input_data = np.array(input_data).reshape(1,-1)

        input_data_df = pd.DataFrame(input_data, columns=required_fields)
        input_data_df.rename(columns={i:j for i,j in zip(required_fields,rename_fields)},inplace=True)
        
    except ValueError as e:
        print(f'ValueError: {e}')
        return jsonify({'error' : 'Invalid data format'}), 400

    prediction_at = model_at.predict(input_data_df)
    prediction_at_value = round(prediction_at[0])
    
    user_id = data['userId']
    print(user_id)

    try:
        outputquery = """UPDATE userInfo 
        SET  user_score = %s
        WHERE user_id = %s"""
        cursor.execute(outputquery, (
            round(prediction_at_value),
            user_id
        ))
        db.commit()

        return jsonify({'prediction_at': prediction_at_value}), 200

    except Exception as e:
        db.rollback()
        print(f"Error db inserting prediction result: {e}")
        return jsonify({'error': 'Failed to update user score'}), 500

@app.route('/Defender', methods=['POST'])

def Defender():
    data = request.get_json()
    print('received data :', data)

    if data is None:
        return jsonify({'error': 'Invalid input format'}), 400

    required_fields = ['userAge','userHeight','userWeight','userSpeed','userShooting','userPassing','userDribbling','userDefending']
    rename_fields = ['age', 'height_cm', 'weight_kg', 'pace', 'shooting', 'passing', 'dribbling', 'defending']
    missing_fields = [field for field in required_fields if field not in data]

    if missing_fields:
        return jsonify({'error': f'Missing required fields : {",".join(missing_fields)}'}), 400
    
    
    try:
        input_data = [float(data[field]) for field in required_fields]
        input_data = np.array(input_data).reshape(1,-1)        
        input_data_df = pd.DataFrame(input_data, columns=required_fields)
        input_data_df.rename(columns={i:j for i,j in zip(required_fields,rename_fields)},inplace=True)
    except ValueError as e:
        print(f'ValueError: {e}')
        return jsonify({'error' : 'Invalid data format'}), 400

    prediction_df = model_df.predict(input_data_df)
    prediction_df_value = round(prediction_df[0])
    user_id = data['userId']
    print(user_id)


    try:
        outputquery = """UPDATE userInfo 
        SET  user_score = %s
        WHERE user_id = %s"""
        cursor.execute(outputquery, (
            round(prediction_df_value),
            user_id
        ))       
        db.commit()
        return jsonify({'prediction_df': prediction_df_value}), 200

    except Exception as e:
        db.rollback()
        print(f"Error db inserting prediction result: {e}")
        return jsonify({'prediction_df' : prediction_df_value}),200

@app.route('/winrate', methods=['POST'])

def winrate():
    try:
        data = request.get_json()
        print('received data :', data)
        
        required_fields = ['user_age','user_height','user_weight','user_speed','user_shooting','user_passing','user_dribbling','user_defending','user_position']
        required_fields_data = ['user_age','user_height','user_weight','user_speed','user_shooting','user_passing','user_dribbling','user_defending']
        avg_score_at = {}
        avg_score_df = {}
        count1 = 0
        count2 = 0
        for _ in range(len(required_fields_data)):
            avg_score_at[required_fields_data[_]] = 0
            avg_score_df[required_fields_data[_]] = 0
        rename_fields = ['age', 'height_cm', 'weight_kg', 'pace', 'shooting', 'passing', 'dribbling', 'defending']
        for i in data:
            missing_fields = [field for field in required_fields if field not in i]
            if missing_fields:
                return jsonify({'error': f'Missing required fields : {",".join(missing_fields)}'}), 400
            if i['user_position'] == 'Attacker':
                count1 += 1
            else:
                count2 += 1
            
    except Exception as e:
        print(e)
        return jsonify({'error': 'An internal server error occurred'}), 500
    try:
        count = 0

        for j in data:
            count += 1
            input_datas = [float(j[field]) for field in required_fields_data]
            for k in range(len(input_datas)):
                if j['user_position'] == 'Attacker':
                    avg_score_at[required_fields_data[k]] += input_datas[k]
                else:
                    avg_score_df[required_fields_data[k]] += input_datas[k]
        for avg_i in required_fields_data:
            avg_score_at[avg_i] //= count1
            avg_score_df[avg_i] //= count2

        avg_score_data_at = pd.DataFrame([avg_score_at])
        avg_score_data_df = pd.DataFrame([avg_score_df])
        
        avg_score_data_at.rename(columns={i:j for i,j in zip(required_fields_data,rename_fields)},inplace=True)
        avg_score_data_df.rename(columns={i:j for i,j in zip(required_fields_data,rename_fields)},inplace=True)

    except ValueError as e:
        print(f'ValueError: {e}')
        return jsonify({'error' : 'Invalid data format'}), 400

    prediction_at_team = model_at.predict(avg_score_data_at)
    prediction_at_team_value = prediction_at_team[0]

    prediction_df_team = model_df.predict(avg_score_data_df)
    prediction_df_team_value = prediction_df_team[0]
    prediction_team_value = (prediction_df_team_value + prediction_at_team_value)//2
    team_id = data[0]['team_id']

    try:
        outputquery = """UPDATE teamInfo 
        SET  team_score = %s
        WHERE team_id = %s"""
        cursor.execute(outputquery, (
            round(prediction_team_value),
            team_id
        ))
        db.commit()

        return jsonify({'prediction_at': prediction_team_value}), 200

    except Exception as e:
        db.rollback()
        print(f"Error db inserting prediction result: {e}")
        return jsonify({'error': 'Failed to update user score'}), 500
    
    
    
    

if __name__ == '__main__':
    app.run(debug=True, host='localhost', port=5000)
