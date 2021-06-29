$(() => {
  const deviceSelect = $('#devices');
  const confirmButton = $('#confirm');
  const testVisualsButton = $('#test-visuals');

  window.api.devicesFound(onDevicesFound);
  let lastDevices = [];
  let selectedView = null;
  let deviceSelected = false;

  function onDevicesFound(devices) {
    if (devices.length == 0) {
      return;
    }

    devices.sort();
    if (devicesEqual(devices)) {
      return;
    }
    lastDevices = devices;

    let lastSelected = deviceSelect.index;
    deviceSelect.empty();
    $.each(devices, function (i, p) {
      deviceSelect.append($('<option></option>').val(p.deviceId).html(p.deviceName));
    });
    deviceSelect.prop('disabled', false);
    deviceSelect.index = lastSelected;
  }

  function devicesEqual(devices) {
    if (lastDevices.length != devices.length) {
      return false;
    }

    for (let i = 0; i < devices.length; i++) {
      let device = devices[i];
      let lastDevice = lastDevices[i];

      if (device.deviceId != lastDevice.deviceId
        || device.deviceName != lastDevice.deviceName) {
        return false;
      }
    }
    return true;
  }

  deviceSelect.on('change', () => {
    deviceSelected = false;
    confirmButton.prop('disabled', true);
    if (deviceSelect.index() >= 0 && deviceSelect.val() != null) {
      if (selectedView != null) {
        confirmButton.prop('disabled', false);
      }
      deviceSelected = true;
    }
  })

  confirmButton.on('click', () => {
    let deviceId = deviceSelect.val()[0];
    window.api.selectDevice(deviceId);
    $('#config-panel').hide();
    $('#loading').show();
  })

  testVisualsButton.on('click', () => {
    $('#config-panel').hide();
    $('#monitor').load(`${selectedView}/monitor.html`);
    $.getScript(`${selectedView}/monitor.js`);
  })

  //Workaround to start search for devices without a gesture
  $('#gesture-workaround').on('click', async () => {
    await window.api.initBLESearch();
    $("#loading").hide();
    $('#monitor').load(`${selectedView}/monitor.html`);
    $.getScript(`${selectedView}/monitor.js`);
  })

  //Loading all thumbnails
  function loadThumbnails() {
    let views = window.api.getAllViews();
    let monitorSelection = $("#monitor-selection");
    let items = [];
    for (let i = 0; i < views.length; i++) {
      monitorSelection.append(`<figure class="monitor-item" id="view-${i}"><img src="${views[i]}/icon.png" class="item_img"></figure>`);
      let item = $(`#view-${i}`);
      item.on('click', () => {
        for (let j = 0; j < items.length; j++) {
          items[j].removeClass("selected");
        }

        selectedView = views[i];
        item.addClass("selected");
        if (deviceSelected) {
          confirmButton.prop('disabled', false);
        }
        testVisualsButton.prop('disabled', false);
      });
      items.push(item);
    }
  };

  loadThumbnails();
})