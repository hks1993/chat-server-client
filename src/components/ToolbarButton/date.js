import "date-fns";
import React from "react";
import Grid from "@material-ui/core/Grid";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
  DatePicker,
} from "@material-ui/pickers";

export default function MaterialUIPickers(props) {
  // The first commit of Material-UI
  const [selectedDate, setSelectedDate] = React.useState(
    new Date("2019-07-11T21:11:54")
  );

  const handleDateChange = (date) => {
    setSelectedDate(date);
    props.updateDate(date);
  };

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <Grid container justify="flex-end">
        <KeyboardDatePicker
          disableToolbar
          variant="inline"
          format="MM/dd/yyyy"
          margin="normal"
          minDate={new Date("2015-07-11")}
          maxDate={new Date("2020-06-16")}
          id="date-picker-inline"
          value={selectedDate}
          onChange={handleDateChange}
          KeyboardButtonProps={{
            "aria-label": "change date",
          }}
        />
        {/* <DatePicker
          label="Basic example"
          value={selectedDate}
          onChange={handleDateChange}
          animateYearScrolling
        /> */}
      </Grid>
    </MuiPickersUtilsProvider>
  );
}
