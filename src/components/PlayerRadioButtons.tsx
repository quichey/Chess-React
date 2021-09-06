import React from "react";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import { Player } from "../util/SquareUtil";

interface IPlayerRadioButtons {
    onValueChange: (value: Player) => void;
}

export default function PlayerRadioButtons({
    onValueChange,
}: IPlayerRadioButtons) {
    const [value, setValue] = React.useState("White");

    const handleChange = (event: any) => {
        setValue(event.target.value);
        onValueChange(event.target.value);
    };

    return (
        <FormControl component="fieldset">
            <FormLabel component="legend">Player</FormLabel>
            <RadioGroup
                aria-label="player"
                name="player1"
                value={value}
                onChange={handleChange}
            >
                <FormControlLabel
                    value="White"
                    control={<Radio />}
                    label="White"
                />
                <FormControlLabel
                    value="Black"
                    control={<Radio />}
                    label="Black"
                />
            </RadioGroup>
        </FormControl>
    );
}
