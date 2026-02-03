const { exec } = require('child_process');
const TouchPortalAPI = require('touchportal-api');
const TPClient = new TouchPortalAPI.Client();

const pluginId = 'Wireplumber control Volume';

// Define the function to set application volume
function setApplicationVolume(applicationName, volumePercentage) {
    const findSinkInputCommand = `pactl get-volume 35`;

      

       const setVolumeCommand = `wpctl set-volume ${volumePercentage}%`;

        console.log(`Executing command: ${setVolumeCommand}`);

        exec(setVolumeCommand, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error setting volume: ${stderr}`);
                return;
            }
            console.log(`Set volume of ${volumePercentage}%`);

            // Send a message to Touch Portal
            console.log(`Sending connector update for ${volumePercentage}%`);
        });
    });
}

// Event listener for ConnectorChange
TPClient.on("ConnectorChange", (data) => {
    console.log("Connector event received:", data);

    const applicationName = data.data.find(d => d.id === "applicationName").value;
    const volumePercentage = data.value;

    console.log(`Received data: volumePercentage=${volumePercentage}`)
    setApplicationVolume(volumePercentage);

    if (!applicationName || isNaN(volumePercentage)) {
        console.error(`Invalid data received: volumePercentage=${volumePercentage}`);
        return;
    }
});

// Event listener for Info
TPClient.on("Info", (data) => {
    console.log("Info event received:", data);
});

// Event listener for ClosePlugin
TPClient.on("ClosePlugin", () => {
    console.log("Plugin closed");
    process.exit();
});

// Event listener for Connected
TPClient.on("Connected", () => {
    console.log("Connected to Touch Portal");
});

// Connect to Touch Portal
TPClient.connect({ pluginId });

// Add a small delay to keep the script running
setTimeout(() => {
    console.log("Waiting for events...");
}, 1000);
