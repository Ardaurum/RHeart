# RHeart

RHeart is an Electron app for displaying heart rate from a connected BLE device.

## Installing and building

To setup the app - `npm install`
To start it - `npm start`. Don't use VSCode debugger as it will throw error for current electron-nightly.
To build it - `yarn dist` (uses electron-builder to pack the app)

## Creating new monitors

To create a new monitor add a directory inside `src/monitors` and include three files `monitor.html`, `monitor.js` and `icon.png`. 

### API

In `monitor.js` you can use following methods:

- `subscribeToHeartRateMeasurement: (method)` - calls callback whenever new parsed data is available. Look at: `ParsedHeartRateData`
- `subscribeToCharacteristic: (string, method)` - allows to subscribe to any characteristic in a `heart_rate` service
- `readCharacteristic: async (characteristic)` - reads a value from characteristic once.
- `parseHeartRate` - parses the data that `heart_rate` characteristic returns. Look at `ParsedHeartRateData`

```js
ParsedHeartRateData = {
  contactDetected: bool,
  energyExpendedPresent: bool,
  rrIntervalsPresent: bool,
  heartRate: uint,
  energyExpended: uint, //only available when enegryExpendedPresent == true
  rrIntervals: uint[] //only available when rrIntervalsPresent == true
}
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/)
