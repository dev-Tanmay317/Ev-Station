 /* =====================================================
   SOLAR SMART EV CHARGING STATION
   Complete JavaScript
===================================================== */


/* =====================================================
   VARIABLES
===================================================== */

let currentBattery = 42;

let selectedSlot = null;

let isCharging = false;

let chargingInterval = null;

let energyDelivered = 0;

const batteryCapacity = 40.5;

const chargingRate = 15;


/* =====================================================
   CHARGING SLOTS
===================================================== */

const slots = [

    {
        number: 1,
        status: "available"
    },

    {
        number: 2,
        status: "busy"
    },

    {
        number: 3,
        status: "available"
    },

    {
        number: 4,
        status: "busy"
    },

    {
        number: 5,
        status: "busy"
    },

    {
        number: 6,
        status: "available"
    }

];


/* =====================================================
   DISPLAY CHARGING SLOTS
===================================================== */

function displaySlots() {

    const container =
        document.getElementById(
            "slotsContainer"
        );


    container.innerHTML = "";


    slots.forEach(function(slot) {

        const div =
            document.createElement("div");


        div.className =
            `slot ${slot.status}`;


        if (
            selectedSlot === slot.number
        ) {

            div.classList.add(
                "selected"
            );

        }


        div.innerHTML = `

            <div class="slot-number">

                <h3>
                    Charging Slot ${slot.number}
                </h3>

                <span
                    class="slot-status ${
                        slot.status === "available"
                        ? "available-text"
                        : "busy-text"
                    }">

                    ${
                        slot.status === "available"
                        ? "AVAILABLE"
                        : "OCCUPIED"
                    }

                </span>

            </div>


            <div class="slot-icon">

                ${
                    slot.status === "available"
                    ? "⚡"
                    : "🚗"
                }

            </div>


            <p>

                ${
                    slot.status === "available"
                    ? "Ready for charging"
                    : "Currently in use"
                }

            </p>

        `;


        if (
            slot.status === "available"
        ) {

            div.onclick =
                function() {

                    selectSlot(
                        slot.number
                    );

                };

        }


        container.appendChild(div);

    });


    updateAvailableSlots();

    updateMap();
}


/* =====================================================
   SELECT NORMAL SLOT
===================================================== */

function selectSlot(number) {

    if (isCharging) {

        alert(
            "Please stop the current charging session first."
        );

        return;
    }


    const slot =
        slots.find(
            item => item.number === number
        );


    if (!slot ||
        slot.status !== "available") {

        alert(
            "This charging space is not available."
        );

        return;
    }


    selectedSlot = number;


    document.getElementById(
        "selectedSlot"
    ).textContent =
        "Slot " + number;


    displaySlots();


    highlightMapSlot(number);


    alert(
        `Charging Slot ${number} selected successfully!`
    );

}


/* =====================================================
   AVAILABLE SLOTS
===================================================== */

function updateAvailableSlots() {

    const available =
        slots.filter(
            slot =>
                slot.status === "available"
        ).length;


    document.getElementById(
        "availableSlots"
    ).textContent =
        `${available} / ${slots.length}`;


    const mapStatus =
        document.getElementById(
            "mapAvailableStatus"
        );


    if (mapStatus) {

        mapStatus.textContent =
            `🟢 ${available} Available`;

    }


    const locationAvailable =
        document.getElementById(
            "locationAvailable"
        );


    if (locationAvailable) {

        locationAvailable.textContent =
            `🅿️ ${available} charging spaces available`;

    }

}


/* =====================================================
   BATTERY CALCULATION
===================================================== */

function calculateCharging() {

    const targetBattery = 100;


    const requiredPercentage =
        targetBattery -
        currentBattery;


    const energy =
        batteryCapacity *
        requiredPercentage /
        100;


    const chargingPower = 7.2;


    const timeHours =
        energy /
        chargingPower;


    const hours =
        Math.floor(timeHours);


    const minutes =
        Math.round(
            (timeHours - hours) * 60
        );


    document.getElementById(
        "energyRequired"
    ).textContent =
        energy.toFixed(2) +
        " kWh";


    document.getElementById(
        "estimatedTime"
    ).textContent =
        `${hours}h ${minutes}m`;


    alert(

        `CHARGING CALCULATION\n\n` +

        `Current Battery: ${currentBattery}%\n` +

        `Target Battery: 100%\n` +

        `Energy Required: ${energy.toFixed(2)} kWh\n` +

        `Estimated Time: ${hours}h ${minutes}m`

    );

}


/* =====================================================
   START / STOP CHARGING
===================================================== */

function startCharging() {

    const button =
        document.getElementById(
            "chargingButton"
        );


    if (!selectedSlot) {

        alert(
            "Please select an available charging space first."
        );

        return;
    }


    if (!isCharging) {

        isCharging = true;


        document.getElementById(
            "chargingStatus"
        ).textContent =
            "Charging";


        document.getElementById(
            "chargingIndicator"
        ).textContent =
            "● Charging";


        button.textContent =
            "Stop Charging";


        button.style.background =
            "#e05252";


        const slot =
            slots.find(
                item =>
                    item.number === selectedSlot
            );


        if (slot) {

            slot.status =
                "busy";

        }


        displaySlots();


        chargingInterval =
            setInterval(
                updateCharging,
                1000
            );

    }

    else {

        stopCharging();

    }

}


/* =====================================================
   UPDATE CHARGING
===================================================== */

function updateCharging() {

    if (currentBattery >= 100) {

        stopCharging();

        alert(
            "Charging completed successfully! 🎉"
        );

        generateBill();

        return;
    }


    currentBattery += 1;


    energyDelivered =
        batteryCapacity *
        (currentBattery - 42) /
        100;


    updateChargingUI();

}


/* =====================================================
   UPDATE CHARGING UI
===================================================== */

function updateChargingUI() {

    document.getElementById(
        "dashboardBattery"
    ).textContent =
        currentBattery + "%";


    document.getElementById(
        "batteryPercent"
    ).textContent =
        currentBattery + "%";


    document.getElementById(
        "chargingPercent"
    ).textContent =
        currentBattery + "%";


    document.getElementById(
        "batteryLevel"
    ).style.width =
        currentBattery + "%";


    document.getElementById(
        "bigBatteryLevel"
    ).style.width =
        currentBattery + "%";


    const cost =
        energyDelivered *
        chargingRate;


    document.getElementById(
        "energyDelivered"
    ).textContent =
        energyDelivered.toFixed(2) +
        " kWh";


    document.getElementById(
        "currentCost"
    ).textContent =
        "₹" +
        cost.toFixed(2);

}


/* =====================================================
   STOP CHARGING
===================================================== */

function stopCharging() {

    isCharging = false;


    clearInterval(
        chargingInterval
    );


    document.getElementById(
        "chargingStatus"
    ).textContent =
        "Not Charging";


    document.getElementById(
        "chargingIndicator"
    ).textContent =
        "● Ready";


    const button =
        document.getElementById(
            "chargingButton"
        );


    button.textContent =
        "Start Charging";


    button.style.background =
        "#159447";


    /*
       Make selected space available again.
    */

    if (selectedSlot) {

        const slot =
            slots.find(
                item =>
                    item.number ===
                    selectedSlot
            );


        if (slot) {

            slot.status =
                "available";

        }

    }


    displaySlots();


    generateBill();

}


/* =====================================================
   GENERATE BILL
===================================================== */

function generateBill() {

    const energy =
        energyDelivered;


    if (energy <= 0) {

        return;

    }


    const amount =
        energy *
        chargingRate;


    const discount =
        amount *
        0.10;


    const total =
        amount -
        discount;


    document.getElementById(
        "billEnergy"
    ).textContent =
        energy.toFixed(2) +
        " kWh";


    document.getElementById(
        "billAmount"
    ).textContent =
        "₹" +
        amount.toFixed(2);


    document.getElementById(
        "billDiscount"
    ).textContent =
        "-₹" +
        discount.toFixed(2);


    document.getElementById(
        "billTotal"
    ).textContent =
        "₹" +
        total.toFixed(2);

}


/* =====================================================
   DOWNLOAD BILL
===================================================== */

function downloadBill() {

    const billTotal =
        document.getElementById(
            "billTotal"
        ).textContent;


    const energy =
        document.getElementById(
            "billEnergy"
        ).textContent;


    const billText = `

SOLAR SMART EV CHARGING STATION
==========================================

CHARGING INVOICE

Customer:
Rahul Sharma

Vehicle:
Tata Nexon EV

Registration:
MH 12 AB 1234

Energy Used:
${energy}

Charging Rate:
₹15 / kWh

Total Amount:
${billTotal}

Payment Status:
PAID ONLINE

==========================================

Thank you for using SolarEV.

Clean Energy.
Smart Charging.

`;


    const blob =
        new Blob(
            [billText],
            {
                type: "text/plain"
            }
        );


    const url =
        URL.createObjectURL(
            blob
        );


    const link =
        document.createElement(
            "a"
        );


    link.href = url;

    link.download =
        "SolarEV-Bill.txt";


    link.click();


    URL.revokeObjectURL(
        url
    );

}


/* =====================================================
   PROFILE
===================================================== */

function showProfile() {

    alert(

        "CAR OWNER\n\n" +

        "Name: Rahul Sharma\n" +

        "Vehicle: Tata Nexon EV\n" +

        "Registration: MH 12 AB 1234\n" +

        "Battery: " +
        currentBattery +
        "%"

    );

}


/* =====================================================
   SCROLL
===================================================== */

function scrollToSection(id) {

    const element =
        document.getElementById(id);


    if (element) {

        element.scrollIntoView({
            behavior: "smooth"
        });

    }

}


/* =====================================================
   QR SCANNER
===================================================== */

let qrScanner = null;

let scannerRunning = false;


/* =====================================================
   START QR SCANNER
===================================================== */

function startScanner() {

    if (scannerRunning) {

        return;

    }


    const result =
        document.getElementById(
            "scanResult"
        );


    const reader =
        document.getElementById(
            "qrReader"
        );


    if (!reader) {

        return;

    }


    result.innerHTML =
        "<span>●</span> Starting camera...";


    qrScanner =
        new Html5Qrcode(
            "qrReader"
        );


    qrScanner.start(

        {
            facingMode:
                "environment"
        },

        {
            fps: 10,

            qrbox: {
                width: 220,
                height: 220
            }
        },

        function(decodedText) {

            handleQRCode(
                decodedText
            );

        },

        function(errorMessage) {

            // QR code not detected yet.

        }

    )

    .then(function() {

        scannerRunning = true;


        document.getElementById(
            "scannerPlaceholder"
        ).style.display =
            "none";


        result.innerHTML =
            "<span style='color:#22b45b'>●</span> " +
            "Scanner active. Point camera at QR code.";

    })

    .catch(function(error) {

        console.error(error);


        result.innerHTML =
            "<span style='color:#e05252'>●</span> " +
            "Unable to access camera.";


        alert(

            "Unable to start camera.\n\n" +

            "Please allow camera permission " +

            "and run the website using Live Server."

        );

    });

}


/* =====================================================
   HANDLE QR CODE
===================================================== */

function handleQRCode(qrText) {

    console.log(
        "QR Code:",
        qrText
    );


    stopScanner();


    const result =
        document.getElementById(
            "scanResult"
        );


    result.innerHTML =

        `<span style="color:#22b45b">✓</span>
        QR detected: ${qrText}`;


    /*
       Example:

       SOLAREV-SLOT-1
       SOLAREV-SLOT-2
       SOLAREV-SLOT-3
    */


    if (
        qrText.startsWith(
            "SOLAREV-SLOT-"
        )
    ) {

        const slotNumber =
            parseInt(
                qrText.replace(
                    "SOLAREV-SLOT-",
                    ""
                )
            );


        selectSlotFromQR(
            slotNumber
        );

    }

    else {

        alert(

            "This QR code is not a valid " +
            "SolarEV charging station QR code."

        );

    }

}


/* =====================================================
   SELECT SLOT FROM QR
===================================================== */

function selectSlotFromQR(
    slotNumber
) {

    const slot =
        slots.find(
            item =>
                item.number ===
                slotNumber
        );


    if (!slot) {

        alert(
            "Charging space does not exist."
        );

        return;

    }


    if (
        slot.status !==
        "available"
    ) {

        alert(
            `Charging Space ${slotNumber} is currently occupied.`
        );

        return;

    }


    selectedSlot =
        slotNumber;


    document.getElementById(
        "selectedSlot"
    ).textContent =
        "Slot " + slotNumber;


    displaySlots();


    highlightMapSlot(
        slotNumber
    );


    alert(

        `Charging Space ${slotNumber} selected successfully!`

    );


    scrollToSection(
        "station"
    );

}


/* =====================================================
   STOP QR SCANNER
===================================================== */

function stopScanner() {

    scannerRunning = false;


    if (qrScanner) {

        qrScanner.stop()

            .then(function() {

                qrScanner.clear();

                qrScanner = null;

            })

            .catch(function(error) {

                console.log(error);

                qrScanner = null;

            });

    }


    const placeholder =
        document.getElementById(
            "scannerPlaceholder"
        );


    if (placeholder) {

        placeholder.style.display =
            "block";

    }


    const result =
        document.getElementById(
            "scanResult"
        );


    if (result) {

        result.innerHTML =
            "<span>●</span> Scanner stopped.";

    }

}


/* =====================================================
   STATION MAP
===================================================== */

function selectMapSlot(
    slotNumber
) {

    const slot =
        slots.find(
            item =>
                item.number ===
                slotNumber
        );


    if (!slot) {

        return;

    }


    if (
        slot.status !==
        "available"
    ) {

        alert(
            `Charging Space ${slotNumber} is occupied.`
        );

        return;

    }


    selectedSlot =
        slotNumber;


    document.getElementById(
        "selectedSlot"
    ).textContent =
        "Slot " + slotNumber;


    highlightMapSlot(
        slotNumber
    );


    displaySlots();


    alert(

        `Charging Space ${slotNumber} selected!`

    );


    document
        .querySelector(
            ".charging-panel"
        )
        .scrollIntoView({
            behavior: "smooth"
        });

}


/* =====================================================
   HIGHLIGHT MAP SLOT
===================================================== */

function highlightMapSlot(
    slotNumber
) {

    document
        .querySelectorAll(
            ".parking-slot"
        )
        .forEach(
            function(element) {

                element.classList.remove(
                    "selected-map"
                );

            }
        );


    const selectedElement =
        document.getElementById(
            "mapSlot" +
            slotNumber
        );


    if (selectedElement) {

        selectedElement.classList.add(
            "selected-map"
        );

    }

}


/* =====================================================
   UPDATE MAP
===================================================== */

function updateMap() {

    slots.forEach(
        function(slot) {

            const element =
                document.getElementById(
                    "mapSlot" +
                    slot.number
                );


            if (!element) {

                return;

            }


            element.classList.remove(
                "available",
                "occupied"
            );


            element.classList.add(
                slot.status
            );


            const statusText =
                element.querySelector(
                    "strong"
                );


            const car =
                element.querySelector(
                    ".parking-car"
                );


            if (
                slot.status ===
                "available"
            ) {

                statusText.textContent =
                    "AVAILABLE";


                car.textContent =
                    "⚡🚗";


                element.onclick =
                    function() {

                        selectMapSlot(
                            slot.number
                        );

                    };

            }

            else {

                statusText.textContent =
                    "OCCUPIED";


                car.textContent =
                    "🚙";


                element.onclick =
                    null;

            }

        }
    );

}


/* =====================================================
   DIRECTIONS
===================================================== */

function showDirections() {

    alert(

        "DIRECTIONS\n\n" +

        "SolarEV Charging Station\n" +

        "Pune, Maharashtra\n\n" +

        "3 charging spaces are currently available.\n\n" +

        "For the final version, this button can " +
        "open Google Maps."

    );

}


/* =====================================================
   INITIALIZE WEBSITE
===================================================== */

displaySlots();

updateChargingUI();

calculateCharging();
