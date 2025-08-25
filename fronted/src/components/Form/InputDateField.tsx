import React, {
    memo,
    useState,
    useEffect,
    ChangeEvent,
    FocusEvent,
} from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { getYear, getMonth } from "date-fns";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";


// ---------- Utility helpers ----------
const range = (start: number, end: number): number[] => {
    const length = end - start + 1;
    return Array.from({ length }, (_, i) => start + i);
};

const formatDate = (date: Date | null): string => {
    if (!date || isNaN(date.getTime())) return "";
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
};

const parseDateString = (dateString?: string): Date | null => {
    if (!dateString) return null;
    const [day, month, year] = dateString.split("/").map(Number);
    if (!day || !month || !year) return null;
    return new Date(year, month - 1, day);
};

// ---------- Props ----------
interface InputDateFieldProps {
    label: string;
    name: string;
    inputValue?: string; // "dd/MM/yyyy" format
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
    onBlur?: (e: FocusEvent<HTMLInputElement>) => void;
    error?: string;
    required?: boolean;
    isDefault?: boolean;
    minDate?: string;
    maxDate?: string;
    col?: string;
    row1?: string;
    row2?: string;
    isLoadingSearch?: boolean;
}

// ---------- Component ----------
const InputDateField: React.FC<InputDateFieldProps> = memo(
    ({
        label,
        name,
        inputValue,
        onChange,
        onBlur,
        error,
        required = false,
        isDefault = false,
        minDate,
        maxDate,
        col = "col-md-3",
        row1 = "col-sm-5 col-4",
        row2 = "col-sm-7 col-8",
        isLoadingSearch = false,
    }) => {
        console.log('error', error)
        // 🔹 Use passed value or fallback to today
        const initialDate = inputValue ? parseDateString(inputValue) : new Date();
        const [startDate, setStartDate] = useState<Date | null>(initialDate);

        useEffect(() => {
            setStartDate(inputValue ? parseDateString(inputValue) : new Date());
        }, [inputValue]);

        const years = range(1990, getYear(new Date()) + 5);
        const months = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
        ];

        const handleDateChange = (date: Date | null) => {
            setStartDate(date);
            const formattedDate = date ? formatDate(date) : "";

            if (onChange) {
                const syntheticEvent = {
                    target: { name, value: formattedDate },
                } as unknown as ChangeEvent<HTMLInputElement>;
                onChange(syntheticEvent);
            }
        };

        return (

            <div className={`${col} mt-3`}>
  <div className="form-group">
    
    {/* Label row */}
    <label
      htmlFor={name}
      className="form-label fw-semibold d-block"
      style={{ fontSize: "14px" }}
    >
      {label} {required && <span className="text-danger">*</span>}
    </label>

    {/* Input should take full width */}
    <DatePicker
      id={name}
      className={`form-control w-100 ${error ? "is-invalid" : ""}`}
      renderCustomHeader={({
        date,
        changeYear,
        changeMonth,
        decreaseMonth,
        increaseMonth,
      }) => (
        <div
          style={{
            margin: 10,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <FontAwesomeIcon
            onClick={decreaseMonth}
            className="me-2 cursor-pointer"
            icon={faChevronLeft}
          />
          <select
            value={getYear(date)}
            onChange={({ target: { value } }) => changeYear(Number(value))}
            style={{ margin: "0 10px" }}
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>

          <select
            value={months[getMonth(date)]}
            onChange={({ target: { value } }) =>
              changeMonth(months.indexOf(value))
            }
            style={{ margin: "0 10px" }}
          >
            {months.map((month, index) => (
              <option key={index} value={month}>
                {month}
              </option>
            ))}
          </select>
          <FontAwesomeIcon
            onClick={increaseMonth}
            className="ms-2 cursor-pointer"
            icon={faChevronRight}
          />
        </div>
      )}
      selected={startDate}
      onChange={handleDateChange}
      dateFormat="dd/MM/yyyy"
      placeholderText="DD/MM/YYYY"
      disabled={isDefault}
      minDate={minDate ? parseDateString(minDate) : undefined}
      maxDate={maxDate ? parseDateString(maxDate) : undefined}
      onBlur={onBlur}
    />

    {/* Error message */}
    {error && (
      <span className="text-danger" style={{ fontSize: "11px" }}>
        {error}
      </span>
    )}
  </div>
</div>



        );
    }
);

// ---------- Memo comparison ----------
const areEqual = (
    prevProps: InputDateFieldProps,
    nextProps: InputDateFieldProps
) => {
    return (
        prevProps.name === nextProps.name &&
        prevProps.error === nextProps.error &&
        prevProps.inputValue === nextProps.inputValue
    );
};

export default memo(InputDateField, areEqual);
