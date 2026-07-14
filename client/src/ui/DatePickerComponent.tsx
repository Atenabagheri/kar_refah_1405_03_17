import DatePicker, { DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import React, { useEffect, useImperativeHandle, useState } from "react";

//gregorian calendar & locale
import gregorian from "react-date-object/calendars/gregorian";
import gregorian_fa from "react-date-object/locales/gregorian_fa";

function toEnglishNumber(number: number | string) {
  let str: string = number?.toString();

  str = str?.replace(/۰/g, "0");
  str = str?.replace(/۱/g, "1");
  str = str?.replace(/۲/g, "2");
  str = str?.replace(/۳/g, "3");
  str = str?.replace(/۴/g, "4");
  str = str?.replace(/۵/g, "5");
  str = str?.replace(/۶/g, "6");
  str = str?.replace(/۷/g, "7");
  str = str?.replace(/۸/g, "8");
  str = str?.replace(/۹/g, "9");

  return str;
}

export interface ChildRef {
  triggerFunction: () => void;
}

const DatePickerComponent = ({
  setDate,
  dateRef,
}: {
  setDate: React.Dispatch<React.SetStateAction<string | null>>;
  dateRef: React.RefObject<ChildRef | null>;
}) => {
  const [state, setState] = useState<{
    gregorian?: string;
    persian?: string;
    jsDate?: string;
    date?: DateObject | null;
    format?: string;
  }>({
    format: "YYYY/MM/DD",
  });

  // تغییر تایپ پارامتر date به DateObject | null
  const convert = (date: DateObject | null) => {
    if (!date) {
      setState({ format: state.format });
      return;
    }

    const object = { 
      date, 
      format: state.format 
    };

    setState({
      gregorian: new DateObject(object)
        .convert(gregorian, gregorian_fa)
        .format(),
      persian: new DateObject(object).format(),
      jsDate: date.toDate?.()?.toString() || date.toString(),
      date: date,
      format: state.format,
    });
  };

  useEffect(() => {
    if (state && state?.gregorian) {
      setDate(toEnglishNumber(state.gregorian).replaceAll("/", "-"));
    }
  }, [state, setDate]);

  const triggerFunction = () => {
    setDate(null);
    setState({ format: "YYYY/MM/DD" });
  };

  useImperativeHandle(dateRef, () => ({
    triggerFunction,
  }));

  return (
    <DatePicker
      containerClassName="w-full"
      onlyShowInRangeDates
      editable={false}
      value={state?.date}
      onChange={convert}
      calendar={persian}
      locale={persian_fa}
      calendarPosition="bottom-right"
      format="YYYY/MM/DD"
      placeholder="انتخاب کنید"
      inputClass="w-full bg-white border border-dark/30 !p-1.5 text-sm rounded-md"
    />
  );
};

export default DatePickerComponent;