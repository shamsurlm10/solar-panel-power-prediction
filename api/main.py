from io import BytesIO

from sklearn import externals
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.preprocessing import StandardScaler
import pandas as pd
import pickle

import cv2
import matplotlib.pyplot as plt
import numpy as np
import tensorflow as tf
import uvicorn
from fastapi import Body, FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from numpy import asarray
from PIL import Image
import os

app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:3000",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MODEL = tf.keras.models.load_model('./training/save_model.h5')

CLASS_NAMES = ['clean', 'dust', 'shadow', 'waterdrop']

def read_file_as_image(data) ->np.ndarray:
    image=np.array(Image.open(BytesIO(data)))
    return image

df = pd.read_csv(r"D:\\400c_data\\project\\api\\metadatav1.csv")

X = df[['lebel','time','LUX','TEMP (Celcius)']]
y = df['power']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
scaler = StandardScaler()
X_train = scaler.fit_transform(X_train)
X_test = scaler.transform(X_test)

rfr = RandomForestRegressor(n_estimators=100)
rfr.fit(X_train, y_train)
y_pred = rfr.predict(X_test)


def power_regression_prediction(lebel, time, lux, temp):
    user_input = [[lebel, time, lux, temp]]
    user_input = scaler.transform(user_input)
    power_prediction = rfr.predict(user_input)
    return power_prediction[0]

@app.post("/predict")
async def predict(time:int = Body(...), lux:int = Body(...), temp:float = Body(...), file: UploadFile = File(...)):
    image = read_file_as_image(await file.read())
    image = Image.fromarray(image.astype('uint8'), 'RGB')
    image = image.resize((256, 256))
    image_array = np.array(image) / 255.0
    image_array = np.expand_dims(image_array, axis=0)
    class_names=['clean', 'dust', 'shadow', 'waterdrop']
    label_prediction = MODEL.predict(image_array)
    label = np.argmax(label_prediction)
    print(time, lux,temp, label)
    power_prediction = power_regression_prediction(label, time, lux, temp)

    # Use the predicted label, time, lux, and temp to predict the power
    # power_prediction = power_regression_prediction(label, time, lux, temp)
    return {
        'class':class_names[label],
        'confidence': power_prediction
    }

if __name__== "__main__":
    uvicorn.run(app, host='localhost', port=8000)
