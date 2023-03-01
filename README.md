# OctoCam

OctoCam is a PyFlaDesk application made to stream and snapshot your webcam. This is designed as an alternative to YawCam usage for
OctoPrint on Windows computers. To run, download the exe, or use this repo.

## Usage
Run Pyinstaller with this command to generate a .exe:
```pyinstaller -F --add-data "templates;templates" --add-data "static;static" app.py```

Otherwise, use ```py app.py.```

Use pull cameras to retrieve cameras connected to your computer, and select from the dropdown which camera you'd like to use. Use width and 
height fields to alter the dimensions of your stream, and then click pull feed to generate the stream and snapshot urls. These can then be
used in your OctoPrint to manage the streaming and timelapse generation of your printer. This requires giving camera permission to the application.

## Contributing

Pull requests are welcome, just open an issue to discuss what you'd like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/)
