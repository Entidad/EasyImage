# Image Manipulation Zoom In/Out, Rotate Clockwise/AntiClockwise, Cropping, Download

# Description

This widget can be used to upload an image file (PNG, JPEG, JPG or BMP) and modify the image in the following ways: 
- Zoom In/Out
- Rotate Clockwise/AntiClockwise
- Crop/Save
- Upload
- Download

Additional features include

- Translations for button labels
- Rendering buttons using only icons to save space
- Glyphicon icon customization

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

# Project Information

This application was created using the following versions:
- Node v18.3.0
- NPM  v8.15.0

## Required Packages

To set up the project, install the following packages:
```bash
npm i react-image-crop
npm i react-easy-crop
npm i @material-ui/core
```

## Getting Started

To start the application, run the following command:
npm start

## Widget Integration
The widget can be found in the following location:
../dist/1.0.0/io.entidad.widget.EasyImage.mpk
Copy the widget and paste it inside the "widgets" folder in your application. After synchronizing the application, locate the widget with the name "io.entidad.widget.EasyImage.mpk" under the tools. You can then drag and drop it into a container

## Widget Parameters
The widget requires the following parameters to be passed:

1. Image entity type
2. Image GUID
3. Optional On Save Microflow or Nanoflow
