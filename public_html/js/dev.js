const sliders = ["x", "y", "z"];

    sliders.forEach(axis => {
        const slider = document.getElementById(`${axis}Slider`);
        const numberInput = document.getElementById(`${axis}Value`);

        // Update number input when slider moves
        slider.addEventListener("input", () => {
            numberInput.value = slider.value;
        });

        // Update slider when number input changes
        numberInput.addEventListener("input", () => {
            if (numberInput.value !== "") {  // Ensure it's not empty
                let value = parseFloat(numberInput.value);
                // Clamp value within range
                value = Math.min(Math.max(value, parseFloat(slider.min)), parseFloat(slider.max));
                slider.value = value;
                numberInput.value = value;
            }
        });
    });